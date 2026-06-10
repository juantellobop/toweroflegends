// Torre de Leyendas — Cálculo de química / sinergias (§4.7).
// Por cada par de titulares en la misma línea que comparten nación → +CHEM_NATION.
// Por cada par que comparte época (década exacta) → +CHEM_ERA; décadas contiguas
// → +CHEM_ERA_ADJACENT. Tope CHEM_CAP por línea.
// Además, dos bonus globales de equipo (computeTeamChem): un "núcleo nacional"
// (premia construir el XI en torno a 1-2 naciones) y una "cohesión táctica" (premia
// que tus jugadores encajen con el tipo del dibujo). Ambos modestos.

import { CONFIG, LINES, formationType } from '../data/config.js';

// Cuenta pares que comparten una clave dentro de un grupo de jugadores.
function pairsSharing(players, key) {
  const counts = {};
  for (const p of players) {
    const v = p[key];
    counts[v] = (counts[v] || 0) + 1;
  }
  let pairs = 0;
  for (const v in counts) {
    const n = counts[v];
    pairs += (n * (n - 1)) / 2; // combinaciones C(n,2)
  }
  return pairs;
}

// Química de época: década exacta vale CHEM_ERA; décadas contiguas (1960↔1970),
// la mitad. Así las generaciones coherentes puntúan sin ser binarias.
function eraChemistry(players) {
  let total = 0;
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const a = parseInt(players[i].era, 10);
      const b = parseInt(players[j].era, 10);
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      const diff = Math.abs(a - b);
      if (diff === 0) total += CONFIG.CHEM_ERA;
      else if (diff === 10) total += CONFIG.CHEM_ERA_ADJACENT;
    }
  }
  return total;
}

// Devuelve la química por línea: { GK, DEF, MID, FWD } (cada una topada a CHEM_CAP).
// Un Capitán alineado suma +1 a la química de su línea (un solo bonus por línea).
export function computeChemistry(starting11) {
  const chem = {};
  for (const line of LINES) {
    const players = starting11[line] || [];
    const nation = pairsSharing(players, 'nation') * CONFIG.CHEM_NATION;
    const era = eraChemistry(players);
    const captain = players.some((p) => p && p.trait === 'Capitán') ? 1 : 0;
    chem[line] = Math.min(CONFIG.CHEM_CAP, nation + era + captain);
  }
  return chem;
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
  for (const p of all) if (p && p.nation) byNation[p.nation] = (byNation[p.nation] || 0) + 1;
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
  const chem = computeChemistry(starting11);
  const team = computeTeamChem(starting11, formation);
  return LINES.reduce((s, l) => s + chem[l], 0) + team.all + team.attackMid;
}
