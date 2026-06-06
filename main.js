// Torre de Leyendas — Orquestador del bucle de juego (§3, §9.2).
// Conecta el estado de la run (state/run.js) con las pantallas de /ui.

import {
  createRun, rollPlayerPack, rollItemPack, choosePlayerCard, chooseItemCard,
  playMatch, applyResult, advanceLevel, prepareOpponent, retryLevel,
  togglePlayerInLineup, placePlayerInLineup, setFormation,
} from './state/run.js';
import { renderPlayerPack, renderItemPack } from './ui/packScreen.js';
import { renderBuild } from './ui/buildScreen.js';
import { renderScouting } from './ui/scoutingScreen.js';
import { renderMatch } from './ui/matchScreen.js';
import { renderResult, renderGameOver } from './ui/resultScreen.js';
import { renderAdmin } from './ui/adminScreen.js';
import { renderAdminLogin } from './ui/adminLogin.js';
import { getAdminToken, clearAdminToken } from './data/adminAuth.js';
import { fetchLeaderboard, renderLeaderboard, submitLeaderboardEntry } from './ui/leaderboard.js';
import { CONFIG } from './data/config.js';
import { UI_ASSETS } from './data/uiAssets.js';
import { flagSrcForNation, FLAG_NATIONS } from './data/flags.js';
import { initAdminPlayerDatabase } from './data/adminPlayers.js';
import {
  TEAM_NAME_MAX_LENGTH,
  filterTeamNameInput, hasDisallowedTeamNameChars, sanitizeTeamName,
} from './data/teamName.js';
import { LANGUAGES, getLanguage, initLanguage, localizeNation, setLanguage, t } from './data/i18n.js';

const root = document.getElementById('app');
initLanguage();
const BEST_KEY = 'tdl_best';
const ROUTE_ORDER = {
  menu: 0,
  admin: 1,
  playerPack: 2,
  itemPack: 3,
  scouting: 4,
  build: 5,
  match: 6,
  result: 7,
  gameover: 8,
};

function getBest() {
  return parseInt(localStorage.getItem(BEST_KEY) || '0', 10) || 0;
}
function setBest(v) {
  if (v > getBest()) localStorage.setItem(BEST_KEY, String(v));
}

let state = null;
let leaderboardCache = { entries: [], loaded: false };
let leaderboardPromise = null;
let currentRoute = '';
let menuDraft = { teamName: '', nation: '' };

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function activeScreen() {
  return root.firstElementChild?.classList?.contains('screen')
    ? root.firstElementChild
    : root.querySelector('.screen');
}

function stripSnapshotIds(node) {
  node.removeAttribute('id');
  node.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
}

function transitionDirection(from, to, hint = 'auto') {
  if (hint && hint !== 'auto') return hint;
  if (!from || from === to) return 'refresh';
  const a = ROUTE_ORDER[from] ?? 0;
  const b = ROUTE_ORDER[to] ?? a;
  return b < a ? 'back' : 'forward';
}

function snapshotOutgoing(screen, direction) {
  if (!screen || prefersReducedMotion()) return null;
  const snapshot = screen.cloneNode(true);
  stripSnapshotIds(snapshot);
  snapshot.setAttribute('aria-hidden', 'true');
  snapshot.inert = true;

  const rect = screen.getBoundingClientRect();
  const appRect = root.getBoundingClientRect();
  snapshot.classList.remove('screen-enter', 'screen-enter-forward', 'screen-enter-back', 'screen-refresh');
  snapshot.classList.add('screen-exit', `screen-exit-${direction}`);
  Object.assign(snapshot.style, {
    position: 'fixed',
    left: `${rect.left || appRect.left || 0}px`,
    top: `${rect.top || appRect.top || 0}px`,
    width: `${rect.width || appRect.width || window.innerWidth}px`,
    minHeight: `${rect.height || appRect.height || 0}px`,
    margin: '0',
    zIndex: '120',
    pointerEvents: 'none',
  });
  document.body.appendChild(snapshot);
  setTimeout(() => snapshot.remove(), 460);
  return snapshot;
}

function scrollToTop() {
  // Reubica el scroll arriba de todo (desktop y mobile) al cambiar de pantalla.
  window.scrollTo(0, 0);
  if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
  root.scrollTop = 0;
}

function renderRoute(route, draw, hint = 'auto') {
  const from = currentRoute || root.dataset.route || '';
  const direction = transitionDirection(from, route, hint);
  const changingRoute = Boolean(from && from !== route && direction !== 'refresh');
  const outgoing = changingRoute ? activeScreen() : null;

  if (outgoing) snapshotOutgoing(outgoing, direction);

  root.dataset.route = route;
  root.dataset.navDirection = direction;
  root.classList.toggle('app-route-changing', changingRoute);
  draw();

  // Siempre que cambiamos de pestaña, el contenido nuevo arranca desde arriba.
  if (from !== route) scrollToTop();

  const screen = activeScreen();
  if (screen) {
    screen.dataset.route = route;
    if (screen.classList.contains('result-win')) {
      root.dataset.result = 'win';
    } else if (screen.classList.contains('result-loss')) {
      root.dataset.result = 'loss';
    } else if (screen.classList.contains('result-draw')) {
      root.dataset.result = 'draw';
    } else {
      delete root.dataset.result;
    }
    if (changingRoute && !prefersReducedMotion()) {
      screen.classList.add('screen-enter', `screen-enter-${direction}`);
      setTimeout(() => {
        screen.classList.remove('screen-enter', `screen-enter-${direction}`);
        root.classList.remove('app-route-changing');
      }, 460);
    } else if (from === route && !prefersReducedMotion()) {
      screen.classList.add('screen-refresh');
      setTimeout(() => screen.classList.remove('screen-refresh'), 240);
    } else {
      root.classList.remove('app-route-changing');
    }
  } else {
    root.classList.remove('app-route-changing');
  }
  currentRoute = route;
}

root.addEventListener('pointerdown', (event) => {
  const target = event.target.closest('button, .deal-card, .card.clickable, .admin-player-row');
  if (!target || target.disabled || target.getAttribute('aria-disabled') === 'true') return;
  target.classList.add('is-pressing');
});

root.addEventListener('pointerup', (event) => {
  const target = event.target.closest('.is-pressing');
  if (!target) return;
  setTimeout(() => target.classList.remove('is-pressing'), 160);
});

root.addEventListener('pointercancel', () => {
  root.querySelectorAll('.is-pressing').forEach((node) => node.classList.remove('is-pressing'));
});

root.addEventListener('error', (event) => {
  const target = event.target;
  if (target?.tagName === 'IMG' && target.dataset.hideOnError === 'true') {
    target.hidden = true;
  }
}, true);

function loadLeaderboard() {
  if (leaderboardCache.loaded) return Promise.resolve(leaderboardCache);
  if (!leaderboardPromise) {
    leaderboardPromise = fetchLeaderboard()
      .then((data) => {
        leaderboardCache = { ...data, loaded: true };
        return leaderboardCache;
      })
      .finally(() => { leaderboardPromise = null; });
  }
  return leaderboardPromise;
}

function updateMenuLeaderboard() {
  const mount = root.querySelector('#menu-ranking');
  if (!mount) return;
  mount.innerHTML = renderLeaderboard(leaderboardCache.entries, {
    compact: true,
    loading: !leaderboardCache.loaded,
  });
  loadLeaderboard().then((data) => {
    const currentMount = root.querySelector('#menu-ranking');
    if (currentMount) {
      currentMount.innerHTML = renderLeaderboard(data.entries, { compact: true });
    }
  });
}

function submitGameOverRanking() {
  if (!state.leaderboardPromise && !state.leaderboardResult) {
    const run = state;
    run.leaderboardPromise = submitLeaderboardEntry({
      teamName: run.team?.name || 'Leyendas',
      nation: run.team?.nation || '',
      floor: run.level,
    }).then((data) => {
      run.leaderboardResult = { ...data, submitted: true };
      leaderboardCache = { ...data, loaded: true };
      if (state === run && state.phase === 'gameover') render();
      return run.leaderboardResult;
    }).catch(() => {
      run.leaderboardResult = { entries: leaderboardCache.entries, submitted: true, readOnly: true };
      if (state === run && state.phase === 'gameover') render();
      return run.leaderboardResult;
    });
  }

  return state.leaderboardResult || {
    entries: leaderboardCache.entries,
    loading: true,
  };
}

// === Despacho por fase ===
function render(navHint = 'auto') {
  switch (state.phase) {
    case 'playerPack':
      renderRoute('playerPack', () => {
        renderPlayerPack(root, state, rollPlayerPack(state), (tpl) => {
          choosePlayerCard(state, tpl);
          state.phase = 'itemPack';
          render('forward');
        });
      }, navHint);
      break;

    case 'itemPack':
      renderRoute('itemPack', () => {
        renderItemPack(root, state, rollItemPack(state), (tpl) => {
          chooseItemCard(state, tpl);
          prepareOpponent(state);
          state.phase = 'scouting';
          render('forward');
        });
      }, navHint);
      break;

    case 'scouting':
      prepareOpponent(state);
      renderRoute('scouting', () => {
        renderScouting(root, state, {
          onContinue: () => {
            state.phase = 'build';
            render('forward');
          },
        });
      }, navHint);
      break;

    case 'build':
      renderRoute('build', () => {
        renderBuild(root, state, {
          onToggle: (player) => { togglePlayerInLineup(state, player); render('refresh'); },
          onPlace: (player, line, slotIndex) => { placePlayerInLineup(state, player, line, slotIndex); render('refresh'); },
          onSetFormation: (f) => { setFormation(state, f); render('refresh'); },
          onScout: () => { state.phase = 'scouting'; render('back'); },
          onPlay: () => {
            const result = playMatch(state);
            state.phase = 'match';
            renderRoute('match', () => {
              renderMatch(root, state, result, {
                onFinish: () => {
                  const reward = applyResult(state);
                  state.pendingReward = reward;
                  state.phase = reward.gameOver ? 'gameover' : 'result';
                  render('forward');
                },
              });
            }, 'forward');
          },
        });
      }, navHint);
      break;

    case 'match':
      // El render del partido se dispara desde onPlay; nada que hacer aquí.
      break;

    case 'result':
      renderRoute('result', () => {
        renderResult(root, state, state.pendingReward, {
          onNext: () => {
            if (state.pendingReward.gameOver) {
              state.phase = 'gameover';
              render('forward');
            } else if (state.pendingReward.survivedLoss) {
              retryLevel(state);
              render('forward');
            } else {
              advanceLevel(state);
              render('forward');
            }
          },
        });
      }, navHint);
      break;

    case 'gameover':
      setBest(state.level);
      renderRoute('gameover', () => {
        renderGameOver(root, state, getBest(), {
          leaderboard: submitGameOverRanking(),
          onRestart: () => {
            state = null;
            renderMenu('back');
          },
        });
      }, navHint);
      break;

    default:
      renderMenu(navHint);
  }
}

// === Menú de inicio (§8.1) ===
function renderMenu(navHint = 'auto') {
  renderRoute('menu', () => {
    const draftNation = menuDraft.nation || '';
    const hasDraftNation = Boolean(draftNation);
    const languageOptions = LANGUAGES.map((language) =>
      `<option value="${language.code}" ${language.code === getLanguage() ? 'selected' : ''}>${language.label}</option>`
    ).join('');
    root.innerHTML = `
    <section class="screen menu-screen pixel-title-screen"
      style="--title-bg:url('${UI_ASSETS.backgrounds.title}')">
      <div class="title-stage" aria-hidden="true">
        <img src="${UI_ASSETS.backgrounds.title}" alt="" loading="eager" decoding="async" />
      </div>
      <div class="menu-shell">
        <div class="logo pixel-logo">
          <h1>${t('meta.title')}</h1>
          <p class="logo-kicker">${t('menu.kicker')}</p>
        </div>
        <div class="team-identity arcade-panel">
          <div class="ti-head">
            <span class="ti-flag-wrap ${hasDraftNation ? '' : 'is-empty'}" id="m-flag-wrap">
              <img id="m-flag-preview" class="ti-flag" alt="" decoding="async" ${hasDraftNation ? `src="${flagSrcForNation(draftNation)}"` : 'hidden'} />
              <span class="ti-flag-empty" id="m-flag-empty" ${hasDraftNation ? 'hidden' : ''}>?</span>
            </span>
            <label class="ti-name-field">${t('menu.teamName')}
              <input id="m-teamname" type="text" maxlength="${TEAM_NAME_MAX_LENGTH}" placeholder="${t('menu.namePlaceholder')}" value="${esc(menuDraft.teamName)}" autocomplete="off" spellcheck="false" aria-describedby="m-team-error" />
            </label>
          </div>
          <label class="ti-name-field language-field">${t('language.label')}
            <select id="m-language" autocomplete="off">${languageOptions}</select>
          </label>
          <p class="ti-error" id="m-team-error" hidden>${t('menu.nameError')}</p>
          <span class="ti-label">${t('menu.flag')}</span>
          <div class="flag-picker" id="m-flagpicker" role="radiogroup" aria-label="${t('menu.flagAria')}" aria-describedby="m-flag-error">
            ${FLAG_NATIONS.map((n) => `
            <button type="button" class="flag-opt ${n === draftNation ? 'is-active' : ''}" data-nation="${esc(n)}" role="radio" aria-checked="${n === draftNation ? 'true' : 'false'}" title="${esc(localizeNation(n))}" aria-label="${esc(localizeNation(n))}">
              <img src="${flagSrcForNation(n)}" alt="" loading="lazy" decoding="async" />
            </button>`).join('')}
          </div>
          <p class="ti-error" id="m-flag-error" hidden>${t('menu.flagError')}</p>
        </div>
        <div class="menu-actions">
          <button id="start" class="primary big start-prompt" ${hasDraftNation ? '' : 'disabled'}>${hasDraftNation ? t('menu.newRun') : t('menu.chooseFlag')}</button>
        </div>
        <div id="menu-ranking" class="menu-ranking"></div>
        <p class="disclaimer menu-legal">${t('menu.disclaimer')}</p>
      </div>
    </section>`;

    updateMenuLeaderboard();

    // --- Identidad del equipo: nombre + selector de bandera ---
    const nameInput = root.querySelector('#m-teamname');
    const nameError = root.querySelector('#m-team-error');
    const flagPreview = root.querySelector('#m-flag-preview');
    const flagWrap = root.querySelector('#m-flag-wrap');
    const flagEmpty = root.querySelector('#m-flag-empty');
    const picker = root.querySelector('#m-flagpicker');
    const flagError = root.querySelector('#m-flag-error');
    const startBtn = root.querySelector('#start');
    const languageSelect = root.querySelector('#m-language');
    let selectedNation = draftNation;

    function showNameError(show) {
      nameError.hidden = !show;
      nameInput.toggleAttribute('aria-invalid', show);
    }

    nameInput.addEventListener('input', () => {
      const raw = nameInput.value;
      const hadDisallowedChars = hasDisallowedTeamNameChars(raw);
      const safe = filterTeamNameInput(raw);
      if (safe !== raw) nameInput.value = safe;
      menuDraft.teamName = nameInput.value;
      showNameError(hadDisallowedChars);
    });

    languageSelect.addEventListener('change', () => {
      menuDraft.teamName = nameInput.value;
      menuDraft.nation = selectedNation;
      setLanguage(languageSelect.value);
      renderMenu('refresh');
    });

    flagPreview.addEventListener('error', () => { flagPreview.hidden = true; });
    picker.addEventListener('click', (e) => {
      const btn = e.target.closest('.flag-opt');
      if (!btn) return;
      selectedNation = btn.dataset.nation;
      menuDraft.nation = selectedNation;
      picker.querySelectorAll('.flag-opt').forEach((b) => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      const img = btn.querySelector('img');
      flagPreview.hidden = false;
      flagPreview.src = img ? img.src : flagSrcForNation(selectedNation);
      flagWrap.classList.remove('is-empty');
      flagEmpty.hidden = true;
      flagError.hidden = true;
      picker.removeAttribute('aria-invalid');
      startBtn.disabled = false;
      startBtn.textContent = t('menu.newRun');
    });

    startBtn.addEventListener('click', () => {
      if (!selectedNation) {
        flagError.hidden = false;
        picker.setAttribute('aria-invalid', 'true');
        return;
      }
      const fallbackName = t('menu.namePlaceholder');
      const teamName = sanitizeTeamName(nameInput.value, fallbackName);
      nameInput.value = teamName === fallbackName && !nameInput.value.trim() ? '' : teamName;
      menuDraft.teamName = nameInput.value;
      menuDraft.nation = selectedNation;
      showNameError(false);
      state = createRun({
        formation: CONFIG.STARTING_FORMATION,
        lives: CONFIG.LIVES,
        teamName,
        teamNation: selectedNation,
      });
      render('forward');
    });
  }, navHint);
}

const ADMIN_HASH = '#playeredit';

function leaveAdmin() {
  // Limpia el hash sin disparar hashchange (replaceState no lo emite).
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
  renderMenu('back');
}

function renderAdminScreen(navHint = 'forward') {
  renderRoute('admin', () => {
    if (getAdminToken()) {
      renderAdmin(root, {
        onBack: () => leaveAdmin(),
        onLogout: () => { clearAdminToken(); renderAdminScreen('refresh'); },
      });
    } else {
      renderAdminLogin(root, {
        onSuccess: () => renderAdminScreen('refresh'),
        onBack: () => leaveAdmin(),
      });
    }
  }, navHint);
}

function handleAdminHash() {
  if (window.location.hash === ADMIN_HASH) {
    if (currentRoute !== 'admin') renderAdminScreen('forward');
  } else if (currentRoute === 'admin') {
    renderMenu('back');
  }
}

window.addEventListener('hashchange', handleAdminHash);

function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

await initAdminPlayerDatabase();
if (window.location.hash === ADMIN_HASH) {
  renderAdminScreen('forward');
} else {
  renderMenu();
}
