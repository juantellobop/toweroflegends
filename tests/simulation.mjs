import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { RNG } from '../engine/rng.js';
import { simularPartido } from '../engine/simulate.js';
import { PHASES, TERMINAL_TYPES } from '../engine/highlights.js';
import { sceneForEvent, sceneSources } from '../match/scenes.js';
import { PLAYERS } from '../data/players.js';
import { generateOpponent } from '../data/opponents.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function byId(id) {
  return PLAYERS.find((p) => p.id === id);
}

const team = {
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

for (const src of sceneSources()) {
  assert.ok(fs.existsSync(path.join(ROOT, src)), `falta escena: ${src}`);
}

const r1 = simularPartido(team, generateOpponent(5, new RNG(7)), new RNG(42));
const r2 = simularPartido(team, generateOpponent(5, new RNG(7)), new RNG(42));
assert.deepEqual(r1, r2);
assert.ok(r1.eventos.length > 0);

for (const ev of r1.eventos) {
  assert.ok(TERMINAL_TYPES.includes(ev.type), `tipo inesperado: ${ev.type}`);
  assert.ok(['A', 'B'].includes(ev.side));
  assert.ok(PHASES.includes(ev.phase), `fase inesperada: ${ev.phase}`);
  assert.ok(ev.actors && ev.actors.shooter && ev.actors.defender && ev.actors.keeper);
  assert.equal('steps' in ev, false, 'el nuevo enfoque no debe depender de microacciones');
  const scene = sceneForEvent(ev);
  assert.ok(scene.src && fs.existsSync(path.join(ROOT, scene.src)), `escena inválida para ${ev.type}`);
}

const seenTypes = new Set();
for (let seed = 1; seed <= 1600; seed++) {
  const result = simularPartido(team, generateOpponent((seed % 30) + 1, new RNG(10000 + seed)), new RNG(seed));
  for (const ev of result.eventos) seenTypes.add(ev.type);
  if (TERMINAL_TYPES.every((t) => seenTypes.has(t))) break;
}

assert.deepEqual(TERMINAL_TYPES.filter((t) => !seenTypes.has(t)), []);

console.log('Simulación por eventos y escenas: OK');
