// Torre de Leyendas — Feedback de momentos clave (§5.6, §2.9 del plan).
// Confeti sobrio en el color del equipo, háptica progresiva y conteo del
// marcador. Todo degrada con elegancia: respeta prefers-reduced-motion y
// silencia donde no haya soporte.

const reduceMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Vibración corta como mejora progresiva (no funciona en Safari iOS → silencio).
export function haptic(pattern = 18) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch { /* sin soporte */ }
}

// Conteo animado de un número en un nodo (marcador que "sube").
export function countTo(node, value, opts = {}) {
  if (!node) return;
  const from = parseInt(node.textContent, 10) || 0;
  if (reduceMotion() || from === value || typeof requestAnimationFrame !== 'function') {
    node.textContent = String(value);
    return;
  }
  const dur = opts.duration || 420;
  const t0 = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - t0) / dur);
    node.textContent = String(Math.round(from + (value - from) * k));
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Confeti sobrio: pocas piezas, en el color dado, caída breve. Se monta sobre
// `host` (posición relativa) y se autolimpia.
export function confetti(host, color = '#FFD60A') {
  if (!host || reduceMotion()) return;
  const layer = document.createElement('div');
  layer.className = 'confetti-layer';
  const N = 26;
  for (let i = 0; i < N; i++) {
    const p = document.createElement('i');
    p.className = 'confetti-piece';
    const tint = i % 3 === 0 ? '#FFFFFF' : color;
    p.style.background = tint;
    p.style.left = Math.random() * 100 + '%';
    p.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
    p.style.setProperty('--rot', (Math.random() * 540 - 270) + 'deg');
    p.style.animationDelay = (Math.random() * 120) + 'ms';
    p.style.animationDuration = (900 + Math.random() * 700) + 'ms';
    layer.appendChild(p);
  }
  host.appendChild(layer);
  setTimeout(() => layer.remove(), 1900);
}
