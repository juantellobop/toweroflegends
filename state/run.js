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
import { metaBonuses } from '../engine/items.js';
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

// Reparte primero cartas no poseídas y solo rellena con repetidas
// deshabilitadas cuando el pool nuevo no alcanza el tamaño del sobre.
export function drawPlayerPack(catalog, squad, size, weights, rng) {
  const ownedIds = new Set(squad.map((p) => p.id));
  if (CONFIG.ALLOW_DUPLICATE_PLAYERS || !CONFIG.PACK_GUARANTEE_SELECTABLE) {
    return drawByBand(catalog, size, weights, rng)
      .map((card) => ({ ...card, selectable: CONFIG.ALLOW_DUPLICATE_PLAYERS || !ownedIds.has(card.id) }));
  }
  const unowned = catalog.filter((p) => !ownedIds.has(p.id));
  const owned = catalog.filter((p) => ownedIds.has(p.id));
  const cards = drawByBand(unowned, Math.min(size, unowned.length), weights, rng);
  if (cards.length < size) {
    cards.push(...drawByBand(owned, Math.min(size - cards.length, owned.length), weights, rng));
  }
  return cards.map((card) => ({ ...card, selectable: !ownedIds.has(card.id) }));
}

// Sortea 11 cartas que cubren la formación tomando de TODO el roster. La banda
// de cada hueco se decide por pesos (≈80% < 70, 15% 70-90, 5% > 90), cayendo a
// bandas contiguas si la pedida se agota en esa posición.
export function generateStarterSquad(catalog, formation, config, rng) {
  const slots = formationSlots(formation);
  const weights = config.STARTER_BAND_WEIGHTS;
  const occupied = new Set();
  const squad = [];

  for (const line of LINES) {
    const byBand = groupByBand(catalog.filter((p) => p.position === line));
    for (let i = 0; i < slots[line]; i++) {
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

function starterLineFor(state, player) {
  return LINES.find((line) =>
    (state.starting11[line] || []).some((p) => p.uid === player.uid)
  );
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

export function canPlacePlayerInSlot(state, player, line, slotIndex = 0) {
  if (hasAlignedDuplicate(state, player)) return false;
  return Boolean(targetLineAfterPlacement(state, player, line, slotIndex));
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
  if (line !== 'FWD' || slots.FWD !== 3 || players.length !== 3) return players;
  const picked = players.slice();
  let centerIndex = 0;
  for (let i = 1; i < picked.length; i++) {
    const a = statFor(picked[i], 'shooting') * 0.8 + statFor(picked[i], 'physical') * 0.2;
    const b = statFor(picked[centerIndex], 'shooting') * 0.8 + statFor(picked[centerIndex], 'physical') * 0.2;
    if (a > b) centerIndex = i;
  }
  const [center] = picked.splice(centerIndex, 1);
  picked.sort((a, b) =>
    (statFor(b, 'dribbling') + statFor(b, 'pace')) - (statFor(a, 'dribbling') + statFor(a, 'pace'))
  );
  return [picked[0], center, picked[1]];
}

// Rellena automáticamente el once con los mejores de la plantilla por línea.
export function autoFillStarting11(state) {
  const slots = formationSlots(state.formation);
  const used = new Set();
  const eleven = emptyStarting11();
  for (const line of LINES) {
    const candidates = state.squad
      .filter((p) => p.position === line && !used.has(p.id))
      .sort((a, b) => playerOVR(b) - playerOVR(a));
    const selected = candidates.slice(0, slots[line]);
    for (const player of orderLineForFormation(line, selected, slots)) {
      eleven[line].push(player);
      used.add(player.id);
    }
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

  if (hasAlignedDuplicate(state, player)) return { placed: false, duplicate: true };

  const target = firstOpenSlotForPlayer(state, player);
  if (!target) return { placed: false, full: true };
  return placePlayerInLineup(state, player, target.line, target.slotIndex);
}

// Coloca un jugador en un slot concreto de su línea. Sirve para drag & drop:
// desde banquillo coloca/reemplaza; desde el campo reordena dentro de la línea.
export function placePlayerInLineup(state, player, line = player.position, slotIndex = 0) {
  if (!player || !LINES.includes(line)) {
    return { placed: false, invalidPosition: true };
  }
  const currentLine = starterLineFor(state, player);
  if (!currentLine && hasAlignedDuplicate(state, player)) return { placed: false, duplicate: true };

  const nextLine = targetLineAfterPlacement(state, player, line, slotIndex);
  if (!nextLine) return { placed: false, invalidPosition: true };

  if (currentLine && currentLine !== line) {
    const currentArr = state.starting11[currentLine];
    const sourceIndex = currentArr.findIndex((p) => p.uid === player.uid);
    if (sourceIndex >= 0) currentArr.splice(sourceIndex, 1);
  }

  state.starting11[line] = nextLine;
  return {
    placed: true,
    moved: currentLine === line,
    replaced: !currentLine && (state.starting11[line] || []).length >= formationSlots(state.formation)[line],
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
  return { byLine: computeChemistry(state.starting11), total: totalChemistry(state.starting11) };
}

// === Sobres ===

// Genera el sobre de jugador del nivel actual (cartas a elegir).
export function rollPlayerPack(state) {
  const meta = metaBonuses(state.items);
  const count = (state.pendingPlayerPack ?? CONFIG.PACK_EMPATE) + meta.extraPlayerCard;
  state.playerChoices = drawPlayerPack(state.roster || getPlayableRoster(), state.squad, count, CONFIG.PACK_BAND_WEIGHTS, state.rng);
  return state.playerChoices;
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
  if (!CONFIG.ALLOW_DUPLICATE_PLAYERS && state.squad.some((p) => p.id === template.id)) return null;
  const card = instantiate(template);
  state.squad.push(card);
  // Si hay hueco compatible, colócalo automáticamente.
  togglePlayerInLineup(state, card);
  state.playerChoices = null;
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
      ev.pattern = 'shot';
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

// Aplica el resultado: calcula recompensa, registra historia y avanza/termina.
export function applyResult(state) {
  const { golesA, golesB, eventos } = state.lastMatch;
  const meta = metaBonuses(state.items);
  const reward = rewardFor(golesA, golesB, meta.extraPlayerCard, meta.extraItemCard);
  const cls = classifyResult(golesA, golesB);

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
    phase: 'playerPack',
    // Sobres del primer nivel: neutros.
    pendingPlayerPack: CONFIG.PACK_AJUSTADA,
    pendingItemPack: CONFIG.ITEM_PACK_BASE,
    pendingBias: RARITY_BIAS.inicial,
    playerChoices: null,
    itemChoices: null,
    lastMatch: null,
    lastReward: null,
    opponent: null,
  };

  state.squad = generateStarterSquad(roster, formation, CONFIG, rng).map(instantiate);

  autoFillStarting11(state);

  return state;
}
