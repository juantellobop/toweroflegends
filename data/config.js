// Torre de Leyendas — Constantes de balance (§6.6 del documento de diseño).
// Todo el balance del juego vive aquí para poder ajustarlo en un solo sitio.

export const CONFIG = {
  // --- Motor de simulación ---
  THETA: 1.6, // dominio del rating frente a la suerte
  BASE_SEQUENCES: 22, // jugadas de ataque totales por partido
  COUNTER_CHANCE: 0.2, // prob. de contraataque tras una pérdida

  // --- Vidas / fin de run ---
  LIVES: 1, // 1 = perder termina la run; 3 = sistema de vidas

  // --- Plantilla de arranque ---
  STARTING_FORMATION: '4-3-3',
  STARTER_SQUAD_SIZE: 11,
  // Sorteo por banda de OVR (cualquier jugador del roster completo).
  // Pesos relativos por banda: < 70 / 70-90 / > 90.
  STARTER_BAND_WEIGHTS: { low: 80, mid: 15, high: 5 },
  PACK_BAND_WEIGHTS: { low: 60, mid: 30, high: 10 },

  // --- Objetos ---
  ITEM_POWER_SCALE: 0.5,
  DR_RATE: 0.5,
  DR_BY_STAT: false,
  ITEM_ADD_CAP: 12,
  ITEM_MULT_CAP: 0.15,

  // --- Cartas ---
  ALLOW_DUPLICATE_PLAYERS: false,
  PACK_GUARANTEE_SELECTABLE: true,

  // --- Rivales históricos ---
  // Recalibrado a 70 (antes 72) tras hacer fieles los ratings de equipo:
  // ahora ataque/defensa reflejan a tus jugadores en vez de toparse en 99, lo
  // que bajó ~10 pts el nivel del jugador; este ajuste mantiene la dificultad.
  OPP_BASE_STRENGTH: 70,
  OPP_GROWTH: 1.0,
  OPP_MATCH_WINDOW: 4,
  NO_REPEAT_RIVALS: true,

  // --- Química ---
  CHEM_NATION: 2, // bonus por par de misma nación en una línea
  CHEM_ERA: 1, // bonus por par de misma época en una línea
  CHEM_CAP: 10, // tope de química por línea

  // --- Tipos tácticos (mejora futura) ---
  TYPE_BONUS: 0.1, // +10% si tu tipo cuenta el del rival

  // --- Recompensas (tamaño de sobre por resultado) ---
  PACK_GOLEADA: 5, // dif >= 5
  PACK_AMPLIA: 4, // dif 3-4
  PACK_AJUSTADA: 3, // dif 1-2
  PACK_EMPATE: 2,
  ITEM_PACK_BASE: 3, // objetos a elegir; +1 en goleada

};

// Fuerza objetivo del rival histórico en un nivel dado.
export function targetStrength(level) {
  return CONFIG.OPP_BASE_STRENGTH + (level - 1) * CONFIG.OPP_GROWTH;
}

// Alias conservado para consumidores anteriores del motor.
export const targetOVR = targetStrength;

// Sesgo de rareza en los sobres según el resultado del partido.
// Pesos relativos [common, rare, epic, legend].
export const RARITY_BIAS = {
  goleada: [10, 30, 38, 22],
  amplia: [20, 38, 30, 12],
  ajustada: [38, 38, 18, 6],
  empate: [62, 28, 8, 2],
  inicial: [55, 32, 10, 3], // plantilla de arranque y sobres neutros
};

// Definición de formaciones disponibles: jugadores por línea.
export const FORMATIONS = {
  '4-3-3': { GK: 1, DEF: 4, MID: 3, FWD: 3 },
  '4-4-2': { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  '3-5-2': { GK: 1, DEF: 3, MID: 5, FWD: 2 },
  '5-3-2': { GK: 1, DEF: 5, MID: 3, FWD: 2 },
  '4-3-1-2': { GK: 1, DEF: 4, MID: 4, FWD: 2 },
  '3-4-3': { GK: 1, DEF: 3, MID: 4, FWD: 3 },
};

export const LINES = ['GK', 'DEF', 'MID', 'FWD'];
export const RARITIES = ['common', 'rare', 'epic', 'legend'];

export const FORMATION_SLOT_RULES = {
  '4-3-1-2': {
    MID: {
      3: { accepts: ['MID', 'FWD'], role: 'ENG' },
    },
  },
};

export function formationLineSlots(formation, line) {
  const shape = FORMATIONS[formation] || FORMATIONS['4-3-3'];
  const count = shape[line] || 0;
  const rules = FORMATION_SLOT_RULES[formation]?.[line] || {};
  return Array.from({ length: count }, (_, slotIndex) => {
    const rule = rules[slotIndex] || {};
    return {
      line,
      slotIndex,
      accepts: rule.accepts || [line],
      role: rule.role || line,
    };
  });
}

export function slotAcceptsPosition(formation, line, slotIndex, position) {
  const slot = formationLineSlots(formation, line)[slotIndex];
  return Boolean(slot && slot.accepts.includes(position));
}
