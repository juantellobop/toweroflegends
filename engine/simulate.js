// Torre de Leyendas — Simulación del partido (§6.2, §6.3, §6.5).
// Modelo: reparte highlights por posesión y cada highlight se resuelve como
// un evento compacto. La presentación se apoya en escenas pixelart estáticas,
// no en una simulación continua de jugadores.

import { CONFIG, formationType, TYPE_COUNTER } from '../data/config.js';
import { buildBattleTeam } from './teamRatings.js';
import { matchStealBonus } from './items.js';
import { ratio, simulateHighlight } from './highlights.js';

export { ratio };

const clampRating = (v) => Math.max(1, Math.min(99, Math.round(v * 10) / 10));

// Ventaja de tipo táctico (counter piedra-papel-tijera): si el dibujo de un equipo
// cuenta el del rival, sube su ataque y su medio en TYPE_BONUS. Se aplica antes de
// repartir la posesión para que también pese ahí. Sin tipo conocido → sin efecto.
function applyTypeEdge(team, bonus) {
  team.ratings = {
    ...team.ratings,
    attack: clampRating(team.ratings.attack * (1 + bonus)),
    midfield: clampRating(team.ratings.midfield * (1 + bonus)),
  };
}

function applyTypeCounter(A, B) {
  const typeA = formationType(A.formation);
  const typeB = formationType(B.formation);
  if (!typeA || !typeB || typeA === typeB) return;
  if (TYPE_COUNTER[typeA] === typeB) applyTypeEdge(A, CONFIG.TYPE_BONUS);
  else if (TYPE_COUNTER[typeB] === typeA) applyTypeEdge(B, CONFIG.TYPE_BONUS);
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
  return slots.map((side, i) => ({
    minute: Math.max(1, Math.min(90, Math.round(((i + 1) / (total + 1)) * 90))),
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
  const att = side === 'A' ? A : B;
  const def = side === 'A' ? B : A;
  return simulateHighlight({ id, minute, side, att, def, score, rng, phaseHint });
}

// Simula el partido completo. teamA = jugador, teamB = rival.
// Devuelve { golesA, golesB, eventos, ratingsA, ratingsB }.
export function simularPartido(teamA, teamB, rng) {
  const A = buildBattleTeam(teamA);
  const B = buildBattleTeam(teamB);

  applyTypeCounter(A, B);

  const possessionA = ratio(A.ratings.midfield, B.ratings.midfield);
  const seqA = Math.round(CONFIG.BASE_SEQUENCES * possessionA);
  const seqB = CONFIG.BASE_SEQUENCES - seqA;

  const queue = interleaveOverTime(seqA, seqB, rng);
  const score = { A: 0, B: 0 };
  const events = [];
  let eventSeq = 0;

  const stealAgainstB = matchStealBonus(A.items); // A presiona → B pierde más
  const stealAgainstA = matchStealBonus(B.items);

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
    applyScore(event, score);
    events.push(event);

    if (event.type === 'perdida') {
      maybeCounter(minute, side === 'A' ? 'B' : 'A', A, B, score, events, rng, () => `hl_${++eventSeq}`);
    }
  }

  return {
    golesA: score.A,
    golesB: score.B,
    eventos: events.sort((a, b) => a.minute - b.minute || String(a.id).localeCompare(String(b.id))),
    ratingsA: A.ratings,
    ratingsB: B.ratings,
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
  applyScore(event, score);
  events.push(event);
}
