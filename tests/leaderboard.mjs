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
  env: { ...process.env, RANKING_FILE: rankingFile },
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

  const persisted = JSON.parse(await fs.readFile(rankingFile, 'utf8'));
  assert.equal(persisted.entries.length, 20);
  assert.equal(persisted.entries[0].floor, 99);

  console.log('Ranking persistente: OK');
} finally {
  server.kill();
  await fs.rm(tempDir, { recursive: true, force: true });
}
