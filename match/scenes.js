export const SCENES = {
  midfield_pass: {
    src: 'scenes/pase-en-mediocampo.jpg',
    title: 'Pase en mediocampo',
    alt: 'Escena pixelart de un pase en el mediocampo',
  },
  defensive_pass: {
    src: 'scenes/pase-en-defensa.jpg',
    title: 'Salida desde atrás',
    alt: 'Escena pixelart de pase en defensa',
  },
  defensive_recovery: {
    src: 'scenes/recuperacion-de-defensa.jpg',
    title: 'Recuperación defensiva',
    alt: 'Escena pixelart de una recuperación de la defensa',
  },
  shot: {
    src: 'scenes/remate-de-delantero.jpg',
    title: 'Remate',
    alt: 'Escena pixelart de un delantero rematando',
  },
  cross: {
    src: 'scenes/centro-al-area.jpg',
    title: 'Centro al área',
    alt: 'Escena pixelart de un centro al área',
  },
  free_kick: {
    src: 'scenes/tiro-libre.jpg',
    title: 'Tiro libre',
    alt: 'Escena pixelart de un tiro libre',
  },
  free_kick_goal: {
    src: 'scenes/tiro-libre.jpg',
    title: 'Gol de tiro libre',
    alt: 'Escena pixelart de un tiro libre peligroso',
  },
  penalty: {
    src: 'scenes/gol-de-penal.jpg',
    title: 'Penal',
    alt: 'Escena pixelart de un penal',
  },
  penalty_goal: {
    src: 'scenes/gol-de-penal.jpg',
    title: 'Gol de penal',
    alt: 'Escena pixelart de un gol de penal',
  },
  shot_goal: {
    src: 'scenes/gol-de-remate.jpg',
    title: 'Gol de remate',
    alt: 'Escena pixelart de un gol de remate',
  },
  shot_goal_alt: {
    src: 'scenes/gol-de-remate-2.jpg',
    title: 'Gol de remate',
    alt: 'Escena pixelart alternativa de un gol de remate',
  },
  header_goal: {
    src: 'scenes/gol-de-cabeza.jpg',
    title: 'Gol de cabeza',
    alt: 'Escena pixelart de un gol de cabeza',
  },
  yellow_foul: {
    src: 'scenes/falta-y-amarilla.jpg',
    title: 'Falta y amarilla',
    alt: 'Escena pixelart de una falta con tarjeta amarilla',
  },
  red_foul: {
    src: 'scenes/falta-y-roja.jpg',
    title: 'Falta y roja',
    alt: 'Escena pixelart de una falta con tarjeta roja',
  },
  goal_kick: {
    src: 'scenes/saque-de-arco.jpg',
    title: 'Saque de arco',
    alt: 'Escena pixelart de un saque de arco',
  },
};

const TYPE_FALLBACK = {
  gol: 'shot_goal',
  parada: 'shot',
  tiro_fuera: 'shot',
  bloqueo: 'shot',
  perdida: 'defensive_recovery',
  pase_fuera: 'midfield_pass',
  falta: 'yellow_foul',
  fuera_juego: 'midfield_pass',
  despeje: 'defensive_recovery',
  sin_remate: 'midfield_pass',
  construccion_fallida: 'defensive_recovery',
  contraataque: 'shot',
};

function fallbackKey(ev) {
  if (ev.phase === 'penalty') return ev.type === 'gol' ? 'penalty_goal' : 'penalty';
  if (ev.phase === 'free_kick') return ev.type === 'gol' ? 'free_kick_goal' : 'free_kick';
  if (ev.phase === 'corner') return ev.type === 'gol' ? 'header_goal' : 'cross';
  return TYPE_FALLBACK[ev.type] || 'midfield_pass';
}

export function sceneForEvent(ev = {}) {
  const key = SCENES[ev.pattern] ? ev.pattern : fallbackKey(ev);
  return { key, ...(SCENES[key] || SCENES.midfield_pass) };
}

export function sceneSources() {
  return [...new Set(Object.values(SCENES).map((scene) => scene.src))];
}
