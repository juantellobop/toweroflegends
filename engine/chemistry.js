// Torre de Leyendas — Cálculo de química / sinergias (§4.7).
// Modelo de cercanía: cada formación define un web de cercanía (CHEM_LINKS),
// un grafo de aristas entre huecos vecinos. Dos titulares hacen química SOLO si
// hay arista entre sus huecos (no hay clique de línea). Cada arista vale el
// pairChem del par —nación compartida (+CHEM_NATION) y época (década exacta
// +CHEM_ERA; contiguas la mitad)— repartido mitad a la línea de cada extremo,
// así un enlace dentro de una línea vale lo mismo que uno entre líneas.
// Además, dos bonus globales de equipo (computeTeamChem): un "núcleo nacional"
// (premia construir el XI en torno a 1-2 naciones) y una "cohesión táctica" (premia
// que tus jugadores encajen con el tipo del dibujo). Ambos modestos.

import { CONFIG, LINES, chemLinks, formationLineSlots, formationType } from '../data/config.js';

// Naciones históricas que cuentan como la misma selección a efectos de química
// (y de enlaces en el campo): Alemania Occidental ≡ Alemania.
const NATION_ALIASES = { 'Alemania Occidental': 'Alemania' };
export function chemNation(nation) {
  return NATION_ALIASES[nation] || nation;
}

// Bonus a todas las stats que aporta el DT a sus connacionales (0 si no comparten
// nacionalidad o no hay DT). Lo consumen los ratings, el OVR y la carta.
export function managerNationStatBonus(player, manager) {
  if (!player || !player.nation || !manager || !manager.nation) return 0;
  return chemNation(player.nation) === chemNation(manager.nation) ? CONFIG.MANAGER_NATION_STAT_BONUS : 0;
}

// Química de un par de jugadores: nación compartida (+CHEM_NATION) y época
// (década exacta vale CHEM_ERA; contiguas, 1960↔1970, la mitad).
function pairChem(a, b) {
  let total = 0;
  if (a.nation && chemNation(a.nation) === chemNation(b.nation)) total += CONFIG.CHEM_NATION;
  const ea = parseInt(a.era, 10);
  const eb = parseInt(b.era, 10);
  if (Number.isFinite(ea) && Number.isFinite(eb)) {
    const diff = Math.abs(ea - eb);
    if (diff === 0) total += CONFIG.CHEM_ERA;
    else if (diff === 10) total += CONFIG.CHEM_ERA_ADJACENT;
  }
  return total;
}

// Asignación hueco→jugador de una línea, replicando teamRatings/run.js: cada
// hueco toma el primer jugador compatible que quede. Devuelve slotIndex→player.
function lineSlotOccupants(starting11, formation, line) {
  const occupants = new Map();
  const remaining = (starting11[line] || []).filter(Boolean).slice();
  for (const slot of formationLineSlots(formation, line)) {
    const idx = remaining.findIndex((p) => slot.accepts.includes(p.position));
    if (idx < 0) continue;
    occupants.set(slot.slotIndex, remaining.splice(idx, 1)[0]);
  }
  return occupants;
}

// Devuelve la química por línea: { GK, DEF, MID, FWD }, sin tope. Recorre el web
// de cercanía de la formación (CHEM_LINKS): por cada arista cuyos dos huecos están
// ocupados, suma pairChem mitad a la línea de cada extremo (una arista dentro de
// una línea suma su valor completo a esa línea; una entre líneas, mitad a cada una).
// Un Capitán alineado suma +1 a la química de su línea. El director técnico
// (manager), si comparte nacionalidad, suma CHEM_MANAGER_NATION por cada titular
// connacional a la química de SU línea (modelo "por jugador, a su línea").
export function computeChemistry(starting11, formation = null, manager = null) {
  const chem = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  if (formation) {
    const occupants = {};
    for (const line of LINES) occupants[line] = lineSlotOccupants(starting11, formation, line);
    for (const [a, b] of chemLinks(formation)) {
      const pa = occupants[a[0]].get(a[1]);
      const pb = occupants[b[0]].get(b[1]);
      if (!pa || !pb) continue;
      const half = pairChem(pa, pb) / 2;
      chem[a[0]] += half;
      chem[b[0]] += half;
    }
  }
  const managerNation = manager && manager.nation ? chemNation(manager.nation) : null;
  for (const line of LINES) {
    const players = (starting11[line] || []).filter(Boolean);
    if (players.some((p) => p.trait === 'Capitán')) chem[line] += 1;
    if (managerNation) {
      const connationals = players.filter((p) => p.nation && chemNation(p.nation) === managerNation).length;
      chem[line] += connationals * CONFIG.CHEM_MANAGER_NATION;
    }
  }
  return chem;
}

// Bonus globales de equipo (no por línea):
//  - all: "núcleo nacional" — cada nación con grupo suficiente en el XI sube todos
//    los ratings (escalón por país, sumado: 5-6 → +1, 7-8 → +2, 9-10 → +3, 11 → +4).
//    Cuenta por nación, así que un XI repartido puede tener doble núcleo (5+5 → +2).
//  - attackMid: "cohesión táctica" — si la mayoría de tus jugadores de campo con
//    tacticalType definido coincide con el tipo del dibujo, sube ataque y medio.
export function computeTeamChem(starting11, formation) {
  const all = [];
  for (const line of LINES) for (const p of starting11[line] || []) all.push(p);

  // Núcleo nacional: cuenta los jugadores de cada nación del XI.
  const byNation = {};
  for (const p of all) {
    if (!p || !p.nation) continue;
    const nation = chemNation(p.nation);
    byNation[nation] = (byNation[nation] || 0) + 1;
  }
  // Cada nación aporta su escalón floor((tamaño-3)/2) y se suman: grupos <5 dan 0,
  // mono-nacional queda igual (11 → +4) y 5+5 de dos países habilita el doble núcleo.
  let core = 0;
  for (const size of Object.values(byNation)) {
    core += Math.max(0, Math.floor((size - 3) / 2)) * CONFIG.CHEM_CORE;
  }

  // Cohesión táctica: requiere que el dibujo tenga tipo y que la mayoría de los
  // jugadores de campo tipados lo compartan.
  let tactic = 0;
  const type = formationType(formation);
  if (type) {
    const typed = all.filter((p) => p && p.position !== 'GK' && p.tacticalType);
    if (typed.length) {
      const matching = typed.filter((p) => p.tacticalType === type).length;
      if (matching / typed.length > 0.5) tactic = CONFIG.CHEM_TACTIC;
    }
  }

  return { all: core, attackMid: tactic };
}

// Química total (suma de líneas + bonus globales), útil para un indicador global.
export function totalChemistry(starting11, formation, manager = null) {
  const chem = computeChemistry(starting11, formation, manager);
  const team = computeTeamChem(starting11, formation);
  return LINES.reduce((s, l) => s + chem[l], 0) + team.all + team.attackMid;
}
