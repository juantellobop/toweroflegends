import assert from 'node:assert/strict';
import { MatchDirector } from '../match/director.js';

function waitForEnd(director) {
  return new Promise((resolve) => {
    director.cb.onEnd = resolve;
    director.play();
  });
}

const event = {
  id: 'e1',
  minute: 1,
  side: 'A',
  type: 'tiro_fuera',
  phase: 'open_play',
  pattern: 'shot',
  attackerTeam: 'Leyendas',
  defenderTeam: 'Rival',
  shooter: 'Nueve',
  xg: 0.2,
  actors: { shooter: 'Nueve', passer: 'Diez', defender: 'Zaguero', keeper: 'Portero' },
};

let animateEvent = 0;
let animateFallback = 0;
const scenePitch = {
  animateEvent: async () => { animateEvent += 1; },
  animate: async () => { animateFallback += 1; },
  reset: () => {},
};
const d1 = new MatchDirector({
  events: [event],
  homeName: 'Leyendas',
  pitch: scenePitch,
  result: { golesA: 0, golesB: 0 },
  speed: 99,
  mode: 'full',
  callbacks: {},
});
await waitForEnd(d1);
assert.equal(animateEvent, 1);
assert.equal(animateFallback, 0);

const oldPitch = {
  animate: async () => { animateFallback += 1; },
  reset: () => {},
};
const d2 = new MatchDirector({
  events: [{ minute: 1, type: 'parada', attackerTeam: 'Leyendas', keeper: 'Portero' }],
  homeName: 'Leyendas',
  pitch: oldPitch,
  result: { golesA: 0, golesB: 0 },
  speed: 99,
  mode: 'full',
  callbacks: {},
});
await waitForEnd(d2);
assert.equal(animateFallback, 1);

let ended = false;
const d3 = new MatchDirector({
  events: [event],
  homeName: 'Leyendas',
  pitch: scenePitch,
  result: { golesA: 1, golesB: 0 },
  callbacks: { onEnd: () => { ended = true; } },
});
d3.skipToEnd();
assert.ok(ended);

console.log('Director de escenas: OK');
