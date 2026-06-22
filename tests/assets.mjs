import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { preloadUiAssets, uiAssetGroup, UI_ASSETS, uiAssetList } from '../data/uiAssets.js';
import { sceneSources } from '../match/scenes.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function imageFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return imageFiles(absolute);
    return /\.(?:ico|jpe?g|png|svg|webp)$/i.test(entry.name) ? [absolute] : [];
  });
}

const uiAssets = uiAssetList();
for (const rel of uiAssets) {
  assert.ok(fs.existsSync(path.join(ROOT, rel)), `Missing UI asset: ${rel}`);
}
const uiFiles = imageFiles(path.join(ROOT, 'assets/ui'))
  .map((absolute) => path.relative(ROOT, absolute).replaceAll(path.sep, '/'))
  .sort();
assert.deepEqual(uiAssets.slice().sort(), uiFiles, 'UI preload manifest must include every image in assets/ui');

// Invariante de cobertura de grupos: la unión de todos los grupos de precarga
// debe ser EXACTAMENTE uiAssetList(). Si se añade un asset a UI_ASSETS sin
// meterlo en ningún grupo, jamás se precargaría → este test lo caza.
const GROUP_NAMES = ['core', 'build', 'managerPack', 'packs', 'result'];
const grouped = [...new Set(GROUP_NAMES.flatMap((name) => uiAssetGroup(name)))].sort();
assert.deepEqual(grouped, uiAssets.slice().sort(),
  'Todo asset de UI_ASSETS debe pertenecer a algún grupo de precarga (uiAssetGroup)');

class FakeImage {
  constructor() {
    this.decoding = '';
    this.fetchPriority = '';
    this.src = '';
  }
}
// Al arrancar solo se precarga el grupo 'core' (fondo del título, prioridad alta);
// el resto de assets/ui se difiere a su escena.
const preloaded = preloadUiAssets(FakeImage);
assert.deepEqual(preloaded.map((image) => image.src), uiAssetGroup('core'));
assert.ok(preloaded.every((image) => image.decoding === 'async'));
assert.ok(preloaded.every((image) => image.src === UI_ASSETS.backgrounds.title),
  'preloadUiAssets debe limitarse al grupo core (no bajar todo assets/ui al arranque)');
assert.equal(
  preloaded.find((image) => image.src === UI_ASSETS.backgrounds.title)?.fetchPriority,
  'high'
);

for (const rel of sceneSources()) {
  assert.ok(fs.existsSync(path.join(ROOT, rel)), `Missing match scene: ${rel}`);
}

console.log('Assets manifest: OK');
