// Torre de Leyendas — Marcas del campo compartidas (tablero táctico, scouting
// y once del ranking). Se dibujan en un viewBox 0-100 con
// preserveAspectRatio="none": las medidas son relativas al tablero (se estiran
// con él), no a un campo real a escala. Solo trazos estáticos (.fl): nada animado.

// Reparto vertical de las líneas: extremos cerca de las áreas para que el once
// ocupe casi todo el alto del tablero (menos césped vacío arriba y abajo).
export const LINE_TOP = { GK: 89, DEF: 67, MID: 43, FWD: 16 };

// Coordenadas horizontales (en %) de los n jugadores de una línea. Cuantos
// menos jugadores, más centrados (una pareja no va pegada a la banda); las
// líneas llenas (4-5) abren casi todo el ancho del tablero.
export function lineSpreadX(n) {
  if (n <= 1) return [50];
  const margin = n <= 2 ? 27 : n === 3 ? 15 : 9;
  return Array.from({ length: n }, (_, i) => margin + ((100 - margin * 2) * i) / (n - 1));
}

export const PITCH_MARKINGS = `
  <rect x="1" y="1" width="98" height="98" rx="3" class="fl" />
  <line x1="1" y1="50" x2="99" y2="50" class="fl" />
  <circle cx="50" cy="50" r="9" class="fl" />
  <circle cx="50" cy="50" r="0.7" class="fl fl-spot" />

  <!-- Fondo superior: área grande, área chica, punto penal y medialuna -->
  <rect x="26" y="1" width="48" height="14" class="fl" />
  <rect x="37" y="1" width="26" height="5.5" class="fl" />
  <circle cx="50" cy="10.5" r="0.7" class="fl fl-spot" />
  <path d="M 42.5 15 A 9 9 0 0 0 57.5 15" class="fl" />

  <!-- Fondo inferior: simétrico -->
  <rect x="26" y="85" width="48" height="14" class="fl" />
  <rect x="37" y="93.5" width="26" height="5.5" class="fl" />
  <circle cx="50" cy="89.5" r="0.7" class="fl fl-spot" />
  <path d="M 42.5 85 A 9 9 0 0 1 57.5 85" class="fl" />

  <!-- Arcos de córner -->
  <path d="M 1 4.5 A 3.5 3.5 0 0 0 4.5 1" class="fl" />
  <path d="M 95.5 1 A 3.5 3.5 0 0 0 99 4.5" class="fl" />
  <path d="M 99 95.5 A 3.5 3.5 0 0 0 95.5 99" class="fl" />
  <path d="M 4.5 99 A 3.5 3.5 0 0 0 1 95.5" class="fl" />
`;
