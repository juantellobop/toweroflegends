// Torre de Leyendas — Wiki (wikidata.html).
// Renderiza el índice y las secciones de la wiki en el idioma activo del juego.
// Reutiliza el sistema de idioma de data/i18n.js (sincronizado vía
// localStorage 'tdl_language') y compone la tabla de rasgos a partir de la lista
// canónica de engine/traits.js + localizeTrait (nombres siempre en sync).
import { getLanguage, setLanguage, initLanguage, LANGUAGES, localizeTrait, t } from './data/i18n.js';
import { TRAITS } from './engine/traits.js';
import { WIKI_CONTENT } from './data/wikiContent.js';

const DEFAULT_LANG = 'es';

// Tipo de cada rasgo (independiente del idioma; las etiquetas las da el contenido).
const TRAIT_TYPE = {
  Francotirador: 'atk', Cañón: 'atk', Muro: 'def', Motor: 'mid', Maestro: 'mid',
  Líbero: 'def', Paradón: 'gk', Mariscal: 'gk', Killer: 'atk', Velocista: 'atk',
  Especialista: 'atk', Penalero: 'atk', Capitán: 'lead', Garra: 'def',
};

// Orden de presentación de la tabla de rasgos: liderazgo, portero, defensa, medio, ataque.
const TYPE_ORDER = ['lead', 'gk', 'def', 'mid', 'atk'];

const nav = document.getElementById('wiki-nav');
const content = document.getElementById('wiki-content');
const langSelect = document.getElementById('wiki-lang');
const backLink = document.getElementById('wiki-back');
const title = document.getElementById('wiki-title');
const subtitle = document.getElementById('wiki-subtitle');

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function activeLang() {
  const code = getLanguage();
  return WIKI_CONTENT[code] ? code : DEFAULT_LANG;
}

function traitsTableHTML(data) {
  const head = data.traitsHead.map((h) => `<th>${esc(h)}</th>`).join('');
  // Ordena por tipo (TYPE_ORDER); sort estable conserva el orden de TRAITS dentro de cada tipo.
  const ordered = TRAITS.slice().sort((a, b) => TYPE_ORDER.indexOf(TRAIT_TYPE[a]) - TYPE_ORDER.indexOf(TRAIT_TYPE[b]));
  const rows = ordered.map((key) => {
    const name = esc(localizeTrait(key));
    const type = esc(data.traitType[TRAIT_TYPE[key]] || '');
    const effect = esc(data.traitEffects[key] || '');
    return `<tr><td><b>${name}</b></td><td>${type}</td><td>${effect}</td></tr>`;
  }).join('');
  return `<div class="wiki-table-wrap"><table class="traits-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function tableHTML(table) {
  const head = table.head.map((h) => `<th>${esc(h)}</th>`).join('');
  const rows = table.rows.map((row) =>
    `<tr>${row.map((cell) => `<td>${esc(cell)}</td>`).join('')}</tr>`
  ).join('');
  return `<div class="wiki-table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

function blockHTML(block, data) {
  if (block.h != null) return `<h3>${esc(block.h)}</h3>`;
  if (block.p != null) return `<p>${esc(block.p)}</p>`;
  if (block.ul) return `<ul>${block.ul.map((li) => `<li>${esc(li)}</li>`).join('')}</ul>`;
  if (block.table) return tableHTML(block.table);
  if (block.traits) return traitsTableHTML(data);
  return '';
}

function render() {
  const lang = activeLang();
  const data = WIKI_CONTENT[lang];

  // El nombre del juego se traduce por idioma (meta.title): "Torre de Leyendas",
  // "Tower of Legends", etc. La wiki lo reutiliza para no duplicarlo.
  const wikiTitle = `${t('meta.title')} — Wiki`;
  document.documentElement.lang = lang;
  document.title = wikiTitle;
  title.textContent = wikiTitle;
  subtitle.textContent = data.subtitle;
  backLink.textContent = data.backToGame;
  langSelect.setAttribute('aria-label', data.langLabel);

  // Selector de idioma: solo los idiomas con contenido en la wiki.
  langSelect.innerHTML = LANGUAGES
    .filter((l) => WIKI_CONTENT[l.code])
    .map((l) => `<option value="${esc(l.code)}" ${l.code === lang ? 'selected' : ''}>${esc(l.label)}</option>`)
    .join('');

  // Índice navegable.
  nav.innerHTML = `<p class="wiki-nav-title">${esc(data.indexTitle)}</p>` + data.sections
    .map((s) => `<a href="#${esc(s.id)}">${esc(s.nav)}</a>`)
    .join('');

  // Secciones.
  content.innerHTML = data.sections.map((s) =>
    `<section id="${esc(s.id)}" class="wiki-section">
      <h2>${esc(s.title)}</h2>
      ${s.blocks.map((b) => blockHTML(b, data)).join('')}
    </section>`
  ).join('');
}

langSelect.addEventListener('change', () => setLanguage(langSelect.value));
// setLanguage emite este evento; re-render para reflejar el cambio.
window.addEventListener('tdl:languagechange', render);

initLanguage();
render();
