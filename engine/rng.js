// Torre de Leyendas — Generador aleatorio con semilla (§6.5).
// Determinista: misma semilla → misma secuencia, para reproducir partidos.
// Algoritmo: Mulberry32 (rápido, suficiente calidad para un juego).

export class RNG {
  constructor(seed = Date.now()) {
    this.seed = seed >>> 0;
    this.state = this.seed;
  }

  // Float en [0, 1).
  next() {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Booleano con probabilidad p de ser verdadero.
  bernoulli(p) {
    return this.next() < p;
  }

  // Entero en [min, max] inclusive.
  intBetween(min, max) {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  // Elige un elemento de un array (uniforme).
  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)];
  }

  // Selección ponderada: items = [{value, weight}, ...] → devuelve un value.
  weighted(items) {
    const total = items.reduce((s, it) => s + Math.max(0, it.weight), 0);
    if (total <= 0) return items.length ? items[0].value : null;
    let r = this.next() * total;
    for (const it of items) {
      r -= Math.max(0, it.weight);
      if (r <= 0) return it.value;
    }
    return items[items.length - 1].value;
  }
}

// Genera una semilla aleatoria de 32 bits.
export function randomSeed() {
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}
