// Torre de Leyendas — Maquetación de la crónica de prensa (§4.5/§8.6).
// Periódico de los 90: cabecera con filetes, titular en serifa, foto pixelart
// flotada a la izquierda con su pie y texto justificado envolvente.

import { esc } from './dom.js';
import { getLanguage, localizeNation, t } from '../data/i18n.js';
import { playerInitials, portraitPathForName } from '../data/playerAssets.js';
import { buildCronica } from '../engine/cronica.js';

function editionDate() {
  try {
    return new Date().toLocaleDateString(getLanguage(), {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });
  } catch (_) {
    return new Date().toLocaleDateString();
  }
}

// HTML de la crónica del último partido, o '' si no hay partido narrable.
export function pressArticleHTML(state) {
  const match = state.lastMatch;
  if (!match || !state.opponent) return '';
  const cronica = buildCronica(match, {
    teamName: state.team?.name || 'Leyendas',
    oppName: localizeNation(state.opponent.name),
    level: state.level,
  });
  if (!cronica) return '';

  const figureName = cronica.figure.name;
  const paragraphs = cronica.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');

  return `
    <article class="press-article" aria-label="${esc(t('press.masthead'))}">
      <header class="press-masthead">
        <h2 class="press-name">${esc(t('press.masthead'))}</h2>
        <div class="press-dateline">
          <span>${esc(editionDate())}</span>
          <span>${esc(t('press.edition', { level: state.level }))}</span>
        </div>
      </header>
      <h3 class="press-headline">${esc(cronica.headline)}</h3>
      <div class="press-body">
        <figure class="press-photo">
          <span class="press-photo-frame">
            <span class="press-photo-fallback" aria-hidden="true">${esc(playerInitials(figureName))}</span>
            <img src="${esc(portraitPathForName(figureName))}" alt="${esc(t('press.photoAlt', { name: figureName }))}"
              loading="lazy" decoding="async" data-hide-on-error="true" />
          </span>
          <figcaption>${esc(t('press.caption', { name: figureName }))}</figcaption>
        </figure>
        ${paragraphs}
      </div>
    </article>`;
}
