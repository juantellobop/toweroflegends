// Torre de Leyendas — API LOCAL del panel de administración.
// Vive solo en local/ (ignorado por git) y NO se publica. El servidor público
// (tools/admin_server.mjs) lo carga con import() opcional vía createAdminApi():
// si este archivo no existe (clon público / producción), el servidor arranca
// igual sin endpoints de admin.
//
// Para evitar un ciclo de import con el top-level await del core, este módulo
// NO importa del core: recibe los helpers compartidos por el objeto `ctx`
// (json, readBody, methodNotAllowed, POSITIONS, RARITY_SET, playerOVR, ROOT).

import { spawn } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const FIELD_STAT_KEYS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
const GK_STAT_KEYS = ['reflexes', 'handling', 'positioning'];
const TACTICAL_TYPES = ['posesion', 'presion', 'contra'];
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;

export function createAdminApi(ctx) {
  const { ROOT, json, readBody, methodNotAllowed, POSITIONS, RARITY_SET, playerOVR } = ctx;

  const PLAYER_DB_FILE = path.resolve(process.env.PLAYER_DB_FILE || path.join(ROOT, 'data', 'players.js'));
  const PLAYER_PORTRAITS_DIR = path.join(ROOT, 'assets', 'player-portraits');
  const CONVERT_SCRIPT = path.join(ROOT, 'local', 'tools', 'convert_admin_portrait.py');
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(18).toString('base64url');
  const USING_EPHEMERAL_ADMIN_PASSWORD = !process.env.ADMIN_PASSWORD;
  const adminSessions = new Map(); // token -> expiresAt (ms)

  function parseDataUrl(dataUrl) {
    const match = /^data:(image\/(?:png|jpeg|jpg|webp));base64,([a-z0-9+/=\s]+)$/i.exec(String(dataUrl || ''));
    if (!match) throw new Error('La imagen subida no tiene un formato válido.');
    const mime = match[1].toLowerCase().replace('image/jpg', 'image/jpeg');
    const ext = mime === 'image/png' ? '.png' : mime === 'image/webp' ? '.webp' : '.jpg';
    return { ext, buffer: Buffer.from(match[2].replace(/\s/g, ''), 'base64') };
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
        CONVERT_SCRIPT,
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

  // true si la petición es una ruta de admin que este módulo atiende.
  function handle(req, res) {
    const url = req.url || '';
    if (url.startsWith('/api/admin/login')) { handleAdminLogin(req, res); return true; }
    if (url.startsWith('/api/admin/player')) { handleAdminPlayer(req, res); return true; }
    if (req.method === 'POST' && url.startsWith('/api/admin/portrait')) { handlePortrait(req, res); return true; }
    return false;
  }

  return {
    handle,
    USING_EPHEMERAL_ADMIN_PASSWORD,
    ADMIN_USER,
    EPHEMERAL_PASSWORD: USING_EPHEMERAL_ADMIN_PASSWORD ? ADMIN_PASSWORD : null,
  };
}
