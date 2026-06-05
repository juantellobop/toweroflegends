import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { renderPlayerPack } from '../ui/packScreen.js';
import { PLAYERS } from '../data/players.js';

const dom = new JSDOM('<main id="app"></main>', { pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;

const root = document.getElementById('app');
let picked = null;
const choices = [
  { ...PLAYERS[0], selectable: false },
  { ...PLAYERS[1], selectable: true },
];
renderPlayerPack(root, { level: 1 }, choices, (choice) => { picked = choice; });

// El sobre llega sellado: hay que abrirlo antes de poder elegir carta.
const click = (el) => el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
assert.ok(root.querySelector('#deal').hidden, 'el reparto empieza oculto hasta abrir el sobre');
click(root.querySelector('#openBtn'));
assert.ok(!root.querySelector('#deal').hidden, 'tras abrir, las cartas se revelan');

const disabled = root.querySelector('.disabled-deal');
assert.ok(disabled);
assert.match(disabled.textContent, /Ya en tu plantilla/);
click(disabled);
assert.ok(root.querySelector('#confirmBar').hidden);

const enabled = root.querySelector('.deal-card:not(.disabled-deal)');
click(enabled);
assert.ok(!root.querySelector('#confirmBar').hidden);
assert.equal(picked, null);

console.log('UI de repetidas: OK');
