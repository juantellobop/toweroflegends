import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PORT = 8092;
const BASE = `http://127.0.0.1:${PORT}`;
const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tdl-ranking-'));
const rankingFile = path.join(tempDir, 'ranking.json');
const statsFile = path.join(tempDir, 'stats.json');
const TEAM_SUFFIXES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function waitForServer(url, timeout = 8000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    function tick() {
      const req = http.get(url, (res) => {
        res.resume();
        resolve();
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) reject(new Error(`Server did not start: ${url}`));
        else setTimeout(tick, 120);
      });
      req.setTimeout(800, () => req.destroy());
    }
    tick();
  });
}

async function request(pathname, options = {}) {
  const res = await fetch(`${BASE}${pathname}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });
  assert.ok(res.ok, `${options.method || 'GET'} ${pathname} failed: ${res.status}`);
  return res.json();
}

const server = spawn('node', ['tools/admin_server.mjs', String(PORT)], {
  cwd: ROOT,
  env: { ...process.env, RANKING_FILE: rankingFile, STATS_FILE: statsFile },
  stdio: 'ignore',
});

try {
  await waitForServer(`${BASE}/`);
  const empty = await request('/api/ranking');
  assert.deepEqual(empty.entries, []);

  for (let i = 1; i <= 25; i++) {
    await request('/api/ranking', {
      method: 'POST',
      body: JSON.stringify({
        teamName: `Equipo ${TEAM_SUFFIXES[i - 1]}`,
        nation: i % 2 ? 'River Plate' : 'Boca',
        floor: i,
      }),
    });
  }

  const ranking = await request('/api/ranking');
  assert.equal(ranking.entries.length, 20);
  assert.equal(ranking.entries[0].teamName, 'Equipo Y');
  assert.equal(ranking.entries[0].floor, 25);
  assert.equal(ranking.entries.at(-1).floor, 6);

  const injected = await request('/api/ranking', {
    method: 'POST',
    body: JSON.stringify({
      teamName: '<img src=x onerror=alert(1)>',
      nation: 'River Plate',
      floor: 99,
    }),
  });
  assert.equal(injected.entries[0].floor, 99);
  assert.match(injected.entries[0].teamName, /^[\p{L} ]+$/u);
  assert.doesNotMatch(injected.entries[0].teamName, /[<>"'=()/]/);

  // Once del último partido: se guarda saneado (formación conocida, máx. 11,
  // posiciones válidas, OVR acotado, sin caracteres de marcado en nombres).
  const withLineup = await request('/api/ranking', {
    method: 'POST',
    body: JSON.stringify({
      teamName: 'Equipo Once',
      nation: 'River Plate',
      floor: 120,
      formation: '4-3-3',
      lineup: [
        { name: 'Portero Uno', position: 'GK', line: 'GK', ovr: 88, rarity: 'legend' },
        { name: '<img src=x onerror=alert(1)>Hack', position: 'DEF', ovr: 9000, rarity: 'inventada' },
        { name: 'Posición Mala', position: 'XX', ovr: 70 },
        ...Array.from({ length: 12 }, (_, i) => ({ name: `Relleno ${TEAM_SUFFIXES[i]}`, position: 'MID', ovr: 60 + i })),
      ],
    }),
  });
  const savedLineup = withLineup.entries[0];
  assert.equal(savedLineup.formation, '4-3-3');
  assert.ok(Array.isArray(savedLineup.lineup) && savedLineup.lineup.length <= 11);
  assert.equal(savedLineup.lineup[0].name, 'Portero Uno');
  assert.equal(savedLineup.lineup[0].rarity, 'legend');
  assert.doesNotMatch(savedLineup.lineup[1].name, /[<>"'=()/]/);
  assert.ok(savedLineup.lineup[1].ovr <= 199);
  assert.equal(savedLineup.lineup[1].rarity, '');
  assert.ok(savedLineup.lineup.every((p) => ['GK', 'DEF', 'MID', 'FWD'].includes(p.position)));

  // Formación desconocida o once vacío: la entrada se guarda sin esos campos.
  const bare = await request('/api/ranking', {
    method: 'POST',
    body: JSON.stringify({ teamName: 'Equipo Pelado', nation: 'Boca', floor: 110, formation: '9-9-9', lineup: [] }),
  });
  assert.equal(bare.entries[1].teamName, 'Equipo Pelado');
  assert.equal(bare.entries[1].formation, undefined);
  assert.equal(bare.entries[1].lineup, undefined);

  const persisted = JSON.parse(await fs.readFile(rankingFile, 'utf8'));
  assert.equal(persisted.entries.length, 20);
  assert.equal(persisted.entries[0].floor, 120);
  assert.equal(persisted.entries[0].lineup.length, savedLineup.lineup.length);

  console.log('Ranking persistente: OK');

  // === Comunidad en vivo (/api/comunidad): partidas totales y presencia ===
  const statsEmpty = await request('/api/comunidad');
  assert.equal(statsEmpty.totalGames, 0);
  assert.equal(statsEmpty.online, 0);

  // Dos runs nuevas suman al contador persistido.
  await request('/api/comunidad/partida', { method: 'POST', body: '{}' });
  const afterGames = await request('/api/comunidad/partida', { method: 'POST', body: '{}' });
  assert.equal(afterGames.totalGames, 2);
  const persistedStats = JSON.parse(await fs.readFile(statsFile, 'utf8'));
  assert.equal(persistedStats.totalGames, 2);

  // Dos clientes laten → 2 en vivo; el mismo id repetido no duplica.
  await request('/api/comunidad/latido', { method: 'POST', body: JSON.stringify({ id: 'cliente-a' }) });
  await request('/api/comunidad/latido', { method: 'POST', body: JSON.stringify({ id: 'cliente-a' }) });
  const twoOnline = await request('/api/comunidad/latido', { method: 'POST', body: JSON.stringify({ id: 'cliente-b' }) });
  assert.equal(twoOnline.online, 2);
  const statsLive = await request('/api/comunidad');
  assert.equal(statsLive.totalGames, 2);
  assert.equal(statsLive.online, 2);

  // Un latido sin id no cuenta como jugador.
  const noId = await request('/api/comunidad/latido', { method: 'POST', body: '{}' });
  assert.equal(noId.online, 2);

  // Alias legados (/api/stats*): clientes con el módulo viejo cacheado.
  const legacy = await request('/api/stats');
  assert.equal(legacy.totalGames, 2);
  const legacyBeat = await request('/api/stats/heartbeat', { method: 'POST', body: JSON.stringify({ id: 'cliente-viejo' }) });
  assert.equal(legacyBeat.online, 3);

  console.log('Comunidad en vivo: OK');
} finally {
  server.kill();
  await fs.rm(tempDir, { recursive: true, force: true });
}
