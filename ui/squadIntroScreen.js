// Torre de Leyendas — Presentación de la plantilla inicial (arranque de run).
// Antes del primer sobre del nivel 1 se muestra el equipo completo generado:
// identidad (nombre + bandera), ratings, once titular sobre el campo (estilo
// scouting) y suplentes. Tocar cualquier carta abre su ficha completa con el
// mismo modal de la pantalla de armado.

import { POSITION_LABEL } from './cards.js';
import { playerShowcaseHTML } from './showcaseCard.js';
import { esc } from './dom.js';
import { LINES } from '../data/config.js';
import { liveRatings, assignLineToSlots, isStarter } from '../state/run.js';
import { playerOVR } from '../engine/ovr.js';
import { playerInitials, portraitPathForPlayer } from '../data/playerAssets.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { t } from '../data/i18n.js';
import { lineupFieldHTML, positionSlots, staticChipHTML } from './lineupBoard.js';

// Coordenadas del once: huecos visibles por línea (assignLineToSlots) colocados
// con la MISMA lógica del tablero táctico (lineupBoard): idéntico esquema.
function lineupPositions(state) {
  return LINES.flatMap((line) => {
    const slots = assignLineToSlots(state.formation, line, state.starting11[line] || [])
      .filter((slot) => slot.player);
    return positionSlots(state.formation, line, slots);
  });
}

function field(state) {
  return lineupFieldHTML({
    formation: state.formation,
    slots: lineupPositions(state),
    fieldClass: 'scout-field squad-field',
    chip: (slot) => staticChipHTML(slot.player, {
      portraitSrc: portraitPathForPlayer(slot.player),
      flagSrc: flagSrcForNation(slot.player.nation),
      chipClass: 'squad-chip',
      interactive: true,
      ariaLabel: t('build.viewStatsAria', { name: slot.player.name }),
    }),
  });
}

function ratings(state) {
  const r = liveRatings(state);
  const rows = [
    [t('ratings.attack'), Math.round(r.attack), UI_ASSETS.icons.attack],
    [t('ratings.midfield'), Math.round(r.midfield), UI_ASSETS.icons.midfield],
    [t('ratings.defense'), Math.round(r.defense), UI_ASSETS.icons.defense],
    [t('ratings.gk'), Math.round(r.gk), UI_ASSETS.icons.gk],
  ];
  return `<div class="scout-ratings arcade-panel">
    ${rows.map(([label, value, icon]) => `
      <div class="scout-rating">
        <img src="${icon}" alt="" aria-hidden="true" loading="eager" decoding="async" />
        <span>${label}</span>
        <b>${value}</b>
        <i><span style="width:${Math.min(100, value)}%"></span></i>
      </div>`).join('')}
  </div>`;
}

// Banco con la misma carta de suplente del tablero táctico (retrato con
// bandera, OVR + posición y nombre), envuelto en .team-roster para reutilizar
// exactamente sus estilos. Sin "+" ni "i": aquí la carta solo abre su ficha.
function benchStrip(subs) {
  if (!subs.length) return `<p class="empty-note">${t('build.noSubs')}</p>`;
  return `<div class="bench-strip squad-bench">
    ${subs.map((p) => `
      <button class="bench-item rarity-${p.rarity}" data-uid="${p.uid}"
              aria-label="${esc(t('build.viewStatsAria', { name: p.name }))}">
        <span class="bench-face" aria-hidden="true">
          <img src="${esc(portraitPathForPlayer(p))}" alt="" loading="eager" decoding="async" data-hide-on-error="true" />
          <span>${esc(playerInitials(p.name))}</span>
          <img class="chip-flag" src="${esc(flagSrcForNation(p.nation))}" alt="" loading="eager" decoding="async" />
        </span>
        <span class="bench-topline" aria-hidden="true">
          <span class="bench-ovr">${playerOVR(p)}</span>
          <span class="bench-pos">${POSITION_LABEL[p.position]}</span>
        </span>
        <span class="bench-name">${esc(p.name)}</span>
      </button>`).join('')}
  </div>`;
}

export function renderSquadIntro(root, state, handlers) {
  const subs = state.squad
    .filter((p) => !isStarter(state, p))
    .sort((a, b) => playerOVR(b) - playerOVR(a));
  const flagHTML = state.team.nation ? `
        <div class="scout-team-meta">
          <div class="scout-team-card" aria-hidden="true">
            <img class="scout-flag-img" src="${esc(flagSrcForNation(state.team.nation))}" alt="" loading="eager" decoding="async" />
          </div>
        </div>` : '';

  root.innerHTML = `
    <section class="screen scouting-screen pixel-screen squad-intro-screen">
      <header class="scout-hero" style="--team-primary:${esc(state.team.color)};--team-secondary:${esc(state.team.color)}">
        <div>
          <div class="scout-eyebrow">
            <div class="level-badge">${t('generic.level', { level: state.level })}</div>
            <p class="scout-kicker">${t('squadIntro.kicker')}</p>
          </div>
          <h1 class="large-title">${esc(state.team.name)}</h1>
        </div>
        ${flagHTML}
      </header>
      ${ratings(state)}
      <h2 class="section-title">${t('squadIntro.eleven')}</h2>
      ${field(state)}
      <div class="team-roster arcade-panel">
        <div class="team-panel-head roster-head">
          <div>
            <h2>${t('squadIntro.bench')}</h2>
          </div>
        </div>
        ${benchStrip(subs)}
      </div>
      <p class="scout-note">${t('squadIntro.note')}</p>
      <div class="play-bar action-bar">
        <button id="squad-continue" class="primary big glass-cta">${t('squadIntro.continue')}</button>
      </div>

      <div class="player-modal" id="playerModal" hidden>
        <div class="player-modal-backdrop" data-close></div>
        <div class="player-modal-card" role="dialog" aria-modal="true" aria-label="${t('build.statsDialog')}">
          <button class="player-modal-close" data-close aria-label="${t('generic.close')}">
            <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.4 2.4 L9.6 9.6 M9.6 2.4 L2.4 9.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" fill="none" /></svg>
          </button>
          <div id="playerModalBody"></div>
        </div>
      </div>
    </section>`;

  root.querySelector('#squad-continue').addEventListener('click', handlers.onContinue);
  wirePlayerModal(root, state);
}

// Modal con la carta completa: cualquier ficha del campo o del banquillo lo abre.
function wirePlayerModal(root, state) {
  const modal = root.querySelector('#playerModal');
  const body = root.querySelector('#playerModalBody');

  const open = (uid) => {
    const player = state.squad.find((p) => p.uid === uid);
    if (!player) return;
    body.innerHTML = playerShowcaseHTML(player, { manager: state.manager });
    modal.hidden = false;
  };
  const close = () => { modal.hidden = true; body.innerHTML = ''; };

  root.querySelectorAll('.squad-chip, .squad-bench .bench-item').forEach((node) => {
    node.addEventListener('click', () => open(node.dataset.uid));
  });
  modal.querySelectorAll('[data-close]').forEach((node) => node.addEventListener('click', close));
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape' && !modal.hidden) close();
    if (modal.hidden) document.removeEventListener('keydown', onEsc);
  });
}
