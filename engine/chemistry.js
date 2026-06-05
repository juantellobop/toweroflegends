// Torre de Leyendas — Cálculo de química / sinergias (§4.7).
// Por cada par de titulares en la misma línea que comparten nación → +CHEM_NATION.
// Por cada par que comparte época → +CHEM_ERA. Tope CHEM_CAP por línea.

import { CONFIG, LINES } from '../data/config.js';

// Cuenta pares que comparten una clave dentro de un grupo de jugadores.
function pairsSharing(players, key) {
  const counts = {};
  for (const p of players) {
    const v = p[key];
    counts[v] = (counts[v] || 0) + 1;
  }
  let pairs = 0;
  for (const v in counts) {
    const n = counts[v];
    pairs += (n * (n - 1)) / 2; // combinaciones C(n,2)
  }
  return pairs;
}

// Devuelve la química por línea: { GK, DEF, MID, FWD } (cada una topada a CHEM_CAP).
export function computeChemistry(starting11) {
  const chem = {};
  for (const line of LINES) {
    const players = starting11[line] || [];
    const nation = pairsSharing(players, 'nation') * CONFIG.CHEM_NATION;
    const era = pairsSharing(players, 'era') * CONFIG.CHEM_ERA;
    chem[line] = Math.min(CONFIG.CHEM_CAP, nation + era);
  }
  return chem;
}

// Química total (suma de líneas), útil para mostrar un indicador global.
export function totalChemistry(starting11) {
  const chem = computeChemistry(starting11);
  return LINES.reduce((s, l) => s + chem[l], 0);
}
