// Torre de Leyendas — Asignación one-off de rasgos a jugadores epic/legend
// sin rasgo, coherente con su perfil de stats. Uso:
//   node tools/assign_traits.mjs            → dry-run (muestra el reparto)
//   node tools/assign_traits.mjs --apply    → reescribe data/players.js
// El formato de salida replica el del panel admin (tools/admin_server.mjs).

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PLAYERS } from '../data/players.js';
import { playerOVR } from '../engine/ovr.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'data', 'players.js');
const APPLY = process.argv.includes('--apply');

const MAX_NEW = 140; // tope: ~25% del catálogo con rasgo, sesgado a los mejores
const eligible = (p) => (p.rarity === 'epic' || p.rarity === 'legend') && !p.trait;

// --- Capitán: el mejor legend elegible de cada selección con plantel amplio ---
const groups = new Map();
for (const p of PLAYERS) {
  const key = `${p.nation}|${p.era}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(p);
}
const captains = new Set();
for (const members of groups.values()) {
  if (members.length < 8) continue; // solo selecciones con plantel real
  const best = members
    .filter((p) => eligible(p) && p.rarity === 'legend')
    .sort((a, b) => playerOVR(b) - playerOVR(a))[0];
  if (best) captains.add(best.id);
}

// --- Rasgo por DISTINTIVIDAD: la stat en la que el jugador más se separa de
// la media de su posición define su arquetipo (evita que todos los DEF caigan
// en Muro solo porque su corte es su mejor stat). ---
const FIELD_STATS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];
const GK_STATS = ['reflexes', 'handling', 'positioning'];
const statsBy = new Map();
for (const pos of ['DEF', 'MID', 'FWD', 'GK']) {
  const pool = PLAYERS.filter((p) => p.position === pos);
  const keys = pos === 'GK' ? GK_STATS : FIELD_STATS;
  const dist = {};
  for (const k of keys) {
    const src = pos === 'GK' ? pool.map((p) => p.gk?.[k] || 0) : pool.map((p) => p.stats?.[k] || 0);
    const mean = src.reduce((a, b) => a + b, 0) / (src.length || 1);
    const variance = src.reduce((a, b) => a + (b - mean) ** 2, 0) / (src.length || 1);
    dist[k] = { mean, std: Math.sqrt(variance) || 1 };
  }
  statsBy.set(pos, dist);
}

const TRAIT_BY_DEVIATION = {
  GK: { positioning: 'Mariscal', reflexes: 'Paradón', handling: 'Muro' },
  DEF: { defending: 'Muro', physical: 'Garra', passing: 'Líbero', pace: 'Velocista', dribbling: 'Líbero', shooting: 'Especialista' },
  MID: { passing: 'Maestro', physical: 'Motor', pace: 'Velocista', shooting: 'Especialista', dribbling: 'Maestro', defending: 'Motor' },
  FWD: { shooting: 'Killer', pace: 'Velocista', physical: 'Cañón', passing: 'Penalero', dribbling: 'Velocista', defending: 'Cañón' },
};

function traitFor(p) {
  if (captains.has(p.id)) return 'Capitán';
  const dist = statsBy.get(p.position);
  const keys = p.position === 'GK' ? GK_STATS : FIELD_STATS;
  const src = p.position === 'GK' ? (p.gk || {}) : (p.stats || {});
  // Lanzador de faltas clásico (perfil Beckham): golpeo muy por encima de su
  // posición + gran pase. Va antes del argmax porque el pase puro los
  // arrastraría a Maestro/Líbero.
  if (p.position === 'MID' || p.position === 'DEF') {
    const zShoot = ((src.shooting || 0) - dist.shooting.mean) / dist.shooting.std;
    if (zShoot >= 1.3 && (src.passing || 0) >= 86) return 'Especialista';
  }
  // z-score: en qué stat se separa más de su posición, en unidades comparables.
  const best = keys
    .map((k) => ({ k, z: ((src[k] || 0) - dist[k].mean) / dist[k].std }))
    .sort((a, b) => b.z - a.z)[0];
  const trait = TRAIT_BY_DEVIATION[p.position][best.k];
  // Killer solo para los rematadores de élite; el resto hereda Francotirador.
  if (trait === 'Killer' && playerOVR(p) < 90) return 'Francotirador';
  return trait;
}

// Los mejores primero: capitanes garantizados y luego por OVR hasta el tope.
const picked = new Set(captains);
const byOvr = PLAYERS.filter((p) => eligible(p) && !captains.has(p.id))
  .sort((a, b) => playerOVR(b) - playerOVR(a));
for (const p of byOvr) {
  if (picked.size >= MAX_NEW) break;
  picked.add(p.id);
}

const assigned = new Map();
const next = PLAYERS.map((p) => {
  if (!picked.has(p.id) || !eligible(p)) return p;
  const trait = traitFor(p);
  assigned.set(trait, (assigned.get(trait) || 0) + 1);
  return { ...p, trait };
});

const total = next.filter((p) => p.trait).length;
console.log(`Asignados: ${[...assigned.values()].reduce((a, b) => a + b, 0)} nuevos · con rasgo: ${total}/${PLAYERS.length} (${(total * 100 / PLAYERS.length).toFixed(1)}%)`);
console.log([...assigned.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}: ${n}`).join('\n'));

if (APPLY) {
  const source = `// Torre de Leyendas — Base directa de jugadores.
// Este archivo es la fuente de verdad del roster jugable. El panel admin lo
// reescribe directamente cuando se guardan estadisticas o metadatos.
// Retratos: assets/player-portraits/{id}.png.

export const PLAYERS = ${JSON.stringify(next, null, 2)};
`;
  await fs.writeFile(FILE, source, 'utf8');
  console.log(`\nEscrito ${path.relative(ROOT, FILE)}`);
} else {
  console.log('\nDry-run (usa --apply para escribir data/players.js)');
}
