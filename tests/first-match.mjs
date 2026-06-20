// Regla oculta: los primeros cinco partidos de la torre (niveles 1-5) son
// imposibles de perder (como mínimo se empata). Del sexto nivel en adelante, se
// puede perder con normalidad.

import assert from 'node:assert/strict';
import { createRun, playMatch } from '../state/run.js';

function weaken(state) {
  // Deja al jugador muy flojo para forzar derrotas en la simulación cruda.
  for (const line of Object.keys(state.starting11)) {
    for (const p of state.starting11[line]) {
      if (!p) continue; // el grid guarda null en los huecos vacíos
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

// Niveles 1-5: nunca se pierde (la regla rescata al menos el empate). Se mide en
// el nivel 1 cuántos empates se rescatan, prueba de que la regla actúa.
let level1Draws = 0;
for (const level of [1, 3, 5]) {
  for (let i = 0; i < N; i++) {
    const state = createRun({ seed: 1000 + i });
    weaken(state);
    state.level = level;
    const result = playMatch(state);
    assert.ok(result.golesA >= result.golesB,
      `Nivel ${level} no debe perder (seed ${1000 + i}): ${result.golesA}-${result.golesB}`);
    assertConsistent(result);
    if (level === 1 && result.golesA === result.golesB) level1Draws += 1;
  }
}

// Nivel 6 (mismo equipo flojo): se permite perder con normalidad.
let level6Losses = 0;
for (let i = 0; i < N; i++) {
  const state = createRun({ seed: 1000 + i });
  weaken(state);
  state.level = 6;
  const result = playMatch(state);
  assertConsistent(result);
  if (result.golesB > result.golesA) level6Losses += 1;
}

assert.ok(level1Draws > 0, 'Con un equipo flojo, el nivel 1 debería rescatar empates (prueba que la regla actúa)');
assert.ok(level6Losses > 0, 'En nivel 6 deben poder darse derrotas (la regla solo cubre los niveles 1-5)');

console.log(`Regla de los primeros cinco partidos: OK (nivel1 empates rescatados=${level1Draws}/${N}, nivel6 derrotas=${level6Losses}/${N})`);
