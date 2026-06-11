import assert from 'node:assert/strict';
import { CONFIG, FORMATIONS } from '../data/config.js';
import { ROSTER } from '../data/roster.js';
import { ITEMS } from '../data/items.js';
import { OPPONENTS, generateOpponent } from '../data/opponents.js';
import { ovrBand } from '../engine/ovr.js';
import { RNG } from '../engine/rng.js';
import {
  applyItemsToRatings, chemTeamBonus, effectiveItemEffects, matchBonuses, matchStealBonus, metaBonuses,
} from '../engine/items.js';
import { buildBattleTeam } from '../engine/teamRatings.js';
import {
  chooseItemCard, choosePlayerCard, createRun, drawPlayerPack, isLineupComplete,
  placePlayerInLineup,
} from '../state/run.js';

function item(id) {
  return ITEMS.find((x) => x.id === id);
}

const near = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;

// Plantilla inicial: 11 cartas únicas de todo el roster, una por hueco de la
// formación, con bandas de OVR sorteadas ≈ 80% < 70 / 15% 70-90 / 5% > 90.
const starterBands = { low: 0, mid: 0, high: 0 };
let starterCount = 0;
for (const formation of Object.keys(FORMATIONS)) {
  for (let seed = 1; seed <= 200; seed++) {
    const state = createRun({ seed, formation });
    assert.equal(state.squad.length, CONFIG.STARTER_SQUAD_SIZE);
    assert.equal(new Set(state.squad.map((p) => p.id)).size, state.squad.length);
    assert.ok(isLineupComplete(state));
    for (const player of state.squad) {
      starterBands[ovrBand(player)] += 1;
      starterCount += 1;
    }
  }
}
const flexState = createRun({ seed: 303, formation: '4-3-1-2' });
const extraForward = ROSTER.find((p) => p.position === 'FWD' && !flexState.squad.some((owned) => owned.id === p.id));
const extraForwardCard = choosePlayerCard(flexState, extraForward);
assert.ok(extraForwardCard, '4-3-1-2 flex test needs an extra forward');
assert.ok(placePlayerInLineup(flexState, extraForwardCard, 'MID', 3).placed, 'forward must fit the enganche slot');
assert.ok(flexState.starting11.MID.some((p) => p.uid === extraForwardCard.uid), 'forward must be placed in MID line');
assert.ok(isLineupComplete(flexState), '4-3-1-2 must remain complete with a forward as enganche');
const flexBattle = buildBattleTeam({
  name: 'Flex',
  formation: flexState.formation,
  starting11: flexState.starting11,
  items: [],
});
assert.ok(flexBattle.midfielders.some((p) => p.name === extraForwardCard.name && p.position === 'ENG'), 'enganche must contribute to midfield build-up');
assert.ok(flexBattle.attackers.some((p) => p.name === extraForwardCard.name && p.position === 'ENG'), 'enganche must contribute to attack');
assert.ok(flexBattle.shooters.some((p) => p.name === extraForwardCard.name), 'enganche must be available as a shooter');
const starterPct = (band) => (starterBands[band] / starterCount) * 100;
assert.ok(Math.abs(starterPct('low') - 80) <= 6, `starter low% = ${starterPct('low').toFixed(1)}`);
assert.ok(Math.abs(starterPct('mid') - 15) <= 6, `starter mid% = ${starterPct('mid').toFixed(1)}`);
assert.ok(Math.abs(starterPct('high') - 5) <= 4, `starter high% = ${starterPct('high').toFixed(1)}`);

// Objetos: escala global, serie geométrica y topes por rating.
const gloves = item('guantes_magicos');
assert.deepEqual(effectiveItemEffects([gloves, gloves, gloves]).map((e) => e.value), [3, 1.5, 0.75]);
assert.equal(applyItemsToRatings({ attack: 50, midfield: 50, defense: 50, gk: 50 }, [gloves, gloves, gloves]).gk, 55.25);
const pressure = item('presion_alta');
assert.equal(matchStealBonus([pressure, pressure, pressure]), 0.105);
assert.equal(item('suplentes_lujo'), undefined);
assert.equal(item('ojeador'), undefined);

// Catálogo ampliado: ids únicos y reparto de tipos.
assert.ok(ITEMS.length >= 28, `catálogo de ítems pequeño: ${ITEMS.length}`);
assert.equal(new Set(ITEMS.map((x) => x.id)).size, ITEMS.length, 'ids de ítems duplicados');

// Reliquias meta: cartas extra en sobres, con decaimiento por copia.
assert.deepEqual(metaBonuses([item('ojeador_estrella'), item('director_deportivo')]),
  { extraPlayerCard: 1, extraItemCard: 1 });
assert.deepEqual(metaBonuses([item('banquillo_lujo')]), { extraPlayerCard: 1, extraItemCard: 1 });
// 2ª copia decae (1 + 0.5 = 1.5 → floor 1): los sobres no crecen sin límite.
assert.deepEqual(metaBonuses([item('ojeador_estrella'), item('ojeador_estrella')]),
  { extraPlayerCard: 1, extraItemCard: 0 });

// Efectos de partido: nerfeados a la mitad y topados por MATCH_BONUS_CAPS.
const counterItem = item('contragolpe_ensayado');
assert.equal(matchBonuses([counterItem]).counterBoost, 3); // 6 × 0.5
assert.ok(matchBonuses(Array(10).fill(counterItem)).counterBoost <= CONFIG.MATCH_BONUS_CAPS.counterBoost);
assert.equal(matchBonuses([item('cerrojo_final')]).lateDefense, 3);
assert.equal(matchBonuses([item('remontada')]).comebackBoost, 0.02);
const penalty = matchBonuses([item('pena_maxima')]);
assert.equal(penalty.penaltyChance, 0.4);
assert.equal(penalty.penaltyConvert, 0.03);

// Sinergia ítem↔táctica: ×1.5 solo si el dibujo comparte el tipo del ítem.
assert.equal(matchBonuses([counterItem], '4-4-2').counterBoost, 4.5); // 4-4-2 = contra
assert.equal(matchBonuses([counterItem], '4-3-3').counterBoost, 3); // presión ≠ contra
const tikitaka = item('tiki_taka');
const base = { attack: 50, midfield: 50, defense: 50, gk: 50 };
assert.ok(near(applyItemsToRatings(base, [tikitaka]).midfield, 52), 'sin formación, sin sinergia');
assert.ok(near(applyItemsToRatings(base, [tikitaka], '4-2-3-1').midfield, 53), 'posesión activa la sinergia');
assert.ok(near(applyItemsToRatings(base, [tikitaka], '4-4-2').midfield, 52), 'contra no la activa');

// Reliquia de química: +2 de equipo, con decaimiento en copias.
assert.equal(chemTeamBonus([item('duodecimo_jugador')]), 2);
assert.equal(chemTeamBonus([item('duodecimo_jugador'), item('duodecimo_jugador')]), 3);
// Sin topes de acumulación: cada objeto distinto suma entero (tras el nerfeo
// ×0.5); el decaimiento solo aplica a copias del mismo objeto.
const hugeAdds = Array.from({ length: 3 }, (_, i) => ({
  id: `huge-add-${i}`, effects: [{ target: 'team', stat: 'attack', op: 'add', value: 100 }],
}));
const hugeMults = Array.from({ length: 3 }, (_, i) => ({
  id: `huge-mult-${i}`, effects: [{ target: 'team', stat: 'midfield', op: 'mult', value: 2 }],
}));
assert.equal(applyItemsToRatings({ attack: 50, midfield: 50, defense: 50, gk: 50 }, hugeAdds).attack, 200);
assert.ok(Math.abs(applyItemsToRatings({ attack: 50, midfield: 50, defense: 50, gk: 50 }, hugeMults).midfield - 125) < 1e-9);

// Jugadores únicos: sobre jugable, repetidas deshabilitadas y alta rechazada.
const tinyCatalog = ROSTER.slice(0, 4);
const owned = tinyCatalog.slice(0, 3);
const pack = drawPlayerPack(tinyCatalog, owned, 3, CONFIG.PACK_BAND_WEIGHTS, new RNG(2));
assert.ok(pack.some((p) => p.selectable));
assert.ok(pack.some((p) => !p.selectable));

// Sobres: la banda de OVR se reparte ≈ 60% < 70 / 30% 70-90 / 10% > 90.
const packBands = { low: 0, mid: 0, high: 0 };
let packCount = 0;
const packRng = new RNG(123);
for (let i = 0; i < 3000; i++) {
  for (const card of drawPlayerPack(ROSTER, [], 5, CONFIG.PACK_BAND_WEIGHTS, packRng)) {
    packBands[ovrBand(card)] += 1;
    packCount += 1;
  }
}
const packPct = (band) => (packBands[band] / packCount) * 100;
assert.ok(Math.abs(packPct('low') - 60) <= 6, `pack low% = ${packPct('low').toFixed(1)}`);
assert.ok(Math.abs(packPct('mid') - 30) <= 6, `pack mid% = ${packPct('mid').toFixed(1)}`);
assert.ok(Math.abs(packPct('high') - 10) <= 5, `pack high% = ${packPct('high').toFixed(1)}`);
const state = createRun({ seed: 7 });
const duplicate = { ...state.squad[0], selectable: true };
assert.equal(choosePlayerCard(state, duplicate), null);
assert.equal(new Set(state.squad.map((p) => p.id)).size, state.squad.length);
chooseItemCard(state, gloves);
chooseItemCard(state, gloves);
assert.equal(state.items.filter((x) => x.id === gloves.id).length, 2);

// Rivales: todos son equipo-año único, tienen once y la selección rota dentro
// de una fuerza similar sin romper la progresión ascendente de la torre.
assert.ok(OPPONENTS.length >= 80);
assert.equal(new Set(OPPONENTS.map((o) => o.id)).size, OPPONENTS.length);
for (const opponent of OPPONENTS) {
  assert.equal(opponent.stage, 'quarterfinal-or-better');
  assert.equal(opponent.lineup.length, 11);
  assert.equal(opponent.lineup.filter((p) => p.position === 'GK').length, 1);
  assert.ok(Object.values(opponent.ratings).every((v) => Number.isFinite(v)));
}
const used = [];
let previousStrength = 0;
for (let level = 1; level <= 60; level++) {
  const opponent = generateOpponent(level, new RNG(100 + level), used);
  assert.ok(opponent.strength >= previousStrength, `nivel ${level}: fuerza ${opponent.strength} < ${previousStrength}`);
  if (used.includes(opponent.id)) {
    assert.ok(previousStrength >= 95, `repetido antes del ciclo de élite: ${opponent.id}`);
  }
  used.push(opponent.id);
  previousStrength = opponent.strength;
}
const level10Variants = new Set();
for (let seed = 1; seed <= 30; seed++) {
  level10Variants.add(generateOpponent(10, new RNG(seed)).id);
}
assert.ok(level10Variants.size >= 4, `rotación insuficiente en nivel 10: ${level10Variants.size}`);

console.log('Balance y jugabilidad: OK');
