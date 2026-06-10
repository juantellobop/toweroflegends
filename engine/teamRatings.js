// Torre de Leyendas — De atributos de jugador a ratings de equipo (§6.1).
// Orden de aplicación: base → química → objetos (add, luego mult).
// También construye el "battle team" que necesita la simulación: ratings +
// listas de rematadores/asistentes para resolver las jugadas.

import { computeChemistry, computeTeamChem } from './chemistry.js';
import { applyItemsToRatings } from './items.js';
import { applyTraitToStats, gkTraitBonus, shooterWeightMultiplier } from './traits.js';
import { LINES, formationLineSlots, FORMATION_MODIFIERS } from '../data/config.js';
import { t } from '../data/i18n.js';

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function weightedAvg(items) {
  const usable = items.filter((item) => item && item.weight > 0);
  const totalWeight = usable.reduce((sum, item) => sum + item.weight, 0);
  if (!totalWeight) return 0;
  return usable.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight;
}

// Rating de portero: media de sus tres atributos + bonus de rasgo.
function gkRatingOf(gkPlayers) {
  const gk = gkPlayers && gkPlayers[0];
  if (!gk || !gk.gk) return 45; // sin portero, valor pobre
  const base = (gk.gk.reflexes + gk.gk.handling + gk.gk.positioning) / 3;
  return base + gkTraitBonus(gk);
}

function assignPlayersToSlots(formation, line, players) {
  if (!formation) {
    return (players || []).map((player, slotIndex) => ({ line, slotIndex, role: line, player }));
  }

  const slots = formationLineSlots(formation, line).map((slot) => ({ ...slot, player: null }));
  const remaining = (players || []).filter(Boolean).slice();

  function fill(slot) {
    const idx = remaining.findIndex((player) => slot.accepts.includes(player.position));
    if (idx < 0) return;
    slot.player = remaining.splice(idx, 1)[0];
  }

  // En orden de hueco: cada slot toma el primer compatible que quede (preserva el
  // orden del array; debe coincidir con assignLineToSlots de state/run.js).
  slots.forEach(fill);

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

// Pesos por perfil de hueco (suman 1.0). Cada perfil pondera su stat dominante,
// pero reserva una fracción a stats secundarias para que ninguna quede muerta.
// La implicancia táctica vive aquí: el mismo jugador puntúa distinto según el
// hueco que ocupe (un creador rinde de interior, un destructor de pivote).
function defScore(s, profile) {
  if (profile === 'lateral') {
    // Lateral: recorrido y salida — pace y pase pesan; el corte importa menos.
    return 0.36 * s.defending + 0.15 * s.physical + 0.29 * s.pace + 0.2 * s.passing;
  }
  if (profile === 'central') {
    // Central: corte y físico mandan; el pase solo como salida limpia.
    return 0.57 * s.defending + 0.26 * s.physical + 0.11 * s.pace + 0.06 * s.passing;
  }
  // Sin perfil (rivales con lineup plano): mezcla histórica de la línea.
  return 0.47 * s.defending + 0.23 * s.physical + 0.22 * s.pace + 0.08 * s.passing;
}

function midScore(s, profile) {
  if (profile === 'pivote') {
    // Pivote: corte, físico y salida de balón; sin premio por llegada.
    return 0.28 * s.passing + 0.1 * s.dribbling + 0.32 * s.defending + 0.22 * s.physical + 0.08 * s.pace;
  }
  if (profile === 'interior') {
    // Interior: pase y regate con llegada (remate); defiende poco.
    return 0.34 * s.passing + 0.28 * s.dribbling + 0.1 * s.shooting + 0.1 * s.defending + 0.1 * s.physical + 0.08 * s.pace;
  }
  if (profile === 'banda') {
    // Volante de banda: regate y pace para desbordar, centro al área.
    return 0.24 * s.passing + 0.31 * s.dribbling + 0.08 * s.shooting + 0.06 * s.defending + 0.07 * s.physical + 0.24 * s.pace;
  }
  // Mixto (box-to-box) y fallback sin perfil.
  return 0.33 * s.passing + 0.23 * s.dribbling + 0.19 * s.defending + 0.18 * s.physical + 0.07 * s.pace;
}

function engancheMidScore(s, profile) {
  if (profile === 'extremo') {
    // Extremo de la línea de creación: el regate desequilibra.
    return 0.3 * s.passing + 0.4 * s.dribbling + 0.1 * s.shooting + 0.08 * s.physical + 0.12 * s.pace;
  }
  // Mediapunta: último pase y llegada.
  return 0.46 * s.passing + 0.22 * s.dribbling + 0.18 * s.shooting + 0.14 * s.physical;
}

function engancheAttackScore(s, profile) {
  if (profile === 'extremo') {
    return 0.22 * s.shooting + 0.24 * s.passing + 0.36 * s.dribbling + 0.18 * s.pace;
  }
  return 0.36 * s.shooting + 0.34 * s.passing + 0.22 * s.dribbling + 0.08 * s.pace;
}

function forwardScore(s, profile) {
  if (profile === 'nueve') {
    // Referencia del tridente: rematador puro.
    return 0.52 * s.shooting + 0.18 * s.pace + 0.16 * s.dribbling + 0.09 * s.physical + 0.05 * s.defending;
  }
  if (profile === 'extremo') {
    // Extremo: regate y pace para romper la banda; remata menos.
    return 0.18 * s.shooting + 0.24 * s.pace + 0.39 * s.dribbling + 0.12 * s.passing + 0.04 * s.physical + 0.03 * s.defending;
  }
  // Punta genérico (duplas, 9 solitario, fallback sin perfil).
  return 0.47 * s.shooting + 0.19 * s.pace + 0.19 * s.dribbling + 0.1 * s.physical + 0.05 * s.defending;
}

// Stats con rasgo aplicado + perfil del hueco, para puntuar cada grupo.
function statsWithProfile(entries) {
  return entries.map(({ player, profile }) => ({ s: applyTraitToStats(player), profile }));
}

// Calcula los cuatro ratings base a partir del once titular por líneas.
function baseRatings(starting11, formation) {
  const groups = tacticalGroups(starting11, formation);
  const def = statsWithProfile(groups.DEF);
  const mid = statsWithProfile(groups.MID);
  const eng = statsWithProfile(groups.ENG);
  const fwd = statsWithProfile(groups.FWD);
  const laterals = def.filter(({ profile }) => profile === 'lateral');

  const gkRating = gkRatingOf(starting11.GK);

  // Defensa = nivel de la línea defensiva con el portero como un integrante
  // más (mezcla ponderada, no un bonus sumado aparte). Así el número refleja a
  // tus defensas en lugar de dispararse siempre al tope de 99.
  const defenseLine = avg(def.map(({ s, profile }) => defScore(s, profile)));
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
// táctica → ataque+medio) se reparten encima.
function applyChemistry(ratings, starting11, formation) {
  const chem = computeChemistry(starting11);
  const team = computeTeamChem(starting11, formation);
  return {
    attack: ratings.attack + chem.FWD + team.all + team.attackMid,
    midfield: ratings.midfield + chem.MID + team.all + team.attackMid,
    defense: ratings.defense + chem.DEF + team.all,
    gk: ratings.gk + chem.GK + team.all,
  };
}

// Identidad de la formación: multiplica los ratings de campo por su modificador.
// El portero no se toca. Sin modificador conocido → neutro.
function applyFormationModifiers(ratings, formation) {
  const mod = FORMATION_MODIFIERS[formation];
  if (!mod) return ratings;
  return {
    attack: ratings.attack * (mod.attack ?? 1),
    midfield: ratings.midfield * (mod.midfield ?? 1),
    defense: ratings.defense * (mod.defense ?? 1),
    gk: ratings.gk,
  };
}

// Calcula los ratings finales de un equipo del jugador (con química, objetos y
// modificador de formación). Si el equipo trae ratings precomputados (rival
// histórico), aplica solo el modificador de su formación (simetría con el jugador).
export function calcularRatings(team) {
  if (team.ratings && !team.starting11) {
    const r = applyFormationModifiers({ ...team.ratings }, team.formation);
    for (const k in r) r[k] = Math.max(1, Math.min(99, Math.round(r[k] * 10) / 10));
    return r;
  }
  let r = baseRatings(team.starting11, team.formation);
  r = applyChemistry(r, team.starting11, team.formation);
  r = applyItemsToRatings(r, team.items || []);
  r = applyFormationModifiers(r, team.formation);
  for (const k in r) r[k] = Math.max(1, Math.min(99, Math.round(r[k] * 10) / 10));
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
      const s = applyTraitToStats(p) || {};
      const shooterRoleWeight = enganche
        ? engancheAttackScore(s, profile)
        : profile === 'extremo'
        ? s.shooting * 0.45 + s.pace * 0.2 + s.dribbling * 0.28 + s.passing * 0.07
        : s.shooting * 0.7 + s.pace * 0.15 + s.dribbling * 0.15;
      const weight = shooterRoleWeight * roleWeight * shooterWeightMultiplier(p);
      return { name: p.name, shooting: s.shooting, weight };
    });
  }
  if (team.lineup) {
    const pool = team.lineup.filter((p) => p.position === 'FWD');
    return pool.map((p) => ({ name: p.name, shooting: p.ovr || ratings.attack, weight: p.ovr || 1 }));
  }
  // Compatibilidad con un rival sin once definido.
  return [0, 1, 2].map((i) => ({
    name: `${team.name} #${9 + i}`,
    shooting: Math.max(1, Math.min(99, ratings.attack + (i - 1) * 3)),
    weight: 1,
  }));
}

// Peso de asistente según el perfil del hueco: el mediapunta es el primer
// creador, interiores y bandas generan más que un pivote, los extremos del
// ataque asisten más que un 9 y los laterales aportan desde atrás.
const ASSIST_ROLE_WEIGHT = {
  MID: { pivote: 0.85, interior: 1.1, banda: 1.05 },
  ENG: { mediapunta: 1.25, extremo: 1.1 },
  FWD: { extremo: 0.95, nueve: 0.7 },
};

function buildAssisters(team) {
  if (team.starting11) {
    const groups = tacticalGroups(team.starting11, team.formation);
    const laterals = groups.DEF.filter(({ profile }) => profile === 'lateral');
    const pool = [
      ...groups.MID.map((entry) => ({ ...entry, roleWeight: ASSIST_ROLE_WEIGHT.MID[entry.profile] ?? 1 })),
      ...groups.ENG.map((entry) => ({ ...entry, roleWeight: ASSIST_ROLE_WEIGHT.ENG[entry.profile] ?? 1.15 })),
      ...groups.FWD.map((entry) => ({ ...entry, roleWeight: ASSIST_ROLE_WEIGHT.FWD[entry.profile] ?? 0.8 })),
      ...laterals.map((entry) => ({ ...entry, roleWeight: 0.5 })),
    ];
    return pool.map(({ player: p, roleWeight }) => {
      const s = applyTraitToStats(p) || {};
      // passing/dribbling se exponen para los duelos de construcción/creación.
      return { name: p.name, passing: s.passing, dribbling: s.dribbling, weight: (s.passing * 0.7 + s.dribbling * 0.3) * roleWeight };
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

function playerRatingForLine(player, line, ratings, role = line, profile) {
  if (!player) return fallbackRatingForLine(line, ratings);
  if (player.position === 'GK' && player.gk) {
    return (player.gk.reflexes + player.gk.handling + player.gk.positioning) / 3;
  }
  const s = player.stats ? applyTraitToStats(player) : null;
  if (s && role === 'ENG' && line === 'MID') return engancheMidScore(s, profile);
  if (s && role === 'ENG' && line === 'FWD') return engancheAttackScore(s, profile);
  if (s && line === 'DEF') return defScore(s, profile);
  if (s && line === 'MID') return midScore(s, profile);
  if (s && line === 'FWD') return forwardScore(s, profile);
  if (typeof player.ovr === 'number') return player.ovr;
  return fallbackRatingForLine(line, ratings);
}

function normalizeLinePlayer(player, line, ratings, opts = {}) {
  const rating = playerRatingForLine(player, line, ratings, opts.role, opts.profile);
  const s = player && player.stats ? applyTraitToStats(player) : null;
  const gk = player && player.gk ? player.gk : null;
  return {
    name: player?.name || `${line} ${Math.round(rating)}`,
    position: opts.role || line,
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
      normalizeLinePlayer(player, line, ratings, { profile }));
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
    ovr: Math.max(1, Math.min(99, ratings[stat] + ((i % 3) - 1) * 2)),
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
    ...enganches.map(({ player, profile }) => normalizeLinePlayer(player, 'MID', ratings, { role: 'ENG', profile, weightScale: 0.75 })),
  ];
  const attackers = [
    ...linePlayers(team, ratings, 'FWD'),
    ...enganches.map(({ player, profile }) => normalizeLinePlayer(player, 'FWD', ratings, { role: 'ENG', profile, weightScale: 0.65 })),
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
  };
}
