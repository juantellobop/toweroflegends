// Torre de Leyendas — Tablero de alineación compartido. El armado de equipo,
// la presentación de la plantilla inicial y el once rival del scouting pintan
// el campo con ESTE mismo esquema: idénticas posiciones por línea (alturas,
// reparto horizontal y matices por dibujo) e idéntica carta de jugador
// (retrato con bandera-insignia, placa OVR y apellido). Un solo diseño,
// un solo juego de estilos (.lineup-board en styles.css).

import { esc } from './dom.js';
import { playerOVR } from '../engine/ovr.js';
import { playerInitials, playerSurname } from '../data/playerAssets.js';
import { PITCH_MARKINGS } from './pitchArt.js';

// Posición vertical (top %) de cada línea en el campo, de abajo (POR) a arriba
// (DEL). Reparto amplio: delantera y portero cerca de las áreas para que el
// once aproveche casi todo el alto del tablero.
export const LINE_TOP = { GK: 88, DEF: 66, MID: 42, ENG: 30, FWD: 14 };
export const FORMATION_LINE_TOP = {
  '4-3-1-2': { GK: 91, DEF: 72, MID: 51, ENG: 31, FWD: 9 },
  // 4-2-3-1: pivotes (MID) por detrás de la línea de creación (ENG) y el delantero.
  '4-2-3-1': { GK: 91, DEF: 72, MID: 52, ENG: 30, FWD: 9 },
  // 3-2-4-1: zaga de 3, dos mediocentros (MID), la línea ofensiva de 4 (ENG) y el 9.
  // Mismo reparto vertical que el 4-2-3-1 (5 filas equiespaciadas ~20%) para que
  // las cartas no se pisen y el tablero quede consistente entre dibujos de 4 líneas.
  '3-2-4-1': { GK: 91, DEF: 72, MID: 52, ENG: 30, FWD: 9 },
};

// Ajuste fino (dx/dy en % del campo) por hueco concreto, sobre la posición de su
// línea. Dibuja el rol dentro del dibujo: el MC más defensivo se retrasa
// (4-3-3, 3-5-2, 5-3-2, 4-3-1-2, doble pivote del 3-4-3), los extremos parten
// algo más abajo (4-3-3, 4-2-4), los laterales del 5-3-2 se proyectan y los
// carrileros del 3-5-2 adelantan. El escalonado de las líneas de 5 también
// deja a la vista el enlace de química entre cartas vecinas en mobile.
export const SLOT_NUDGES = {
  '4-3-3': { 'MID:1': { dy: 2 }, 'FWD:0': { dy: 4 }, 'FWD:2': { dy: 4 } },
  '3-5-2': { 'MID:0': { dy: -5 }, 'MID:2': { dy: 2 }, 'MID:4': { dy: -5 } },
  '5-3-2': { 'MID:1': { dy: 2 }, 'DEF:0': { dy: -2 }, 'DEF:4': { dy: -2 } },
  '4-3-1-2': { 'MID:1': { dy: 2 } },
  '3-4-3': { 'MID:1': { dy: 2 }, 'MID:2': { dy: 2 } },
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
  if ((formation === '4-2-3-1' || formation === '4-2-4' || formation === '3-2-4-1') && line === 'MID' && n === 2) return [30, 70]; // pivotes / mediocentros
  if (formation === '4-2-3-1' && line === 'ENG' && n === 3) return [18, 50, 82]; // creación
  // 3-2-4-1: la línea de 4 (extremos abiertos, enganches por dentro) abre el ancho.
  if (formation === '3-2-4-1' && line === 'ENG' && n === 4) return [12, 38, 62, 88];
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

export function positionSlots(formation, line, slots) {
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

// OVR a mostrar: el precalculado (onces rivales) o el del motor (cartas propias).
export function displayOVR(player) {
  return Number.isFinite(player.ovr) ? player.ovr : playerOVR(player);
}

// Carta estática de jugador, con el esquema exacto del tablero táctico pero
// sin edición. `interactive` la convierte en botón (abre la ficha completa).
export function staticChipHTML(player, { portraitSrc, flagSrc, chipClass = '', interactive = false, ariaLabel = '' } = {}) {
  const rarity = player.rarity ? ` rarity-${player.rarity}` : '';
  const inner = `
      <span class="chip-face" aria-hidden="true">
        <img src="${esc(portraitSrc)}" alt="" draggable="false" loading="eager" decoding="async" data-hide-on-error="true" />
        <span>${esc(playerInitials(player.name))}</span>
        ${flagSrc ? `<img class="chip-flag" src="${esc(flagSrc)}" alt="" draggable="false" loading="eager" decoding="async" />` : ''}
      </span>
      <span class="chip-ovr">${displayOVR(player)}</span>
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
