import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { flagSrcForNation } from '../data/flags.js';
import {
  filterTeamNameInput, hasDisallowedTeamNameChars, sanitizeTeamName,
} from '../data/teamName.js';
import { createRun } from '../state/run.js';
import { renderLeaderboard } from '../ui/leaderboard.js';
import { renderGameOver } from '../ui/resultScreen.js';

const TEAM_NAME_RE = /^[\p{L} ]+$/u;
const ATTACK = '<img src=x onerror=alert(1)>';

assert.equal(sanitizeTeamName('Águilas del Sur'), 'Águilas del Sur');
assert.equal(sanitizeTeamName('123 <>'), 'Leyendas');
assert.equal(hasDisallowedTeamNameChars('Boca99'), true);
assert.match(filterTeamNameInput(`Boca  Juniors ${ATTACK}`), TEAM_NAME_RE);

const run = createRun({ seed: 7, teamName: ATTACK, teamNation: 'River Plate' });
assert.match(run.team.name, TEAM_NAME_RE);
assert.doesNotMatch(run.team.name, /[<>"'=()/]/);

const leaderboardHTML = renderLeaderboard([
  { id: 'xss', teamName: ATTACK, nation: '<svg onload=alert(1)>', floor: 9, createdAt: '2026-01-01T00:00:00.000Z' },
]);
const leaderboardDom = new JSDOM(leaderboardHTML);
assert.equal(leaderboardDom.window.document.querySelector('.leaderboard-team b').textContent, ATTACK);
assert.equal(leaderboardDom.window.document.querySelectorAll('[onerror], [onload], script').length, 0);

const fallbackFlag = decodeURIComponent(flagSrcForNation('<script>alert(1)</script>').replace(/^data:image\/svg\+xml,/, ''));
assert.doesNotMatch(fallbackFlag, /<script|onload=/i);

const dom = new JSDOM('<main id="app"></main>', { url: 'http://127.0.0.1/' });
global.document = dom.window.document;

const root = dom.window.document.querySelector('#app');
renderGameOver(root, {
  level: 3,
  history: [
    { level: 1, result: 'win', score: '<b>9-0</b>', opponent: '<img src=x onerror=alert(1)>' },
  ],
  squad: [
    { position: 'GK', rarity: 'common', name: ATTACK },
  ],
}, 2, {
  leaderboard: { entries: [] },
  onRestart: () => {},
});

assert.equal(root.querySelector('.squad-chip').textContent, ATTACK);
assert.equal(root.querySelector('.path-score').textContent, '<b>9-0</b>');
assert.equal(root.querySelectorAll('[onerror], script').length, 0);

console.log('Security checks: OK');
