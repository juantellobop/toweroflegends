// Torre de Leyendas — Apertura de sobres (§4.2 del plan UI/UX, §8.2/§8.3).
// Rediseño: el sobre llega SELLADO (arte de cromos). Al tocarlo, se sacude,
// estalla en un fogonazo y las cartas BROTAN del sobre boca abajo (dorso real
// por tipo), se voltean en 3D (rotateY) escalonadas y con leve háptica. Al tocar
// una: se eleva, las demás se atenúan y retroceden; "Elegir" confirma y la carta
// "vuela" a la plantilla. "Lectura total": cada carta muestra todo lo necesario.

import { playerCardHTML, itemCardHTML, esc } from './cards.js';
import { haptic } from '../match/feedback.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { t } from '../data/i18n.js';

const prefersReduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const COPY = {
  player: {
    title: 'pack.playerTitle',
    hint: 'pack.playerHint',
    open: 'pack.playerOpen',
  },
  item: {
    title: 'pack.itemTitle',
    hint: 'pack.itemHint',
    open: 'pack.itemOpen',
  },
};

// Sobre sellado + dorso de carta por tipo (arte original de cromos).
function packArt(kind) {
  return kind === 'item' ? UI_ASSETS.packs.item : UI_ASSETS.packs.player;
}
function cardBack(kind) {
  return kind === 'item' ? UI_ASSETS.cards.backItem : UI_ASSETS.cards.backPlayer;
}

function shell(state, kind, count, body) {
  const copy = COPY[kind];
  const title = t(copy.title);
  const hint = t(copy.hint);
  const open = t(copy.open);
  return `
    <section class="screen pack-screen pixel-screen" data-kind="${kind}">
      <header class="nav-large pack-head">
        <div class="level-badge">${t('generic.level', { level: state.level })}</div>
        <h1 class="large-title">${title}</h1>
        <p class="hint">${t('pack.chooseOne', { count, hint })}</p>
      </header>

      <div class="pack-stage" id="stage">
        <div class="pack-reveal">
          <div class="pack-opener" id="opener" role="button" tabindex="0" aria-label="${esc(open)}">
            <span class="pack-rays" aria-hidden="true"></span>
            <span class="pack-glow" aria-hidden="true"></span>
            <span class="pack-sparks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>
            <img class="pack-sobre" src="${packArt(kind)}" alt="" loading="eager" decoding="async" />
            <span class="pack-flash" aria-hidden="true"></span>
            <span class="pack-tap">${t('pack.tap')}</span>
          </div>
          <div class="pack-deal" id="deal" hidden>${body}</div>
        </div>

        <div class="pack-actions" id="openBar">
          <button id="openBtn" class="primary big glass-cta">${open}</button>
        </div>
      </div>
    </section>`;
}

// Una carta "repartida": contenedor 3D con dorso (arte por tipo) y cara real.
function dealCard(innerHTML, idValue, i, kind, selectable = true) {
  return `
    <div class="deal-card ${selectable ? '' : 'disabled-deal'}" data-id="${esc(idValue)}"
         style="--i:${i}" ${selectable ? 'role="button" tabindex="0"' : 'aria-disabled="true"'}>
      <div class="deal-inner">
        <div class="deal-back" aria-hidden="true">
          <img src="${cardBack(kind)}" alt="" loading="eager" decoding="async" />
        </div>
        <div class="deal-front">${innerHTML}</div>
      </div>
    </div>`;
}

export function renderPlayerPack(root, state, choices, onPick) {
  const body = choices.map((c, i) =>
    dealCard(playerCardHTML(c, { idValue: c.id, disabled: c.selectable === false }), c.id, i, 'player', c.selectable !== false)
  ).join('');
  root.innerHTML = shell(state, 'player', choices.length, body);
  wire(root, choices, onPick);
}

export function renderItemPack(root, state, choices, onPick) {
  const body = choices.map((c, i) => dealCard(itemCardHTML(c, { idValue: c.id }), c.id, i, 'item')).join('');
  root.innerHTML = shell(state, 'item', choices.length, body);
  wire(root, choices, onPick);
}

function wire(root, choices, onPick) {
  const opener = root.querySelector('#opener');
  const openBar = root.querySelector('#openBar');
  const deal = root.querySelector('#deal');
  const cards = Array.from(root.querySelectorAll('.deal-card'));
  const reduce = prefersReduced();
  let opened = false;
  let chosen = false;

  // --- Apertura del sobre: sacudida + fogonazo, y las cartas brotan ---
  function openPack() {
    if (opened) return;
    opened = true;
    openBar.hidden = true;
    deal.hidden = false;
    deal.classList.add('dealing');

    // Háptica por carta a medida que se voltea (mejora progresiva).
    if (!reduce) {
      haptic([10, 28, 12]);
      cards.forEach((card) => {
        card.addEventListener('animationstart', (e) => {
          if (e.animationName === 'deal-flip') haptic(8);
        }, { once: true });
      });
      opener.classList.add('is-opening');
      const onEnd = (e) => {
        if (e.animationName !== 'pack-open') return; // el sobre terminó de estallar
        opener.hidden = true;
        opener.removeEventListener('animationend', onEnd);
      };
      opener.addEventListener('animationend', onEnd);
    } else {
      deal.classList.add('no-flip'); // sin volteo: aparecen ya reveladas
      opener.hidden = true;
    }
  }

  opener.addEventListener('click', openPack);
  opener.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    openPack();
  });
  root.querySelector('#openBtn').addEventListener('click', openPack);

  // --- Elección de carta (solo tras abrir el sobre) ---
  // Al tocar una carta se confirma directamente: se eleva, las demás retroceden
  // y la elegida "vuela" antes de avanzar. Sin botón de confirmación.
  function choose(card) {
    if (!opened || chosen) return;
    if (card.classList.contains('disabled-deal')) return;
    const choice = choices.find((x) => x.id === card.dataset.id);
    if (!choice || choice.selectable === false) return;
    chosen = true;
    cards.forEach((c) => {
      c.classList.toggle('selected', c === card);
      c.classList.toggle('receded', c !== card);
      if (c !== card) c.setAttribute('aria-disabled', 'true');
    });
    card.classList.add('chosen', 'fly');
    haptic(16);
    const delay = reduce ? 0 : 360;
    setTimeout(() => onPick(choice), delay);
  }

  cards.forEach((card) => {
    if (!card.classList.contains('disabled-deal')) {
      card.addEventListener('click', () => choose(card));
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        choose(card);
      });
      card.querySelector('.card')?.classList.add('clickable'); // compatibilidad
    }
  });
}
