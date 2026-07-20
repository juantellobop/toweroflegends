import assert from 'node:assert/strict';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BUILD_VERSION, fileVersion, handleRequest, mediaVersions } from '../tools/admin_server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function request(port, pathname, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: '127.0.0.1', port, path: pathname, headers }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: Buffer.concat(chunks).toString('utf8'),
      }));
    });
    req.on('error', reject);
  });
}

const server = http.createServer(handleRequest);
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});

try {
  const { port } = server.address();
  const media = mediaVersions();
  const faviconHash = fileVersion(path.join(ROOT, 'assets/favicon.png'));
  const backgroundHash = fileVersion(path.join(ROOT, 'assets/ui/background.webp'));
  const preloadHash = fileVersion(path.join(ROOT, 'assets/ui/background-3.webp'));
  const portraitHash = fileVersion(path.join(ROOT, 'assets/player-portraits/base_def_vidal.webp'));
  for (const hash of [media.pv, media.iv, media.fv, faviconHash, backgroundHash, preloadHash, portraitHash]) {
    assert.match(hash, /^[0-9a-f]{12}$/);
  }

  const index = await request(port, '/');
  assert.equal(index.status, 200);
  assert.equal(index.headers['cache-control'], 'no-store, max-age=0');
  assert.equal(index.headers['x-app-version'], BUILD_VERSION);
  assert.match(index.body, new RegExp(`design/tokens\\.css\\?v=${BUILD_VERSION}`));
  assert.match(index.body, new RegExp(`styles\\.css\\?v=${BUILD_VERSION}`));
  assert.match(index.body, new RegExp(`main\\.js\\?v=${BUILD_VERSION}`));
  // Las imágenes del HTML (favicon, preloads) van con el hash de su archivo:
  // sus URLs sobreviven a los deploys que no las tocan.
  assert.ok(index.body.includes(`assets/favicon.png?v=${faviconHash}`));
  assert.ok(index.body.includes(`assets/ui/background-3.webp?v=${preloadHash}`));

  const versionedFavicon = await request(port, `/assets/favicon.png?v=${faviconHash}`);
  assert.equal(versionedFavicon.status, 200);
  assert.equal(versionedFavicon.headers['cache-control'], 'public, max-age=31536000, immutable');

  const versionedCss = await request(port, `/styles.css?v=${BUILD_VERSION}`);
  assert.equal(versionedCss.status, 200);
  assert.equal(versionedCss.headers['cache-control'], 'public, max-age=31536000, immutable');
  assert.ok(versionedCss.headers.etag);
  assert.ok(versionedCss.body.includes(`assets/ui/background.webp?v=${backgroundHash}`));

  const versionedMain = await request(port, `/main.js?v=${BUILD_VERSION}`);
  assert.equal(versionedMain.status, 200);
  assert.equal(versionedMain.headers['cache-control'], 'public, max-age=31536000, immutable');
  assert.match(versionedMain.body, new RegExp(`\\./ui/buildScreen\\.js\\?v=${BUILD_VERSION}`));
  // flags.js recibe la versión del directorio de banderas en su specifier.
  assert.ok(versionedMain.body.includes(`./data/flags.js?v=${BUILD_VERSION}&fv=${media.fv}`));

  const versionedModule = await request(port, `/ui/buildScreen.js?v=${BUILD_VERSION}`);
  assert.equal(versionedModule.status, 200);
  assert.equal(versionedModule.headers['cache-control'], 'public, max-age=31536000, immutable');
  // playerAssets.js recibe las versiones de retratos e items en su specifier.
  assert.ok(versionedModule.body.includes(`../data/playerAssets.js?v=${BUILD_VERSION}&pv=${media.pv}&iv=${media.iv}`));

  const moduleResponse = await request(port, '/ui/buildScreen.js');
  assert.equal(moduleResponse.status, 200);
  assert.equal(moduleResponse.headers['cache-control'], 'no-cache, must-revalidate');
  assert.ok(moduleResponse.headers.etag);

  const revalidated = await request(port, '/ui/buildScreen.js', {
    'If-None-Match': moduleResponse.headers.etag,
  });
  assert.equal(revalidated.status, 304);
  assert.equal(revalidated.body, '');

  const portrait = await request(port, '/assets/player-portraits/base_def_vidal.webp');
  assert.equal(portrait.status, 200);
  assert.equal(portrait.headers['cache-control'], 'public, max-age=604800, stale-while-revalidate=2592000');
  assert.ok(portrait.headers.etag);

  // Immutable con cualquiera de los hashes vigentes: el del directorio (URLs
  // construidas en cliente), el del archivo (referencias estáticas) y el de
  // build (clientes con JS anterior a este esquema, transicional).
  for (const version of [media.pv, portraitHash, BUILD_VERSION]) {
    const versionedPortrait = await request(port, `/assets/player-portraits/base_def_vidal.webp?v=${version}`);
    assert.equal(versionedPortrait.status, 200);
    assert.equal(versionedPortrait.headers['cache-control'], 'public, max-age=31536000, immutable');
  }

  // Una versión desfasada (deploy viejo) degrada al bucket de una semana + SWR.
  const stalePortrait = await request(port, '/assets/player-portraits/base_def_vidal.webp?v=deadbeef0000');
  assert.equal(stalePortrait.status, 200);
  assert.equal(stalePortrait.headers['cache-control'], 'public, max-age=604800, stale-while-revalidate=2592000');

  const versionedFlag = await request(port, `/assets/flags/espana.png?v=${media.fv}`);
  assert.equal(versionedFlag.status, 200);
  assert.equal(versionedFlag.headers['cache-control'], 'public, max-age=31536000, immutable');

  const versionedImage = await request(port, `/assets/ui/background.webp?v=${backgroundHash}`);
  assert.equal(versionedImage.status, 200);
  assert.equal(versionedImage.headers['cache-control'], 'public, max-age=31536000, immutable');

  console.log(`Cache busting: OK (${BUILD_VERSION} · pv=${media.pv} iv=${media.iv} fv=${media.fv})`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
