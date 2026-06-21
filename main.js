// Torre de Leyendas — Orquestador del bucle de juego (§3, §9.2).
// Conecta el estado de la run (state/run.js) con las pantallas de /ui.

import {
  createRun, rollPlayerPack, rollItemPack, choosePlayerCard, chooseItemCard,
  discardPlayerPack, discardItemPack,
  isNationPackLevel, rollNationPack,
  rollManagerPack, chooseManagerCard, discardManagerPack,
  rollCorruptoPack, chooseCorruptoCard, rollShinyPack, chooseShinyCard,
  playMatch, applyResult, advanceLevel, prepareOpponent, retryLevel,
  togglePlayerInLineup, placePlayerInLineup, setFormation, setStyle, assignLineToSlots,
  serializeRun, rehydrateRun,
} from './state/run.js';
import { acquireRunLock, releaseRunLock } from './state/sesion.js';
import { renderPlayerPack, renderItemPack, renderNationPack, renderManagerPack, renderCorruptoPack, renderShinyPack } from './ui/packScreen.js';
import { renderSquadIntro } from './ui/squadIntroScreen.js';
import { renderBuild } from './ui/buildScreen.js';
import { renderScouting } from './ui/scoutingScreen.js';
import { renderMatch } from './ui/matchScreen.js';
import { renderResult, renderGameOver } from './ui/resultScreen.js';
import { renderCarryover } from './ui/carryoverScreen.js';
import { fetchLeaderboard, fetchWeeklyLeaderboard, openLeaderboardLineup, renderLeaderboard, submitLeaderboardEntry, submitWeeklyLeaderboardEntry } from './ui/leaderboard.js';
import { CONFIG, LINES } from './data/config.js';
import { playerOVR } from './engine/ovr.js';
import { preloadUiAssets, UI_ASSETS } from './data/uiAssets.js';
import { flagSrcForNation, FLAG_NATIONS } from './data/flags.js';
import {
  TEAM_NAME_MAX_LENGTH,
  filterTeamNameInput, hasDisallowedTeamNameChars, sanitizeTeamName,
} from './data/teamName.js';
import { LANGUAGES, getLanguage, initLanguage, localizeNation, setLanguage, t } from './data/i18n.js';
import { GAME_VERSION } from './data/version.js';
import { esc, prefersReducedMotion } from './ui/dom.js';

// Comunidad en vivo (contadores del menú + presencia): módulo 100% opcional
// cargado en diferido. Si la petición del archivo falla (challenge anti-bots
// del hosting, bloqueadores de contenido...), el juego arranca igual, solo
// que sin contadores. Un import estático aquí tumbaría toda la UI.
let liveStats = null;
const liveStatsReady = import('./data/comunidad.js')
  .then((mod) => {
    liveStats = mod;
    mod.startPresence();
    return mod;
  })
  .catch(() => null);

const root = document.getElementById('app');
initLanguage();
// Conservamos las referencias para que todas las descargas de UI iniciadas al
// entrar terminen y queden disponibles en la caché HTTP del navegador.
const preloadedUiImages = preloadUiAssets();
const BEST_KEY = 'tdl_best';
const ROUTE_ORDER = {
  menu: 0,
  busy: 0,
  admin: 1,
  squadIntro: 2,
  playerPack: 3,
  managerPack: 4,
  itemPack: 5,
  corruptoPack: 5.5,
  scouting: 6,
  build: 7,
  match: 8,
  result: 9,
  shinyPack: 9.5,
  gameover: 10,
};

function getBest() {
  return parseInt(localStorage.getItem(BEST_KEY) || '0', 10) || 0;
}
function setBest(v) {
  if (v > getBest()) localStorage.setItem(BEST_KEY, String(v));
}

// === Autoguardado de la run en el navegador ===
// Un único slot: empezar una run nueva sobrescribe la anterior (no se puede
// bifurcar/clonar dentro del mismo navegador). El guardado es 100% local y
// funciona sin servidor; el anti-clon del ranking va aparte (runId).
const SAVE_KEY = 'tdl_save';

function saveRun(run) {
  if (!run) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(serializeRun(run)));
  } catch (_) {
    // Cuota llena o almacenamiento bloqueado: la run sigue en memoria.
  }
}

function readSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function hasSavedRun() {
  return Boolean(readSave());
}

function clearSavedRun() {
  try { localStorage.removeItem(SAVE_KEY); } catch (_) { /* idem saveRun */ }
}

// Rehidrata la run guardada, o limpia el slot si es incompatible/corrupto.
function loadRun() {
  const data = readSave();
  const run = data ? rehydrateRun(data) : null;
  if (!run) clearSavedRun();
  return run;
}

let state = null;
let leaderboardCache = { entries: [], loaded: false };
let leaderboardPromise = null;
let weeklyLeaderboardCache = { entries: [], loaded: false };
let weeklyLeaderboardPromise = null;
let currentRoute = '';
let menuDraft = { teamName: '', nation: '' };

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
      // 540ms > la animación interna más larga (panel-rise 500ms): quitar la
      // clase antes cortaba esas animaciones a medias (salto de 1 frame).
      setTimeout(() => {
        screen.classList.remove('screen-enter', `screen-enter-${direction}`);
        root.classList.remove('app-route-changing');
      }, 540);
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
  const target = event.target.closest('button, .deal-card, .card.clickable, .admin-player-row, .leaderboard-row.has-lineup');
  if (!target || target.disabled || target.getAttribute('aria-disabled') === 'true') return;
  target.classList.add('is-pressing');
});

// Las filas del top 20 con once guardado abren el modal del último partido.
root.addEventListener('click', (event) => {
  const row = event.target.closest('.leaderboard-row.has-lineup');
  if (row?.dataset.entryId) openLeaderboardLineup(row.dataset.entryId);
});

root.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const row = event.target.closest?.('.leaderboard-row.has-lineup');
  if (row?.dataset.entryId) {
    event.preventDefault();
    openLeaderboardLineup(row.dataset.entryId);
  }
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

function loadWeeklyLeaderboard() {
  if (weeklyLeaderboardCache.loaded) return Promise.resolve(weeklyLeaderboardCache);
  if (!weeklyLeaderboardPromise) {
    weeklyLeaderboardPromise = fetchWeeklyLeaderboard()
      .then((data) => {
        weeklyLeaderboardCache = { ...data, loaded: true };
        return weeklyLeaderboardCache;
      })
      .finally(() => { weeklyLeaderboardPromise = null; });
  }
  return weeklyLeaderboardPromise;
}

// Contadores en vivo del pie del menú: jugadores conectados y partidas
// totales. Sin servidor (stats === null) el bloque queda oculto. Un único
// temporizador refresca mientras el menú siga montado y muere al salir de él.
let menuStatsTimer = null;

function updateMenuStats() {
  const draw = (stats) => {
    const mount = root.querySelector('#menu-stats');
    if (!mount || !stats) return;
    // Tu propio latido puede no haber llegado aún: tú siempre cuentas.
    const online = Math.max(1, Math.round(Number(stats.online) || 0));
    const totalGames = Math.max(0, Math.round(Number(stats.totalGames) || 0));
    mount.hidden = false;
    mount.innerHTML = `
      <span class="live-dot" aria-hidden="true"></span>
      <span>${t('menu.liveNow', { n: online.toLocaleString(getLanguage()) })}</span>
      <span class="menu-live-sep" aria-hidden="true">·</span>
      <span>${t('menu.totalRuns', { n: totalGames.toLocaleString(getLanguage()) })}</span>`;
  };

  const refresh = () => {
    if (liveStats) liveStats.fetchLiveStats().then(draw);
  };

  liveStatsReady.then(refresh);
  if (menuStatsTimer) clearInterval(menuStatsTimer);
  menuStatsTimer = setInterval(() => {
    if (!root.querySelector('#menu-stats')) {
      clearInterval(menuStatsTimer);
      menuStatsTimer = null;
      return;
    }
    refresh();
  }, 30_000);
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

function updateMenuWeeklyLeaderboard() {
  const mount = root.querySelector('#menu-ranking-weekly');
  if (!mount) return;
  mount.innerHTML = renderLeaderboard(weeklyLeaderboardCache.entries, {
    compact: true,
    variant: 'weekly',
    loading: !weeklyLeaderboardCache.loaded,
  });
  loadWeeklyLeaderboard().then((data) => {
    const currentMount = root.querySelector('#menu-ranking-weekly');
    if (currentMount) {
      currentMount.innerHTML = renderLeaderboard(data.entries, { compact: true, variant: 'weekly' });
    }
  });
}

// Once del último partido tal como saltó al campo: por línea y en el orden
// visible de los huecos (assignLineToSlots), con OVR y rareza para el modal.
// Parte de kickoff11 (el once antes de que applySuspensions vacíe el puesto del
// expulsado), así que el sancionado sigue en su sitio y se marca con `expelled`
// para pintarle la tarjeta roja. Sin kickoff11 (no debería en gameover) cae al
// once actual.
function lineupSnapshot(run) {
  const m = run.lastMatch;
  const byUid = new Map((run.squad || []).map((p) => [p.uid, p]));
  const kickoff = m?.kickoff11;
  const lineFor = (line) => kickoff
    ? (kickoff[line] || []).map((uid) => (uid != null && byUid.get(uid)) || null)
    : (run.starting11[line] || []);
  const expelled = new Set((m?.expulsadosA || []).map((e) => e.uid));
  const injured = new Set((m?.lesionadosA || []).map((e) => e.uid));
  return LINES.flatMap((line) =>
    assignLineToSlots(run.formation, line, lineFor(line))
      .filter((slot) => slot.player)
      .map((slot) => ({
        name: slot.player.name,
        position: slot.player.position,
        line,
        // Hueco del grid (line+slot) para reconstruir el dibujo exacto en el
        // ranking, incluidas tácticas personalizadas y líneas de 5.
        slot: slot.slotIndex,
        ovr: playerOVR(slot.player),
        rarity: slot.player.rarity || '',
        ...(expelled.has(slot.player.uid) ? { expelled: true } : {}),
        ...(injured.has(slot.player.uid) ? { injured: true } : {}),
      }))
  );
}

// DT del último partido (snapshot) para guardarlo junto a la entrada del ranking.
function managerSnapshot(run) {
  const m = run.lastMatch?.manager || run.manager;
  return m ? { id: m.id, name: m.name, nation: m.nation || '' } : null;
}

function submitGameOverRanking() {
  if (!state.leaderboardPromise && !state.leaderboardResult) {
    const run = state;
    run.leaderboardPromise = submitLeaderboardEntry({
      runId: run.runId,
      teamName: run.team?.name || 'Leyendas',
      nation: run.team?.nation || '',
      floor: run.level,
      formation: run.formation,
      lineup: lineupSnapshot(run),
      manager: managerSnapshot(run),
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

// Envío paralelo al ranking semanal: mismo payload y mismo runId que el histórico
// (el anti-clon por runId actúa en cada archivo por separado). Falla de forma
// independiente: si un endpoint cae por el WAF, el otro sigue su curso.
function submitGameOverWeeklyRanking() {
  if (!state.weeklyLeaderboardPromise && !state.weeklyLeaderboardResult) {
    const run = state;
    run.weeklyLeaderboardPromise = submitWeeklyLeaderboardEntry({
      runId: run.runId,
      teamName: run.team?.name || 'Leyendas',
      nation: run.team?.nation || '',
      floor: run.level,
      formation: run.formation,
      lineup: lineupSnapshot(run),
      manager: managerSnapshot(run),
    }).then((data) => {
      run.weeklyLeaderboardResult = { ...data, submitted: true };
      weeklyLeaderboardCache = { ...data, loaded: true };
      if (state === run && state.phase === 'gameover') render();
      return run.weeklyLeaderboardResult;
    }).catch(() => {
      run.weeklyLeaderboardResult = { entries: weeklyLeaderboardCache.entries, submitted: true, readOnly: true };
      if (state === run && state.phase === 'gameover') render();
      return run.weeklyLeaderboardResult;
    });
  }

  return state.weeklyLeaderboardResult || {
    entries: weeklyLeaderboardCache.entries,
    loading: true,
  };
}

// === Despacho por fase ===
function render(navHint = 'auto') {
  // Autoguardado: render() concentra cada cambio de fase, y el RNG aún está en
  // su punto previo a los sorteos que dispara esta fase, así que al reanudar se
  // regeneran idénticos. El partido es atómico (se renderiza fuera de render),
  // por lo que el save autoritativo queda tras aplicar el resultado.
  saveRun(state);
  switch (state.phase) {
    case 'squadIntro':
      // Arranque de la run: el equipo completo se presenta antes del primer sobre.
      renderRoute('squadIntro', () => {
        renderSquadIntro(root, state, {
          onContinue: () => {
            state.phase = 'playerPack';
            render('forward');
          },
        });
      }, navHint);
      break;

    case 'playerPack':
      renderRoute('playerPack', () => {
        const advance = () => {
          // El sobre de DT (nivel 1 y cada 7) va justo después del de jugadores.
          state.phase = state.pendingManagerPack ? 'managerPack' : 'itemPack';
          render('forward');
        };
        const onPick = (tpl) => { choosePlayerCard(state, tpl); advance(); };
        // Descartar jugadores: cierra el sobre sin llevarse carta y continúa.
        const onDiscard = () => { discardPlayerPack(state); advance(); };
        // Cada 5 niveles el sobre normal se reemplaza por el de selecciones:
        // se elige una selección (nación + año) y de ella cualquier jugador.
        const nationTeams = isNationPackLevel(state.level) ? rollNationPack(state) : null;
        if (nationTeams && nationTeams.length) {
          renderNationPack(root, state, nationTeams, onPick, onDiscard);
        } else {
          renderPlayerPack(root, state, rollPlayerPack(state), onPick, onDiscard);
        }
      }, navHint);
      break;

    case 'managerPack':
      renderRoute('managerPack', () => {
        renderManagerPack(root, state, rollManagerPack(state), (tpl) => {
          chooseManagerCard(state, tpl);
          state.phase = 'itemPack';
          render('forward');
        }, state.level === 1 ? null : () => {
          // Descartar entrenadores: no se elige ninguno y se continúa. En el
          // nivel 1 no se ofrece: elegir DT es obligatorio (no hay DT previo).
          discardManagerPack(state);
          state.phase = 'itemPack';
          render('forward');
        });
      }, navHint);
      break;

    case 'itemPack':
      renderRoute('itemPack', () => {
        const toScouting = () => {
          prepareOpponent(state);
          state.phase = 'scouting';
          render('forward');
        };
        renderItemPack(root, state, rollItemPack(state), (tpl) => {
          // El "Representante corrupto" no es un objeto pasivo: abre el sobre
          // Corrupto en lugar de añadirse al inventario.
          if (tpl.special === 'corrupto') {
            state.phase = 'corruptoPack';
            render('forward');
            return;
          }
          chooseItemCard(state, tpl);
          toScouting();
        }, () => {
          // Descartar objetos: cierra el sobre sin llevarse ninguno y continúa.
          discardItemPack(state);
          toScouting();
        });
      }, navHint);
      break;

    case 'corruptoPack': {
      // Sobre del item: entrega un jugador Corrupto que se autoubica sellado en
      // el once. Sin candidatos (el usuario aún no creó Corruptos), se continúa.
      const corruptoChoices = rollCorruptoPack(state);
      const toScouting = () => {
        prepareOpponent(state);
        state.phase = 'scouting';
        render('forward');
      };
      if (!corruptoChoices.length) { toScouting(); break; }
      renderRoute('corruptoPack', () => {
        renderCorruptoPack(root, state, corruptoChoices, (tpl) => {
          chooseCorruptoCard(state, tpl);
          toScouting();
        });
      }, navHint);
      break;
    }

    case 'shinyPack': {
      // Tras vender al Corrupto: sobre con el mejor jugador no poseído de cada
      // país (+10 a todas las stats). Sin candidatos, se cierra la venta y avanza.
      const shinyChoices = rollShinyPack(state);
      const proceed = () => { advanceLevel(state); render('forward'); };
      if (!shinyChoices.length) { chooseShinyCard(state, null); proceed(); break; }
      renderRoute('shinyPack', () => {
        renderShinyPack(root, state, shinyChoices, (tpl) => {
          chooseShinyCard(state, tpl);
          proceed();
        }, { soldName: state.pendingShinySale?.soldName || '' });
      }, navHint);
      break;
    }

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
          onSetStyle: (s) => { setStyle(state, s); render('refresh'); },
          onScout: () => { state.phase = 'scouting'; render('back'); },
          onPlay: () => {
            // El partido se simula aquí (fija state.lastMatch y el rival) y se
            // entra a la fase 'match' por render(): así se autoguarda y, si se
            // cierra a media reproducción, se retoma en la pantalla del partido.
            playMatch(state);
            state.phase = 'match';
            render('forward');
          },
        });
      }, navHint);
      break;

    case 'match':
      // Si se retoma sin partido simulado (caso anómalo), volver al tablero.
      if (!state.lastMatch) { state.phase = 'build'; render('refresh'); break; }
      renderRoute('match', () => {
        renderMatch(root, state, state.lastMatch, {
          onFinish: () => {
            const reward = applyResult(state);
            state.pendingReward = reward;
            state.phase = reward.gameOver ? 'gameover' : 'result';
            render('forward');
          },
        });
      }, navHint);
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
            } else if (state.pendingShinySale) {
              // Corrupto vendido: antes de avanzar, el sobre Shiny de recompensa.
              state.phase = 'shinyPack';
              render('forward');
            } else {
              advanceLevel(state);
              // La partida cuenta para el contador global al ALCANZAR el
              // nivel 2: abrir una run y abandonarla en el primer piso no
              // infla la cifra. advanceLevel pasa de 1 a 2 una sola vez.
              if (state.level === 2) liveStats?.reportRunPlayed();
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
          weeklyLeaderboard: submitGameOverWeeklyRanking(),
          onEnd: () => {
            clearSavedRun();
            releaseRunLock();
            state = null;
            renderMenu('back');
          },
          onReplay: () => renderCarryoverScreen('forward'),
        });
      }, navHint);
      break;

    default:
      renderMenu(navHint);
  }
}

// Pantalla "Volver a jugar": elegir un jugador de la run terminada para
// arrastrarlo a una run nueva que arranca al instante (resto de plantilla nuevo,
// rival aleatorio). Conserva la identidad del equipo y el cerrojo de la pestaña;
// el autosave de render() sobrescribe el slot de la run anterior.
function renderCarryoverScreen(navHint = 'forward') {
  renderRoute('carryover', () => {
    renderCarryover(root, state, {
      onPick: (player) => {
        state = createRun({
          formation: CONFIG.STARTING_FORMATION,
          lives: CONFIG.LIVES,
          teamName: state.team?.name,
          teamNation: state.team?.nation,
          carryoverPlayer: player,
        });
        render('forward');
      },
      onBack: () => render('back'),
    });
  }, navHint);
}

// === Menú de inicio (§8.1) ===
function renderMenu(navHint = 'auto') {
  renderRoute('menu', () => {
    const draftNation = menuDraft.nation || '';
    const hasDraftNation = Boolean(draftNation);
    // Resumen de la run guardada (sin rehidratar del todo): equipo + nivel.
    const savedRun = readSave();
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
          <!-- Selector de 60 banderas: loading="lazy" a propósito (rejilla larga; no
               todas se ven a la vez). El resto de imágenes del juego van eager. -->
          <div class="flag-picker" id="m-flagpicker" role="radiogroup" aria-label="${t('menu.flagAria')}" aria-describedby="m-flag-error">
            ${FLAG_NATIONS.map((n) => `
            <button type="button" class="flag-opt ${n === draftNation ? 'is-active' : ''}" data-nation="${esc(n)}" role="radio" aria-checked="${n === draftNation ? 'true' : 'false'}" title="${esc(localizeNation(n))}" aria-label="${esc(localizeNation(n))}">
              <img src="${flagSrcForNation(n)}" alt="" loading="lazy" decoding="async" />
            </button>`).join('')}
          </div>
          <p class="ti-error" id="m-flag-error" hidden>${t('menu.flagError')}</p>
        </div>
        <div class="menu-actions">
          ${savedRun ? `<button id="continue" class="primary big start-prompt">${t('menu.continueRun')}<small class="continue-meta">${esc(savedRun.team?.name || t('menu.namePlaceholder'))} · ${t('menu.continueFloor', { level: savedRun.level || 1 })}</small></button>` : ''}
          <button id="start" class="${savedRun ? 'ghost' : 'primary'} big start-prompt" ${hasDraftNation ? '' : 'disabled'}>${hasDraftNation ? t('menu.newRun') : t('menu.chooseFlag')}</button>
        </div>
        <div class="menu-rankings">
          <div id="menu-ranking" class="menu-ranking"></div>
          <div id="menu-ranking-weekly" class="menu-ranking"></div>
        </div>
        <div id="menu-stats" class="menu-live" aria-live="polite" hidden></div>
        <p class="menu-wiki"><a href="wikidata.html">${t('menu.wiki')}</a></p>
        <p class="disclaimer menu-legal">${t('menu.disclaimer')}</p>
        <p class="menu-version">v${GAME_VERSION}</p>
      </div>
    </section>`;

    updateMenuLeaderboard();
    updateMenuWeeklyLeaderboard();
    updateMenuStats();

    // --- Identidad del equipo: nombre + selector de bandera ---
    const nameInput = root.querySelector('#m-teamname');
    const nameError = root.querySelector('#m-team-error');
    const flagPreview = root.querySelector('#m-flag-preview');
    const flagWrap = root.querySelector('#m-flag-wrap');
    const flagEmpty = root.querySelector('#m-flag-empty');
    const picker = root.querySelector('#m-flagpicker');
    const flagError = root.querySelector('#m-flag-error');
    const startBtn = root.querySelector('#start');
    const continueBtn = root.querySelector('#continue');
    const languageSelect = root.querySelector('#m-language');
    let selectedNation = draftNation;

    if (continueBtn) {
      continueBtn.addEventListener('click', async () => {
        // Sesión única: si otra pestaña ya tiene la run activa, avisamos en vez
        // de cargar una copia divergente.
        if (!(await acquireRunLock())) { renderRunBusy(); return; }
        const run = loadRun();
        if (run) {
          state = run;
          render('forward');
        } else {
          // Save corrupto/incompatible: ya quedó limpio, refrescamos sin botón.
          releaseRunLock();
          renderMenu('refresh');
        }
      });
    }

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

    startBtn.addEventListener('click', async () => {
      if (!selectedNation) {
        flagError.hidden = false;
        picker.setAttribute('aria-invalid', 'true');
        return;
      }
      // Slot único: empezar otra borra la guardada. Confirmamos antes.
      if (hasSavedRun() && !window.confirm(t('menu.newRunConfirm'))) return;
      // Sesión única: no arrancar una run nueva si otra pestaña ya juega.
      if (!(await acquireRunLock())) { renderRunBusy(); return; }
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

// Pantalla de aviso cuando la run ya está abierta en otra pestaña. Reintentar
// readquiere el cerrojo (libre si la otra pestaña se cerró) y retoma la run.
function renderRunBusy(navHint = 'forward') {
  renderRoute('busy', () => {
    root.innerHTML = `
    <section class="screen menu-screen pixel-title-screen run-busy-screen"
      style="--title-bg:url('${UI_ASSETS.backgrounds.title}')">
      <div class="title-stage" aria-hidden="true">
        <img src="${UI_ASSETS.backgrounds.title}" alt="" loading="eager" decoding="async" />
      </div>
      <div class="menu-shell">
        <div class="arcade-panel run-busy-panel">
          <h2>${t('menu.runBusyTitle')}</h2>
          <p>${t('menu.runBusyBody')}</p>
          <div class="menu-actions">
            <button id="busy-retry" class="primary big start-prompt">${t('menu.runBusyRetry')}</button>
            <button id="busy-menu" class="ghost big start-prompt">${t('menu.backToMenu')}</button>
          </div>
        </div>
      </div>
    </section>`;

    root.querySelector('#busy-retry').addEventListener('click', async () => {
      if (!(await acquireRunLock())) { renderRunBusy('refresh'); return; }
      const run = loadRun();
      if (run) {
        state = run;
        render('forward');
      } else {
        releaseRunLock();
        renderMenu('back');
      }
    });
    root.querySelector('#busy-menu').addEventListener('click', () => renderMenu('back'));
  }, navHint);
}

renderMenu();

// Panel admin (#playeredit): vive solo en local/ (ignorado por git) y no se publica.
// Solo se intenta cargar cuando el hash es #playeredit, así un jugador normal NUNCA
// pide ./local/admin-boot.js (en producción no existe: daría 404 y un error de módulo
// en consola). En producción, si alguien entra a #playeredit, el import() falla y se
// captura: no hay panel. En local el módulo existe y el boot toma el control.
const ADMIN_HASH = '#playeredit';
let adminBootStarted = false;
async function maybeLoadAdminPanel() {
  if (adminBootStarted || window.location.hash !== ADMIN_HASH) return;
  adminBootStarted = true;
  try {
    const { initAdminBoot } = await import('./local/admin-boot.js');
    initAdminBoot({ root, renderRoute, renderMenu, getCurrentRoute: () => currentRoute });
  } catch (_) {
    /* sin panel admin (producción): el juego sigue, sin tocar la consola en cada carga */
  }
}
window.addEventListener('hashchange', maybeLoadAdminPanel);
maybeLoadAdminPanel();
