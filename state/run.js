// Torre de Leyendas — Estado de la run y máquina del bucle (§3, §5.4).
// Mantiene la plantilla, el once, los objetos y el nivel; genera sobres,
// simula el partido y avanza o termina la run según el resultado.

import {
  CONFIG, FORMATIONS, LINES, RARITY_BIAS,
  formationLineSlots, slotAcceptsPosition,
} from '../data/config.js';
import { getPlayableRoster } from '../data/adminPlayers.js';
import { ITEMS } from '../data/items.js';
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
  const remaining = (players || []).filter(Boolean);
  function fill(slot) {
    const idx = remaining.findIndex((player) => slot.accepts.includes(player.position));
    if (idx < 0) return;
    slot.player = remaining.splice(idx, 1)[0];
  }
  // En orden de hueco: cada slot toma el primer jugador compatible que quede. Así
  // se preserva el orden del array (p. ej. el 9 en el centro de un tridente, los
  // extremos a los lados aunque acepten MID o FWD).
  slots.forEach(fill);
  return slots;
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
    (state.starting11[line] || []).some((p) => p.uid === player.uid)
  );
}

// Un jugador con sanción pendiente (expulsado el partido anterior) no puede
// seleccionarse: cumple un partido en el banquillo antes de volver.
export function isSuspended(player) {
  return (player && player.banMatches > 0) || false;
}

function hasAlignedDuplicate(state, player) {
  return LINES.some((line) =>
    (state.starting11[line] || []).some((p) => p.id === player.id && p.uid !== player.uid)
  );
}

function targetLineAfterPlacement(state, player, line, slotIndex = 0) {
  if (!player || !LINES.includes(line)) return null;
  const cap = formationSlots(state.formation)[line] || 0;
  if (!cap) return null;

  const targetIndex = Math.max(0, Math.min(cap - 1, Number(slotIndex) || 0));
  if (!slotAcceptsPosition(state.formation, line, targetIndex, player.position)) return null;

  const arr = (state.starting11[line] || []).slice();
  const sourceIndex = arr.findIndex((p) => p.uid === player.uid);
  if (sourceIndex >= 0) arr.splice(sourceIndex, 1);

  if (arr.length < cap) {
    arr.splice(Math.min(targetIndex, arr.length), 0, player);
  } else {
    arr[targetIndex] = player;
  }

  return canAssignPlayersToLine(state.formation, line, arr) ? arr : null;
}

function firstOpenSlotForPlayer(state, player) {
  const preferredLines = [
    player.position,
    ...LINES.filter((line) => line !== player.position),
  ];

  for (const line of preferredLines) {
    const cap = formationSlots(state.formation)[line] || 0;
    const arr = state.starting11[line] || [];
    if (arr.length >= cap) continue;

    const candidates = formationLineSlots(state.formation, line)
      .filter((slot) => slot.accepts.includes(player.position))
      .map((slot) => slot.slotIndex);

    const targetIndexes = line === player.position
      ? [Math.min(arr.length, cap - 1), ...candidates]
      : candidates;

    for (const slotIndex of [...new Set(targetIndexes)]) {
      if (targetLineAfterPlacement(state, player, line, slotIndex)) {
        return { line, slotIndex };
      }
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
      const arr = state.starting11[line].slice();
      const ia = arr.findIndex((p) => p.uid === player.uid);
      const ib = arr.findIndex((p) => p.uid === occupant.uid);
      if (ia < 0 || ib < 0) return null;
      [arr[ia], arr[ib]] = [arr[ib], arr[ia]];
      if (!canAssignPlayersToLine(state.formation, line, arr)) return null;
      return { kind: 'swap', changes: { [line]: arr } };
    }
    const arrSrc = state.starting11[currentLine].slice();
    const arrDst = state.starting11[line].slice();
    const ia = arrSrc.findIndex((p) => p.uid === player.uid);
    const ib = arrDst.findIndex((p) => p.uid === occupant.uid);
    if (ia < 0 || ib < 0) return null;
    arrSrc[ia] = occupant;
    arrDst[ib] = player;
    if (!canAssignPlayersToLine(state.formation, currentLine, arrSrc)) return null;
    if (!canAssignPlayersToLine(state.formation, line, arrDst)) return null;
    return { kind: 'swap', changes: { [currentLine]: arrSrc, [line]: arrDst } };
  }

  // --- Hueco vacío, reordenar misma línea o sustitución desde el banco ---
  const wasFull = (state.starting11[line] || []).length >= cap;
  const nextLine = targetLineAfterPlacement(state, player, line, targetIndex);
  if (!nextLine) return null;
  const changes = { [line]: nextLine };
  if (currentLine && currentLine !== line) {
    const srcArr = state.starting11[currentLine].slice();
    const si = srcArr.findIndex((p) => p.uid === player.uid);
    if (si >= 0) srcArr.splice(si, 1);
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
      .filter((p) => slot.accepts.includes(p.position) && !used.has(p.id) && !isSuspended(p))
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
  const players = LINES.flatMap((line) => state.starting11[line] || []);
  return LINES.every((line) => (state.starting11[line] || []).length === slots[line]) &&
    LINES.every((line) => canAssignPlayersToLine(state.formation, line, state.starting11[line] || [])) &&
    new Set(players.map((p) => p.id)).size === players.length;
}

// Coloca/quita un jugador del once (toggle). Respeta la capacidad de la línea.
export function togglePlayerInLineup(state, player) {
  const currentLine = starterLineFor(state, player);
  if (currentLine) {
    const arr = state.starting11[currentLine];
    const idx = arr.findIndex((p) => p.uid === player.uid);
    arr.splice(idx, 1);
    return { placed: false };
  }

  if (isSuspended(player)) return { placed: false, suspended: true };
  if (hasAlignedDuplicate(state, player)) return { placed: false, duplicate: true };

  const target = firstOpenSlotForPlayer(state, player);
  if (!target) return { placed: false, full: true };
  return placePlayerInLineup(state, player, target.line, target.slotIndex);
}

// Coloca un jugador en un slot concreto de su línea. Sirve para drag & drop:
// desde banquillo coloca/reemplaza; desde el campo reordena dentro de la línea.
export function placePlayerInLineup(state, player, line = player.position, slotIndex = 0) {
  // Un sancionado que viene del banquillo no puede entrar a la táctica.
  if (isSuspended(player) && !starterLineFor(state, player)) {
    return { placed: false, suspended: true };
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
  return calcularRatings({ formation: state.formation, starting11: state.starting11, items: state.items });
}
export function liveChemistry(state) {
  // El total incluye la química de equipo aportada por reliquias (p. ej. el
  // Duodécimo jugador), redondeada por el decaimiento de copias repetidas.
  const total = totalChemistry(state.starting11, state.formation) + chemTeamBonus(state.items || []);
  return { byLine: computeChemistry(state.starting11, state.formation), total: Math.round(total) };
}

// Aporte neto de los objetos a cada rating de equipo (con objetos − sin objetos),
// para mostrar al jugador cómo le mejoran el equipo. Incluye ya el efecto del
// modificador de formación sobre el boost (es la mejora real en el número final).
export function liveItemDelta(state) {
  const withItems = liveRatings(state);
  const noItems = calcularRatings({ formation: state.formation, starting11: state.starting11, items: [] });
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
  const meta = metaBonuses(state.items);
  const count = (state.pendingPlayerPack ?? CONFIG.PACK_EMPATE) + meta.extraPlayerCard;
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
  const meta = metaBonuses(state.items);
  const count = (state.pendingItemPack ?? CONFIG.ITEM_PACK_BASE) + meta.extraItemCard;
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
    // Banquillo disponible para sustituir tras una expulsión (suplentes que no
    // están en el once y no están sancionados).
    bench: state.squad.filter((p) => !isStarter(state, p) && !isSuspended(p)),
  };
  const result = simularPartido(team, state.opponent, matchRng);
  // Regla oculta: el primer partido de la torre es imposible de perder; como
  // mínimo se empata. Del segundo en adelante se puede perder con normalidad.
  if (state.level === 1) forceAtLeastDraw(result);
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

// Procesa las sanciones por tarjeta roja: primero descuenta un partido a quien
// ya estaba sancionado (cumplió la pena en este partido) y luego sanciona a los
// expulsados de este partido. El orden garantiza que el recién expulsado se
// pierde exactamente el siguiente partido. A los expulsados que estuvieran en el
// once se los envía al banquillo.
function applySuspensions(state) {
  for (const p of state.squad) {
    if (p.banMatches > 0) p.banMatches -= 1;
  }
  const expulsados = state.lastMatch.expulsadosA || [];
  for (const { uid } of expulsados) {
    const player = state.squad.find((p) => p.uid === uid);
    if (!player) continue;
    player.banMatches = 1;
    const line = LINES.find((L) => (state.starting11[L] || []).some((q) => q.uid === uid));
    if (line) state.starting11[line] = state.starting11[line].filter((q) => q.uid !== uid);
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
    history: [],
    usedOpponentIds: [],
    // La run arranca presentando la plantilla generada; de ahí, a los sobres.
    phase: 'squadIntro',
    // Sobres del primer nivel: neutros.
    pendingPlayerPack: CONFIG.PACK_AJUSTADA,
    pendingItemPack: CONFIG.ITEM_PACK_BASE,
    pendingBias: RARITY_BIAS.inicial,
    playerChoices: null,
    nationChoices: null,
    itemChoices: null,
    lastMatch: null,
    lastReward: null,
    opponent: null,
  };

  state.squad = generateStarterSquad(roster, formation, CONFIG, rng).map(instantiate);

  autoFillStarting11(state);

  return state;
}
