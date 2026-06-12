// Torre de Leyendas — Scouting previo: identidad, ratings y once del rival.

import { esc } from './dom.js';
import { LINES } from '../data/config.js';
import { calcularRatings } from '../engine/teamRatings.js';
import { portraitPathForName } from '../data/playerAssets.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { localizeAchievement, localizeOpponentName, t } from '../data/i18n.js';
import { lineupFieldHTML, positionSlots, staticChipHTML } from './lineupBoard.js';

// Mismo esquema que el tablero táctico propio: huecos por línea posicionados
// con la misma lógica (alturas, reparto y matices del dibujo rival).
function positions(opponent) {
  return LINES.flatMap((line) => {
    const players = opponent.lineup.filter((p) => p.position === line);
    const slots = players.map((player, slotIndex) => ({ player, line, slotIndex, role: line }));
    return positionSlots(opponent.formation, line, slots);
  });
}

function field(opponent) {
  const flagSrc = flagSrcForNation(opponent.name, [opponent.colors.primary, opponent.colors.secondary]);
  return lineupFieldHTML({
    formation: opponent.formation,
    slots: positions(opponent),
    fieldClass: 'scout-field',
    chip: (slot) => staticChipHTML(slot.player, {
      portraitSrc: portraitPathForName(slot.player.name),
      flagSrc,
      chipClass: 'scout-chip',
    }),
  });
}

function ratings(opponent) {
  // Ratings efectivos: los mismos que usará la simulación (incluyen el
  // modificador de la formación del rival), no los base precomputados.
  const r = calcularRatings(opponent);
  const rows = [
    [t('ratings.attack'), Math.round(r.attack), UI_ASSETS.icons.attack],
    [t('ratings.midfield'), Math.round(r.midfield), UI_ASSETS.icons.midfield],
    [t('ratings.defense'), Math.round(r.defense), UI_ASSETS.icons.defense],
    [t('ratings.gk'), Math.round(r.gk), UI_ASSETS.icons.gk],
  ];
  return `<div class="scout-ratings arcade-panel">
    ${rows.map(([label, value, icon]) => `
      <div class="scout-rating">
        <img src="${icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span>${label}</span>
        <b>${value}</b>
        <i><span style="width:${Math.min(100, value)}%"></span></i>
      </div>`).join('')}
  </div>`;
}

export function renderScouting(root, state, handlers) {
  const opponent = state.opponent;
  root.innerHTML = `
    <section class="screen scouting-screen pixel-screen">
      <header class="scout-hero" style="--team-primary:${opponent.colors.primary};--team-secondary:${opponent.colors.secondary}">
        <div>
          <div class="level-badge">${t('generic.level', { level: state.level })}</div>
          <p class="scout-kicker">${t('scouting.report')}</p>
          <h1 class="large-title">${esc(localizeOpponentName(opponent))}</h1>
          <p class="scout-achievement">${esc(localizeAchievement(opponent.achievement))} · ${t('scouting.formation', { formation: opponent.formation })}</p>
        </div>
        <div class="scout-team-meta">
          <div class="scout-team-card" aria-hidden="true">
            <img class="scout-flag-img" src="${esc(flagSrcForNation(opponent.name, [opponent.colors.primary, opponent.colors.secondary]))}" alt="" loading="lazy" decoding="async" />
          </div>
          <div class="scout-strength"><span>${t('scouting.strength')}</span><b>${opponent.strength}</b></div>
        </div>
      </header>
      ${ratings(opponent)}
      <h2 class="section-title">${t('scouting.opponentEleven')}</h2>
      ${field(opponent)}
      <p class="scout-note">${t('scouting.note')}</p>
      <div class="play-bar action-bar">
        <button id="scout-continue" class="primary big glass-cta">${t('scouting.continue')}</button>
      </div>
    </section>`;
  root.querySelector('#scout-continue').addEventListener('click', handlers.onContinue);
}
