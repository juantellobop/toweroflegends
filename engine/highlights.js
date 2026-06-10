import { CONFIG } from '../data/config.js';
import { t } from '../data/i18n.js';

export const TERMINAL_TYPES = [
  'gol', 'parada', 'tiro_fuera', 'bloqueo', 'perdida',
  'pase_fuera', 'falta', 'fuera_juego', 'despeje', 'sin_remate',
];

export const PHASES = ['open_play', 'counter', 'corner', 'free_kick', 'penalty', 'throw_in'];

export function ratio(a, b, theta = CONFIG.THETA) {
  const A = Math.pow(Math.max(0.01, a), theta);
  const B = Math.pow(Math.max(0.01, b), theta);
  return A / (A + B);
}

export function weightedPick(items, rng) {
  const total = items.reduce((s, it) => s + Math.max(0, it.weight), 0);
  if (total <= 0) return items[0]?.value ?? items[0] ?? null;
  let r = rng.next() * total;
  for (const it of items) {
    r -= Math.max(0, it.weight);
    if (r <= 0) return it.value ?? it;
  }
  const last = items[items.length - 1];
  return last?.value ?? last ?? null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Duelo individual (Cambio 4): mezcla el rating de equipo con la stat del actor
// concreto. Con W_DUEL=0.3 el equipo manda (70%) pero el jugador "pelea" la jugada.
function blend(teamRating, actorStat) {
  const w = CONFIG.W_DUEL;
  return teamRating * (1 - w) + actorStat * w;
}

// Lee una stat de un actor con fallback (los rivales sintéticos no traen stats).
function statOf(actor, key, fallback) {
  const v = actor && actor[key];
  return Number.isFinite(v) ? v : fallback;
}

function nameOf(actor, fallback = t('narrator.player')) {
  return typeof actor === 'string' ? actor : actor?.name || fallback;
}

function actorFrom(pool, rng, fallback) {
  if (!pool || !pool.length) return { name: fallback, weight: 1, rating: 60, shooting: 60 };
  return weightedPick(pool.map((p) => ({ value: p, weight: p.weight || p.rating || 1 })), rng);
}

function shooterFrom(team, rng) {
  const pool = [
    ...(team.shooters || []).map((p) => ({ ...p, rating: p.shooting || p.weight || team.ratings.attack })),
    ...(team.attackers || []).map((p) => ({ ...p, shooting: p.shooting || p.rating || team.ratings.attack })),
  ];
  return actorFrom(pool, rng, `${team.name} ${t('narrator.player')}`);
}

function choosePhase(att, def, rng, phaseHint) {
  if (phaseHint === 'counter') return 'counter';
  if (phaseHint === 'high_press') return 'open_play';
  return weightedPick([
    { value: 'open_play', weight: 54 },
    { value: 'corner', weight: 8 + Math.max(0, att.ratings.attack - def.ratings.defense) * 0.08 },
    { value: 'free_kick', weight: 9 },
    { value: 'throw_in', weight: 7 },
    { value: 'penalty', weight: 1.0 },
  ], rng);
}

function failOutcome(rng, phaseHint) {
  if (phaseHint === 'high_press') {
    return weightedPick([
      { value: 'perdida', weight: 58 },
      { value: 'pase_fuera', weight: 16 },
      { value: 'falta', weight: 14 },
      { value: 'sin_remate', weight: 12 },
    ], rng);
  }
  return weightedPick([
    { value: 'perdida', weight: 28 },
    { value: 'pase_fuera', weight: 22 },
    { value: 'falta', weight: 15 },
    { value: 'sin_remate', weight: 35 },
  ], rng);
}

function defensiveOutcome(rng, phase) {
  return weightedPick([
    { value: 'bloqueo', weight: phase === 'free_kick' ? 18 : 24 },
    { value: 'despeje', weight: phase === 'corner' ? 40 : 25 },
    { value: 'fuera_juego', weight: phase === 'corner' || phase === 'free_kick' ? 5 : 14 },
    { value: 'falta', weight: 10 },
    { value: 'sin_remate', weight: phase === 'corner' ? 8 : 18 },
  ], rng);
}

function patternFor(type, phase, rng) {
  if (phase === 'penalty') return type === 'gol' ? 'penalty_goal' : 'penalty';
  if (phase === 'free_kick') return type === 'gol' ? 'free_kick_goal' : 'free_kick';
  if (type === 'gol' && phase === 'corner') return 'header_goal';
  if (type === 'gol') return rng.bernoulli(0.5) ? 'shot_goal' : 'shot_goal_alt';
  if (type === 'despeje' && phase === 'corner') return 'cross';
  if (type === 'despeje') return rng.bernoulli(0.55) ? 'goal_kick' : 'defensive_recovery';
  if (type === 'perdida') return 'defensive_recovery';
  if (type === 'pase_fuera') return rng.bernoulli(0.45) ? 'defensive_pass' : 'midfield_pass';
  if (type === 'falta') return rng.bernoulli(0.08) ? 'red_foul' : 'yellow_foul';
  if (type === 'fuera_juego' || type === 'sin_remate') return 'midfield_pass';
  if (type === 'bloqueo' || type === 'parada' || type === 'tiro_fuera') return 'shot';
  return 'midfield_pass';
}

function scoreAfter(score, side, terminal) {
  const addA = terminal === 'gol' && side === 'A' ? 1 : 0;
  const addB = terminal === 'gol' && side === 'B' ? 1 : 0;
  return { scoreA: score.A + addA, scoreB: score.B + addB };
}

// Devuelve un evento terminal compacto. La presentación se apoya en escenas
// pixelart, no en una simulación continua de jugadores.
export function simulateHighlight(ctx) {
  const { id, minute, side, att, def, score, rng, phaseHint } = ctx;
  const phase = choosePhase(att, def, rng, phaseHint);
  const keeperActor = def.keepers && def.keepers[0];
  const keeper = { name: def.gkName, rating: def.ratings.gk, weight: def.ratings.gk };
  // Mano a mano: reflejos mandan en el disparo, colocación en el ángulo/colocada.
  const keeperSkill = 0.6 * statOf(keeperActor, 'reflexes', def.ratings.gk) +
    0.4 * statOf(keeperActor, 'positioning', def.ratings.gk);
  const carrier = actorFrom([...(att.midfielders || []), ...(att.attackers || [])], rng, `${att.name} ${t('narrator.player')}`);
  const passer = actorFrom(att.assisters || att.midfielders || [], rng, nameOf(carrier));
  const receiver = actorFrom(att.attackers || att.shooters || [], rng, `${att.name} ${t('narrator.player')}`);
  const shooter = shooterFrom(att, rng);
  const defender = actorFrom([...(def.defenders || []), ...(def.midfielders || [])], rng, `${def.name} ${t('narrator.player')}`);

  const actors = {
    carrier: nameOf(carrier),
    passer: nameOf(passer),
    receiver: nameOf(receiver),
    shooter: nameOf(shooter),
    defender: nameOf(defender),
    keeper: keeper.name,
  };

  let terminal = null;
  let xg = 0;

  if (phase === 'penalty') {
    xg = 0.76;
    const effGk = blend(def.ratings.gk, keeperSkill);
    terminal = rng.bernoulli(clamp(0.72 + (att.ratings.attack - effGk) / 220, 0.55, 0.86))
      ? 'gol'
      : rng.bernoulli(0.75) ? 'parada' : 'tiro_fuera';
  } else {
    const midfieldEdge = phase === 'counter' ? 7 : phaseHint === 'high_press' ? -9 : 0;

    // Duelo de construcción: regate del que conduce + pase del enlace, contra el
    // corte y el físico del defensor que sale a presionar. Ambos lados son medias
    // ponderadas (misma escala): equipos iguales → 50%.
    const attBuildStat = 0.5 * statOf(carrier, 'dribbling', att.ratings.midfield) +
      0.5 * statOf(passer, 'passing', att.ratings.midfield);
    const defBuildStat = 0.5 * statOf(defender, 'defending', def.ratings.midfield) +
      0.5 * statOf(defender, 'physical', def.ratings.midfield);
    const buildP = clamp(
      ratio(
        blend(att.ratings.midfield, attBuildStat) + midfieldEdge,
        blend(0.82 * def.ratings.midfield + 0.18 * def.ratings.defense, defBuildStat)
      ),
      0.14,
      0.88
    );

    if (phaseHint === 'high_press' || (phase !== 'corner' && phase !== 'free_kick' && !rng.bernoulli(buildP))) {
      terminal = failOutcome(rng, phaseHint);
    } else {
      const creationBonus = phase === 'counter' ? 8 : phase === 'corner' ? 3 : phase === 'free_kick' ? 1 : 0;
      // Duelo de creación: pase filtrado del enlace + desmarque del rematador,
      // contra la marca y el repliegue (pace) del defensor.
      const attCreateStat = 0.5 * statOf(passer, 'passing', att.ratings.attack) +
        0.5 * statOf(receiver, 'pace', att.ratings.attack);
      const defCreateStat = 0.5 * statOf(defender, 'defending', def.ratings.defense) +
        0.5 * statOf(defender, 'pace', def.ratings.defense);
      const creationP = clamp(
        ratio(
          blend(0.76 * att.ratings.attack + 0.24 * att.ratings.midfield, attCreateStat) + creationBonus,
          blend(0.88 * def.ratings.defense + 0.12 * def.ratings.midfield, defCreateStat)
        ),
        0.18,
        0.9
      );

      if (phase !== 'free_kick' && !rng.bernoulli(creationP)) {
        terminal = defensiveOutcome(rng, phase);
        xg = terminal === 'bloqueo' ? 0.08 : 0;
      } else {
        const skillDelta = att.ratings.attack - def.ratings.defense;
        const shooterSkill = shooter.shooting || shooter.rating || att.ratings.attack;
        const quality = ratio(0.8 * att.ratings.attack + 0.2 * shooterSkill, 0.88 * def.ratings.defense + 0.12 * def.ratings.gk);
        xg = clamp(
          0.18 + 0.3 * quality + skillDelta / 270 +
            (phase === 'counter' ? 0.06 : 0) +
            (phase === 'free_kick' ? -0.04 : 0) +
            (phase === 'corner' ? -0.02 : 0) +
            (rng.next() * 0.08 - 0.03),
          0.05,
          0.62
        );

        const onTargetP = clamp(
          0.57 + skillDelta / 185 + (phase === 'corner' ? -0.06 : 0) + (phase === 'free_kick' ? -0.04 : 0),
          0.3,
          0.82
        );
        // Bloqueo: el defensor concreto se cruza (su defensa contra el disparo).
        const blockDef = blend(def.ratings.defense, statOf(defender, 'defending', def.ratings.defense));
        const blockAtt = blend(att.ratings.attack, shooterSkill);
        if (!rng.bernoulli(onTargetP)) {
          terminal = 'tiro_fuera';
        } else if (rng.bernoulli(0.13 + Math.max(0, blockDef - blockAtt) / 360)) {
          terminal = 'bloqueo';
        } else {
          // Mano a mano: rematador contra reflejos/colocación del portero concreto.
          const finishSkill = ratio(0.85 * shooterSkill + 0.15 * att.ratings.attack, blend(def.ratings.gk, keeperSkill) + 4);
          const goalP = clamp(xg * (1.0 + finishSkill), 0.05, 0.68);
          terminal = rng.bernoulli(goalP) ? 'gol' : 'parada';
        }
      }
    }
  }

  const scores = scoreAfter(score, side, terminal);
  const pattern = patternFor(terminal, phase, rng);
  return {
    id,
    minute,
    side,
    type: terminal,
    phase,
    pattern,
    attackerTeam: att.name,
    defenderTeam: def.name,
    actors,
    xg: Math.round(xg * 100) / 100,
    scoreA: scores.scoreA,
    scoreB: scores.scoreB,
    shooter: actors.shooter,
    assister: actors.passer,
    keeper: actors.keeper,
    defenderName: actors.defender,
    counter: phase === 'counter',
  };
}
