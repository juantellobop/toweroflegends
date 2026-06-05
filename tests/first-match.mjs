// Regla oculta: el primer partido de la torre (nivel 1) es imposible de perder
// (como mínimo se empata). Del segundo nivel en adelante, se puede perder.

import assert from 'node:assert/strict';
import { createRun, playMatch } from '../state/run.js';

function weaken(state) {
  // Deja al jugador muy flojo para forzar derrotas en la simulación cruda.
  for (const line of Object.keys(state.starting11)) {
    for (const p of state.starting11[line]) {
      if (p.stats) for (const k of Object.keys(p.stats)) p.stats[k] = 1;
      if (p.gk) for (const k of Object.keys(p.gk)) p.gk[k] = 1;
    }
  }
}

function assertConsistent(result) {
  let a = 0;
  let b = 0;
  for (const ev of result.eventos.slice().sort((x, y) => x.minute - y.minute)) {
    if (ev.type === 'gol') ev.side === 'A' ? (a += 1) : (b += 1);
  }
  assert.equal(a, result.golesA, 'golesA debe coincidir con los goles de A en los eventos');
  assert.equal(b, result.golesB, 'golesB debe coincidir con los goles de B en los eventos');
}

const N = 250;

// Nivel 1: nunca pierde.
let level1Draws = 0;
for (let i = 0; i < N; i++) {
  const state = createRun({ seed: 1000 + i });
  weaken(state);
  state.level = 1;
  const result = playMatch(state);
  assert.ok(result.golesA >= result.golesB,
    `Nivel 1 no debe perder (seed ${1000 + i}): ${result.golesA}-${result.golesB}`);
  assertConsistent(result);
  if (result.golesA === result.golesB) level1Draws += 1;
}

// Nivel 2 (mismo equipo flojo): se permite perder con normalidad.
let level2Losses = 0;
for (let i = 0; i < N; i++) {
  const state = createRun({ seed: 1000 + i });
  weaken(state);
  state.level = 2;
  const result = playMatch(state);
  assertConsistent(result);
  if (result.golesB > result.golesA) level2Losses += 1;
}

assert.ok(level1Draws > 0, 'Con un equipo flojo, el nivel 1 debería rescatar empates (prueba que la regla actúa)');
assert.ok(level2Losses > 0, 'En nivel 2 deben poder darse derrotas (la regla solo aplica al primer partido)');

console.log(`Regla del primer partido: OK (nivel1 empates rescatados=${level1Draws}/${N}, nivel2 derrotas=${level2Losses}/${N})`);
