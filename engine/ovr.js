// Torre de Leyendas — Derivación del overall (§5.1, §6.1).
// El OVR se calcula desde atributos y posición. El `ovr` explícito solo queda
// como fallback para datos históricos que no tengan atributos desglosados.

import { managerNationStatBonus } from './chemistry.js';

export const FIELD_OVR_WEIGHTS = {
  DEF: { defending: 0.42, physical: 0.22, pace: 0.16, passing: 0.12, dribbling: 0.05, shooting: 0.03 },
  MID: { passing: 0.3, dribbling: 0.22, defending: 0.16, physical: 0.14, shooting: 0.1, pace: 0.08 },
  FWD: { shooting: 0.38, dribbling: 0.24, pace: 0.18, physical: 0.1, passing: 0.08, defending: 0.02 },
};

export const GK_OVR_WEIGHTS = { reflexes: 0.36, handling: 0.32, positioning: 0.32 };

function clampOVR(value) {
  return Math.max(1, Math.min(99, Math.round(value)));
}

function weightedRating(values, weights) {
  if (!values) return null;
  let score = 0;
  for (const key in weights) score += (Number(values[key]) || 0) * weights[key];
  return clampOVR(score);
}

// Con `manager` connacional, suma MANAGER_NATION_STAT_BONUS al OVR (sin tope: +3
// a cada stat sube la media ponderada exactamente +3, así que puede pasar de 99).
// Sin `manager` el resultado es idéntico al de siempre (ordenaciones/autofill).
export function playerOVR(player, manager = null) {
  if (!player) return 1;
  const bonus = manager ? managerNationStatBonus(player, manager) : 0;
  if (player.position === 'GK' && player.gk) {
    return weightedRating(player.gk, GK_OVR_WEIGHTS) + bonus;
  }
  const statsRating = weightedRating(player.stats, FIELD_OVR_WEIGHTS[player.position] || FIELD_OVR_WEIGHTS.MID);
  if (statsRating !== null) return statsRating + bonus;
  if (typeof player.ovr === 'number') return clampOVR(player.ovr) + bonus;
  return 1;
}

// Banda de valoración usada por el sorteo de plantilla inicial y de sobres:
//  'low'  → OVR < 70
//  'mid'  → 70 ≤ OVR ≤ 90
//  'high' → OVR > 90
export function ovrBand(player) {
  const ovr = typeof player === 'number' ? player : playerOVR(player);
  if (ovr < 70) return 'low';
  if (ovr <= 90) return 'mid';
  return 'high';
}

export const OVR_BANDS = ['low', 'mid', 'high'];
