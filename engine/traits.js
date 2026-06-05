// Torre de Leyendas — Rasgos especiales (§4.1, §6.5).
// Efectos pasivos ligeros aplicados a la contribución del jugador y a la
// selección de rematador. Mantener modestos para no romper el balance.

// Bonus aditivos a stats de campo según rasgo (antes de calcular líneas).
const STAT_BONUS = {
  Francotirador: { shooting: 4 },
  Cañón: { shooting: 3, physical: 2 },
  Muro: { defending: 5 },
  Motor: { physical: 4, passing: 3 },
  Maestro: { passing: 4, dribbling: 4 },
  Líbero: { passing: 4, defending: 2 },
};

// Devuelve una copia de stats con el bonus del rasgo aplicado (recortado a 99).
export function applyTraitToStats(player) {
  if (!player.stats) return player.stats;
  const bonus = STAT_BONUS[player.trait];
  if (!bonus) return player.stats;
  const out = { ...player.stats };
  for (const k in bonus) {
    out[k] = Math.min(99, (out[k] || 0) + bonus[k]);
  }
  return out;
}

// Bonus al rating de portero por rasgo (Paradón / Muro).
export function gkTraitBonus(gkPlayer) {
  if (!gkPlayer) return 0;
  if (gkPlayer.trait === 'Paradón') return 4;
  if (gkPlayer.trait === 'Muro') return 3;
  return 0;
}

// Multiplicador al peso del rematador (Francotirador define mejor).
export function shooterWeightMultiplier(player) {
  if (player.trait === 'Francotirador') return 1.35;
  if (player.trait === 'Cañón') return 1.2;
  return 1;
}
