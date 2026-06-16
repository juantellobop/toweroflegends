// Torre de Leyendas — Componentes de carta reutilizables (§8).
// Toda la información visible que el jugador necesita para decidir (§2):
// posición, atributos, rareza, nación, época y rasgo.

import { esc } from './dom.js';
import { playerOVR } from '../engine/ovr.js';
import { playerInitials, portraitPathForManager, portraitPathForPlayer } from '../data/playerAssets.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { localizeEra, localizeItem, localizeNation, localizeTrait, t } from '../data/i18n.js';

export const RARITY_LABEL = new Proxy({}, { get: (_, key) => t(`card.rarity.${String(key)}`) });
export const POSITION_LABEL = new Proxy({}, { get: (_, key) => t(`card.position.${String(key)}`) });
export const LINE_LABEL = new Proxy({}, { get: (_, key) => t(`card.line.${String(key)}`) });

const FIELD_STATS = [
  ['pace'], ['shooting'], ['passing'],
  ['dribbling'], ['defending'], ['physical'],
];
const GK_STATS = [['reflexes'], ['handling'], ['positioning']];

function statBars(player) {
  const rows = player.position === 'GK'
    ? GK_STATS.map(([k]) => [t(`card.stat.${k}`), player.gk ? player.gk[k] : 0])
    : FIELD_STATS.map(([k]) => [t(`card.stat.${k}`), player.stats ? player.stats[k] : 0]);
  return rows.map(([label, val]) => `
    <div class="stat">
      <span class="stat-label">${label}</span>
      <span class="stat-bar"><span class="stat-fill" style="width:${val}%"></span></span>
      <span class="stat-val">${val}</span>
    </div>`).join('');
}

function cardFrame(rarity) {
  return UI_ASSETS.cards.frames[rarity] || UI_ASSETS.cards.frames.common;
}

// Carta de jugador. `opts.selectable` añade data-uid o data-id para click.
export function playerCardHTML(player, opts = {}) {
  const ovr = playerOVR(player);
  const idAttr = opts.idValue ? `data-id="${esc(opts.idValue)}"` : '';
  // Retrato y bandera son diminutos (KB) y casi siempre visibles al renderizar:
  // por defecto se cargan eager para que no haya pop-in al abrir el sobre. Solo
  // las listas largas (p. ej. colección completa) pueden pasar opts.lazy.
  const imgLoading = opts.lazy ? 'lazy' : 'eager';
  // Estado de baja (lesión tiene prioridad sobre sanción): atenúa la carta, la
  // hace no clicable y muestra el icono correspondiente (igual que el banquillo).
  const injured = Boolean(opts.injured);
  const suspended = Boolean(opts.suspended) && !injured;
  const unavailable = injured || suspended;
  const cls = ['card', 'player-card', `rarity-${player.rarity}`];
  if (opts.selected) cls.push('selected');
  if (opts.clickable && !unavailable) cls.push('clickable');
  if (opts.disabled) cls.push('disabled-card');
  if (unavailable) cls.push('card--unavailable');
  const statusIcon = injured
    ? `<span class="card-injury" aria-hidden="true"></span><span class="card-injury-count" aria-hidden="true">${opts.injuryMatches ?? ''}</span>`
    : suspended
      ? `<span class="card-redcard" aria-hidden="true"></span>`
      : '';
  return `
  <div class="${cls.join(' ')}" ${idAttr} style="--card-frame:url('${esc(cardFrame(player.rarity))}')" ${opts.disabled || unavailable ? 'aria-disabled="true"' : ''}>
    <div class="card-head">
      <div class="card-ovr">${ovr}</div>
      <div class="card-pos">${POSITION_LABEL[player.position]}</div>
      <div class="card-rarity">${RARITY_LABEL[player.rarity]}</div>
    </div>
    <div class="card-portrait" aria-hidden="true">
      <img src="${esc(portraitPathForPlayer(player))}" alt="" loading="${imgLoading}" decoding="async" data-hide-on-error="true" />
      <span>${esc(playerInitials(player.name))}</span>
      ${statusIcon}
    </div>
    <div class="card-name">${esc(player.name)}</div>
    <div class="card-meta">
      <span class="chip nation"><img class="flag-img" src="${esc(flagSrcForNation(player.nation))}" alt="" loading="${imgLoading}" decoding="async" />${esc(localizeNation(player.nation))}</span>
      <span class="chip era">${esc(localizeEra(player.era))}</span>
      ${player.trait ? `<span class="chip trait">${esc(localizeTrait(player.trait))}</span>` : ''}
    </div>
    ${opts.disabled ? `<div class="owned-label"><span aria-hidden="true">✓</span> ${esc(t('card.owned'))}</div>` : ''}
    <div class="card-stats">${statBars(player)}</div>
  </div>`;
}

// Carta de objeto. `opts.stack` (>1) muestra un badge ×N: en el sobre indica
// cuántas copias acumularías al elegirlo; en la plantilla, cuántas ya tienes.
// Si el ítem tiene sinergia táctica, se muestra como chip ("Sinergia: Presión").
export function itemCardHTML(item, opts = {}) {
  const idAttr = opts.idValue ? `data-id="${esc(opts.idValue)}"` : '';
  const cls = ['card', 'item-card', `rarity-${item.rarity}`];
  if (opts.clickable) cls.push('clickable');
  const stack = opts.stack > 1 ? `<div class="item-stack" title="${esc(t('card.itemStack', { n: opts.stack }))}">×${opts.stack}</div>` : '';
  const synergy = item.synergyType
    ? `<div class="item-synergy"><span class="chip synergy">${esc(t('card.synergy', { type: t(`admin.tactical.${item.synergyType}`) }))}</span></div>`
    : '';
  return `
  <div class="${cls.join(' ')}" ${idAttr} style="--card-frame:url('${esc(cardFrame(item.rarity))}')">
    <div class="card-head">
      <div class="card-rarity">${RARITY_LABEL[item.rarity]}</div>
      <div class="item-type">${esc(localizeItem(item, 'type'))}</div>
    </div>
    ${stack}
    <div class="card-name">${esc(localizeItem(item, 'name'))}</div>
    <div class="item-desc">${esc(localizeItem(item, 'desc'))}</div>
    ${synergy}
    ${opts.stack > 1 ? `<div class="item-stack-note">${esc(t('card.itemStackNote'))}</div>` : ''}
  </div>`;
}

// Una casilla de modificador del DT: +N% / −N% / 0% con clase up/down/flat.
function managerModChip(label, pct) {
  const up = pct > 0;
  const down = pct < 0;
  const cls = up ? 'up' : down ? 'down' : 'flat';
  const sign = up ? '+' : down ? '−' : '';
  return `<span class="mgr-mod ${cls}"><b>${sign}${Math.abs(pct)}%</b><span>${esc(label)}</span></span>`;
}

// Carta de director técnico (DT). Comparte el chasis de la carta de jugador
// (.card + marco por rareza, cabecera, retrato, nombre, meta), cambiando el OVR
// por la insignia "DT" y las barras de stats por las 3 casillas de modificador
// (ataque / mediocampo / defensa). `opts.idValue` la hace clicable en el sobre.
export function managerCardHTML(manager, opts = {}) {
  if (!manager) return '';
  const idAttr = opts.idValue ? `data-id="${esc(opts.idValue)}"` : '';
  const cls = ['card', 'manager-card', `rarity-${manager.rarity}`];
  if (opts.clickable) cls.push('clickable');
  const imgLoading = opts.lazy ? 'lazy' : 'eager';
  const mods = manager.mods || {};
  return `
  <div class="${cls.join(' ')}" ${idAttr} style="--card-frame:url('${esc(cardFrame(manager.rarity))}')">
    <div class="card-head">
      <div class="card-pos">${t('card.manager.badge')}</div>
      <div class="card-rarity">${RARITY_LABEL[manager.rarity]}</div>
    </div>
    <div class="card-portrait" aria-hidden="true">
      <img src="${esc(portraitPathForManager(manager))}" alt="" loading="${imgLoading}" decoding="async" data-hide-on-error="true" />
      <span>${esc(playerInitials(manager.name))}</span>
    </div>
    <div class="manager-id">
      <div class="card-name">${esc(manager.name)}</div>
      <div class="card-meta">
        <span class="chip nation"><img class="flag-img" src="${esc(flagSrcForNation(manager.nation))}" alt="" loading="${imgLoading}" decoding="async" />${esc(localizeNation(manager.nation))}</span>
        ${manager.year ? `<span class="chip era">${esc(manager.year)}</span>` : ''}
        ${manager.style ? `<span class="chip synergy">${esc(t('card.synergy', { type: t(`admin.tactical.${manager.style}`) }))}</span>` : ''}
      </div>
      <div class="manager-mods">
        ${managerModChip(t('ratings.attack'), Number(mods.attack) || 0)}
        ${managerModChip(t('ratings.midfield'), Number(mods.midfield) || 0)}
        ${managerModChip(t('ratings.defense'), Number(mods.defense) || 0)}
      </div>
    </div>
  </div>`;
}
