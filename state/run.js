// Torre de Leyendas — Estado de la run y máquina del bucle (§3, §5.4).
// Mantiene la plantilla, el once, los objetos y el nivel; genera sobres,
// simula el partido y avanza o termina la run según el resultado.

import {
  CONFIG, FORMATIONS, LINES, RARITIES, RARITY_BIAS, managerRarityBias,
  formationLineSlots, slotAcceptsPosition, LINE_CAPACITY, GRID_COLS, FORMATION_TYPE,
  FORMATION_TEMPLATES, templateSlots, MANAGER_STYLES, detectFormation, CUSTOM_FORMATION,
  isCorrupto, isSpecialRarity,
} from '../data/config.js';
import { getPlayableRoster, clonePlayer } from '../data/playableRoster.js';
import { ITEMS } from '../data/items.js';
import { MANAGERS } from '../data/managers.js';
import { RNG, randomSeed } from '../engine/rng.js';
import { generateOpponent } from '../data/opponents.js';
import { simularPartido } from '../engine/simulate.js';
import { calcularRatings, teamRadarStats } from '../engine/teamRatings.js';
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
// `exclude` (opcional) descarta cartas tras el sorteo de banda sin alterar el
// consumo de RNG (siempre un rollBand + un rng.pick), para no romper la
// reproducibilidad: lo usa el tope de leyendas del arranque.
function pickFromBand(byBand, weights, used, rng, exclude = null) {
  const band = rollBand(weights, rng);
  for (const b of BAND_FALLBACK[band]) {
    let available = byBand[b].filter((c) => !used.has(c.id));
    if (exclude) available = available.filter((c) => !exclude(c));
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
  // Las rarezas especiales (Corrupto/Shiny) nunca salen en los sobres normales:
  // el Corrupto solo llega vía el item y el Shiny vía su sobre de recompensa.
  const pool = catalog.filter((p) => !isSpecialRarity(p));
  if (CONFIG.ALLOW_DUPLICATE_PLAYERS || !CONFIG.PACK_GUARANTEE_SELECTABLE) {
    return drawByBand(pool, size, weights, rng)
      .map((card) => ({ ...card, selectable: CONFIG.ALLOW_DUPLICATE_PLAYERS || !owns(card) }));
  }
  const unowned = pool.filter((p) => !owns(p));
  const owned = pool.filter((p) => owns(p));
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
export function generateStarterSquad(catalog, formation, config, rng, maxLegends = config.STARTER_MAX_LEGENDS ?? 2) {
  // Conteos por posición natural de la plantilla (no la capacidad del grid): el
  // once de arranque sortea exactamente los 11 de la formación + suplentes.
  const slots = FORMATIONS[formation] || FORMATIONS[config.STARTING_FORMATION];
  const bench = config.STARTER_BENCH || {};
  const weights = config.STARTER_BAND_WEIGHTS;
  const occupied = new Set();
  const squad = [];
  let legendCount = 0;
  const noMoreLegends = (c) => c.rarity === 'legend';

  for (const line of LINES) {
    // Excluye las rarezas especiales (Corrupto/Shiny) de la plantilla de arranque.
    const byBand = groupByBand(catalog.filter((p) => p.position === line && !isSpecialRarity(p)));
    for (let i = 0; i < slots[line] + (bench[line] || 0); i++) {
      const exclude = legendCount >= maxLegends ? noMoreLegends : null;
      const picked = pickFromBand(byBand, weights, occupied, rng, exclude);
      if (!picked) throw new Error(`No hay jugadores suficientes para cubrir ${line}`);
      occupied.add(picked.id);
      if (picked.rarity === 'legend') legendCount++;
      squad.push(picked);
    }
  }

  if (squad.length !== config.STARTER_SQUAD_SIZE) {
    throw new Error(`Plantilla inicial inválida: ${squad.length} cartas`);
  }
  return squad;
}

// === Construcción del once ===

// Capacidad de huecos por línea del motor en el grid fijo (1-5-5-5-5): GK 1,
// DEF 5, MID 10 (MED 0-4 + ENG 5-9), FWD 5. No depende de la formación: la
// "formación" es solo una plantilla de relleno. La usan la colocación (cap por
// línea) y lineSlotArray.
export function formationSlots() {
  return LINE_CAPACITY;
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

// Cuenta los jugadores DISPONIBLES (no sancionados ni lesionados) por posición
// natural en toda la plantilla. Lo usa la inmunidad por línea de la simulación.
export function countAvailableByPosition(squad) {
  const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  for (const p of squad || []) {
    if (p && counts[p.position] != null && !isUnavailable(p)) counts[p.position] += 1;
  }
  return counts;
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
  // El Corrupto alineado está sellado: no se puede mover de su hueco.
  if (isCorrupto(player) && currentLine) return null;
  // Un suplente no puede entrar si ya hay otra copia suya alineada.
  if (!currentLine && hasAlignedDuplicate(state, player)) return null;

  const cap = formationSlots(state.formation)[line] || 0;
  if (!cap) return null;
  const targetIndex = Math.max(0, Math.min(cap - 1, Number(slotIndex) || 0));
  if (!slotAcceptsPosition(state.formation, line, targetIndex, player.position)) return null;

  const occupant = occupantAt(state, line, targetIndex);
  // Nadie puede desalojar al Corrupto de su hueco (ni por intercambio).
  if (occupant && isCorrupto(occupant)) return null;

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
  // Un suplente solo entra a un hueco VACÍO si aún caben titulares (≤ 11). Con el
  // grid hay 10 huecos vacíos visibles; sin este tope se podría pasar de 11.
  if (!currentLine && !occupant) {
    const total = LINES.reduce((n, l) => n + (state.starting11[l] || []).filter(Boolean).length, 0);
    if (total >= 11) return null;
  }
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
  // Suplente sobre un hueco ocupado: el titular de ese hueco vuelve al banco.
  else if (!currentLine && occupant) kind = 'replace';
  return { kind, changes };
}

export function canPlacePlayerInSlot(state, player, line, slotIndex = 0) {
  return Boolean(evaluatePlacement(state, player, line, slotIndex));
}

// Crea un once vacío con arrays de longitud fija del grid (GK 1, DEF 5, MID 10,
// FWD 5), llenos de null: el índice de cada hueco (slotIndex) es estable.
function emptyStarting11() {
  return {
    GK: new Array(LINE_CAPACITY.GK).fill(null),
    DEF: new Array(LINE_CAPACITY.DEF).fill(null),
    MID: new Array(LINE_CAPACITY.MID).fill(null),
    FWD: new Array(LINE_CAPACITY.FWD).fill(null),
  };
}

// Rellena el once desde la PLANTILLA de la formación elegida (qué celdas del grid
// ocupa), hueco a hueco con los mejores de la plantilla. Las celdas más
// restrictivas (una sola posición) eligen primero para no quedarse sin
// especialistas; los híbridos (ENG/DEL) toman después al mejor compatible. A igual
// OVR gana la posición natural de la fila. Deja el resto del grid vacío.
export function autoFillStarting11(state) {
  const used = new Set();
  const eleven = emptyStarting11();
  // Celdas de la plantilla, con su rol/accepts del grid (vía formationLineSlots).
  const cells = templateSlots(state.formation).map((cell) => {
    const slot = formationLineSlots(state.formation, cell.line)[cell.slotIndex];
    return { line: cell.line, slotIndex: cell.slotIndex, accepts: slot.accepts, gridRow: slot.gridRow };
  });
  // Los Corruptos (sellados) se FIJAN primero en una celda de su línea natural;
  // el relleno normal no puede tocar ni su jugador ni su hueco.
  const pinned = new Set();
  for (const corrupto of state.squad.filter(isCorrupto)) {
    const key = (c) => `${c.line}:${c.slotIndex}`;
    const cell = cells.find((c) => !pinned.has(key(c)) && c.line === corrupto.position && c.accepts.includes(corrupto.position))
      || cells.find((c) => !pinned.has(key(c)) && c.accepts.includes(corrupto.position));
    if (!cell) continue;
    eleven[cell.line][cell.slotIndex] = corrupto;
    used.add(corrupto.id);
    pinned.add(key(cell));
  }
  for (const cell of cells.slice().sort((a, b) => a.accepts.length - b.accepts.length)) {
    if (pinned.has(`${cell.line}:${cell.slotIndex}`)) continue;
    const player = state.squad
      .filter((p) => cell.accepts.includes(p.position) && !used.has(p.id) && !isUnavailable(p) && !isCorrupto(p))
      .sort((a, b) =>
        (playerOVR(b) - playerOVR(a)) ||
        ((b.position === cell.line ? 1 : 0) - (a.position === cell.line ? 1 : 0))
      )[0];
    if (!player) continue;
    used.add(player.id);
    eleven[cell.line][cell.slotIndex] = player;
  }
  state.starting11 = eleven;
}

// ¿Es válida la alineación? Regla del grid libre: exactamente 1 portero y AL
// MENOS 1 defensa, 11 jugadores en total, sin duplicados, y cada línea asignable
// a sus huecos (respeta accepts). El resto del campo es libre (0-5 por fila).
export function isLineupComplete(state) {
  const filled = (line) => (state.starting11[line] || []).filter(Boolean);
  const players = LINES.flatMap(filled);
  return filled('GK').length === 1 &&
    filled('DEF').length >= 1 &&
    players.length === 11 &&
    new Set(players.map((p) => p.id)).size === players.length &&
    LINES.every((line) => canAssignPlayersToLine(state.formation, line, state.starting11[line] || []));
}

// Coloca/quita un jugador del once (toggle). Respeta la capacidad de la línea.
export function togglePlayerInLineup(state, player) {
  // El Corrupto está sellado en el once: ni se quita ni se mueve.
  if (isCorrupto(player)) return { placed: false, sealed: true };
  const currentLine = starterLineFor(state, player);
  if (currentLine) {
    const arr = state.starting11[currentLine];
    const idx = arr.findIndex((p) => p && p.uid === player.uid);
    // Hueco en su sitio: lo dejamos vacío (null) sin recolocar al resto.
    if (idx >= 0) arr[idx] = null;
    state.formation = detectFormation(state.starting11);
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
  // El dibujo puede haberse deformado: re-etiqueta (plantilla coincidente o
  // "Personalizada" si ya no encaja con ninguna).
  state.formation = detectFormation(state.starting11);
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

// Aplica una plantilla: rellena el grid con la formación elegida y fija su estilo
// por defecto (que el usuario puede cambiar luego con setStyle). La "formación"
// queda como etiqueta; el grid se puede deformar libremente después.
export function setFormation(state, formation) {
  if (!FORMATIONS[formation]) return;
  state.formation = formation;
  state.style = FORMATION_TYPE[formation] || state.style || 'posesion';
  autoFillStarting11(state);
}

// Cambia el estilo táctico (Posesión/Presión/Contra), elección libre del usuario
// independiente de la formación. Alimenta las sinergias de química, objetos y DT.
export function setStyle(state, style) {
  if (!MANAGER_STYLES.includes(style)) return;
  state.style = style;
}

// === Ratings y química en vivo (para la pantalla de armar equipo) ===

export function liveRatings(state) {
  return calcularRatings({ formation: state.formation, style: state.style, starting11: state.starting11, items: state.items, manager: state.manager });
}
// Estadísticas del radar de equipo (5 ejes: ataque/medio/defensa/portería/físico).
export function liveRadar(state) {
  return teamRadarStats({ formation: state.formation, style: state.style, starting11: state.starting11, items: state.items, manager: state.manager });
}
export function liveChemistry(state) {
  // El total incluye la química de equipo aportada por reliquias (p. ej. el
  // Duodécimo jugador), redondeada por el decaimiento de copias repetidas.
  const total = totalChemistry(state.starting11, state.style, state.manager) + chemTeamBonus(state.items || []);
  return { byLine: computeChemistry(state.starting11, null, state.manager), total: Math.round(total) };
}

// Aporte neto de los objetos a cada rating de equipo (con objetos − sin objetos),
// para mostrar al jugador cómo le mejoran el equipo. Incluye ya el efecto del
// modificador de formación sobre el boost (es la mejora real en el número final).
export function liveItemDelta(state) {
  const withItems = liveRatings(state);
  // El DT entra en ambas ramas → su efecto se cancela y el delta aísla los objetos.
  const noItems = calcularRatings({ formation: state.formation, style: state.style, starting11: state.starting11, items: [], manager: state.manager });
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
    // Las rarezas especiales (Corrupto/Shiny) no entran en el sobre de selecciones.
    if (isSpecialRarity(player)) continue;
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

// ¿Toca ofrecer GARANTIZADO el item "Representante corrupto" en este nivel?
// Primera vez en CORRUPTO_ITEM_FIRST (14) y luego cada CORRUPTO_ITEM_EVERY (28):
// 14, 42, 70, 98… Nunca sale al azar fuera de estos niveles.
export function isCorruptoItemLevel(level) {
  const first = CONFIG.CORRUPTO_ITEM_FIRST;
  const every = CONFIG.CORRUPTO_ITEM_EVERY;
  return level >= first && (level - first) % every === 0;
}

// Genera el sobre de objeto del nivel actual.
export function rollItemPack(state) {
  // Los extras de reliquias ya están incluidos en pendingItemPack (los aplica
  // rewardFor al calcular la recompensa); aquí no se vuelven a sumar.
  const count = state.pendingItemPack ?? CONFIG.ITEM_PACK_BASE;
  const bias = state.pendingBias || RARITY_BIAS.inicial;
  // El item especial (special) nunca entra en el pool aleatorio de objetos.
  const pool = ITEMS.filter((it) => !it.special);
  // Garantizado cada CORRUPTO_ITEM_EVERY niveles, salvo que ya tengas un Corrupto
  // activo (no se acumulan dos a la vez) o que ya no queden corruptos por entregar
  // (todos usados): en esos casos, sobre de objetos normal.
  if (isCorruptoItemLevel(state.level) && !state.squad.some(isCorrupto) && availableCorruptos(state).length) {
    const corruptoItem = ITEMS.find((it) => it.special === 'corrupto');
    const rest = drawCards(pool, Math.max(0, count - 1), bias, state.rng);
    state.itemChoices = corruptoItem ? [corruptoItem, ...rest] : rest;
  } else {
    state.itemChoices = drawCards(pool, count, bias, state.rng);
  }
  return state.itemChoices;
}

// El jugador elige una carta de jugador del sobre.
export function choosePlayerCard(state, template) {
  if (!template || template.selectable === false) return null;
  if (!CONFIG.ALLOW_DUPLICATE_PLAYERS && state.squad.some((p) => dupKey(p) === dupKey(template))) return null;
  const card = instantiate(template);
  state.squad.push(card);
  // La carta nueva entra siempre al banquillo: nunca se auto-titulariza (ni
  // siquiera para cubrir el hueco que dejó un expulsado o lesionado). Si se
  // quiere alinear, se arrastra a mano en el tablero táctico.
  state.playerChoices = null;
  state.nationChoices = null;
  return card;
}

// Descarta el sobre de jugador (normal o de selecciones) sin llevarse ninguna
// carta: cierra el sobre y continúa el bucle.
export function discardPlayerPack(state) {
  state.playerChoices = null;
  state.nationChoices = null;
}

// El jugador elige un objeto del sobre.
export function chooseItemCard(state, template) {
  const item = { ...template, uid: freshId(template.id) };
  state.items.push(item);
  state.itemChoices = null;
  return item;
}

// Descarta el sobre de objeto sin llevarse ninguno: cierra el sobre y continúa.
export function discardItemPack(state) {
  state.itemChoices = null;
}

// === Sobre Corrupto (item "Representante corrupto") ===

// Corruptos del roster que se pueden entregar AÚN: rareza corrupto, que no tengas
// en plantilla y que NO se hayan entregado ya en esta run. Cada Corrupto entra una
// sola vez: una vez elegido queda registrado en state.usedCorruptoIds y nunca
// vuelve a salir, ni siquiera tras venderlo.
export function availableCorruptos(state) {
  const ownedKeys = ownedKeySet(state.squad);
  const used = new Set(state.usedCorruptoIds || []);
  return (state.roster || getPlayableRoster())
    .filter((p) => isCorrupto(p) && !ownedKeys.has(dupKey(p)) && !used.has(dupKey(p)));
}

// Sortea UN jugador de rareza Corrupto disponible al azar. Devuelve [card] (una
// sola carta; no hay elección múltiple), o [] si no quedan corruptos por entregar.
export function rollCorruptoPack(state) {
  const pool = availableCorruptos(state);
  state.corruptoChoices = pool.length ? [{ ...state.rng.pick(pool), selectable: true }] : [];
  return state.corruptoChoices;
}

// Añade el Corrupto elegido a la plantilla y lo ubica SELLADO en su posición
// natural (no se podrá retirar). Arranca su contador de partidos en 0 y lo marca
// como entregado para que NO pueda volver a salir en esta run.
export function chooseCorruptoCard(state, template) {
  if (!template) return null;
  const card = { ...instantiate(template), corruptoMatches: 0 };
  delete card.selectable;
  state.squad.push(card);
  (state.usedCorruptoIds || (state.usedCorruptoIds = [])).push(dupKey(card));
  forcePlaceSealed(state, card);
  state.corruptoChoices = null;
  return card;
}

// Coloca al Corrupto (sellado) en un hueco de su LÍNEA natural y garantiza que
// entra al once. Con el once lleno (11), ocupa el hueco del titular más flojo de
// su línea, que pasa al banquillo; si su línea no tiene a nadie de su posición,
// libera al titular global más flojo. Con menos de 11, ocupa un hueco vacío.
function forcePlaceSealed(state, player) {
  const line = player.position;
  const slots = formationLineSlots(state.formation, line).filter((s) => s.accepts.includes(player.position));
  if (!slots.length) return;
  const arr = lineSlotArray(state, line);
  const occupied = slots.filter((s) => arr[s.slotIndex]);
  const total = LINES.reduce((n, l) => n + (state.starting11[l] || []).filter(Boolean).length, 0);

  let target;
  if (total >= 11) {
    if (occupied.length) {
      target = occupied.sort((a, b) => playerOVR(arr[a.slotIndex]) - playerOVR(arr[b.slotIndex]))[0];
    } else {
      // Su línea no tiene titulares de su posición: deja sitio liberando al
      // titular global más flojo (de otra línea) y ocupa un hueco vacío.
      const weakest = LINES.flatMap((l) => (state.starting11[l] || []).filter(Boolean).map((p) => ({ l, p })))
        .filter(({ p }) => !isCorrupto(p))
        .sort((a, b) => playerOVR(a.p) - playerOVR(b.p))[0];
      if (weakest) clearLineupSlot(state, weakest.p.uid);
      target = slots.find((s) => !arr[s.slotIndex]) || slots[0];
    }
  } else {
    target = slots.find((s) => !arr[s.slotIndex]) || occupied[0] || slots[0];
  }
  if (!target) return;
  arr[target.slotIndex] = player;
  state.starting11[line] = arr;
  state.formation = detectFormation(state.starting11);
}

// === Sobre Shiny (recompensa por vender al Corrupto) ===

// El mejor jugador NO poseído de cada nación de SHINY_NATIONS, clonado como Shiny
// con +CORRUPTO_SHINY_BOOST a TODAS sus stats. Omite naciones sin candidato libre
// (devuelve ≤ SHINY_NATIONS.length cartas).
export function rollShinyPack(state) {
  const ownedKeys = ownedKeySet(state.squad);
  const roster = state.roster || getPlayableRoster();
  const boost = CONFIG.CORRUPTO_SHINY_BOOST;
  const choices = [];
  for (const nation of CONFIG.SHINY_NATIONS) {
    const best = roster
      .filter((p) => p.nation === nation && !isSpecialRarity(p) && !ownedKeys.has(dupKey(p)))
      .sort((a, b) => playerOVR(b) - playerOVR(a))[0];
    if (!best) continue;
    const shiny = clonePlayer(best);
    shiny.rarity = 'shiny';
    if (shiny.stats) for (const k in shiny.stats) shiny.stats[k] += boost;
    if (shiny.gk) for (const k in shiny.gk) shiny.gk[k] += boost;
    // Recalcula el OVR base desde las stats ya potenciadas: el jugador del roster
    // arrastra un `ovr` heredado (p. ej. 98) que NO refleja el +10. Sin esto, los
    // consumidores que leen player.ovr directamente (displayOVR del tablero, y la
    // rama de respaldo de playerOVR) mostrarían el valor viejo —y con un DT
    // connacional darían 98+3=101 en vez de 108+3=111—.
    shiny.ovr = playerOVR(shiny);
    shiny.selectable = true;
    choices.push(shiny);
  }
  state.shinyChoices = choices;
  return choices;
}

// El jugador elige un Shiny del sobre: entra a la plantilla (al banquillo, como un
// fichaje normal). Cierra siempre la venta del Corrupto (lo retira de la plantilla),
// incluso si no se elige carta (sobre vacío).
export function chooseShinyCard(state, template) {
  const card = template ? instantiate(template) : null;
  if (card) state.squad.push(card);
  state.shinyChoices = null;
  finalizeCorruptoSale(state);
  return card;
}

// Retira de la plantilla al Corrupto vendido y cierra la venta pendiente.
function finalizeCorruptoSale(state) {
  const uid = state.pendingShinySale?.soldUid;
  if (uid) state.squad = state.squad.filter((p) => p.uid !== uid);
  state.pendingShinySale = null;
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
  const { extraManagerCard } = metaBonuses(state.items);
  const size = CONFIG.MANAGER_PACK_SIZE + extraManagerCard;
  const chosen = drawCards(pool, size, bias, state.rng);
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
    style: state.style,
    starting11: state.starting11,
    items: state.items,
    // Director técnico activo: sus modificadores entran en calcularRatings y, con
    // ello, en la simulación; también aporta química a sus connacionales.
    manager: state.manager,
    // Banquillo disponible para sustituir tras una expulsión o lesión (suplentes
    // que no están en el once y están disponibles).
    bench: state.squad.filter((p) => !isStarter(state, p) && !isUnavailable(p)),
    // Disponibles por posición en toda la plantilla: base de la inmunidad por
    // línea (GK/DEF/MID/FWD) frente a lesiones y expulsiones durante el partido.
    squadAvail: countAvailableByPosition(state.squad),
  };
  const result = simularPartido(team, state.opponent, matchRng);
  // Regla oculta: los primeros cinco partidos de la torre son imposibles de
  // perder; como mínimo se empata. Del sexto en adelante se puede perder con
  // normalidad.
  if (state.level <= 5) forceAtLeastDraw(result);
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
  // Anula incluso la protección de los niveles 1-4.
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

  // Avance de nivel (victoria o empate): cuenta un partido para el Corrupto.
  maybeAdvanceCorrupto(state);

  state.phase = 'continue';
  return { ...reward, gameOver: false };
}

// Cuenta un partido superado (avance de nivel) para el Corrupto activo. Tras
// CONFIG.CORRUPTO_SELL_MATCHES avances se vende: queda pendiente el sobre Shiny y
// se vacía su hueco del once (sigue en plantilla hasta que se resuelve el sobre,
// para que el resumen del último partido lo muestre en su sitio).
function maybeAdvanceCorrupto(state) {
  const corrupto = state.squad.find(isCorrupto);
  if (!corrupto) return;
  corrupto.corruptoMatches = (corrupto.corruptoMatches || 0) + 1;
  if (corrupto.corruptoMatches < CONFIG.CORRUPTO_SELL_MATCHES) return;
  state.pendingShinySale = { soldName: corrupto.name, soldUid: corrupto.uid };
  clearLineupSlot(state, corrupto.uid);
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
    // Estilo táctico inicial: el del dibujo de arranque; el usuario lo cambia libre.
    style: FORMATION_TYPE[formation] || 'posesion',
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
    corruptoChoices: null,
    shinyChoices: null,
    // Venta del Corrupto pendiente de abrir el sobre Shiny: { soldName, soldUid }.
    pendingShinySale: null,
    // Corruptos ya entregados en la run (dupKey): no se repiten aunque se vendan.
    usedCorruptoIds: [],
    lastMatch: null,
    lastReward: null,
    opponent: null,
  };

  // Carry-over ("Volver a jugar"): un jugador de la run anterior entra en la nueva
  // plantilla. Si es leyenda, recorta el cupo del sorteo para no pasar de 2 en total.
  const carriedLegend = opts.carryoverPlayer?.rarity === 'legend' ? 1 : 0;
  const legendCap = Math.max(0, (CONFIG.STARTER_MAX_LEGENDS ?? 2) - carriedLegend);
  state.squad = generateStarterSquad(roster, formation, CONFIG, rng, legendCap).map(instantiate);

  if (opts.carryoverPlayer) {
    const base = roster.find((p) => p.id === opts.carryoverPlayer.id) || opts.carryoverPlayer;
    const key = dupKey(base);
    // Quita cualquier carta del mismo grupo que haya salido en el sorteo (evita
    // duplicar a la misma persona) y añade el arrastrado con stats base limpias.
    state.squad = state.squad.filter((p) => dupKey(p) !== key);
    state.squad.push(instantiate(base));
  }

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

// v3: grid fijo (1-5-5-5-5) — starting11 con arrays de longitud de grid + estilo.
export const SAVE_VERSION = 3;

// Once como uids por línea: al rehidratar se reenlazan a las instancias reales
// de la plantilla, restaurando las referencias compartidas que JSON rompe.
function serializeStarting11(starting11) {
  const out = {};
  for (const line of LINES) out[line] = (starting11[line] || []).map((p) => (p ? p.uid : null));
  return out;
}

// Migra el once de un save v2 (líneas de longitud variable, MED+ENG mezclados en
// MID) al grid v3. Conserva el conjunto de titulares elegido, recolocándolo por
// columnas de la plantilla: GK/DEF/DEL directos; el MID viejo se reparte primero a
// las columnas MED y luego a las ENG. Si la disposición no es asignable (saves
// raros), el llamador cae a autoFill.
function migrateStarting11V2(rawStarting11, byUid, formation) {
  const tmpl = FORMATION_TEMPLATES[formation] || FORMATION_TEMPLATES[CONFIG.STARTING_FORMATION];
  const eleven = emptyStarting11();
  const toPlayers = (line) => (rawStarting11?.[line] || [])
    .map((uid) => (uid != null && byUid.get(uid)) || null)
    .filter(Boolean);
  const gk = toPlayers('GK');
  if (gk[0]) eleven.GK[0] = gk[0];
  toPlayers('DEF').forEach((p, i) => { if (tmpl.DEF[i] != null) eleven.DEF[tmpl.DEF[i]] = p; });
  toPlayers('FWD').forEach((p, i) => { if (tmpl.DEL[i] != null) eleven.FWD[tmpl.DEL[i]] = p; });
  const midTargets = [...tmpl.MED, ...tmpl.ENG.map((c) => c + GRID_COLS)];
  toPlayers('MID').forEach((p, i) => { if (midTargets[i] != null) eleven.MID[midTargets[i]] = p; });
  return eleven;
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
    style: state.style ?? null,
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
    // Venta del Corrupto pendiente del sobre Shiny (los sobres se regeneran solos).
    pendingShinySale: state.pendingShinySale ?? null,
    // Corruptos ya entregados: persisten para que no se repitan en la run.
    usedCorruptoIds: state.usedCorruptoIds ?? [],
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
    // Acepta el formato actual (v3) y migra el anterior (v2) para no romper runs
    // en curso al actualizar al grid fijo.
    if (!data || (data.version !== 3 && data.version !== 2)) return null;
    if (!Array.isArray(data.squad) || typeof data.seed !== 'number') return null;

    const rng = new RNG(data.seed);
    rng.state = data.rngState | 0;

    const squad = data.squad;
    const byUid = new Map(squad.map((p) => [p.uid, p]));
    // Formación de base para la migración/estilo (siempre una plantilla válida).
    const baseFormation = FORMATIONS[data.formation] ? data.formation : CONFIG.STARTING_FORMATION;
    let starting11;
    if (data.version === 3) {
      // Posicional: conserva los huecos (null) en su slotIndex del grid.
      starting11 = emptyStarting11();
      for (const line of LINES) {
        (data.starting11?.[line] || []).forEach((cardUid, i) => {
          if (i < starting11[line].length && cardUid != null) starting11[line][i] = byUid.get(cardUid) || null;
        });
      }
    } else {
      // v2 → grid: reubica el once viejo; si la disposición no es asignable, autoFill.
      starting11 = migrateStarting11V2(data.starting11, byUid, baseFormation);
      const assignable = LINES.every((line) => canAssignPlayersToLine(baseFormation, line, starting11[line]));
      if (!assignable) {
        const tmp = { formation: baseFormation, squad, starting11: emptyStarting11() };
        autoFillStarting11(tmp);
        starting11 = tmp.starting11;
      }
    }
    // La etiqueta real sale del dibujo: plantilla coincidente o "Personalizada".
    const formation = detectFormation(starting11);
    const style = data.style || FORMATION_TYPE[baseFormation] || 'posesion';

    return {
      runId: data.runId || freshRunId(),
      seed: data.seed,
      rng,
      team: data.team,
      level: data.level,
      lives: data.lives,
      livesMax: data.livesMax,
      formation,
      style,
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
      pendingShinySale: data.pendingShinySale ?? null,
      usedCorruptoIds: Array.isArray(data.usedCorruptoIds) ? data.usedCorruptoIds : [],
      playerChoices: null,
      nationChoices: null,
      itemChoices: null,
      managerChoices: null,
      corruptoChoices: null,
      shinyChoices: null,
      opponent: data.opponent ?? null,
      lastMatch: data.lastMatch ?? null,
      lastReward: data.lastReward ?? null,
    };
  } catch (_) {
    return null;
  }
}
