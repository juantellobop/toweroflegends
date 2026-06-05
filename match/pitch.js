// Torre de Leyendas — Render del campo 2D en SVG (§5.4 del plan UI/UX).
// Vista cenital (portrait): el equipo local defiende abajo y ataca hacia arriba;
// el rival, al revés. Las fichas se colocan por LÍNEA de la formación (no hay
// táctica real: basta una disposición coherente). El balón viaja por la cadena
// de jugadores implicados del evento. Estética Apple: plano, limpio, sin texturas.
//
// El SVG se construye UNA vez y se reutilizan los nodos (§6.3): cada evento solo
// anima el balón (y unas pocas fichas), nunca se recrea el árbol.

const NS = 'http://www.w3.org/2000/svg';
const W = 100, H = 150;            // viewBox en unidades de usuario (≈ user px)

// Formaciones por defecto del rival (no conocemos sus once nominal).
const AWAY_SHAPE = { GK: 1, DEF: 4, MID: 3, FWD: 3 };

function el(tag, attrs = {}) {
  const node = document.createElementNS(NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
}

// Reparte `n` fichas a lo ancho del campo con márgenes simétricos.
function spreadX(n) {
  if (n <= 0) return [];
  if (n === 1) return [50];
  const margin = 16;
  const span = W - margin * 2;
  return Array.from({ length: n }, (_, i) => margin + (span * i) / (n - 1));
}

// Coordenada Y de cada línea según el lado del campo.
// home: GK abajo (defiende) → FWD arriba (ataca hacia el rival).
const LINE_Y = {
  home: { GK: 140, DEF: 120, MID: 100, FWD: 82 },
  away: { GK: 10,  DEF: 30,  MID: 50,  FWD: 68 },
};
const LINES = ['GK', 'DEF', 'MID', 'FWD'];

export class Pitch {
  constructor({ homeColor = '#D4AF37', awayColor = '#888', homeShape = AWAY_SHAPE,
                reduceMotion = false } = {}) {
    this.reduce = reduceMotion;
    this.svg = el('svg', {
      viewBox: `0 0 ${W} ${H}`, class: 'pitch-svg',
      preserveAspectRatio: 'xMidYMid meet', role: 'img',
      'aria-label': 'Campo de juego simulado',
    });
    this.camera = el('g', { class: 'pitch-camera' });
    this.svg.appendChild(this.camera);

    this._drawField();
    this.chips = { home: [], away: [] };
    this._drawTeam('home', homeColor, homeShape);
    this._drawTeam('away', awayColor, AWAY_SHAPE);
    this._drawBall();
  }

  _drawField() {
    const g = this.camera;
    g.appendChild(el('rect', { x: 0, y: 0, width: W, height: H, rx: 4, fill: 'var(--pitch)' }));
    // Franjas de césped alternas, sutiles.
    for (let i = 0; i < H; i += 18) {
      g.appendChild(el('rect', { x: 0, y: i, width: W, height: 9, fill: 'var(--pitch-dark)', opacity: 0.5 }));
    }
    const ln = { fill: 'none', stroke: 'var(--pitch-line)', 'stroke-width': 0.6 };
    g.appendChild(el('rect', { x: 4, y: 4, width: W - 8, height: H - 8, ...ln }));      // borde
    g.appendChild(el('line', { x1: 4, y1: H / 2, x2: W - 4, y2: H / 2, ...ln }));        // medio
    g.appendChild(el('circle', { cx: W / 2, cy: H / 2, r: 10, ...ln }));                 // círculo central
    g.appendChild(el('circle', { cx: W / 2, cy: H / 2, r: 1, fill: 'var(--pitch-line)' }));
    // Áreas y porterías arriba/abajo.
    g.appendChild(el('rect', { x: 28, y: 4, width: 44, height: 18, ...ln }));
    g.appendChild(el('rect', { x: 28, y: H - 22, width: 44, height: 18, ...ln }));
    g.appendChild(el('rect', { x: 40, y: 2, width: 20, height: 3, fill: 'var(--pitch-line)', opacity: 0.9 }));
    g.appendChild(el('rect', { x: 40, y: H - 5, width: 20, height: 3, fill: 'var(--pitch-line)', opacity: 0.9 }));
  }

  _drawTeam(side, color, shape) {
    let dorsal = side === 'home' ? 1 : 1;
    for (const line of LINES) {
      const n = shape[line] || 0;
      const xs = spreadX(n);
      const y = LINE_Y[side][line];
      xs.forEach((x) => {
        const chip = el('g', { class: `chip chip-${side}`, transform: `translate(${x} ${y})` });
        chip.appendChild(el('circle', { r: 4.2, fill: color, stroke: 'rgba(255,255,255,0.85)', 'stroke-width': 0.5 }));
        const t = el('text', {
          x: 0, y: 1.4, 'text-anchor': 'middle', 'font-size': 4.2,
          fill: '#fff', 'font-weight': 700, class: 'chip-num',
        });
        t.textContent = String(dorsal === 1 && line === 'GK' ? 1 : dorsal);
        chip.appendChild(t);
        this.camera.appendChild(chip);
        this.chips[side].push({ node: chip, line, x, y });
        dorsal += 1;
      });
    }
  }

  _drawBall() {
    this.ballLayer = el('g', { class: 'ball-layer' });
    this.ball = el('circle', { r: 1.9, fill: '#fff', stroke: 'rgba(0,0,0,0.25)', 'stroke-width': 0.4 });
    this.ballLayer.appendChild(this.ball);
    this.camera.appendChild(this.ballLayer);
    this._moveBallTo(W / 2, H / 2, true);
  }

  _moveBallTo(x, y, instant = false) {
    this.ballLayer.setAttribute('transform', `translate(${x} ${y})`);
    this.ballPos = { x, y };
  }

  // Un punto representativo de una línea/lado (centro de la línea con leve azar).
  _chipPoint(side, line, jitter = 0) {
    const pool = this.chips[side].filter((c) => c.line === line);
    const c = pool[Math.floor((pool.length * 0.5))] || { x: 50, y: 75 };
    return { x: c.x + (Math.random() * 2 - 1) * jitter, y: c.y };
  }

  // Anima el balón a través de una secuencia de puntos. Devuelve una promesa
  // que resuelve al terminar. Si no hay WAAPI (jsdom/tests), salta al destino.
  _travel(points, totalDur) {
    const last = points[points.length - 1];
    const from = this.ballPos;
    if (this.reduce || typeof this.ballLayer.animate !== 'function') {
      this._moveBallTo(last.x, last.y);
      return Promise.resolve();
    }
    const frames = [
      { transform: `translate(${from.x}px, ${from.y}px)` },
      ...points.map((p) => ({ transform: `translate(${p.x}px, ${p.y}px)` })),
    ];
    // El atributo subyacente ya apunta al destino: cuando la animación (sin
    // `fill`) termina, el balón descansa ahí y reset() puede recolocarlo luego.
    this._moveBallTo(last.x, last.y);
    const anim = this.ballLayer.animate(frames, {
      duration: Math.max(120, totalDur), easing: 'cubic-bezier(0.32,0.72,0,1)',
    });
    return anim.finished.catch(() => {});
  }

  _flashGoal(side) {
    // Destello en la portería atacada (la del rival del que ataca).
    const y = side === 'home' ? 3 : H - 3;
    const flash = el('rect', { x: 36, y: y - 2, width: 28, height: 6, rx: 1, fill: '#fff', opacity: 0.9, class: 'goal-flash' });
    this.camera.appendChild(flash);
    if (!this.reduce && typeof flash.animate === 'function') {
      flash.animate([{ opacity: 0.9 }, { opacity: 0 }], { duration: 500, easing: 'ease-out' })
        .finished.catch(() => {}).then(() => flash.remove());
    } else {
      setTimeout(() => flash.remove(), 0);
    }
  }

  _celebrate(side) {
    if (this.reduce) return;
    this.chips[side].forEach((c) => {
      if (typeof c.node.animate !== 'function') return;
      c.node.animate(
        [{ transform: `translate(${c.x}px,${c.y}px) scale(1)` },
         { transform: `translate(${c.x}px,${c.y}px) scale(1.35)` },
         { transform: `translate(${c.x}px,${c.y}px) scale(1)` }],
        { duration: 600, easing: 'cubic-bezier(0.2,0.9,0.1,1)' }
      );
    });
  }

  // Pan/zoom de cámara hacia una zona (opcional, estilo FM). Vuelve solo al
  // plano general entre jugadas mediante reset().
  _camera(toY, zoom = 1) {
    if (this.reduce || typeof this.camera.animate !== 'function') return;
    const ty = (H / 2 - toY) * (zoom - 1) / zoom;
    this.camera.animate(
      [{ transform: `scale(${zoom}) translate(0px, ${ty}px)` }],
      { duration: 500, fill: 'forwards', easing: 'ease-out' }
    );
  }
  _cameraReset() {
    if (this.reduce || typeof this.camera.animate !== 'function') return;
    this.camera.animate([{ transform: 'scale(1) translate(0,0)' }],
      { duration: 400, fill: 'forwards', easing: 'ease-out' });
  }

  // === API que usa el director ===
  // Reproduce una fase. `side` = 'home'|'away' (quién ataca). Devuelve promesa.
  async animate(phase, { side = 'home', duration = 1500, counter = false } = {}) {
    const attackGoalY = side === 'home' ? 6 : H - 6;
    const mid = side === 'home' ? 'MID' : 'MID';
    const fwd = side === 'home' ? 'FWD' : 'FWD';
    const def = side === 'home' ? 'home' : 'away';

    switch (phase) {
      case 'turnover': {
        // El rival corta: balón va a un defensor del otro lado, cambia de lado.
        const other = side === 'home' ? 'away' : 'home';
        const p = this._chipPoint(other, 'MID', 6);
        this.ball.setAttribute('fill', '#fff');
        await this._travel([this._chipPoint(side, 'MID', 8), p], duration);
        break;
      }
      case 'blocked': {
        // Avanza al tercio de ataque y la defensa lo devuelve atrás.
        const up = { x: 50 + (Math.random() * 20 - 10), y: side === 'home' ? 92 : 58 };
        await this._travel([up, this._chipPoint(side, 'MID', 10)], duration);
        break;
      }
      case 'save': {
        if (counter) this._camera(attackGoalY, 1.15);
        const a = this._chipPoint(side, mid, 8);
        const s = this._chipPoint(side, fwd, 8);
        await this._travel([a, s], duration * 0.5);
        this._flashGoal(side);
        await this._travel([{ x: 50, y: attackGoalY }], duration * 0.4);
        // rebote: el portero la saca.
        await this._travel([this._chipPoint(side, fwd, 12)], duration * 0.2);
        this._cameraReset();
        break;
      }
      case 'goal': {
        this._camera(attackGoalY, 1.2);
        const a = this._chipPoint(side, mid, 8);
        const s = this._chipPoint(side, fwd, 8);
        await this._travel([a, s], duration * 0.45);
        await this._travel([{ x: 50, y: attackGoalY }], duration * 0.3);
        this._flashGoal(side);
        this._celebrate(side);
        await this._wait(duration * 0.25);
        this._cameraReset();
        break;
      }
      case 'buildup':
      default: {
        await this._travel([this._chipPoint(side, 'MID', 12)], duration);
      }
    }
  }

  _wait(ms) {
    return new Promise((r) => setTimeout(r, Math.max(0, ms)));
  }

  // Vuelve el balón al centro entre jugadas (plano general).
  reset() {
    this._moveBallTo(W / 2, H / 2);
    this._cameraReset();
  }
}
