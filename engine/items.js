// Torre de Leyendas — Aplicación de efectos de objetos a los ratings (§4.2).
// Orden (§6.1): primero todos los 'add', luego todos los 'mult'.
// target: 'team' | 'line' | 'player' afecta ratings; 'match' afecta mecánicas
// del partido (ver MATCH_BONUS_CAPS); 'chem' suma química de equipo; 'meta'
// afecta el bucle (extra cartas).
// Sinergia: un ítem con synergyType ('posesion'|'presion'|'contra') aplica su
// efecto positivo multiplicado por ITEM_SYNERGY_MULT si coincide con el ESTILO
// elegido del equipo (team.style), y sus efectos negativos (el coste) se anulan.

import { CONFIG } from '../data/config.js';

const lineToStat = { FWD: 'attack', MID: 'midfield', DEF: 'defense', GK: 'gk' };

function effectKey(item, effect) {
  if (!CONFIG.DR_BY_STAT) return item.id;
  const target = effect.target === 'line' ? `${effect.target}:${effect.line}` : effect.target;
  return `${target}:${effect.stat}:${effect.op}`;
}

// Devuelve contribuciones ya nerfeadas y con decaimiento por copia.
// Para `mult`, value es el bonus respecto de 1 (0.04 = +4%).
// Con `style`, los ítems cuya sinergia coincide con el estilo elegido del equipo
// aplican su efecto positivo multiplicado por ITEM_SYNERGY_MULT y anulan sus
// efectos negativos: la táctica absorbe el trade-off del ítem.
export function effectiveItemEffects(items = [], { scalePower = true, style = null, applyDecay = true } = {}) {
  const tacticType = style || null;
  const seenItems = new Map();
  const seenStats = new Map();
  const out = [];
  for (const item of items) {
    const itemCopyIndex = seenItems.get(item.id) || 0;
    seenItems.set(item.id, itemCopyIndex + 1);
    const synergyActive = Boolean(tacticType && item.synergyType === tacticType);
    for (const effect of item.effects || []) {
      const key = effectKey(item, effect);
      const copyIndex = CONFIG.DR_BY_STAT ? (seenStats.get(key) || 0) : itemCopyIndex;
      if (CONFIG.DR_BY_STAT) seenStats.set(key, copyIndex + 1);
      const decay = applyDecay ? Math.pow(CONFIG.DR_RATE, copyIndex) : 1;
      const scale = scalePower ? CONFIG.ITEM_POWER_SCALE : 1;
      const base = effect.op === 'mult' ? effect.value - 1 : effect.value;
      if (synergyActive && base < 0) continue;
      const synergy = synergyActive ? CONFIG.ITEM_SYNERGY_MULT : 1;
      out.push({ ...effect, itemId: item.id, value: base * scale * decay * synergy });
    }
  }
  return out;
}

// Aplica primero add y después mult, sin topes: cada objeto suma entero (el
// decaimiento por copia y el nerfeo de potencia ya moderan el apilamiento).
export function applyItemsToRatings(ratings, items = [], style = null) {
  const r = { ...ratings };
  const add = {};
  const mult = {};

  for (const effect of effectiveItemEffects(items, { style })) {
    let stat = null;
    if (effect.target === 'team') stat = effect.stat;
    if (effect.target === 'line') stat = lineToStat[effect.line];
    if (!stat || r[stat] == null) continue;
    const bucket = effect.op === 'add' ? add : effect.op === 'mult' ? mult : null;
    if (bucket) bucket[stat] = (bucket[stat] || 0) + effect.value;
  }

  for (const stat in r) r[stat] += add[stat] || 0;
  for (const stat in r) r[stat] *= 1 + (mult[stat] || 0);
  for (const stat in r) r[stat] = Math.max(1, r[stat]);
  return r;
}

// Agrega todos los efectos de partido ('match') en un objeto de bonus, cada
// uno topado según MATCH_BONUS_CAPS. La simulación los lee por equipo.
export function matchBonuses(items = [], style = null) {
  const caps = CONFIG.MATCH_BONUS_CAPS;
  const out = {};
  for (const stat in caps) out[stat] = 0;
  for (const effect of effectiveItemEffects(items, { style })) {
    if (effect.target !== 'match' || effect.op !== 'add') continue;
    if (!(effect.stat in caps)) continue;
    out[effect.stat] += effect.value;
  }
  for (const stat in caps) out[stat] = Math.min(caps[stat], Math.max(0, out[stat]));
  return out;
}

// Suma la probabilidad de robo (stealChance) aportada por objetos 'match'.
export function matchStealBonus(items = [], style = null) {
  return matchBonuses(items, style).stealChance;
}

// Química de equipo aportada por reliquias (target 'chem'). Sin nerfeo de
// potencia (como los meta): son puntos discretos de química, con decaimiento.
export function chemTeamBonus(items = []) {
  return effectiveItemEffects(items, { scalePower: false })
    .filter((e) => e.target === 'chem' && e.stat === 'teamAll' && e.op === 'add')
    .reduce((sum, e) => sum + e.value, 0);
}

// Lee bonus 'meta' del inventario (cartas extra en sobres).
export function metaBonuses(items = []) {
  let extraPlayerCard = 0;
  let extraItemCard = 0;
  let extraManagerCard = 0;
  // Los bonus meta apilan completos: cada copia suma su valor entero sin
  // decaimiento (3 objetos de +1 carta dan +3 cartas en cada sobre).
  for (const effect of effectiveItemEffects(items, { scalePower: false, applyDecay: false })) {
    if (effect.target !== 'meta' || effect.op !== 'add') continue;
    if (effect.stat === 'extraPlayerCard') extraPlayerCard += effect.value;
    if (effect.stat === 'extraItemCard') extraItemCard += effect.value;
    if (effect.stat === 'extraManagerCard') extraManagerCard += effect.value;
  }
  return {
    extraPlayerCard: Math.floor(extraPlayerCard),
    extraItemCard: Math.floor(extraItemCard),
    extraManagerCard: Math.floor(extraManagerCard),
  };
}
