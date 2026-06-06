// Torre de Leyendas — Scouting previo: identidad, ratings y once del rival.

import { esc, POSITION_LABEL } from './cards.js';
import { LINES } from '../data/config.js';
import { playerInitials, playerSurname, portraitPathForName } from '../data/playerAssets.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { localizeAchievement, localizeOpponentName, t } from '../data/i18n.js';

const LINE_TOP = { GK: 86, DEF: 65, MID: 43, FWD: 20 };

function spreadLeft(n) {
  if (n <= 1) return [50];
  // Cuantos menos jugadores en la línea, más centrados (no pegados a la banda).
  // Una pareja (p. ej. los dos delanteros del 4-4-2) debe ir hacia el centro.
  const margin = n <= 2 ? 30 : n === 3 ? 18 : 12;
  return Array.from({ length: n }, (_, i) => margin + ((100 - margin * 2) * i) / (n - 1));
}

function positions(opponent) {
  return LINES.flatMap((line) => {
    const players = opponent.lineup.filter((p) => p.position === line);
    const xs = spreadLeft(players.length);
    return players.map((player, i) => ({ player, x: xs[i], y: LINE_TOP[line] }));
  });
}

function field(opponent) {
  const nodes = positions(opponent).map(({ player, x, y }) => `
    <div class="chip-anchor" style="left:${x}%;top:${y}%">
      <div class="field-chip scout-chip">
        <span class="chip-face" aria-hidden="true">
          <img src="${esc(portraitPathForName(player.name))}" alt="" loading="lazy" decoding="async" data-hide-on-error="true" />
          <span>${esc(playerInitials(player.name))}</span>
        </span>
        <span class="chip-ovr">${player.ovr ?? '—'}</span>
        <span class="chip-init">${POSITION_LABEL[player.position]}</span>
        <span class="chip-name" title="${esc(player.name)}">${esc(playerSurname(player.name))}</span>
      </div>
    </div>`).join('');
  return `
    <div class="field scout-field">
      <svg class="field-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect x="1" y="1" width="98" height="98" rx="3" class="fl" />
        <line x1="1" y1="50" x2="99" y2="50" class="fl" />
        <circle cx="50" cy="50" r="9" class="fl" />
        <rect x="30" y="1" width="40" height="12" class="fl" />
        <rect x="30" y="87" width="40" height="12" class="fl" />
      </svg>
      ${nodes}
    </div>`;
}

function ratings(opponent) {
  const rows = [
    ['ATA', opponent.ratings.attack, UI_ASSETS.icons.attack],
    ['MED', opponent.ratings.midfield, UI_ASSETS.icons.midfield],
    ['DEF', opponent.ratings.defense, UI_ASSETS.icons.defense],
    ['POR', opponent.ratings.gk, UI_ASSETS.icons.gk],
  ];
  return `<div class="scout-ratings arcade-panel">
    ${rows.map(([label, value, icon]) => `
      <div class="scout-rating">
        <img src="${icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span>${label}</span>
        <b>${value}</b>
        <i><span style="width:${value}%"></span></i>
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
      <div class="play-bar">
        <button id="scout-continue" class="primary big glass-cta">${t('scouting.continue')}</button>
      </div>
    </section>`;
  root.querySelector('#scout-continue').addEventListener('click', handlers.onContinue);
}
