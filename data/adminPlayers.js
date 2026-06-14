import { ROSTER } from './roster.js';
import { LINES, RARITIES } from './config.js';
import { playerOVR } from '../engine/ovr.js';
import { adminAuthHeaders, clearAdminToken } from './adminAuth.js';
import { t } from './i18n.js';

export const ADMIN_PLAYER_SAVE_ENDPOINT = '/api/admin/player';
export const FIELD_STAT_KEYS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
export const GK_STAT_KEYS = ['reflexes', 'handling', 'positioning'];
export const TACTICAL_TYPES = ['posesion', 'presion', 'contra'];

const POSITIONS = new Set(LINES);
const RARITY_SET = new Set(RARITIES);

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new window.CustomEvent('tdl-admin-players-changed'));
  }
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
  if (!group) return null;
  const out = {};
  for (const key of keys) out[key] = clampStat(group[key]);
  return out;
}

export function clonePlayer(player) {
  return {
    ...player,
    stats: player.stats ? { ...player.stats } : null,
    gk: player.gk ? { ...player.gk } : null,
  };
}

function defaultFieldStats(base, ovr) {
  if (base?.stats) return cloneGroup(base.stats, FIELD_STAT_KEYS);
  return Object.fromEntries(FIELD_STAT_KEYS.map((key) => [key, clampStat(ovr, 60)]));
}

function defaultGkStats(base, ovr) {
  if (base?.gk) return cloneGroup(base.gk, GK_STAT_KEYS);
  return Object.fromEntries(GK_STAT_KEYS.map((key) => [key, clampStat(ovr, 60)]));
}

export function sanitizePlayerDraft(draft, base = {}) {
  const position = POSITIONS.has(draft.position) ? draft.position : (base.position || 'MID');
  const rarity = RARITY_SET.has(draft.rarity) ? draft.rarity : (base.rarity || 'common');
  const fallbackOVR = clampStat(draft.ovr ?? base.ovr ?? (base.position ? playerOVR(base) : 60));
  const isGK = position === 'GK';
  const portraitDataUrl = typeof draft.portraitDataUrl === 'string' && draft.portraitDataUrl.startsWith('data:image/')
    ? draft.portraitDataUrl
    : null;

  const clean = {
    ...clonePlayer(base),
    id: base.id || draft.id,
    name: cleanText(draft.name, base.name || 'Jugador'),
    nation: cleanText(draft.nation, base.nation || 'Leyendas', 48),
    era: cleanText(draft.era, base.era || 'Actual', 24),
    position,
    rarity,
    trait: cleanNullableText(draft.trait),
    tacticalType: TACTICAL_TYPES.includes(draft.tacticalType) ? draft.tacticalType : null,
    stats: isGK ? null : cloneGroup(draft.stats, FIELD_STAT_KEYS) || defaultFieldStats(base, fallbackOVR),
    gk: isGK ? cloneGroup(draft.gk, GK_STAT_KEYS) || defaultGkStats(base, fallbackOVR) : null,
    portraitDataUrl,
  };
  clean.ovr = playerOVR(clean);
  return clean;
}

function serializePlayer(player) {
  return {
    id: player.id,
    name: player.name,
    nation: player.nation,
    era: player.era,
    position: player.position,
    rarity: player.rarity,
    ovr: player.ovr,
    stats: player.stats ? { ...player.stats } : null,
    gk: player.gk ? { ...player.gk } : null,
    trait: player.trait,
    tacticalType: player.tacticalType,
    portraitDataUrl: player.portraitDataUrl || null,
  };
}

function replaceRosterPlayer(player) {
  const idx = ROSTER.findIndex((item) => item.id === player.id);
  if (idx >= 0) ROSTER[idx] = clonePlayer(player);
}

async function requestSavePlayer(player) {
  const fetcher = typeof fetch === 'function'
    ? fetch
    : (typeof window !== 'undefined' && typeof window.fetch === 'function' ? window.fetch.bind(window) : null);
  if (!fetcher) {
    throw new Error(t('admin.saveNeedsServer'));
  }

  const response = await fetcher(ADMIN_PLAYER_SAVE_ENDPOINT, {
    method: 'PUT',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
    body: JSON.stringify({ player }),
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }
  if (response.status === 401) {
    clearAdminToken();
    throw new Error(t('admin.expired'));
  }
  if (!response.ok) {
    throw new Error(t('admin.saveHttpError', { status: response.status }));
  }
  return payload?.player;
}

export async function initAdminPlayerDatabase() {
  return { direct: true, count: ROSTER.length };
}

export function basePlayerById(id) {
  return ROSTER.find((player) => player.id === id) || null;
}

export function hydratePlayer(player) {
  return clonePlayer(player);
}

export function getPlayableRoster() {
  return ROSTER.map(clonePlayer);
}

export function getAdminRoster() {
  return getPlayableRoster();
}

export function getAdminPlayer(id) {
  const base = basePlayerById(id);
  return base ? clonePlayer(base) : null;
}

export async function saveAdminPlayer(draft) {
  const base = basePlayerById(draft.id);
  if (!base) throw new Error(t('admin.playerNotFound', { id: draft.id }));
  const clean = sanitizePlayerDraft(draft, base);
  const saved = sanitizePlayerDraft(await requestSavePlayer(serializePlayer(clean)), clean);
  replaceRosterPlayer(saved);
  emitChange();
  return saved;
}
