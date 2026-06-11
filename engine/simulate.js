// Torre de Leyendas — Simulación del partido (§6.2, §6.3, §6.5).
// Modelo: reparte highlights por posesión y cada highlight se resuelve como
// un evento compacto. La presentación se apoya en escenas pixelart estáticas,
// no en una simulación continua de jugadores.

import { CONFIG } from '../data/config.js';
import { buildBattleTeam } from './teamRatings.js';
import { ratio, simulateHighlight } from './highlights.js';

export { ratio };

// Redondeo a décimas con piso de 1; sin techo: los ajustes en vivo (roja,
// remontada) no recortan a los equipos que superan 99.
const roundRating = (v) => Math.max(1, Math.round(v * 10) / 10);

// Tarjeta roja: el equipo que comete la falta roja juega en inferioridad el resto
// del partido (las jugadas se procesan en orden cronológico, así que mutar sus
// ratings afecta solo a las jugadas posteriores). Resta a defensa y medio.
function applyRedCard(team) {
  team.ratings = {
    ...team.ratings,
    defense: roundRating(team.ratings.defense * (1 - CONFIG.RED_CARD_PENALTY)),
    midfield: roundRating(team.ratings.midfield * (1 - CONFIG.RED_CARD_PENALTY)),
  };
}

// Empuje del que va por detrás: el equipo atacante que pierde se vuelca (sube su
// ataque y medio según los goles de desventaja, hasta 2). Modela "ir a por el
// partido"; se calcula por jugada con el marcador cronológico del momento.
function withComebackPush(att, score, side) {
  const deficit = side === 'A' ? score.B - score.A : score.A - score.B;
  if (deficit <= 0) return att;
  // "Remontada": el objeto amplifica el empuje por gol de desventaja.
  const pushPerGoal = CONFIG.COMEBACK_PUSH + (att.matchBonuses?.comebackBoost || 0);
  const push = Math.min(deficit, 2) * pushPerGoal;
  return {
    ...att,
    ratings: {
      ...att.ratings,
      attack: roundRating(att.ratings.attack * (1 + push)),
      midfield: roundRating(att.ratings.midfield * (1 + push)),
    },
  };
}

// Reparte seqA jugadas de "A" y seqB de "B" a lo largo de 90 minutos.
function interleaveOverTime(seqA, seqB, rng) {
  const slots = [];
  for (let i = 0; i < seqA; i++) slots.push('A');
  for (let i = 0; i < seqB; i++) slots.push('B');
  for (let i = slots.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [slots[i], slots[j]] = [slots[j], slots[i]];
  }
  const total = slots.length || 1;
  // La última jugada cae en el 90': los partidos pueden decidirse sobre la bocina.
  return slots.map((side, i) => ({
    minute: Math.max(1, Math.min(90, Math.round(((i + 1) / total) * 90))),
    side,
  }));
}

function applyScore(event, score) {
  if (event.type === 'gol') {
    if (event.side === 'A') score.A += 1;
    else score.B += 1;
  }
  event.scoreA = score.A;
  event.scoreB = score.B;
}

function makeHighlight({ id, minute, side, A, B, score, rng, phaseHint }) {
  const att = withComebackPush(side === 'A' ? A : B, score, side);
  const def = side === 'A' ? B : A;
  return simulateHighlight({ id, minute, side, att, def, score, rng, phaseHint });
}

// Contabiliza un evento: actualiza marcador, aplica tarjeta roja si la hubo
// (al equipo que defiende, que es quien comete la falta) y lo guarda.
function recordEvent(event, A, B, score, events) {
  applyScore(event, score);
  if (event.pattern === 'red_foul') applyRedCard(event.side === 'A' ? B : A);
  events.push(event);
}

// Simula el partido completo. teamA = jugador, teamB = rival.
// Devuelve { golesA, golesB, eventos, ratingsA, ratingsB }.
export function simularPartido(teamA, teamB, rng) {
  const A = buildBattleTeam(teamA);
  const B = buildBattleTeam(teamB);

  // Ratings de salida: lo que se devuelve al final. Una tarjeta roja muta
  // team.ratings durante el partido, pero el informe refleja el once inicial.
  const startRatingsA = A.ratings;
  const startRatingsB = B.ratings;

  const possessionA = ratio(A.ratings.midfield, B.ratings.midfield);
  const seqA = Math.round(CONFIG.BASE_SEQUENCES * possessionA);
  const seqB = CONFIG.BASE_SEQUENCES - seqA;

  const queue = interleaveOverTime(seqA, seqB, rng);
  const score = { A: 0, B: 0 };
  const events = [];
  let eventSeq = 0;

  // Robo por presión (incluye la sinergia táctica del equipo que presiona).
  const stealAgainstB = A.matchBonuses.stealChance; // A presiona → B pierde más
  const stealAgainstA = B.matchBonuses.stealChance;

  for (const { minute, side } of queue) {
    const steal = side === 'A' ? stealAgainstA : stealAgainstB;
    const phaseHint = steal > 0 && rng.bernoulli(steal) ? 'high_press' : null;
    const event = makeHighlight({
      id: `hl_${++eventSeq}`,
      minute,
      side,
      A,
      B,
      score,
      rng,
      phaseHint,
    });
    recordEvent(event, A, B, score, events);

    if (event.type === 'perdida') {
      maybeCounter(minute, side === 'A' ? 'B' : 'A', A, B, score, events, rng, () => `hl_${++eventSeq}`);
    }
  }

  // Desempate por número de secuencia: comparar ids como texto ordenaría
  // "hl_10" antes que "hl_9" y desordenaría los marcadores acumulados.
  const seqOf = (id) => parseInt(String(id).replace(/\D+/g, ''), 10) || 0;
  return {
    golesA: score.A,
    golesB: score.B,
    eventos: events.sort((a, b) => a.minute - b.minute || seqOf(a.id) - seqOf(b.id)),
    ratingsA: startRatingsA,
    ratingsB: startRatingsB,
  };
}

function maybeCounter(minute, side, A, B, score, events, rng, nextId) {
  if (!rng.bernoulli(CONFIG.COUNTER_CHANCE)) return;
  const event = makeHighlight({
    id: nextId(),
    minute: Math.min(90, minute + 1),
    side,
    A,
    B,
    score,
    rng,
    phaseHint: 'counter',
  });
  recordEvent(event, A, B, score, events);
}
