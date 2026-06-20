// Torre de Leyendas — Selección/colocación de jugadores en el once.
// Ejecuta: `npm run lineup` o `node tests/lineup.mjs`.
// Cubre: intercambio titular↔titular, rechazo de huecos incompatibles y que
// nunca se expulse a un titular al arrastrar entre titulares.

import {
  placePlayerInLineup, canPlacePlayerInSlot, isLineupComplete, isStarter,
  togglePlayerInLineup,
} from '../state/run.js';

let pass = 0;
let fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log('  ✅', name); }
  else { fail++; console.log('  ❌', name); }
}

let n = 0;
function P(position, id) {
  n += 1;
  const uid = `${id || position}__${n}`;
  return { uid, id: id || uid, position, name: uid, rarity: 'common', stats: {} };
}
function emptyEleven() { return { GK: [], DEF: [], MID: [], FWD: [] }; }
function uids(line) { return line.map((p) => p.uid); }

// === A. Intercambio dentro de la misma línea (4-3-3, MID con 3 huecos) ===
{
  const m = [P('MID'), P('MID'), P('MID')];
  const state = { formation: '4-3-3', starting11: { ...emptyEleven(), MID: m.slice() }, squad: m.slice() };
  const r = placePlayerInLineup(state, m[0], 'MID', 2);
  console.log('A) Intercambio misma línea');
  check('marca swapped', r.placed && r.swapped === true);
  check('m0 pasa al hueco 2', state.starting11.MID[2].uid === m[0].uid);
  check('m2 pasa al hueco 0', state.starting11.MID[0].uid === m[2].uid);
  check('ambos siguen titulares', isStarter(state, m[0]) && isStarter(state, m[2]));
  check('hueco intermedio intacto', state.starting11.MID[1].uid === m[1].uid);
}

// === B. Reglas de acceso por posición del grid ===
// DEF: a los 5 DEF y a los 2 MED LATERALES (slots MID 0 y 4), no a los centrales.
// MID: a MED y a ENG, NUNCA al ataque (DEL). FWD: a DEL y a ENG.
{
  const d = P('DEF');
  const m = P('MID');
  const state = { formation: '4-3-3', starting11: { ...emptyEleven(), DEF: [d], MID: [null, null, m] }, squad: [d, m] };
  console.log('B) Reglas de acceso por posición');
  check('canPlace(DEF→MED central #2) es false', canPlacePlayerInSlot(state, d, 'MID', 2) === false);
  check('canPlace(DEF→MED lateral #0) es true', canPlacePlayerInSlot(state, d, 'MID', 0) === true);
  check('canPlace(MID→DEL) es false', canPlacePlayerInSlot(state, m, 'FWD', 2) === false);
  check('canPlace(MID→ENG #7) es true', canPlacePlayerInSlot(state, m, 'MID', 7) === true);
  const r = placePlayerInLineup(state, m, 'FWD', 2);
  check('placePlayer(MID→DEL) lo rechaza', r.placed === false);
}

// === C. Titular sobre titular sin swap posible → se rechaza (no expulsa) ===
// 4-3-1-2: el hueco 3 de MID (ENG) admite FWD; los huecos 0-2 solo MID.
{
  const m = [P('MID'), P('MID'), P('MID')];
  const eng = P('FWD', 'fwd_eng');
  const state = {
    formation: '4-3-1-2',
    starting11: { ...emptyEleven(), MID: [...m, eng], FWD: [P('FWD'), P('FWD')] },
    squad: [],
  };
  console.log('C) Titular sin swap válido');
  const before = uids(state.starting11.MID);
  // El FWD del hueco ENG intenta ir al hueco 0 (solo admite MID).
  check('canPlace(ENG-FWD→MID#0) es false', canPlacePlayerInSlot(state, eng, 'MID', 0) === false);
  const r = placePlayerInLineup(state, eng, 'MID', 0);
  check('se rechaza', r.placed === false);
  check('la línea MID queda intacta (nadie al banco)', JSON.stringify(uids(state.starting11.MID)) === JSON.stringify(before));
}

// === D. Sustitución desde el banco sí reemplaza al titular ===
{
  const m = [P('MID'), P('MID'), P('MID')];
  const sub = P('MID');
  const state = { formation: '4-3-3', starting11: { ...emptyEleven(), MID: m.slice() }, squad: [...m, sub] };
  console.log('D) Sustitución desde el banco');
  check('canPlace(suplente→hueco lleno) es true', canPlacePlayerInSlot(state, sub, 'MID', 0) === true);
  const r = placePlayerInLineup(state, sub, 'MID', 0);
  check('marca replaced', r.placed && r.replaced === true);
  check('el suplente entra en el hueco 0', state.starting11.MID[0].uid === sub.uid);
  check('el titular saliente deja de ser titular', !isStarter(state, m[0]));
}

// === E. El intercambio conserva la integridad del once ===
{
  const eleven = {
    GK: [P('GK')],
    DEF: [P('DEF'), P('DEF'), P('DEF'), P('DEF')],
    MID: [P('MID'), P('MID'), P('MID')],
    FWD: [P('FWD'), P('FWD'), P('FWD')],
  };
  const state = { formation: '4-3-3', starting11: eleven, squad: [] };
  console.log('E) Integridad tras swap');
  check('once completo antes', isLineupComplete(state));
  placePlayerInLineup(state, eleven.FWD[0], 'FWD', 2);
  check('once completo después', isLineupComplete(state));
}

// === F. Quitar a un jugador deja su hueco EN SU SITIO (no recoloca la línea) ===
// Bug reportado: al quitar un central se vaciaba el lateral derecho. El array de
// la línea es posicional (índice = hueco); quitar = null en su hueco.
{
  const d = [P('DEF'), P('DEF'), P('DEF'), P('DEF')];
  const state = { formation: '4-3-3', starting11: { ...emptyEleven(), DEF: d.slice() }, squad: d.slice() };
  console.log('F) Quitar deja el hueco en su sitio');
  togglePlayerInLineup(state, d[1]); // quita el central del hueco 1
  check('el hueco 1 queda vacío (null)', state.starting11.DEF[1] === null);
  check('la línea conserva sus 4 huecos', state.starting11.DEF.length === 4);
  check('el lateral derecho (hueco 3) NO se mueve', state.starting11.DEF[3]?.uid === d[3].uid);
  check('el resto sigue en su sitio', state.starting11.DEF[0]?.uid === d[0].uid && state.starting11.DEF[2]?.uid === d[2].uid);
  // Volver a meter un suplente DEF entra precisamente en ese hueco libre.
  const sub = P('DEF');
  state.squad.push(sub);
  togglePlayerInLineup(state, sub);
  check('el suplente entra en el hueco 1 que quedó libre', state.starting11.DEF[1]?.uid === sub.uid);
}

console.log(`\n=== Selección de jugadores: ${pass} OK / ${fail} fallos ===`);
process.exit(fail ? 1 : 0);
