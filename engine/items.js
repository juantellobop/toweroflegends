// Torre de Leyendas — Aplicación de efectos de objetos a los ratings (§4.2).
// Orden (§6.1): primero todos los 'add', luego todos los 'mult'.
// target: 'team' | 'line' | 'player' afecta ratings; 'match' afecta mecánicas
// del partido (stealChance); 'meta' afecta el bucle (extra cartas) — no aquí.

import { CONFIG } from '../data/config.js';

const lineToStat = { FWD: 'attack', MID: 'midfield', DEF: 'defense', GK: 'gk' };

function clamp(value, cap) {
  return Math.max(-cap, Math.min(cap, value));
}

function effectKey(item, effect) {
  if (!CONFIG.DR_BY_STAT) return item.id;
  const target = effect.target === 'line' ? `${effect.target}:${effect.line}` : effect.target;
  return `${target}:${effect.stat}:${effect.op}`;
}

// Devuelve contribuciones ya nerfeadas y con decaimiento por copia.
// Para `mult`, value es el bonus respecto de 1 (0.04 = +4%).
export function effectiveItemEffects(items = [], { scalePower = true } = {}) {
  const seenItems = new Map();
  const seenStats = new Map();
  const out = [];
  for (const item of items) {
    const itemCopyIndex = seenItems.get(item.id) || 0;
    seenItems.set(item.id, itemCopyIndex + 1);
    for (const effect of item.effects || []) {
      const key = effectKey(item, effect);
      const copyIndex = CONFIG.DR_BY_STAT ? (seenStats.get(key) || 0) : itemCopyIndex;
      if (CONFIG.DR_BY_STAT) seenStats.set(key, copyIndex + 1);
      const decay = Math.pow(CONFIG.DR_RATE, copyIndex);
      const scale = scalePower ? CONFIG.ITEM_POWER_SCALE : 1;
      const base = effect.op === 'mult' ? effect.value - 1 : effect.value;
      out.push({ ...effect, itemId: item.id, value: base * scale * decay });
    }
  }
  return out;
}

// Aplica primero add y después mult, con topes independientes por rating.
export function applyItemsToRatings(ratings, items = []) {
  const r = { ...ratings };
  const add = {};
  const mult = {};

  for (const effect of effectiveItemEffects(items)) {
    let stat = null;
    if (effect.target === 'team') stat = effect.stat;
    if (effect.target === 'line') stat = lineToStat[effect.line];
    if (!stat || r[stat] == null) continue;
    const bucket = effect.op === 'add' ? add : effect.op === 'mult' ? mult : null;
    if (bucket) bucket[stat] = (bucket[stat] || 0) + effect.value;
  }

  for (const stat in r) r[stat] += clamp(add[stat] || 0, CONFIG.ITEM_ADD_CAP);
  for (const stat in r) r[stat] *= 1 + clamp(mult[stat] || 0, CONFIG.ITEM_MULT_CAP);
  for (const stat in r) r[stat] = Math.max(1, Math.min(99, r[stat]));
  return r;
}

// Suma la probabilidad de robo (stealChance) aportada por objetos 'match'.
export function matchStealBonus(items = []) {
  return effectiveItemEffects(items)
    .filter((e) => e.target === 'match' && e.stat === 'stealChance' && e.op === 'add')
    .reduce((sum, e) => sum + e.value, 0);
}

// Lee bonus 'meta' del inventario (cartas extra en sobres).
export function metaBonuses(items = []) {
  let extraPlayerCard = 0;
  let extraItemCard = 0;
  // Los bonus meta son discretos: conservan el valor de la primera copia,
  // pero sí reciben decaimiento para evitar sobres de tamaño ilimitado.
  for (const effect of effectiveItemEffects(items, { scalePower: false })) {
    if (effect.target !== 'meta' || effect.op !== 'add') continue;
    if (effect.stat === 'extraPlayerCard') extraPlayerCard += effect.value;
    if (effect.stat === 'extraItemCard') extraItemCard += effect.value;
  }
  return { extraPlayerCard: Math.floor(extraPlayerCard), extraItemCard: Math.floor(extraItemCard) };
}
