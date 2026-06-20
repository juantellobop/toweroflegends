// Torre de Leyendas — De atributos de jugador a ratings de equipo (§6.1).
// Orden de aplicación: base → química → objetos (add, luego mult).
// También construye el "battle team" que necesita la simulación: ratings +
// listas de rematadores/asistentes para resolver las jugadas.

import { computeChemistry, computeTeamChem, managerNationStatBonus } from './chemistry.js';
import { applyItemsToRatings, chemTeamBonus, matchBonuses } from './items.js';
import { applyTraitToStats, gkDefenseLineBonus, gkTraitBonus, shooterWeightMultiplier } from './traits.js';
import { CONFIG, LINES, formationLineSlots, formationType } from '../data/config.js';
import { t } from '../data/i18n.js';

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// Stats efectivas para los ratings: rasgo + bonus del DT connacional (+N a todas
// las stats, sin tope). Sin bonus devuelve la referencia de siempre (los
// llamadores no la mutan); con bonus, una copia con cada stat aumentada.
function effectiveStats(player, manager) {
  const s = applyTraitToStats(player);
  const bonus = manager ? managerNationStatBonus(player, manager) : 0;
  if (!s || !bonus) return s;
  const out = { ...s };
  for (const k in out) out[k] += bonus;
  return out;
}

// Atributos de portero con el bonus del DT connacional aplicado (o los originales).
function effectiveGk(player, manager) {
  const gk = player && player.gk;
  if (!gk) return null;
  const bonus = manager ? managerNationStatBonus(player, manager) : 0;
  if (!bonus) return gk;
  return { reflexes: gk.reflexes + bonus, handling: gk.handling + bonus, positioning: gk.positioning + bonus };
}

function weightedAvg(items) {
  const usable = items.filter((item) => item && item.weight > 0);
  const totalWeight = usable.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;
  return usable.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight;
}

// Rating de portero: media de sus tres atributos (con bonus del DT connacional
// si lo hay) + bonus de rasgo.
function gkRatingOf(gkPlayers, manager) {
  const gk = gkPlayers && gkPlayers[0];
  if (!gk || !gk.gk) return 45; // sin portero, valor pobre
  const g = effectiveGk(gk, manager);
  const base = (g.reflexes + g.handling + g.positioning) / 3;
  return base + gkTraitBonus(gk);
}

function assignPlayersToSlots(formation, line, players) {
  if (!formation) {
    return (players || [])
      .filter(Boolean)
      .map((player, slotIndex) => ({ line, slotIndex, role: line, player }));
  }

  const slots = formationLineSlots(formation, line).map((slot) => ({ ...slot, player: null }));
  const arr = players || [];

  // Posicional: cada jugador en SU hueco (índice = slotIndex), igual que
  // assignLineToSlots de state/run.js (deben coincidir). Los que no encajen en su
  // índice se reparten al primer hueco compatible libre.
  const leftover = [];
  arr.forEach((player, i) => {
    if (!player) return;
    const slot = slots[i];
    if (slot && !slot.player && slot.accepts.includes(player.position)) slot.player = player;
    else leftover.push(player);
  });
  for (const player of leftover) {
    const slot = slots.find((s) => !s.player && s.accepts.includes(player.position));
    if (slot) slot.player = player;
  }

  return slots.filter((slot) => slot.player);
}

// Agrupa el once por rol de puntuación, conservando el perfil táctico del hueco
// que ocupa cada jugador (central/lateral, pivote/interior/banda, etc.).
function tacticalGroups(starting11, formation) {
  const groups = { GK: [], DEF: [], MID: [], ENG: [], FWD: [] };
  for (const line of LINES) {
    for (const slot of assignPlayersToSlots(formation, line, starting11?.[line] || [])) {
      const role = slot.role === 'ENG' ? 'ENG' : line;
      groups[role].push({ player: slot.player, profile: slot.profile });
    }
  }
  return groups;
}

// Pesos por perfil de hueco del grid (8 perfiles = 4 filas × {central, lateral}),
// suman ~1.0. La prioridad de atributos por posición la fijó el diseño del grid:
// el mismo jugador puntúa distinto según la fila y si es central o lateral.
// NOTA DE BALANCE: estos pesos son el punto de partida; re-medir con los scripts
// de .cache (early-levels-probe, cards-probe) y ajustar para recuperar las metas.
function defScore(s, profile) {
  if (profile === 'def_lateral') {
    // Lateral: defensa con salida y desborde — pase, regate y físico cuentan.
    return 0.34 * s.defending + 0.24 * s.passing + 0.22 * s.dribbling + 0.20 * s.physical;
  }
  // def_central (y fallback de rival sin perfil): corte y pase de salida; físico base.
  return 0.50 * s.defending + 0.28 * s.passing + 0.22 * s.physical;
}

function midScore(s, profile) {
  if (profile === 'med_lateral') {
    // Volante lateral: regate y pase con recorrido; físico y ayuda en defensa.
    return 0.32 * s.dribbling + 0.26 * s.passing + 0.22 * s.physical + 0.20 * s.defending;
  }
  // med_central (y fallback): equilibrio — defensa, pase, regate, físico.
  return 0.30 * s.defending + 0.28 * s.passing + 0.22 * s.dribbling + 0.20 * s.physical;
}

function engancheMidScore(s, profile) {
  if (profile === 'eng_lateral') {
    // Enganche de banda: pase y regate con ritmo, algo de remate.
    return 0.32 * s.passing + 0.28 * s.dribbling + 0.22 * s.pace + 0.18 * s.shooting;
  }
  // eng_central (mediapunta): pase, remate y regate.
  return 0.45 * s.passing + 0.30 * s.shooting + 0.25 * s.dribbling;
}

function engancheAttackScore(s, profile) {
  if (profile === 'eng_lateral') {
    return 0.30 * s.passing + 0.28 * s.dribbling + 0.22 * s.pace + 0.20 * s.shooting;
  }
  return 0.36 * s.passing + 0.36 * s.shooting + 0.28 * s.dribbling;
}

function forwardScore(s, profile) {
  if (profile === 'del_lateral') {
    // Extremo: regate y ritmo para desbordar; remate y pase de apoyo.
    return 0.34 * s.dribbling + 0.30 * s.pace + 0.24 * s.shooting + 0.12 * s.passing;
  }
  // del_central (referencia y fallback): remate y físico.
  return 0.58 * s.shooting + 0.22 * s.physical + 0.10 * s.pace + 0.10 * s.dribbling;
}

// Stats con rasgo + bonus del DT + perfil del hueco, para puntuar cada grupo.
function statsWithProfile(entries, manager) {
  return entries.map(({ player, profile }) => ({ s: effectiveStats(player, manager), profile }));
}

// Calcula los cuatro ratings base a partir del once titular por líneas.
function baseRatings(starting11, formation, manager) {
  const groups = tacticalGroups(starting11, formation);
  const def = statsWithProfile(groups.DEF, manager);
  const mid = statsWithProfile(groups.MID, manager);
  const eng = statsWithProfile(groups.ENG, manager);
  const fwd = statsWithProfile(groups.FWD, manager);
  const laterals = def.filter(({ profile }) => profile === 'def_lateral');

  const gkRating = gkRatingOf(starting11.GK, manager);

  // Defensa = nivel de la línea defensiva con el portero como un integrante
  // más (mezcla ponderada, no un bonus sumado aparte). Así el número refleja a
  // tus defensas en lugar de dispararse siempre al tope de 99.
  // Un portero Mariscal ordena la zaga: pequeño bonus al rating de la línea.
  const defenseLine = avg(def.map(({ s, profile }) => defScore(s, profile))) +
    gkDefenseLineBonus(starting11.GK && starting11.GK[0]);
  const defenseRating = def.length ? 0.8 * defenseLine + 0.2 * gkRating : gkRating;

  const midfieldRating = weightedAvg([
    ...mid.map(({ s, profile }) => ({ value: midScore(s, profile), weight: 1 })),
    ...eng.map(({ s, profile }) => ({ value: engancheMidScore(s, profile), weight: 0.65 })),
  ]);

  // Creación que alimenta el ataque: pase del medio, pase+regate del enganche y
  // la proyección de los laterales (pase y pace al espacio) con peso menor.
  const midPassAvg = weightedAvg([
    ...mid.map(({ s }) => ({ value: s.passing, weight: 1 })),
    ...eng.map(({ s }) => ({ value: 0.65 * s.passing + 0.35 * s.dribbling, weight: 0.75 })),
    ...laterals.map(({ s }) => ({ value: 0.65 * s.passing + 0.35 * s.pace, weight: 0.35 })),
  ]);
  const forwardScores = fwd.map(({ s, profile }) => ({ value: forwardScore(s, profile), weight: 1 }));
  const engancheAttackScores = eng.map(({ s, profile }) => ({ value: engancheAttackScore(s, profile), weight: 0.65 }));
  // Ataque = nivel de los delanteros con la creación del mediocampo como factor
  // ponderado (antes se sumaba entero y empujaba el ataque al tope).
  const attackLine = weightedAvg([...forwardScores, ...engancheAttackScores]);
  const attackRating = fwd.length || eng.length ? 0.8 * attackLine + 0.2 * midPassAvg : midPassAvg;

  return {
    attack: attackRating,
    midfield: midfieldRating,
    defense: defenseRating,
    gk: gkRating,
  };
}

// Aplica química a los ratings de línea relevantes: la química por línea suma a su
// rating, y los bonus globales de equipo (núcleo nacional → todas; cohesión
// táctica → ataque+medio; reliquias 'chem' → todas) se reparten encima.
// CHEM_IMPACT escala cuánto pesa todo ese aporte en el desempeño sin tocar
// los puntos que ve el jugador.
function applyChemistry(ratings, starting11, style, items = [], manager = null) {
  const chem = computeChemistry(starting11, null, manager);
  const team = computeTeamChem(starting11, style);
  const itemChem = chemTeamBonus(items);
  const impact = CONFIG.CHEM_IMPACT;
  return {
    attack: ratings.attack + (chem.FWD + team.all + team.attackMid + itemChem) * impact,
    midfield: ratings.midfield + (chem.MID + team.all + team.attackMid + itemChem) * impact,
    defense: ratings.defense + (chem.DEF + team.all + itemChem) * impact,
    gk: ratings.gk + (chem.GK + team.all + itemChem) * impact,
  };
}

// Director técnico: aplica sus modificadores porcentuales a ataque/medio/defensa
// (el portero no se toca). Con sinergia —el estilo del DT coincide con el ESTILO
// elegido del equipo— sus modificadores positivos se amplifican (MANAGER_SYNERGY_MULT)
// y sus costes (negativos) se anulan, igual que la sinergia táctica de los objetos.
function applyManagerModifiers(ratings, manager, style) {
  if (!manager || !manager.mods) return ratings;
  const synergy = Boolean(style && manager.style === style);
  const out = { ...ratings };
  for (const stat of ['attack', 'midfield', 'defense']) {
    let pct = Number(manager.mods[stat]) || 0;
    if (synergy && pct > 0) pct *= CONFIG.MANAGER_SYNERGY_MULT;
    else if (synergy && pct < 0) pct = 0;
    out[stat] = ratings[stat] * (1 + pct / 100);
  }
  return out;
}

// Estilo táctico efectivo del equipo: el elegido por el usuario (team.style) o, en
// su defecto, el del dibujo (rivales históricos: FORMATION_TYPE de su formación).
// Alimenta las sinergias de química, objetos y DT. Sin modificadores de formación.
function teamStyle(team) {
  return team.style || formationType(team.formation) || null;
}

// Calcula los ratings finales de un equipo del jugador (con química y objetos).
// Si el equipo trae ratings precomputados (rival histórico), aplica solo los mods
// de su DT. Ya no hay modificadores de formación (el trade-off vive en el grid).
export function calcularRatings(team) {
  const style = teamStyle(team);
  if (team.ratings && !team.starting11) {
    // DT del rival (Argentina 1986 → Bilardo): sus mods entran igual que los del
    // DT del jugador. El rival no recibe la química nacional del DT (ratings
    // planos, sin once), así que el DT propio sigue siendo algo más ventajoso.
    let r = applyManagerModifiers({ ...team.ratings }, team.manager || null, style);
    for (const k in r) r[k] = Math.max(1, Math.round(r[k] * 10) / 10);
    return r;
  }
  let r = baseRatings(team.starting11, team.formation, team.manager || null);
  r = applyChemistry(r, team.starting11, style, team.items || [], team.manager || null);
  r = applyItemsToRatings(r, team.items || [], style);
  r = applyManagerModifiers(r, team.manager || null, style);
  // Sin techo de 99: todo lo que suman jugadores, química, objetos y táctica
  // llega entero a la simulación (solo piso de 1 y redondeo a décimas).
  for (const k in r) r[k] = Math.max(1, Math.round(r[k] * 10) / 10);
  return r;
}

// Construye un rematador "ponderable": el peso sale del perfil del hueco
// (el 9 remata, el extremo llega por regate/pace), modulado por el rasgo.
// Para rivales sin once se sintetiza desde el ataque.
function buildShooters(team, ratings) {
  if (team.starting11) {
    const groups = tacticalGroups(team.starting11, team.formation);
    const pool = [
      ...groups.FWD.map((entry) => ({ ...entry, roleWeight: 1 })),
      ...groups.ENG.map((entry) => ({ ...entry, roleWeight: 0.65, enganche: true })),
    ];
    const fallback = pool.length ? pool : groups.MID.map((entry) => ({ ...entry, roleWeight: 1 }));
    return fallback.map(({ player: p, profile, roleWeight, enganche }) => {
      const s = effectiveStats(p, team.manager) || {};
      const shooterRoleWeight = enganche
        ? engancheAttackScore(s, profile)
        : profile === 'del_lateral'
        ? s.shooting * 0.45 + s.pace * 0.2 + s.dribbling * 0.28 + s.passing * 0.07
        : s.shooting * 0.7 + s.pace * 0.15 + s.dribbling * 0.15;
      const weight = shooterRoleWeight * roleWeight * shooterWeightMultiplier(p);
      return { name: p.name, shooting: s.shooting, weight, trait: p.trait || null };
    });
  }
  if (team.lineup) {
    const pool = team.lineup.filter((p) => p.position === 'FWD');
    return pool.map((p) => ({ name: p.name, shooting: p.ovr || ratings.attack, weight: p.ovr || 1 }));
  }
  // Compatibilidad con un rival sin once definido.
  return [0, 1, 2].map((i) => ({
    name: `${team.name} #${9 + i}`,
    shooting: Math.max(1, ratings.attack + (i - 1) * 3),
    weight: 1,
  }));
}

// Peso de asistente según el perfil del hueco: el enganche central es el primer
// creador, los laterales de medio/ataque centran más que los centrales, y los
// laterales de la zaga aportan desde atrás.
const ASSIST_ROLE_WEIGHT = {
  MID: { med_central: 1.0, med_lateral: 1.05 },
  ENG: { eng_central: 1.25, eng_lateral: 1.1 },
  FWD: { del_central: 0.7, del_lateral: 0.95 },
};

function buildAssisters(team) {
  if (team.starting11) {
    const groups = tacticalGroups(team.starting11, team.formation);
    const laterals = groups.DEF.filter(({ profile }) => profile === 'def_lateral');
    const pool = [
      ...groups.MID.map((entry) => ({ ...entry, roleWeight: ASSIST_ROLE_WEIGHT.MID[entry.profile] ?? 1 })),
      ...groups.ENG.map((entry) => ({ ...entry, roleWeight: ASSIST_ROLE_WEIGHT.ENG[entry.profile] ?? 1.15 })),
      ...groups.FWD.map((entry) => ({ ...entry, roleWeight: ASSIST_ROLE_WEIGHT.FWD[entry.profile] ?? 0.8 })),
      ...laterals.map((entry) => ({ ...entry, roleWeight: 0.5 })),
    ];
    return pool.map(({ player: p, roleWeight }) => {
      const s = effectiveStats(p, team.manager) || {};
      // passing/dribbling se exponen para los duelos de construcción/creación.
      return { name: p.name, passing: s.passing, dribbling: s.dribbling, weight: (s.passing * 0.7 + s.dribbling * 0.3) * roleWeight, trait: p.trait || null };
    });
  }
  if (team.lineup) {
    const pool = team.lineup.filter((p) => p.position === 'MID' || p.position === 'FWD');
    return pool.map((p) => ({ name: p.name, weight: p.ovr || 1 }));
  }
  return [0, 1, 2].map((i) => ({ name: `${team.name} #${6 + i}`, weight: 1 }));
}

function gkName(team) {
  if (team.starting11 && team.starting11.GK && team.starting11.GK[0]) {
    return team.starting11.GK[0].name;
  }
  if (team.lineup) {
    return team.lineup.find((p) => p.position === 'GK')?.name || `${team.name} (${t('scene.role.keeper')})`;
  }
  return `${team.name} (${t('scene.role.keeper')})`;
}

function fallbackRatingForLine(line, ratings) {
  return ratings[line === 'DEF' ? 'defense' : line === 'MID' ? 'midfield' : line === 'FWD' ? 'attack' : 'gk'];
}

function playerRatingForLine(player, line, ratings, role = line, profile, manager = null) {
  if (!player) return fallbackRatingForLine(line, ratings);
  if (player.position === 'GK' && player.gk) {
    const g = effectiveGk(player, manager);
    return (g.reflexes + g.handling + g.positioning) / 3;
  }
  const s = player.stats ? effectiveStats(player, manager) : null;
  if (s && role === 'ENG' && line === 'MID') return engancheMidScore(s, profile);
  if (s && role === 'ENG' && line === 'FWD') return engancheAttackScore(s, profile);
  if (s && line === 'DEF') return defScore(s, profile);
  if (s && line === 'MID') return midScore(s, profile);
  if (s && line === 'FWD') return forwardScore(s, profile);
  if (typeof player.ovr === 'number') return player.ovr;
  return fallbackRatingForLine(line, ratings);
}

function normalizeLinePlayer(player, line, ratings, opts = {}) {
  const rating = playerRatingForLine(player, line, ratings, opts.role, opts.profile, opts.manager);
  const s = player && player.stats ? effectiveStats(player, opts.manager) : null;
  const gk = player && player.gk ? effectiveGk(player, opts.manager) : null;
  return {
    name: player?.name || `${line} ${Math.round(rating)}`,
    // Identidad del jugador real (equipo del jugador): permite mapear al
    // infractor de una falta con su instancia del once para tarjetas/sanciones.
    uid: player?.uid ?? null,
    // Posición natural del jugador (no el rol del hueco): la sustitución tras
    // una roja necesita saber si el expulsado era DEF/ARQ o MID/DEL.
    naturalPosition: player?.position ?? (opts.role || line),
    position: opts.role || line,
    trait: player?.trait || null,
    rating,
    passing: s?.passing ?? rating,
    shooting: s?.shooting ?? rating,
    defending: s?.defending ?? rating,
    dribbling: s?.dribbling ?? rating,
    pace: s?.pace ?? rating,
    physical: s?.physical ?? rating,
    gk: gk ? (gk.reflexes + gk.handling + gk.positioning) / 3 : rating,
    // Sub-stats del portero para el mano a mano (Cambio 4). Si no es portero o no
    // hay datos, caen al rating para que el blend sea neutro.
    reflexes: gk ? gk.reflexes : rating,
    handling: gk ? gk.handling : rating,
    positioning: gk ? gk.positioning : rating,
    weight: Math.max(1, rating) * (opts.weightScale || 1),
  };
}

function linePlayers(team, ratings, line) {
  if (team.starting11) {
    const groups = tacticalGroups(team.starting11, team.formation);
    return (groups[line] || []).map(({ player, profile }) =>
      normalizeLinePlayer(player, line, ratings, { profile, manager: team.manager }));
  }
  if (team.lineup) {
    return team.lineup
      .filter((p) => p.position === line)
      .map((p) => normalizeLinePlayer(p, line, ratings));
  }
  const stat = line === 'DEF' ? 'defense' : line === 'MID' ? 'midfield' : line === 'FWD' ? 'attack' : 'gk';
  const count = line === 'GK' ? 1 : line === 'DEF' ? 4 : line === 'MID' ? 3 : 3;
  return Array.from({ length: count }, (_, i) => normalizeLinePlayer({
    name: `${team.name} #${line === 'GK' ? 1 : i + 2}`,
    position: line,
    ovr: Math.max(1, ratings[stat] + ((i % 3) - 1) * 2),
  }, line, ratings));
}

// Normaliza un equipo a lo que necesita la simulación.
export function buildBattleTeam(team) {
  const ratings = calcularRatings(team);
  const enganches = team.starting11
    ? tacticalGroups(team.starting11, team.formation).ENG
    : [];
  const keepers = linePlayers(team, ratings, 'GK');
  const defenders = linePlayers(team, ratings, 'DEF');
  const midfielders = [
    ...linePlayers(team, ratings, 'MID'),
    ...enganches.map(({ player, profile }) => normalizeLinePlayer(player, 'MID', ratings, { role: 'ENG', profile, weightScale: 0.75, manager: team.manager })),
  ];
  const attackers = [
    ...linePlayers(team, ratings, 'FWD'),
    ...enganches.map(({ player, profile }) => normalizeLinePlayer(player, 'FWD', ratings, { role: 'ENG', profile, weightScale: 0.65, manager: team.manager })),
  ];
  return {
    name: team.name,
    color: team.color,
    formation: team.formation,
    ratings,
    shooters: buildShooters(team, ratings),
    assisters: buildAssisters(team),
    keepers,
    defenders,
    midfielders,
    attackers,
    gkName: gkName(team),
    items: team.items || [],
    // Alineación de origen y banquillo: el equipo del jugador los conserva para
    // poder rehacer ratings/pools tras una expulsión (quitar al expulsado y, si
    // era DEF/ARQ, sustituirlo desde el banco). El rival sintético no los trae.
    starting11: team.starting11 || null,
    bench: team.bench || [],
    // Bonos de partido de los objetos (presión, contras, balón parado, etc.),
    // ya nerfeados, con decaimiento, sinergia táctica (por estilo) y topes aplicados.
    matchBonuses: matchBonuses(team.items || [], teamStyle(team)),
  };
}
