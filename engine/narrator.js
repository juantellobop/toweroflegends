// Torre de Leyendas — Plantillas de jugadas narradas (§6.4).
// Cada evento del motor se convierte en una línea de texto para mostrar.

import { localizeTeamName, t } from '../data/i18n.js';

function actor(ev, key, fallback = t('narrator.player')) {
  return ev.actors?.[key] || ev[key] || fallback;
}

function phaseLabel(ev) {
  if (ev.phase === 'corner') return t('narrator.phases.corner');
  if (ev.phase === 'free_kick') return t('narrator.phases.free_kick');
  if (ev.phase === 'penalty') return t('narrator.phases.penalty');
  if (ev.phase === 'counter') return t('narrator.phases.counter');
  return t('narrator.phases.default');
}

function team(name) {
  return localizeTeamName(name);
}

// Construye el texto narrado de un evento. rng opcional para variar la prosa.
export function narrate(ev, rng) {
  const m = ev.minute;
  const xg = typeof ev.xg === 'number' && ev.xg > 0 ? t('narrator.xg', { xg: ev.xg.toFixed(2) }) : '';
  switch (ev.type) {
    case 'perdida':
      return t('narrator.perdida', { m, defender: actor(ev, 'defender', ev.defenderName), team: team(ev.attackerTeam) });
    case 'construccion_fallida':
      return t('narrator.construccion_fallida', { m, attacker: team(ev.attackerTeam), defender: team(ev.defenderTeam) });
    case 'contraataque':
      return t('narrator.contraataque', { m, attacker: team(ev.attackerTeam), shooter: ev.shooter });
    case 'pase_fuera':
      return t('narrator.pase_fuera', { m, passer: actor(ev, 'passer', ev.assister) });
    case 'falta':
      return ev.pattern === 'red_foul'
        ? t('narrator.faltaRoja', { m, receiver: actor(ev, 'receiver'), defender: actor(ev, 'defender', ev.defenderName) })
        : t('narrator.falta', {
          m,
          receiver: actor(ev, 'receiver'),
          defender: actor(ev, 'defender', ev.defenderName),
          kind: ev.phase === 'free_kick' ? t('narrator.faltaPeligrosa') : t('narrator.faltaPresion'),
        });
    case 'fuera_juego':
      return t('narrator.fuera_juego', { m, passer: actor(ev, 'passer', ev.assister), receiver: actor(ev, 'receiver') });
    case 'despeje':
      return ev.pattern === 'cross'
        ? t('narrator.despejeCross', { m, attacker: team(ev.attackerTeam), defender: actor(ev, 'defender', ev.defenderName) })
        : t('narrator.despeje', { m, attacker: team(ev.attackerTeam), defender: actor(ev, 'defender', ev.defenderName) });
    case 'sin_remate':
      return t('narrator.sin_remate', { m, attacker: team(ev.attackerTeam), defender: team(ev.defenderTeam) });
    case 'bloqueo':
      return t('narrator.bloqueo', { m, shooter: actor(ev, 'shooter', ev.shooter), defender: actor(ev, 'defender', ev.defenderName), xg });
    case 'tiro_fuera':
      return t('narrator.tiro_fuera', { m, shooter: actor(ev, 'shooter', ev.shooter), phase: phaseLabel(ev), xg });
    case 'parada':
      return t('narrator.parada', { m, shooter: actor(ev, 'shooter', ev.shooter), phase: phaseLabel(ev), keeper: actor(ev, 'keeper', ev.keeper), xg });
    case 'gol':
      if (ev.pattern === 'penalty_goal') {
        return t('narrator.golPenal', { m, shooter: actor(ev, 'shooter', ev.shooter), team: team(ev.attackerTeam), score: `${ev.scoreA}-${ev.scoreB}`, xg });
      }
      if (ev.pattern === 'free_kick_goal') {
        return t('narrator.golTiroLibre', { m, shooter: actor(ev, 'shooter', ev.shooter), team: team(ev.attackerTeam), score: `${ev.scoreA}-${ev.scoreB}`, xg });
      }
      if (ev.pattern === 'header_goal') {
        return t('narrator.golCabeza', { m, passer: actor(ev, 'passer', ev.assister), shooter: actor(ev, 'shooter', ev.shooter), team: team(ev.attackerTeam), score: `${ev.scoreA}-${ev.scoreB}`, xg });
      }
      return t('narrator.gol', { m, passer: actor(ev, 'passer', ev.assister), shooter: actor(ev, 'shooter', ev.shooter), team: team(ev.attackerTeam), score: `${ev.scoreA}-${ev.scoreB}`, xg });
    default:
      return t('narrator.default', { m });
  }
}

// Resumen breve para la pantalla de resultado: goleadores y mejores paradas.
export function summarize(events) {
  const scorers = {};
  let saves = 0;
  for (const ev of events) {
    if (ev.type === 'gol') scorers[ev.shooter] = (scorers[ev.shooter] || 0) + 1;
    if (ev.type === 'parada') saves += 1;
  }
  const scorerList = Object.entries(scorers)
    .sort((a, b) => b[1] - a[1])
    .map(([name, n]) => (n > 1 ? `${name} (${n})` : name));
  return { scorers: scorerList, saves };
}
