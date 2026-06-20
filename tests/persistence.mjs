// Torre de Leyendas — Guardado y reanudación de la run.
// Ejecuta: `npm run persistence` o `node tests/persistence.mjs`.
// Verifica: (a) ida y vuelta fiel del estado, (b) once reenlazado por referencia,
// (c) determinismo del RNG tras rehidratar, (d) saves inválidos → null.

import {
  createRun, serializeRun, rehydrateRun, rollPlayerPack, SAVE_VERSION,
  prepareOpponent, playMatch, applyResult,
} from '../state/run.js';
import { LINES } from '../data/config.js';

let failures = 0;
function check(name, cond) {
  if (cond) {
    console.log(`  ok  ${name}`);
  } else {
    failures += 1;
    console.error(`FAIL  ${name}`);
  }
}

// Estado de partida: una run recién creada (squadIntro, once autocompletado).
const run = createRun({ teamName: 'Test', teamNation: 'Brasil', seed: 12345 });
// Avanzamos un poco el RNG y la fase para que el save no sea trivial.
run.rng.next();
run.rng.next();
run.level = 3;
run.phase = 'playerPack';

// --- (a) Ida y vuelta fiel: serialize → JSON → rehydrate → serialize idéntico.
const snapshot = JSON.parse(JSON.stringify(serializeRun(run)));
const restored = rehydrateRun(snapshot);
check('rehydrateRun devuelve un estado', Boolean(restored));
check(
  'serialize(rehydrate(x)) === x',
  JSON.stringify(serializeRun(restored)) === JSON.stringify(snapshot),
);
check('runId conservado', restored.runId === run.runId);
check('rngState conservado', restored.rng.state === run.rng.state);

// --- (b) Once reenlazado: cada titular es la MISMA instancia de la plantilla.
let starters = 0;
let linked = true;
for (const line of LINES) {
  for (const card of restored.starting11[line]) {
    if (!card) continue; // el grid guarda null en los huecos vacíos
    starters += 1;
    if (!restored.squad.includes(card)) linked = false;
  }
}
check('hay titulares en el once', starters > 0);
check('starting11 apunta a instancias de squad (por referencia)', linked);

// --- (c) Determinismo: el mismo sorteo desde el estado guardado y desde el
// rehidratado produce idénticas cartas (mismo RNG + mismo estado restaurados).
const original = createRun({ teamName: 'Test', teamNation: 'Brasil', seed: 777 });
original.phase = 'playerPack';
const snap2 = JSON.parse(JSON.stringify(serializeRun(original)));
const reloaded = rehydrateRun(snap2);
const idsA = rollPlayerPack(original).map((c) => c.id);
const idsB = rollPlayerPack(reloaded).map((c) => c.id);
check('rollPlayerPack determinista tras rehidratar', JSON.stringify(idsA) === JSON.stringify(idsB));

// --- (c2) Rival y partido se persisten: retomar en resultado/gaceta exige que
// lastMatch + opponent sobrevivan (las pantallas los leen, no los recalculan).
const played = createRun({ teamName: 'Test', teamNation: 'Brasil', seed: 9090 });
played.level = 2; // a partir del nivel 2 se puede perder; el partido es real igual
prepareOpponent(played);
playMatch(played);
played.phase = 'result';
const snapMatch = JSON.parse(JSON.stringify(serializeRun(played)));
const restoredMatch = rehydrateRun(snapMatch);
check('opponent persiste y rehidrata', JSON.stringify(restoredMatch.opponent) === JSON.stringify(played.opponent));
check('lastMatch persiste con eventos', Array.isArray(restoredMatch.lastMatch?.eventos) && restoredMatch.lastMatch.eventos.length > 0);
check('marcador del partido conservado',
  restoredMatch.lastMatch.golesA === played.lastMatch.golesA
  && restoredMatch.lastMatch.golesB === played.lastMatch.golesB);
// applyResult debe funcionar sobre el estado rehidratado (gaceta/resultado).
const reward = applyResult(restoredMatch);
check('applyResult tras rehidratar no lanza y da recompensa', Boolean(reward) && typeof reward.result === 'string');

// --- (d) Saves inválidos → null sin lanzar.
check('versión incompatible → null', rehydrateRun({ ...snapshot, version: SAVE_VERSION + 99 }) === null);
check('objeto vacío → null', rehydrateRun({}) === null);
check('null → null', rehydrateRun(null) === null);
check('squad no-array → null', rehydrateRun({ ...snapshot, squad: 'roto' }) === null);

// --- (e) Cerrojo de sesión: sin Web Locks (node) degrada a "no bloquea" y
// release es idempotente.
const { acquireRunLock, releaseRunLock } = await import('../state/sesion.js');
check('acquireRunLock sin Web Locks → true', (await acquireRunLock()) === true);
releaseRunLock();
releaseRunLock(); // idempotente, no debe lanzar
check('releaseRunLock idempotente', true);

if (failures) {
  console.error(`\n${failures} comprobación(es) fallida(s).`);
  process.exit(1);
}
console.log('\nPersistencia: OK');
