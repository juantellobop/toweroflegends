// Torre de Leyendas — Arranque de la run: tope de leyendas y carry-over.
// Ejecuta: `npm run run` o `node tests/run.mjs`.
// Cubre: la plantilla inicial nunca trae más de 2 leyendas (con un parámetro
// menor el tope baja) y que "Volver a jugar" incorpora la carta arrastrada
// respetando el tope y sin duplicar al mismo jugador.

import { createRun, generateStarterSquad } from '../state/run.js';
import { getPlayableRoster } from '../data/playableRoster.js';
import { CONFIG } from '../data/config.js';
import { RNG } from '../engine/rng.js';

let pass = 0;
let fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log('  ✅', name); }
  else { fail++; console.log('  ❌', name); }
}

const roster = getPlayableRoster();
const legendsIn = (squad) => squad.filter((p) => p.rarity === 'legend').length;
const dupKey = (p) => p.dupGroup || p.id;

// === A. Tope por defecto: ninguna run arranca con más de 2 leyendas ===
{
  let worst = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const state = createRun({ seed, teamName: 'Test' });
    worst = Math.max(worst, legendsIn(state.squad));
  }
  check(`plantilla inicial ≤ 2 leyendas en 200 semillas (máx visto: ${worst})`, worst <= 2);
}

// === B. El parámetro maxLegends recorta el cupo (1 → como mucho 1 leyenda) ===
{
  let worst = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const squad = generateStarterSquad(roster, '4-3-3', CONFIG, new RNG(seed), 1);
    worst = Math.max(worst, legendsIn(squad));
  }
  check(`maxLegends=1 → ≤ 1 leyenda en 200 semillas (máx visto: ${worst})`, worst <= 1);
}

// === C. Carry-over: la carta elegida entra, sin duplicar, y se respeta el tope ===
{
  const legend = roster.find((p) => p.rarity === 'legend');
  check('hay alguna leyenda en el roster para la prueba', Boolean(legend));
  if (legend) {
    let okPresent = true;
    let okNoDup = true;
    let okCap = true;
    for (let seed = 1; seed <= 100; seed++) {
      const state = createRun({ seed, teamName: 'Test', carryoverPlayer: legend });
      if (!state.squad.some((p) => p.id === legend.id)) okPresent = false;
      const key = dupKey(legend);
      if (state.squad.filter((p) => dupKey(p) === key).length !== 1) okNoDup = false;
      if (legendsIn(state.squad) > 2) okCap = false;
    }
    check('la carta arrastrada está en la plantilla nueva', okPresent);
    check('no se duplica al mismo jugador (dupKey único)', okNoDup);
    check('arrastrar una leyenda no supera el tope de 2', okCap);
  }
}

console.log(fail === 0 ? '\nArranque de run (tope leyendas + carry-over): OK ✅' : `\nFALLOS: ${fail}`);
if (fail > 0) process.exit(1);
