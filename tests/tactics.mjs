// Torre de Leyendas — Tests de los sistemas tácticos sobre el GRID FIJO (1-5-5-5-5):
// huecos del grid (accepts/role/perfil central·lateral), química geométrica de
// cercanía, estilo táctico libre (sinergia de objetos), perfiles de hueco, duelos
// y realismo del marcador. Ejecuta: `node tests/tactics.mjs`.

import assert from 'node:assert/strict';
import { CONFIG, formationType, formationLineSlots, geometricLinks } from '../data/config.js';
import { computeChemistry, computeTeamChem } from '../engine/chemistry.js';
import {
  duelBonus, gkDefenseLineBonus, penaltyConvertBonus, phaseShooterMultiplier,
} from '../engine/traits.js';
import { calcularRatings, buildBattleTeam } from '../engine/teamRatings.js';
import { effectiveItemEffects } from '../engine/items.js';
import { ITEMS } from '../data/items.js';
import { simularPartido } from '../engine/simulate.js';
import { assignLineToSlots } from '../state/run.js';
import { generateOpponent } from '../data/opponents.js';
import { PLAYERS } from '../data/players.js';
import { RNG } from '../engine/rng.js';

const byId = (id) => PLAYERS.find((p) => p.id === id);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;

// Grid vacío del motor (GK 1, DEF 5, MID 10 = MED 0-4 + ENG 5-9, FWD 5).
const grid = () => ({ GK: [null], DEF: Array(5).fill(null), MID: Array(10).fill(null), FWD: Array(5).fill(null) });

// === 1. Identidad/estilo de la formación (etiqueta y default; sin modificadores) ===
assert.equal(formationType('5-3-2'), 'contra');
assert.equal(formationType('3-4-3'), 'presion');
assert.equal(formationType('4-2-3-1'), 'posesion');
assert.equal(formationType('9-0-1'), null);

// === 2. Sin modificadores de formación: los ratings de un rival precomputado pasan
// intactos (el trade-off táctico vive ahora en dónde se colocan los jugadores). ===
const flat = { attack: 50, midfield: 50, defense: 50, gk: 50 };
assert.deepEqual(calcularRatings({ ratings: { ...flat }, formation: '5-3-2' }), flat, '5-3-2 sin modificador');
assert.deepEqual(calcularRatings({ ratings: { ...flat }, formation: '3-4-3' }), flat, '3-4-3 sin modificador');
assert.deepEqual(calcularRatings({ ratings: { ...flat }, formation: '4-4-2' }), flat, '4-4-2 sin modificador');

// === 3. Sin ventaja/desventaja respecto al rival: A solo lleva lo suyo (sin counter) ===
const res = simularPartido(
  { name: 'A', ratings: { ...flat }, formation: '3-5-2' },
  { name: 'B', ratings: { ...flat }, formation: '4-3-3' },
  new RNG(1),
);
assert.ok(near(res.ratingsA.midfield, 50), `A.midfield intacto (50): ${res.ratingsA.midfield}`);
assert.ok(near(res.ratingsA.attack, 50), `A.attack intacto (50): ${res.ratingsA.attack}`);

// === 4. Huecos del grid: accepts/role/perfil por fila y columna ===
const def = formationLineSlots('x', 'DEF');
assert.equal(def.length, 5, 'la línea DEF tiene 5 huecos');
assert.deepEqual(def[0].accepts, ['DEF'], 'DEF solo admite defensas');
assert.equal(def[0].profile, 'def_lateral', 'col 0 = lateral');
assert.equal(def[2].profile, 'def_central', 'col 2 = central');

const fwd = formationLineSlots('x', 'FWD');
assert.equal(fwd.length, 5, 'la línea DEL tiene 5 huecos');
assert.deepEqual(fwd[2].accepts, ['FWD'], 'DEL solo admite delanteros (el medio ya no sube)');
assert.equal(fwd[2].profile, 'del_central', 'DEL col 2 = central');
assert.equal(fwd[0].profile, 'del_lateral', 'DEL col 0 = lateral (extremo)');

const mid = formationLineSlots('x', 'MID');
assert.equal(mid.length, 10, 'la línea MID alberga MED (0-4) + ENG (5-9)');
assert.equal(mid[2].gridRow, 'MED', 'slot 2 = fila MED');
assert.deepEqual(mid[2].accepts, ['MID'], 'MED central solo admite medios');
assert.deepEqual(mid[0].accepts.sort(), ['DEF', 'MID'], 'MED lateral admite medios o defensas');
assert.deepEqual(mid[4].accepts.sort(), ['DEF', 'MID'], 'MED lateral admite medios o defensas');
assert.equal(mid[2].role, 'MID', 'MED puntúa como medio');
assert.equal(mid[7].gridRow, 'ENG', 'slot 7 = fila ENG');
assert.equal(mid[7].role, 'ENG', 'ENG puntúa como enganche');
assert.deepEqual(mid[7].accepts.sort(), ['FWD', 'MID'], 'ENG admite medios o delanteros');
assert.equal(mid[6].profile, 'eng_central', 'ENG col 1 = central');
assert.equal(mid[5].profile, 'eng_lateral', 'ENG col 0 = lateral');

// === 4b. Colocación: el array es posicional (índice = slotIndex del grid) ===
const triade = [byId('fwd_pele_1970'), byId('fwd_maradona_1986'), byId('fwd_ronaldo_2002')];
const placed = assignLineToSlots('x', 'FWD', triade);
assert.equal(placed.find((s) => s.slotIndex === 1).player.id, 'fwd_maradona_1986', 'el del medio queda en el hueco 1');

// Un defensa puede subir a un MED lateral (carrilero) y puntúa en el mediocampo.
const wingBackTeam = {
  name: 'Carrileros', formation: '4-4-2', items: [],
  starting11: (() => {
    const s = grid();
    s.GK[0] = byId('gk_yashin_1966');
    s.DEF[1] = byId('def_baresi_1990'); s.DEF[2] = byId('def_cannavaro_2006');
    // Un lateral defensivo de carrilero en el MED lateral (slot 0).
    s.MID[0] = byId('def_carlos_2002');
    s.MID[2] = byId('mid_xavi_2010'); s.MID[3] = byId('mid_iniesta_2010');
    s.FWD[1] = byId('fwd_pele_1970'); s.FWD[3] = byId('fwd_ronaldo_2002');
    return s;
  })(),
};
assert.ok(buildBattleTeam(wingBackTeam).midfielders.some((p) => p.name === byId('def_carlos_2002').name),
  'un defensa en el MED lateral contribuye al mediocampo');

// Un delantero puede jugar en la fila ENG (slots 5-9) y nutre medio+ataque.
const engTeam = {
  name: 'Eng', formation: '4-2-3-1', items: [],
  starting11: (() => {
    const s = grid();
    s.GK[0] = byId('gk_yashin_1966');
    ['def_beckenbauer_1974', 'def_maldini_1994', 'def_baresi_1990', 'def_cannavaro_2006'].forEach((id, i) => { s.DEF[[0, 1, 3, 4][i]] = byId(id); });
    s.MID[1] = byId('mid_zidane_1998'); s.MID[3] = byId('mid_xavi_2010'); s.MID[7] = byId('fwd_maradona_1986');
    s.FWD[2] = byId('fwd_pele_1970');
    return s;
  })(),
};
const engBt = buildBattleTeam(engTeam);
assert.ok(engBt.attackers.some((p) => p.name === byId('fwd_maradona_1986').name), 'el enganche (FWD) nutre el ataque');
assert.ok(engBt.midfielders.some((p) => p.name === byId('fwd_maradona_1986').name), 'el enganche nutre también el medio');

// === 5. Química geométrica (cercanía calculada desde los huecos OCUPADOS) ===
const mkP = (id, position, nation, era) => ({ id, name: id, position, nation, era, trait: null });

// Zaga de 4 en columnas 0,1,3,4 (plantilla 4-3-3), misma nación+época. Vecinos
// ocupados contiguos: 0-1, 1-3, 3-4 = 3 aristas × 3 (dentro de línea, completo) → DEF 9.
const zaga = grid();
[0, 1, 3, 4].forEach((c) => { zaga.DEF[c] = mkP('d' + c, 'DEF', 'Italia', '1990'); });
assert.equal(computeChemistry(zaga).DEF, 9, 'cadena de zaga: 3 aristas × 3');
// El portero, sin nada en común, no aporta por sus aristas GK↔central.
zaga.GK[0] = mkP('g', 'GK', 'NG', '1600');
assert.equal(computeChemistry(zaga).GK, 0, 'portero sin química no aporta');

// La química geométrica NO depende de la formación: opera sobre las posiciones.
assert.equal(computeChemistry(zaga, '4-3-3').DEF, 9, 'misma química con o sin formación');
assert.equal(computeChemistry(zaga, null).DEF, 9, 'el web es geométrico, no por formación');

// MED (col 2 = idx 2) y ENG (col 2 = idx 7) son vecinos verticales: nación+época
// = 3, ambos en la línea MID → 3 completo a MID.
const vert = grid();
vert.MID[2] = mkP('med', 'MID', 'Brasil', '2000');
vert.MID[7] = mkP('eng', 'FWD', 'Brasil', '2000');
assert.equal(computeChemistry(vert).MID, 3, 'MED↔ENG de la misma columna enlazan');

// Bandas opuestas no enlazan ENTRE líneas: lateral izq (DEF col 0) y volante der
// (MED col 4) están a |Δcol|=4 ≥ 3 → sin arista vertical.
const wings = grid();
wings.DEF[0] = mkP('dl', 'DEF', 'Japon', '1990');
wings.MID[4] = mkP('mr', 'MID', 'Japon', '1990');
const wc = computeChemistry(wings);
assert.equal(wc.DEF, 0, 'lateral izq y volante der no enlazan (bandas opuestas)');
assert.equal(wc.MID, 0, 'lateral izq y volante der no enlazan (bandas opuestas)');

// Un Capitán alineado suma +1 a la química de su línea, aunque no haya pares.
assert.equal(
  computeChemistry({ ...grid(), DEF: (() => { const d = Array(5).fill(null); d[2] = { ...mkP('c', 'DEF', 'A', '1700'), trait: 'Capitán' }; return d; })() }).DEF,
  1, 'capitán: +1 a su línea',
);

// Arista entre líneas contiguas ocupadas (MED↔DEL, con ENG vacía): mitad y mitad.
const interline = grid();
interline.MID[2] = mkP('m', 'MID', 'Brasil', '1980'); // MED col2
interline.FWD[2] = mkP('f', 'FWD', 'Brasil', '1980'); // DEL col2
const il = computeChemistry(interline);
assert.equal(il.MID, 1.5, 'MED↔DEL: mitad al medio');
assert.equal(il.FWD, 1.5, 'MED↔DEL: mitad al ataque');

// === 6. Química de equipo: núcleo nacional (computeTeamChem) ===
const core = (n) => {
  const players = Array.from({ length: 11 }, (_, i) => ({ nation: i < n ? 'Brasil' : `X${i}`, era: '2000', position: i === 0 ? 'GK' : 'DEF' }));
  return computeTeamChem({ GK: [players[0]], DEF: players.slice(1), MID: [], FWD: [] }).all;
};
assert.equal(core(4), 0);
assert.equal(core(5), 1);
assert.equal(core(7), 2, 'escalón: 7 connacionales → +2');
assert.equal(core(11), 4, 'núcleo nacional sin tope: 11 connacionales → +4');

// === 7. Estilo táctico libre: la sinergia de objetos depende del ESTILO elegido ===
const tikiTaka = ITEMS.find((item) => item.id === 'tiki_taka'); // synergyType: posesion
const effSinergia = effectiveItemEffects([tikiTaka], { style: 'posesion' });
assert.ok(!effSinergia.some((e) => e.value < 0), 'con el estilo afín el efecto negativo se anula');
assert.ok(near(effSinergia.find((e) => e.stat === 'midfield').value, 0.08 * CONFIG.ITEM_POWER_SCALE * CONFIG.ITEM_SYNERGY_MULT),
  'el efecto positivo se amplifica');
const effNeutra = effectiveItemEffects([tikiTaka], { style: 'presion' });
const negNeutra = effNeutra.find((e) => e.stat === 'defense');
assert.ok(negNeutra && negNeutra.value < 0, 'sin estilo afín el negativo sí aplica');
assert.ok(near(effNeutra.find((e) => e.stat === 'midfield').value, 0.08 * CONFIG.ITEM_POWER_SCALE),
  'sin estilo afín el positivo no se amplifica');
for (const type of ['posesion', 'presion', 'contra']) {
  const tradeoffs = ITEMS.filter((item) => item.synergyType === type &&
    item.effects.some((e) => e.op === 'mult' && e.value > 1) &&
    item.effects.some((e) => e.op === 'mult' && e.value < 1));
  assert.equal(tradeoffs.length, 4, `4 cartas +/− de ${type}: ${tradeoffs.map((i) => i.id).join(', ')}`);
}

// === 8. Rasgos condicionales (sin cambio respecto al motor) ===
assert.equal(duelBonus({ trait: 'Killer' }, { role: 'shooter', deficit: 0 }), 5);
assert.equal(duelBonus({ trait: 'Killer' }, { role: 'shooter', deficit: -1 }), 0);
assert.equal(duelBonus({ trait: 'Velocista' }, { role: 'shooter', phase: 'counter' }), 5);
assert.equal(duelBonus({ trait: 'Especialista' }, { role: 'shooter', phase: 'corner', deficit: -1 }), 4);
assert.equal(duelBonus({ trait: 'Garra' }, { role: 'defender', minute: 80 }), 4);
assert.equal(duelBonus({ trait: 'Garra' }, { role: 'shooter', minute: 80 }), 0, 'Garra es defensivo');
assert.equal(phaseShooterMultiplier({ trait: 'Penalero' }, 'penalty'), 2.5);
assert.equal(penaltyConvertBonus({ trait: 'Penalero' }), 0.05);
assert.equal(gkDefenseLineBonus({ trait: 'Mariscal' }), 1.5);
assert.equal(
  computeChemistry({ GK: [], DEF: [{ nation: 'A', era: '1900', trait: 'Capitán' }], MID: [], FWD: [] }).DEF,
  1, 'Capitán aporta +1 a su línea aunque no haya pares',
);

// === 9. Realismo del marcador (equipos iguales) ===
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
  assert.ok(avgGoals >= 2.0 && avgGoals <= 2.9, `goles/partido realista (2.0-2.9): ${avgGoals.toFixed(2)}`);
  assert.ok(zeroZero / M <= 0.16, `0-0 contenido (≤16%): ${((zeroZero / M) * 100).toFixed(1)}%`);
  assert.ok(reds / M > 0.03 && reds / M < 0.35, `rojas/partido realista: ${(reds / M).toFixed(3)}`);
}

// === 10. Perfiles de hueco: el mismo jugador rinde distinto por columna ===
const mkS = (id, position, stats) => ({ id, name: id, nation: `N_${id}`, era: '2000', position, rarity: 'common', stats, trait: null, tacticalType: null });
const stopper = (id) => mkS(id, 'DEF', { passing: 45, shooting: 30, defending: 92, dribbling: 40, pace: 55, physical: 90 });
const carrilero = (id) => mkS(id, 'DEF', { passing: 82, shooting: 45, defending: 62, dribbling: 80, pace: 90, physical: 62 });
const destructor = (id) => mkS(id, 'MID', { passing: 60, shooting: 35, defending: 90, dribbling: 45, pace: 60, physical: 88 });
const banda = (id) => mkS(id, 'MID', { passing: 72, shooting: 55, defending: 35, dribbling: 92, pace: 90, physical: 50 });
const ariete = (id) => mkS(id, 'FWD', { passing: 60, shooting: 92, defending: 25, dribbling: 70, pace: 70, physical: 85 });
const extremo = (id) => mkS(id, 'FWD', { passing: 72, shooting: 60, defending: 25, dribbling: 92, pace: 92, physical: 50 });

const ratingsOf = (line, byCol) => {
  const s11 = grid();
  for (const [col, player] of Object.entries(byCol)) s11[line][col] = player;
  return calcularRatings({ name: 'X', formation: 'x', items: [], starting11: s11 });
};

// DEF: stoppers en los centrales (1,2,3) y carrileros en los laterales (0,4)
// defienden más que al revés; los carrileros laterales proyectan más ataque.
const backOk = ratingsOf('DEF', { 0: carrilero('c1'), 1: stopper('s1'), 2: stopper('s2'), 3: stopper('s3'), 4: carrilero('c2') });
const backSwapped = ratingsOf('DEF', { 0: stopper('s1'), 1: carrilero('c1'), 2: carrilero('c2'), 3: carrilero('c3'), 4: stopper('s2') });
assert.ok(backOk.defense > backSwapped.defense, `stoppers centrales defienden más: ${backOk.defense} > ${backSwapped.defense}`);
assert.ok(backOk.attack > backSwapped.attack, `carrileros laterales proyectan: ${backOk.attack} > ${backSwapped.attack}`);

// MID: el destructor (corte) rinde más de central; la banda (regate/pace) de lateral.
const midCentralDestructor = ratingsOf('MID', { 2: destructor('d'), 0: banda('b') });
const midLateralDestructor = ratingsOf('MID', { 0: destructor('d'), 2: banda('b') });
assert.ok(midCentralDestructor.midfield > midLateralDestructor.midfield,
  `el destructor rinde más en el centro: ${midCentralDestructor.midfield} > ${midLateralDestructor.midfield}`);

// DEL: el ariete (remate/físico) de central; el extremo (regate/pace) de lateral.
const triOk = ratingsOf('FWD', { 0: extremo('w1'), 2: ariete('cf'), 4: extremo('w2') });
const triSwapped = ratingsOf('FWD', { 0: ariete('cf'), 2: extremo('w1'), 4: extremo('w2') });
assert.ok(triOk.attack > triSwapped.attack, `el 9 al centro, extremos por fuera: ${triOk.attack} > ${triSwapped.attack}`);

// Los laterales de la zaga entran al pool de asistentes; los centrales no.
const fullTeam = buildBattleTeam({
  name: 'Perfilado', formation: 'x', items: [],
  starting11: (() => {
    const s = grid();
    s.GK[0] = byId('gk_yashin_1966');
    s.DEF[0] = carrilero('c1'); s.DEF[1] = stopper('s1'); s.DEF[2] = stopper('s2'); s.DEF[3] = stopper('s3'); s.DEF[4] = carrilero('c2');
    s.MID[1] = destructor('dm'); s.MID[2] = banda('i1'); s.MID[3] = banda('i2');
    s.FWD[0] = extremo('w1'); s.FWD[2] = ariete('cf'); s.FWD[4] = extremo('w2');
    return s;
  })(),
});
assert.ok(fullTeam.assisters.some((a) => a.name === 'c1') && fullTeam.assisters.some((a) => a.name === 'c2'), 'los laterales asisten');
assert.ok(!fullTeam.assisters.some((a) => a.name === 's1'), 'los centrales no asisten');
const wShooter = (name) => fullTeam.shooters.find((sh) => sh.name === name)?.weight || 0;
assert.ok(wShooter('cf') > wShooter('w1'), `el 9 remata más: ${wShooter('cf')} > ${wShooter('w1')}`);

// === 11. Portero individual: reflejos encajan menos en el mano a mano ===
function teamWithKeeper(gk) {
  const s = grid();
  s.GK[0] = gk;
  ['def_maldini_1994', 'def_cannavaro_2006', 'def_carlos_2002', 'def_baresi_1990'].forEach((id, i) => { s.DEF[[0, 1, 3, 4][i]] = byId(id); });
  ['mid_zidane_1998', 'mid_xavi_2010', 'mid_gerrard_2006'].forEach((id, i) => { s.MID[[1, 2, 3][i]] = byId(id); });
  ['fwd_pele_1970', 'fwd_ronaldo_2002', 'fwd_maradona_1986'].forEach((id, i) => { s.FWD[[0, 2, 4][i]] = byId(id); });
  return { name: 'Leyendas', formation: '4-3-3', items: [], starting11: s };
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

// === 12. Determinismo preservado ===
const t1 = teamWithKeeper(reflexKeeper);
const d1 = simularPartido(t1, generateOpponent(5, new RNG(7)), new RNG(42));
const d2 = simularPartido(t1, generateOpponent(5, new RNG(7)), new RNG(42));
assert.deepEqual(d1, d2, 'misma semilla → mismo partido');

console.log(`Tácticas (grid, accepts/perfiles, química geométrica, estilo, duelos, realismo): OK · reflejos=${concededReflex} < colocación=${concededPlaced} en ${N} partidos`);
