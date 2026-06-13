import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const dom = new JSDOM(html, { url: 'http://localhost/', pretendToBeVisual: true });
const { window } = dom;
global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
// El UI usa setTimeout/setInterval/clearInterval globales → los de Node bastan.

const errors = [];
await import(path.join(ROOT, 'main.js')).catch(e => errors.push('import: ' + e.message));

const root = document.getElementById('app');
function click(el){ if(!el){ errors.push('click en null'); return; } el.dispatchEvent(new window.MouseEvent('click',{bubbles:true})); }
function show(){ return root.querySelector('.screen')?.className; }
const wait = (ms)=>new Promise(r=>setTimeout(r,ms));

try {
  console.log('1. Menú:', show(), '|', root.querySelector('h1')?.textContent);
  const expectedFlags = [
    'River Plate', 'Boca', 'Independiente', 'Racing', 'San Lorenzo', 'Vélez',
    'Huracán', 'Estudiantes', 'Gimnasia', 'Central', "Newell's", 'Lanús',
  ];
  const menuFlags = [...root.querySelectorAll('.flag-opt')].slice(0, expectedFlags.length).map((el) => el.dataset.nation);
  if (JSON.stringify(menuFlags) !== JSON.stringify(expectedFlags)) errors.push('orden de banderas inicial incorrecto');
  if (root.querySelector('.flag-opt.is-active')) errors.push('hay bandera activa por defecto');
  if (!root.querySelector('#start')?.disabled) errors.push('start habilitado sin bandera');
  click(root.querySelector('.flag-opt'));
  click(root.querySelector('#start'));
  await wait(0); // el handler de inicio es async (cerrojo de sesión única)
  console.log('2. Equipo inicial:', show(), '| once:', root.querySelectorAll('.squad-chip').length, '| suplentes:', root.querySelectorAll('.bench-item').length);
  if (root.querySelectorAll('.squad-chip').length !== 11) errors.push('presentación del equipo sin 11 titulares');
  if (!root.querySelectorAll('.bench-item').length) errors.push('presentación del equipo sin suplentes');
  click(root.querySelector('#squad-continue'));
  console.log('3. Sobre jugador:', show(), '| cartas:', root.querySelectorAll('.player-card').length);
  if (!root.querySelector('.card-portrait')) errors.push('cartas sin bloque de retrato');

  // Popup "Revisar mi equipo" antes de abrir el sobre
  click(root.querySelector('#reviewSquad'));
  if (root.querySelector('#squadReview')?.hidden !== false) errors.push('Revisar mi equipo no abre el popup');
  if (root.querySelectorAll('#squadReview .player-card').length !== 16) errors.push('el popup de plantilla no muestra las 16 cartas');
  click(root.querySelector('#squadReview [data-close]'));
  if (root.querySelector('#squadReview')?.hidden !== true) errors.push('el popup de plantilla no cierra');

  click(root.querySelector('#openBtn')); // abrir el sobre sellado de jugadores
  click(root.querySelector('.deal-card:not(.disabled-deal)')); await wait(420); // selección directa
  console.log('4. Sobre objeto:', show(), '| objetos:', root.querySelectorAll('.item-card').length);

  click(root.querySelector('#openBtn')); // abrir el sobre sellado de objetos
  click(root.querySelector('.deal-card')); await wait(420); // selección directa
  console.log('5. Scouting:', show(), '| once rival:', root.querySelectorAll('.scout-chip').length, '| ratings:', root.querySelectorAll('.scout-rating').length);
  click(root.querySelector('#scout-continue'));
  console.log('6. Armar equipo:', show(), '| play activo:', !root.querySelector('#play')?.disabled, '| ratings:', root.querySelectorAll('.rating-row').length);

  // toggle un suplente dentro/fuera para probar el handler
  const sub = root.querySelector('.bench-item');
  if (sub) { click(sub); console.log('   (toggle suplente ok, pantalla:', show()+')'); }

  click(root.querySelector('#play'));
  console.log('7. Partido:', show(), '| marcador:', root.querySelector('#scoreA')?.textContent+'-'+root.querySelector('#scoreB')?.textContent);
  if (!root.querySelector('.scene-pitch')) errors.push('partido sin visor de escenas');
  if (!root.querySelector('#viewResult')) errors.push('partido sin botón flotante Ver resultado');
  click(root.querySelector('#viewResult'));
  console.log('8. Resultado:', show(), '| final:', root.querySelector('.final-score')?.textContent?.replace(/\s+/g,' ').trim() || 'fin de run');
  if (!root.querySelector('.result-screen, .gameover-screen')) errors.push('Ver resultado no navega directamente al resumen');
  if (root.querySelector('.result-screen .result-scorers')?.closest('.result-score-card') == null) errors.push('goleadores fuera de la caja del resultado');
  if (root.querySelector('.result-screen .result-stats')) errors.push('el resumen todavía incluye estadísticas separadas');

  const next = root.querySelector('#next');
  if (next) {
    click(next);
    console.log('9. Siguiente:', show());
  } else {
    console.log('9. Fin de run válido:', show());
  }
} catch(e) { errors.push('runtime: ' + e.message + '\n' + e.stack); }

console.log('\nErrores:', errors.length ? errors : 'ninguno ✅');
process.exit(errors.length ? 1 : 0);
