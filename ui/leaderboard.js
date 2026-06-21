import { esc } from './dom.js';
import { requestJson } from '../data/api.js';
import { flagSrcForNation } from '../data/flags.js';
import { sanitizeTeamName } from '../data/teamName.js';
import { t } from '../data/i18n.js';
import { FORMATIONS, LINES, FORMATION_TEMPLATES, formationLineSlots, CUSTOM_FORMATION } from '../data/config.js';
import { playerInitials, playerSurname, portraitPathForName, portraitPathForManager } from '../data/playerAssets.js';
import { POSITION_LABEL } from './cards.js';
import { LINE_TOP, lineSpreadX, PITCH_MARKINGS } from './pitchArt.js';
import { lineupFieldHTML, layoutInformative } from './lineupBoard.js';

export const LEADERBOARD_LIMIT = 20;

const API_URL = '/api/ranking';
const STATIC_URL = '/data/ranking.json';
const WEEKLY_API_URL = '/api/ranking/semanal';

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
    const expelled = Boolean(player?.expelled);
    const slot = Number.isInteger(player?.slot) ? player.slot : null;
    return { name, position: player.position, line, slot, ovr, rarity, ...(expelled ? { expelled } : {}) };
  }).filter(Boolean);
  return players.length ? players : null;
}

function normalizeManager(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const name = String(raw.name || '').trim().slice(0, 60);
  if (!name) return null;
  return {
    id: String(raw.id || '').trim().slice(0, 80),
    name,
    nation: String(raw.nation || '').trim().slice(0, 48),
  };
}

function normalizeEntry(entry) {
  const floor = Math.max(0, Math.floor(Number(entry?.floor) || 0));
  const teamName = sanitizeTeamName(entry?.teamName);
  const nation = String(entry?.nation || '').trim().slice(0, 48);
  const id = String(entry?.id || `${teamName}-${nation}-${floor}`);
  const createdAt = Number.isFinite(Date.parse(entry?.createdAt)) ? new Date(entry.createdAt).toISOString() : '';
  // Conserva las plantillas conocidas y el centinela "Personalizada" (dibujos
  // deformados); descarta valores desconocidos.
  const formation = (FORMATIONS[entry?.formation] || entry?.formation === CUSTOM_FORMATION) ? entry.formation : '';
  const lineup = normalizeLineup(entry?.lineup);
  const manager = normalizeManager(entry?.manager);
  return { id, teamName, nation, floor, createdAt, formation, lineup, manager };
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
      manager: entry.manager,
    }),
  });
  if (payload) return normalizePayload(payload);

  const fallback = await fetchLeaderboard();
  return { ...fallback, entryId: null, rank: null, readOnly: true };
}

// === Ranking semanal: mismo formato y helpers, archivo/endpoint paralelos ===
// Sin fallback estático: el JSON de la semana en curso no está versionado, así que
// sin servidor el panel queda vacío (el histórico sí conserva su copia estática).
export async function fetchWeeklyLeaderboard() {
  const payload = await requestJson(WEEKLY_API_URL);
  return normalizePayload(payload || { entries: [] });
}

export async function submitWeeklyLeaderboardEntry(entry) {
  const payload = await requestJson(WEEKLY_API_URL, {
    method: 'POST',
    body: JSON.stringify({
      runId: entry.runId,
      teamName: entry.teamName,
      nation: entry.nation,
      floor: entry.floor,
      formation: entry.formation,
      lineup: entry.lineup,
      manager: entry.manager,
    }),
  });
  if (payload) return normalizePayload(payload);

  const fallback = await fetchWeeklyLeaderboard();
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
          <img class="leaderboard-flag" src="${esc(flagSrcForNation(nation))}" alt="" loading="eager" decoding="async" />
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

  const weekly = options.variant === 'weekly';
  const titleKey = weekly ? 'leaderboard.titleWeekly' : 'leaderboard.title';
  const topKey = weekly ? 'leaderboard.topWeekly' : 'leaderboard.top';
  return `
    <section class="leaderboard-panel arcade-panel${options.compact ? ' compact' : ''}${weekly ? ' weekly' : ''}">
      <div class="leaderboard-head">
        <span>${t(titleKey)}</span>
        <b>${t(topKey)}</b>
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
    <div class="field-chip scout-chip${player.rarity ? ` filled rarity-${esc(player.rarity)}` : ''}${player.expelled ? ' chip-expelled' : player.injured ? ' chip-injured' : ''}">
      <span class="chip-face" aria-hidden="true">
        <img src="${esc(portraitPathForName(player.name))}" alt="" loading="eager" decoding="async" data-hide-on-error="true" />
        <span>${esc(playerInitials(player.name))}</span>
      </span>
      <span class="chip-ovr">${player.ovr || '—'}</span>
      <span class="chip-init">${POSITION_LABEL[player.position]}</span>
      <span class="chip-name" title="${esc(player.name)}">${esc(playerSurname(player.name))}</span>
    </div>`;
}

// Etiqueta de formación a mostrar: "Personalizada" (localizada) si el once se
// deformó —centinela guardado o, en entradas antiguas, conteo por línea que no
// encaja con su plantilla—; si no, el nombre de la plantilla.
function displayFormationLabel(entry) {
  if (!entry.formation) return '';
  if (entry.formation === CUSTOM_FORMATION) return t('tactics.custom');
  const tmplCounts = FORMATIONS[entry.formation];
  if (tmplCounts && Array.isArray(entry.lineup)) {
    const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
    for (const p of entry.lineup) {
      const l = LINES.includes(p.line) ? p.line : p.position;
      if (counts[l] != null) counts[l] += 1;
    }
    if (!LINES.every((l) => (counts[l] || 0) === (tmplCounts[l] || 0))) return t('tactics.custom');
  }
  return entry.formation;
}

// Construye los huecos posicionados de un once guardado. Si el snapshot trae el
// `slot` del grid (saves nuevos), cada jugador va a su hueco EXACTO (soporta
// tácticas personalizadas y líneas de 5). Sin `slot` (saves antiguos) se reubica
// por línea mostrando a TODOS: DEF→fila DEF, FWD→fila DEL, y el medio se parte en
// MED/ENG según la plantilla (o por la mitad). layoutInformative reparte cada fila.
function lineupSlots(lineup, formation) {
  const hasSlots = lineup.some((p) => Number.isInteger(p.slot));
  if (hasSlots) {
    return lineup.map((p) => {
      const line = LINES.includes(p.line) ? p.line : p.position;
      const cells = formationLineSlots('', line);
      const meta = cells[p.slot] || cells[0];
      return { ...meta, player: p };
    });
  }
  const byLine = { GK: [], DEF: [], MID: [], FWD: [] };
  for (const p of lineup) {
    const line = LINES.includes(p.line) ? p.line : p.position;
    if (byLine[line]) byLine[line].push(p);
  }
  const tmpl = FORMATION_TEMPLATES[formation];
  const medCount = tmpl ? tmpl.MED.length : Math.ceil(byLine.MID.length / 2);
  const slots = [];
  // Saves antiguos: SIN columna real del grid (solo orden secuencial), para que
  // layoutInformative reparta equilibrado en vez de amontonar a la izquierda.
  byLine.GK.forEach((p) => slots.push({ line: 'GK', slotIndex: 0, gridRow: 'POR', player: p }));
  byLine.DEF.forEach((p, i) => slots.push({ line: 'DEF', slotIndex: i, gridRow: 'DEF', player: p }));
  byLine.FWD.forEach((p, i) => slots.push({ line: 'FWD', slotIndex: i, gridRow: 'DEL', player: p }));
  byLine.MID.forEach((p, i) => slots.push({ line: 'MID', slotIndex: i, gridRow: i < medCount ? 'MED' : 'ENG', player: p }));
  return slots;
}

function lineupField(lineup, formation) {
  const slots = lineupSlots(lineup, formation);
  if (!slots.length) return flatLineupField(lineup);
  layoutInformative(slots);
  return lineupFieldHTML({
    formation: formation || '',
    slots,
    fieldClass: 'lineup-modal-field',
    chip: (slot) => lineupChip(slot.player),
  });
}

// Respaldo para entradas sin formación guardada: reparto plano por línea jugada.
function flatLineupField(lineup) {
  const nodes = LINES.flatMap((line) => {
    const players = lineup.filter((p) => (p.line || p.position) === line);
    const xs = lineSpreadX(players.length);
    return players.map((player, i) => `
      <div class="chip-anchor" style="left:${xs[i]}%;top:${LINE_TOP[line]}%">${lineupChip(player)}</div>`);
  }).join('');
  return `
    <div class="field lineup-board lineup-modal-field">
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

  const meta = [t('leaderboard.floor', { floor: entry.floor }), displayFormationLabel(entry)]
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
          ${entry.manager ? `<div class="lineup-modal-manager">
            <img class="lineup-modal-manager-face" src="${esc(portraitPathForManager(entry.manager))}" alt="" decoding="async" data-hide-on-error="true" />
            <span><small>${esc(t('result.manager'))}</small><b>${esc(entry.manager.name)}</b></span>
          </div>` : ''}
        </header>
        ${lineupField(entry.lineup, entry.formation)}
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
