// Torre de Leyendas — Director de reproducción del partido (§5.3 del plan).
// Consume `eventos[]` del motor y los reproduce en el tiempo, sincronizando
// por evento: animación en el campo + revelado de comentario + marcador.
// NO recalcula nada (misma semilla → misma reproducción). Soporta play/pausa,
// velocidad (1×/2×/4×), modos de visualización y saltar highlight / al final.

import { choreographyFor, commentFor, isKeyEvent, liveAnnounce } from './choreography.js';

export const MODES = {
  full: 'Highlights',
  key: 'Solo clave',
  commentary: 'Comentario',
  instant: 'Instantáneo',
};

// Reduce el spam de pérdidas en modo "full": muestra ~1 de cada 3.
function filterForMode(events, mode) {
  if (mode === 'key') return events.filter(isKeyEvent);
  if (mode === 'commentary' || mode === 'full') {
    let minor = 0;
    return events.filter((ev) => {
      if (['perdida', 'pase_fuera', 'sin_remate', 'despeje', 'fuera_juego'].includes(ev.type)) {
        minor += 1;
        return minor % 2 === 0;
      }
      return true;
    });
  }
  return events.slice();
}

export class MatchDirector {
  constructor({ events, homeName, pitch, result, speed = 1, mode = 'full', rng, callbacks = {} }) {
    this.allEvents = events.slice().sort((a, b) => a.minute - b.minute);
    this.homeName = homeName;
    this.pitch = pitch;
    this.result = result;
    this.speed = speed;
    this.mode = mode;
    this.rng = rng || { next: Math.random };
    this.cb = callbacks;

    this.clock = 0;
    this.scoreA = 0;
    this.scoreB = 0;
    this.momentum = 0.5;            // 0 = rival domina, 1 = local domina
    this._paused = true;
    this._cancelled = false;
    this._resume = null;            // resolver de la pausa
    this._skipHL = false;          // saltar al siguiente highlight
    this._finished = false;
  }

  sideOf(ev) { return ev.attackerTeam === this.homeName ? 'home' : 'away'; }

  setSpeed(x) { this.speed = x; }
  setMode(m) { this.mode = m; }   // se aplica al (re)iniciar

  isPaused() { return this._paused; }
  isFinished() { return this._finished; }

  play() {
    if (this._finished) return;
    this._paused = false;
    if (this._resume) { const r = this._resume; this._resume = null; r(); }
    if (!this._started) { this._started = true; this._run(); }
  }

  pause() { this._paused = true; }
  toggle() { this._paused ? this.play() : this.pause(); }

  skipHighlight() { this._skipHL = true; if (this._resume) { const r = this._resume; this._resume = null; r(); } }

  // Salta directo al marcador final (modo "resultado instantáneo").
  skipToEnd() {
    this._cancelled = true;
    if (this._resume) { const r = this._resume; this._resume = null; r(); }
    this._finalize();
  }

  destroy() { this._cancelled = true; if (this._resume) { const r = this._resume; this._resume = null; r(); } }

  // Espera `ms` (escalados por velocidad) respetando pausa y cancelación.
  // El tiempo en pausa no cuenta; se reanuda donde quedó.
  async _wait(ms) {
    let remaining = ms / this.speed;
    while (remaining > 0 && !this._cancelled && !this._skipHL) {
      if (this._paused) { await new Promise((r) => { this._resume = r; }); continue; }
      const slice = Math.min(remaining, 60);
      const t0 = Date.now();
      await new Promise((r) => setTimeout(r, slice));
      remaining -= (Date.now() - t0);
    }
  }

  // Avanza el reloj visual hasta `minute`, acelerando el hueco entre highlights.
  async _advanceClockTo(minute) {
    const target = Math.min(90, minute);
    if (target <= this.clock) { this.clock = target; this.cb.onClock?.(this.clock); return; }
    const gap = target - this.clock;
    const dur = Math.min(700, 120 + gap * 25); // ms para cubrir el hueco
    const steps = Math.max(1, Math.round(dur / 80));
    const from = this.clock;
    for (let s = 1; s <= steps; s++) {
      if (this._cancelled || this._skipHL) break;
      this.clock = Math.round(from + (gap * s) / steps);
      this.cb.onClock?.(this.clock);
      await this._wait(dur / steps);
    }
    this.clock = target;
    this.cb.onClock?.(this.clock);
  }

  _bumpMomentum(side) {
    const target = side === 'home' ? 0.82 : 0.18;
    this.momentum = this.momentum * 0.6 + target * 0.4;
    this.cb.onMomentum?.(this.momentum);
  }

  async _run() {
    const events = filterForMode(this.allEvents, this.mode);
    this.cb.onModeCount?.(events.length);

    if (this.mode === 'instant') { this._finalize(); return; }

    for (const ev of events) {
      if (this._cancelled) return;
      this._skipHL = false;

      await this._advanceClockTo(ev.minute);
      if (this._cancelled) return;

      const side = this.sideOf(ev);
      const coreo = choreographyFor(ev);
      const text = commentFor(ev, this.rng);
      this._bumpMomentum(side);

      const announce = liveAnnounce(ev);
      if (announce) this.cb.onAnnounce?.(announce);

      this.cb.onAnticipation?.(ev, text);
      await this._wait(this.mode === 'commentary' ? 80 : isKeyEvent(ev) ? 420 : 220);
      if (this._cancelled || this._skipHL) continue;

      const animate = this.mode === 'commentary'
        ? Promise.resolve()
        : typeof this.pitch?.animateEvent === 'function'
          ? this.pitch.animateEvent(ev, { side, duration: coreo.duration, counter: coreo.counter })
          : (this.pitch ? this.pitch.animate(coreo.phase, { side, duration: coreo.duration, counter: coreo.counter }) : Promise.resolve());

      const comment = Promise.resolve(this.cb.onComment?.(ev, text, {
        speed: this.speed,
        key: isKeyEvent(ev),
        duration: coreo.duration,
      }));
      await comment.catch(() => {});
      if (this._cancelled || this._skipHL) continue;

      if (ev.type === 'gol') {
        this.scoreA = ev.scoreA; this.scoreB = ev.scoreB;
        this.cb.onScore?.(this.scoreA, this.scoreB, ev);
        this.cb.onGoal?.(ev, side);
      } else if (ev.type === 'parada') {
        this.cb.onSave?.(ev, side);
      }

      const holdBase = this.mode === 'commentary' ? 420 : coreo.duration;
      await Promise.race([animate.catch(() => {}), this._wait(holdBase)]);
      // Deja respirar el texto una vez completado el typewriter.
      if (!this._skipHL) await this._wait(this.mode === 'commentary' ? 700 : 1500);
      // La escena del evento se mantiene visible hasta el siguiente highlight,
      // que entra con una transición suave (crossfade). No se vuelve al idle.
    }

    this._finalize();
  }

  _finalize() {
    if (this._finished) return;
    this._finished = true;
    this.scoreA = this.result.golesA;
    this.scoreB = this.result.golesB;
    this.clock = 90;
    this.cb.onClock?.(90);
    this.cb.onScore?.(this.scoreA, this.scoreB, null);
    this.cb.onEnd?.();
  }
}
