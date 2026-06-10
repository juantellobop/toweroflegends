// Torre de Leyendas — Utilidades de DOM compartidas por todas las pantallas.

// Escapa texto para interpolarlo en plantillas HTML (atributos incluidos).
export function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Preferencia de "menos movimiento" del sistema (se consulta en cada uso:
// puede cambiar en caliente desde los ajustes de accesibilidad).
export const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
