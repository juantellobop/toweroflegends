// Torre de Leyendas — Comprobación de cordura del motor.
// Ejecuta: `npm run sanity` o `node tests/sanity.mjs`.
// Verifica: (a) rangos de marcador realistas con highlights, (b) determinismo.

import { RNG } from '../engine/rng.js';
import { simularPartido } from '../engine/simulate.js';
import { PLAYERS } from '../data/players.js';
import { generateOpponent } from '../data/opponents.js';

function byId(id) {
  return PLAYERS.find((p) => p.id === id);
}

// Once titular fuerte contra el rival inicial: debe dominar sin convertir
// cada highlight en goleada automática. Con la rampa de arranque
// (OPP_EARLY_EASE) el rival de nivel 1 es más blando (~64-66 de fuerza),
// así que la banda de goles admite algo más que contra el viejo rival de 70.
const strong = {
  name: 'Leyendas',
  color: '#D4AF37',
  items: [],
  starting11: {
    GK: [byId('gk_buffon_2006')],
    DEF: [byId('def_maldini_1994'), byId('def_cannavaro_2006'), byId('def_carlos_2002'), byId('def_cafu_2002')],
    MID: [byId('mid_zidane_1998'), byId('mid_xavi_2010'), byId('mid_gerrard_2006')],
    FWD: [byId('fwd_ronaldo_2002'), byId('fwd_henry_2006'), byId('fwd_batistuta_1998')],
  },
};

const N = 2000;
let totalA = 0;
let totalB = 0;
const dist = {};
let goleadas = 0;
let upsets = 0;

for (let i = 0; i < N; i++) {
  const rng = new RNG(1000 + i);
  const weak = generateOpponent(1, new RNG(50000 + i)); // nivel 1 = cuartofinalista modesto
  const { golesA, golesB } = simularPartido(strong, weak, rng);
  totalA += golesA;
  totalB += golesB;
  const key = `${golesA}-${golesB}`;
  dist[key] = (dist[key] || 0) + 1;
  if (golesA - golesB >= 5) goleadas++;
  if (golesB >= golesA) upsets++;
}

console.log('=== Comprobación de cordura (highlights realistas, N=' + N + ') ===');
console.log('Goles a favor (media):  ', (totalA / N).toFixed(2));
console.log('Goles en contra (media):', (totalB / N).toFixed(2));
console.log('Goleadas (dif>=5):      ', ((goleadas / N) * 100).toFixed(1) + '%');
console.log('Sin ganar (empate/derrota):', ((upsets / N) * 100).toFixed(1) + '%');

const top = Object.entries(dist).sort((a, b) => b[1] - a[1]).slice(0, 8);
console.log('Marcadores más comunes: ', top.map(([k, v]) => `${k}(${v})`).join('  '));

// --- Determinismo ---
const r1 = simularPartido(strong, generateOpponent(3, new RNG(7)), new RNG(42));
const r2 = simularPartido(strong, generateOpponent(3, new RNG(7)), new RNG(42));
const same = r1.golesA === r2.golesA && r1.golesB === r2.golesB &&
  JSON.stringify(r1.eventos) === JSON.stringify(r2.eventos);
console.log('\nDeterminismo (misma semilla → mismo partido):', same ? 'OK ✅' : 'FALLO ❌');

const meanA = totalA / N;
const meanB = totalB / N;
const ok = meanA >= 1.4 && meanA <= 3.6 && meanB <= 0.9 && upsets / N <= 0.28 && same;
console.log('\nResultado:', ok ? 'CORDURA OK ✅' : 'REVISAR ⚠️');
process.exit(ok ? 0 : 1);
