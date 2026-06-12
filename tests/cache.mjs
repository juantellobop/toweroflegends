import assert from 'node:assert/strict';
import http from 'node:http';
import { BUILD_VERSION, handleRequest } from '../tools/admin_server.mjs';

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
  const index = await request(port, '/');
  assert.equal(index.status, 200);
  assert.equal(index.headers['cache-control'], 'no-store, max-age=0');
  assert.equal(index.headers['x-app-version'], BUILD_VERSION);
  assert.match(index.body, new RegExp(`design/tokens\\.css\\?v=${BUILD_VERSION}`));
  assert.match(index.body, new RegExp(`styles\\.css\\?v=${BUILD_VERSION}`));
  assert.match(index.body, new RegExp(`main\\.js\\?v=${BUILD_VERSION}`));
  assert.match(index.body, new RegExp(`assets/favicon\\.png\\?v=${BUILD_VERSION}`));

  const versionedFavicon = await request(port, `/assets/favicon.png?v=${BUILD_VERSION}`);
  assert.equal(versionedFavicon.status, 200);
  assert.equal(versionedFavicon.headers['cache-control'], 'public, max-age=31536000, immutable');

  const versionedCss = await request(port, `/styles.css?v=${BUILD_VERSION}`);
  assert.equal(versionedCss.status, 200);
  assert.equal(versionedCss.headers['cache-control'], 'public, max-age=31536000, immutable');
  assert.ok(versionedCss.headers.etag);
  assert.match(versionedCss.body, new RegExp(`assets/ui/background\\.jpg\\?v=${BUILD_VERSION}`));

  const versionedMain = await request(port, `/main.js?v=${BUILD_VERSION}`);
  assert.equal(versionedMain.status, 200);
  assert.equal(versionedMain.headers['cache-control'], 'public, max-age=31536000, immutable');
  assert.match(versionedMain.body, new RegExp(`\\./ui/buildScreen\\.js\\?v=${BUILD_VERSION}`));

  const versionedModule = await request(port, `/ui/buildScreen.js?v=${BUILD_VERSION}`);
  assert.equal(versionedModule.status, 200);
  assert.equal(versionedModule.headers['cache-control'], 'public, max-age=31536000, immutable');
  assert.match(versionedModule.body, new RegExp(`\\.\\./data/playerAssets\\.js\\?v=${BUILD_VERSION}`));

  const moduleResponse = await request(port, '/ui/buildScreen.js');
  assert.equal(moduleResponse.status, 200);
  assert.equal(moduleResponse.headers['cache-control'], 'no-cache, must-revalidate');
  assert.ok(moduleResponse.headers.etag);

  const revalidated = await request(port, '/ui/buildScreen.js', {
    'If-None-Match': moduleResponse.headers.etag,
  });
  assert.equal(revalidated.status, 304);
  assert.equal(revalidated.body, '');

  const portrait = await request(port, '/assets/player-portraits/base_def_vidal.png');
  assert.equal(portrait.status, 200);
  assert.equal(portrait.headers['cache-control'], 'public, max-age=604800, stale-while-revalidate=2592000');
  assert.ok(portrait.headers.etag);

  const versionedImage = await request(port, `/assets/ui/background.jpg?v=${BUILD_VERSION}`);
  assert.equal(versionedImage.status, 200);
  assert.equal(versionedImage.headers['cache-control'], 'public, max-age=31536000, immutable');

  console.log(`Cache busting: OK (${BUILD_VERSION})`);
} finally {
  await new Promise((resolve) => server.close(resolve));
}
