#!/usr/bin/env node
import { execFileSync, spawn } from 'node:child_process';
import crypto from 'node:crypto';
import { createReadStream, readdirSync, readFileSync, statSync } from 'node:fs';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FORMATIONS, LINES, RARITIES } from '../data/config.js';
import { playerOVR } from '../engine/ovr.js';
import { sanitizeTeamName } from '../data/teamName.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const MAX_BODY = 18 * 1024 * 1024;
const RANKING_FILE = path.resolve(process.env.RANKING_FILE || path.join(ROOT, 'data', 'ranking.json'));
const RANKING_LIMIT = 20;
const STATS_FILE = path.resolve(process.env.STATS_FILE || path.join(ROOT, 'data', 'stats.json'));
// Presencia en memoria: clientId → último latido. Un cliente cuenta como "en
// vivo" si latió dentro del TTL (el front late cada 25s). El tope de entradas
// evita que ids basura inflen el mapa sin límite.
const PRESENCE_TTL_MS = 60_000;
const PRESENCE_MAX = 5000;
const presence = new Map();
const PLAYER_DB_FILE = path.resolve(process.env.PLAYER_DB_FILE || path.join(ROOT, 'data', 'players.js'));
const PLAYER_PORTRAITS_DIR = path.join(ROOT, 'assets', 'player-portraits');
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(18).toString('base64url');
const USING_EPHEMERAL_ADMIN_PASSWORD = !process.env.ADMIN_PASSWORD;
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const adminSessions = new Map(); // token -> expiresAt (ms)
const FIELD_STAT_KEYS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
const GK_STAT_KEYS = ['reflexes', 'handling', 'positioning'];
const TACTICAL_TYPES = ['posesion', 'presion', 'contra'];
const POSITIONS = new Set(LINES);
const RARITY_SET = new Set(RARITIES);
const INDEX_FILE = path.join(ROOT, 'index.html');
const SOURCE_VERSION_PATHS = [
  'index.html',
  'main.js',
  'styles.css',
  'assets/flags',
  'assets/ui',
  'design',
  'data',
  'engine',
  'match',
  'scenes',
  'state',
  'ui',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico']);

function normalizedVersion(value) {
  return String(value || '').trim().replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 40);
}

function hashSourcePath(hash, absolutePath, relativePath) {
  const stat = statSync(absolutePath);
  if (stat.isDirectory()) {
    for (const entry of readdirSync(absolutePath).sort()) {
      hashSourcePath(hash, path.join(absolutePath, entry), path.join(relativePath, entry));
    }
    return;
  }
  if (!stat.isFile()) return;
  hash.update(relativePath);
  hash.update(readFileSync(absolutePath));
}

function sourceHashVersion() {
  const hash = crypto.createHash('sha256');
  for (const relativePath of SOURCE_VERSION_PATHS) {
    hashSourcePath(hash, path.join(ROOT, relativePath), relativePath);
  }
  return hash.digest('hex').slice(0, 12);
}

function resolveBuildVersion() {
  const deployVersion = [
    process.env.RENDER_GIT_COMMIT,
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.RAILWAY_GIT_COMMIT_SHA,
    process.env.HEROKU_SLUG_COMMIT,
    process.env.SOURCE_VERSION,
    process.env.COMMIT_SHA,
    process.env.GITHUB_SHA,
  ].map(normalizedVersion).find(Boolean);
  if (deployVersion) return deployVersion.slice(0, 12);

  try {
    const dirty = execFileSync(
      'git',
      ['status', '--porcelain', '--untracked-files=no'],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim();
    if (dirty) return sourceHashVersion();

    const gitVersion = normalizedVersion(execFileSync(
      'git',
      ['rev-parse', '--short=12', 'HEAD'],
      { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    ));
    if (gitVersion) return gitVersion;
  } catch (_) {
    // Production images often omit .git; the source hash below is deterministic.
  }

  return sourceHashVersion();
}

export const BUILD_VERSION = resolveBuildVersion();

function versionedIndexHtml(source) {
  return source.replace(
    /\b(href|src)="(design\/tokens\.css|styles\.css|main\.js)(?:\?[^"]*)?"/g,
    (_, attribute, asset) => `${attribute}="${asset}?v=${BUILD_VERSION}"`
  );
}

function withBuildVersion(resource) {
  if (!resource || /^(?:data:|https?:|#)/i.test(resource)) return resource;
  const separator = resource.includes('?') ? '&' : '?';
  return `${resource}${separator}v=${BUILD_VERSION}`;
}

function versionedJavaScript(source) {
  const rewrite = (_, prefix, quote, specifier) =>
    `${prefix}${quote}${withBuildVersion(specifier)}${quote}`;

  return source
    .replace(
      /(\b(?:import|export)\s+[^;]*?\sfrom\s*)(['"])(\.{1,2}\/[^'"]+)\2/g,
      rewrite
    )
    .replace(
      /(\bimport\s*)(['"])(\.{1,2}\/[^'"]+)\2/g,
      rewrite
    )
    .replace(
      /(\bimport\s*\(\s*)(['"])(\.{1,2}\/[^'"]+)\2/g,
      rewrite
    )
    .replace(
      /(['"])((?:assets|scenes)\/[^'"`\s)]+\.(?:ico|jpe?g|png|svg|webp)(?:\?[^'"]*)?)\1/gi,
      (_, quote, asset) => `${quote}${withBuildVersion(asset)}${quote}`
    );
}

function versionedCss(source) {
  return source.replace(
    /url\(\s*(['"]?)(?!data:|https?:|#)([^'")]+)\1\s*\)/gi,
    (_, quote, asset) => `url(${quote}${withBuildVersion(asset.trim())}${quote})`
  );
}

function cacheControlFor(filePath, url) {
  if (filePath === INDEX_FILE || path.extname(filePath).toLowerCase() === '.html') {
    return 'no-store, max-age=0';
  }

  if (url.searchParams.get('v') === BUILD_VERSION) {
    return 'public, max-age=31536000, immutable';
  }

  if (IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())) {
    return 'public, max-age=604800, stale-while-revalidate=2592000';
  }

  // ES module imports and CSS-referenced assets keep stable paths, so every
  // refresh must revalidate them even when the entry file has a build version.
  return 'no-cache, must-revalidate';
}

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    ...securityHeaders(),
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function securityHeaders(extra = {}) {
  return {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'X-Frame-Options': 'DENY',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "connect-src 'self'",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
    ...extra,
  };
}

function methodNotAllowed(res) {
  res.writeHead(405, securityHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }));
  res.end('Method not allowed');
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('La imagen es demasiado grande para el conversor local.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function parseDataUrl(dataUrl) {
  const match = /^data:(image\/(?:png|jpeg|jpg|webp));base64,([a-z0-9+/=\s]+)$/i.exec(String(dataUrl || ''));
  if (!match) throw new Error('La imagen subida no tiene un formato válido.');
  const mime = match[1].toLowerCase().replace('image/jpg', 'image/jpeg');
  const ext = mime === 'image/png' ? '.png' : mime === 'image/webp' ? '.webp' : '.jpg';
  return { ext, buffer: Buffer.from(match[2].replace(/\s/g, ''), 'base64') };
}

function clampText(value, max) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, max);
}

// Once del último partido de la run: solo nombres del roster, posiciones/líneas
// conocidas y números acotados. Devuelve null si no hay nada utilizable.
function sanitizeRankingLineup(raw) {
  if (!Array.isArray(raw)) return null;
  const players = raw.slice(0, 11).map((player) => {
    const name = clampText(player?.name, 60).replace(/[<>"'`=\\/()[\]{}]/g, '').trim();
    if (!name || !POSITIONS.has(player?.position)) return null;
    const line = POSITIONS.has(player?.line) ? player.line : player.position;
    const ovr = Math.max(0, Math.min(199, Math.round(Number(player?.ovr) || 0)));
    const rarity = RARITY_SET.has(player?.rarity) ? player.rarity : '';
    return { name, position: player.position, line, ovr, rarity };
  }).filter(Boolean);
  return players.length ? players : null;
}

function sanitizeRankingEntry(raw) {
  const floor = Math.max(0, Math.floor(Number(raw?.floor) || 0));
  const teamName = sanitizeTeamName(raw?.teamName);
  const nation = clampText(raw?.nation, 48);
  const createdAt = Number.isFinite(Date.parse(raw?.createdAt)) ? new Date(raw.createdAt).toISOString() : new Date().toISOString();
  const id = clampText(raw?.id, 80) || crypto.randomUUID();
  const entry = { id, teamName, nation, floor, createdAt };
  // Equipo del último partido (opcional): formación conocida + once saneado.
  if (FORMATIONS[raw?.formation]) entry.formation = raw.formation;
  const lineup = sanitizeRankingLineup(raw?.lineup);
  if (lineup) entry.lineup = lineup;
  return entry;
}

function sortRanking(entries) {
  return entries
    .slice()
    .sort((a, b) => b.floor - a.floor || Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.teamName.localeCompare(b.teamName));
}

async function readRankingFile() {
  try {
    const raw = await fs.readFile(RANKING_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    const rawEntries = Array.isArray(parsed) ? parsed : parsed.entries;
    const entries = Array.isArray(rawEntries) ? rawEntries.map(sanitizeRankingEntry) : [];
    return sortRanking(entries).slice(0, RANKING_LIMIT);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeRankingFile(entries) {
  await fs.mkdir(path.dirname(RANKING_FILE), { recursive: true });
  await fs.writeFile(RANKING_FILE, `${JSON.stringify({ entries }, null, 2)}\n`, 'utf8');
}

function playerDatabaseSource(players) {
  return `// Torre de Leyendas — Base directa de jugadores.
// Este archivo es la fuente de verdad del roster jugable. El panel admin lo
// reescribe directamente cuando se guardan estadisticas o metadatos.
// Retratos: assets/player-portraits/{id}.png.

export const PLAYERS = ${JSON.stringify(players, null, 2)};
`;
}

async function readPlayerDatabase() {
  const raw = await fs.readFile(PLAYER_DB_FILE, 'utf8');
  const match = /export\s+const\s+PLAYERS\s*=\s*(\[[\s\S]*\]);?\s*$/.exec(raw);
  if (!match) throw new Error('No se pudo leer data/players.js como base directa.');
  const players = JSON.parse(match[1]);
  if (!Array.isArray(players)) throw new Error('data/players.js no contiene un array de jugadores.');
  return players;
}

async function writePlayerDatabase(players) {
  const tmp = `${PLAYER_DB_FILE}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, playerDatabaseSource(players), 'utf8');
  await fs.rename(tmp, PLAYER_DB_FILE);
}

function clampStat(value, fallback = 50) {
  const n = Number(value);
  if (!Number.isFinite(n)) return clampStat(fallback, 50);
  return Math.max(1, Math.min(99, Math.round(n)));
}

function cleanText(value, fallback, max = 72) {
  const text = String(value ?? '').trim();
  return (text || fallback || '').slice(0, max);
}

function cleanNullableText(value, max = 48) {
  const text = String(value ?? '').trim();
  return text ? text.slice(0, max) : null;
}

function cloneGroup(group, keys) {
  if (!group || typeof group !== 'object') return null;
  const out = {};
  for (const key of keys) out[key] = clampStat(group[key]);
  return out;
}

function defaultFieldStats(base, ovr) {
  if (base?.stats) return cloneGroup(base.stats, FIELD_STAT_KEYS);
  return Object.fromEntries(FIELD_STAT_KEYS.map((key) => [key, clampStat(ovr, 60)]));
}

function defaultGkStats(base, ovr) {
  if (base?.gk) return cloneGroup(base.gk, GK_STAT_KEYS);
  return Object.fromEntries(GK_STAT_KEYS.map((key) => [key, clampStat(ovr, 60)]));
}

function normalizeDbPlayer(player) {
  const isGK = player.position === 'GK';
  return {
    id: player.id,
    name: player.name,
    nation: player.nation,
    era: String(player.era ?? ''),
    position: player.position,
    rarity: player.rarity,
    ovr: playerOVR(player),
    stats: isGK ? null : { ...player.stats },
    gk: isGK ? { ...player.gk } : null,
    trait: player.trait ?? null,
    tacticalType: player.tacticalType ?? null,
  };
}

function sanitizePlayerDraft(draft, base = {}) {
  if (!draft || typeof draft !== 'object') throw new Error('Jugador inválido.');
  const position = POSITIONS.has(draft.position) ? draft.position : (base.position || 'MID');
  const rarity = RARITY_SET.has(draft.rarity) ? draft.rarity : (base.rarity || 'common');
  const fallbackOVR = clampStat(draft.ovr ?? base.ovr ?? 60);
  const isGK = position === 'GK';
  const portraitDataUrl = typeof draft.portraitDataUrl === 'string' && draft.portraitDataUrl.startsWith('data:image/')
    ? draft.portraitDataUrl
    : null;

  const clean = {
    id: base.id || draft.id,
    name: cleanText(draft.name, base.name || 'Jugador'),
    nation: cleanText(draft.nation, base.nation || 'Leyendas', 48),
    era: cleanText(draft.era, base.era || 'Actual', 24),
    position,
    rarity,
    ovr: fallbackOVR,
    stats: isGK ? null : cloneGroup(draft.stats, FIELD_STAT_KEYS) || defaultFieldStats(base, fallbackOVR),
    gk: isGK ? cloneGroup(draft.gk, GK_STAT_KEYS) || defaultGkStats(base, fallbackOVR) : null,
    trait: cleanNullableText(draft.trait),
    tacticalType: TACTICAL_TYPES.includes(draft.tacticalType) ? draft.tacticalType : null,
    portraitDataUrl,
  };
  clean.ovr = playerOVR(clean);
  return clean;
}

async function replacePlayerPortrait(playerId, dataUrl) {
  if (!dataUrl) return false;
  const { ext, buffer } = parseDataUrl(dataUrl);
  if (ext !== '.png') throw new Error('El retrato debe llegar convertido a PNG.');
  await fs.mkdir(PLAYER_PORTRAITS_DIR, { recursive: true });
  await fs.writeFile(path.join(PLAYER_PORTRAITS_DIR, `${playerId}.png`), buffer);
  return true;
}

function safeEqual(a, b) {
  const bufA = Buffer.from(String(a ?? ''), 'utf8');
  const bufB = Buffer.from(String(b ?? ''), 'utf8');
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA); // mantener el coste constante
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function isAuthorized(req) {
  const header = req.headers.authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  if (!match) return false;
  const token = match[1].trim();
  const expiresAt = adminSessions.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    adminSessions.delete(token);
    return false;
  }
  return true;
}

function requireAdmin(req, res) {
  if (isAuthorized(req)) return true;
  json(res, 401, { error: 'No autorizado. Inicia sesión en el panel de administración.' });
  return false;
}

async function handleAdminLogin(req, res) {
  try {
    if (req.method !== 'POST') {
      methodNotAllowed(res);
      return;
    }
    const payload = JSON.parse(await readBody(req));
    const userOk = safeEqual(payload?.user, ADMIN_USER);
    const passOk = safeEqual(payload?.password, ADMIN_PASSWORD);
    if (!(userOk && passOk)) {
      json(res, 401, { error: 'Usuario o contraseña incorrectos.' });
      return;
    }
    const token = crypto.randomBytes(32).toString('hex');
    adminSessions.set(token, Date.now() + ADMIN_SESSION_TTL_MS);
    json(res, 200, { token, expiresIn: ADMIN_SESSION_TTL_MS });
  } catch (error) {
    json(res, 400, { error: error.message || String(error) });
  }
}

async function handleRanking(req, res) {
  try {
    if (req.method === 'GET') {
      json(res, 200, { entries: await readRankingFile(), limit: RANKING_LIMIT });
      return;
    }

    if (req.method === 'POST') {
      const payload = JSON.parse(await readBody(req));
      const entry = sanitizeRankingEntry(payload);
      const entries = sortRanking([entry, ...await readRankingFile()]).slice(0, RANKING_LIMIT);
      await writeRankingFile(entries);
      const rank = entries.findIndex((item) => item.id === entry.id);
      json(res, 200, {
        entries,
        entryId: entry.id,
        rank: rank >= 0 ? rank + 1 : null,
        limit: RANKING_LIMIT,
      });
      return;
    }

    methodNotAllowed(res);
  } catch (error) {
    json(res, 500, { error: error.message || String(error) });
  }
}

// === Estadísticas en vivo (contadores del pie del menú) ===

let statsCache = null; // { totalGames } leído una vez; las escrituras lo mantienen.

async function readStatsFile() {
  if (statsCache) return statsCache;
  try {
    const parsed = JSON.parse(await fs.readFile(STATS_FILE, 'utf8'));
    statsCache = { totalGames: Math.max(0, Math.floor(Number(parsed?.totalGames) || 0)) };
  } catch (_) {
    // Sin archivo (o corrupto): se arranca de cero y la primera partida lo crea.
    statsCache = { totalGames: 0 };
  }
  return statsCache;
}

async function writeStatsFile() {
  await fs.mkdir(path.dirname(STATS_FILE), { recursive: true });
  await fs.writeFile(STATS_FILE, `${JSON.stringify(statsCache, null, 2)}\n`, 'utf8');
}

function onlineCount() {
  const cutoff = Date.now() - PRESENCE_TTL_MS;
  for (const [id, lastSeen] of presence) {
    if (lastSeen < cutoff) presence.delete(id);
  }
  return presence.size;
}

async function handleStats(req, res) {
  try {
    const pathname = (req.url || '').split('?')[0];

    if (req.method === 'GET' && pathname === '/api/stats') {
      const stats = await readStatsFile();
      json(res, 200, { totalGames: stats.totalGames, online: onlineCount() });
      return;
    }

    // Latido de presencia: registra/refresca al cliente y devuelve el recuento.
    if (req.method === 'POST' && pathname === '/api/stats/heartbeat') {
      const payload = JSON.parse(await readBody(req) || '{}');
      const id = clampText(payload?.id, 64);
      if (id && (presence.size < PRESENCE_MAX || presence.has(id))) {
        presence.set(id, Date.now());
      }
      json(res, 200, { online: onlineCount() });
      return;
    }

    // Una run nueva arrancó: suma al contador global persistido.
    if (req.method === 'POST' && pathname === '/api/stats/game') {
      const stats = await readStatsFile();
      stats.totalGames += 1;
      await writeStatsFile();
      json(res, 200, { totalGames: stats.totalGames });
      return;
    }

    methodNotAllowed(res);
  } catch (error) {
    json(res, 500, { error: error.message || String(error) });
  }
}

async function handleAdminPlayer(req, res) {
  try {
    if (!requireAdmin(req, res)) return;
    if (req.method === 'GET') {
      json(res, 200, {
        players: await readPlayerDatabase(),
        file: path.relative(ROOT, PLAYER_DB_FILE),
      });
      return;
    }

    if (req.method === 'PUT' || req.method === 'POST') {
      const payload = JSON.parse(await readBody(req));
      const players = await readPlayerDatabase();
      const draft = payload?.player;
      const idx = players.findIndex((player) => player.id === draft?.id);
      if (idx < 0) throw new Error(`Jugador no encontrado: ${draft?.id || ''}`);

      const clean = sanitizePlayerDraft(draft, players[idx]);
      await replacePlayerPortrait(clean.id, clean.portraitDataUrl);
      delete clean.portraitDataUrl;

      const saved = normalizeDbPlayer(clean);
      players[idx] = saved;
      await writePlayerDatabase(players);
      json(res, 200, {
        player: saved,
        file: path.relative(ROOT, PLAYER_DB_FILE),
        portrait: `assets/player-portraits/${saved.id}.png`,
      });
      return;
    }

    methodNotAllowed(res);
  } catch (error) {
    json(res, 500, { error: error.message || String(error) });
  }
}

function runPythonConvert(input, output, playerId, playerName) {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', [
      path.join(ROOT, 'tools', 'convert_admin_portrait.py'),
      '--input', input,
      '--output', output,
      '--player-id', playerId || '',
      '--player-name', playerName || '',
    ], { cwd: ROOT });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error((stderr || stdout || `Python terminó con código ${code}`).trim()));
        return;
      }
      const line = stdout.trim().split(/\n/).filter(Boolean).at(-1);
      try {
        resolve(line ? JSON.parse(line) : {});
      } catch (_) {
        resolve({});
      }
    });
  });
}

async function handlePortrait(req, res) {
  try {
    if (!requireAdmin(req, res)) return;
    const payload = JSON.parse(await readBody(req));
    const { ext, buffer } = parseDataUrl(payload.imageDataUrl);
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tdl-admin-portrait-'));
    const input = path.join(tempDir, `source${ext}`);
    const output = path.join(tempDir, 'portrait.png');
    await fs.writeFile(input, buffer);
    const meta = await runPythonConvert(input, output, payload.playerId, payload.playerName);
    const png = await fs.readFile(output);
    await fs.rm(tempDir, { recursive: true, force: true });
    json(res, 200, {
      portraitDataUrl: `data:image/png;base64,${png.toString('base64')}`,
      ...meta,
    });
  } catch (error) {
    json(res, 500, { error: error.message || String(error) });
  }
}

async function serveStatic(req, res) {
  let url;
  let pathname;
  try {
    url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    pathname = decodeURIComponent(url.pathname);
  } catch (_) {
    res.writeHead(400, securityHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('Bad request');
    return;
  }
  if (pathname === '/') pathname = '/index.html';
  const filePath = path.normalize(path.join(ROOT, pathname));
  if (!filePath.startsWith(ROOT + path.sep) && filePath !== ROOT) {
    res.writeHead(403, securityHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('Forbidden');
    return;
  }
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) throw new Error('not a file');

    if (filePath === INDEX_FILE) {
      const body = versionedIndexHtml(await fs.readFile(filePath, 'utf8'));
      res.writeHead(200, securityHeaders({
        'Content-Type': MIME['.html'],
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': cacheControlFor(filePath, url),
        'X-App-Version': BUILD_VERSION,
      }));
      if (req.method === 'HEAD') res.end();
      else res.end(body);
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const isCurrentVersion = url.searchParams.get('v') === BUILD_VERSION;
    if (isCurrentVersion && ['.css', '.js', '.mjs'].includes(extension)) {
      const source = await fs.readFile(filePath, 'utf8');
      const body = extension === '.css'
        ? versionedCss(source)
        : versionedJavaScript(source);
      res.writeHead(200, securityHeaders({
        'Content-Type': MIME[extension],
        'Content-Length': Buffer.byteLength(body),
        'Cache-Control': cacheControlFor(filePath, url),
        'ETag': `"${BUILD_VERSION}-${stat.size.toString(16)}"`,
        'X-App-Version': BUILD_VERSION,
      }));
      if (req.method === 'HEAD') res.end();
      else res.end(body);
      return;
    }

    const etag = `"${stat.size.toString(16)}-${Math.trunc(stat.mtimeMs).toString(16)}"`;
    const headers = securityHeaders({
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': cacheControlFor(filePath, url),
      'ETag': etag,
      'Last-Modified': stat.mtime.toUTCString(),
      'X-App-Version': BUILD_VERSION,
    });
    if (req.headers['if-none-match'] === etag) {
      delete headers['Content-Length'];
      res.writeHead(304, headers);
      res.end();
      return;
    }
    res.writeHead(200, headers);
    if (req.method === 'HEAD') res.end();
    else createReadStream(filePath).pipe(res);
  } catch (_) {
    res.writeHead(404, securityHeaders({ 'Content-Type': 'text/plain; charset=utf-8' }));
    res.end('Not found');
  }
}

// Dispatcher reutilizable: lo usa tanto el http nativo (local) como Express (producción).
export function handleRequest(req, res) {
  if (req.url?.startsWith('/api/ranking')) {
    handleRanking(req, res);
    return;
  }
  if (req.url?.startsWith('/api/stats')) {
    handleStats(req, res);
    return;
  }
  if (req.url?.startsWith('/api/admin/login')) {
    handleAdminLogin(req, res);
    return;
  }
  if (req.url?.startsWith('/api/admin/player')) {
    handleAdminPlayer(req, res);
    return;
  }
  if (req.method === 'POST' && req.url?.startsWith('/api/admin/portrait')) {
    handlePortrait(req, res);
    return;
  }
  if (req.method === 'GET' || req.method === 'HEAD') {
    serveStatic(req, res);
    return;
  }
  methodNotAllowed(res);
}

// Arranca el servidor http nativo solo al ejecutar este archivo directamente
// (npm run serve, uso local). En producción manda Express vía server.js.
const runningDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (runningDirectly) {
  const server = http.createServer(handleRequest);

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`No se pudo arrancar: 127.0.0.1:${PORT} ya esta en uso. Prueba con: npm run serve -- ${PORT + 1}`);
      process.exit(1);
    }
    console.error(error.message || String(error));
    process.exit(1);
  });

  server.listen(PORT, '127.0.0.1', () => {
    console.log(`Torre de Leyendas admin server: http://127.0.0.1:${PORT}/`);
    console.log(`Versión de assets: ${BUILD_VERSION}`);
    console.log(`Ranking persistente: ${RANKING_FILE}`);
    console.log(`Base directa de jugadores: ${PLAYER_DB_FILE}`);
    console.log('POST /api/admin/portrait usa tools/convert_admin_portrait.py');
    console.log(`Panel admin protegido en #playeredit · usuario: ${ADMIN_USER}`);
    if (USING_EPHEMERAL_ADMIN_PASSWORD) {
      console.warn(`AVISO: ADMIN_PASSWORD no definida. Contraseña admin temporal: ${ADMIN_PASSWORD}`);
    }
  });
}
