// Torre de Leyendas — Armar equipo (§4.3 del plan UI/UX, §8.4).
// Cabecera de cristal fija con los cuatro ratings de equipo + química, en
// numerales tabulares, que se actualizan en vivo (animación de conteo) al mover
// jugadores. Cuerpo: campo en SVG con huecos por línea según la formación;
// tocar hueco → selector; tocar ficha → la quita. Enlaces de química sutiles.
// Suplentes en una tira inferior. Botón "Jugar" flotante (cristal).

import { playerCardHTML, itemCardHTML, POSITION_LABEL, LINE_LABEL } from './cards.js';
import { esc } from './dom.js';
import {
  liveRatings, liveChemistry, liveItemDelta, isLineupComplete, isStarter, formationSlots,
  canPlacePlayerInSlot, assignLineToSlots,
} from '../state/run.js';
import { playerOVR } from '../engine/ovr.js';
import { chemNation } from '../engine/chemistry.js';
import { chemTeamBonus } from '../engine/items.js';
import { FORMATIONS, LINES, chemFormationLinks, formationLineSlots, formationType } from '../data/config.js';
import { countTo } from '../match/feedback.js';
import { playerInitials, playerSurname, portraitPathForPlayer } from '../data/playerAssets.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { localizeOpponentName, t } from '../data/i18n.js';
import { PITCH_MARKINGS } from './pitchArt.js';

// Posición vertical (top %) de cada línea en el campo, de abajo (POR) a arriba (DEL).
const LINE_TOP = { GK: 86, DEF: 65, MID: 43, ENG: 31, FWD: 20 };
const FORMATION_LINE_TOP = {
  '4-3-1-2': { GK: 92, DEF: 73, MID: 53, ENG: 31, FWD: 8 },
  // 4-2-3-1: pivotes (MID) por detrás de la línea de creación (ENG) y el delantero.
  '4-2-3-1': { GK: 92, DEF: 73, MID: 52, ENG: 30, FWD: 8 },
};

// Ajuste fino (dx/dy en % del campo) por hueco concreto, sobre la posición de su
// línea. Dibuja el rol dentro del dibujo: el MC más defensivo se retrasa
// (4-3-3, 3-5-2, 5-3-2, 4-3-1-2, doble pivote del 3-4-3), los extremos parten
// algo más abajo (4-3-3, 4-2-4) y los laterales del 5-3-2 se proyectan.
const SLOT_NUDGES = {
  '4-3-3': { 'MID:1': { dy: 5 }, 'FWD:0': { dy: 4 }, 'FWD:2': { dy: 4 } },
  '3-5-2': { 'MID:2': { dy: 5 } },
  '5-3-2': { 'MID:1': { dy: 5 }, 'DEF:0': { dy: -4 }, 'DEF:4': { dy: -4 } },
  '4-3-1-2': { 'MID:1': { dy: 5 } },
  '3-4-3': { 'MID:1': { dy: 4 }, 'MID:2': { dy: 4 } },
  '4-2-4': { 'FWD:0': { dy: 4 }, 'FWD:3': { dy: 4 } },
};

// Separación mínima entre centros de fichas (unidades del viewBox 0-100).
// Una ficha mide ~64px sobre un campo de ≤460px (≈14-18 unidades según la
// pantalla): por debajo de este hueco las cartas se tocan y tapan el enlace
// de química que se dibuja entre ellas.
const MIN_CHIP_GAP = 20;

// Garantiza el hueco mínimo re-extendiendo la línea centrada en 50. Mantiene
// el orden de los huecos y el centrado; con n≤5 el span nunca pisa las bandas.
function withMinGap(xs) {
  if (xs.length < 2) return xs;
  let gap = Infinity;
  for (let i = 1; i < xs.length; i++) gap = Math.min(gap, xs[i] - xs[i - 1]);
  if (gap >= MIN_CHIP_GAP) return xs;
  const start = 50 - (MIN_CHIP_GAP * (xs.length - 1)) / 2;
  return xs.map((_, i) => start + MIN_CHIP_GAP * i);
}

function spreadLeft(n, line, formation) {
  if (n <= 0) return [];
  if (n === 1) return [50];
  if (formation === '4-3-1-2' && line === 'FWD' && n === 2) return [28, 72];
  // Trío de mediocampo compacto (interiores cerca del pivote): mismo esquema
  // en 4-3-3, 5-3-2 y 4-3-1-2.
  if (['4-3-3', '5-3-2', '4-3-1-2'].includes(formation) && line === 'MID' && n === 3) return [22, 50, 78];
  if ((formation === '4-2-3-1' || formation === '4-2-4') && line === 'MID' && n === 2) return [30, 70]; // pivotes
  if (formation === '4-2-3-1' && line === 'ENG' && n === 3) return [18, 50, 82]; // creación
  if (line === 'FWD') {
    // La dupla va abierta (4-4-2, 3-5-2, 5-3-2): con [42,58] las dos cartas
    // se tocaban y el enlace de química entre ellas quedaba oculto.
    if (n === 2) return [33, 67];
    if (n === 3) return [16, 50, 84];
  }
  if (line === 'DEF' && n === 3) return [26, 50, 74];
  // Margen 10: las líneas llenas (4-5 jugadores) abren casi todo el ancho del
  // tablero, que en desktop ahora es más generoso.
  const margin = line === 'GK' ? 42 : 10;
  return Array.from({ length: n }, (_, i) => margin + ((100 - margin * 2) * i) / (n - 1));
}

function positionSlots(formation, line, slots) {
  const byRole = new Map();
  for (const slot of slots) {
    const role = slot.role || line;
    if (!byRole.has(role)) byRole.set(role, []);
    byRole.get(role).push(slot);
  }

  for (const [role, roleSlots] of byRole.entries()) {
    const xs = withMinGap(spreadLeft(roleSlots.length, role, formation));
    const top = FORMATION_LINE_TOP[formation]?.[role] ?? LINE_TOP[role] ?? LINE_TOP[line];
    roleSlots.forEach((slot, i) => {
      const nudge = SLOT_NUDGES[formation]?.[`${slot.line}:${slot.slotIndex}`];
      slot.x = xs[i] + (nudge?.dx || 0);
      slot.y = top + (nudge?.dy || 0);
    });
  }

  return slots;
}

function slotLabel(line, role) {
  if (role === 'ENG') return 'ENG';
  return POSITION_LABEL[line];
}

// Coordenadas (x%,y%) de cada jugador titular, por línea, para fichas y enlaces.
function lineupPositions(state) {
  const pos = [];
  for (const line of LINES) {
    const players = state.starting11[line] || [];
    const slots = positionSlots(state.formation, line, assignLineToSlots(state.formation, line, players));
    slots.forEach((slot) => pos.push(slot));
  }
  return pos;
}

// Enlaces de química del campo, espejando los grupos del motor: el portero
// enlaza con la defensa, el mediocampo incluye a los enganches, los enganches
// enlazan también con la delantera y la formación añade sus pares entre líneas
// (CHEM_FORMATION_LINKS; cada par se dibuja una sola vez). Con el Duodécimo
// jugador (boost) todo par del grupo se enlaza en violeta.
function chemLinks(positions, formation, boost = false) {
  const filled = positions.filter((p) => p.player);
  const groups = [
    filled.filter((p) => p.line === 'GK' || p.line === 'DEF'),
    filled.filter((p) => p.line === 'MID'),
    filled.filter((p) => p.line === 'FWD' || p.role === 'ENG'),
  ];
  const links = [];
  const seen = new Set();
  const addPair = (a, b) => {
    const key = [a.player.uid, b.player.uid].sort().join('|');
    if (seen.has(key)) return;
    seen.add(key);
    const nation = chemNation(a.player.nation) === chemNation(b.player.nation);
    const era = a.player.era === b.player.era;
    if (boost || nation || era) {
      links.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, nation, era, boost });
    }
  };
  for (const arr of groups) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) addPair(arr[i], arr[j]);
    }
  }
  for (const link of chemFormationLinks(formation)) {
    const at = (ref) => filled.find((p) => p.line === ref[0] && p.slotIndex === ref[1]);
    const a = at(link.a);
    const b = at(link.b);
    if (a && b) addPair(a, b);
  }
  return links;
}

function fieldSVG(positions, formation, boost = false) {
  const links = chemLinks(positions, formation, boost);
  const lineEl = (l, cls) => `<line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" class="chem-link ${cls}" />`;
  // Dos capas: la base (violeta con boost; época discontinua sin él) y, encima,
  // el dorado de nación, que se superpone gráficamente a la línea violeta.
  const under = links
    .filter((l) => boost || (l.era && !l.nation))
    .map((l) => lineEl(l, boost ? 'boost' : ''))
    .join('');
  const over = links.filter((l) => l.nation).map((l) => lineEl(l, 'strong')).join('');
  return `
    <svg class="field-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      ${PITCH_MARKINGS}
      <g class="chem-links">${under}${over}</g>
    </svg>`;
}

function chipHTML(p, line, slotIndex) {
  const ovr = playerOVR(p);
  return `
    <button class="field-chip filled lineup-draggable rarity-${p.rarity}" data-uid="${p.uid}"
            data-line="${line}" data-slot="${slotIndex}" draggable="true"
            aria-label="${esc(t('build.playerDragAria', { name: p.name }))}">
      <span class="chip-face" aria-hidden="true">
        <img src="${esc(portraitPathForPlayer(p))}" alt="" draggable="false" loading="lazy" decoding="async" data-hide-on-error="true" />
        <span>${esc(playerInitials(p.name))}</span>
      </span>
      <span class="chip-ovr">${ovr}</span>
      <span class="chip-name" title="${esc(p.name)}">${esc(playerSurname(p.name))}</span>
      <span class="chip-info" role="button" tabindex="0" data-info-uid="${p.uid}" aria-label="${esc(t('build.viewStatsAria', { name: p.name }))}">i</span>
    </button>`;
}
function emptyHTML(line, slotIndex, role) {
  const label = role === 'ENG' ? t('card.line.ENG').toLowerCase() : LINE_LABEL[line];
  return `
    <button class="field-chip empty" data-line="${line}" data-slot="${slotIndex}" aria-label="${esc(t('build.emptyAria', { label }))}">
      <span class="chip-plus">+</span>
      <span class="chip-name">${slotLabel(line, role)}</span>
    </button>`;
}

function fieldNodes(positions) {
  return positions.map((p) => {
    const html = p.player ? chipHTML(p.player, p.line, p.slotIndex) : emptyHTML(p.line, p.slotIndex, p.role);
    const uidAttr = p.player ? `data-uid="${p.player.uid}"` : '';
    return `<div class="chip-anchor" data-line="${p.line}" data-slot="${p.slotIndex}" ${uidAttr} style="left:${p.x}%;top:${p.y}%">${html}</div>`;
  }).join('');
}

// Identidad del dibujo (Posesión / Presión / Contra). Es informativa: describe el
// estilo propio de la formación, sin comparar con el rival.
function tacticPill(state) {
  const myType = formationType(state.formation);
  if (!myType) return '';
  return `
    <div class="chem-pill tactic-pill">
      <span>${t('tactics.style')}</span>
      <b>${esc(t(`admin.tactical.${myType}`))}</b>
    </div>`;
}

// "+N" verde / "−N" rojo: cuánto aporta el conjunto de objetos a ese rating.
function itemDeltaHTML(d) {
  if (!d || Math.abs(d) < 0.05) return '';
  const up = d > 0;
  const val = Math.abs(Math.round(d * 10) / 10);
  return `<span class="rt-delta ${up ? 'up' : 'down'}" title="${esc(t('build.fromItems'))}">${up ? '+' : '−'}${val}</span>`;
}

// Leyenda + desglose por línea: explica qué significan las líneas del campo
// (nación / época / equipo unido) y dónde tienes química, para que no se
// perciba como "0". Con el boost activo, la época queda pintada en violeta.
function chemLegend(state) {
  const bl = liveChemistry(state).byLine;
  const boost = chemTeamBonus(state.items) > 0;
  const line = (label, v) => `<span class="cl-line ${v > 0 ? 'has' : ''}">${label} <b>${Math.round(v * 10) / 10}</b></span>`;
  return `
    <div class="chem-legend">
      <span class="cl-key"><i class="cl-swatch nation"></i>${t('build.chemNation')}</span>
      ${boost
        ? `<span class="cl-key"><i class="cl-swatch boost"></i>${t('build.chemBoost')}</span>`
        : `<span class="cl-key"><i class="cl-swatch era"></i>${t('build.chemEra')}</span>`}
      <span class="cl-sep" aria-hidden="true"></span>
      ${line(t('ratings.defense'), bl.DEF)}${line(t('ratings.midfield'), bl.MID)}${line(t('ratings.attack'), bl.FWD)}
    </div>`;
}

function ratingsHeader(state) {
  const r = liveRatings(state);
  const chem = liveChemistry(state);
  const itemD = liveItemDelta(state);
  const rows = [
    [t('ratings.attack'), r.attack, UI_ASSETS.icons.attack, itemD.attack],
    [t('ratings.midfield'), r.midfield, UI_ASSETS.icons.midfield, itemD.midfield],
    [t('ratings.defense'), r.defense, UI_ASSETS.icons.defense, itemD.defense],
    [t('ratings.gk'), r.gk, UI_ASSETS.icons.gk, itemD.gk],
  ];
  const rowHTML = rows.map(([label, val, icon, d]) => `
    <div class="rating-row">
      <img src="${icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <span class="rt-label">${label}</span>
      <span class="rt-bar"><span class="rt-fill" style="width:${Math.min(100, Math.round(val))}%"></span></span>
      <span class="rt-valwrap"><b class="rt-val tabular" data-val="${Math.round(val)}">0</b>${itemDeltaHTML(d)}</span>
    </div>`).join('');
  return `
    <div class="ratings-glass glass" id="ratingsHeader">
      <div class="rt-grid">${rowHTML}</div>
      <div class="header-pills">
        <div class="chem-pill">
          <span>${t('build.chemistry')}</span>
          <b class="tabular" id="chemTotal" data-val="${chem.total}">0</b>
        </div>
        ${tacticPill(state)}
      </div>
    </div>`;
}

function bench(state) {
  const subs = state.squad.filter((p) => !isStarter(state, p)).sort((a, b) => playerOVR(b) - playerOVR(a));
  if (!subs.length) return `<p class="empty-note">${t('build.noSubs')}</p>`;
  return `<div class="bench-strip">
    ${subs.map((p) => `
      <button class="bench-item lineup-draggable rarity-${p.rarity}" data-uid="${p.uid}" data-line="${p.position}" draggable="true"
              aria-label="${esc(t('build.benchAria', { name: p.name }))}">
        <span class="bench-face" aria-hidden="true">
          <img src="${esc(portraitPathForPlayer(p))}" alt="" draggable="false" loading="lazy" decoding="async" data-hide-on-error="true" />
          <span>${esc(playerInitials(p.name))}</span>
        </span>
        <span class="bench-ovr">${playerOVR(p)}</span>
        <span class="bench-name">${esc(p.name)}</span>
        <span class="bench-pos">${POSITION_LABEL[p.position]}</span>
        <span class="bench-add" aria-hidden="true">+</span>
        <span class="chip-info bench-info" role="button" tabindex="0" data-info-uid="${p.uid}" aria-label="${esc(t('build.viewStatsAria', { name: p.name }))}">i</span>
      </button>`).join('')}
  </div>`;
}

export function renderBuild(root, state, handlers) {
  const complete = isLineupComplete(state);
  const positions = lineupPositions(state);
  const formationSegs = Object.keys(FORMATIONS)
    .map((f) => `<button class="seg ${f === state.formation ? 'active' : ''}" data-formation="${f}">${f}</button>`).join('');
  // Agrupa objetos idénticos para mostrarlos una vez con ×N (copias acumuladas).
  const grouped = [];
  const byId = new Map();
  for (const it of state.items) {
    if (byId.has(it.id)) byId.get(it.id).count += 1;
    else { const g = { item: it, count: 1 }; byId.set(it.id, g); grouped.push(g); }
  }
  const itemsHTML = grouped.length
    ? `<div class="items-strip">${grouped.map((g) => itemCardHTML(g.item, { stack: g.count })).join('')}</div>`
    : `<p class="empty-note">${t('build.noItems')}</p>`;
  const opponentHTML = state.opponent ? `
    <button class="opponent-brief" id="viewOpponent">
      <img class="flag-img opponent-flag-img" src="${esc(flagSrcForNation(state.opponent.name, [state.opponent.colors.primary, state.opponent.colors.secondary]))}" alt="" loading="lazy" decoding="async" />
      <span><small>${t('build.nextOpponent')}</small><b>${esc(localizeOpponentName(state.opponent))}</b></span>
      <span class="opponent-view">${t('build.viewLineup')}</span>
    </button>` : '';

  root.innerHTML = `
    <section class="screen build-screen pixel-screen team-select-screen">
      <div class="team-layout">
        <main class="team-field-panel arcade-panel">
          <div class="team-panel-head">
            <div>
              <h2>${t('build.tacticalBoard')}</h2>
            </div>
            <div class="seg-control formation-seg" role="tablist" aria-label="${t('build.formationAria')}">${formationSegs}</div>
          </div>

          <div class="field" id="field" data-formation="${esc(state.formation)}">
            ${fieldSVG(positions, state.formation, chemTeamBonus(state.items) > 0)}
            ${fieldNodes(positions)}
          </div>
          ${chemLegend(state)}

          <div class="slot-picker glass-thick" id="slotPicker" hidden></div>
        </main>

        <aside class="team-side">
          <header class="nav-large build-nav">
            <div class="level-badge">${t('generic.level', { level: state.level })}</div>
            <h1 class="large-title">${t('build.title')}</h1>
          </header>

          ${ratingsHeader(state)}
          ${opponentHTML}

          <div class="team-roster arcade-panel">
            <div class="team-panel-head roster-head">
              <div>
                <h2>${t('build.roster')}</h2>
              </div>
            </div>
            ${bench(state)}

            <details class="items-fold">
              <summary>${t('build.activeItems', { count: state.items.length })}</summary>
              ${itemsHTML}
            </details>
          </div>
        </aside>
      </div>

      <div class="play-bar action-bar">
        <button id="play" class="primary big glass-cta" ${complete ? '' : 'disabled'}>
          ${complete ? t('build.play') : t('build.missing', { count: countMissing(state) })}
        </button>
      </div>

      <div class="player-modal" id="playerModal" hidden>
        <div class="player-modal-backdrop" data-close></div>
        <div class="player-modal-card" role="dialog" aria-modal="true" aria-label="${t('build.statsDialog')}">
          <button class="player-modal-close" data-close aria-label="${t('generic.close')}">✕</button>
          <div id="playerModalBody"></div>
        </div>
      </div>
    </section>`;

  // === Conteo en vivo de ratings/química (animación al cambiar) ===
  root.querySelectorAll('.rt-val, #chemTotal').forEach((node) => {
    countTo(node, parseInt(node.dataset.val, 10) || 0);
  });
  root.querySelector('#viewOpponent')?.addEventListener('click', () => handlers.onScout());
  let suppressClick = false;
  wireBuildDragDrop(root, state, handlers, () => {
    suppressClick = true;
    setTimeout(() => { suppressClick = false; }, 0);
  });

  // === Formación (segmented) ===
  root.querySelectorAll('.formation-seg .seg').forEach((b) => {
    b.addEventListener('click', () => handlers.onSetFormation(b.dataset.formation));
  });

  // === Fichas del campo: filled → quitar; empty → abrir selector ===
  root.querySelectorAll('.field-chip.filled').forEach((node) => {
    node.addEventListener('click', () => {
      if (suppressClick) return;
      const player = state.squad.find((p) => p.uid === node.dataset.uid);
      if (player) handlers.onToggle(player);
    });
  });
  root.querySelectorAll('.field-chip.empty').forEach((node) => {
    node.addEventListener('click', () => {
      if (suppressClick) return;
      openPicker(root, state, node.dataset.line, parseInt(node.dataset.slot, 10) || 0, handlers);
    });
  });

  // === Suplentes: alinear ===
  root.querySelectorAll('.bench-item').forEach((node) => {
    node.addEventListener('click', () => {
      if (suppressClick) return;
      const player = state.squad.find((p) => p.uid === node.dataset.uid);
      if (player) openTargetPicker(root, state, player, handlers);
    });
  });

  // === Jugar ===
  const playBtn = root.querySelector('#play');
  if (complete) playBtn.addEventListener('click', () => handlers.onPlay());

  // === Ver estadísticas del jugador (modal) ===
  wirePlayerStats(root, state);
}

// Modal con la carta completa (atributos) del jugador. El disparador es el
// botón "i"; detenemos la propagación para no arrastrar ni alinear/quitar.
function wirePlayerStats(root, state) {
  const modal = root.querySelector('#playerModal');
  const body = root.querySelector('#playerModalBody');
  if (!modal || !body) return;

  const open = (uid) => {
    const player = state.squad.find((p) => p.uid === uid);
    if (!player) return;
    body.innerHTML = playerCardHTML(player);
    modal.hidden = false;
  };
  const close = () => { modal.hidden = true; body.innerHTML = ''; };

  root.querySelectorAll('.chip-info[data-info-uid]').forEach((node) => {
    // Bloquea el arranque del drag y el click de la ficha contenedora.
    ['pointerdown', 'mousedown', 'touchstart'].forEach((ev) =>
      node.addEventListener(ev, (e) => e.stopPropagation()));
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      open(node.dataset.infoUid);
    });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.stopPropagation();
        e.preventDefault();
        open(node.dataset.infoUid);
      }
    });
  });

  modal.querySelectorAll('[data-close]').forEach((node) =>
    node.addEventListener('click', close));
  modal.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape' && !modal.hidden) close();
    if (modal.hidden) document.removeEventListener('keydown', onEsc);
  });
}

function wireBuildDragDrop(root, state, handlers, markDragged) {
  const sources = Array.from(root.querySelectorAll('.lineup-draggable'));
  const targets = Array.from(root.querySelectorAll('.chip-anchor[data-line][data-slot]'));
  const field = root.querySelector('#field');
  // Limpia cualquier ghost huérfano de un arrastre anterior que no se cerrara.
  document.querySelectorAll('.drag-ghost').forEach((node) => node.remove());
  let htmlDragUid = null;
  let pointerDrag = null;
  let activeTarget = null;
  let ghost = null;
  let nativeDragging = false; // arrastre HTML5 nativo en curso (lo cierra dragend)

  function playerForUid(uid) {
    return state.squad.find((p) => p.uid === uid);
  }
  function setActiveTarget(target, player) {
    if (activeTarget && activeTarget !== target) activeTarget.classList.remove('drop-ok', 'drop-bad');
    activeTarget = target;
    if (!target) return;
    const ok = player && canPlacePlayerInSlot(
      state,
      player,
      target.dataset.line,
      parseInt(target.dataset.slot, 10) || 0
    );
    target.classList.toggle('drop-ok', ok);
    target.classList.toggle('drop-bad', !ok);
  }
  function clearActiveTarget() {
    targets.forEach((target) => target.classList.remove('drop-ok', 'drop-bad'));
    activeTarget = null;
  }
  // Resalta con un brillo todas las posiciones que el jugador puede ocupar
  // (al seleccionar/clicar/holdear un suplente). Ayuda a leer dónde encaja.
  function highlightEligible(player) {
    targets.forEach((target) => {
      const ok = Boolean(player) && canPlacePlayerInSlot(
        state, player, target.dataset.line, parseInt(target.dataset.slot, 10) || 0
      );
      target.classList.toggle('eligible-slot', ok);
    });
  }
  function clearEligible() {
    targets.forEach((target) => target.classList.remove('eligible-slot'));
  }
  function placeOn(target, player) {
    const slotIndex = parseInt(target?.dataset.slot, 10) || 0;
    if (!target || !player || !canPlacePlayerInSlot(state, player, target.dataset.line, slotIndex)) return false;
    handlers.onPlace(player, target.dataset.line, slotIndex);
    return true;
  }
  function pointInField(x, y) {
    if (!field) return false;
    const r = field.getBoundingClientRect();
    return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
  }
  // Hueco válido cuyo centro está más cerca de (x,y). Permite soltar en el
  // tablero sin acertar un hueco: el jugador se ajusta al más cercano que pueda
  // ocupar (y si no hay ninguno, devuelve null → el arrastre se cancela).
  function nearestValidTarget(x, y, player) {
    let best = null;
    let bestDist = Infinity;
    for (const target of targets) {
      if (!canPlacePlayerInSlot(state, player, target.dataset.line, parseInt(target.dataset.slot, 10) || 0)) continue;
      const r = target.getBoundingClientRect();
      const dist = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
      if (dist < bestDist) { bestDist = dist; best = target; }
    }
    return best;
  }
  // Hueco efectivo bajo el puntero: el exacto si lo hay; si no, el más cercano
  // cuando se está dentro del tablero.
  function resolveTarget(x, y, player) {
    const exact = document.elementFromPoint(x, y)?.closest('.chip-anchor[data-line][data-slot]');
    if (exact) return exact;
    return pointInField(x, y) ? nearestValidTarget(x, y, player) : null;
  }
  function makeGhost(source, x, y) {
    const node = source.cloneNode(true);
    node.classList.add('drag-ghost');
    node.removeAttribute('id');
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;
    document.body.appendChild(node);
    return node;
  }
  function moveGhost(x, y) {
    if (!ghost) return;
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
  }
  function switchToBenchScroll() {
    if (!pointerDrag) return;
    pointerDrag.mode = 'scroll';
    pointerDrag.source.classList.remove('drag-source');
    ghost?.remove();
    ghost = null;
    clearActiveTarget();
    clearEligible();
    document.body.classList.remove('lineup-dragging');
  }
  function endPointerDrag({ place = false } = {}) {
    if (!pointerDrag) return;
    const { source, player, restoreNativeDrag } = pointerDrag;
    if (place && activeTarget && placeOn(activeTarget, player)) markDragged();
    if (restoreNativeDrag) source.draggable = true;
    source.classList.remove('drag-source');
    ghost?.remove();
    ghost = null;
    pointerDrag = null;
    clearActiveTarget();
    // El brillo NO se limpia aquí: durante el arrastre nativo, pointercancel
    // llama a esta función y el resaltado debe mantenerse hasta soltar (dragend).
    document.body.classList.remove('lineup-dragging');
  }

  sources.forEach((source) => {
    // Solo los suplentes muestran el brillo de posiciones compatibles.
    const isBench = source.classList.contains('bench-item');
    source.addEventListener('selectstart', (event) => event.preventDefault());
    source.addEventListener('contextmenu', (event) => event.preventDefault());

    source.addEventListener('dragstart', (event) => {
      htmlDragUid = source.dataset.uid;
      nativeDragging = true;
      event.dataTransfer?.setData('text/plain', htmlDragUid);
      event.dataTransfer?.setDragImage(source, source.offsetWidth / 2, source.offsetHeight / 2);
      source.classList.add('drag-source');
      if (isBench) highlightEligible(playerForUid(source.dataset.uid));
    });
    source.addEventListener('dragend', () => {
      htmlDragUid = null;
      nativeDragging = false;
      source.classList.remove('drag-source');
      clearActiveTarget();
      clearEligible(); // fin real del arrastre (soltado o devuelto al banco)
    });

    // Teclado: al enfocar un suplente, resalta dónde puede entrar.
    if (isBench) {
      source.addEventListener('focus', () => highlightEligible(playerForUid(source.dataset.uid)));
      source.addEventListener('blur', clearEligible);
    }

    source.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || event.pointerType === 'mouse' && event.detail > 1) return;
      const player = playerForUid(source.dataset.uid);
      if (!player) return;
      if (isBench) highlightEligible(player); // click o hold: pinta posiciones válidas
      const restoreNativeDrag = event.pointerType !== 'mouse' && source.draggable;
      if (restoreNativeDrag) source.draggable = false;
      const scrollContainer = isBench ? source.closest('.bench-strip') : null;
      const canScrollHorizontally = Boolean(
        scrollContainer && scrollContainer.scrollWidth > scrollContainer.clientWidth + 1
      );
      pointerDrag = {
        source,
        player,
        startX: event.clientX,
        startY: event.clientY,
        dragging: event.pointerType !== 'mouse',
        moved: false,
        mode: event.pointerType === 'mouse' || !canScrollHorizontally ? 'drag' : null,
        scrollContainer,
        startScrollLeft: scrollContainer?.scrollLeft || 0,
        restoreNativeDrag,
      };
      try {
        source.setPointerCapture?.(event.pointerId);
      } catch (_) {
        // Algunos entornos sintéticos no registran el pointer como activo.
      }
      if (pointerDrag.dragging) {
        document.body.classList.add('lineup-dragging');
        source.classList.add('drag-source');
        ghost = makeGhost(source, event.clientX, event.clientY);
      }
    });
    source.addEventListener('pointermove', (event) => {
      if (!pointerDrag || pointerDrag.source !== source) return;
      const dx = event.clientX - pointerDrag.startX;
      const dy = event.clientY - pointerDrag.startY;
      const distance = Math.hypot(dx, dy);

      if (!pointerDrag.mode) {
        event.preventDefault();
        moveGhost(event.clientX, event.clientY);
        if (distance < 5) return;
        if (Math.abs(dx) > Math.abs(dy) * 1.15) switchToBenchScroll();
        else pointerDrag.mode = 'drag';
      }

      if (pointerDrag.mode === 'scroll') {
        event.preventDefault();
        pointerDrag.moved = true;
        if (pointerDrag.scrollContainer) {
          pointerDrag.scrollContainer.scrollLeft = pointerDrag.startScrollLeft - dx;
        }
        return;
      }

      if (!pointerDrag.dragging && Math.hypot(dx, dy) < 8) return;
      event.preventDefault();
      if (!pointerDrag.dragging) {
        pointerDrag.dragging = true;
        document.body.classList.add('lineup-dragging');
        source.classList.add('drag-source');
        ghost = makeGhost(source, event.clientX, event.clientY);
      }
      if (distance >= (event.pointerType === 'mouse' ? 8 : 3)) {
        pointerDrag.moved = true;
      }
      moveGhost(event.clientX, event.clientY);
      ghost.hidden = true;
      const target = resolveTarget(event.clientX, event.clientY, pointerDrag.player);
      ghost.hidden = false;
      setActiveTarget(target, pointerDrag.player);
    });
    source.addEventListener('pointerup', (event) => {
      if (!pointerDrag || pointerDrag.source !== source) return;
      if (pointerDrag.mode === 'scroll') {
        event.preventDefault();
        if (pointerDrag.moved) markDragged();
        endPointerDrag();
        return;
      }
      const didDrag = pointerDrag.dragging && pointerDrag.moved;
      if (didDrag) {
        event.preventDefault();
        endPointerDrag({ place: true });
        if (isBench) clearEligible(); // fin del arrastre por puntero (táctil)
      } else {
        endPointerDrag();
        if (isBench) clearEligible();
      }
    });
    source.addEventListener('pointercancel', () => {
      const wasNative = nativeDragging;
      endPointerDrag();
      // Si el navegador pasó a arrastre nativo, mantenemos el brillo: lo
      // limpiará dragend al soltar. Si no, limpiamos aquí.
      if (!wasNative && isBench) clearEligible();
    });
  });

  targets.forEach((target) => {
    target.addEventListener('dragover', (event) => {
      const player = playerForUid(htmlDragUid);
      if (player && canPlacePlayerInSlot(state, player, target.dataset.line, parseInt(target.dataset.slot, 10) || 0)) {
        event.preventDefault();
      }
      setActiveTarget(target, player);
    });
    target.addEventListener('dragleave', () => {
      if (activeTarget === target) clearActiveTarget();
    });
    target.addEventListener('drop', (event) => {
      event.preventDefault();
      const uid = event.dataTransfer?.getData('text/plain') || htmlDragUid;
      const player = playerForUid(uid);
      if (placeOn(target, player)) markDragged();
      htmlDragUid = null;
      clearActiveTarget();
    });
  });

  // Drag nativo (ratón) sobre el tablero pero no sobre un hueco concreto: ajusta
  // al hueco válido más cercano. Los aciertos exactos los gestiona el listener
  // del propio hueco (y aquí salimos para no duplicar).
  if (field) {
    field.addEventListener('dragover', (event) => {
      if (event.target?.closest?.('.chip-anchor[data-line][data-slot]')) return;
      const player = playerForUid(htmlDragUid);
      const near = player && nearestValidTarget(event.clientX, event.clientY, player);
      if (near) {
        event.preventDefault();
        setActiveTarget(near, player);
      }
    });
    field.addEventListener('drop', (event) => {
      if (event.target?.closest?.('.chip-anchor[data-line][data-slot]')) return;
      event.preventDefault();
      const player = playerForUid(htmlDragUid);
      const near = player && nearestValidTarget(event.clientX, event.clientY, player);
      if (near && placeOn(near, player)) markDragged();
      htmlDragUid = null;
      clearActiveTarget();
    });
  }
}

function countMissing(state) {
  const slots = formationSlots(state.formation);
  return LINES.reduce((n, l) => n + Math.max(0, slots[l] - (state.starting11[l] || []).length), 0);
}

function openTargetPicker(root, state, player, handlers) {
  const picker = root.querySelector('#slotPicker');
  const targets = lineupPositions(state)
    .filter((slot) => canPlacePlayerInSlot(state, player, slot.line, slot.slotIndex));

  picker.innerHTML = `
    <div class="picker-head">${esc(t('build.targetPickerHead', { name: playerSurname(player.name) }))}</div>
    <div class="bench-target-grid">
      ${targets.map((slot) => {
        const current = slot.player;
        const role = slot.role === 'ENG' ? t('card.position.ENG') : POSITION_LABEL[slot.line];
        return `
          <button class="bench-target" data-line="${slot.line}" data-slot="${slot.slotIndex}">
            <span class="bench-target-role">${esc(role)}</span>
            ${current ? `
              <span class="bench-target-face" aria-hidden="true">
                <img src="${esc(portraitPathForPlayer(current))}" alt="" loading="lazy" decoding="async" data-hide-on-error="true" />
                <span>${esc(playerInitials(current.name))}</span>
              </span>
              <span>${esc(playerSurname(current.name))}</span>
            ` : `
              <span class="bench-target-empty" aria-hidden="true">+</span>
              <span>${t('build.openSlot')}</span>
            `}
          </button>`;
      }).join('')}
    </div>
    <button class="ctl" data-close>${t('generic.close')}</button>`;
  picker.hidden = false;
  picker.scrollIntoView?.({ behavior: 'smooth', block: 'center' });

  picker.querySelector('[data-close]')?.addEventListener('click', () => { picker.hidden = true; });
  picker.querySelectorAll('.bench-target').forEach((node) => {
    node.addEventListener('click', () => {
      handlers.onPlace(player, node.dataset.line, parseInt(node.dataset.slot, 10) || 0);
    });
  });
}

// Selector de hueco: lista los suplentes de esa línea para colocarlos.
function openPicker(root, state, line, slotIndex, handlers) {
  const picker = root.querySelector('#slotPicker');
  const slot = formationLineSlots(state.formation, line)[slotIndex];
  const label = slot?.role === 'ENG' ? t('card.line.ENG') : LINE_LABEL[line];
  const candidates = state.squad
    .filter((p) => !isStarter(state, p) && canPlacePlayerInSlot(state, p, line, slotIndex))
    .sort((a, b) => playerOVR(b) - playerOVR(a));

  if (!candidates.length) {
    picker.innerHTML = `<p class="empty-note">${esc(t('build.noCandidates', { label }))}</p>
      <button class="ctl" data-close>${t('generic.close')}</button>`;
  } else {
    picker.innerHTML = `
      <div class="picker-head">${esc(t('build.pickerHead', { label }))}</div>
      <div class="picker-grid">
        ${candidates.map((p) => playerCardHTML(p, { idValue: p.uid, clickable: true })).join('')}
      </div>
      <button class="ctl" data-close>${t('generic.close')}</button>`;
  }
  picker.hidden = false;
  picker.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });

  picker.querySelector('[data-close]')?.addEventListener('click', () => { picker.hidden = true; });
  picker.querySelectorAll('.card.clickable').forEach((node) => {
    node.addEventListener('click', () => {
      const player = state.squad.find((p) => p.uid === node.dataset.id);
      if (player) handlers.onPlace(player, line, slotIndex); // re-render cierra el selector
    });
  });
}
