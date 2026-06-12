// Torre de Leyendas — Presentación de la plantilla inicial (arranque de run).
// Antes del primer sobre del nivel 1 se muestra el equipo completo generado:
// identidad (nombre + bandera), ratings, once titular sobre el campo (estilo
// scouting) y suplentes. Tocar cualquier carta abre su ficha completa con el
// mismo modal de la pantalla de armado.

import { playerCardHTML, POSITION_LABEL } from './cards.js';
import { esc } from './dom.js';
import { LINES } from '../data/config.js';
import { liveRatings, assignLineToSlots, isStarter } from '../state/run.js';
import { playerOVR } from '../engine/ovr.js';
import { playerInitials, playerSurname, portraitPathForPlayer } from '../data/playerAssets.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { t } from '../data/i18n.js';
import { LINE_TOP, lineSpreadX, PITCH_MARKINGS } from './pitchArt.js';

// Altura del rol ENG (enganche/creación), entre el mediocampo y el ataque.
const ENG_TOP = 30;

// Coordenadas del once: huecos visibles por línea (assignLineToSlots, igual que
// el tablero táctico) agrupados por rol y repartidos como en el scouting.
function lineupPositions(state) {
  const out = [];
  for (const line of LINES) {
    const slots = assignLineToSlots(state.formation, line, state.starting11[line] || [])
      .filter((slot) => slot.player);
    const byRole = new Map();
    for (const slot of slots) {
      const role = slot.role || line;
      if (!byRole.has(role)) byRole.set(role, []);
      byRole.get(role).push(slot);
    }
    for (const [role, roleSlots] of byRole) {
      const xs = lineSpreadX(roleSlots.length);
      const y = role === 'ENG' ? ENG_TOP : LINE_TOP[line];
      roleSlots.forEach((slot, i) => out.push({ player: slot.player, x: xs[i], y }));
    }
  }
  return out;
}

function field(state) {
  const nodes = lineupPositions(state).map(({ player, x, y }, i) => `
    <div class="chip-anchor" style="left:${x}%;top:${y}%;--i:${i}">
      <button class="field-chip filled squad-chip rarity-${player.rarity}" data-uid="${player.uid}"
              aria-label="${esc(t('build.viewStatsAria', { name: player.name }))}">
        <span class="chip-face" aria-hidden="true">
          <img src="${esc(portraitPathForPlayer(player))}" alt="" loading="lazy" decoding="async" data-hide-on-error="true" />
          <span>${esc(playerInitials(player.name))}</span>
        </span>
        <span class="chip-ovr">${playerOVR(player)}</span>
        <span class="chip-init">${POSITION_LABEL[player.position]}</span>
        <span class="chip-name" title="${esc(player.name)}">${esc(playerSurname(player.name))}</span>
      </button>
    </div>`).join('');
  return `
    <div class="field scout-field squad-field">
      <svg class="field-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${PITCH_MARKINGS}
      </svg>
      ${nodes}
    </div>`;
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
        <img src="${icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span>${label}</span>
        <b>${value}</b>
        <i><span style="width:${Math.min(100, value)}%"></span></i>
      </div>`).join('')}
  </div>`;
}

function benchStrip(subs) {
  if (!subs.length) return `<p class="empty-note">${t('build.noSubs')}</p>`;
  return `<div class="bench-strip squad-bench">
    ${subs.map((p) => `
      <button class="bench-item rarity-${p.rarity}" data-uid="${p.uid}"
              aria-label="${esc(t('build.viewStatsAria', { name: p.name }))}">
        <span class="bench-face" aria-hidden="true">
          <img src="${esc(portraitPathForPlayer(p))}" alt="" loading="lazy" decoding="async" data-hide-on-error="true" />
          <span>${esc(playerInitials(p.name))}</span>
        </span>
        <span class="bench-ovr">${playerOVR(p)}</span>
        <span class="bench-name">${esc(p.name)}</span>
        <span class="bench-pos">${POSITION_LABEL[p.position]}</span>
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
            <img class="scout-flag-img" src="${esc(flagSrcForNation(state.team.nation))}" alt="" loading="lazy" decoding="async" />
          </div>
        </div>` : '';

  root.innerHTML = `
    <section class="screen scouting-screen pixel-screen squad-intro-screen">
      <header class="scout-hero" style="--team-primary:${esc(state.team.color)};--team-secondary:${esc(state.team.color)}">
        <div>
          <div class="level-badge">${t('generic.level', { level: state.level })}</div>
          <p class="scout-kicker">${t('squadIntro.kicker')}</p>
          <h1 class="large-title">${esc(state.team.name)}</h1>
          <p class="scout-achievement">${t('scouting.formation', { formation: state.formation })} · ${t('squadIntro.cards', { count: state.squad.length })}</p>
        </div>
        ${flagHTML}
      </header>
      ${ratings(state)}
      <h2 class="section-title">${t('squadIntro.eleven')}</h2>
      ${field(state)}
      <h2 class="section-title">${t('squadIntro.bench')}</h2>
      ${benchStrip(subs)}
      <p class="scout-note">${t('squadIntro.note')}</p>
      <div class="play-bar action-bar">
        <button id="squad-continue" class="primary big glass-cta">${t('squadIntro.continue')}</button>
      </div>

      <div class="player-modal" id="playerModal" hidden>
        <div class="player-modal-backdrop" data-close></div>
        <div class="player-modal-card" role="dialog" aria-modal="true" aria-label="${t('build.statsDialog')}">
          <button class="player-modal-close" data-close aria-label="${t('generic.close')}">✕</button>
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
    body.innerHTML = playerCardHTML(player);
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
