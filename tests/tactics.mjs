// Torre de Leyendas — Tests de los sistemas tácticos (Cambios 1-5):
// modificadores de formación, counter de tipos, química profunda y duelos.
// Ejecuta: `node tests/tactics.mjs`.

import assert from 'node:assert/strict';
import {
  CONFIG, formationType, typeThatBeats, matchupVs, TYPE_COUNTER,
} from '../data/config.js';
import { computeChemistry, computeTeamChem } from '../engine/chemistry.js';
import { calcularRatings } from '../engine/teamRatings.js';
import { simularPartido } from '../engine/simulate.js';
import { generateOpponent } from '../data/opponents.js';
import { PLAYERS } from '../data/players.js';
import { RNG } from '../engine/rng.js';

const byId = (id) => PLAYERS.find((p) => p.id === id);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;

// === 1. Tipos tácticos: triángulo, identidad y cruce ===
assert.equal(formationType('5-3-2'), 'contra');
assert.equal(formationType('3-4-3'), 'presion');
assert.equal(formationType('3-5-2'), 'posesion');
assert.equal(formationType('4-4-2'), 'contra');
assert.equal(formationType('9-0-1'), null, 'formas desconocidas no tienen tipo');

// El triángulo debe ser un 3-ciclo cerrado.
assert.equal(TYPE_COUNTER.posesion, 'presion');
assert.equal(TYPE_COUNTER.presion, 'contra');
assert.equal(TYPE_COUNTER.contra, 'posesion');
assert.equal(typeThatBeats('presion'), 'posesion');
assert.equal(typeThatBeats('contra'), 'presion');
assert.equal(typeThatBeats('posesion'), 'contra');

assert.equal(matchupVs('posesion', 'presion'), 'edge');
assert.equal(matchupVs('presion', 'posesion'), 'weak');
assert.equal(matchupVs('posesion', 'posesion'), 'even');
assert.equal(matchupVs('posesion', null), 'even');

// === 2. Modificadores de formación (vía rama de rival precomputado) ===
const flat = { attack: 50, midfield: 50, defense: 50, gk: 50 };
const def532 = calcularRatings({ ratings: { ...flat }, formation: '5-3-2' });
assert.ok(near(def532.defense, 53), `5-3-2 defensa = ${def532.defense}`); // 50*1.06
assert.ok(near(def532.attack, 47.5), `5-3-2 ataque = ${def532.attack}`); // 50*0.95
const atk343 = calcularRatings({ ratings: { ...flat }, formation: '3-4-3' });
assert.ok(near(atk343.attack, 53), `3-4-3 ataque = ${atk343.attack}`); // 50*1.06
assert.ok(near(atk343.defense, 47), `3-4-3 defensa = ${atk343.defense}`); // 50*0.94
const neutral = calcularRatings({ ratings: { ...flat }, formation: '4-4-2' });
assert.deepEqual(neutral, flat, '4-4-2 es neutro');
const unknown = calcularRatings({ ratings: { ...flat }, formation: '9-0-1' });
assert.deepEqual(unknown, flat, 'forma desconocida es neutra');

// === 3. Counter aplicado en la simulación (mutación de ratings) ===
// teamA (3-5-2 = posesión) cuenta a teamB (4-3-3 = presión) → A recibe +TYPE_BONUS
// en ataque y medio; B solo su modificador de formación, sin bonus.
const cA = { name: 'A', ratings: { ...flat }, formation: '3-5-2' };
const cB = { name: 'B', ratings: { ...flat }, formation: '4-3-3' };
const counterRes = simularPartido(cA, cB, new RNG(1));
// A: 3-5-2 → attack 49.5, midfield 52.5; counter ×1.06 → 52.47→52.5, 55.65→55.7
assert.ok(near(counterRes.ratingsA.attack, 52.5), `A.attack = ${counterRes.ratingsA.attack}`);
assert.ok(near(counterRes.ratingsA.midfield, 55.7), `A.midfield = ${counterRes.ratingsA.midfield}`);
assert.ok(near(counterRes.ratingsA.defense, 49), `A.defense sin counter = ${counterRes.ratingsA.defense}`);
// B: 4-3-3 → attack 52, midfield 50; sin counter (es el contrarrestado)
assert.ok(near(counterRes.ratingsB.attack, 52), `B.attack = ${counterRes.ratingsB.attack}`);
assert.ok(near(counterRes.ratingsB.midfield, 50), `B.midfield = ${counterRes.ratingsB.midfield}`);

// Tipos iguales → sin counter (ambos solo con su modificador).
const evenRes = simularPartido(
  { name: 'A', ratings: { ...flat }, formation: '3-5-2' },
  { name: 'B', ratings: { ...flat }, formation: '4-3-1-2' }, // ambos posesión
  new RNG(1),
);
assert.ok(near(evenRes.ratingsA.midfield, 52.5), `even A.midfield = ${evenRes.ratingsA.midfield}`); // solo 1.05

// === 4. Química profunda ===
// Pares de nación en una línea: 3 connacionales → C(3,2)=3 pares ×2 = 6.
const sameNation = ['1990', '1990', '1990'].map((era, i) => ({ nation: 'Italia', era, position: 'DEF' }));
const chem = computeChemistry({ GK: [], DEF: sameNation, MID: [], FWD: [] });
assert.equal(chem.DEF, Math.min(CONFIG.CHEM_CAP, 6 + 3), 'nación + época exacta');

// Épocas: década exacta vale CHEM_ERA; contigua, la mitad.
const eraPair = computeChemistry({ GK: [], DEF: [
  { nation: 'A', era: '1960', position: 'DEF' },
  { nation: 'B', era: '1970', position: 'DEF' },
], MID: [], FWD: [] });
assert.equal(eraPair.DEF, CONFIG.CHEM_ERA_ADJACENT, 'décadas contiguas = medio punto');

// Núcleo nacional: escalones 5→+1, 7→+2, 9+→+3 (tope CHEM_CORE_CAP).
const core = (n) => {
  const players = Array.from({ length: 11 }, (_, i) => ({
    nation: i < n ? 'Brasil' : `X${i}`, era: '2000', position: i === 0 ? 'GK' : 'DEF',
  }));
  return computeTeamChem({ GK: [players[0]], DEF: players.slice(1), MID: [], FWD: [] }, '4-4-2').all;
};
assert.equal(core(4), 0, '4 connacionales: sin núcleo');
assert.equal(core(5), 1, '5 connacionales: +1');
assert.equal(core(7), 2, '7 connacionales: +2');
assert.equal(core(11), CONFIG.CHEM_CORE_CAP, 'XI nacional: tope');

// Cohesión táctica: mayoría de jugadores tipados que coincide con el dibujo.
const cohesive = computeTeamChem({
  GK: [{ nation: 'A', era: '2000', position: 'GK' }],
  DEF: [
    { nation: 'A', era: '2000', position: 'DEF', tacticalType: 'presion' },
    { nation: 'A', era: '2000', position: 'DEF', tacticalType: 'presion' },
  ],
  MID: [{ nation: 'A', era: '2000', position: 'MID', tacticalType: 'posesion' }],
  FWD: [],
}, '4-3-3'); // 4-3-3 = presión; 2 de 3 tipados son presión → cohesión
assert.equal(cohesive.attackMid, CONFIG.CHEM_TACTIC, 'cohesión táctica activa');

// === 5. Duelos: el portero individual pelea el mano a mano ===
// Dos porteros con la MISMA media (mismo rating de equipo) pero distinto reparto:
// el de reflejos altos debe encajar menos goles que el de colocación alta.
function teamWithKeeper(gk) {
  return {
    name: 'Leyendas',
    starting11: {
      GK: [gk],
      DEF: ['def_maldini_1994', 'def_cannavaro_2006', 'def_carlos_2002', 'def_cafu_2002'].map(byId),
      MID: ['mid_zidane_1998', 'mid_xavi_2010', 'mid_gerrard_2006'].map(byId),
      FWD: ['fwd_ronaldo_2002', 'fwd_henry_2006', 'fwd_batistuta_1998'].map(byId),
    },
    items: [],
  };
}
const base = { id: 'gk_test', name: 'Test', nation: 'Test', era: '2000', position: 'GK', rarity: 'epic', stats: null, trait: null, tacticalType: null };
const reflexKeeper = { ...base, gk: { reflexes: 99, handling: 50, positioning: 50 } };
const placedKeeper = { ...base, gk: { reflexes: 50, handling: 50, positioning: 99 } };
// Mismo rating de equipo (mismo promedio) para aislar el duelo.
assert.ok(
  near(calcularRatings(teamWithKeeper(reflexKeeper)).gk, calcularRatings(teamWithKeeper(placedKeeper)).gk),
  'ambos porteros dan el mismo rating de equipo',
);
let concededReflex = 0;
let concededPlaced = 0;
const N = 3000;
for (let i = 0; i < N; i++) {
  const opp = generateOpponent((i % 20) + 8, new RNG(70000 + i));
  concededReflex += simularPartido(teamWithKeeper(reflexKeeper), opp, new RNG(2000 + i)).golesB;
  concededPlaced += simularPartido(teamWithKeeper(placedKeeper), opp, new RNG(2000 + i)).golesB;
}
assert.ok(
  concededReflex < concededPlaced,
  `el portero de reflejos debe encajar menos: reflejos=${concededReflex} vs colocación=${concededPlaced}`,
);

// === 6. Determinismo preservado ===
const t1 = teamWithKeeper(reflexKeeper);
const d1 = simularPartido(t1, generateOpponent(5, new RNG(7)), new RNG(42));
const d2 = simularPartido(t1, generateOpponent(5, new RNG(7)), new RNG(42));
assert.deepEqual(d1, d2, 'misma semilla → mismo partido');

console.log(`Tácticas (formación, counter, química, duelos): OK · reflejos=${concededReflex} < colocación=${concededPlaced} goles en ${N} partidos`);
