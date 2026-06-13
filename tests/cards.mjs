// Torre de Leyendas — Mecánica de tarjetas (amarillas y rojas).
// Ejecuta: `npm run cards` o `node tests/cards.mjs`.
// Cubre: resolución de tarjetas (amarilla, doble amarilla → roja, roja directa),
// sustitución tras expulsar a un DEF/ARQ, sanción de un partido y derrota por
// cuatro rojas. La calibración de la distribución vive en .cache/cards-probe.mjs.

import assert from 'node:assert';
import { CONFIG } from '../data/config.js';
import { RNG } from '../engine/rng.js';
import { createCardTracker, resolveFoul } from '../engine/cards.js';
import { simularPartido, expelFromLineup } from '../engine/simulate.js';
import { applyResult, isSuspended, autoFillStarting11 } from '../state/run.js';

let n = 0;
const mk = (pos, name, uid, ovr = 80) => ({
  uid, id: uid, name, position: pos, rarity: 'common', ovr,
  stats: pos === 'GK' ? null : { passing: ovr, shooting: ovr, defending: ovr, dribbling: ovr, pace: ovr, physical: ovr },
  gk: pos === 'GK' ? { reflexes: ovr, handling: ovr, positioning: ovr } : null,
});
const baseLineup = () => ({
  GK: [mk('GK', 'K', 'k1')],
  DEF: [mk('DEF', 'D1', 'd1'), mk('DEF', 'D2', 'd2'), mk('DEF', 'D3', 'd3'), mk('DEF', 'D4', 'd4')],
  MID: [mk('MID', 'M1', 'm1', 70), mk('MID', 'M2', 'm2', 82), mk('MID', 'M3', 'm3', 84)],
  FWD: [mk('FWD', 'F1', 'f1', 86), mk('FWD', 'F2', 'f2', 88), mk('FWD', 'F3', 'f3', 90)],
});

// === 1. Resolución de tarjetas: doble amarilla → roja ===
{
  const tracker = createCardTracker();
  const offender = { name: 'X', uid: 'x1', position: 'DEF' };
  // Con YELLOW_PROB alto y sin roja directa, dos faltas del mismo jugador dan
  // amarilla y luego segunda amarilla (roja). Forzamos el RNG.
  const savedDR = CONFIG.DIRECT_RED_PROB;
  const savedY = CONFIG.YELLOW_PROB;
  CONFIG.DIRECT_RED_PROB = 0; // nunca roja directa
  CONFIG.YELLOW_PROB = 1; // siempre amarilla
  // RNG determinista: bernoulli(p) acierta para todo p>0 (roja directa p=0 falla,
  // amarilla p>0 acierta), aislando la lógica de la doble amarilla del azar.
  const rng = { bernoulli: (p) => p > 0 };
  const first = resolveFoul({ side: 'A', offender, phase: 'open_play', rng, tracker });
  const second = resolveFoul({ side: 'A', offender, phase: 'open_play', rng, tracker });
  assert.equal(first.card, 'yellow', 'primera falta = amarilla');
  assert.equal(second.card, 'red', 'segunda falta del mismo jugador = roja');
  assert.equal(second.secondYellow, true, 'la roja es por doble amarilla');
  // Ya expulsado: una tercera falta no da tarjeta.
  const third = resolveFoul({ side: 'A', offender, phase: 'open_play', rng, tracker });
  assert.equal(third.card, 'none', 'expulsado no recibe más tarjetas');
  CONFIG.DIRECT_RED_PROB = savedDR;
  CONFIG.YELLOW_PROB = savedY;
  n++; console.log('  ✅ 1. doble amarilla se convierte en roja');
}

// === 2. Sustitución al expulsar a un defensor ===
{
  const team = {
    starting11: baseLineup(),
    bench: [mk('DEF', 'SubD', 'sd1', 79), mk('GK', 'SubK', 'sk1', 77), mk('FWD', 'SubF', 'sf1', 75)],
  };
  expelFromLineup(team, { name: 'D2', uid: 'd2', position: 'DEF' });
  const def = team.starting11.DEF.map((p) => p.uid);
  const field = [...team.starting11.MID, ...team.starting11.FWD];
  assert.ok(!def.includes('d2'), 'el central expulsado sale de la zaga');
  assert.ok(def.includes('sd1'), 'entra el mejor DEF del banquillo en la zaga');
  assert.equal(team.starting11.DEF.length, 4, 'la zaga se mantiene completa');
  // Para quedar con diez, sale el MID/DEL más flojo del campo (m1, OVR 70).
  assert.ok(!field.some((p) => p.uid === 'm1'), 'sale el MID/DEL más flojo del campo');
  assert.equal(field.length, 5, 'quedan diez jugadores (4 zaga + portero + 5 medio/ataque)');
  n++; console.log('  ✅ 2. expulsar un DEF mete un DEF del banco y saca el atacante más flojo');
}

// === 2b. Expulsar a un mediocampista deja el hueco sin sustitución ===
{
  const team = {
    starting11: baseLineup(),
    bench: [mk('DEF', 'SubD', 'sd1', 79)],
  };
  expelFromLineup(team, { name: 'M2', uid: 'm2', position: 'MID' });
  assert.ok(!team.starting11.MID.some((p) => p.uid === 'm2'), 'el medio sale');
  assert.equal(team.starting11.MID.length, 2, 'el hueco queda vacío (sin cambio)');
  assert.ok(!team.starting11.DEF.some((p) => p.uid === 'sd1'), 'no entra nadie del banco');
  n++; console.log('  ✅ 2b. expulsar un MID/DEL deja el hueco sin sustitución');
}

// === 3. Sanción: el expulsado se pierde el siguiente partido ===
{
  const lineup = baseLineup();
  const squad = [
    ...lineup.GK, ...lineup.DEF, ...lineup.MID, ...lineup.FWD,
    mk('DEF', 'SubD', 'sd1', 79),
  ];
  const state = {
    formation: '4-3-3', level: 3, lives: 1, items: [], history: [],
    opponent: { name: 'Rival', year: 1998 }, squad, starting11: lineup,
    lastMatch: { golesA: 2, golesB: 0, eventos: [], forfeit: null, expulsadosA: [{ uid: 'd2', name: 'D2', position: 'DEF', minute: 40 }] },
  };
  applyResult(state);
  const d2 = squad.find((p) => p.uid === 'd2');
  assert.equal(d2.banMatches, 1, 'el expulsado queda sancionado un partido');
  assert.ok(isSuspended(d2), 'isSuspended detecta la sanción');
  assert.ok(!state.starting11.DEF.some((p) => p && p.uid === 'd2'), 'el sancionado sale del once (al banquillo)');
  assert.equal(state.starting11.DEF.length, 4, 'el hueco del sancionado se queda en su sitio (no recoloca la línea)');
  // El autocompletar no lo vuelve a alinear.
  autoFillStarting11(state);
  const lined = ['GK', 'DEF', 'MID', 'FWD'].some((L) => state.starting11[L].some((p) => p && p.uid === 'd2'));
  assert.ok(!lined, 'autoFill no alinea a un sancionado');

  // Tras jugar el siguiente partido (sin nuevas rojas), cumple la sanción.
  state.lastMatch = { golesA: 1, golesB: 1, eventos: [], forfeit: null, expulsadosA: [] };
  applyResult(state);
  assert.equal(d2.banMatches, 0, 'tras un partido la sanción se cumple');
  assert.ok(!isSuspended(d2), 'vuelve a estar disponible');
  n++; console.log('  ✅ 3. la sanción dura exactamente un partido');
}

// === 4. Cuatro rojas = derrota, aunque el marcador sea favorable ===
{
  const state = {
    formation: '4-3-3', level: 5, lives: 1, items: [], history: [],
    opponent: { name: 'Rival', year: 1998 }, squad: [], starting11: baseLineup(),
    lastMatch: { golesA: 3, golesB: 0, eventos: [], forfeit: 'A', expulsadosA: [] },
  };
  const out = applyResult(state);
  assert.equal(state.history[0].result, 'loss', 'cuatro rojas = derrota pese al 3-0');
  assert.equal(out.gameOver, true, 'con una vida, la derrota por incomparecencia termina la run');
  n++; console.log('  ✅ 4. cuatro rojas pierden el partido pese al marcador');
}

// === 5. El motor expone rojas, expulsados y forfeit ===
{
  const teamA = {
    name: 'A', color: '#fff', formation: '4-3-3', items: [],
    starting11: baseLineup(),
    bench: [mk('DEF', 'SubD', 'sd1', 79), mk('GK', 'SubK', 'sk1', 77)],
  };
  const teamB = { name: 'B', formation: '4-3-3', ratings: { attack: 80, midfield: 80, defense: 80, gk: 80 } };
  const saved = CONFIG.DIRECT_RED_PROB;
  CONFIG.DIRECT_RED_PROB = 1; // cada falta es roja: garantiza expulsiones
  const r = simularPartido(JSON.parse(JSON.stringify(teamA)), teamB, new RNG(3));
  CONFIG.DIRECT_RED_PROB = saved;
  assert.ok(r.redsA >= 1, 'se registran rojas del equipo del jugador');
  assert.equal(r.redsA, r.expulsadosA.length, 'cada roja de A produce un expulsado registrado');
  for (const e of r.expulsadosA) assert.ok(e.uid && e.position, 'el expulsado trae identidad real');
  if (r.redsA >= 4) assert.equal(r.forfeit, 'A', 'cuatro rojas marcan forfeit');
  n++; console.log('  ✅ 5. el resultado expone redsA / expulsadosA / forfeit');
}

console.log(`Tarjetas (amarillas, rojas, sustitución, sanción, forfeit): OK · ${n} bloques`);
