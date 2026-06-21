import { CONFIG } from '../data/config.js';
import { t } from '../data/i18n.js';
import { duelBonus, penaltyConvertBonus, phaseShooterMultiplier } from './traits.js';

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

// El rematador se elige según la fase: el Penalero pide el penalti y el
// Especialista se adueña del balón parado (peso por rasgo).
function shooterFrom(team, rng, phase) {
  const pool = [
    ...(team.shooters || []).map((p) => ({ ...p, rating: p.shooting || p.weight || team.ratings.attack })),
    ...(team.attackers || []).map((p) => ({ ...p, shooting: p.shooting || p.rating || team.ratings.attack })),
  ].map((p) => ({ ...p, weight: (p.weight || p.rating || 1) * phaseShooterMultiplier(p, phase) }));
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
    // "Pena máxima": el equipo provoca más penaltis a favor.
    { value: 'penalty', weight: 1.0 + (att.matchBonuses?.penaltyChance || 0) },
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
  // La tarjeta (amarilla/roja) la decide la simulación tras la falta (necesita
  // estado del partido para la doble amarilla); aquí se deja el patrón base.
  if (type === 'falta') return 'yellow_foul';
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
  // Desventaja del equipo atacante en este momento (0 = empate): activa al
  // Killer y los objetos de remontada.
  const deficit = side === 'A' ? score.B - score.A : score.A - score.B;
  // "Cerrojo final": la defensa con ese objeto crece en el tramo final.
  const lateDefense = minute >= 75 ? (def.matchBonuses?.lateDefense || 0) : 0;
  const defR = lateDefense ? { ...def.ratings, defense: def.ratings.defense + lateDefense } : def.ratings;
  const keeperActor = def.keepers && def.keepers[0];
  const keeper = { name: def.gkName, rating: defR.gk, weight: defR.gk };
  // Mano a mano: reflejos mandan en el disparo, colocación en el ángulo/colocada.
  const keeperSkill = 0.6 * statOf(keeperActor, 'reflexes', defR.gk) +
    0.4 * statOf(keeperActor, 'positioning', defR.gk);
  const carrier = actorFrom([...(att.midfielders || []), ...(att.attackers || [])], rng, `${att.name} ${t('narrator.player')}`);
  const passer = actorFrom(att.assisters || att.midfielders || [], rng, nameOf(carrier));
  const receiver = actorFrom(att.attackers || att.shooters || [], rng, `${att.name} ${t('narrator.player')}`);
  const shooter = shooterFrom(att, rng, phase);
  const defender = actorFrom([...(def.defenders || []), ...(def.midfielders || [])], rng, `${def.name} ${t('narrator.player')}`);
  // Rasgos condicionales en el duelo: el Garra defiende mejor al final;
  // Killer/Velocista/Especialista definen mejor en su situación.
  const defenderEdge = duelBonus(defender, { role: 'defender', phase, minute });
  const shooterEdge = duelBonus(shooter, { role: 'shooter', phase, minute, deficit });

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
    const effGk = blend(defR.gk, keeperSkill);
    // El Penalero y "Pena máxima" mejoran la conversión desde los once metros.
    const convertEdge = (att.matchBonuses?.penaltyConvert || 0) + penaltyConvertBonus(shooter);
    terminal = rng.bernoulli(clamp(0.72 + (att.ratings.attack - effGk) / 220 + convertEdge, 0.55, 0.9))
      ? 'gol'
      : rng.bernoulli(0.75) ? 'parada' : 'tiro_fuera';
  } else {
    const midfieldEdge = phase === 'counter' ? 7 : phaseHint === 'high_press' ? -9 : 0;

    // Duelo de construcción: regate del que conduce + pase del enlace, contra el
    // corte y el físico del defensor que sale a presionar. Ambos lados son medias
    // ponderadas (misma escala): equipos iguales → 50%.
    const attBuildStat = 0.5 * statOf(carrier, 'dribbling', att.ratings.midfield) +
      0.5 * statOf(passer, 'passing', att.ratings.midfield);
    const defBuildStat = 0.5 * statOf(defender, 'defending', defR.midfield) +
      0.5 * statOf(defender, 'physical', defR.midfield) + defenderEdge;
    const buildP = clamp(
      ratio(
        blend(att.ratings.midfield, attBuildStat) + midfieldEdge,
        blend(0.82 * defR.midfield + 0.18 * defR.defense, defBuildStat)
      ),
      0.14,
      0.88
    );

    if (phaseHint === 'high_press' || (phase !== 'corner' && phase !== 'free_kick' && !rng.bernoulli(buildP))) {
      terminal = failOutcome(rng, phaseHint);
    } else {
      // Objetos de jugada: "Contragolpe ensayado" potencia los contraataques y
      // "Pizarra a balón parado" los córners y tiros libres.
      const mb = att.matchBonuses || {};
      const creationBonus = phase === 'counter' ? 8 + (mb.counterBoost || 0)
        : phase === 'corner' ? 3 + (mb.setPieceBonus || 0)
        : phase === 'free_kick' ? 1 + (mb.setPieceBonus || 0)
        : 0;
      // Duelo de creación: pase filtrado del enlace + desmarque del rematador,
      // contra la marca y el repliegue (pace) del defensor.
      const attCreateStat = 0.5 * statOf(passer, 'passing', att.ratings.attack) +
        0.5 * statOf(receiver, 'pace', att.ratings.attack);
      const defCreateStat = 0.5 * statOf(defender, 'defending', defR.defense) +
        0.5 * statOf(defender, 'pace', defR.defense) + defenderEdge;
      const creationP = clamp(
        ratio(
          blend(0.76 * att.ratings.attack + 0.24 * att.ratings.midfield, attCreateStat) + creationBonus,
          blend(0.88 * defR.defense + 0.12 * defR.midfield, defCreateStat)
        ),
        0.18,
        0.9
      );

      if (phase !== 'free_kick' && !rng.bernoulli(creationP)) {
        terminal = defensiveOutcome(rng, phase);
        xg = terminal === 'bloqueo' ? 0.08 : 0;
      } else {
        const skillDelta = att.ratings.attack - defR.defense;
        const shooterSkill = (shooter.shooting || shooter.rating || att.ratings.attack) + shooterEdge;
        const quality = ratio(0.8 * att.ratings.attack + 0.2 * shooterSkill, 0.88 * defR.defense + 0.12 * defR.gk);
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
        const blockDef = blend(defR.defense, statOf(defender, 'defending', defR.defense) + defenderEdge);
        const blockAtt = blend(att.ratings.attack, shooterSkill);
        if (!rng.bernoulli(onTargetP)) {
          terminal = 'tiro_fuera';
        } else if (rng.bernoulli(0.13 + Math.max(0, blockDef - blockAtt) / 360)) {
          terminal = 'bloqueo';
        } else {
          // Mano a mano: rematador contra reflejos/colocación del portero concreto.
          const finishSkill = ratio(0.85 * shooterSkill + 0.15 * att.ratings.attack, blend(defR.gk, keeperSkill) + 4);
          const goalP = clamp(xg * (1.0 + finishSkill), 0.05, 0.68);
          terminal = rng.bernoulli(goalP) ? 'gol' : 'parada';
        }
      }
    }
  }

  // Infractor de la falta: se elige APARTE del defensor del duelo (que ya resolvió
  // la jugada) para no tocar el cálculo ni el balance. Pool ponderado por línea:
  // defensas y medios al peso completo de su rating, delanteros (replegando) muy
  // reducidos (FOUL_FWD_WEIGHT) y el portero testimonial (FOUL_GK_WEIGHT). Solo se
  // sortea cuando hay falta → no consume RNG en jugadas sin falta. Sincroniza el
  // nombre del defensor de la falta (narración) con el infractor real (tarjeta).
  let offender = null;
  if (terminal === 'falta') {
    const foulPool = [
      ...(def.defenders || []),
      ...(def.midfielders || []),
      ...(def.attackers || [])
        .filter((p) => p.position === 'FWD')
        .map((p) => ({ ...p, weight: (p.weight || p.rating || 1) * CONFIG.FOUL_FWD_WEIGHT })),
      ...(keeperActor
        ? [{ ...keeperActor, weight: (keeperActor.weight || keeperActor.rating || 1) * CONFIG.FOUL_GK_WEIGHT }]
        : []),
    ];
    const o = actorFrom(foulPool, rng, `${def.name} ${t('narrator.player')}`);
    actors.defender = nameOf(o); // la narración de la falta nombra al infractor
    offender = { name: nameOf(o), uid: o.uid ?? null, position: o.naturalPosition || 'DEF', rarity: o.rarity ?? null };
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
    // Infractor de la falta (el defensor que comete la entrada): el lado que
    // defiende es quien comete la falta. uid/posición permiten la tarjeta, la
    // sustitución y la sanción del jugador real (null en el rival sintético).
    offender,
    counter: phase === 'counter',
  };
}
