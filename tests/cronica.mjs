// Torre de Leyendas — Test de la crónica de prensa.
// Comprueba que el artículo se genera para cualquier partido simulado, que es
// determinista, que la figura sale del bando correcto y que la longitud ronda
// los ~1500 caracteres pedidos por diseño (banda y media controladas).

import assert from 'node:assert/strict';
import { RNG } from '../engine/rng.js';
import { simularPartido } from '../engine/simulate.js';
import { buildCronica } from '../engine/cronica.js';
import { generateOpponent } from '../data/opponents.js';
import { PLAYERS } from '../data/players.js';
import { LANGUAGES, setLanguage } from '../data/i18n.js';

function byId(id) {
  return PLAYERS.find((p) => p.id === id);
}

const team = {
  name: 'Leyendas',
  color: '#D4AF37',
  items: [],
  starting11: {
    GK: [byId('gk_buffon_2006')],
    DEF: [byId('def_maldini_1994'), byId('def_cannavaro_2006'), byId('def_carlos_2002'), byId('def_cafu_2002')],
    MID: [byId('mid_zidane_1998'), byId('mid_xavi_2010'), byId('mid_gerrard_2006')],
    FWD: [byId('fwd_ronaldo_2002'), byId('fwd_henry_2006'), byId('fwd_batistuta_1998')],
  },
};

const ctx = { teamName: 'Leyendas', oppName: 'Brasil', level: 7 };
const articleLength = (cronica) => cronica.paragraphs.join('\n\n').length;

// — Determinismo: el mismo partido produce la misma crónica.
const match = simularPartido(team, generateOpponent(5, new RNG(7)), new RNG(42));
assert.deepEqual(buildCronica(match, ctx), buildCronica(match, ctx));

// — Sin partido narrable no hay crónica (y no revienta).
assert.equal(buildCronica(null, ctx), null);
assert.equal(buildCronica({ golesA: 0, golesB: 0, eventos: [] }, ctx), null);

// — Banda de longitud y figura del bando correcto sobre muchos partidos.
const lengths = [];
for (let seed = 1; seed <= 400; seed++) {
  const level = (seed % 30) + 1;
  const m = simularPartido(team, generateOpponent(level, new RNG(10000 + seed)), new RNG(seed));
  const cronica = buildCronica(m, { ...ctx, level });
  assert.ok(cronica, `sin crónica para seed ${seed}`);
  assert.equal(cronica.paragraphs.length, 4);
  assert.ok(cronica.headline.length > 10, `titular vacío (seed ${seed})`);
  assert.ok(cronica.figure.name, `figura vacía (seed ${seed})`);
  if (m.golesA > m.golesB) assert.equal(cronica.figure.side, 'A', `figura rival en victoria (seed ${seed})`);
  if (m.golesA < m.golesB) assert.equal(cronica.figure.side, 'B', `figura propia en derrota (seed ${seed})`);
  const len = articleLength(cronica);
  assert.ok(len >= 950 && len <= 2200, `longitud ${len} fuera de banda (seed ${seed})`);
  lengths.push(len);
}
const mean = Math.round(lengths.reduce((s, n) => s + n, 0) / lengths.length);
assert.ok(mean >= 1300 && mean <= 1700, `media ${mean} lejos de ~1500`);

// — Todos los idiomas generan crónica dentro de banda.
for (const { code } of LANGUAGES) {
  setLanguage(code);
  for (let seed = 1; seed <= 25; seed++) {
    const m = simularPartido(team, generateOpponent(8, new RNG(20000 + seed)), new RNG(seed));
    const cronica = buildCronica(m, ctx);
    const len = articleLength(cronica);
    assert.ok(len >= 900 && len <= 2300, `(${code}) longitud ${len} fuera de banda (seed ${seed})`);
  }
}
setLanguage('es');

console.log(`Crónica de prensa: OK (media ${mean} caracteres, mín ${Math.min(...lengths)}, máx ${Math.max(...lengths)})`);
