// Torre de Leyendas — Tablero de alineación compartido. El armado de equipo,
// la presentación de la plantilla inicial y el once rival del scouting pintan
// el campo con ESTE mismo esquema: idénticas posiciones por línea (alturas,
// reparto horizontal y matices por dibujo) e idéntica carta de jugador
// (retrato con bandera-insignia, placa OVR y apellido). Un solo diseño,
// un solo juego de estilos (.lineup-board en styles.css).

import { esc } from './dom.js';
import { playerOVR } from '../engine/ovr.js';
import { managerNationStatBonus } from '../engine/chemistry.js';
import { playerInitials, playerSurname } from '../data/playerAssets.js';
import { PITCH_MARKINGS } from './pitchArt.js';

// Geometría fija del grid (1-5-5-5-5). El tablero SIEMPRE ocupa el mismo alto y
// las mismas posiciones, sin variación por táctica:
//  · Filas (top %): 5 filas equiespaciadas de abajo (POR) a arriba (DEL).
//  · Columnas (left %): 5 columnas equiespaciadas; col 2 es el centro.
export const ROW_TOP = { POR: 91, DEF: 72, MED: 52, ENG: 30, DEL: 9 };
export const COL_LEFT = [10, 30, 50, 70, 90];
// Mapeo línea del motor → fila del grid (las filas MED/ENG comparten línea MID).
const LINE_TO_ROW = { GK: 'POR', DEF: 'DEF', MID: 'MED', FWD: 'DEL' };

function rowForSlot(slot) {
  if (slot.gridRow) return slot.gridRow;
  if (slot.line === 'MID' && slot.slotIndex >= COL_LEFT.length) return 'ENG';
  return LINE_TO_ROW[slot.line] || 'MED';
}

// Asigna (x%, y%) a cada hueco. Si los huecos ya traen columna del grid (tablero
// propio: formationLineSlots) se respeta; si no (once rival: lista plana por
// posición), se centran por su número. Determinista, sin matices por dibujo.
export function positionSlots(formation, line, slots) {
  const needCols = slots.some((s) => s.col == null);
  const cols = needCols ? centeredColsForCount(slots.length) : null;
  slots.forEach((slot, i) => {
    const row = rowForSlot(slot);
    const col = slot.col != null ? slot.col : (cols ? cols[i] : 2);
    slot.gridRow = row;
    slot.col = col;
    slot.x = row === 'POR' ? 50 : COL_LEFT[col];
    slot.y = ROW_TOP[row];
  });
  return slots;
}

// Columnas centradas para N huecos en una fila de 5 (espejo de centeredCols del
// config, replicado aquí para no acoplar la UI a los datos del motor).
function centeredColsForCount(n) {
  switch (n) {
    case 0: return [];
    case 1: return [2];
    case 2: return [1, 3];
    case 3: return [1, 2, 3];
    case 4: return [0, 1, 3, 4];
    default: return [0, 1, 2, 3, 4];
  }
}

// Cuando NO hay ENG, se adelanta la fila MED hacia la mitad del campo (rellena el
// hueco que deja la línea de enganches vacía), sean cuantos sean los medios. La
// altura es la misma que el 4-3-3 ya usaba para sus 3 MED.
const MED_ADVANCED_TOP = 44;

// Las "4 posiciones normales" de una línea (back/medio-4 centrado): cols 0,1,3,4,
// con el centro libre. Es la ÚNICA disposición que se reparte equidistante; toda
// otra colocación conserva sus columnas reales (respeta la asimetría del usuario).
const NORMAL_4_COLS = [0, 1, 3, 4];

// Reparto horizontal EQUILIBRADO: N huecos a distancias iguales (los 4 defensas
// quedan con la misma separación entre laterales y centrales, no el centro abierto
// del grid editable). Centrado en 50.
function evenSpread(n) {
  if (n <= 0) return [];
  if (n === 1) return [50];
  const margin = n >= 5 ? 10 : n === 4 ? 16 : n === 3 ? 24 : 33;
  return Array.from({ length: n }, (_, i) => margin + ((100 - margin * 2) * i) / (n - 1));
}

// Posicionado para tableros INFORMATIVOS (scouting, plantilla inicial, modal del
// ranking): agrupa los jugadores OCUPADOS por fila del grid. Si los huecos traen
// su COLUMNA real del grid (once del usuario: plantilla inicial y ranking) se
// respeta su colocación EXACTA —incluidas las asimetrías— y solo se normaliza la
// disposición "4 normales" (cols 0,1,3,4) repartiéndola equidistante. Si NO hay
// columnas (once rival: lista plana por posición) se reparte equilibrado. Sin ENG
// (haya los medios que haya) la fila MED se adelanta hacia la mitad del campo.
export function layoutInformative(slots) {
  const byRow = new Map();
  for (const slot of slots) {
    const row = rowForSlot(slot);
    slot.gridRow = row;
    if (!byRow.has(row)) byRow.set(row, []);
    byRow.get(row).push(slot);
  }
  const engEmpty = !(byRow.get('ENG') || []).length;
  for (const [row, rowSlots] of byRow) {
    rowSlots.sort((a, b) => (a.col ?? a.slotIndex ?? 0) - (b.col ?? b.slotIndex ?? 0));
    const top = (row === 'MED' && engEmpty) ? MED_ADVANCED_TOP : ROW_TOP[row];
    // ¿Tenemos las columnas reales del grid (once del usuario) o solo un orden
    // secuencial (once rival)? Con columnas reales se respeta la colocación.
    const hasRealCols = row !== 'POR' && rowSlots.every((s) => s.col != null);
    const cols = hasRealCols ? rowSlots.map((s) => s.col) : null;
    const normalize4 = hasRealCols && cols.length === 4 && NORMAL_4_COLS.every((c, i) => cols[i] === c);
    const xs = (!hasRealCols || normalize4) ? evenSpread(rowSlots.length) : null;
    rowSlots.forEach((slot, i) => {
      slot.x = row === 'POR' ? 50 : (xs ? xs[i] : COL_LEFT[slot.col]);
      slot.y = top;
    });
  }
  return slots;
}

// OVR a mostrar: para cartas propias (traen stats/gk) SIEMPRE el del motor —así
// el boost del DT connacional entra al pasar `manager`, aunque la carta lleve un
// ovr precalculado del roster—; para onces rivales/snapshots (sin stats), el
// precalculado.
export function displayOVR(player, manager = null) {
  if (player.stats || player.gk) return playerOVR(player, manager);
  return Number.isFinite(player.ovr) ? player.ovr : playerOVR(player, manager);
}

// Carta estática de jugador, con el esquema exacto del tablero táctico pero
// sin edición. `interactive` la convierte en botón (abre la ficha completa).
// `manager` aplica el boost del DT connacional al OVR (solo cartas propias).
export function staticChipHTML(player, { portraitSrc, flagSrc, chipClass = '', interactive = false, ariaLabel = '', loading = 'eager', manager = null } = {}) {
  const rarity = player.rarity ? ` rarity-${player.rarity}` : '';
  const boosted = Boolean(player.stats || player.gk) && managerNationStatBonus(player, manager) > 0;
  const inner = `
      <span class="chip-face" aria-hidden="true">
        <img src="${esc(portraitSrc)}" alt="" draggable="false" loading="${loading}" decoding="async" data-hide-on-error="true" />
        <span>${esc(playerInitials(player.name))}</span>
        ${flagSrc ? `<img class="chip-flag" src="${esc(flagSrc)}" alt="" draggable="false" loading="${loading}" decoding="async" />` : ''}
      </span>
      <span class="chip-ovr${boosted ? ' chip-ovr--mgr' : ''}">${displayOVR(player, manager)}</span>
      <span class="chip-name" title="${esc(player.name)}">${esc(playerSurname(player.name))}</span>`;
  if (interactive) {
    return `<button class="field-chip filled${rarity} ${chipClass}" data-uid="${esc(player.uid || '')}"
            aria-label="${esc(ariaLabel || player.name)}">${inner}</button>`;
  }
  return `<div class="field-chip filled${rarity} ${chipClass}">${inner}</div>`;
}

// Campo completo con el once colocado. `chip` pinta cada carta (recibe el slot).
export function lineupFieldHTML({ formation, slots, fieldClass = '', chip }) {
  const nodes = slots.map((slot, i) =>
    `<div class="chip-anchor" style="left:${slot.x}%;top:${slot.y}%;--i:${i}">${chip(slot, i)}</div>`).join('');
  return `
    <div class="field lineup-board ${fieldClass}" data-formation="${esc(formation)}">
      <svg class="field-bg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${PITCH_MARKINGS}
      </svg>
      ${nodes}
    </div>`;
}
