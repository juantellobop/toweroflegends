// Torre de Leyendas — Crónica periodística del partido (§4.5/§8.6).
// Convierte los eventos de la simulación en un artículo de prensa (~1500
// caracteres) con una figura destacada. Determinista: el mismo partido
// produce siempre la misma crónica (la variación de prosa usa un RNG
// sembrado con el propio resultado).

import { RNG } from './rng.js';
import { t } from '../data/i18n.js';
import { playerSurname } from '../data/playerAssets.js';

// Solo cuentan como asistencia los goles de jugada o cabeza: en penaltis y
// tiros libres el "passer" del evento no participa de verdad en el gol.
const ASSIST_PATTERNS = new Set(['shot_goal', 'shot_goal_alt', 'header_goal']);

const otherSide = (side) => (side === 'A' ? 'B' : 'A');

function bump(map, name, side, key) {
  if (!name) return;
  const entry = map.get(name) || { name, side, goals: 0, assists: 0, saves: 0, stops: 0 };
  entry[key] += 1;
  map.set(name, entry);
}

// Recorre los eventos (ya ordenados por minuto) y extrae la materia prima de
// la crónica: goles con su contexto de marcador, rojas, penaltis fallados y
// el reparto de paradas e intervenciones defensivas por jugador.
function analyze(match) {
  const goals = [];
  const reds = [];
  const penaltyMisses = [];
  const chances = [];
  const people = new Map();
  let keeperFallback = null;
  let prevA = 0;
  let prevB = 0;

  for (const ev of match.eventos) {
    const defSide = otherSide(ev.side);
    if (!keeperFallback && ev.keeper) keeperFallback = { name: ev.keeper, side: defSide };
    if (ev.type === 'gol') {
      const assister = ASSIST_PATTERNS.has(ev.pattern) && ev.assister && ev.assister !== ev.shooter
        ? ev.assister
        : null;
      goals.push({
        minute: ev.minute,
        side: ev.side,
        scorer: ev.shooter,
        assister,
        pattern: ev.pattern,
        counter: Boolean(ev.counter),
        score: `${ev.scoreA}-${ev.scoreB}`,
        before: { A: prevA, B: prevB },
        after: { A: ev.scoreA, B: ev.scoreB },
      });
      bump(people, ev.shooter, ev.side, 'goals');
      if (assister) bump(people, assister, ev.side, 'assists');
    }
    if (ev.pattern === 'red_foul') {
      reds.push({ minute: ev.minute, player: ev.defenderName, side: defSide });
    }
    if (ev.phase === 'penalty' && (ev.type === 'parada' || ev.type === 'tiro_fuera')) {
      penaltyMisses.push({ minute: ev.minute, shooter: ev.shooter, keeper: ev.keeper, side: ev.side });
    }
    if (ev.type === 'parada') bump(people, ev.keeper, defSide, 'saves');
    if (ev.type === 'perdida' || ev.type === 'despeje' || ev.type === 'bloqueo') {
      bump(people, ev.defenderName, defSide, 'stops');
    }
    // Ocasiones falladas de jugada (los penaltis ya tienen su propia frase).
    if (ev.phase !== 'penalty' && (ev.type === 'parada' || ev.type === 'tiro_fuera' || ev.type === 'bloqueo')) {
      chances.push({
        minute: ev.minute,
        type: ev.type,
        shooter: ev.shooter,
        keeper: ev.keeper,
        side: ev.side,
        xg: ev.xg || 0,
      });
    }
    prevA = ev.scoreA;
    prevB = ev.scoreB;
  }
  return { goals, reds, penaltyMisses, chances, people, keeperFallback };
}

// Figura del encuentro: goles mandan, luego asistencias, paradas e
// intervenciones. Con victoria o derrota la figura sale del bando ganador
// (la crónica la presenta como protagonista o verdugo); en empate, del global.
function pickFigure(analysis, result) {
  const score = (p) => p.goals * 3 + p.assists * 1.5 + p.saves * 0.9 + p.stops * 0.3;
  const list = [...analysis.people.values()];
  const prefer = result === 'win' ? 'A' : result === 'loss' ? 'B' : null;
  let pool = prefer ? list.filter((p) => p.side === prefer) : list;
  if (!pool.length) pool = list;
  if (!pool.length) return analysis.keeperFallback
    ? { ...analysis.keeperFallback, goals: 0, assists: 0, saves: 0, stops: 0 }
    : null;
  return pool.sort((a, b) => score(b) - score(a))[0];
}

// El portero más exigido (para los párrafos sin goles). half: 1 limita al
// primer tiempo; sin él cuenta el partido completo.
function busiestKeeper(match, analysis, half = null) {
  const counts = new Map();
  for (const ev of match.eventos) {
    if (ev.type !== 'parada' || !ev.keeper) continue;
    if (half === 1 && ev.minute > 45) continue;
    counts.set(ev.keeper, (counts.get(ev.keeper) || 0) + 1);
  }
  let best = null;
  for (const [name, n] of counts) {
    if (!best || n > best.n) best = { name, n };
  }
  return best?.name || analysis.keeperFallback?.name || t('narrator.player');
}

// Frase del "cómo" del gol según el patrón del evento.
function howPhrase(goal, rng) {
  if (goal.pattern === 'penalty_goal') return t('press.how.penalty');
  if (goal.pattern === 'free_kick_goal') return t('press.how.freeKick');
  if (goal.pattern === 'header_goal') {
    return goal.assister
      ? t('press.how.headerAssist', { assister: goal.assister })
      : t('press.how.header');
  }
  if (goal.counter) return t('press.how.counter');
  if (goal.assister && rng.bernoulli(0.55)) return t('press.how.shotAssist', { assister: goal.assister });
  return rng.bernoulli(0.5) ? t('press.how.shotA') : t('press.how.shotB');
}

// Clase narrativa del gol según cómo movió el marcador.
function classifyGoal(goal) {
  const us = goal.side === 'A' ? goal.after.A : goal.after.B;
  const them = goal.side === 'A' ? goal.after.B : goal.after.A;
  const beforeUs = goal.side === 'A' ? goal.before.A : goal.before.B;
  const beforeThem = goal.side === 'A' ? goal.before.B : goal.before.A;
  if (us === them) return 'equalizer';
  if (us > them && beforeUs <= beforeThem) return 'lead';
  if (us > them) return 'extend';
  return 'comeback';
}

// Logro de la figura en versión nominal ("dos goles y una asistencia"),
// para el cierre. Compuesto de unidades localizadas.
function featSummary(figure) {
  const parts = [];
  if (figure.goals) parts.push(t('press.units.goals', { n: figure.goals }));
  if (figure.assists) parts.push(t('press.units.assists', { n: figure.assists }));
  if (!parts.length && figure.saves) parts.push(t('press.units.saves', { n: figure.saves }));
  if (!parts.length) return t('press.units.wall');
  return parts.join(t('press.units.and'));
}

// Logro de la figura en versión verbal ("convertir dos goles…"), para el lead.
function featPhrase(figure) {
  if (figure.goals && figure.assists) {
    return t('press.feat.goalsAssists', {
      goals: t('press.units.goals', { n: figure.goals }),
      assists: t('press.units.assists', { n: figure.assists }),
    });
  }
  if (figure.goals) return t('press.feat.goals', { goals: t('press.units.goals', { n: figure.goals }) });
  if (figure.assists) return t('press.feat.assists', { assists: t('press.units.assists', { n: figure.assists }) });
  if (figure.saves) return t('press.feat.saves', { saves: t('press.units.saves', { n: figure.saves }) });
  return t('press.feat.wall');
}

function seedFrom(match, level) {
  const first = match.eventos[0];
  return ((match.golesA * 73856093) ^ (match.golesB * 19349663) ^
    (match.eventos.length * 83492791) ^ ((level || 1) * 2654435761) ^
    ((first?.minute || 1) * 97)) >>> 0;
}

// Construye la crónica completa. ctx = { teamName, oppName, level }.
// Devuelve { headline, paragraphs, figure } o null si no hay partido narrable.
export function buildCronica(match, ctx) {
  if (!match || !Array.isArray(match.eventos) || !match.eventos.length) return null;
  const { golesA, golesB } = match;
  const result = golesA > golesB ? 'win' : golesA < golesB ? 'loss' : 'draw';
  const rng = new RNG(seedFrom(match, ctx.level));
  const analysis = analyze(match);
  const figure = pickFigure(analysis, result);
  if (!figure) return null;

  const teamOf = (side) => (side === 'A' ? ctx.teamName : ctx.oppName);
  const winnerSide = result === 'win' ? 'A' : result === 'loss' ? 'B' : null;

  // — Lead: resultado + presentación de la figura (en derrota, el marcador se
  //   lee con el ganador por delante, como lo escribiría un periódico).
  const lead = t(`press.lead.${result}`, {
    team: ctx.teamName,
    opp: ctx.oppName,
    score: result === 'loss' ? `${golesB}-${golesA}` : `${golesA}-${golesB}`,
    figure: figure.name,
    feat: featPhrase(figure),
  });

  // — Cuerpo: frases narradas colocadas en su mitad según el minuto. La
  //   narración principal (goles, rojas, penaltis) y el relleno de ocasiones
  //   van por separado: si una mitad queda sin narración principal entra su
  //   párrafo de contexto, y los extras se suman detrás en ambos casos.
  const halves = { first: [], second: [] };
  const extras = { first: [], second: [] };
  const half = (minute) => (minute <= 45 ? 'first' : 'second');
  const push = (minute, text) => halves[half(minute)].push({ minute, text });
  const pushExtra = (minute, text) => extras[half(minute)].push({ minute, text });

  const goals = analysis.goals;
  if (goals.length) {
    const opener = goals[0];
    push(opener.minute, t('press.body.opener', {
      att: teamOf(opener.side),
      def: teamOf(otherSide(opener.side)),
      minute: opener.minute,
      scorer: opener.scorer,
      how: howPhrase(opener, rng),
      score: opener.score,
    }));

    // Del resto, se narran hasta dos goles: los que cambian la historia
    // (empates, descuentos, remontadas) y el último si cerró el partido.
    const rest = goals.slice(1);
    const lastGoal = goals[goals.length - 1];
    let chosen = rest.filter((g) => classifyGoal(g) !== 'extend' || g === lastGoal).slice(-2);
    if (!chosen.length && rest.length) chosen = [rest[rest.length - 1]];
    for (const g of chosen) {
      let cls = classifyGoal(g);
      const seals = g === lastGoal && winnerSide && g.side === winnerSide &&
        cls !== 'equalizer' && (g.minute >= 70 || goals.length >= 3);
      if (seals) cls = 'sealer';
      push(g.minute, t(`press.goal.${cls}`, {
        team: teamOf(g.side),
        scorer: g.scorer,
        minute: g.minute,
        how: howPhrase(g, rng),
        score: g.score,
      }));
    }
  }

  // Todas las expulsiones se narran (hasta dos para no inflar el artículo; tres
  // o más rojas en un partido es rarísimo).
  for (const red of analysis.reds.slice(0, 2)) {
    push(red.minute, t('press.body.red', {
      player: red.player,
      team: teamOf(red.side),
      minute: red.minute,
    }));
  }
  // Reorganización forzada por una expulsión de DEF/ARQ: el banquillo cubre el
  // hueco atrás y un atacante deja su puesto. Se narra el primer cambio.
  for (const sub of (match.sustitucionesA || []).slice(0, 1)) {
    const key = sub.outName ? 'subSwap' : 'subIn';
    push(sub.minute, t(`press.body.${key}`, {
      team: ctx.teamName,
      inName: sub.inName,
      outName: sub.outName,
      cause: sub.cause,
      minute: sub.minute,
    }));
  }
  // Cuatro rojas: el partido se da por perdido (incomparecencia).
  if (match.forfeit) {
    const lastRed = analysis.reds[analysis.reds.length - 1];
    push(lastRed ? lastRed.minute : 90, t('press.body.forfeit', {
      team: teamOf(match.forfeit),
    }));
  }
  if (analysis.penaltyMisses.length) {
    const miss = analysis.penaltyMisses[0];
    push(miss.minute, t('press.body.penaltyMiss', {
      shooter: miss.shooter,
      keeper: miss.keeper,
      minute: miss.minute,
    }));
  }

  // Si la crónica va escasa, se rellena con la ocasión más clara fallada y,
  // si aún falta cuerpo, con la mejor parada. Mantiene los ~1500 caracteres
  // también en partidos con pocos goles.
  const coreCount = halves.first.length + halves.second.length;
  const byXg = analysis.chances.slice().sort((a, b) => b.xg - a.xg);
  let usedChance = null;
  if (coreCount < 4 && byXg.length) {
    usedChance = byXg[0];
    const key = usedChance.type === 'parada' ? 'nearMissSave' : 'nearMissWide';
    pushExtra(usedChance.minute, t(`press.body.${key}`, {
      shooter: usedChance.shooter,
      keeper: usedChance.keeper,
      minute: usedChance.minute,
    }));
  }
  if (coreCount < 3) {
    const save = byXg.find((c) => c.type === 'parada' && c !== usedChance && c.xg >= 0.3);
    if (save) {
      pushExtra(save.minute, t('press.body.bestSave', {
        keeper: save.keeper,
        shooter: save.shooter,
        minute: save.minute,
      }));
    }
  }

  const joinHalf = (items) => items
    .sort((a, b) => a.minute - b.minute)
    .map((item) => item.text)
    .join(' ');

  const halfText = (key, filler) => {
    const core = halves[key].length ? joinHalf(halves[key]) : filler;
    const extra = extras[key].length ? joinHalf(extras[key]) : '';
    return extra ? `${core} ${extra}` : core;
  };
  const firstHalf = halfText('first', t('press.body.scoreless', {
    team: ctx.teamName,
    opp: ctx.oppName,
    keeper: busiestKeeper(match, analysis, 1),
  }));
  const secondHalf = halfText('second', t('press.body.quiet', {
    team: ctx.teamName,
    opp: ctx.oppName,
    keeper: busiestKeeper(match, analysis),
  }));

  const closing = t(`press.closing.${result}`, {
    team: ctx.teamName,
    opp: ctx.oppName,
    figure: figure.name,
    featSummary: featSummary(figure),
    level: ctx.level,
  });

  const headKey = result === 'win'
    ? (golesA - golesB >= 3 ? 'winBig' : (rng.bernoulli(0.5) ? 'win' : 'win2'))
    : result;
  const headline = t(`press.headline.${headKey}`, {
    team: ctx.teamName,
    opp: ctx.oppName,
    figure: playerSurname(figure.name) || figure.name,
  });

  return {
    headline,
    paragraphs: [lead, firstHalf, secondHalf, closing],
    figure: { name: figure.name, side: figure.side, goals: figure.goals, assists: figure.assists, saves: figure.saves },
  };
}
