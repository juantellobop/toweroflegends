import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { renderPlayerPack, renderNationPack } from '../ui/packScreen.js';
import { PLAYERS } from '../data/players.js';
import { createRun, isNationPackLevel, rollNationPack, choosePlayerCard } from '../state/run.js';

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
assert.equal(picked, null, 'una carta ya en plantilla no se puede elegir');

// Selección directa: al tocar una carta válida se confirma sin botón aparte.
const enabled = root.querySelector('.deal-card:not(.disabled-deal)');
click(enabled);
assert.ok(enabled.classList.contains('fly'), 'la carta elegida vuela al confirmarse');
assert.equal(picked, null, 'el pick se difiere hasta terminar la animación');
await new Promise((resolve) => setTimeout(resolve, 420));
assert.equal(picked && picked.id, choices[1].id, 'tras la animación se entrega la carta elegida');

console.log('UI de repetidas: OK');

// === Sobre especial de selecciones (cada 5 niveles) ===
assert.ok(!isNationPackLevel(4) && isNationPackLevel(5) && isNationPackLevel(10),
  'el sobre de selecciones cae en los niveles múltiplos de 5');

const run = createRun({ teamName: 'Test', teamNation: 'Argentina', seed: 7 });
run.level = 5;
const teams = rollNationPack(run);
assert.equal(teams.length, 3, 'el sobre especial ofrece 3 selecciones');
assert.equal(new Set(teams.map((tm) => tm.id)).size, 3, 'las selecciones sorteadas son distintas');
for (const team of teams) {
  assert.ok(team.players.some((p) => p.selectable), 'cada selección trae cartas nuevas elegibles');
  assert.ok(team.players.every((p) => p.nation === team.nation && p.era === team.era),
    'cada selección agrupa una sola nación y año');
}

let pickedPlayer = null;
renderNationPack(root, run, teams, (tpl) => { pickedPlayer = tpl; });
assert.ok(root.querySelector('#deal').hidden, 'el sobre de selecciones llega sellado');
click(root.querySelector('#openBtn'));
const teamCard = root.querySelector('.deal-card');
assert.ok(teamCard.querySelector('.nation-flag img'), 'la carta de selección muestra su bandera');
click(teamCard);
await new Promise((resolve) => setTimeout(resolve, 420));

// Segunda etapa: el plantel completo de la selección elegida, a elección libre.
const rosterCards = root.querySelectorAll('.nation-roster .deal-card');
assert.equal(rosterCards.length, teams[0].players.length, 'se muestra el plantel completo de la selección');
click(root.querySelector('.nation-roster .deal-card:not(.disabled-deal)'));
await new Promise((resolve) => setTimeout(resolve, 420));
assert.ok(pickedPlayer && pickedPlayer.nation === teams[0].nation, 'se entrega un jugador de la selección elegida');
const added = choosePlayerCard(run, pickedPlayer);
assert.ok(added && run.squad.some((p) => p.id === pickedPlayer.id), 'el jugador elegido entra a la plantilla');

console.log('Sobre de selecciones: OK');
