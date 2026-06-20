// Torre de Leyendas — Radar de estadísticas de equipo (pentágono, 5 ejes).
// Sustituye a las barras/numerales de fuerza de equipo: ataque, medio, defensa,
// portería y físico, en el orden de la rosa de las casas de fútbol. Una sola
// función produce el SVG; el color tiñe el polígono (color del equipo o rival).

import { esc } from './dom.js';
import { t } from '../data/i18n.js';

// Ejes en orden horario desde arriba. Las etiquetas cortas (ATA/MED/DEF/POR/FÍS)
// salen del diccionario de ratings.
const AXES = ['attack', 'midfield', 'defense', 'gk', 'physical'];

const CX = 50;
const CY = 50;
const R = 30; // radio del pentágono dentro del viewBox 0-100

// Vértice i a un radio dado (i=0 arriba; +72° horario).
function vertex(i, radius) {
  const ang = ((-90 + i * 72) * Math.PI) / 180;
  return [CX + radius * Math.cos(ang), CY + radius * Math.sin(ang)];
}

function polygonPoints(radii) {
  return radii.map((radius, i) => vertex(i, radius).map((n) => n.toFixed(2)).join(',')).join(' ');
}

// Radar de equipo. `stats` = { attack, midfield, defense, gk, physical }. `max`
// normaliza (un valor ≥ max = pentágono más grande, en el borde). El tope es 200:
// los ratings no están limitados a 100 (con química/objetos/DT llegan a ~180).
// `color` tiñe el polígono de datos.
export function teamRadarHTML(stats, { color = 'var(--arcade-cyan)', max = 200, ariaLabel = '' } = {}) {
  const norm = (v) => Math.max(0.04, Math.min(1, (Number(v) || 0) / max));
  const label = ariaLabel || AXES.map((k) => `${t(`ratings.${k}`)} ${Math.round(Number(stats[k]) || 0)}`).join(', ');

  // Anillos de fondo (pentágonos concéntricos) + radios (uno por eje).
  const rings = [0.25, 0.5, 0.75, 1]
    .map((f) => `<polygon class="radar-ring" points="${polygonPoints(AXES.map(() => R * f))}" />`)
    .join('');
  const spokes = AXES.map((_, i) => {
    const [x, y] = vertex(i, R);
    return `<line class="radar-spoke" x1="${CX}" y1="${CY}" x2="${x.toFixed(2)}" y2="${y.toFixed(2)}" />`;
  }).join('');

  // Polígono de datos + vértices.
  const dataRadii = AXES.map((key) => R * norm(stats[key]));
  const area = `<polygon class="radar-area" points="${polygonPoints(dataRadii)}" />`;
  const dots = AXES.map((key, i) => {
    const [x, y] = vertex(i, R * norm(stats[key]));
    return `<circle class="radar-dot" cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.4" />`;
  }).join('');

  // Etiquetas + valor en cada vértice (fuera del pentágono; overflow visible).
  const labels = AXES.map((key, i) => {
    const [lx, ly] = vertex(i, R + 11);
    const anchor = Math.abs(lx - CX) < 4 ? 'middle' : (lx > CX ? 'start' : 'end');
    const baseline = ly < CY - 6 ? 'auto' : (ly > CY + 6 ? 'hanging' : 'middle');
    return `<text class="radar-label" x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" text-anchor="${anchor}" dominant-baseline="${baseline}">${esc(t(`ratings.${key}`))} <tspan class="radar-val">${Math.round(Number(stats[key]) || 0)}</tspan></text>`;
  }).join('');

  // viewBox 4/3 ajustado al contenido (pentágono centro 50,50, R=30 + etiquetas):
  // ratio igual al del bloque, así el gráfico llena el alto sin letterbox y queda
  // centrado verticalmente, dejando solo un margen mínimo para las etiquetas.
  return `<div class="team-radar" role="img" aria-label="${esc(label)}" style="--radar-color:${esc(color)}">
    <svg viewBox="-14 -2 128 96" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      ${rings}${spokes}${area}${dots}${labels}
    </svg>
  </div>`;
}
