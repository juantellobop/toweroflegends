// Torre de Leyendas — Recompensa escalada por resultado (§4.6).
// El margen del marcador define el tamaño del sobre y el sesgo de rareza.

import { CONFIG, RARITY_BIAS, RARITIES } from '../data/config.js';

// Clasifica el resultado del partido desde la perspectiva del jugador (A).
export function classifyResult(golesA, golesB) {
  const diff = golesA - golesB;
  if (diff <= -1) return { result: 'loss', tier: 'derrota', diff };
  if (diff === 0) return { result: 'draw', tier: 'empate', diff };
  if (diff >= 5) return { result: 'win', tier: 'goleada', diff };
  if (diff >= 3) return { result: 'win', tier: 'amplia', diff };
  return { result: 'win', tier: 'ajustada', diff };
}

// Devuelve la recompensa: cuántas cartas de jugador/objeto se ofrecen y el
// sesgo de rareza a usar al generarlas.
export function rewardFor(golesA, golesB, extraPlayerCard = 0, extraItemCard = 0) {
  const { result, tier, diff } = classifyResult(golesA, golesB);

  if (result === 'loss') {
    return { result, tier, diff, playerPack: 0, itemPack: 0, rarityBias: null };
  }

  const PACK = {
    goleada: CONFIG.PACK_GOLEADA,
    amplia: CONFIG.PACK_AMPLIA,
    ajustada: CONFIG.PACK_AJUSTADA,
    empate: CONFIG.PACK_EMPATE,
  };
  const BIAS_KEY = {
    goleada: 'goleada', amplia: 'amplia', ajustada: 'ajustada', empate: 'empate',
  };

  const goleada = tier === 'goleada';
  const playerPack = PACK[tier] + extraPlayerCard;
  const itemPack = CONFIG.ITEM_PACK_BASE + (goleada ? 1 : 0) + extraItemCard;

  return {
    result, tier, diff,
    playerPack,
    itemPack,
    rarityBias: RARITY_BIAS[BIAS_KEY[tier]],
  };
}

// Elige una rareza según un vector de pesos [common, rare, epic, legend].
export function rollRarity(bias, rng) {
  const items = RARITIES.map((value, i) => ({ value, weight: bias[i] }));
  return rng.weighted(items);
}
