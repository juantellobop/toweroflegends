// Torre de Leyendas — Modelo de tarjetas (amarillas y rojas).
// La decisión de tarjeta vive aquí (y no en patternFor) porque necesita estado
// a lo largo del partido: la segunda amarilla a un mismo jugador es roja. El
// tracker acumula el estado disciplinario por equipo y por jugador.
//
// Calibrado para que las rojas por equipo y partido sigan ~Poisson(0,125):
// 1 roja 11,03% · 2 0,69% · 3 0,029% · 4 0,0009% de los partidos. Ver
// .cache/cards-probe.mjs para re-medir.

import { CONFIG } from '../data/config.js';

// Estado disciplinario por lado: Map clave→'yellow'|'red'. La clave es el uid
// del jugador (equipo del jugador) o, en su defecto, el nombre del actor (rival
// sintético, sin uid).
export function createCardTracker() {
  return { A: new Map(), B: new Map() };
}

function keyFor(offender) {
  return (offender && (offender.uid || offender.name)) || '?';
}

// Resuelve la tarjeta de una falta. `side` es el lado que comete la falta (el
// que defiende). Devuelve { card: 'none'|'yellow'|'red', secondYellow }.
// `immune` (solo el equipo del jugador, cuando su línea cayó al mínimo): la falta
// nunca acaba en roja para no dejarlo sin cubrir el dibujo. `neverBooked` (jugador
// Corrupto): la falta nunca lleva tarjeta alguna (ni amarilla ni roja) y no toca
// el tracker. Las llamadas al RNG no cambian con `immune`/`neverBooked`
// (reproducibilidad): se consumen las mismas tiradas y solo se remapea el resultado.
export function resolveFoul({ side, offender, phase, rng, tracker, immune = false, neverBooked = false }) {
  const seen = tracker[side];
  const k = keyFor(offender);
  // Ya expulsado: no puede recibir más tarjetas (relevante para el rival, que no
  // se quita de los pools de actores).
  if (seen.get(k) === 'red') return { card: 'none', secondYellow: false };

  const danger = phase === 'free_kick' ? CONFIG.DANGEROUS_FOUL_MULT : 1;

  // Roja directa (rara). Se evalúa primero: una entrada brutal es roja aunque el
  // jugador no estuviese amonestado. Con inmunidad se queda en amarilla; el
  // Corrupto no recibe ni amarilla (la tirada se consume igual para no desincronizar).
  if (rng.bernoulli(Math.min(0.9, CONFIG.DIRECT_RED_PROB * danger))) {
    if (neverBooked) return { card: 'none', secondYellow: false };
    if (immune) {
      seen.set(k, 'yellow');
      return { card: 'yellow', secondYellow: false };
    }
    seen.set(k, 'red');
    return { card: 'red', secondYellow: false };
  }

  // Amarilla. Si el jugador ya tenía una, la segunda es roja (salvo inmunidad,
  // que no escala: se queda amonestado y sigue en el campo). El Corrupto nunca
  // se amonesta.
  if (rng.bernoulli(Math.min(0.95, CONFIG.YELLOW_PROB * danger))) {
    if (neverBooked) return { card: 'none', secondYellow: false };
    if (seen.get(k) === 'yellow') {
      if (immune) return { card: 'yellow', secondYellow: false };
      seen.set(k, 'red');
      return { card: 'red', secondYellow: true };
    }
    seen.set(k, 'yellow');
    return { card: 'yellow', secondYellow: false };
  }

  // Falta sin tarjeta (el árbitro perdona).
  return { card: 'none', secondYellow: false };
}
