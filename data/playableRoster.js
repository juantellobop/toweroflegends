// Torre de Leyendas — Roster jugable (público).
// La parte de juego que antes vivía en data/adminPlayers.js: el roster base que
// consume el motor (state/run.js). La edición de jugadores (panel admin) vive
// solo en local/ y no se publica.

import { ROSTER } from './roster.js';

export function clonePlayer(player) {
  return {
    ...player,
    stats: player.stats ? { ...player.stats } : null,
    gk: player.gk ? { ...player.gk } : null,
  };
}

export function getPlayableRoster() {
  return ROSTER.map(clonePlayer);
}
