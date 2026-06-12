#!/usr/bin/env node
// Torre de Leyendas — Bump de la versión visible del juego.
// Mantiene sincronizados data/version.js (la que ve el jugador en el menú)
// y el campo "version" de package.json.
//
// Uso manual:
//   node tools/bump_version.mjs            → patch (0.1.0 → 0.1.1)
//   node tools/bump_version.mjs minor      → minor (0.1.4 → 0.2.0)
//   node tools/bump_version.mjs major      → major (0.2.3 → 1.0.0)
//   (o npm run version:patch / version:minor / version:major)
//
// Modo hook (lo invoca .githooks/pre-commit en cada commit):
//   node tools/bump_version.mjs --auto
//   → sube el patch y añade los archivos al commit en curso. Respeta la
//     variable BUMP (BUMP=minor git commit ...) para cambios grandes, y no
//     toca nada si data/version.js ya viene staged (bump manual previo).

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION_FILE = path.join(ROOT, 'data', 'version.js');
const PACKAGE_FILE = path.join(ROOT, 'package.json');
const VERSION_RE = /(GAME_VERSION\s*=\s*')(\d+)\.(\d+)\.(\d+)(')/;

const auto = process.argv.includes('--auto');
const requested = (auto ? process.env.BUMP : process.argv[2]) || 'patch';
const kind = ['major', 'minor', 'patch'].includes(requested) ? requested : 'patch';

function git(...args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();
}

// En modo hook, un bump manual previo (data/version.js ya staged) manda:
// no lo pisamos con otro bump automático encima.
if (auto) {
  try {
    const staged = git('diff', '--cached', '--name-only').split('\n');
    if (staged.includes('data/version.js')) process.exit(0);
  } catch (_) {
    // Sin git no hay hook posible; el bump manual sigue funcionando.
  }
}

const source = fs.readFileSync(VERSION_FILE, 'utf8');
const match = VERSION_RE.exec(source);
if (!match) {
  console.error(`No se encontró GAME_VERSION = 'x.y.z' en ${VERSION_FILE}`);
  process.exit(1);
}

let [, , major, minor, patch] = match;
major = Number(major);
minor = Number(minor);
patch = Number(patch);
if (kind === 'major') { major += 1; minor = 0; patch = 0; }
else if (kind === 'minor') { minor += 1; patch = 0; }
else { patch += 1; }
const next = `${major}.${minor}.${patch}`;

fs.writeFileSync(VERSION_FILE, source.replace(VERSION_RE, `$1${next}$5`), 'utf8');

const pkg = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf8'));
pkg.version = next;
fs.writeFileSync(PACKAGE_FILE, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

if (auto) {
  git('add', 'data/version.js', 'package.json');
}

console.log(`Versión del juego: ${match[2]}.${match[3]}.${match[4]} → ${next} (${kind})`);
