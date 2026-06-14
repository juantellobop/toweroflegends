// Torre de Leyendas — Simulación del partido (§6.2, §6.3, §6.5).
// Modelo: reparte highlights por posesión y cada highlight se resuelve como
// un evento compacto. La presentación se apoya en escenas pixelart estáticas,
// no en una simulación continua de jugadores.

import { CONFIG } from '../data/config.js';
import { buildBattleTeam } from './teamRatings.js';
import { ratio, simulateHighlight } from './highlights.js';
import { createCardTracker, resolveFoul } from './cards.js';
import { playerOVR } from './ovr.js';

export { ratio };

// Redondeo a décimas con piso de 1; sin techo: los ajustes en vivo (roja,
// remontada) no recortan a los equipos que superan 99.
const roundRating = (v) => Math.max(1, Math.round(v * 10) / 10);

const LINES = ['GK', 'DEF', 'MID', 'FWD'];

function cloneLineup(s11) {
  const out = {};
  for (const line of LINES) out[line] = (s11[line] || []).slice();
  return out;
}

// Reorganiza la alineación del equipo del jugador tras una expulsión (el rival
// sintético no tiene once y no pasa por aquí):
//  - se quita al expulsado de la táctica (ese lugar queda vacío);
//  - si era DEF o ARQ, entra desde el banquillo el mejor DEF/ARQ disponible para
//    ocupar su posición y, para mantener diez jugadores, sale del campo el MID/DEL
//    más flojo;
//  - si era MID o DEL, solo se quita (sin cambio desde el banco).
// Devuelve { replacement, sacrificed } cuando hubo cambio de banquillo (entra un
// DEF/ARQ y sale el MID/DEL más flojo), o null si solo se quitó al expulsado.
export function expelFromLineup(team, offender) {
  if (!team.starting11 || !offender || !offender.uid) return null;
  const s11 = cloneLineup(team.starting11);
  const expelledLine = LINES.find((line) => s11[line].some((p) => p.uid === offender.uid));
  if (expelledLine) s11[expelledLine] = s11[expelledLine].filter((p) => p.uid !== offender.uid);

  let bench = (team.bench || []).slice();
  const need = offender.position; // posición natural del expulsado
  let replacement = null;
  let sacrificed = null;
  if ((need === 'GK' || need === 'DEF') && expelledLine) {
    const repl = bench
      .filter((p) => p.position === need)
      .sort((a, b) => playerOVR(b) - playerOVR(a))[0];
    if (repl) {
      bench = bench.filter((p) => p.uid !== repl.uid);
      s11[expelledLine] = [...s11[expelledLine], repl];
      replacement = repl;
      // Sale el MID/DEL más flojo del campo para no quedar con once jugadores.
      const field = [
        ...s11.MID.map((p) => ['MID', p]),
        ...s11.FWD.map((p) => ['FWD', p]),
      ].sort((a, b) => playerOVR(a[1]) - playerOVR(b[1]));
      if (field.length) {
        const [weakLine, weak] = field[0];
        s11[weakLine] = s11[weakLine].filter((p) => p.uid !== weak.uid);
        sacrificed = weak;
      }
    }
  }
  team.starting11 = s11;
  team.bench = bench;
  return replacement ? { replacement, sacrificed } : null;
}

// Sustitución por lesión: el lesionado deja la táctica (su lugar queda vacío) y
// entra desde el banquillo, uno por uno, el mejor suplente de su posición; si no
// hay de esa posición, el mejor disponible; si el banco está vacío, queda el
// hueco. A diferencia de la expulsión, el equipo sigue con once y nadie más sale.
// Devuelve { replacement } cuando alguien entró, o null si no había suplente.
export function substituteInjured(team, injured) {
  if (!team.starting11 || !injured || !injured.uid) return null;
  const s11 = cloneLineup(team.starting11);
  const injuredLine = LINES.find((line) => s11[line].some((p) => p.uid === injured.uid));
  if (injuredLine) s11[injuredLine] = s11[injuredLine].filter((p) => p.uid !== injured.uid);

  let bench = (team.bench || []).slice();
  const byOvr = (a, b) => playerOVR(b) - playerOVR(a);
  let replacement = bench.filter((p) => p.position === injured.position).sort(byOvr)[0]
    || bench.slice().sort(byOvr)[0]
    || null;
  if (replacement && injuredLine) {
    bench = bench.filter((p) => p.uid !== replacement.uid);
    s11[injuredLine] = [...s11[injuredLine], replacement];
  }
  team.starting11 = s11;
  team.bench = bench;
  return replacement ? { replacement } : null;
}

// Sorteo de lesión del partido (un único intento). Reparte las bandas de
// CONFIG.INJURY_PROB, mutuamente excluyentes, así que a lo sumo hay una lesión.
// Devuelve { severity, minute, typeIndex } o null. El minuto y el tipo se
// sortean aquí para que la lesión sea reproducible con la misma semilla.
function rollInjury(rng) {
  const r = rng.next();
  const p = CONFIG.INJURY_PROB;
  let acc = 0;
  let severity = null;
  for (const grade of ['muy_grave', 'grave', 'moderada', 'simple']) {
    acc += p[grade] || 0;
    if (r < acc) { severity = grade; break; }
  }
  if (!severity) return null;
  return {
    severity,
    minute: 1 + Math.floor(rng.next() * 90),
    typeIndex: Math.floor(rng.next() * CONFIG.INJURY_TYPE_COUNT),
  };
}

// Quita por nombre a un jugador de todos los pools de actores del equipo de
// batalla. El rival sintético no tiene once ni banquillo que reorganizar, así que
// tras una roja se le retira de los pools para que no vuelva a salir como
// tirador, asistente o infractor en jugadas posteriores.
function removeActorFromPools(team, name) {
  if (!team || !name) return;
  for (const pool of ['shooters', 'assisters', 'defenders', 'midfielders', 'attackers', 'keepers']) {
    if (Array.isArray(team[pool])) team[pool] = team[pool].filter((p) => p.name !== name);
  }
}

const inferiorityFactor = (reds) => Math.pow(1 - CONFIG.RED_CARD_PENALTY, reds);

// Rehace pools de actores, ratings naturales y ratings de juego del equipo desde
// su alineación actual (refleja sustituciones, huecos y la química resultante).
// Las jugadas se procesan en orden cronológico, así que mutar el equipo afecta
// solo a las jugadas posteriores. Deja team.ratings = naturales (sin penalizar).
function rebuildBattleTeam(team) {
  if (!team.starting11) return;
  const rebuilt = buildBattleTeam({
    name: team.name,
    color: team.color,
    formation: team.formation,
    starting11: team.starting11,
    items: team.items,
    bench: team.bench,
  });
  Object.assign(team, {
    shooters: rebuilt.shooters,
    assisters: rebuilt.assisters,
    keepers: rebuilt.keepers,
    defenders: rebuilt.defenders,
    midfielders: rebuilt.midfielders,
    attackers: rebuilt.attackers,
    gkName: rebuilt.gkName,
  });
  team.naturalRatings = rebuilt.ratings;
  team.ratings = { ...rebuilt.ratings };
}

// Lesión: como un cambio normal, el equipo sigue con once. Se rehace desde la
// alineación con el suplente ya dentro, sin penalización por inferioridad.
function applyInjurySwap(team) {
  rebuildBattleTeam(team);
}

// Tarjeta roja: el equipo que comete la falta juega en inferioridad el resto del
// partido. Para el equipo del jugador se rehacen ratings y pools desde la
// alineación ya reorganizada (refleja la sustitución y el hueco); para ambos se
// aplica además una penalización por inferioridad numérica a defensa y medio.
function applyRedCard(team) {
  team.redCount = (team.redCount || 0) + 1;
  rebuildBattleTeam(team);
  const natural = team.naturalRatings;
  const f = inferiorityFactor(team.redCount);
  team.ratings = {
    ...natural,
    defense: roundRating(natural.defense * f),
    midfield: roundRating(natural.midfield * f),
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

// Contabiliza un evento: actualiza marcador, resuelve la tarjeta de la falta (al
// equipo que defiende, que es quien comete la falta) y lo guarda. En una roja
// reorganiza/penaliza al equipo infractor y registra al expulsado del jugador.
function recordEvent(event, A, B, score, events, tracker, rng) {
  applyScore(event, score);
  if (event.type === 'falta') {
    const foulSide = event.side === 'A' ? 'B' : 'A'; // defiende = comete la falta
    const { card, secondYellow } = resolveFoul({
      side: foulSide,
      offender: event.offender,
      phase: event.phase,
      rng,
      tracker,
    });
    event.card = card;
    event.secondYellow = secondYellow;
    if (card === 'red') {
      event.pattern = 'red_foul';
      const team = foulSide === 'A' ? A : B;
      const sub = expelFromLineup(team, event.offender);
      applyRedCard(team);
      // El rival sintético no se reorganiza desde un once: se le quita el
      // expulsado de los pools para que no actúe de nuevo el resto del partido.
      if (foulSide === 'B' && event.offender && event.offender.name) {
        removeActorFromPools(B, event.offender.name);
      }
      // Solo el equipo del jugador (lado A) arrastra la sanción al próximo
      // partido; se registra al expulsado con su identidad real.
      if (foulSide === 'A' && event.offender && event.offender.uid) {
        (A.expulsados || (A.expulsados = [])).push({
          uid: event.offender.uid,
          name: event.offender.name,
          position: event.offender.position,
          minute: event.minute,
          secondYellow,
        });
        // Reorganización tras expulsar a un DEF/ARQ: el banquillo cubre la
        // posición y un atacante deja su puesto (cambio de posición, no solo de
        // jugador). Se guarda para el resumen y la crónica.
        if (sub && sub.replacement) {
          (A.sustituciones || (A.sustituciones = [])).push({
            minute: event.minute,
            cause: event.offender.name,
            inName: sub.replacement.name,
            inPos: sub.replacement.position,
            outName: sub.sacrificed ? sub.sacrificed.name : null,
            outPos: sub.sacrificed ? sub.sacrificed.position : null,
          });
        }
      }
    } else {
      // Amarilla o falta sin tarjeta comparten la escena de falta.
      event.pattern = 'yellow_foul';
    }
  }
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

  // Ratings naturales de arranque: base para la penalización por inferioridad
  // (el rival no rehace su once, así que parte de aquí en cada roja).
  A.naturalRatings = A.ratings;
  B.naturalRatings = B.ratings;

  const possessionA = ratio(A.ratings.midfield, B.ratings.midfield);
  const seqA = Math.round(CONFIG.BASE_SEQUENCES * possessionA);
  const seqB = CONFIG.BASE_SEQUENCES - seqA;

  const queue = interleaveOverTime(seqA, seqB, rng);
  const score = { A: 0, B: 0 };
  const events = [];
  const cardTracker = createCardTracker();
  let eventSeq = 0;

  // Robo por presión (incluye la sinergia táctica del equipo que presiona).
  const stealAgainstB = A.matchBonuses.stealChance; // A presiona → B pierde más
  const stealAgainstA = B.matchBonuses.stealChance;

  // Lesión del partido (solo el equipo del jugador, lado A). Se sortea antes del
  // bucle y se aplica al llegar su minuto: el suplente que entra recalcula
  // ratings y química de A el resto del encuentro. La víctima se elige en ese
  // momento entre los titulares en pie (refleja una posible expulsión previa).
  const injury = rollInjury(rng);
  const applyInjury = () => {
    if (!injury) return;
    const onField = LINES.flatMap((line) => A.starting11?.[line] || []);
    const victim = onField.length ? onField[Math.floor(rng.next() * onField.length)] : null;
    if (victim) {
      const sub = substituteInjured(A, victim);
      applyInjurySwap(A);
      (A.lesionados || (A.lesionados = [])).push({
        uid: victim.uid,
        name: victim.name,
        position: victim.position,
        minute: injury.minute,
        severity: injury.severity,
        typeIndex: injury.typeIndex,
        inName: sub && sub.replacement ? sub.replacement.name : null,
      });
      // El cambio forzado por lesión también va a la lista de cambios (1-por-1:
      // entra el suplente, sale el lesionado). reason='injury' lo distingue del
      // cambio por roja para la crónica.
      if (sub && sub.replacement) {
        (A.sustituciones || (A.sustituciones = [])).push({
          minute: injury.minute,
          cause: victim.name,
          inName: sub.replacement.name,
          inPos: sub.replacement.position,
          outName: victim.name,
          outPos: victim.position,
          reason: 'injury',
        });
      }
    }
    injury.applied = true;
  };

  for (const { minute, side } of queue) {
    if (injury && !injury.applied && minute >= injury.minute) applyInjury();
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
    recordEvent(event, A, B, score, events, cardTracker, rng);

    if (event.type === 'perdida') {
      maybeCounter(minute, side === 'A' ? 'B' : 'A', A, B, score, events, rng, () => `hl_${++eventSeq}`, cardTracker);
    }
  }
  // Si ninguna jugada alcanzó el minuto de la lesión, se registra igualmente.
  if (injury && !injury.applied) applyInjury();

  // Desempate por número de secuencia: comparar ids como texto ordenaría
  // "hl_10" antes que "hl_9" y desordenaría los marcadores acumulados.
  const seqOf = (id) => parseInt(String(id).replace(/\D+/g, ''), 10) || 0;
  const redsA = A.redCount || 0;
  const redsB = B.redCount || 0;
  // Cuatro rojas en un mismo equipo: pierde el partido por incomparecencia,
  // pase lo que pase con el marcador (regla del juego). Casi imposible (~0,0009%).
  const forfeit = redsA >= 4 ? 'A' : redsB >= 4 ? 'B' : null;
  return {
    golesA: score.A,
    golesB: score.B,
    eventos: events.sort((a, b) => a.minute - b.minute || seqOf(a.id) - seqOf(b.id)),
    ratingsA: startRatingsA,
    ratingsB: startRatingsB,
    redsA,
    redsB,
    forfeit,
    expulsadosA: A.expulsados || [],
    sustitucionesA: A.sustituciones || [],
    lesionadosA: A.lesionados || [],
  };
}

function maybeCounter(minute, side, A, B, score, events, rng, nextId, tracker) {
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
  recordEvent(event, A, B, score, events, tracker, rng);
}
