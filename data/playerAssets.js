import { PLAYERS } from './players.js';
import { ROSTER } from './roster.js';

export const PORTRAIT_DIR = 'assets/player-portraits';

// El servidor reescribe los imports de módulos con ?v=<build>; reutilizar ese
// mismo tag en los retratos hace que cada deploy invalide la caché de caras
// y que entre deploys el navegador las conserve como immutable. Sin tag
// (tests en Node, apertura directa) las rutas quedan como siempre.
const BUILD_TAG = new URL(import.meta.url).searchParams.get('v');
const PORTRAIT_SUFFIX = BUILD_TAG ? `?v=${BUILD_TAG}` : '';

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

const SURNAME_PARTICLES = new Set([
  'da', 'das', 'de', 'del', 'der', 'di', 'do', 'dos', 'du',
  'la', 'le', 'mac', 'van', 'von',
]);

export function playerSurname(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return parts[0] || '';

  let start = parts.length - 1;
  while (start > 0 && SURNAME_PARTICLES.has(normalizeName(parts[start - 1]))) {
    start -= 1;
  }
  return parts.slice(start).join(' ');
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
  if (player.id) return `${PORTRAIT_DIR}/${player.id}.png${PORTRAIT_SUFFIX}`;
  return portraitPathForName(player.name);
}

export function portraitPathForName(name) {
  const known = playerByDisplayName(name);
  if (known) return portraitPathForPlayer(known);
  return `${PORTRAIT_DIR}/by-name/${slugifyName(name)}.png${PORTRAIT_SUFFIX}`;
}
