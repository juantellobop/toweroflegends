// Torre de Leyendas — Cálculo de química / sinergias (§4.7).
// Por cada par de titulares en la misma línea que comparten nación → +CHEM_NATION.
// Por cada par que comparte época (década exacta) → +CHEM_ERA; décadas contiguas
// → +CHEM_ERA_ADJACENT. Tope CHEM_CAP por línea.
// Algunas formaciones añaden pares entre líneas (CHEM_FORMATION_LINKS): p. ej.
// en 4-3-3 cada extremo juega química con el interior de su lado. Cada par
// extra reparte su valor mitad a cada una de las dos líneas implicadas.
// Además, dos bonus globales de equipo (computeTeamChem): un "núcleo nacional"
// (premia construir el XI en torno a 1-2 naciones) y una "cohesión táctica" (premia
// que tus jugadores encajen con el tipo del dibujo). Ambos modestos.

import { CONFIG, LINES, chemFormationLinks, formationLineSlots, formationType } from '../data/config.js';

// Naciones históricas que cuentan como la misma selección a efectos de química
// (y de enlaces en el campo): Alemania Occidental ≡ Alemania.
const NATION_ALIASES = { 'Alemania Occidental': 'Alemania' };
export function chemNation(nation) {
  return NATION_ALIASES[nation] || nation;
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

// Suma la química de todos los pares del grupo. `skip` excluye los pares cuyos
// dos miembros pertenezcan a ese conjunto (p. ej. enganche-enganche, que ya
// puntuó en el mediocampo y no debe repetir en la delantera).
function groupChem(players, skip = null) {
  let total = 0;
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      if (skip && skip.has(players[i]) && skip.has(players[j])) continue;
      total += pairChem(players[i], players[j]);
    }
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

// Jugadores del once que ocupan huecos de enganche (rol ENG) según el dibujo.
function engancheSet(starting11, formation) {
  const set = new Set();
  if (!formation) return set;
  for (const line of LINES) {
    const slots = formationLineSlots(formation, line);
    if (!slots.some((slot) => slot.role === 'ENG')) continue;
    const occupants = lineSlotOccupants(starting11, formation, line);
    for (const slot of slots) {
      const player = occupants.get(slot.slotIndex);
      if (slot.role === 'ENG' && player) set.add(player);
    }
  }
  return set;
}

// Química de los pares entre líneas que define la formación (extremo↔interior
// en 4-3-3, lateral↔volante en 4-4-2, etc.). Cada par reparte su valor mitad a
// cada línea implicada, así un par cruzado vale lo mismo que uno de línea.
function formationLinkChem(starting11, formation) {
  const extra = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  if (!formation) return extra;
  const links = chemFormationLinks(formation);
  if (!links.length) return extra;
  const occupants = {};
  for (const line of LINES) occupants[line] = lineSlotOccupants(starting11, formation, line);
  for (const { a, b } of links) {
    const pa = occupants[a[0]].get(a[1]);
    const pb = occupants[b[0]].get(b[1]);
    if (!pa || !pb) continue;
    const half = pairChem(pa, pb) / 2;
    extra[a[0]] += half;
    extra[b[0]] += half;
  }
  return extra;
}

// Devuelve la química por línea: { GK, DEF, MID, FWD } (cada una topada a CHEM_CAP).
// El portero hace química con la defensa (suma en DEF) y los enganches juegan
// química con el mediocampo Y con la delantera (sus pares entre sí puntúan una
// sola vez, en MID). Los pares entre líneas de la formación (CHEM_FORMATION_LINKS)
// suman mitad a cada línea. Un Capitán alineado suma +1 a la química de su línea.
export function computeChemistry(starting11, formation = null) {
  const linePlayers = (line) => (starting11[line] || []).filter(Boolean);
  const captain = (players) => (players.some((p) => p.trait === 'Capitán') ? 1 : 0);
  const cap = (value) => Math.min(CONFIG.CHEM_CAP, value);
  const gk = linePlayers('GK');
  const def = linePlayers('DEF');
  const mid = linePlayers('MID');
  const fwd = linePlayers('FWD');
  const enganches = engancheSet(starting11, formation);
  const eng = mid.filter((p) => enganches.has(p));
  const links = formationLinkChem(starting11, formation);
  return {
    GK: cap(captain(gk) + links.GK),
    DEF: cap(groupChem([...gk, ...def]) + captain(def) + links.DEF),
    MID: cap(groupChem(mid) + captain(mid) + links.MID),
    FWD: cap(groupChem([...fwd, ...eng], enganches) + captain(fwd) + links.FWD),
  };
}

// Bonus globales de equipo (no por línea):
//  - all: "núcleo nacional" — si el XI se construye en torno a una nación, sube
//    todos los ratings (escalones: 5 connacionales → +1, 7 → +2, 9+ → +3).
//  - attackMid: "cohesión táctica" — si la mayoría de tus jugadores de campo con
//    tacticalType definido coincide con el tipo del dibujo, sube ataque y medio.
export function computeTeamChem(starting11, formation) {
  const all = [];
  for (const line of LINES) for (const p of starting11[line] || []) all.push(p);

  // Núcleo nacional: tamaño del grupo de nación más numeroso del XI.
  const byNation = {};
  for (const p of all) {
    if (!p || !p.nation) continue;
    const nation = chemNation(p.nation);
    byNation[nation] = (byNation[nation] || 0) + 1;
  }
  const coreSize = Math.max(0, ...Object.values(byNation));
  const core = Math.min(CONFIG.CHEM_CORE_CAP, Math.max(0, Math.floor((coreSize - 3) / 2)) * CONFIG.CHEM_CORE);

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
export function totalChemistry(starting11, formation) {
  const chem = computeChemistry(starting11, formation);
  const team = computeTeamChem(starting11, formation);
  return LINES.reduce((s, l) => s + chem[l], 0) + team.all + team.attackMid;
}
