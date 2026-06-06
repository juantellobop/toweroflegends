import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { preloadUiAssets, UI_ASSETS, uiAssetList } from '../data/uiAssets.js';
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

class FakeImage {
  constructor() {
    this.decoding = '';
    this.fetchPriority = '';
    this.src = '';
  }
}
const preloaded = preloadUiAssets(FakeImage);
assert.deepEqual(preloaded.map((image) => image.src), uiAssets);
assert.ok(preloaded.every((image) => image.decoding === 'async'));
assert.equal(
  preloaded.find((image) => image.src === UI_ASSETS.backgrounds.title)?.fetchPriority,
  'high'
);
assert.ok(preloaded
  .filter((image) => image.src !== UI_ASSETS.backgrounds.title)
  .every((image) => image.fetchPriority === 'low'));

for (const rel of sceneSources()) {
  assert.ok(fs.existsSync(path.join(ROOT, rel)), `Missing match scene: ${rel}`);
}

console.log('Assets manifest: OK');
