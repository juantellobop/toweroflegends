// Torre de Leyendas — Roster jugable (API pública del juego).
// Expone el roster que necesita el bucle de juego (state/run.js) sin acoplarlo a
// nada del panel admin. El admin vive solo en local/ (ignorado por git) y reutiliza
// estas funciones; el juego funciona aunque local/ no exista (producción).

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
