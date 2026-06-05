// Torre de Leyendas — Pantalla de partido: simulación gráfica (§5 del plan UI/UX).
// Tres capas (§5.2): marcador tipo Live Activity (cristal) · campo 2D ·
// ticker de comentario + controles. El `MatchDirector` reproduce los eventos
// del motor; esta pantalla solo monta el render y cablea controles y feedback.

import { Pitch } from '../match/pitch.js';
import { ScenePitch } from '../match/scenePitch.js';
import { MatchDirector, MODES } from '../match/director.js';
import { confetti, haptic, countTo } from '../match/feedback.js';
import { FORMATIONS } from '../data/config.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { localizeOpponentName, t } from '../data/i18n.js';

const SPEEDS = [1, 2, 4];

const prefersReduced = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function renderMatch(root, state, result, handlers) {
  const opp = state.opponent;
  const reduce = prefersReduced();
  const homeShape = FORMATIONS[state.formation] || FORMATIONS['4-3-3'];

  // Identidad del equipo local (nombre + bandera elegidos en el menú).
  const HOME_NAME = state.team?.name || 'Leyendas';
  const HOME_COLOR = state.team?.color || '#D4AF37';
  const homeFlag = flagSrcForNation(state.team?.nation || HOME_NAME, [HOME_COLOR, '#071459']);
  const awayName = localizeOpponentName(opp);

  // Posesión global a partir del reparto de ataques del motor (proporción real).
  const homeAtt = result.eventos.filter((e) => e.attackerTeam === HOME_NAME).length || 1;
  const total = result.eventos.length || 2;
  const startMomentum = homeAtt / total;

  const segs = Object.entries(MODES)
    .map(([k]) => `<button class="seg" data-mode="${k}">${t(`match.modes.${k}`)}</button>`).join('');

  root.innerHTML = `
    <section class="screen match-screen pixel-screen" style="--match-bg:url('${UI_ASSETS.backgrounds.pitch}')">
      <div class="match-livebar">
        <span>${t('generic.floor', { floor: state.level })}</span>
        <b>${t('match.modes.full')}</b>
        <span>${t('match.plays', { count: result.eventos.length })}</span>
      </div>
      <!-- Capa 1: marcador Live Activity (cristal) -->
      <div class="match-scoreboard glass" id="scoreboard">
        <div class="sb-team home">
          <img class="sb-crest sb-flag" src="${esc(homeFlag)}" alt="" loading="lazy" decoding="async" />
          <span class="sb-name">${esc(HOME_NAME)}</span>
        </div>
        <div class="sb-center">
          <div class="sb-score tabular"><span id="scoreA">0</span><span class="sb-sep">·</span><span id="scoreB">0</span></div>
          <div class="sb-clock tabular"><span id="clock">0</span>'</div>
        </div>
        <div class="sb-team away">
          <span class="sb-name">${esc(awayName)}</span>
          <img class="sb-crest sb-flag" src="${esc(flagSrcForNation(opp.name, [opp.colors.primary, opp.colors.secondary]))}" alt="" loading="lazy" decoding="async" />
        </div>
        <div class="sb-momentum"><span id="momentum" class="sb-momentum-fill" style="width:${Math.round(startMomentum * 100)}%"></span></div>
      </div>

      <!-- Capa 2: campo 2D -->
      <div class="match-pitch" id="pitchHost"></div>

      <!-- Capa 3: ticker de comentario (cristal) + controles -->
      <div class="match-ticker glass-thin">
        <p id="nowComment" class="ticker-now">${t('match.tickerStart', { level: state.level })}</p>
        <div id="commentary" class="ticker-log"></div>
        <p id="announcer" class="sr-only" aria-live="assertive" role="status"></p>
      </div>

      <div class="match-command-deck glass">
        <div class="match-controls">
          <button id="playPause" class="ctl primary-ctl" aria-label="${t('match.playPauseAria')}">⏸</button>
          <button id="speed" class="ctl tabular" aria-label="${t('match.speedAria')}">1×</button>
          <button id="nextHL" class="ctl" aria-label="${t('match.nextAria')}">⏭</button>
          <button id="skip" class="ctl" aria-label="${t('match.skipAria')}">${t('match.skipFinal')}</button>
          <button id="continue" class="ctl primary-ctl" disabled>${t('match.continue')}</button>
        </div>
        <div class="match-modes seg-control" role="tablist" aria-label="${t('match.modesAria')}">${segs}</div>
      </div>
    </section>`;

  // === Render del campo ===
  const useScenes = typeof document !== 'undefined';
  const pitch = useScenes
    ? new ScenePitch({ homeColor: HOME_COLOR, awayColor: opp.color, reduceMotion: reduce })
    : new Pitch({ homeColor: HOME_COLOR, awayColor: opp.color, homeShape, reduceMotion: reduce });
  const pitchHost = root.querySelector('#pitchHost');
  pitchHost.classList.toggle('scene-pitch-host', useScenes);
  pitchHost.appendChild(pitch.element || pitch.svg);

  // === Referencias ===
  const $ = (sel) => root.querySelector(sel);
  const scoreA = $('#scoreA'), scoreB = $('#scoreB'), clockEl = $('#clock');
  const momentum = $('#momentum'), nowComment = $('#nowComment'), commentary = $('#commentary');
  const announcer = $('#announcer'), scoreboard = $('#scoreboard');
  const playPause = $('#playPause'), speedBtn = $('#speed');
  const continueBtn = $('#continue'), skipBtn = $('#skip'), nextHLBtn = $('#nextHL');

  let speedIdx = 0;
  let director = null;
  let finished = false;
  let typeToken = 0;

  function anticipationText(ev) {
    const minute = ev.minute ?? 0;
    if (ev.type === 'gol') return t('match.anticipation.gol', { minute });
    if (ev.type === 'parada') return t('match.anticipation.parada', { minute });
    if (ev.type === 'tiro_fuera' || ev.type === 'bloqueo') return t('match.anticipation.shot', { minute });
    if (ev.type === 'falta') return t('match.anticipation.falta', { minute });
    return t('match.anticipation.default', { minute });
  }

  function showAnticipation(ev) {
    typeToken++;
    nowComment.textContent = anticipationText(ev);
    nowComment.classList.add('expecting');
    nowComment.classList.remove('typing');
  }

  function typeLine(line, text, opts = {}) {
    const token = ++typeToken;
    const reduce = opts.instant || prefersReduced();
    const ms = reduce ? 0 : Math.max(8, Math.min(28, 22 / Math.max(1, opts.speed || 1)));
    line.textContent = '';
    nowComment.textContent = '';
    nowComment.classList.remove('expecting');
    nowComment.classList.add('typing');

    return new Promise((resolve) => {
      if (reduce) {
        line.textContent = text;
        nowComment.textContent = text;
        nowComment.classList.remove('typing');
        resolve();
        return;
      }
      let i = 0;
      function tick() {
        if (token !== typeToken) { resolve(); return; }
        i += 1;
        const part = text.slice(0, i);
        line.textContent = part;
        nowComment.textContent = part;
        if (i >= text.length) {
          nowComment.classList.remove('typing');
          resolve();
          return;
        }
        setTimeout(tick, text[i - 1] === '.' || text[i - 1] === '!' ? ms * 5 : ms);
      }
      tick();
    });
  }

  async function appendLine(ev, text, opts = {}) {
    const line = document.createElement('div');
    line.className = `play play-${ev.type}${ev.counter ? ' counter' : ''}`;
    commentary.appendChild(line);
    commentary.scrollTop = commentary.scrollHeight;
    // Mantén el log acotado (rendimiento / memoria).
    while (commentary.children.length > 40) commentary.removeChild(commentary.firstChild);
    await typeLine(line, text, opts);
  }

  function buildDirector(mode) {
    if (director) director.destroy();
    typeToken++;
    finished = false;
    commentary.innerHTML = '';
    scoreA.textContent = '0'; scoreB.textContent = '0'; clockEl.textContent = '0';
    pitch.reset();
    continueBtn.disabled = true; continueBtn.classList.remove('ready');
    skipBtn.disabled = false; nextHLBtn.disabled = false;
    playPause.textContent = '⏸';

    director = new MatchDirector({
      events: result.eventos, homeName: HOME_NAME, pitch, result,
      speed: SPEEDS[speedIdx], mode,
      callbacks: {
        onClock: (m) => { clockEl.textContent = m; },
        onAnticipation: (ev) => showAnticipation(ev),
        onComment: (ev, text, opts) => appendLine(ev, text, opts),
        onScore: (a, b) => { countTo(scoreA, a); countTo(scoreB, b); },
        onMomentum: (m) => { momentum.style.width = Math.round(m * 100) + '%'; },
        onAnnounce: (text) => { announcer.textContent = text; },
        onGoal: (ev, side) => {
          const color = side === 'home' ? HOME_COLOR : opp.color;
          confetti(scoreboard, color);
          haptic([24, 40, 24]);
          scoreboard.classList.add('goal-pop');
          setTimeout(() => scoreboard.classList.remove('goal-pop'), 700);
        },
        onSave: () => { scoreboard.classList.add('save-flash'); setTimeout(() => scoreboard.classList.remove('save-flash'), 400); },
        onEnd: () => onFinishPlayback(),
      },
    });
    director.play();
    updateModeButtons(mode);
  }

  function onFinishPlayback() {
    finished = true;
    typeToken++;
    scoreA.textContent = result.golesA;
    scoreB.textContent = result.golesB;
    clockEl.textContent = '90';
    skipBtn.disabled = true; nextHLBtn.disabled = true;
    playPause.textContent = '▶';
    continueBtn.disabled = false;
    continueBtn.classList.add('ready');
    // Línea de cierre en el ticker (garantiza contenido tras "saltar al final").
    if (!commentary.querySelector('.play-final')) {
      const end = document.createElement('div');
      end.className = 'play play-final';
      end.textContent = t('match.finalLine', { home: HOME_NAME, homeGoals: result.golesA, awayGoals: result.golesB, away: awayName });
      commentary.appendChild(end);
      nowComment.textContent = end.textContent;
    }
    announcer.textContent = t('match.finalAnnounce', { homeGoals: result.golesA, awayGoals: result.golesB });
  }

  function updateModeButtons(mode) {
    root.querySelectorAll('.seg').forEach((b) => {
      const on = b.dataset.mode === mode;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
  }

  // === Controles ===
  playPause.addEventListener('click', () => {
    if (finished) return;
    director.toggle();
    playPause.textContent = director.isPaused() ? '▶' : '⏸';
  });
  speedBtn.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    speedBtn.textContent = SPEEDS[speedIdx] + '×';
    if (director) director.setSpeed(SPEEDS[speedIdx]);
  });
  nextHLBtn.addEventListener('click', () => { if (director && !finished) director.skipHighlight(); });
  skipBtn.addEventListener('click', () => { if (director) director.skipToEnd(); });
  continueBtn.addEventListener('click', () => { if (director) director.destroy(); handlers.onFinish(); });
  root.querySelectorAll('.seg').forEach((b) => {
    b.addEventListener('click', () => buildDirector(b.dataset.mode));
  });

  // Arranque: reduce-motion → modo accesible "solo comentario" (§5.3, §5.7).
  buildDirector(reduce ? 'commentary' : 'full');
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
