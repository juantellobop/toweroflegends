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
    { value: 'penalty', weight: 1.2 },
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
  const keeper = { name: def.gkName, rating: def.ratings.gk, weight: def.ratings.gk };
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
    terminal = rng.bernoulli(clamp(0.72 + (att.ratings.attack - def.ratings.gk) / 220, 0.55, 0.86))
      ? 'gol'
      : rng.bernoulli(0.75) ? 'parada' : 'tiro_fuera';
  } else {
    const midfieldEdge = phase === 'counter' ? 7 : phaseHint === 'high_press' ? -9 : 0;
    const buildP = clamp(
      ratio(att.ratings.midfield + midfieldEdge, def.ratings.midfield + def.ratings.defense * 0.18),
      0.14,
      0.88
    );

    if (phaseHint === 'high_press' || (phase !== 'corner' && phase !== 'free_kick' && !rng.bernoulli(buildP))) {
      terminal = failOutcome(rng, phaseHint);
    } else {
      const creationBonus = phase === 'counter' ? 8 : phase === 'corner' ? 3 : phase === 'free_kick' ? 1 : 0;
      const creationP = clamp(
        ratio(att.ratings.attack + att.ratings.midfield * 0.24 + creationBonus, def.ratings.defense + def.ratings.midfield * 0.12),
        0.18,
        0.9
      );

      if (phase !== 'free_kick' && !rng.bernoulli(creationP)) {
        terminal = defensiveOutcome(rng, phase);
        xg = terminal === 'bloqueo' ? 0.08 : 0;
      } else {
        const skillDelta = att.ratings.attack - def.ratings.defense;
        const shooterSkill = shooter.shooting || shooter.rating || att.ratings.attack;
        const quality = ratio(att.ratings.attack + shooterSkill * 0.25, def.ratings.defense + def.ratings.gk * 0.12);
        xg = clamp(
          0.11 + 0.27 * quality + skillDelta / 270 +
            (phase === 'counter' ? 0.06 : 0) +
            (phase === 'free_kick' ? -0.04 : 0) +
            (phase === 'corner' ? -0.02 : 0) +
            (rng.next() * 0.08 - 0.03),
          0.04,
          0.58
        );

        const onTargetP = clamp(
          0.48 + skillDelta / 185 + (phase === 'corner' ? -0.06 : 0) + (phase === 'free_kick' ? -0.04 : 0),
          0.24,
          0.78
        );
        if (!rng.bernoulli(onTargetP)) {
          terminal = 'tiro_fuera';
        } else if (rng.bernoulli(0.13 + Math.max(0, def.ratings.defense - att.ratings.attack) / 360)) {
          terminal = 'bloqueo';
        } else {
          const finishSkill = ratio(shooterSkill + att.ratings.attack * 0.15, def.ratings.gk + 4);
          const goalP = clamp(xg * (1.0 + finishSkill), 0.05, 0.64);
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
