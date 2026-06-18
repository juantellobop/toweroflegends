// Torre de Leyendas — Tests de los sistemas tácticos:
// modificadores de formación (trade-off propio, sin counter al rival), extremos
// flexibles (MID/FWD), formación 4-2-3-1, química profunda, duelos y realismo.
// Ejecuta: `node tests/tactics.mjs`.

import assert from 'node:assert/strict';
import { CONFIG, formationType, formationLineSlots, FORMATION_MODIFIERS } from '../data/config.js';
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

// === 5b. 3-2-4-1 (presión): 2 mediocentros + línea de 4 (extremos+enganches) + 9 ===
assert.equal(formationType('3-2-4-1'), 'presion');
assert.ok(FORMATION_MODIFIERS['3-2-4-1'], '3-2-4-1 tiene modificador');
const m3241 = formationLineSlots('3-2-4-1', 'MID');
assert.deepEqual(m3241[0].accepts, ['MID'], 'mediocentro = solo MID');
assert.deepEqual(m3241[1].accepts, ['MID'], 'mediocentro = solo MID');
assert.equal(m3241[2].role, 'ENG', 'el extremo puntúa como enganche');
assert.equal(m3241[5].role, 'ENG', 'el extremo puntúa como enganche');
for (const i of [2, 3, 4, 5]) {
  assert.deepEqual(m3241[i].accepts.sort(), ['FWD', 'MID'], `el hueco ofensivo ${i} admite MID o FWD`);
}
assert.equal(m3241[2].profile, 'extremo', 'flanco izquierdo = extremo');
assert.equal(m3241[3].profile, 'mediapunta', 'interior izquierdo = enganche');
assert.equal(m3241[5].profile, 'extremo', 'flanco derecho = extremo');
// La línea de 4 admite delanteros: un FWD puede jugar de extremo o enganche.
const offensive4 = ['mid_zidane_1998', 'mid_platini_1984', 'mid_iniesta_2010', 'mid_xavi_2010'].map(byId);
const m3241team = {
  name: '3241', formation: '3-2-4-1', items: [],
  starting11: {
    GK: [byId('gk_yashin_1966')],
    DEF: ['def_beckenbauer_1974', 'def_maldini_1994', 'def_baresi_1990'].map(byId),
    MID: [byId('mid_gerrard_2006'), byId('mid_xavi_2010'), ...offensive4],
    FWD: [byId('fwd_pele_1970')],
  },
};
const bt3241 = buildBattleTeam(m3241team);
assert.ok(bt3241.attackers.some((p) => p.name === byId('fwd_pele_1970').name), 'el 9 está en ataque');
assert.ok(bt3241.midfielders.length >= 6, 'los 6 del medio nutren el mediocampo');

// === 6. Química: bonus globales de equipo (computeTeamChem) ===
// Núcleo nacional: escalón floor((tamaño-3)/2) por país, sumado.
const core = (n) => {
  const players = Array.from({ length: 11 }, (_, i) => ({ nation: i < n ? 'Brasil' : `X${i}`, era: '2000', position: i === 0 ? 'GK' : 'DEF' }));
  return computeTeamChem({ GK: [players[0]], DEF: players.slice(1), MID: [], FWD: [] }, '4-4-2').all;
};
assert.equal(core(4), 0);
assert.equal(core(5), 1);
assert.equal(core(6), 1, 'escalón: 6 connacionales siguen siendo +1');
assert.equal(core(7), 2, 'escalón: 7 connacionales → +2');
assert.equal(core(11), 4, 'núcleo nacional sin tope: 11 connacionales → +4');

// Doble núcleo: 5 de un país + 5 de otro (+1 GK de nación única) → +1 +1 = +2.
const doubleCore = (() => {
  const players = [{ nation: 'GK', era: '2000', position: 'GK' }];
  for (let i = 0; i < 5; i++) players.push({ nation: 'Brasil', era: '2000', position: 'DEF' });
  for (let i = 0; i < 5; i++) players.push({ nation: 'Italia', era: '2000', position: 'DEF' });
  return computeTeamChem({ GK: [players[0]], DEF: players.slice(1), MID: [], FWD: [] }, '4-4-2').all;
})();
assert.equal(doubleCore, 2, 'doble núcleo: 5 Brasil + 5 Italia → +1 +1');

// === 6b. Web de cercanía (CHEM_LINKS): solo los huecos vecinos hacen química ===
// Once de control: naciones únicas y épocas espaciadas (ninguna pareja con diff 0
// o 10 años), salvo el par enlazado que se marca a mano.
const mkChemP = (id, position, nation, era) => ({ id, name: id, position, nation, era, trait: null });

// 4-4-2: una zaga de 4 misma nación+época son 3 aristas contiguas (0-1,1-2,2-3);
// cada una vale 3 (dentro de línea suma completo) → DEF 9. El portero (sin nada en
// común) no aporta por sus aristas GK↔central.
const xiZaga = {
  GK: [mkChemP('g', 'GK', 'NG', '1600')],
  DEF: ['1990', '1990', '1990', '1990'].map((era, i) => mkChemP(`d${i}`, 'DEF', 'Italia', era)),
  MID: [], FWD: [],
};
assert.equal(computeChemistry(xiZaga, '4-4-2').DEF, 9, 'cadena de zaga: 3 aristas × 3');
assert.equal(computeChemistry(xiZaga, '4-4-2').GK, 0, 'portero sin química no aporta');

// Sin formación no hay web (no hay aristas que recorrer).
assert.equal(computeChemistry(xiZaga).DEF, 0, 'sin formación no hay web');

// Un Capitán alineado suma +1 a la química de su línea.
const xiCap = {
  GK: [mkChemP('g', 'GK', 'NG', '1600')],
  DEF: [{ ...mkChemP('c', 'DEF', 'NA', '1700'), trait: 'Capitán' }, mkChemP('q1', 'DEF', 'NB', '1740'), mkChemP('q2', 'DEF', 'NC', '1780'), mkChemP('q3', 'DEF', 'ND', '1820')],
  MID: [], FWD: [],
};
assert.equal(computeChemistry(xiCap, '4-4-2').DEF, 1, 'capitán: +1 a su línea');

// 4-3-3: el interior izquierdo (m0) y el extremo de su lado (f0) son vecinos:
// nación+época = 3, arista entre líneas → mitad (1.5) a cada una.
const xi433 = {
  GK: [mkChemP('g', 'GK', 'NG', '1900')],
  DEF: ['1920', '1940', '1960', '1980'].map((era, i) => mkChemP(`d${i}`, 'DEF', `ND${i}`, era)),
  MID: [mkChemP('m0', 'MID', 'Brasil', '1970'), mkChemP('m1', 'MID', 'NM1', '1900'), mkChemP('m2', 'MID', 'NM2', '1930')],
  FWD: [mkChemP('f0', 'FWD', 'Brasil', '1970'), mkChemP('f1', 'FWD', 'NF1', '2000'), mkChemP('f2', 'FWD', 'NF2', '2030')],
};
assert.equal(computeChemistry(xi433, '4-3-3').MID, 1.5, 'interior↔extremo del mismo lado: mitad al medio');
assert.equal(computeChemistry(xi433, '4-3-3').FWD, 1.5, 'interior↔extremo del mismo lado: mitad al ataque');
// El lado contrario no enlaza: extremo derecho (slot 2) con interior izquierdo no es vecino.
const xiCruzado = { ...xi433, FWD: [xi433.FWD[1], xi433.FWD[2], xi433.FWD[0]] };
assert.equal(computeChemistry(xiCruzado, '4-3-3').FWD, 0, 'cada extremo solo con el interior de su lado');

// 4-4-2: el lateral izquierdo (d0) y el volante de banda izquierdo (m0) son vecinos.
const xi442 = {
  GK: [mkChemP('g', 'GK', 'NG', '1900')],
  DEF: [mkChemP('d0', 'DEF', 'Italia', '1990'), mkChemP('d1', 'DEF', 'ND1', '1920'), mkChemP('d2', 'DEF', 'ND2', '1940'), mkChemP('d3', 'DEF', 'ND3', '1960')],
  MID: [mkChemP('m0', 'MID', 'Italia', '1990'), mkChemP('m1', 'MID', 'NM1', '1900'), mkChemP('m2', 'MID', 'NM2', '1870'), mkChemP('m3', 'MID', 'NM3', '2030')],
  FWD: [mkChemP('f0', 'FWD', 'NF0', '1840'), mkChemP('f1', 'FWD', 'NF1', '1930')],
};
assert.equal(computeChemistry(xi442, '4-4-2').DEF, 1.5, 'lateral↔volante de banda: mitad a la defensa');
assert.equal(computeChemistry(xi442, '4-4-2').MID, 1.5, 'lateral↔volante de banda: mitad al medio');

// Dos medios de bandas opuestas (slots 0 y 3) comparten nación+época pero NO son
// vecinos: sin arista, no hay química.
const xiNoVecinos = {
  GK: [mkChemP('g', 'GK', 'NG', '1600')],
  DEF: ['1700', '1740', '1780', '1820'].map((era, i) => mkChemP(`d${i}`, 'DEF', `ND${i}`, era)),
  MID: [mkChemP('m0', 'MID', 'Japon', '1990'), mkChemP('m1', 'MID', 'NM1', '1500'), mkChemP('m2', 'MID', 'NM2', '1540'), mkChemP('m3', 'MID', 'Japon', '1990')],
  FWD: [mkChemP('f0', 'FWD', 'NF0', '1860'), mkChemP('f1', 'FWD', 'NF1', '1450')],
};
assert.equal(computeChemistry(xiNoVecinos, '4-4-2').MID, 0, 'medios de bandas opuestas no son vecinos');

// === 6b-bis. Web del 3-2-4-1 (cercanía): mide el aporte de cada par ===
// Once de control: naciones únicas y épocas espaciadas ≥30 años (sin química de
// época incidental en aristas); se hermana un par y se mide su delta por línea.
const mk3241 = (id, position, nation, era) => ({ id, name: id, position, nation, era, trait: null });
const xi3241 = () => ({
  GK: [mk3241('g', 'GK', 'NG', '1900')],
  DEF: [mk3241('d0', 'DEF', 'ND0', '1900'), mk3241('d1', 'DEF', 'ND1', '1960'), mk3241('d2', 'DEF', 'ND2', '2020')],
  // Huecos MID por orden: 0,1 = mediocentros; 2,5 = extremos; 3,4 = enganches.
  MID: [mk3241('m0', 'MID', 'NM0', '1900'), mk3241('m1', 'MID', 'NM1', '1960'),
    mk3241('e2', 'MID', 'NE2', '2020'), mk3241('e3', 'MID', 'NE3', '1930'),
    mk3241('e4', 'MID', 'NE4', '1990'), mk3241('e5', 'MID', 'NE5', '2050')],
  FWD: [mk3241('f0', 'FWD', 'NF0', '1900')],
});
const chem3241 = (a, b) => {
  const xi = xi3241();
  const find = (id) => ['GK', 'DEF', 'MID', 'FWD'].flatMap((l) => xi[l]).find((p) => p.id === id);
  find(b).nation = find(a).nation; // hermana el par a medir (+CHEM_NATION en su arista, si la hay)
  const base = computeChemistry(xi3241(), '3-2-4-1');
  const withPair = computeChemistry(xi, '3-2-4-1');
  return { MID: withPair.MID - base.MID, FWD: withPair.FWD - base.FWD };
};
// Aristas dentro del medio → suman completo (+2) a MID:
assert.deepEqual(chem3241('m0', 'm1'), { MID: 2, FWD: 0 }, 'mediocentros vecinos');
assert.deepEqual(chem3241('m0', 'e2'), { MID: 2, FWD: 0 }, 'mediocentro izq ↔ extremo izq');
assert.deepEqual(chem3241('m0', 'e3'), { MID: 2, FWD: 0 }, 'mediocentro ↔ enganche de su lado');
assert.deepEqual(chem3241('e2', 'e3'), { MID: 2, FWD: 0 }, 'extremo ↔ enganche contiguos');
assert.deepEqual(chem3241('e3', 'e4'), { MID: 2, FWD: 0 }, 'enganches contiguos');
// Arista entre líneas (enganche central ↔ 9) → mitad a cada línea:
assert.deepEqual(chem3241('e3', 'f0'), { MID: 1, FWD: 1 }, 'enganche ↔ 9: mitad al medio, mitad al ataque');
// Pares sin arista → sin química:
assert.deepEqual(chem3241('e2', 'f0'), { MID: 0, FWD: 0 }, 'extremo no enlaza directo con el 9');
assert.deepEqual(chem3241('e2', 'e5'), { MID: 0, FWD: 0 }, 'extremos opuestos no son vecinos');
assert.deepEqual(chem3241('m0', 'e5'), { MID: 0, FWD: 0 }, 'mediocentro izq no enlaza con extremo der');
assert.deepEqual(chem3241('m0', 'f0'), { MID: 0, FWD: 0 }, 'mediocentro no enlaza con el 9');

// === 6c. Sinergia de ítems: si la táctica coincide, el coste se anula ===
// Tiki-taka (posesión): +8% medio, −5% defensa. Con dibujo de posesión el
// negativo desaparece y el positivo se amplifica; con otro dibujo aplica normal.
const tikiTaka = ITEMS.find((item) => item.id === 'tiki_taka');
const effSinergia = effectiveItemEffects([tikiTaka], { formation: '4-2-3-1' }); // posesión
assert.ok(!effSinergia.some((e) => e.value < 0), 'la sinergia anula el efecto negativo');
assert.ok(near(effSinergia.find((e) => e.stat === 'midfield').value, 0.08 * CONFIG.ITEM_POWER_SCALE * CONFIG.ITEM_SYNERGY_MULT),
  'el efecto positivo sigue amplificado');
const effNeutra = effectiveItemEffects([tikiTaka], { formation: '4-3-3' }); // presión ≠ posesión
const negNeutra = effNeutra.find((e) => e.stat === 'defense');
assert.ok(negNeutra && negNeutra.value < 0, 'sin sinergia el negativo sí aplica');
assert.ok(near(effNeutra.find((e) => e.stat === 'midfield').value, 0.08 * CONFIG.ITEM_POWER_SCALE),
  'sin sinergia el positivo no se amplifica');
// El catálogo mantiene 4 cartas de trade-off (+stat/−stat) por cada sinergia.
for (const type of ['posesion', 'presion', 'contra']) {
  const tradeoffs = ITEMS.filter((item) => item.synergyType === type &&
    item.effects.some((e) => e.op === 'mult' && e.value > 1) &&
    item.effects.some((e) => e.op === 'mult' && e.value < 1));
  assert.equal(tradeoffs.length, 4, `4 cartas +/− de ${type}: ${tradeoffs.map((i) => i.id).join(', ')}`);
}

// === 6d. Rasgos condicionales ===
// Killer: solo define mejor empatado o perdiendo, nunca en ventaja.
assert.equal(duelBonus({ trait: 'Killer' }, { role: 'shooter', deficit: 0 }), 5);
assert.equal(duelBonus({ trait: 'Killer' }, { role: 'shooter', deficit: 2 }), 5);
assert.equal(duelBonus({ trait: 'Killer' }, { role: 'shooter', deficit: -1 }), 0);
// Velocista en contras; Especialista a balón parado; Garra solo al final.
assert.equal(duelBonus({ trait: 'Velocista' }, { role: 'shooter', phase: 'counter' }), 5);
assert.equal(duelBonus({ trait: 'Velocista' }, { role: 'shooter', phase: 'open_play' }), 0);
assert.equal(duelBonus({ trait: 'Especialista' }, { role: 'shooter', phase: 'corner', deficit: -1 }), 4);
assert.equal(duelBonus({ trait: 'Garra' }, { role: 'defender', minute: 80 }), 4);
assert.equal(duelBonus({ trait: 'Garra' }, { role: 'defender', minute: 60 }), 0);
assert.equal(duelBonus({ trait: 'Garra' }, { role: 'shooter', minute: 80 }), 0, 'Garra es defensivo');
// Penalero pide el penalti y lo convierte mejor; Especialista pide el balón parado.
assert.equal(phaseShooterMultiplier({ trait: 'Penalero' }, 'penalty'), 2.5);
assert.equal(phaseShooterMultiplier({ trait: 'Penalero' }, 'open_play'), 1);
assert.equal(phaseShooterMultiplier({ trait: 'Especialista' }, 'free_kick'), 1.6);
assert.equal(penaltyConvertBonus({ trait: 'Penalero' }), 0.05);
assert.equal(penaltyConvertBonus({ trait: 'Killer' }), 0);
// Mariscal ordena la zaga; Capitán suma +1 de química a su línea (respeta el cap).
assert.equal(gkDefenseLineBonus({ trait: 'Mariscal' }), 1.5);
assert.equal(gkDefenseLineBonus({ trait: 'Paradón' }), 0);
assert.equal(
  computeChemistry({ GK: [], DEF: [{ nation: 'A', era: '1900', trait: 'Capitán' }], MID: [], FWD: [] }).DEF,
  1, 'Capitán aporta +1 a su línea aunque no haya pares'
);
// Sin tope por línea: en 4-4-2 una zaga de 4 italianos de 1990 son 3 aristas
// contiguas × 3 = 9, + 1 de Capitán = 10 (suma entera del web, sin recorte).
const stackedLine = ['1990', '1990', '1990', '1990'].map((era) => ({ nation: 'Italia', era, position: 'DEF', trait: 'Capitán' }));
assert.equal(
  computeChemistry({ GK: [], DEF: stackedLine, MID: [], FWD: [] }, '4-4-2').DEF,
  10, 'la química del web suma entera, sin recorte'
);

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

// === 10. Perfiles de hueco: el mismo jugador rinde distinto según dónde juegue ===
// Jugadores sintéticos de control (sin rasgo, naciones distintas para no
// contaminar con química; la época compartida afecta igual a ambos órdenes).
const mkP = (id, position, stats) => ({
  id, name: id, nation: `N_${id}`, era: '2000', position, rarity: 'common', stats, trait: null, tacticalType: null,
});
const stopper = (id) => mkP(id, 'DEF', { passing: 45, shooting: 30, defending: 92, dribbling: 40, pace: 55, physical: 90 });
const carrilero = (id) => mkP(id, 'DEF', { passing: 82, shooting: 45, defending: 62, dribbling: 75, pace: 90, physical: 62 });
const destructor = (id) => mkP(id, 'MID', { passing: 60, shooting: 35, defending: 90, dribbling: 45, pace: 60, physical: 88 });
const creador = (id) => mkP(id, 'MID', { passing: 90, shooting: 60, defending: 45, dribbling: 86, pace: 70, physical: 55 });
const ariete = (id) => mkP(id, 'FWD', { passing: 60, shooting: 92, defending: 25, dribbling: 70, pace: 78, physical: 75 });
const extremo = (id) => mkP(id, 'FWD', { passing: 72, shooting: 65, defending: 25, dribbling: 92, pace: 92, physical: 55 });

const r433 = (starting11) => calcularRatings({ name: 'X', formation: '4-3-3', items: [], starting11 });
const onlyLine = (line, players) => ({ GK: [], DEF: [], MID: [], FWD: [], [line]: players });

// Defensa 4-3-3: stoppers de centrales y carrileros de laterales > invertido.
const backOk = r433(onlyLine('DEF', [carrilero('c1'), stopper('s1'), stopper('s2'), carrilero('c2')]));
const backSwapped = r433(onlyLine('DEF', [stopper('s1'), carrilero('c1'), carrilero('c2'), stopper('s2')]));
assert.ok(backOk.defense > backSwapped.defense,
  `centrales de corte en el eje defienden más: ${backOk.defense} > ${backSwapped.defense}`);
// La proyección de los laterales alimenta el ataque: con carrileros de lateral
// el equipo genera más que con stoppers de lateral.
assert.ok(backOk.attack > backSwapped.attack,
  `laterales con pase/pace proyectan: ${backOk.attack} > ${backSwapped.attack}`);

// Mediocampo 4-3-3: destructor de pivote (centro) y creadores de interiores.
const midOk = r433(onlyLine('MID', [creador('i1'), destructor('dm'), creador('i2')]));
const midSwapped = r433(onlyLine('MID', [destructor('dm'), creador('i1'), creador('i2')]));
assert.ok(midOk.midfield > midSwapped.midfield,
  `el pivote del 4-3-3 es el del centro: ${midOk.midfield} > ${midSwapped.midfield}`);

// Tridente 4-3-3: rematador de 9 y regateadores de extremos.
const triOk = r433(onlyLine('FWD', [extremo('w1'), ariete('cf'), extremo('w2')]));
const triSwapped = r433(onlyLine('FWD', [ariete('cf'), extremo('w1'), extremo('w2')]));
assert.ok(triOk.attack > triSwapped.attack,
  `el 9 remata y los extremos regatean: ${triOk.attack} > ${triSwapped.attack}`);

// 4-2-3-1: pivotes defensivos y, en la línea de creación, mediapunta de
// pase/remate en el centro con regateadores por fuera > invertido.
const mediapunta = mkP('mp', 'MID', { passing: 92, shooting: 80, defending: 40, dribbling: 75, pace: 65, physical: 60 });
const bandaCreador = (id) => mkP(id, 'MID', { passing: 70, shooting: 60, defending: 35, dribbling: 92, pace: 90, physical: 50 });
const r4231 = (mids) => calcularRatings({
  name: 'X', formation: '4-2-3-1', items: [],
  starting11: { GK: [], DEF: [], MID: mids, FWD: [] },
});
const engOk = r4231([destructor('p1'), destructor('p2'), bandaCreador('b1'), mediapunta, bandaCreador('b2')]);
const engSwapped = r4231([destructor('p1'), destructor('p2'), mediapunta, bandaCreador('b1'), bandaCreador('b2')]);
assert.ok(engOk.midfield > engSwapped.midfield,
  `mediapunta en el centro de la creación: ${engOk.midfield} > ${engSwapped.midfield}`);
// Y poner a un creador de pivote en vez del destructor baja el medio.
const engBadPivot = r4231([bandaCreador('b1'), destructor('p1'), destructor('p2'), mediapunta, bandaCreador('b2')]);
assert.ok(engOk.midfield > engBadPivot.midfield,
  `los pivotes del 4-2-3-1 son de corte: ${engOk.midfield} > ${engBadPivot.midfield}`);

// Los laterales entran al pool de asistentes (incidencia ofensiva real); los
// centrales no.
const fullTeam = buildBattleTeam({
  name: 'Perfilado', formation: '4-3-3', items: [],
  starting11: {
    GK: [byId('gk_yashin_1966')],
    DEF: [carrilero('c1'), stopper('s1'), stopper('s2'), carrilero('c2')],
    MID: [creador('i1'), destructor('dm'), creador('i2')],
    FWD: [extremo('w1'), ariete('cf'), extremo('w2')],
  },
});
assert.ok(fullTeam.assisters.some((a) => a.name === 'c1') && fullTeam.assisters.some((a) => a.name === 'c2'),
  'los laterales asisten');
assert.ok(!fullTeam.assisters.some((a) => a.name === 's1'), 'los centrales no asisten');
// El 9 pesa más como rematador que el extremo con menos remate.
const wShooter = (name) => fullTeam.shooters.find((sh) => sh.name === name)?.weight || 0;
assert.ok(wShooter('cf') > wShooter('w1'), `el 9 remata más: ${wShooter('cf')} > ${wShooter('w1')}`);

console.log(`Tácticas (formación, extremos, 4-2-3-1, perfiles de hueco, química, duelos, realismo): OK · reflejos=${concededReflex} < colocación=${concededPlaced} en ${N} partidos`);
