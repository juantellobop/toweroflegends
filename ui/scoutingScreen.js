// Torre de Leyendas — Scouting previo: identidad, ratings y once del rival.

import { esc } from './dom.js';
import { managerCardHTML } from './cards.js';
import { LINES } from '../data/config.js';
import { teamRadarStats } from '../engine/teamRatings.js';
import { portraitPathForName, portraitPathForPlayer } from '../data/playerAssets.js';
import { preloadImages } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { localizeOpponentName, t } from '../data/i18n.js';
import { lineupFieldHTML, layoutInformative, staticChipHTML } from './lineupBoard.js';
import { teamRadarHTML } from './radar.js';
import { sceneSources } from '../match/scenes.js';

// Al conocer al rival, el partido es inminente: calienta en segundo plano lo que
// viene para que no haya esperas. Las escenas (~2,9 MB) se descargan mientras se
// scoutea/arma equipo y quedan en caché inmutable (?v=) ya tras el primer partido;
// los retratos de ambos onces dejan listas la pantalla de armar equipo y los
// highlights. Prioridad baja: no compiten con la UI visible del scouting.
function warmUpcomingMatch(state) {
  const squad = state.squad || [];
  const rivals = state.opponent?.lineup || [];
  preloadImages(sceneSources(), { priority: 'low' });
  preloadImages([
    ...squad.map((p) => portraitPathForPlayer(p)),
    ...squad.map((p) => flagSrcForNation(p.nation)),
    ...rivals.map((p) => portraitPathForName(p.name)),
  ], { priority: 'low' });
}

// Mismo esquema que el tablero táctico propio: huecos por línea posicionados
// con la misma lógica (alturas, reparto y matices del dibujo rival).
function positions(opponent) {
  // Reparto informativo equilibrado por fila (4 defensas equidistantes; el medio
  // de 3 sin enganche se adelanta hacia la mitad del campo).
  const slots = LINES.flatMap((line) =>
    opponent.lineup
      .filter((p) => p.position === line)
      .map((player, slotIndex) => ({ player, line, slotIndex, role: line })));
  return layoutInformative(slots);
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
  // Radar del rival (5 ejes): los ratings efectivos —los mismos que usará la
  // simulación— + el físico estimado. En el MISMO contenedor (.ratings-glass)
  // que el radar del equipo propio en el armado, para idéntico estilo.
  const color = opponent.color || opponent.colors?.primary || 'var(--arcade-cyan)';
  return `<div class="ratings-glass glass">
    ${teamRadarHTML(teamRadarStats(opponent), { color })}
  </div>`;
}

// Fila de cabecera de la columna lateral: radar + carta de DT (si la edición
// tiene uno). Reutiliza .team-header-row del armado para el mismo reparto/orden.
function ratingsRow(opponent) {
  return `<div class="team-header-row">
    ${ratings(opponent)}
    ${opponent.manager ? `<div class="manager-glass arcade-panel">${managerCardHTML(opponent.manager)}</div>` : ''}
  </div>`;
}

export function renderScouting(root, state, handlers) {
  const opponent = state.opponent;
  warmUpcomingMatch(state);
  // Mismo diseño de dos columnas que el armado (team-select-screen): el once del
  // rival ocupa el panel izquierdo (tablero) y su identidad/ratings/DT la columna
  // lateral derecha.
  root.innerHTML = `
    <section class="screen scouting-screen pixel-screen team-select-screen" style="--team-primary:${opponent.colors.primary};--team-secondary:${opponent.colors.secondary}">
      <div class="team-layout">
        <main class="team-field-panel arcade-panel">
          <div class="team-panel-head">
            <div><h2>${t('scouting.opponentEleven')}</h2></div>
          </div>
          ${field(opponent)}
        </main>

        <aside class="team-side">
          <header class="scout-hero">
            <div>
              <div class="scout-eyebrow">
                <div class="level-badge">${t('generic.level', { level: state.level })}</div>
                <p class="scout-kicker">${t('scouting.report')}</p>
              </div>
              <h1 class="large-title">${esc(localizeOpponentName(opponent))}</h1>
            </div>
            <div class="scout-team-meta">
              <div class="scout-team-card" aria-hidden="true">
                <img class="scout-flag-img" src="${esc(flagSrcForNation(opponent.name, [opponent.colors.primary, opponent.colors.secondary]))}" alt="" loading="eager" decoding="async" />
              </div>
              <div class="scout-strength"><span>${t('scouting.strength')}</span><b>${opponent.strength}</b></div>
            </div>
          </header>
          ${ratingsRow(opponent)}
        </aside>
      </div>

      <div class="play-bar action-bar">
        <button id="scout-continue" class="primary big glass-cta">${t('scouting.continue')}</button>
      </div>
    </section>`;
  root.querySelector('#scout-continue').addEventListener('click', handlers.onContinue);
}
