// Torre de Leyendas — Tests de los sistemas tácticos:
// modificadores de formación (trade-off propio, sin counter al rival), extremos
// flexibles (MID/FWD), formación 4-2-3-1, química profunda, duelos y realismo.
// Ejecuta: `node tests/tactics.mjs`.

import assert from 'node:assert/strict';
import { CONFIG, formationType, formationLineSlots, FORMATION_MODIFIERS } from '../data/config.js';
import { computeChemistry, computeTeamChem } from '../engine/chemistry.js';
import { calcularRatings, buildBattleTeam } from '../engine/teamRatings.js';
import { simularPartido } from '../engine/simulate.js';
import { assignLineToSlots } from '../state/run.js';
import { generateOpponent } from '../data/opponents.js';
import { PLAYERS } from '../data/players.js';
import { RNG } from '../engine/rng.js';

const byId = (id) => PLAYERS.find((p) => p.id === id);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;

// === 1. Identidad de formación (incluida 4-2-3-1). Sin counter al rival. ===
assert.equal(formationType('5-3-2'), 'contra');
assert.equal(formationType('3-4-3'), 'presion');
assert.equal(formationType('4-2-3-1'), 'posesion');
assert.equal(formationType('9-0-1'), null);
assert.ok(FORMATION_MODIFIERS['4-2-3-1'], '4-2-3-1 tiene modificador');

// === 2. Modificadores de formación (vía rama de rival precomputado) ===
const flat = { attack: 50, midfield: 50, defense: 50, gk: 50 };
const def532 = calcularRatings({ ratings: { ...flat }, formation: '5-3-2' });
assert.ok(near(def532.defense, 53) && near(def532.attack, 47.5), `5-3-2 = ${JSON.stringify(def532)}`);
const atk343 = calcularRatings({ ratings: { ...flat }, formation: '3-4-3' });
assert.ok(near(atk343.attack, 53) && near(atk343.defense, 47), `3-4-3 = ${JSON.stringify(atk343)}`);
const f4231 = calcularRatings({ ratings: { ...flat }, formation: '4-2-3-1' });
assert.ok(near(f4231.midfield, 52) && near(f4231.attack, 51), `4-2-3-1 = ${JSON.stringify(f4231)}`);
assert.deepEqual(calcularRatings({ ratings: { ...flat }, formation: '4-4-2' }), flat, '4-4-2 neutro');

// === 3. SIN ventaja/desventaja respecto al rival ===
// 3-5-2 (posesión) vs 4-3-3 (presión): antes el counter daba +6% a A. Ahora A solo
// lleva su propio modificador de formación, sin nada extra por el rival.
const res = simularPartido(
  { name: 'A', ratings: { ...flat }, formation: '3-5-2' },
  { name: 'B', ratings: { ...flat }, formation: '4-3-3' },
  new RNG(1),
);
assert.ok(near(res.ratingsA.midfield, 52.5), `A.midfield solo modificador (52.5), no counter: ${res.ratingsA.midfield}`);
assert.ok(near(res.ratingsA.attack, 49.5), `A.attack solo modificador (49.5): ${res.ratingsA.attack}`);

// === 4. Extremos flexibles (MID o FWD) y delantero centro preservado ===
const fwdSlots = formationLineSlots('4-3-3', 'FWD');
assert.deepEqual(fwdSlots[0].accepts.sort(), ['FWD', 'MID'], 'extremo izq acepta MID/FWD');
assert.deepEqual(fwdSlots[2].accepts.sort(), ['FWD', 'MID'], 'extremo der acepta MID/FWD');
assert.deepEqual(fwdSlots[1].accepts, ['FWD'], 'el 9 (centro) sigue siendo solo delantero');

// El orden del array se preserva: el centro (índice 1) va al slot central.
const triade = [byId('fwd_pele_1970'), byId('fwd_maradona_1986'), byId('fwd_ronaldo_2002')];
const placed = assignLineToSlots('4-3-3', 'FWD', triade);
assert.equal(placed.find((s) => s.slotIndex === 1).player.id, 'fwd_maradona_1986', 'el del medio queda en el centro');

// Un mediocampista colocado de extremo es válido y puntúa como atacante.
const midWing = [byId('mid_xavi_2010'), byId('fwd_pele_1970'), byId('fwd_ronaldo_2002')];
const wingPlaced = assignLineToSlots('4-3-3', 'FWD', midWing);
assert.equal(wingPlaced.find((s) => s.slotIndex === 0).player.id, 'mid_xavi_2010', 'el MID ocupa el extremo');
assert.equal(wingPlaced.find((s) => s.slotIndex === 1).player.id, 'fwd_pele_1970', 'el FWD ocupa el centro');
const wingTeam = {
  name: 'Alas', formation: '4-3-3', items: [],
  starting11: {
    GK: [byId('gk_yashin_1966')],
    DEF: ['def_beckenbauer_1974', 'def_maldini_1994', 'def_baresi_1990', 'def_cannavaro_2006'].map(byId),
    MID: ['mid_zidane_1998', 'mid_platini_1984', 'mid_iniesta_2010'].map(byId),
    FWD: midWing,
  },
};
assert.ok(buildBattleTeam(wingTeam).attackers.some((p) => p.name === byId('mid_xavi_2010').name),
  'un mediocampista de extremo contribuye al ataque');

// === 5. 4-2-3-1: línea de creación admite MID o FWD ===
const midSlots = formationLineSlots('4-2-3-1', 'MID');
assert.deepEqual(midSlots[0].accepts, ['MID'], 'pivote = solo MID');
assert.equal(midSlots[2].role, 'ENG', 'la creación puntúa como enganche');
assert.deepEqual(midSlots[2].accepts.sort(), ['FWD', 'MID'], 'la creación admite MID o FWD');
// Un delantero puede jugar en la línea de creación (índice 2+).
const creators = ['mid_zidane_1998', 'mid_platini_1984', 'mid_iniesta_2010', 'mid_xavi_2010'].map(byId);
creators.push(byId('fwd_maradona_1986')); // un FWD como mediapunta/extremo
const f4231team = {
  name: '4231', formation: '4-2-3-1', items: [],
  starting11: {
    GK: [byId('gk_yashin_1966')],
    DEF: ['def_beckenbauer_1974', 'def_maldini_1994', 'def_baresi_1990', 'def_cannavaro_2006'].map(byId),
    MID: creators,
    FWD: [byId('fwd_pele_1970')],
  },
};
const f4231bt = buildBattleTeam(f4231team);
assert.ok(f4231bt.attackers.some((p) => p.name === byId('fwd_pele_1970').name), 'el 9 está en ataque');
assert.ok(f4231bt.midfielders.length >= 5, '5 jugadores nutren el mediocampo');

// === 6. Química profunda (sin cambios) ===
const sameNation = ['1990', '1990', '1990'].map((era) => ({ nation: 'Italia', era, position: 'DEF' }));
assert.equal(computeChemistry({ GK: [], DEF: sameNation, MID: [], FWD: [] }).DEF, 9, 'nación + época');
const core = (n) => {
  const players = Array.from({ length: 11 }, (_, i) => ({ nation: i < n ? 'Brasil' : `X${i}`, era: '2000', position: i === 0 ? 'GK' : 'DEF' }));
  return computeTeamChem({ GK: [players[0]], DEF: players.slice(1), MID: [], FWD: [] }, '4-4-2').all;
};
assert.equal(core(4), 0);
assert.equal(core(5), 1);
assert.equal(core(11), CONFIG.CHEM_CORE_CAP);

// === 7. Realismo: constantes presentes y peso individual subido ===
assert.ok(CONFIG.RED_CARD_PENALTY > 0 && CONFIG.RED_CARD_PENALTY < 0.5, 'penalización de roja sana');
assert.ok(CONFIG.COMEBACK_PUSH > 0 && CONFIG.COMEBACK_PUSH < 0.2, 'empuje de remontada sano');
assert.ok(near(CONFIG.W_DUEL, 0.4), 'peso del duelo individual = 0.4');

// Calibración del marcador (equipos iguales): goles totales, 0-0 y rojas en
// bandas realistas de fútbol. Protege el ajuste fino del motor de regresiones.
{
  const M = 1200;
  const mk = (name) => ({ name, formation: '4-4-2', ratings: { attack: 70, midfield: 70, defense: 70, gk: 70 } });
  let goals = 0;
  let zeroZero = 0;
  let reds = 0;
  for (let i = 0; i < M; i++) {
    const r = simularPartido(mk('A'), mk('B'), new RNG(40000 + i));
    goals += r.golesA + r.golesB;
    if (r.golesA === 0 && r.golesB === 0) zeroZero += 1;
    reds += r.eventos.filter((ev) => ev.pattern === 'red_foul').length;
  }
  const avgGoals = goals / M;
  const zeroPct = zeroZero / M;
  const redsPerMatch = reds / M;
  assert.ok(avgGoals >= 2.0 && avgGoals <= 2.9, `goles/partido realista (2.0-2.9): ${avgGoals.toFixed(2)}`);
  assert.ok(zeroPct <= 0.16, `0-0 contenido (≤16%): ${(zeroPct * 100).toFixed(1)}%`);
  assert.ok(redsPerMatch > 0.03 && redsPerMatch < 0.35, `rojas/partido realista: ${redsPerMatch.toFixed(3)}`);
}

// === 8. Duelos: el portero individual pelea el mano a mano ===
function teamWithKeeper(gk) {
  return {
    name: 'Leyendas',
    starting11: {
      GK: [gk],
      DEF: ['def_maldini_1994', 'def_cannavaro_2006', 'def_carlos_2002', 'def_baresi_1990'].map(byId),
      MID: ['mid_zidane_1998', 'mid_xavi_2010', 'mid_gerrard_2006'].map(byId),
      FWD: ['fwd_pele_1970', 'fwd_ronaldo_2002', 'fwd_maradona_1986'].map(byId),
    },
    items: [],
  };
}
const base = { id: 'gk_test', name: 'Test', nation: 'Test', era: '2000', position: 'GK', rarity: 'epic', stats: null, trait: null, tacticalType: null };
const reflexKeeper = { ...base, gk: { reflexes: 99, handling: 50, positioning: 50 } };
const placedKeeper = { ...base, gk: { reflexes: 50, handling: 50, positioning: 99 } };
assert.ok(near(calcularRatings(teamWithKeeper(reflexKeeper)).gk, calcularRatings(teamWithKeeper(placedKeeper)).gk), 'mismo rating de equipo');
let concededReflex = 0;
let concededPlaced = 0;
const N = 3000;
for (let i = 0; i < N; i++) {
  const opp = generateOpponent((i % 20) + 8, new RNG(70000 + i));
  concededReflex += simularPartido(teamWithKeeper(reflexKeeper), opp, new RNG(2000 + i)).golesB;
  concededPlaced += simularPartido(teamWithKeeper(placedKeeper), opp, new RNG(2000 + i)).golesB;
}
assert.ok(concededReflex < concededPlaced, `reflejos encaja menos: ${concededReflex} vs ${concededPlaced}`);

// === 9. Determinismo preservado (con roja y empuje incluidos) ===
const t1 = teamWithKeeper(reflexKeeper);
const d1 = simularPartido(t1, generateOpponent(5, new RNG(7)), new RNG(42));
const d2 = simularPartido(t1, generateOpponent(5, new RNG(7)), new RNG(42));
assert.deepEqual(d1, d2, 'misma semilla → mismo partido');

console.log(`Tácticas (formación, extremos, 4-2-3-1, química, duelos, realismo): OK · reflejos=${concededReflex} < colocación=${concededPlaced} en ${N} partidos`);
