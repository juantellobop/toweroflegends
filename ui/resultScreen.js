// Torre de Leyendas — Pantallas de resultado y fin de run (§4.5/§4.6, §8.6/§8.7).

import { esc } from './dom.js';
import { summarize } from '../engine/narrator.js';
import { confetti, haptic } from '../match/feedback.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { renderLeaderboard } from './leaderboard.js';
import { localizeNation, localizeOpponentName, t } from '../data/i18n.js';

function localizeHistoryOpponent(value) {
  const text = String(value || '');
  const match = text.match(/^(.+?)\s+(\d{4})$/);
  return match ? `${localizeNation(match[1])} ${match[2]}` : localizeNation(text);
}

function packVisual(kind, label, count, muted = false) {
  const art = kind === 'item' ? UI_ASSETS.packs.item : UI_ASSETS.packs.player;
  return `
    <div class="result-pack ${muted ? 'muted' : ''}">
      <img src="${art}" alt="" loading="lazy" decoding="async" />
      <span class="result-pack-count">${count}</span>
      <b>${label}</b>
    </div>`;
}

// Pantalla tras un partido ganado/empatado (o derrota con vidas restantes).
export function renderResult(root, state, reward, handlers) {
  const m = state.lastMatch;
  const { scorers } = summarize(m.eventos);
  const survived = reward.survivedLoss;
  const resultAsset = reward.result === 'loss' ? UI_ASSETS.results.loss : UI_ASSETS.results.win;
  const resultTitle = reward.result === 'loss'
    ? (survived ? t('result.lostStep') : t('result.towerFall'))
    : t(`result.tier.${reward.tier}`);
  const nextLabel = survived ? t('result.retry') : t('result.nextLevel');

  let rewardHTML;
  if (reward.result === 'loss') {
    rewardHTML = `
      <div class="result-reward-panel arcade-panel loss-reward">
        ${packVisual('player', t('generic.players'), 0, true)}
        ${packVisual('item', t('generic.items'), 0, true)}
        <div class="reward-copy">
          <span class="tier-tag tier-derrota">${t('result.tier.derrota')}</span>
          <p>${t('result.lossCopy', { lives: state.lives })}</p>
        </div>
      </div>`;
  } else {
    rewardHTML = `
      <div class="result-reward-panel arcade-panel">
        <div class="reward-head">
          <span class="tier-tag tier-${reward.tier}">${t(`result.tier.${reward.tier}`)}</span>
          <span class="reward-head-label">${t('result.reward')}</span>
        </div>
        <div class="result-packs">
          ${packVisual('player', t('generic.players'), reward.playerPack)}
          ${packVisual('item', t('generic.items'), reward.itemPack)}
        </div>
        <p class="reward-copy">${t('result.rewardCopy', { players: reward.playerPack, items: reward.itemPack })}</p>
      </div>`;
  }
  root.innerHTML = `
    <section class="screen result-screen pixel-screen result-${reward.result}">
      <div class="result-showcase">
        <div class="result-poster arcade-panel">
          <img class="result-art" src="${resultAsset}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <div class="result-title-chip">${esc(resultTitle)}</div>
        </div>
        <div class="result-score-card arcade-panel">
          <div class="level-badge">${t('generic.level', { level: state.level })}</div>
          <div class="final-score">${m.golesA} <span class="sep">:</span> ${m.golesB}</div>
          <div class="result-teams">
            <span><img class="flag-img" src="${esc(flagSrcForNation(state.team?.nation || state.team?.name || 'Leyendas', [state.team?.color || '#d4af37', '#071459']))}" alt="" />${esc(state.team?.name || 'Leyendas')}</span>
            <small>${t('generic.vs')}</small>
            <span><img class="flag-img" src="${esc(flagSrcForNation(state.opponent.name, [state.opponent.colors.primary, state.opponent.colors.secondary]))}" alt="" />${esc(localizeOpponentName(state.opponent))}</span>
          </div>
          <div class="result-scorers">
            <span>${t('result.scorers')}</span>
            <b>${scorers.length ? esc(scorers.join(', ')) : '—'}</b>
          </div>
        </div>
      </div>
      <div class="result-progress-row">
        <div class="tower-next arcade-panel">
          <img class="tower-next-img" src="${UI_ASSETS.results.tower}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <span>${t('generic.floor', { floor: state.level })}</span>
        </div>
        ${rewardHTML}
      </div>
      <div class="result-cta action-bar">
        <button id="next" class="primary big glass-cta">▶ ${nextLabel}</button>
      </div>
    </section>`;

  // Guiño a la goleada (§4.5): celebración extra con confeti sobrio + háptica.
  if (reward.result !== 'loss' && reward.tier === 'goleada') {
    const host = root.querySelector('.result-screen');
    confetti(host, '#FFD60A');
    haptic([24, 40, 24, 40, 60]);
  }

  root.querySelector('#next').addEventListener('click', () => handlers.onNext());
}

// Pantalla de fin de run / resumen (§8.7). best = mejor nivel histórico.
export function renderGameOver(root, state, best, handlers) {
  const reached = state.level; // nivel donde cayó = puntuación
  const wins = state.history.filter((h) => h.result === 'win').length;
  const isRecord = reached >= best;
  const leaderboard = handlers.leaderboard || { entries: [], loading: true };

  const path = state.history.map((h) => `
    <li class="path-item result-${h.result}">
      <span class="path-lvl">${t('result.pathLevel', { level: h.level })}</span>
      <span class="path-score">${esc(h.score)}</span>
      <span class="path-opp">${esc(localizeHistoryOpponent(h.opponent))}</span>
    </li>`).join('');

  const LINE_ORDER = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
  const squad = state.squad
    .slice()
    .sort((a, b) => LINE_ORDER[a.position] - LINE_ORDER[b.position])
    .map((p) => `<span class="squad-chip rarity-${esc(p.rarity)}">${esc(p.name)}</span>`).join('');

  root.innerHTML = `
    <section class="screen gameover-screen pixel-screen">
      <div class="gameover-hero">
        <img class="tower-art" src="${UI_ASSETS.results.tower}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <h1>${t('result.gameOver')}</h1>
        <div class="final-level">
          <span class="big-num">${reached}</span>
          <span class="big-label">${t('result.floorsReached')}</span>
        </div>
        ${isRecord ? `<div class="record">${t('result.newRecord')}</div>` : `<div class="record muted">${t('result.best', { best })}</div>`}
        <p class="go-stat">${t('result.winsRoster', { wins, count: state.squad.length })}</p>
      </div>
      ${renderLeaderboard(leaderboard.entries || [], {
        currentId: leaderboard.entryId,
        rank: leaderboard.rank,
        loading: leaderboard.loading,
        submitted: leaderboard.submitted,
        readOnly: leaderboard.readOnly,
      })}
      <h3>${t('result.route')}</h3>
      <ul class="path">${path}</ul>
      <h3>${t('result.finalSquad')}</h3>
      <div class="squad-final">${squad}</div>
      <div class="go-actions action-bar">
        <button id="again" class="primary big glass-cta">${t('result.playAgain')}</button>
      </div>
    </section>`;

  root.querySelector('#again').addEventListener('click', () => handlers.onRestart());
}
