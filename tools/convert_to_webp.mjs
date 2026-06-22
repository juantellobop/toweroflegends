#!/usr/bin/env node
// Torre de Leyendas — Conversión local de imágenes a WebP (offline, commiteable).
//
// El servidor de producción NO transforma imágenes (sirve los archivos tal cual);
// el CSS/JS se minifica en runtime pero las imágenes deben venir ya optimizadas
// desde el repo. Este script convierte PNG/JPG a WebP usando `cwebp` (binario de
// libwebp), del mismo modo que los retratos se generan localmente y se commitean.
//
// Uso:
//   node tools/convert_to_webp.mjs --dry-run            # lista qué haría
//   node tools/convert_to_webp.mjs --replace            # convierte y borra el original
//   node tools/convert_to_webp.mjs --only=ui,items      # solo esas categorías
//   node tools/convert_to_webp.mjs                       # convierte, conserva originales
//
// Compatibilidad: el target es Safari 16.2+, que soporta WebP de sobra, así que se
// sirve WebP-only (sin <picture> ni fallback). El binario cwebp se instala con
// `brew install webp` y NUNCA entra en la ruta de request del servidor.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const REPLACE = args.includes('--replace');
const onlyArg = args.find((a) => a.startsWith('--only='));
const ONLY = onlyArg ? onlyArg.slice('--only='.length).split(',').map((s) => s.trim()).filter(Boolean) : null;

// Categorías: cada una define dónde buscar, qué extensiones convertir y la calidad
// cwebp por tipo de imagen. Las cromos/fotográficas van lossy q80-82; los items y
// retratos con alpha conservan el alfa sin pérdida (-alpha_q 100). Los SVG y el
// favicon quedan fuera (vectoriales / referencia explícita en index.html).
const CATEGORIES = {
  ui: {
    dir: 'assets/ui',
    recurse: true,
    // .png en assets/ui son las cromos (con detalle/alfa); .jpg son fondos, cartas,
    // dorsos y pósters (fotográficos, sin alfa).
    quality: (file) => /\.png$/i.test(file) ? ['-q', '82', '-alpha_q', '100'] : ['-q', '80'],
  },
  items: {
    dir: 'assets/items',
    recurse: false,
    quality: () => ['-q', '85', '-alpha_q', '100'], // 512×512 con transparencia
  },
  portraits: {
    dir: 'assets/player-portraits',
    recurse: true,
    // Retratos de jugador (.png, 192×192 pixel-art con paleta reducida): WebP
    // LOSSLESS bate al PNG indexado (~−48%); lossy a este tamaño sale MÁS grande.
    // Retratos de DT (manager_*.jpg, fotográficos): lossy q80.
    quality: (file) => /\.png$/i.test(file) ? ['-lossless'] : ['-q', '80'],
  },
};

function assertCwebp() {
  try {
    execFileSync('cwebp', ['-version'], { stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (_) {
    console.error('cwebp no está instalado. Instálalo con:  brew install webp');
    process.exit(1);
  }
}

function walk(dir, recurse) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (recurse) out.push(...walk(abs, recurse));
      continue;
    }
    if (/\.(?:png|jpe?g)$/i.test(entry.name)) out.push(abs);
  }
  return out;
}

function human(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function convertCategory(name, cfg) {
  const dirAbs = path.join(ROOT, cfg.dir);
  if (!existsSync(dirAbs)) { console.warn(`(saltada) ${name}: no existe ${cfg.dir}`); return null; }
  const files = walk(dirAbs, cfg.recurse);
  let srcTotal = 0;
  let webpTotal = 0;
  let converted = 0;
  let larger = 0;
  for (const src of files) {
    const out = src.replace(/\.(?:png|jpe?g)$/i, '.webp');
    const srcSize = statSync(src).size;
    srcTotal += srcSize;
    const rel = path.relative(ROOT, src);
    if (DRY_RUN) { converted += 1; continue; }
    execFileSync('cwebp', [...cfg.quality(src), '-m', '6', '-quiet', src, '-o', out]);
    const webpSize = statSync(out).size;
    webpTotal += webpSize;
    converted += 1;
    if (webpSize >= srcSize) {
      larger += 1;
      console.warn(`  ! ${rel}: webp (${human(webpSize)}) ≥ original (${human(srcSize)})`);
    }
    if (REPLACE) unlinkSync(src);
  }
  const saved = srcTotal - webpTotal;
  console.log(`[${name}] ${converted} archivos · origen ${human(srcTotal)}` +
    (DRY_RUN ? ' (dry-run, sin escribir)' : ` → webp ${human(webpTotal)} (ahorro ${human(saved)}, ${srcTotal ? Math.round(100 * saved / srcTotal) : 0}%)`) +
    (larger ? ` · ${larger} más grandes que el original` : '') +
    (REPLACE && !DRY_RUN ? ' · originales borrados' : ''));
  return { srcTotal, webpTotal };
}

assertCwebp();
const targets = Object.entries(CATEGORIES).filter(([name]) => !ONLY || ONLY.includes(name));
if (!targets.length) {
  console.error(`Nada que convertir. Categorías válidas: ${Object.keys(CATEGORIES).join(', ')}`);
  process.exit(1);
}
console.log(`Conversión WebP${DRY_RUN ? ' (dry-run)' : ''}${REPLACE ? ' [reemplazo in-place]' : ' [conserva originales]'} · categorías: ${targets.map(([n]) => n).join(', ')}`);
let grandSrc = 0;
let grandWebp = 0;
for (const [name, cfg] of targets) {
  const r = convertCategory(name, cfg);
  if (r) { grandSrc += r.srcTotal; grandWebp += r.webpTotal; }
}
if (!DRY_RUN) {
  const saved = grandSrc - grandWebp;
  console.log(`TOTAL: ${human(grandSrc)} → ${human(grandWebp)} (ahorro ${human(saved)}, ${grandSrc ? Math.round(100 * saved / grandSrc) : 0}%)`);
}
