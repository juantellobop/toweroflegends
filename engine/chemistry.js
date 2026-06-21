// Torre de Leyendas — Cálculo de química / sinergias (§4.7).
// Modelo de cercanía GEOMÉTRICO: el web de cercanía (geometricLinks) se calcula
// desde los huecos OCUPADOS del grid — vecinos contiguos en la misma fila y los
// más cercanos por columna entre filas contiguas (sin clique de línea ni bandas
// opuestas). Dos titulares hacen química SOLO si hay arista entre sus huecos. Cada
// arista vale el pairChem del par —nación compartida (+CHEM_NATION) y época (década
// exacta +CHEM_ERA; contiguas la mitad)— repartido mitad a la línea de cada extremo,
// así un enlace dentro de una línea vale lo mismo que uno entre líneas.
// Además, dos bonus globales de equipo (computeTeamChem): un "núcleo nacional"
// (premia construir el XI en torno a 1-2 naciones) y una "cohesión táctica" (premia
// que tus jugadores encajen con el ESTILO elegido). Ambos modestos.

import { CONFIG, LINES, geometricLinks, isCorrupto } from '../data/config.js';

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

// Devuelve la química por línea del motor: { GK, DEF, MID, FWD }, sin tope.
// Recorre el web de cercanía geométrico (geometricLinks, calculado desde los
// huecos OCUPADOS del grid): por cada arista, suma pairChem mitad a la línea de
// cada extremo (una arista dentro de una línea suma su valor completo a esa línea;
// una entre líneas, mitad a cada una). Los huecos se leen POSICIONALMENTE
// (starting11[line][slotIndex]), igual que el web y los ratings. Un Capitán
// alineado suma +1 a la química de su línea. El director técnico (manager), si
// comparte nacionalidad, suma CHEM_MANAGER_NATION por cada titular connacional a
// la química de SU línea del motor (ENG cae en MID). `formation` se ignora.
export function computeChemistry(starting11, formation = null, manager = null) {
  const chem = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  const at = (line, slotIndex) => {
    const arr = starting11 && starting11[line];
    return arr && arr[slotIndex] ? arr[slotIndex] : null;
  };
  for (const [a, b] of geometricLinks(starting11)) {
    const pa = at(a[0], a[1]);
    const pb = at(b[0], b[1]);
    if (!pa || !pb) continue;
    // El Corrupto no enlaza con nadie: ignora cualquier arista que lo toque.
    if (isCorrupto(pa) || isCorrupto(pb)) continue;
    const half = pairChem(pa, pb) / 2;
    chem[a[0]] += half;
    chem[b[0]] += half;
  }
  const managerNation = manager && manager.nation ? chemNation(manager.nation) : null;
  for (const line of LINES) {
    // El Corrupto tampoco aporta capitanía ni conexión con el DT.
    const players = (starting11[line] || []).filter((p) => p && !isCorrupto(p));
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
export function computeTeamChem(starting11, style = null) {
  // El Corrupto queda fuera de TODA la química: ni núcleo nacional ni cohesión.
  const all = [];
  for (const line of LINES) for (const p of starting11[line] || []) if (p && !isCorrupto(p)) all.push(p);

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

  // Cohesión táctica: requiere un estilo elegido y que la mayoría de los
  // jugadores de campo tipados lo compartan.
  let tactic = 0;
  if (style) {
    const typed = all.filter((p) => p && p.position !== 'GK' && p.tacticalType);
    if (typed.length) {
      const matching = typed.filter((p) => p.tacticalType === style).length;
      if (matching / typed.length > 0.5) tactic = CONFIG.CHEM_TACTIC;
    }
  }

  return { all: core, attackMid: tactic };
}

// Química total (suma de líneas + bonus globales), útil para un indicador global.
export function totalChemistry(starting11, style = null, manager = null) {
  const chem = computeChemistry(starting11, null, manager);
  const team = computeTeamChem(starting11, style);
  return LINES.reduce((s, l) => s + chem[l], 0) + team.all + team.attackMid;
}
