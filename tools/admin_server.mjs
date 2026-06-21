#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import { createReadStream, existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { FORMATIONS, LINES, PLAYER_RARITIES } from '../data/config.js';
import { playerOVR } from '../engine/ovr.js';
import { sanitizeTeamName } from '../data/teamName.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.argv[2] || process.env.PORT || 8080);
const MAX_BODY = 18 * 1024 * 1024;
const RANKING_FILE = path.resolve(process.env.RANKING_FILE || path.join(ROOT, 'data', 'ranking.json'));
const RANKING_LIMIT = 20;
// Ranking semanal: un JSON por semana ISO (ranking-2026-W25.json) junto al ranking
// histórico. Hereda la carpeta persistente de RANKING_FILE igual que stats.json, así
// que los deploys no lo pisan si RANKING_FILE apunta fuera del árbol reescrito.
const RANKING_WEEKLY_DIR = path.resolve(process.env.RANKING_WEEKLY_DIR || path.join(path.dirname(RANKING_FILE), 'semanal'));
// El contador global de partidas vive por defecto JUNTO al ranking: si
// RANKING_FILE apunta a una carpeta persistente (fuera del directorio que los
// deploys reescriben), stats.json la comparte sin configuración extra.
// STATS_FILE permite separarlo si hiciera falta.
const STATS_FILE = path.resolve(process.env.STATS_FILE || path.join(path.dirname(RANKING_FILE), 'stats.json'));
// Presencia en memoria: clientId → último latido. Un cliente cuenta como "en
// vivo" si latió dentro del TTL (el front late cada 45s; el TTL tolera perder
// un latido). El tope de entradas evita que ids basura inflen el mapa.
const PRESENCE_TTL_MS = 120_000;
const PRESENCE_MAX = 5000;
const presence = new Map();
// POSITIONS/RARITY_SET los usa el saneado del ranking (y, si está, el panel admin).
const POSITIONS = new Set(LINES);
// Incluye las rarezas especiales (corrupto/shiny) para que el editor pueda
// guardar jugadores Corrupto sin que el saneado los degrade a 'common'.
const RARITY_SET = new Set(PLAYER_RARITIES);
const INDEX_FILE = path.join(ROOT, 'index.html');
const SOURCE_VERSION_PATHS = [
  'index.html',
  'main.js',
  'styles.css',
  'assets/favicon.png',
  'assets/flags',
  'assets/player-portraits',
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
// Caché en memoria del CSS/JS ya minificado: clave fichero+mtime+versión, valor
// el Buffer servido. En producción los ficheros son estáticos (se procesan una
// vez por proceso); en local el mtime invalida la entrada al editar. Solo texto
// (~80 módulos): memoria despreciable, sin riesgo de OOM.
const minifiedCache = new Map();

function normalizedVersion(value) {
  return String(value || '').trim().replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 40);
}

function hashSourcePath(hash, absolutePath, relativePath) {
  // El contador global de partidas muta con cada run registrada: incluirlo en
  // el hash cambiaría la versión de assets (y rompería la caché) sin que el
  // código hubiera cambiado.
  if (absolutePath === STATS_FILE) return;
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
  // El favicon también va versionado: los navegadores cachean los iconos con
  // especial insistencia y sin ?v= seguirían mostrando el viejo tras cambiarlo.
  return source.replace(
    /\b(href|src)="(design\/tokens\.css|styles\.css|main\.js|assets\/favicon\.png)(?:\?[^"]*)?"/g,
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

  // El ?v= se inyecta sobre el código aún con espacios (sus regex esperan
  // `import ... from`); los comentarios se eliminan AL FINAL.
  const versioned = source
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
  return stripJsComments(versioned);
}

// --- Minificado del CSS/JS servido -----------------------------------------
// Los fuentes (styles.css, design/tokens.css, *.js) conservan comentarios e
// indentación; el servidor los sirve MINIFICADOS. Minificadores propios (sin
// dependencias en la ruta de request) que respetan cadenas/plantillas/regex
// para no romper data-URIs, calc() ni literales. El resultado se cachea en
// memoria (minifiedCache): cada fichero se procesa una sola vez por proceso.

// CSS: quita comentarios y colapsa los espacios. Conserva intacto el contenido
// de las cadenas y de url(...) (incluidos data-URIs sin comillas), nunca toca
// el espacio antes de ':' (selectores tipo `a :hover`) ni alrededor de
// operadores; solo recorta el espacio junto a los tokens estructurales seguros
// { } ; , y el ';' redundante antes de '}'.
function minifyCss(src) {
  const n = src.length;
  const TRIM = new Set(['{', '}', ';', ',']);
  const isIdent = (ch) => ch !== undefined && /[A-Za-z0-9_-]/.test(ch);
  let out = '';
  let pendingWs = false;
  // Resuelve el espacio pendiente antes de emitir un token verbatim (cadena/url).
  const openSpace = () => {
    if (pendingWs) {
      if (out && !TRIM.has(out[out.length - 1])) out += ' ';
      pendingWs = false;
    }
  };
  let i = 0;
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '*') {       // comentario de bloque -> separador
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      pendingWs = true;
      continue;
    }
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f') {
      pendingWs = true;                          // se resuelve al emitir el siguiente token
      i++;
      continue;
    }
    if (c === '"' || c === "'") {                // cadena -> verbatim
      openSpace();
      const q = c;
      out += c; i++;
      while (i < n) {
        const ch = src[i];
        out += ch;
        if (ch === '\\') { if (i + 1 < n) out += src[++i]; i++; continue; }
        i++;
        if (ch === q) break;
      }
      continue;
    }
    if ((c === 'u' || c === 'U') && /^url\(/i.test(src.slice(i, i + 4)) && !isIdent(out[out.length - 1])) {
      openSpace();                               // url(...) -> verbatim hasta el ')'
      out += src.slice(i, i + 4);
      i += 4;
      let q = null;
      while (i < n) {
        const ch = src[i];
        out += ch;
        if (q) { if (ch === '\\') { if (i + 1 < n) out += src[++i]; } else if (ch === q) q = null; i++; continue; }
        if (ch === '"' || ch === "'") { q = ch; i++; continue; }
        i++;
        if (ch === ')') break;
      }
      continue;
    }
    const prev = out[out.length - 1] || '';      // token de código normal
    if (pendingWs) {
      if (out && !TRIM.has(prev) && !TRIM.has(c)) out += ' ';
      pendingWs = false;
    }
    if (c === '}') { while (out.endsWith(';')) out = out.slice(0, -1); }
    out += c;
    i++;
  }
  return out.trim();
}

const JS_REGEX_KEYWORDS = new Set([
  'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void',
  'throw', 'else', 'do', 'yield', 'await', 'case',
]);
const JS_REGEX_PREV = new Set('(,=:[!&|?{};+-*%^~<>'.split(''));

// JS: además de quitar comentarios, colapsa los espacios SOLO en contexto de
// código. Un run de espacios se sustituye por un único '\n' si contenía algún
// salto de línea, o por un único ' ' si no. Así desaparecen indentación, líneas
// en blanco y comentarios, pero los saltos de línea se conservan donde estaban
// → 100% a salvo de la inserción automática de punto y coma (ASI). El contenido
// de cadenas, plantillas y regex se emite literal (no pasa por el colapso).
function stripJsComments(src) {
  const n = src.length;
  let out = '';
  let prevSig = '';   // último carácter significativo
  let prevWord = '';  // último identificador (para palabras clave antes de regex)
  let pendingWs = false;  // espacio pendiente en contexto código
  let pendingNl = false;  // ese run contenía un salto de línea
  const stack = [{ t: 'code', depth: 0, fromTemplate: false }];
  const flushWs = () => {
    if (pendingWs) { out += pendingNl ? '\n' : ' '; pendingWs = false; pendingNl = false; }
  };
  const emit = (ch) => {           // char de código significativo
    flushWs();
    out += ch;
    prevSig = ch;
    prevWord = /[A-Za-z0-9_$]/.test(ch) ? prevWord + ch : '';
  };
  const raw = (s) => { flushWs(); out += s; };   // verbatim, resolviendo el espacio antes
  let i = 0;
  while (i < n) {
    const top = stack[stack.length - 1];
    const c = src[i];
    const nx = src[i + 1];
    if (top.t === 'string') {
      out += c;
      if (c === '\\') { if (i + 1 < n) out += src[++i]; i++; continue; }
      if (c === top.q) { stack.pop(); prevSig = c; prevWord = ''; }
      i++; continue;
    }
    if (top.t === 'template') {
      if (c === '\\') { out += c; if (i + 1 < n) out += src[++i]; i++; continue; }
      if (c === '`') { out += c; stack.pop(); prevSig = '`'; prevWord = ''; i++; continue; }
      if (c === '$' && nx === '{') { out += '${'; stack.push({ t: 'code', depth: 0, fromTemplate: true }); prevSig = '{'; prevWord = ''; i += 2; continue; }
      out += c; i++; continue;
    }
    if (top.t === 'regex') {
      out += c;
      if (c === '\\') { if (i + 1 < n) out += src[++i]; i++; continue; }
      if (top.inClass) { if (c === ']') top.inClass = false; }
      else if (c === '[') { top.inClass = true; }
      else if (c === '/') {
        stack.pop(); prevSig = '/'; prevWord = ''; i++;
        while (i < n && /[a-z]/i.test(src[i])) { out += src[i]; i++; }  // flags
        continue;
      }
      i++; continue;
    }
    // contexto de código
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r' || c === '\f' || c === '\v') {
      pendingWs = true;
      if (c === '\n' || c === '\r') pendingNl = true;
      i++; continue;
    }
    if (c === '/' && nx === '/') { i += 2; while (i < n && src[i] !== '\n') i++; continue; }
    if (c === '/' && nx === '*') {
      i += 2; let nl = false;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) { if (src[i] === '\n') nl = true; i++; }
      i += 2;
      pendingWs = true;                  // un bloque actúa como separador
      if (nl) pendingNl = true;          // si abarcaba líneas, cuenta como salto (ASI)
      continue;
    }
    if (c === '"' || c === "'") { stack.push({ t: 'string', q: c }); raw(c); prevSig = c; prevWord = ''; i++; continue; }
    if (c === '`') { stack.push({ t: 'template' }); raw('`'); prevSig = '`'; prevWord = ''; i++; continue; }
    if (c === '/') {
      const isRegex = prevSig === '' || JS_REGEX_PREV.has(prevSig) || JS_REGEX_KEYWORDS.has(prevWord);
      if (isRegex) { stack.push({ t: 'regex', inClass: false }); raw(c); prevSig = '/'; prevWord = ''; i++; continue; }
      emit(c); i++; continue;  // división
    }
    if (c === '{') { top.depth++; emit(c); i++; continue; }
    if (c === '}') {
      if (top.depth > 0) { top.depth--; emit(c); i++; continue; }
      if (top.fromTemplate) { flushWs(); stack.pop(); out += '}'; prevSig = '}'; prevWord = ''; i++; continue; }
      emit(c); i++; continue;
    }
    emit(c); i++;
  }
  return out;
}

function versionedCss(source) {
  return minifyCss(source).replace(
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
    const expelled = player?.expelled === true;
    // Hueco del grid (line+slot): imprescindible para reconstruir el dibujo exacto
    // en el modal del ranking (tácticas personalizadas, líneas de 5 ENG, etc.).
    // Sin esto el render cae a un reparto aproximado (p. ej. 5 ENG → 3 MED + 2 ENG).
    const slot = Number.isInteger(player?.slot) ? Math.max(0, Math.min(9, player.slot)) : null;
    return { name, position: player.position, line, ovr, rarity, ...(slot != null ? { slot } : {}), ...(expelled ? { expelled: true } : {}) };
  }).filter(Boolean);
  return players.length ? players : null;
}

// Director técnico de la run (opcional): nombre, id de retrato y nación saneados.
function sanitizeRankingManager(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = clampText(raw.name, 60).replace(/[<>"'`=\\/()[\]{}]/g, '').trim();
  if (!name) return null;
  const id = clampText(raw.id, 80).replace(/[^a-zA-Z0-9_-]/g, '');
  const nation = clampText(raw.nation, 48);
  return { id, name, nation };
}

function sanitizeRankingEntry(raw) {
  const floor = Math.max(0, Math.floor(Number(raw?.floor) || 0));
  const teamName = sanitizeTeamName(raw?.teamName);
  const nation = clampText(raw?.nation, 48);
  const createdAt = Number.isFinite(Date.parse(raw?.createdAt)) ? new Date(raw.createdAt).toISOString() : new Date().toISOString();
  const id = clampText(raw?.id, 80) || crypto.randomUUID();
  const entry = { id, teamName, nation, floor, createdAt };
  // Identidad anónima de la run (UUID o fallback tdl-...): sirve para deduplicar
  // el ranking y que un save clonado no genere una segunda entrada.
  const runId = clampText(raw?.runId, 64).replace(/[^a-zA-Z0-9-]/g, '');
  if (runId) entry.runId = runId;
  // Equipo del último partido (opcional): formación conocida + once saneado.
  if (FORMATIONS[raw?.formation]) entry.formation = raw.formation;
  const lineup = sanitizeRankingLineup(raw?.lineup);
  if (lineup) entry.lineup = lineup;
  const manager = sanitizeRankingManager(raw?.manager);
  if (manager) entry.manager = manager;
  return entry;
}

function sortRanking(entries) {
  return entries
    .slice()
    .sort((a, b) => b.floor - a.floor || Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.teamName.localeCompare(b.teamName));
}

async function readRankingFrom(file) {
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    const rawEntries = Array.isArray(parsed) ? parsed : parsed.entries;
    const entries = Array.isArray(rawEntries) ? rawEntries.map(sanitizeRankingEntry) : [];
    return sortRanking(entries).slice(0, RANKING_LIMIT);
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function writeRankingTo(file, entries) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify({ entries }, null, 2)}\n`, 'utf8');
}

// Núcleo GET/POST del ranking, parametrizado por archivo: lo comparten el histórico
// (ranking.json) y el semanal (ranking-AAAA-Wnn.json). Misma lógica de dedup anti-clon
// por runId, orden y top RANKING_LIMIT; archivos independientes, ids propios por entrada.
async function handleRankingFile(req, res, file) {
  try {
    if (req.method === 'GET') {
      json(res, 200, { entries: await readRankingFrom(file), limit: RANKING_LIMIT });
      return;
    }

    if (req.method === 'POST') {
      const payload = JSON.parse(await readBody(req));
      const entry = sanitizeRankingEntry(payload);
      const existing = await readRankingFrom(file);
      // Anti-clon: una sola entrada por runId, conservando la de mayor floor. Un
      // save clonado/reenviado comparte runId y no puede duplicar su puesto.
      let pool = existing;
      if (entry.runId) {
        const prior = existing.find((item) => item.runId === entry.runId);
        if (prior && prior.floor >= entry.floor) {
          const priorRank = existing.findIndex((item) => item.id === prior.id);
          json(res, 200, {
            entries: existing,
            entryId: prior.id,
            rank: priorRank >= 0 ? priorRank + 1 : null,
            limit: RANKING_LIMIT,
          });
          return;
        }
        pool = existing.filter((item) => item.runId !== entry.runId);
      }
      const entries = sortRanking([entry, ...pool]).slice(0, RANKING_LIMIT);
      await writeRankingTo(file, entries);
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

// Ranking histórico: envoltorio sobre el núcleo con el archivo de siempre.
async function handleRanking(req, res) {
  return handleRankingFile(req, res, RANKING_FILE);
}

// Clave de semana ISO 8601 ("2026-W25") en horario de Madrid. El cambio de archivo
// ocurre exactamente el lunes 00:00 Madrid: ICU resuelve el desfase/DST al extraer la
// fecha civil, y la aritmética ISO se hace sobre ese día tratado como UTC fijo. Así la
// rotación es automática (sin cron) y las semanas pasadas quedan en disco.
function weekKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value);
  const target = new Date(Date.UTC(get('year'), get('month') - 1, get('day')));
  // Mover al jueves de la semana (lunes=0 … domingo=6): el año ISO es el del jueves.
  const dayNum = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNum + 3);
  const isoYear = target.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(isoYear, 0, 4));
  firstThursday.setUTCDate(firstThursday.getUTCDate() - ((firstThursday.getUTCDay() + 6) % 7) + 3);
  const week = 1 + Math.round((target - firstThursday) / (7 * 24 * 3600 * 1000));
  return `${isoYear}-W${String(week).padStart(2, '0')}`;
}

const isValidWeekKey = (value) => /^\d{4}-W\d{2}$/.test(value || '');

// Ranking semanal: mismo núcleo, archivo por semana ISO. El POST siempre escribe la
// semana actual; el GET admite ?semana=AAAA-Wnn (validado contra path traversal) para
// recuperar en solo lectura una semana pasada archivada.
async function handleWeeklyRanking(req, res) {
  const requested = new URL(req.url, 'http://x').searchParams.get('semana');
  const key = (req.method === 'GET' && isValidWeekKey(requested)) ? requested : weekKey();
  const file = path.join(RANKING_WEEKLY_DIR, `ranking-${key}.json`);
  return handleRankingFile(req, res, file);
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

// Rutas en castellano a propósito: "/api/stats" y "heartbeat" coinciden con
// patrones de telemetría de EasyPrivacy y los bloqueadores cortan la petición
// en el navegador. Las rutas viejas se mantienen como alias para clientes con
// el módulo anterior aún cacheado.
async function handleStats(req, res) {
  try {
    const pathname = (req.url || '').split('?')[0];

    if (req.method === 'GET' && (pathname === '/api/comunidad' || pathname === '/api/stats')) {
      const stats = await readStatsFile();
      json(res, 200, { totalGames: stats.totalGames, online: onlineCount() });
      return;
    }

    // Latido de presencia: registra/refresca al cliente y devuelve el recuento.
    if (req.method === 'POST' && (pathname === '/api/comunidad/latido' || pathname === '/api/stats/heartbeat')) {
      const payload = JSON.parse(await readBody(req) || '{}');
      const id = clampText(payload?.id, 64);
      if (id && (presence.size < PRESENCE_MAX || presence.has(id))) {
        presence.set(id, Date.now());
      }
      json(res, 200, { online: onlineCount() });
      return;
    }

    // Una run nueva arrancó: suma al contador global persistido.
    if (req.method === 'POST' && (pathname === '/api/comunidad/partida' || pathname === '/api/stats/game')) {
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
      const cacheKey = `${filePath}:${stat.mtimeMs}:${BUILD_VERSION}`;
      let body = minifiedCache.get(cacheKey);
      if (!body) {
        const source = await fs.readFile(filePath, 'utf8');
        const text = extension === '.css'
          ? versionedCss(source)
          : versionedJavaScript(source);
        body = Buffer.from(text, 'utf8');
        minifiedCache.set(cacheKey, body);
      }
      res.writeHead(200, securityHeaders({
        'Content-Type': MIME[extension],
        'Content-Length': body.length,
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

// Panel admin: vive solo en local/ (ignorado por git) y NO se publica. En producción
// (clon público) el archivo no existe: ADMIN_ENABLED queda false con una simple
// comprobación síncrona y NO se intenta cargar nada. Sin top-level await ni ninguna
// dependencia de local/ en tiempo de evaluación del módulo, para que el arranque del
// servidor de producción sea idéntico al de un build sin admin.
const ADMIN_API_PATH = path.join(ROOT, 'local', 'admin_api.mjs');
export const ADMIN_ENABLED = existsSync(ADMIN_API_PATH);
let adminApi = null;
// Solo en local (ADMIN_ENABLED): carga en segundo plano, sin bloquear la evaluación.
const adminReady = ADMIN_ENABLED
  ? import(pathToFileURL(ADMIN_API_PATH).href)
      .then(({ createAdminApi }) => {
        adminApi = createAdminApi({ ROOT, json, readBody, methodNotAllowed, POSITIONS, RARITY_SET, playerOVR, FORMATIONS });
      })
      .catch(() => { adminApi = null; })
  : Promise.resolve();

// Dispatcher reutilizable: lo usa tanto el http nativo (local) como Express (producción).
export function handleRequest(req, res) {
  if (req.url?.startsWith('/api/ranking/semanal')) {
    handleWeeklyRanking(req, res);
    return;
  }
  if (req.url?.startsWith('/api/ranking')) {
    handleRanking(req, res);
    return;
  }
  if (req.url?.startsWith('/api/comunidad') || req.url?.startsWith('/api/stats')) {
    handleStats(req, res);
    return;
  }
  if (req.url?.startsWith('/api/admin/')) {
    // El admin solo existe en local. En producción ADMIN_ENABLED es false: ruta
    // 100% síncrona que NUNCA toca local/. En local esperamos a que cargue la API.
    if (!ADMIN_ENABLED) {
      if (req.method === 'GET' || req.method === 'HEAD') { serveStatic(req, res); return; }
      methodNotAllowed(res);
      return;
    }
    adminReady.then(() => {
      if (adminApi && adminApi.handle(req, res)) return;
      if (req.method === 'GET' || req.method === 'HEAD') { serveStatic(req, res); return; }
      methodNotAllowed(res);
    });
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
    console.log(`Contador de partidas: ${STATS_FILE}`);
    adminReady.then(() => {
      if (adminApi) {
        console.log(`Panel admin protegido en #playeredit · usuario: ${adminApi.ADMIN_USER}`);
        if (adminApi.USING_EPHEMERAL_ADMIN_PASSWORD) {
          console.warn(`AVISO: ADMIN_PASSWORD no definida. Contraseña admin temporal: ${adminApi.EPHEMERAL_PASSWORD}`);
        }
      } else {
        console.log('Sin panel admin (local/admin_api.mjs no presente).');
      }
    });
  });
}
