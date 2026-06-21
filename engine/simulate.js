// Torre de Leyendas — Simulación del partido (§6.2, §6.3, §6.5).
// Modelo: reparte highlights por posesión y cada highlight se resuelve como
// un evento compacto. La presentación se apoya en escenas pixelart estáticas,
// no en una simulación continua de jugadores.

import { CONFIG, isCorrupto } from '../data/config.js';
import { buildBattleTeam } from './teamRatings.js';
import { ratio, simulateHighlight } from './highlights.js';
import { createCardTracker, resolveFoul } from './cards.js';
import { playerOVR } from './ovr.js';
import { isInjuryProne } from './traits.js';

export { ratio };

// Redondeo a décimas con piso de 1; sin techo: los ajustes en vivo (roja,
// remontada) no recortan a los equipos que superan 99.
const roundRating = (v) => Math.max(1, Math.round(v * 10) / 10);

const LINES = ['GK', 'DEF', 'MID', 'FWD'];

// Clona la alineación COMPACTANDO los huecos vacíos (el grid guarda nulls en los
// slots libres): la lógica de expulsión/sustitución opera sobre jugadores reales
// sin tropezar con null. Al rehacer el equipo (rebuildBattleTeam) se reasignan a
// huecos del grid por orden, lo que basta para los ratings tras un cambio.
function cloneLineup(s11) {
  const out = {};
  for (const line of LINES) out[line] = (s11[line] || []).filter(Boolean);
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

// Elige la gravedad de una lesión que YA ha ocurrido, repartiendo según los
// pesos relativos de CONFIG.INJURY_PROB (normalizados, sin la banda "sin
// lesión"). Lo usa la lesión de calentamiento del rasgo "Roto", donde el "se ha
// roto" ya está decidido y solo falta saber cómo de grave.
function rollInjurySeverity(rng) {
  const p = CONFIG.INJURY_PROB;
  const grades = ['muy_grave', 'grave', 'moderada', 'simple'];
  const total = grades.reduce((s, g) => s + (p[g] || 0), 0) || 1;
  let r = rng.next() * total;
  for (const g of grades) {
    r -= p[g] || 0;
    if (r < 0) return g;
  }
  return 'simple';
}

// Lesiones de calentamiento del rasgo "Roto" (solo el equipo del jugador, lado
// A): cada suplente propenso puede romperse antes de saltar al campo, sin haber
// jugado, con prob. CONFIG.INJURY_ROTO_WARMUP_PROB. No altera el once de hoy
// (estaba en el banquillo) pero pierde la disponibilidad para los próximos
// partidos según la gravedad y se retira del banco para no entrar como
// sustituto. Respeta la inmunidad por línea (nunca deja una posición por debajo
// de su mínimo de disponibles). Devuelve la lista de lesionados de calentamiento
// (minuto 0, marcados con warmup: true).
function rollWarmupInjuries(A, rng) {
  const bench = A.bench || [];
  if (!bench.length) return [];
  const hurt = [];
  for (const p of bench) {
    // El Corrupto es inmune a lesiones (nunca se rompe).
    if (isCorrupto(p)) continue;
    if (!isInjuryProne(p) || immuneForA(A, p.position)) continue;
    if (!rng.bernoulli(CONFIG.INJURY_ROTO_WARMUP_PROB)) continue;
    const severity = rollInjurySeverity(rng);
    const typeIndex = Math.floor(rng.next() * CONFIG.INJURY_TYPE_COUNT);
    // Solo cuenta para la inmunidad si la lesión deja baja futura (las simples no).
    if (A.immunityRemoved && (CONFIG.INJURY_BAN[severity] || 0) > 0) {
      A.immunityRemoved[p.position] = (A.immunityRemoved[p.position] || 0) + 1;
    }
    hurt.push({
      uid: p.uid,
      name: p.name,
      position: p.position,
      minute: 0,
      severity,
      typeIndex,
      inName: null,
      warmup: true,
    });
  }
  if (hurt.length) {
    const hurtUids = new Set(hurt.map((h) => h.uid));
    A.bench = bench.filter((p) => !hurtUids.has(p.uid));
  }
  return hurt;
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

// Inmunidad por línea del equipo del jugador (lado A): un jugador de la posición
// `pos` es inmune a lesiones/expulsiones cuando los disponibles de su línea (en
// toda la plantilla, descontando las bajas ya sufridas este partido) han caído a
// su mínimo (CONFIG.IMMUNITY_MIN). Así nunca te quedas sin cubrir el dibujo.
function immuneForA(A, pos) {
  if (!A.squadAvail || !pos) return false;
  const min = CONFIG.IMMUNITY_MIN[pos];
  if (min == null) return false;
  const avail = (A.squadAvail[pos] || 0) - (A.immunityRemoved?.[pos] || 0);
  return avail <= min;
}

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
    // Posición natural del infractor (para la inmunidad por línea del jugador).
    const offenderPos = event.offender
      ? (event.offender.naturalPosition || event.offender.position)
      : null;
    // El equipo del jugador (lado A) no recibe rojas que lo dejen por debajo del
    // mínimo de su línea: esas faltas se quedan en amarilla.
    const immune = foulSide === 'A' && immuneForA(A, offenderPos);
    // El Corrupto es inmune a TODA tarjeta: ni amarilla ni roja, nunca expulsado.
    const neverBooked = event.offender?.rarity === 'corrupto';
    const { card, secondYellow } = resolveFoul({
      side: foulSide,
      offender: event.offender,
      phase: event.phase,
      rng,
      tracker,
      immune,
      neverBooked,
    });
    event.card = card;
    event.secondYellow = secondYellow;
    if (card === 'red') {
      event.pattern = 'red_foul';
      const team = foulSide === 'A' ? A : B;
      // Registra la baja para la inmunidad por línea (solo el equipo del jugador).
      if (foulSide === 'A' && offenderPos && A.immunityRemoved) {
        A.immunityRemoved[offenderPos] = (A.immunityRemoved[offenderPos] || 0) + 1;
      }
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

  // Inmunidad por línea (solo el equipo del jugador): disponibles por posición en
  // la plantilla y bajas acumuladas durante este partido (lesiones + rojas).
  A.squadAvail = teamA.squadAvail || null;
  A.immunityRemoved = { GK: 0, DEF: 0, MID: 0, FWD: 0 };

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

  // Lesiones de calentamiento (rasgo "Roto"): suplentes propensos que pueden
  // romperse antes del pitido. Se sortean antes de las lesiones de campo y se
  // registran como lesionados de minuto 0; si dejan baja, arrastran la sanción.
  const warmupInjuries = rollWarmupInjuries(A, rng);
  if (warmupInjuries.length) (A.lesionados || (A.lesionados = [])).push(...warmupInjuries);

  // Lesiones de campo del equipo del jugador (lado A), cada una con su minuto:
  //  · La lesión genérica del encuentro (un único intento; víctima al azar entre
  //    los titulares en pie al llegar su minuto, reflejando una posible roja).
  //  · Una tirada PROPIA por cada titular "Roto" (CONFIG.INJURY_ROTO_FIELD_PROB):
  //    si sale, la víctima es ese mismo jugador.
  // Se aplican al alcanzar su minuto: el suplente que entra recalcula ratings y
  // química de A el resto del encuentro.
  const fieldInjuries = [];
  const generic = rollInjury(rng);
  if (generic) fieldInjuries.push({ ...generic, targetUid: null, applied: false });
  for (const starter of LINES.flatMap((line) => A.starting11?.[line] || []).filter(Boolean)) {
    if (!isInjuryProne(starter)) continue;
    if (!rng.bernoulli(CONFIG.INJURY_ROTO_FIELD_PROB)) continue;
    fieldInjuries.push({
      targetUid: starter.uid,
      minute: 1 + Math.floor(rng.next() * 90),
      severity: rollInjurySeverity(rng),
      typeIndex: Math.floor(rng.next() * CONFIG.INJURY_TYPE_COUNT),
      applied: false,
    });
  }

  // Lesiones provocadas por un jugador Corrupto del equipo del jugador (lado A):
  // una tirada de "entrenamiento" (minuto 0) y otra de "partido" (minuto al azar),
  // cada una con su probabilidad, hasta CORRUPTO_MAX_VICTIMS víctimas DISTINTAS
  // por encuentro. Se inyectan como fieldInjuries con targetUid prefijado, así
  // reutilizan la sustitución, el recálculo de ratings y el registro de lesionados.
  // La víctima se descuenta de la inmunidad por línea para no dejar una posición
  // por debajo de su mínimo de disponibles.
  const hasCorrupto = LINES.flatMap((line) => A.starting11?.[line] || []).some((p) => p && isCorrupto(p));
  if (hasCorrupto) {
    const chosen = new Set();
    const pickVictim = () => {
      const pool = LINES.flatMap((line) => A.starting11?.[line] || [])
        .filter((p) => p && !isCorrupto(p) && !immuneForA(A, p.position) && !chosen.has(p.uid));
      if (!pool.length) return null;
      const victim = pool[Math.floor(rng.next() * pool.length)];
      chosen.add(victim.uid);
      return victim;
    };
    for (const [when, prob] of [['train', CONFIG.CORRUPTO_INJURE_TRAIN], ['match', CONFIG.CORRUPTO_INJURE_MATCH]]) {
      if (chosen.size >= CONFIG.CORRUPTO_MAX_VICTIMS) break;
      if (!rng.bernoulli(prob)) continue;
      const victim = pickVictim();
      if (!victim) continue;
      fieldInjuries.push({
        targetUid: victim.uid,
        minute: when === 'train' ? 0 : 1 + Math.floor(rng.next() * 90),
        severity: rollInjurySeverity(rng),
        typeIndex: Math.floor(rng.next() * CONFIG.INJURY_TYPE_COUNT),
        applied: false,
        warmup: when === 'train',
      });
    }
  }
  fieldInjuries.sort((a, b) => a.minute - b.minute);

  // Aplica una lesión de campo. La genérica elige víctima al azar entre los
  // titulares en pie cuya línea NO es inmune; la de un "Roto" es él mismo, si
  // sigue en el campo y su línea no es inmune. Sin víctima válida, no pasa nada.
  const applyFieldInjury = (inj) => {
    if (inj.applied) return;
    inj.applied = true;
    const onField = LINES.flatMap((line) => A.starting11?.[line] || [])
      // El Corrupto nunca es víctima: es inmune a lesiones.
      .filter((p) => p && !immuneForA(A, p.position) && !isCorrupto(p));
    const victim = inj.targetUid
      ? (onField.find((p) => p.uid === inj.targetUid) || null)
      : (onField.length ? onField[Math.floor(rng.next() * onField.length)] : null);
    if (!victim) return;
    // Solo cuenta para la inmunidad si la lesión deja baja para los próximos
    // partidos (las simples no: el jugador sigue disponible al siguiente).
    if (A.immunityRemoved && (CONFIG.INJURY_BAN[inj.severity] || 0) > 0) {
      A.immunityRemoved[victim.position] = (A.immunityRemoved[victim.position] || 0) + 1;
    }
    const sub = substituteInjured(A, victim);
    applyInjurySwap(A);
    (A.lesionados || (A.lesionados = [])).push({
      uid: victim.uid,
      name: victim.name,
      position: victim.position,
      minute: inj.minute,
      severity: inj.severity,
      typeIndex: inj.typeIndex,
      inName: sub && sub.replacement ? sub.replacement.name : null,
      // Lesión de "entrenamiento" provocada por el Corrupto: se rotula como
      // calentamiento (minuto 0) en el resumen, igual que las del rasgo "Roto".
      ...(inj.warmup ? { warmup: true } : {}),
    });
    // El cambio forzado por lesión también va a la lista de cambios (1-por-1:
    // entra el suplente, sale el lesionado). reason='injury' lo distingue del
    // cambio por roja para la crónica.
    if (sub && sub.replacement) {
      (A.sustituciones || (A.sustituciones = [])).push({
        minute: inj.minute,
        cause: victim.name,
        inName: sub.replacement.name,
        inPos: sub.replacement.position,
        outName: victim.name,
        outPos: victim.position,
        reason: 'injury',
      });
    }
  };

  for (const { minute, side } of queue) {
    for (const inj of fieldInjuries) {
      if (!inj.applied && minute >= inj.minute) applyFieldInjury(inj);
    }
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
  // Si ninguna jugada alcanzó el minuto de alguna lesión, se registra igualmente.
  for (const inj of fieldInjuries) if (!inj.applied) applyFieldInjury(inj);

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
