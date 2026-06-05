import { PLAYERS } from './players.js';
import { ROSTER } from './roster.js';

export const PORTRAIT_DIR = 'assets/player-portraits';

export function normalizeName(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .toLowerCase()
    .trim();
}

export function slugifyName(name) {
  return normalizeName(name)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'jugador';
}

export function playerInitials(name) {
  const parts = String(name || '').split(/\s+/).filter(Boolean);
  if (!parts.length) return '??';
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || '';
  return `${first}${last}`.toUpperCase();
}

// Indice nombre→jugador para resolver retratos cuando solo tenemos el nombre
// (p. ej. los onces rivales en la escena de partido y el scouting). Cubre todo
// el roster, asi que un rival resuelve a su id unico `gen_*` y su `{id}.png`.
let KNOWN_BY_NAME = null;

function knownByName() {
  if (KNOWN_BY_NAME) return KNOWN_BY_NAME;
  KNOWN_BY_NAME = new Map();
  for (const player of PLAYERS) KNOWN_BY_NAME.set(normalizeName(player.name), player);
  for (const player of ROSTER) {
    const key = normalizeName(player.name);
    if (!KNOWN_BY_NAME.has(key)) KNOWN_BY_NAME.set(key, player);
  }
  return KNOWN_BY_NAME;
}

export function playerByDisplayName(name) {
  return knownByName().get(normalizeName(name)) || null;
}

export function portraitPathForPlayer(player) {
  if (!player) return null;
  if (player.portraitDataUrl) return player.portraitDataUrl;
  if (player.id) return `${PORTRAIT_DIR}/${player.id}.png`;
  return portraitPathForName(player.name);
}

export function portraitPathForName(name) {
  const known = playerByDisplayName(name);
  if (known) return portraitPathForPlayer(known);
  return `${PORTRAIT_DIR}/by-name/${slugifyName(name)}.png`;
}
