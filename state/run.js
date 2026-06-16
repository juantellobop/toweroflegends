// Torre de Leyendas — Estado de la run y máquina del bucle (§3, §5.4).
// Mantiene la plantilla, el once, los objetos y el nivel; genera sobres,
// simula el partido y avanza o termina la run según el resultado.

import {
  CONFIG, FORMATIONS, LINES, RARITIES, RARITY_BIAS, managerRarityBias,
  formationLineSlots, slotAcceptsPosition,
} from '../data/config.js';
import { getPlayableRoster } from '../data/playableRoster.js';
import { ITEMS } from '../data/items.js';
import { MANAGERS } from '../data/managers.js';
import { RNG, randomSeed } from '../engine/rng.js';
import { generateOpponent } from '../data/opponents.js';
import { simularPartido } from '../engine/simulate.js';
import { calcularRatings } from '../engine/teamRatings.js';
import { computeChemistry, totalChemistry } from '../engine/chemistry.js';
import { rewardFor, classifyResult, rollRarity } from '../engine/rewards.js';
import { chemTeamBonus, metaBonuses } from '../engine/items.js';
import { playerOVR, ovrBand, OVR_BANDS } from '../engine/ovr.js';
import { flagAccentForNation } from '../data/flags.js';
import { sanitizeTeamName } from '../data/teamName.js';

let uid = 0;
function freshId(base) {
  uid += 1;
  return `${base}__${uid}`;
}

// Identidad anónima de la run, estable entre guardado y reanudación. Sirve para
// que el servidor deduplique el ranking: un save clonado comparte runId y no
// puede generar una segunda entrada. Mismo fallback que data/comunidad.js.
function freshRunId() {
  return globalThis.crypto?.randomUUID
    ? globalThis.crypto.randomUUID()
    : `tdl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// Clona una carta del catálogo con un uid de instancia para la UI.
function instantiate(template) {
  return { ...template, uid: freshId(template.id) };
}

function groupByRarity(list) {
  const out = {};
  for (const x of list) (out[x.rarity] ||= []).push(x);
  return out;
}

// Sortea `count` plantillas distintas de `pool` con sesgo de rareza.
function drawCards(pool, count, bias, rng) {
  const byRarity = groupByRarity(pool);
  const chosen = [];
  const usedTemplateIds = new Set();
  let guard = 0;
  while (chosen.length < count && guard < count * 40) {
    guard++;
    const rarity = rollRarity(bias, rng);
    let available = (byRarity[rarity] || []).filter((c) => !usedTemplateIds.has(c.id));
    if (!available.length) {
      // Sin cartas de esa rareza disponibles: cae a cualquier carta no usada.
      available = pool.filter((c) => !usedTemplateIds.has(c.id));
      if (!available.length) break;
    }
    const card = rng.pick(available);
    usedTemplateIds.add(card.id);
    chosen.push(card);
  }
  return chosen;
}

// Orden de respaldo cuando la banda pedida no tiene cartas disponibles:
// se prueba la pedida y luego las contiguas, de menor a mayor distancia.
const BAND_FALLBACK = {
  low: ['low', 'mid', 'high'],
  mid: ['mid', 'low', 'high'],
  high: ['high', 'mid', 'low'],
};

function groupByBand(list) {
  const out = { low: [], mid: [], high: [] };
  for (const x of list) out[ovrBand(x)].push(x);
  return out;
}

function rollBand(weights, rng) {
  return rng.weighted(OVR_BANDS.map((value) => ({ value, weight: weights[value] || 0 })));
}

// Elige una carta distinta de `byBand` para la banda sorteada, cayendo a las
// bandas contiguas si la pedida ya está agotada. Devuelve null si no queda nada.
function pickFromBand(byBand, weights, used, rng) {
  const band = rollBand(weights, rng);
  for (const b of BAND_FALLBACK[band]) {
    const available = byBand[b].filter((c) => !used.has(c.id));
    if (available.length) return rng.pick(available);
  }
  return null;
}

// Sortea `count` cartas distintas de `pool` por banda de OVR (pesos relativos
// low/mid/high), no por rareza.
function drawByBand(pool, count, weights, rng) {
  const byBand = groupByBand(pool);
  const used = new Set();
  const chosen = [];
  let guard = 0;
  while (chosen.length < count && guard < count * 40) {
    guard++;
    const card = pickFromBand(byBand, weights, used, rng);
    if (!card) break;
    used.add(card.id);
    chosen.push(card);
  }
  return chosen;
}

// Algunos jugadores son la misma persona en distintas épocas (Ronaldo 1998 y
// 2002): comparten `dupGroup`. Tener una carta del grupo bloquea a las demás —
// no aparecen como seleccionables ni pueden añadirse. Para el resto de cartas la
// clave de grupo es su propio id, así que el bloqueo equivale a "ya la tienes".
function dupKey(player) {
  return player.dupGroup || player.id;
}

function ownedKeySet(squad) {
  return new Set(squad.map(dupKey));
}

// Reparte primero cartas no poseídas y solo rellena con repetidas
// deshabilitadas cuando el pool nuevo no alcanza el tamaño del sobre.
export function drawPlayerPack(catalog, squad, size, weights, rng) {
  const ownedKeys = ownedKeySet(squad);
  const owns = (card) => ownedKeys.has(dupKey(card));
  if (CONFIG.ALLOW_DUPLICATE_PLAYERS || !CONFIG.PACK_GUARANTEE_SELECTABLE) {
    return drawByBand(catalog, size, weights, rng)
      .map((card) => ({ ...card, selectable: CONFIG.ALLOW_DUPLICATE_PLAYERS || !owns(card) }));
  }
  const unowned = catalog.filter((p) => !owns(p));
  const owned = catalog.filter((p) => owns(p));
  const cards = drawByBand(unowned, Math.min(size, unowned.length), weights, rng);
  if (cards.length < size) {
    cards.push(...drawByBand(owned, Math.min(size - cards.length, owned.length), weights, rng));
  }
  return cards.map((card) => ({ ...card, selectable: !owns(card) }));
}

// Sortea las cartas que cubren la formación más los suplentes de arranque
// (STARTER_BENCH), tomando de TODO el roster. La banda de cada hueco se decide
// por pesos (≈80% < 70, 15% 70-90, 5% > 90), cayendo a bandas contiguas si la
// pedida se agota en esa posición.
export function generateStarterSquad(catalog, formation, config, rng) {
  const slots = formationSlots(formation);
  const bench = config.STARTER_BENCH || {};
  const weights = config.STARTER_BAND_WEIGHTS;
  const occupied = new Set();
  const squad = [];

  for (const line of LINES) {
    const byBand = groupByBand(catalog.filter((p) => p.position === line));
    for (let i = 0; i < slots[line] + (bench[line] || 0); i++) {
      const picked = pickFromBand(byBand, weights, occupied, rng);
      if (!picked) throw new Error(`No hay jugadores suficientes para cubrir ${line}`);
      occupied.add(picked.id);
      squad.push(picked);
    }
  }

  if (squad.length !== config.STARTER_SQUAD_SIZE) {
    throw new Error(`Plantilla inicial inválida: ${squad.length} cartas`);
  }
  return squad;
}

// === Construcción del once ===

export function formationSlots(formation) {
  return FORMATIONS[formation] || FORMATIONS['4-3-3'];
}

function canAssignPlayersToLine(formation, line, players) {
  const slots = formationLineSlots(formation, line);
  const realPlayers = players.filter(Boolean);
  if (realPlayers.length > slots.length) return false;

  const ordered = realPlayers
    .map((player) => ({
      player,
      slots: slots
        .filter((slot) => slot.accepts.includes(player.position))
        .map((slot) => slot.slotIndex),
    }))
    .sort((a, b) => a.slots.length - b.slots.length);

  if (ordered.some((entry) => entry.slots.length === 0)) return false;

  const used = new Set();
  function place(i) {
    if (i >= ordered.length) return true;
    for (const slotIndex of ordered[i].slots) {
      if (used.has(slotIndex)) continue;
      used.add(slotIndex);
      if (place(i + 1)) return true;
      used.delete(slotIndex);
    }
    return false;
  }
  return place(0);
}

// Asigna los jugadores de una línea a los huecos de la formación tal como los
// pinta la pantalla de armado, para saber qué jugador ocupa cada slotIndex
// visible (importante en 4-3-1-2, donde el slot ENG admite MID/FWD y el índice
// de array no coincide con el índice de hueco). Compartida con buildScreen.
export function assignLineToSlots(formation, line, players) {
  const slots = formationLineSlots(formation, line).map((slot) => ({ ...slot, player: null }));
  const arr = players || [];
  // Posicional: cada jugador vive en SU hueco (índice del array = slotIndex). Así
  // un hueco vacío (null) se queda exactamente donde estaba —al quitar a uno, el
  // resto NO se recoloca— y el 9 sigue en el centro, los extremos a los lados.
  // Los que no encajen en su propio índice (saves antiguos, cambio de dibujo) se
  // reparten luego al primer hueco compatible que quede libre.
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
  return slots;
}

// Copia posicional de una línea (longitud = nº de huecos del dibujo): índice =
// slotIndex, null en los huecos libres. Normaliza listas densas o saves para que
// las operaciones de colocación trabajen por hueco sin desplazar al resto.
function lineSlotArray(state, line) {
  const cap = formationSlots(state.formation)[line] || 0;
  const assigned = assignLineToSlots(state.formation, line, state.starting11[line] || []);
  const arr = new Array(cap).fill(null);
  for (const slot of assigned) if (slot.player) arr[slot.slotIndex] = slot.player;
  return arr;
}

// Jugador que ocupa el hueco visible (line, slotIndex), o null si está vacío.
function occupantAt(state, line, slotIndex) {
  const slot = assignLineToSlots(state.formation, line, state.starting11[line])
    .find((s) => s.slotIndex === slotIndex);
  return slot ? slot.player : null;
}
// Hueco visible que ocupa un jugador dentro de su línea, o -1 si no está.
function slotIndexOfPlayer(state, line, player) {
  const slot = assignLineToSlots(state.formation, line, state.starting11[line])
    .find((s) => s.player && s.player.uid === player.uid);
  return slot ? slot.slotIndex : -1;
}

function starterLineFor(state, player) {
  return LINES.find((line) =>
    (state.starting11[line] || []).some((p) => p && p.uid === player.uid)
  );
}

// Un jugador con sanción pendiente (expulsado el partido anterior) no puede
// seleccionarse: cumple un partido en el banquillo antes de volver.
export function isSuspended(player) {
  return (player && player.banMatches > 0) || false;
}

// Un jugador lesionado (moderada o peor) está de baja varios partidos. Las
// lesiones simples no dejan baja (injuryMatches = 0): solo retiran del partido.
export function isInjured(player) {
  return (player && player.injuryMatches > 0) || false;
}

// No disponible para alinearse: sancionado o lesionado.
export function isUnavailable(player) {
  return isSuspended(player) || isInjured(player);
}

function hasAlignedDuplicate(state, player) {
  return LINES.some((line) =>
    (state.starting11[line] || []).some((p) => p && p.id === player.id && p.uid !== player.uid)
  );
}

function targetLineAfterPlacement(state, player, line, slotIndex = 0) {
  if (!player || !LINES.includes(line)) return null;
  const cap = formationSlots(state.formation)[line] || 0;
  if (!cap) return null;

  const targetIndex = Math.max(0, Math.min(cap - 1, Number(slotIndex) || 0));
  if (!slotAcceptsPosition(state.formation, line, targetIndex, player.position)) return null;

  const arr = lineSlotArray(state, line);
  const sourceIndex = arr.findIndex((p) => p && p.uid === player.uid);
  if (sourceIndex >= 0) arr[sourceIndex] = null;
  // Ocupa exactamente el hueco destino (vacío → colocación; ocupado → el anterior
  // sale, sin desplazar a nadie más): el array es posicional, índice = slotIndex.
  arr[targetIndex] = player;

  return canAssignPlayersToLine(state.formation, line, arr) ? arr : null;
}

function firstOpenSlotForPlayer(state, player) {
  const preferredLines = [
    player.position,
    ...LINES.filter((line) => line !== player.position),
  ];

  for (const line of preferredLines) {
    // Primer hueco VACÍO compatible, en orden de slot: así un jugador entra al
    // hueco que dejó otro sin recolocar al resto de la línea.
    const open = assignLineToSlots(state.formation, line, state.starting11[line] || [])
      .find((slot) => !slot.player && slot.accepts.includes(player.position));
    if (open && targetLineAfterPlacement(state, player, line, open.slotIndex)) {
      return { line, slotIndex: open.slotIndex };
    }
  }

  return null;
}

// Evalúa (sin mutar) el resultado de colocar `player` en (line, slotIndex).
// Devuelve un plan { kind, changes } con las líneas resultantes, o null si la
// jugada no es válida. Lo usan tanto canPlacePlayerInSlot (resaltado/validación)
// como placePlayerInLineup (commit), de modo que ambos coinciden siempre.
//   · hueco vacío           → 'place'
//   · mismo jugador (no-op) / reordenar misma línea → 'move'
//   · titular sobre titular → 'swap'  (intercambian posición; nadie al banco)
//   · suplente sobre titular → 'replace' (sustitución: el titular va al banco)
function evaluatePlacement(state, player, line, slotIndex = 0) {
  if (!player || !LINES.includes(line)) return null;
  const currentLine = starterLineFor(state, player);
  // Un suplente no puede entrar si ya hay otra copia suya alineada.
  if (!currentLine && hasAlignedDuplicate(state, player)) return null;

  const cap = formationSlots(state.formation)[line] || 0;
  if (!cap) return null;
  const targetIndex = Math.max(0, Math.min(cap - 1, Number(slotIndex) || 0));
  if (!slotAcceptsPosition(state.formation, line, targetIndex, player.position)) return null;

  const occupant = occupantAt(state, line, targetIndex);

  // --- Titular A sobre otro titular B → intercambio de posiciones ---
  // Solo es válido si B puede jugar en el hueco que deja A; si no, se rechaza
  // (no expulsamos a un titular al banco al arrastrar entre titulares).
  if (occupant && occupant.uid !== player.uid && currentLine) {
    const sourceIndex = slotIndexOfPlayer(state, currentLine, player);
    if (sourceIndex < 0) return null;
    if (!slotAcceptsPosition(state.formation, currentLine, sourceIndex, occupant.position)) return null;

    if (currentLine === line) {
      const arr = lineSlotArray(state, line);
      const ia = arr.findIndex((p) => p && p.uid === player.uid);
      const ib = arr.findIndex((p) => p && p.uid === occupant.uid);
      if (ia < 0 || ib < 0) return null;
      [arr[ia], arr[ib]] = [arr[ib], arr[ia]];
      if (!canAssignPlayersToLine(state.formation, line, arr)) return null;
      return { kind: 'swap', changes: { [line]: arr } };
    }
    const arrSrc = lineSlotArray(state, currentLine);
    const arrDst = lineSlotArray(state, line);
    const ia = arrSrc.findIndex((p) => p && p.uid === player.uid);
    const ib = arrDst.findIndex((p) => p && p.uid === occupant.uid);
    if (ia < 0 || ib < 0) return null;
    arrSrc[ia] = occupant;
    arrDst[ib] = player;
    if (!canAssignPlayersToLine(state.formation, currentLine, arrSrc)) return null;
    if (!canAssignPlayersToLine(state.formation, line, arrDst)) return null;
    return { kind: 'swap', changes: { [currentLine]: arrSrc, [line]: arrDst } };
  }

  // --- Hueco vacío, reordenar misma línea o sustitución desde el banco ---
  const wasFull = (state.starting11[line] || []).filter(Boolean).length >= cap;
  const nextLine = targetLineAfterPlacement(state, player, line, targetIndex);
  if (!nextLine) return null;
  const changes = { [line]: nextLine };
  if (currentLine && currentLine !== line) {
    // El jugador deja su línea de origen: su hueco queda vacío en su sitio.
    const srcArr = lineSlotArray(state, currentLine);
    const si = srcArr.findIndex((p) => p && p.uid === player.uid);
    if (si >= 0) srcArr[si] = null;
    changes[currentLine] = srcArr;
  }
  let kind = 'place';
  if (currentLine === line) kind = 'move';
  else if (!currentLine && occupant && wasFull) kind = 'replace';
  return { kind, changes };
}

export function canPlacePlayerInSlot(state, player, line, slotIndex = 0) {
  return Boolean(evaluatePlacement(state, player, line, slotIndex));
}

// Crea un once vacío acorde a la formación.
function emptyStarting11() {
  return { GK: [], DEF: [], MID: [], FWD: [] };
}

function statFor(player, key) {
  if (player.position === 'GK') return playerOVR(player);
  return player.stats?.[key] ?? playerOVR(player);
}

function orderLineForFormation(line, players, slots) {
  if (line !== 'FWD' || players.length !== slots.FWD) return players;
  const nineScore = (p) => statFor(p, 'shooting') * 0.8 + statFor(p, 'physical') * 0.2;
  const wingScore = (p) => statFor(p, 'dribbling') + statFor(p, 'pace');
  if (slots.FWD === 3) {
    const picked = players.slice();
    let centerIndex = 0;
    for (let i = 1; i < picked.length; i++) {
      if (nineScore(picked[i]) > nineScore(picked[centerIndex])) centerIndex = i;
    }
    const [center] = picked.splice(centerIndex, 1);
    picked.sort((a, b) => wingScore(b) - wingScore(a));
    return [picked[0], center, picked[1]];
  }
  if (slots.FWD === 4) {
    // 4-2-4: la dupla de mejores rematadores al centro, regateadores a las puntas.
    const picked = players.slice().sort((a, b) => nineScore(b) - nineScore(a));
    const centers = picked.slice(0, 2);
    const wings = picked.slice(2).sort((a, b) => wingScore(b) - wingScore(a));
    return [wings[0], centers[0], centers[1], wings[1]];
  }
  return players;
}

// Rellena automáticamente el once con los mejores de la plantilla, hueco a
// hueco. Los huecos de una sola posición eligen primero (para no quedarse sin
// especialistas) y los híbridos (extremos, enganches) toman después al mejor
// disponible entre las posiciones que aceptan; a igual OVR gana la natural.
export function autoFillStarting11(state) {
  const used = new Set();
  const eleven = emptyStarting11();
  const allSlots = LINES.flatMap((line) => formationLineSlots(state.formation, line));
  const bySlot = new Map();
  for (const slot of allSlots.slice().sort((a, b) => a.accepts.length - b.accepts.length)) {
    const player = state.squad
      .filter((p) => slot.accepts.includes(p.position) && !used.has(p.id) && !isUnavailable(p))
      .sort((a, b) =>
        (playerOVR(b) - playerOVR(a)) ||
        ((b.position === slot.line ? 1 : 0) - (a.position === slot.line ? 1 : 0))
      )[0];
    if (!player) continue;
    used.add(player.id);
    bySlot.set(slot, player);
  }
  const shape = formationSlots(state.formation);
  for (const line of LINES) {
    const picked = allSlots
      .filter((slot) => slot.line === line)
      .map((slot) => bySlot.get(slot))
      .filter(Boolean);
    eleven[line] = orderLineForFormation(line, picked, shape);
  }
  state.starting11 = eleven;
}

// ¿Está el once completo para la formación actual?
export function isLineupComplete(state) {
  const slots = formationSlots(state.formation);
  const filled = (line) => (state.starting11[line] || []).filter(Boolean);
  const players = LINES.flatMap(filled);
  return LINES.every((line) => filled(line).length === slots[line]) &&
    LINES.every((line) => canAssignPlayersToLine(state.formation, line, state.starting11[line] || [])) &&
    new Set(players.map((p) => p.id)).size === players.length;
}

// Coloca/quita un jugador del once (toggle). Respeta la capacidad de la línea.
export function togglePlayerInLineup(state, player) {
  const currentLine = starterLineFor(state, player);
  if (currentLine) {
    const arr = state.starting11[currentLine];
    const idx = arr.findIndex((p) => p && p.uid === player.uid);
    // Hueco en su sitio: lo dejamos vacío (null) sin recolocar al resto.
    if (idx >= 0) arr[idx] = null;
    return { placed: false };
  }

  if (isInjured(player)) return { placed: false, injured: true };
  if (isSuspended(player)) return { placed: false, suspended: true };
  if (hasAlignedDuplicate(state, player)) return { placed: false, duplicate: true };

  const target = firstOpenSlotForPlayer(state, player);
  if (!target) return { placed: false, full: true };
  return placePlayerInLineup(state, player, target.line, target.slotIndex);
}

// Coloca un jugador en un slot concreto de su línea. Sirve para drag & drop:
// desde banquillo coloca/reemplaza; desde el campo reordena dentro de la línea.
export function placePlayerInLineup(state, player, line = player.position, slotIndex = 0) {
  // Un sancionado o lesionado que viene del banquillo no puede entrar a la táctica.
  if (isUnavailable(player) && !starterLineFor(state, player)) {
    return { placed: false, suspended: isSuspended(player), injured: isInjured(player) };
  }
  const plan = evaluatePlacement(state, player, line, slotIndex);
  if (!plan) {
    if (!player || !LINES.includes(line)) return { placed: false, invalidPosition: true };
    if (!starterLineFor(state, player) && hasAlignedDuplicate(state, player)) {
      return { placed: false, duplicate: true };
    }
    return { placed: false, invalidPosition: true };
  }
  for (const [ln, arr] of Object.entries(plan.changes)) state.starting11[ln] = arr;
  return {
    placed: true,
    swapped: plan.kind === 'swap',
    moved: plan.kind === 'move',
    replaced: plan.kind === 'replace',
  };
}

export function isStarter(state, player) {
  return Boolean(starterLineFor(state, player));
}

// Cambia de formación y reajusta el once (recolocando automáticamente).
export function setFormation(state, formation) {
  if (!FORMATIONS[formation]) return;
  state.formation = formation;
  autoFillStarting11(state);
}

// === Ratings y química en vivo (para la pantalla de armar equipo) ===

export function liveRatings(state) {
  return calcularRatings({ formation: state.formation, starting11: state.starting11, items: state.items, manager: state.manager });
}
export function liveChemistry(state) {
  // El total incluye la química de equipo aportada por reliquias (p. ej. el
  // Duodécimo jugador), redondeada por el decaimiento de copias repetidas.
  const total = totalChemistry(state.starting11, state.formation, state.manager) + chemTeamBonus(state.items || []);
  return { byLine: computeChemistry(state.starting11, state.formation, state.manager), total: Math.round(total) };
}

// Aporte neto de los objetos a cada rating de equipo (con objetos − sin objetos),
// para mostrar al jugador cómo le mejoran el equipo. Incluye ya el efecto del
// modificador de formación sobre el boost (es la mejora real en el número final).
export function liveItemDelta(state) {
  const withItems = liveRatings(state);
  // El DT entra en ambas ramas → su efecto se cancela y el delta aísla los objetos.
  const noItems = calcularRatings({ formation: state.formation, starting11: state.starting11, items: [], manager: state.manager });
  const round = (n) => Math.round(n * 10) / 10;
  return {
    attack: round(withItems.attack - noItems.attack),
    midfield: round(withItems.midfield - noItems.midfield),
    defense: round(withItems.defense - noItems.defense),
    gk: round(withItems.gk - noItems.gk),
  };
}

// === Sobres ===

// Genera el sobre de jugador del nivel actual (cartas a elegir).
export function rollPlayerPack(state) {
  // Los extras de reliquias ya están incluidos en pendingPlayerPack (los aplica
  // rewardFor al calcular la recompensa); aquí no se vuelven a sumar.
  const count = state.pendingPlayerPack ?? CONFIG.PACK_EMPATE;
  state.playerChoices = drawPlayerPack(state.roster || getPlayableRoster(), state.squad, count, CONFIG.PACK_BAND_WEIGHTS, state.rng);
  return state.playerChoices;
}

// ¿Toca el sobre especial de selecciones en este nivel? (5, 10, 15…)
export function isNationPackLevel(level) {
  const every = CONFIG.NATION_PACK_EVERY;
  return every > 0 && level % every === 0;
}

// Agrupa el catálogo por selección (nación + año) y marca, contra la plantilla
// actual, qué cartas son nuevas. Los jugadores van ordenados por OVR.
function nationTeamsFrom(catalog, squad) {
  const ownedKeys = ownedKeySet(squad);
  const groups = new Map();
  for (const player of catalog) {
    const id = `${player.nation}|${player.era}`;
    if (!groups.has(id)) groups.set(id, { id, nation: player.nation, era: player.era, players: [] });
    groups.get(id).players.push(player);
  }
  return [...groups.values()].map((team) => {
    const players = team.players
      .slice()
      .sort((a, b) => playerOVR(b) - playerOVR(a))
      .map((p) => ({ ...p, selectable: !ownedKeys.has(dupKey(p)) }));
    const fresh = players.filter((p) => p.selectable);
    return {
      ...team,
      players,
      newCount: fresh.length,
      topOvr: fresh.length ? playerOVR(fresh[0]) : 0,
    };
  });
}

// Genera el sobre especial: selecciones distintas (nación + año) con cartas
// nuevas suficientes para que la elección tenga sustancia; si no alcanzan,
// se admite cualquier selección con al menos una carta nueva.
export function rollNationPack(state) {
  const count = CONFIG.NATION_PACK_TEAMS;
  const teams = nationTeamsFrom(state.roster || getPlayableRoster(), state.squad);
  let eligible = teams.filter((team) => team.newCount >= CONFIG.NATION_PACK_MIN_PLAYERS);
  if (eligible.length < count) eligible = teams.filter((team) => team.newCount > 0);
  const pool = eligible.slice();
  const chosen = [];
  while (chosen.length < count && pool.length) {
    const pick = state.rng.pick(pool);
    pool.splice(pool.indexOf(pick), 1);
    chosen.push(pick);
  }
  state.nationChoices = chosen;
  return chosen;
}

// Genera el sobre de objeto del nivel actual.
export function rollItemPack(state) {
  // Los extras de reliquias ya están incluidos en pendingItemPack (los aplica
  // rewardFor al calcular la recompensa); aquí no se vuelven a sumar.
  const count = state.pendingItemPack ?? CONFIG.ITEM_PACK_BASE;
  const bias = state.pendingBias || RARITY_BIAS.inicial;
  state.itemChoices = drawCards(ITEMS, count, bias, state.rng);
  return state.itemChoices;
}

// El jugador elige una carta de jugador del sobre.
export function choosePlayerCard(state, template) {
  if (!template || template.selectable === false) return null;
  if (!CONFIG.ALLOW_DUPLICATE_PLAYERS && state.squad.some((p) => dupKey(p) === dupKey(template))) return null;
  const card = instantiate(template);
  state.squad.push(card);
  // Si hay hueco compatible, colócalo automáticamente.
  togglePlayerInLineup(state, card);
  state.playerChoices = null;
  state.nationChoices = null;
  return card;
}

// El jugador elige un objeto del sobre.
export function chooseItemCard(state, template) {
  const item = { ...template, uid: freshId(template.id) };
  state.items.push(item);
  state.itemChoices = null;
  return item;
}

// === Director técnico (DT) ===

// ¿Toca sobre de DT en este nivel? Nivel 1 (tras el sobre de jugadores) y luego
// cada MANAGER_PACK_EVERY niveles (7, 14, 21…).
export function isManagerPackLevel(level) {
  const every = CONFIG.MANAGER_PACK_EVERY;
  return level === 1 || (every > 0 && level % every === 0);
}

// Índice 1-based del sobre de DT por nivel: nivel 1 → 1, 7 → 2, 14 → 3… Marca
// cuántos sobres se han abierto, para subir el sesgo de rareza con cada sobre.
export function managerPackIndex(level) {
  return 1 + Math.floor(level / CONFIG.MANAGER_PACK_EVERY);
}

// Genera el sobre de DT: MANAGER_PACK_SIZE opciones por rareza. El sesgo sube con
// cada sobre abierto (managerRarityBias) y el primer sobre no puede dar leyenda:
// el pool se filtra a las rarezas con peso > 0 para no colarlas por el respaldo
// de drawCards. Excluye el DT activo para que la elección renueve siempre.
export function rollManagerPack(state) {
  const bias = managerRarityBias(managerPackIndex(state.level));
  const allowed = new Set(RARITIES.filter((_, i) => bias[i] > 0));
  let pool = MANAGERS.filter((m) => m.id !== state.manager?.id && allowed.has(m.rarity));
  if (!pool.length) pool = MANAGERS.filter((m) => allowed.has(m.rarity));
  const chosen = drawCards(pool, CONFIG.MANAGER_PACK_SIZE, bias, state.rng);
  state.managerChoices = chosen.map(instantiate);
  return state.managerChoices;
}

// El jugador elige un DT del sobre: reemplaza al anterior (un solo DT activo).
export function chooseManagerCard(state, template) {
  if (!template) return null;
  state.manager = { ...template, uid: template.uid || freshId(template.id) };
  state.managerChoices = null;
  state.pendingManagerPack = false;
  return state.manager;
}

// Descarta el sobre de DT sin elegir ninguno: conserva el DT actual (o ninguno)
// y cierra el sobre para continuar el bucle.
export function discardManagerPack(state) {
  state.managerChoices = null;
  state.pendingManagerPack = false;
}

// === Partido ===

export function prepareOpponent(state) {
  if (state.opponent) return state.opponent;
  state.opponent = generateOpponent(state.level, state.rng, state.usedOpponentIds);
  state.usedOpponentIds.push(state.opponent.id);
  return state.opponent;
}

export function playMatch(state) {
  prepareOpponent(state);
  const matchSeed = (state.seed + state.level * 1013904223) >>> 0;
  const matchRng = new RNG(matchSeed);
  const team = {
    name: state.team.name,
    color: state.team.color,
    formation: state.formation,
    starting11: state.starting11,
    items: state.items,
    // Director técnico activo: sus modificadores entran en calcularRatings y, con
    // ello, en la simulación; también aporta química a sus connacionales.
    manager: state.manager,
    // Banquillo disponible para sustituir tras una expulsión o lesión (suplentes
    // que no están en el once y están disponibles).
    bench: state.squad.filter((p) => !isStarter(state, p) && !isUnavailable(p)),
  };
  const result = simularPartido(team, state.opponent, matchRng);
  // Regla oculta: el primer partido de la torre es imposible de perder; como
  // mínimo se empata. Del segundo en adelante se puede perder con normalidad.
  if (state.level === 1) forceAtLeastDraw(result);
  // Once tal como saltó al campo (uids por línea, huecos incluidos), antes de
  // que applySuspensions vacíe los puestos de los expulsados. El resumen y la
  // táctica del gameover lo usan para mostrar al expulsado en su sitio.
  result.kickoff11 = serializeStarting11(state.starting11);
  // DT que dirigió este partido (snapshot para gameover, ranking y la Gaceta).
  result.manager = state.manager
    ? { id: state.manager.id, name: state.manager.name, nation: state.manager.nation, year: state.manager.year ?? null, rarity: state.manager.rarity, style: state.manager.style, mods: state.manager.mods }
    : null;
  // Debuts: titulares que no habían jugado ningún partido previo. Los nombres
  // alimentan la mención del DT en la Gaceta; sus uids quedan registrados.
  const starters = LINES.flatMap((line) => (state.starting11[line] || []).filter(Boolean));
  const played = new Set(state.playedUids || []);
  result.debuts = starters.filter((p) => !played.has(p.uid)).map((p) => p.name);
  state.playedUids = [...played, ...starters.map((p) => p.uid)];
  state.lastMatch = result;
  return result;
}

// Garantiza que el jugador (lado A) no pierda: convierte los últimos goles del
// rival en paradas de nuestro portero hasta empatar, y recalcula el marcador
// acumulado de cada evento para que la reproducción siga siendo coherente.
function forceAtLeastDraw(result) {
  let deficit = result.golesB - result.golesA;
  if (deficit <= 0) return result;
  const events = result.eventos;
  for (let i = events.length - 1; i >= 0 && deficit > 0; i--) {
    const ev = events[i];
    if (ev.side === 'B' && ev.type === 'gol') {
      ev.type = 'parada';
      // El patrón debe seguir a la fase: un penalti parado se presenta como
      // penalti, no como remate de jugada.
      ev.pattern = ev.phase === 'penalty' ? 'penalty' : ev.phase === 'free_kick' ? 'free_kick' : 'shot';
      deficit -= 1;
    }
  }
  let a = 0;
  let b = 0;
  for (const ev of events) {
    if (ev.type === 'gol') ev.side === 'A' ? (a += 1) : (b += 1);
    ev.scoreA = a;
    ev.scoreB = b;
  }
  result.golesA = a;
  result.golesB = b;
  return result;
}

// Vacía el hueco de un jugador en el once (en su sitio), si estaba alineado.
function clearLineupSlot(state, uid) {
  const line = LINES.find((L) => (state.starting11[L] || []).some((q) => q && q.uid === uid));
  if (!line) return;
  const arr = state.starting11[line];
  const idx = arr.findIndex((q) => q && q.uid === uid);
  if (idx >= 0) arr[idx] = null;
}

// Procesa las ausencias por tarjeta roja y por lesión: primero descuenta un
// partido a quien ya estaba sancionado o lesionado (cumplió la baja en este
// partido) y luego aplica las nuevas ausencias del partido recién jugado. El
// orden garantiza que el recién ausente se pierde exactamente los siguientes
// partidos. A los que estuvieran en el once se los envía al banquillo.
function applySuspensions(state) {
  for (const p of state.squad) {
    if (p.banMatches > 0) p.banMatches -= 1;
    if (p.injuryMatches > 0) p.injuryMatches -= 1;
  }
  const expulsados = state.lastMatch.expulsadosA || [];
  for (const { uid } of expulsados) {
    const player = state.squad.find((p) => p.uid === uid);
    if (!player) continue;
    player.banMatches = 1;
    clearLineupSlot(state, uid); // hueco del sancionado, en su sitio
  }
  // Lesiones: la simple (ban 0) solo retira en el partido, sigue disponible. Las
  // demás dejan al jugador de baja varios partidos y vacían su puesto del once.
  const lesionados = state.lastMatch.lesionadosA || [];
  for (const { uid, severity } of lesionados) {
    const ban = CONFIG.INJURY_BAN[severity] || 0;
    if (!ban) continue;
    const player = state.squad.find((p) => p.uid === uid);
    if (!player) continue;
    player.injuryMatches = ban;
    clearLineupSlot(state, uid);
  }
}

// Aplica el resultado: calcula recompensa, registra historia y avanza/termina.
export function applyResult(state) {
  const { golesA, golesB, eventos, forfeit } = state.lastMatch;
  applySuspensions(state);
  const meta = metaBonuses(state.items);
  let reward = rewardFor(golesA, golesB, meta.extraPlayerCard, meta.extraItemCard);
  let cls = classifyResult(golesA, golesB);
  // Cuatro rojas: el equipo pierde el partido pase lo que pase con el marcador.
  // Anula incluso la protección de nivel 1.
  if (forfeit === 'A') {
    cls = { result: 'loss', tier: 'derrota', diff: cls.diff };
    reward = { result: 'loss', tier: 'derrota', diff: cls.diff, playerPack: 0, itemPack: 0, rarityBias: null };
  } else if (forfeit === 'B' && cls.result !== 'win') {
    cls = { result: 'win', tier: 'ajustada', diff: 1 };
    reward = rewardFor(1, 0, meta.extraPlayerCard, meta.extraItemCard);
  }

  state.history.push({
    level: state.level,
    score: `${golesA}-${golesB}`,
    result: cls.result,
    opponent: `${state.opponent.name} ${state.opponent.year}`,
  });

  state.lastReward = reward;

  if (cls.result === 'loss') {
    state.lives -= 1;
    if (state.lives <= 0) {
      state.phase = 'gameover';
      return { ...reward, gameOver: true };
    }
    // Con vidas extra, se sobrevive sin recompensa y se repite escalón.
    state.phase = 'continue';
    return { ...reward, gameOver: false, survivedLoss: true };
  }

  state.phase = 'continue';
  return { ...reward, gameOver: false };
}

// Prepara el siguiente nivel: guarda el sesgo/tamaño de sobre de la recompensa.
export function advanceLevel(state) {
  const reward = state.lastReward;
  state.level += 1;
  state.pendingPlayerPack = reward && reward.playerPack ? reward.playerPack : CONFIG.PACK_EMPATE;
  state.pendingItemPack = reward && reward.itemPack ? reward.itemPack : CONFIG.ITEM_PACK_BASE;
  state.pendingBias = (reward && reward.rarityBias) || RARITY_BIAS.empate;
  // Sobre de DT en los niveles que toca (7, 14, 21…); el de nivel 1 se siembra en createRun.
  state.pendingManagerPack = isManagerPackLevel(state.level);
  state.lastMatch = null;
  state.opponent = null;
  state.phase = 'playerPack';
}

// Una vida extra reintenta el mismo escalón y conserva el rival ya estudiado.
export function retryLevel(state) {
  state.lastMatch = null;
  state.lastReward = null;
  state.phase = 'build';
}

// === Arranque de la run ===

export function createRun(opts = {}) {
  const seed = opts.seed ?? randomSeed();
  const rng = new RNG(seed);
  const roster = getPlayableRoster();
  const formation = opts.formation && FORMATIONS[opts.formation] ? opts.formation : CONFIG.STARTING_FORMATION;
  const livesMax = opts.lives ?? CONFIG.LIVES;

  // Identidad del equipo del jugador (nombre + bandera elegidos en el menú).
  const teamName = sanitizeTeamName(opts.teamName);
  const teamNation = opts.teamNation || null;
  const team = {
    name: teamName,
    nation: teamNation,
    color: teamNation ? flagAccentForNation(teamNation) : '#D4AF37',
  };

  const state = {
    runId: opts.runId || freshRunId(),
    seed,
    rng,
    team,
    level: 1,
    lives: livesMax,
    livesMax,
    formation,
    squad: [],
    roster,
    starting11: emptyStarting11(),
    items: [],
    // Director técnico activo (uno solo; se reemplaza al elegir otro en el sobre).
    manager: null,
    history: [],
    usedOpponentIds: [],
    // Titulares que ya han disputado un partido (para detectar debuts en la Gaceta).
    playedUids: [],
    // La run arranca presentando la plantilla generada; de ahí, a los sobres.
    phase: 'squadIntro',
    // Sobres del primer nivel: neutros.
    pendingPlayerPack: CONFIG.PACK_AJUSTADA,
    pendingItemPack: CONFIG.ITEM_PACK_BASE,
    // En el nivel 1 se entrega el primer sobre de DT (tras el de jugadores).
    pendingManagerPack: isManagerPackLevel(1),
    pendingBias: RARITY_BIAS.inicial,
    playerChoices: null,
    nationChoices: null,
    itemChoices: null,
    managerChoices: null,
    lastMatch: null,
    lastReward: null,
    opponent: null,
  };

  state.squad = generateStarterSquad(roster, formation, CONFIG, rng).map(instantiate);

  autoFillStarting11(state);

  return state;
}

// === Guardado y reanudación de la run ===
//
// El estado se serializa a un objeto JSON-able para localStorage (state/run.js
// no toca el almacenamiento; eso vive en main.js). El catálogo (roster) se
// regenera y los sobres (choices) se vuelven a sortear de forma determinista
// desde el RNG (Mulberry32, se guarda `seed` + `state`). En cambio el RIVAL y el
// PARTIDO sí se persisten: el rival consume RNG y muta usedOpponentIds al crearse
// (regenerarlo lo duplicaría) y las pantallas de resultado/gaceta/partido leen
// state.lastMatch/opponent directamente, no los recalculan.

export const SAVE_VERSION = 2;

// Once como uids por línea: al rehidratar se reenlazan a las instancias reales
// de la plantilla, restaurando las referencias compartidas que JSON rompe.
function serializeStarting11(starting11) {
  const out = {};
  for (const line of LINES) out[line] = (starting11[line] || []).map((p) => (p ? p.uid : null));
  return out;
}

export function serializeRun(state) {
  return {
    version: SAVE_VERSION,
    runId: state.runId,
    seed: state.seed,
    rngState: state.rng.state,
    team: state.team,
    level: state.level,
    lives: state.lives,
    livesMax: state.livesMax,
    formation: state.formation,
    squad: state.squad,
    items: state.items,
    manager: state.manager ?? null,
    history: state.history,
    usedOpponentIds: state.usedOpponentIds,
    playedUids: state.playedUids ?? [],
    starting11: serializeStarting11(state.starting11),
    phase: state.phase,
    pendingPlayerPack: state.pendingPlayerPack,
    pendingItemPack: state.pendingItemPack,
    pendingManagerPack: state.pendingManagerPack ?? false,
    pendingBias: state.pendingBias,
    pendingReward: state.pendingReward ?? null,
    // Rival y partido en curso: necesarios para retomar en scouting, partido,
    // resultado, gaceta y gameover (esas pantallas los leen, no los recalculan).
    opponent: state.opponent ?? null,
    lastMatch: state.lastMatch ?? null,
    lastReward: state.lastReward ?? null,
  };
}

// Reconstruye un `state` jugable desde el objeto serializado, o devuelve null si
// el save es incompatible o está corrupto (el llamador lo descarta).
export function rehydrateRun(data) {
  try {
    if (!data || data.version !== SAVE_VERSION) return null;
    if (!Array.isArray(data.squad) || typeof data.seed !== 'number') return null;

    const rng = new RNG(data.seed);
    rng.state = data.rngState | 0;

    const squad = data.squad;
    const byUid = new Map(squad.map((p) => [p.uid, p]));
    const starting11 = emptyStarting11();
    for (const line of LINES) {
      // Posicional: conserva los huecos (null) en su slotIndex al rehidratar.
      starting11[line] = (data.starting11?.[line] || [])
        .map((cardUid) => (cardUid != null && byUid.get(cardUid)) || null);
    }

    return {
      runId: data.runId || freshRunId(),
      seed: data.seed,
      rng,
      team: data.team,
      level: data.level,
      lives: data.lives,
      livesMax: data.livesMax,
      formation: data.formation,
      squad,
      roster: getPlayableRoster(),
      starting11,
      items: Array.isArray(data.items) ? data.items : [],
      manager: data.manager ?? null,
      history: Array.isArray(data.history) ? data.history : [],
      usedOpponentIds: Array.isArray(data.usedOpponentIds) ? data.usedOpponentIds : [],
      playedUids: Array.isArray(data.playedUids) ? data.playedUids : [],
      phase: data.phase,
      pendingPlayerPack: data.pendingPlayerPack,
      pendingItemPack: data.pendingItemPack,
      pendingManagerPack: data.pendingManagerPack ?? false,
      pendingBias: data.pendingBias,
      pendingReward: data.pendingReward ?? null,
      playerChoices: null,
      nationChoices: null,
      itemChoices: null,
      managerChoices: null,
      opponent: data.opponent ?? null,
      lastMatch: data.lastMatch ?? null,
      lastReward: data.lastReward ?? null,
    };
  } catch (_) {
    return null;
  }
}
