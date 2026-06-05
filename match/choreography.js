// Torre de Leyendas — Mapa de coreografías (§5.5 del plan UI/UX).
// Traduce cada tipo de evento del MOTOR a una duración base, relevancia y
// comentario. La imagen principal se resuelve en match/scenes.js.

import { narrate } from '../engine/narrator.js';
import { localizeTeamName, t } from '../data/i18n.js';

// Fases de animación que entiende el render del campo (match/pitch.js):
//   buildup  — el balón circula por el medio
//   turnover — el rival intercepta; el balón cambia de lado
//   blocked  — el balón avanza y la defensa lo devuelve atrás
//   save     — remate a portería; el portero la detiene (destello)
//   goal     — remate a la red; celebración; marcador sube
//   counter  — transición rápida campo a campo (prefijo de save/goal)
const TABLE = {
  perdida:              { phase: 'turnover', duration: 1200, key: false },
  construccion_fallida: { phase: 'blocked',  duration: 1300, key: false },
  parada:               { phase: 'save',     duration: 2000, key: true  },
  gol:                  { phase: 'goal',     duration: 2800, key: true  },
  tiro_fuera:           { phase: 'shotWide', duration: 1700, key: true  },
  bloqueo:              { phase: 'blocked',  duration: 1500, key: true  },
  pase_fuera:           { phase: 'turnover', duration: 1100, key: false },
  falta:                { phase: 'blocked',  duration: 1300, key: true  },
  fuera_juego:          { phase: 'blocked',  duration: 1200, key: false },
  despeje:              { phase: 'blocked',  duration: 1200, key: false },
  sin_remate:           { phase: 'buildup',  duration: 1100, key: false },
};

const FALLBACK = { phase: 'buildup', duration: 1500, key: false };

// Devuelve la coreografía de un evento. `counter` alarga y marca la jugada
// como transición rápida (la cámara hace un paneo más amplio).
export function choreographyFor(ev) {
  const base = TABLE[ev.type] || FALLBACK;
  if (ev.counter && (ev.type === 'gol' || ev.type === 'parada')) {
    return { ...base, duration: base.duration + 400, counter: true };
  }
  return { ...base };
}

// ¿Es una jugada "clave" (ocasión clara, parada o gol)? Lo usa el modo
// "solo highlights clave" para filtrar construcción y pérdidas menores.
export function isKeyEvent(ev) {
  if (ev.type === 'gol' || ev.type === 'parada') return true;
  if (ev.type === 'tiro_fuera' || ev.type === 'bloqueo') return (ev.xg || 0) >= 0.16;
  if (ev.type === 'falta') return ev.phase === 'free_kick' || ev.pattern === 'red_foul';
  return !!choreographyFor(ev).key;
}

// Texto de comentario para el ticker. Reutiliza el narrador del motor como
// única fuente de prosa; `homeName` permite teñir el tono (no imprescindible).
export function commentFor(ev, rng) {
  return narrate(ev, rng);
}

// Resalte breve para la cabecera ARIA-live (solo eventos clave).
export function liveAnnounce(ev) {
  if (ev.type === 'gol') return `${t('scene.badge.gol')}. ${localizeTeamName(ev.attackerTeam)}. ${ev.scoreA} - ${ev.scoreB}.`;
  if (ev.type === 'parada') return t('scene.headline.parada', { keeper: ev.keeper });
  if (ev.type === 'tiro_fuera') return t('scene.headline.tiro_fuera', { shooter: ev.shooter });
  return '';
}
