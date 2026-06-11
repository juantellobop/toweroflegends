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

// Devuelve una copia de stats con el bonus del rasgo aplicado, sin recorte:
// el rasgo suma entero aunque la stat supere 99.
export function applyTraitToStats(player) {
  if (!player.stats) return player.stats;
  const bonus = STAT_BONUS[player.trait];
  if (!bonus) return player.stats;
  const out = { ...player.stats };
  for (const k in bonus) {
    out[k] = (out[k] || 0) + bonus[k];
  }
  return out;
}

// Bonus al rating de portero por rasgo (Paradón / Muro / Mariscal).
export function gkTraitBonus(gkPlayer) {
  if (!gkPlayer) return 0;
  if (gkPlayer.trait === 'Paradón') return 4;
  if (gkPlayer.trait === 'Muro') return 3;
  if (gkPlayer.trait === 'Mariscal') return 1;
  return 0;
}

// Mariscal: el portero que ordena la zaga suma al rating de la línea defensiva.
export function gkDefenseLineBonus(gkPlayer) {
  return gkPlayer && gkPlayer.trait === 'Mariscal' ? 1.5 : 0;
}

// Multiplicador al peso del rematador (Francotirador define mejor).
export function shooterWeightMultiplier(player) {
  if (player.trait === 'Francotirador') return 1.35;
  if (player.trait === 'Cañón') return 1.2;
  return 1;
}

// Multiplicador al peso del rematador SEGÚN LA FASE de la jugada: el
// Especialista pide el balón parado y el Penalero se planta en el punto fatídico.
export function phaseShooterMultiplier(actor, phase) {
  const trait = actor && actor.trait;
  if (!trait) return 1;
  if (trait === 'Penalero' && phase === 'penalty') return 2.5;
  if (trait === 'Especialista' && (phase === 'corner' || phase === 'free_kick')) return 1.6;
  return 1;
}

// Bonus condicional (pts de rating) del actor en un duelo concreto.
//  · Killer: define mejor cuando el partido está empatado o se va perdiendo.
//  · Velocista: letal al espacio en los contraataques.
//  · Especialista: remata mejor el balón parado.
//  · Garra: el defensor crece en el tramo final (min ≥ 75).
// ctx: { role: 'shooter'|'defender', phase, minute, deficit } — deficit es la
// desventaja del equipo del actor (0 = empate, >0 = perdiendo).
export function duelBonus(actor, ctx = {}) {
  const trait = actor && actor.trait;
  if (!trait) return 0;
  if (ctx.role === 'shooter') {
    if (trait === 'Killer' && (ctx.deficit ?? -1) >= 0) return 5;
    if (trait === 'Velocista' && ctx.phase === 'counter') return 5;
    if (trait === 'Especialista' && (ctx.phase === 'corner' || ctx.phase === 'free_kick')) return 4;
  }
  if (ctx.role === 'defender') {
    if (trait === 'Garra' && (ctx.minute || 0) >= 75) return 4;
  }
  return 0;
}

// Prob. extra de convertir un penalti si lo lanza un Penalero.
export function penaltyConvertBonus(actor) {
  return actor && actor.trait === 'Penalero' ? 0.05 : 0;
}
