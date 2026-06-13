import { esc } from './dom.js';
import { requestJson } from '../data/api.js';
import { flagSrcForNation } from '../data/flags.js';
import { sanitizeTeamName } from '../data/teamName.js';
import { t } from '../data/i18n.js';
import { FORMATIONS, LINES } from '../data/config.js';
import { playerInitials, playerSurname, portraitPathForName } from '../data/playerAssets.js';
import { POSITION_LABEL } from './cards.js';
import { LINE_TOP, lineSpreadX, PITCH_MARKINGS } from './pitchArt.js';

export const LEADERBOARD_LIMIT = 20;

const API_URL = '/api/ranking';
const STATIC_URL = '/data/ranking.json';

// Once del último partido tal como llega del servidor (o del JSON estático):
// se acotan textos/números y se descartan posiciones desconocidas.
function normalizeLineup(raw) {
  if (!Array.isArray(raw)) return null;
  const players = raw.slice(0, 11).map((player) => {
    const name = String(player?.name || '').trim().slice(0, 60);
    if (!name || !LINES.includes(player?.position)) return null;
    const line = LINES.includes(player?.line) ? player.line : player.position;
    const ovr = Math.max(0, Math.min(199, Math.round(Number(player?.ovr) || 0)));
    const rarity = String(player?.rarity || '').trim().slice(0, 12);
    return { name, position: player.position, line, ovr, rarity };
  }).filter(Boolean);
  return players.length ? players : null;
}

function normalizeEntry(entry) {
  const floor = Math.max(0, Math.floor(Number(entry?.floor) || 0));
  const teamName = sanitizeTeamName(entry?.teamName);
  const nation = String(entry?.nation || '').trim().slice(0, 48);
  const id = String(entry?.id || `${teamName}-${nation}-${floor}`);
  const createdAt = Number.isFinite(Date.parse(entry?.createdAt)) ? new Date(entry.createdAt).toISOString() : '';
  const formation = FORMATIONS[entry?.formation] ? entry.formation : '';
  const lineup = normalizeLineup(entry?.lineup);
  return { id, teamName, nation, floor, createdAt, formation, lineup };
}

function normalizePayload(payload) {
  const rawEntries = Array.isArray(payload) ? payload : payload?.entries;
  const timestamp = (entry) => Date.parse(entry.createdAt) || 0;
  const entries = Array.isArray(rawEntries)
    ? rawEntries.map(normalizeEntry)
      .sort((a, b) => b.floor - a.floor || timestamp(a) - timestamp(b))
      .slice(0, LEADERBOARD_LIMIT)
    : [];
  return {
    entries,
    entryId: payload?.entryId || null,
    rank: Number.isInteger(payload?.rank) ? payload.rank : null,
    limit: Number(payload?.limit) || LEADERBOARD_LIMIT,
  };
}

export async function fetchLeaderboard() {
  const apiPayload = await requestJson(API_URL);
  if (apiPayload) return normalizePayload(apiPayload);

  const staticPayload = await requestJson(STATIC_URL);
  return normalizePayload(staticPayload || { entries: [] });
}

export async function submitLeaderboardEntry(entry) {
  const payload = await requestJson(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      runId: entry.runId,
      teamName: entry.teamName,
      nation: entry.nation,
      floor: entry.floor,
      formation: entry.formation,
      lineup: entry.lineup,
    }),
  });
  if (payload) return normalizePayload(payload);

  const fallback = await fetchLeaderboard();
  return { ...fallback, entryId: null, rank: null, readOnly: true };
}

// Entradas con once renderizadas, indexadas por id para abrir su modal al
// hacer click en la fila (el HTML se inyecta con innerHTML, sin listeners).
const lineupIndex = new Map();

export function renderLeaderboard(entries, options = {}) {
  const limit = options.limit || LEADERBOARD_LIMIT;
  const currentId = options.currentId || null;
  const rows = entries.slice(0, limit).map((entry, index) => {
    const nation = entry.nation || entry.teamName;
    const hasLineup = Boolean(entry.lineup && entry.lineup.length);
    if (hasLineup) lineupIndex.set(entry.id, entry);
    const clickable = hasLineup
      ? ` data-entry-id="${esc(entry.id)}" role="button" tabindex="0" title="${esc(t('leaderboard.lineup'))}"`
      : '';
    return `
      <li class="leaderboard-row${entry.id === currentId ? ' is-current' : ''}${hasLineup ? ' has-lineup' : ''}"${clickable}>
        <span class="leaderboard-rank">#${index + 1}</span>
        <span class="leaderboard-team">
          <img class="leaderboard-flag" src="${esc(flagSrcForNation(nation))}" alt="" loading="lazy" decoding="async" />
          <b>${esc(entry.teamName)}</b>
        </span>
        <span class="leaderboard-floor">${t('leaderboard.floor', { floor: entry.floor })}${hasLineup ? '<i class="leaderboard-more" aria-hidden="true">▸</i>' : ''}</span>
      </li>`;
  }).join('');

  let note = '';
  if (options.loading) note = `<p class="leaderboard-note">${t('leaderboard.updating')}</p>`;
  else if (options.readOnly) note = `<p class="leaderboard-note">${t('leaderboard.readOnly')}</p>`;
  else if (options.rank) note = `<p class="leaderboard-note">${t('leaderboard.rank', { rank: options.rank })}</p>`;
  else if (options.submitted) note = `<p class="leaderboard-note">${t('leaderboard.notTop')}</p>`;

  return `
    <section class="leaderboard-panel arcade-panel${options.compact ? ' compact' : ''}">
      <div class="leaderboard-head">
        <span>${t('leaderboard.title')}</span>
        <b>${t('leaderboard.top')}</b>
      </div>
      ${note}
      ${rows
        ? `<ol class="leaderboard-list">${rows}</ol>`
        : `<p class="leaderboard-empty">${options.loading ? t('generic.loading') : t('leaderboard.empty')}</p>`}
    </section>`;
}

// === Modal con el once del último partido de una entrada del top 20 ===

function lineupChip(player) {
  return `
    <div class="field-chip scout-chip${player.rarity ? ` filled rarity-${esc(player.rarity)}` : ''}">
      <span class="chip-face" aria-hidden="true">
        <img src="${esc(portraitPathForName(player.name))}" alt="" loading="lazy" decoding="async" data-hide-on-error="true" />
        <span>${esc(playerInitials(player.name))}</span>
      </span>
      <span class="chip-ovr">${player.ovr || '—'}</span>
      <span class="chip-init">${POSITION_LABEL[player.position]}</span>
      <span class="chip-name" title="${esc(player.name)}">${esc(playerSurname(player.name))}</span>
    </div>`;
}

// Pinta el once sobre el tablero agrupando por línea jugada (no por posición
// natural: un MID en el hueco de enganche cuenta para su línea real).
function lineupField(lineup) {
  const nodes = LINES.flatMap((line) => {
    const players = lineup.filter((p) => (p.line || p.position) === line);
    const xs = lineSpreadX(players.length);
    return players.map((player, i) => `
      <div class="chip-anchor" style="left:${xs[i]}%;top:${LINE_TOP[line]}%">${lineupChip(player)}</div>`);
  }).join('');
  return `
    <div class="field lineup-modal-field">
      <svg class="field-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${PITCH_MARKINGS}
      </svg>
      ${nodes}
    </div>`;
}

let closeActiveLineupModal = null;

// Abre el modal de la entrada `entryId` (debe haberse pintado en el último
// renderLeaderboard). Sin once guardado —entradas antiguas— no hace nada.
export function openLeaderboardLineup(entryId) {
  const entry = lineupIndex.get(entryId);
  if (!entry?.lineup?.length) return;
  closeActiveLineupModal?.();

  const meta = [t('leaderboard.floor', { floor: entry.floor }), entry.formation]
    .filter(Boolean).join(' · ');
  const overlay = document.createElement('div');
  overlay.className = 'player-modal lineup-modal';
  overlay.innerHTML = `
    <div class="player-modal-backdrop" data-close></div>
    <div class="player-modal-card lineup-modal-card" role="dialog" aria-modal="true" aria-label="${esc(t('leaderboard.lineup'))}">
      <button class="player-modal-close" data-close aria-label="${esc(t('generic.close'))}">
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.4 2.4 L9.6 9.6 M9.6 2.4 L2.4 9.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" fill="none" /></svg>
      </button>
      <section class="arcade-panel lineup-modal-panel">
        <header class="lineup-modal-head">
          <img class="leaderboard-flag" src="${esc(flagSrcForNation(entry.nation || entry.teamName))}" alt="" decoding="async" />
          <div>
            <b>${esc(entry.teamName)}</b>
            <span>${esc(meta)} · ${esc(t('leaderboard.lineup'))}</span>
          </div>
        </header>
        ${lineupField(entry.lineup)}
      </section>
    </div>`;

  const onKey = (event) => {
    if (event.key === 'Escape') close();
  };
  function close() {
    document.removeEventListener('keydown', onKey);
    overlay.remove();
    if (closeActiveLineupModal === close) closeActiveLineupModal = null;
  }
  overlay.addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) close();
  });
  // El modal vive en <body>, fuera de #app: replica el fallback global de
  // retratos rotos (se oculta la imagen y quedan las iniciales del chip).
  overlay.addEventListener('error', (event) => {
    const target = event.target;
    if (target?.tagName === 'IMG' && target.dataset.hideOnError === 'true') {
      target.hidden = true;
    }
  }, true);
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
  closeActiveLineupModal = close;
}
