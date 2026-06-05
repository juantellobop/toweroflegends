import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { uiAssetList } from '../data/uiAssets.js';
import { sceneSources } from '../match/scenes.js';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

for (const rel of uiAssetList()) {
  assert.ok(fs.existsSync(path.join(ROOT, rel)), `Missing UI asset: ${rel}`);
}

for (const rel of sceneSources()) {
  assert.ok(fs.existsSync(path.join(ROOT, rel)), `Missing match scene: ${rel}`);
}

console.log('Assets manifest: OK');
