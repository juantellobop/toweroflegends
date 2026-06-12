// Torre de Leyendas — Apertura de sobres (§4.2 del plan UI/UX, §8.2/§8.3).
// Rediseño: el sobre llega SELLADO (arte de cromos). Al tocarlo, se sacude,
// estalla en un fogonazo y las cartas BROTAN del sobre boca abajo (dorso real
// por tipo), se voltean en 3D (rotateY) escalonadas y con leve háptica. Al tocar
// una: se eleva, las demás se atenúan y retroceden; "Elegir" confirma y la carta
// "vuela" a la plantilla. "Lectura total": cada carta muestra todo lo necesario.

import { playerCardHTML, itemCardHTML } from './cards.js';
import { esc, prefersReducedMotion } from './dom.js';
import { haptic } from '../match/feedback.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { LINES } from '../data/config.js';
import { playerOVR } from '../engine/ovr.js';
import { localizeEra, localizeNation, t } from '../data/i18n.js';

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
  nation: {
    title: 'pack.nationTitle',
    hint: 'pack.nationHint',
    open: 'pack.nationOpen',
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
        ${squadReviewButton(state)}
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
      </div>

      <div class="pack-actions action-bar" id="openBar">
        <button id="openBtn" class="primary big glass-cta">${open}</button>
      </div>
      ${squadReviewModal(state)}
    </section>`;
}

// === Popup "Revisar mi equipo" ===
// La plantilla completa en cartas (titulares y suplentes) para comparar lo que
// ya tienes antes de decidir qué sacar del sobre. Solo aparece con plantilla.

function squadReviewButton(state) {
  if (!state.squad?.length) return '';
  return `<button id="reviewSquad" class="ctl review-squad-btn">${t('pack.review')}</button>`;
}

function squadReviewModal(state) {
  if (!state.squad?.length) return '';
  const starters = LINES.flatMap((line) => state.starting11?.[line] || []);
  const starterUids = new Set(starters.map((p) => p.uid));
  const subs = state.squad
    .filter((p) => !starterUids.has(p.uid))
    .sort((a, b) => playerOVR(b) - playerOVR(a));
  const grid = (players) => `<div class="squad-review-grid">${players.map((p) => playerCardHTML(p)).join('')}</div>`;
  return `
    <div class="player-modal squad-review-modal" id="squadReview" hidden>
      <div class="player-modal-backdrop" data-close></div>
      <div class="squad-review-shell" role="dialog" aria-modal="true" aria-label="${esc(t('pack.reviewTitle', { count: state.squad.length }))}">
        <button class="player-modal-close" data-close aria-label="${esc(t('generic.close'))}">
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.4 2.4 L9.6 9.6 M9.6 2.4 L2.4 9.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="square" fill="none" /></svg>
        </button>
        <div class="squad-review-panel arcade-panel">
          <h2 class="squad-review-title">${t('pack.reviewTitle', { count: state.squad.length })}</h2>
          ${starters.length ? `<h3 class="squad-review-sub">${t('squadIntro.eleven')}</h3>${grid(starters)}` : ''}
          ${subs.length ? `<h3 class="squad-review-sub">${t('squadIntro.bench')}</h3>${grid(subs)}` : ''}
        </div>
      </div>
    </div>`;
}

function wireSquadReview(root) {
  const btn = root.querySelector('#reviewSquad');
  const modal = root.querySelector('#squadReview');
  if (!btn || !modal) return;
  const close = () => { modal.hidden = true; };
  btn.addEventListener('click', () => { modal.hidden = false; });
  modal.querySelectorAll('[data-close]').forEach((node) => node.addEventListener('click', close));
  document.addEventListener('keydown', function onEsc(e) {
    if (e.key === 'Escape' && !modal.hidden) close();
    if (modal.hidden) document.removeEventListener('keydown', onEsc);
  });
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
  const ownedCount = (id) => (state.items || []).filter((it) => it.id === id).length;
  const body = choices.map((c, i) =>
    // stack = copias que tendrías al elegirlo (las que ya tienes + 1).
    dealCard(itemCardHTML(c, { idValue: c.id, stack: ownedCount(c.id) + 1 }), c.id, i, 'item')
  ).join('');
  root.innerHTML = shell(state, 'item', choices.length, body);
  wire(root, choices, onPick);
}

// === Sobre especial de selecciones (cada 5 niveles) ===

function nationLabel(team) {
  return `${localizeNation(team.nation)} ${localizeEra(team.era)}`;
}

// Carta de selección: bandera grande + nación + año, con cuántas cartas
// nuevas aporta y el mejor OVR disponible como pista para decidir.
function nationTeamCardHTML(team) {
  return `
  <div class="card nation-team-card rarity-legend" data-id="${esc(team.id)}">
    <div class="card-head">
      <div class="card-pos">${esc(localizeEra(team.era))}</div>
      <div class="card-rarity">${t('pack.nationBadge')}</div>
    </div>
    <div class="nation-flag" aria-hidden="true">
      <img src="${esc(flagSrcForNation(team.nation))}" alt="" loading="eager" decoding="async" />
    </div>
    <div class="card-name">${esc(localizeNation(team.nation))}</div>
    <div class="card-meta">
      <span class="chip">${t('pack.nationNew', { n: team.newCount })}</span>
      <span class="chip">${t('pack.nationTopOvr', { ovr: team.topOvr })}</span>
    </div>
  </div>`;
}

// Sobre de selecciones: primero se elige una selección (cartas con bandera) y
// después, de su plantel completo, el jugador que se quiera llevar.
export function renderNationPack(root, state, teams, onPick) {
  const body = teams.map((team, i) =>
    dealCard(nationTeamCardHTML(team), team.id, i, 'nation')
  ).join('');
  root.innerHTML = shell(state, 'nation', teams.length, body);
  wire(root, teams, (team) => renderNationRoster(root, state, team, onPick));
}

// Segunda etapa: plantel completo de la selección elegida. Las cartas brotan
// con el mismo reparto escalonado del sobre; las ya poseídas van apagadas.
function renderNationRoster(root, state, team, onPick) {
  const body = team.players.map((p, i) =>
    dealCard(playerCardHTML(p, { idValue: p.id, disabled: p.selectable === false }), p.id, i, 'nation', p.selectable !== false)
  ).join('');
  root.innerHTML = `
    <section class="screen pack-screen pixel-screen nation-roster-screen" data-kind="nation">
      <header class="nav-large pack-head">
        <div class="level-badge">${t('generic.level', { level: state.level })}</div>
        <h1 class="large-title">${esc(nationLabel(team))}</h1>
        <p class="hint">${t('pack.nationPickHint')}</p>
        ${squadReviewButton(state)}
      </header>
      <div class="pack-stage nation-roster-stage">
        <div class="pack-deal nation-roster ${prefersReducedMotion() ? '' : 'dealing'} no-flip" id="deal">${body}</div>
      </div>
      ${squadReviewModal(state)}
    </section>`;
  window.scrollTo(0, 0);
  wireChoice(root, team.players, onPick);
  wireSquadReview(root);
}

function wire(root, choices, onPick) {
  const opener = root.querySelector('#opener');
  const openBar = root.querySelector('#openBar');
  const deal = root.querySelector('#deal');
  const cards = Array.from(root.querySelectorAll('.deal-card'));
  const reduce = prefersReducedMotion();
  let opened = false;

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

  wireChoice(root, choices, onPick, () => opened);
  wireSquadReview(root);
}

// --- Elección de carta (solo tras abrir el sobre) ---
// Al tocar una carta se confirma directamente: se eleva, las demás retroceden
// y la elegida "vuela" antes de avanzar. Sin botón de confirmación.
function wireChoice(root, choices, onPick, isOpen = () => true) {
  const cards = Array.from(root.querySelectorAll('.deal-card'));
  const reduce = prefersReducedMotion();
  let chosen = false;

  function choose(card) {
    if (!isOpen() || chosen) return;
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
