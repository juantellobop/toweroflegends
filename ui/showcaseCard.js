// Torre de Leyendas — Carta "escaparate" (diseño a sangre, §8).
// Es el diseño grande de carta (fondo JPG por rareza, retrato octogonal, hueco
// .art para el arte del objeto) que se usa SOLO en las dos superficies donde la
// carta se ve en grande: las cartas a elegir al abrir un sobre (.pack-stage) y el
// modal de info del jugador (#playerModalBody). El resto del juego (alineación,
// banquillo, pizarra del rival, resultado…) sigue usando la carta compacta de
// ./cards.js. Ambos renders comparten datos y helpers; solo cambia el chasis.
//
// Todas las clases internas van con prefijo `tdl-` para no chocar con los
// estilos globales (.chip, .stat, .card-name…). Todo el interior se mide en
// em/% y la carta fija su font-size en cqw → la proporción es constante a
// cualquier ancho (el contenedor .tdl-slot declara la container query).

import { esc } from './dom.js';
import { playerOVR } from '../engine/ovr.js';
import { managerNationStatBonus } from '../engine/chemistry.js';
import { playerInitials, portraitPathForManager, portraitPathForPlayer, artworkPathForItem } from '../data/playerAssets.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { localizeEra, localizeItem, localizeNation, localizeTrait, t } from '../data/i18n.js';
import { POSITION_LABEL } from './cards.js';

const FIELD_STATS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
const GK_STATS = ['reflexes', 'handling', 'positioning'];

const cap = (s) => String(s).charAt(0).toUpperCase() + String(s).slice(1);

// Fondo a sangre por tipo y rareza. Jugador y DT comparten el player-dt.
function backgroundFor(kind, rarity) {
  const set = kind === 'item' ? 'item' : 'player';
  const bg = UI_ASSETS.cards.bg;
  return bg[`${set}${cap(rarity)}`] || bg[`${set}Common`];
}

const SYNERGY_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18 L9 8 L14 13 L21 5"/><circle cx="21" cy="5" r="1.8" fill="currentColor"/></svg>`;

function statRows(player, bonus = 0) {
  const rows = player.position === 'GK'
    ? GK_STATS.map((k) => [t(`card.stat.${k}`), player.gk ? player.gk[k] : 0])
    : FIELD_STATS.map((k) => [t(`card.stat.${k}`), player.stats ? player.stats[k] : 0]);
  return rows.map(([label, base]) => {
    const val = (base || 0) + bonus;
    return `<div class="tdl-stat${bonus > 0 ? ' tdl-stat--mgr' : ''}">
      <span class="tdl-stat-label">${esc(label)}</span>
      <span class="tdl-stat-bar"><span class="tdl-stat-fill" style="width:${Math.min(100, val)}%"></span></span>
      <span class="tdl-stat-val">${val}</span>
    </div>`;
  }).join('');
}

function metaRow(nation, extra, trait) {
  return `<div class="tdl-meta">
    <span class="tdl-chip"><img class="tdl-flag" src="${esc(flagSrcForNation(nation))}" alt="" loading="eager" decoding="async" data-hide-on-error="true" />${esc(localizeNation(nation))}</span>
    ${extra ? `<span class="tdl-chip">${esc(extra)}</span>` : ''}
    ${trait ? `<span class="tdl-chip tdl-chip--trait">${esc(localizeTrait(trait))}</span>` : ''}
  </div>`;
}

function synergyLine(style) {
  return t('card.synergy', { type: t(`admin.tactical.${style}`) });
}

function modChip(label, pct) {
  const cls = pct > 0 ? 'up' : pct < 0 ? 'down' : 'flat';
  const sign = pct > 0 ? '+' : pct < 0 ? '−' : '';
  return `<div class="tdl-mod"><span class="tdl-mod-k">${esc(label)}</span><span class="tdl-mod-v ${cls}">${sign}${Math.abs(pct)}%</span></div>`;
}

// Chasis común: contenedor con container query + carta a sangre. `body` es el
// interior de .tdl-content; `overlay` (cinta de poseída, badge ×N) va FUERA de
// .tdl-content para no atenuarse ni quedar bajo el arte. `extra` añade clases.
function chassis({ kind, rarity, idValue, extra = '', body, overlay = '' }) {
  const cls = ['tdl-card', `tdl-card--${kind}`, `tdl-rar-${rarity}`];
  if (extra) cls.push(extra);
  const idAttr = idValue ? ` data-id="${esc(idValue)}"` : '';
  return `<div class="tdl-slot"><div class="${cls.join(' ')}"${idAttr} style="background-image:url('${esc(backgroundFor(kind, rarity))}')">
    <div class="tdl-content">${body}</div>${overlay}
  </div></div>`;
}

function portrait(src, name) {
  return `<div class="tdl-portrait" aria-hidden="true"><div class="tdl-portrait-inner">
    <img src="${esc(src)}" alt="" loading="eager" decoding="async" data-hide-on-error="true" />
    <span class="tdl-portrait-fallback">${esc(playerInitials(name))}</span>
  </div></div>`;
}

// === Carta de jugador ======================================================
// opts: { manager } suma el bonus del DT connacional (sube OVR/stats y los
// recolorea), { idValue } la identifica, { disabled } la marca como ya poseída.
// { clickable } la hace seleccionable (clase .clickable); { injured }/{ suspended }
// (con { injuryMatches }) la marcan como no disponible (atenuada, no clicable e
// icono de estado) — igual que la carta compacta, para el selector del tablero.
export function playerShowcaseHTML(player, opts = {}) {
  const bonus = managerNationStatBonus(player, opts.manager);
  const ovr = playerOVR(player, opts.manager);
  const owned = Boolean(opts.disabled);
  const injured = Boolean(opts.injured);
  const suspended = Boolean(opts.suspended) && !injured;
  const unavailable = injured || suspended;
  const extra = [
    owned ? 'tdl-card--owned' : '',
    unavailable ? 'card--unavailable' : '',
    (opts.clickable && !unavailable) ? 'clickable' : '',
  ].filter(Boolean).join(' ');
  // Iconos de baja reutilizando las clases de la carta compacta (overlay, fuera
  // de .tdl-content para que no los recorte la atenuación del contenido).
  const statusIcon = injured
    ? `<span class="card-injury" aria-hidden="true"></span><span class="card-injury-count" aria-hidden="true">${esc(opts.injuryMatches ?? '')}</span>`
    : suspended
      ? `<span class="card-redcard" aria-hidden="true"></span>`
      : '';
  const body = `
    <div class="tdl-head">
      <div class="tdl-ovr${bonus > 0 ? ' tdl-ovr--mgr' : ''}">${ovr}</div>
      <div class="tdl-pos">${esc(POSITION_LABEL[player.position])}</div>
    </div>
    ${portrait(portraitPathForPlayer(player), player.name)}
    <div class="tdl-namebar"><div class="tdl-name">${esc(player.name)}</div></div>
    ${metaRow(player.nation, localizeEra(player.era), player.trait)}
    <div class="tdl-panel"><div class="tdl-stats">${statRows(player, bonus)}</div></div>`;
  const overlay = (owned ? `<div class="tdl-owned"><span aria-hidden="true">✓</span> ${esc(t('card.owned'))}</div>` : '') + statusIcon;
  return chassis({ kind: 'player', rarity: player.rarity, idValue: opts.idValue, extra, body, overlay });
}

// === Carta de director técnico (DT) ========================================
export function managerShowcaseHTML(manager, opts = {}) {
  if (!manager) return '';
  const mods = manager.mods || {};
  const body = `
    <div class="tdl-head tdl-head--dt"><div class="tdl-badge-dt">${esc(t('card.manager.badge'))}</div></div>
    ${portrait(portraitPathForManager(manager), manager.name)}
    <div class="tdl-namebar"><div class="tdl-name">${esc(manager.name)}</div></div>
    ${metaRow(manager.nation, manager.year ? String(manager.year) : '')}
    ${manager.style ? `<div class="tdl-synergy">${SYNERGY_ICON}<span>${esc(synergyLine(manager.style))}</span></div>` : ''}
    <div class="tdl-mods">
      ${modChip(t('ratings.attack'), Number(mods.attack) || 0)}
      ${modChip(t('ratings.midfield'), Number(mods.midfield) || 0)}
      ${modChip(t('ratings.defense'), Number(mods.defense) || 0)}
    </div>`;
  return chassis({ kind: 'manager', rarity: manager.rarity, idValue: opts.idValue, body });
}

// === Carta de objeto ========================================================
// opts: { idValue } la identifica, { stack } (>1) muestra ×N. El hueco .art
// recibe el arte cuadrado del objeto (assets/items/{id}.webp); si no hay imagen,
// el hueco queda vacío (sin icono ni placeholder).
export function itemShowcaseHTML(item, opts = {}) {
  const overlay = opts.stack > 1
    ? `<div class="tdl-stack" title="${esc(t('card.itemStack', { n: opts.stack }))}">×${opts.stack}</div>`
    : '';
  const synergy = item.synergyType
    ? `<div class="tdl-item-synergy">${esc(synergyLine(item.synergyType))}</div>`
    : '';
  const body = `
    <div class="tdl-head"><div class="tdl-typewrap"><span class="tdl-type">${esc(localizeItem(item, 'type')).toUpperCase()}</span></div></div>
    <div class="tdl-namebar"><div class="tdl-name">${esc(localizeItem(item, 'name'))}</div></div>
    <div class="tdl-art"><div class="tdl-art-inner">
      <img class="tdl-art-img" src="${esc(artworkPathForItem(item))}" alt="" loading="lazy" decoding="async" data-hide-on-error="true" />
    </div></div>
    <div class="tdl-panel tdl-desc"><p>${esc(localizeItem(item, 'desc'))}</p>${synergy}</div>`;
  return chassis({ kind: 'item', rarity: item.rarity, idValue: opts.idValue, body, overlay });
}
