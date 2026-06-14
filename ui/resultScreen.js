// Torre de Leyendas — Pantallas de resultado y fin de run (§4.5/§4.6, §8.6/§8.7).

import { esc } from './dom.js';
import { summarize } from '../engine/narrator.js';
import { confetti, haptic } from '../match/feedback.js';
import { UI_ASSETS } from '../data/uiAssets.js';
import { flagSrcForNation } from '../data/flags.js';
import { renderLeaderboard } from './leaderboard.js';
import { pressArticleHTML } from './prensa.js';
import { localizeNation, localizeOpponentName, t, tIndexed } from '../data/i18n.js';
import { CONFIG, FORMATIONS, LINES } from '../data/config.js';
import { assignLineToSlots } from '../state/run.js';
import { portraitPathForPlayer } from '../data/playerAssets.js';
import { lineupFieldHTML, positionSlots, staticChipHTML } from './lineupBoard.js';
import { POSITION_LABEL } from './cards.js';

function localizeHistoryOpponent(value) {
  const text = String(value || '');
  const match = text.match(/^(.+?)\s+(\d{4})$/);
  return match ? `${localizeNation(match[1])} ${match[2]}` : localizeNation(text);
}

// Fila de expulsados del resumen: nombre + minuto con un icono de tarjeta roja.
function redsRowHTML(reds) {
  if (!reds || !reds.length) return '';
  const items = reds
    .map((r) => `<span class="result-red"><span class="result-red-card" aria-hidden="true"></span>${esc(r.name)} <small>${r.minute}'</small></span>`)
    .join('');
  return `
    <div class="result-scorers result-reds">
      <span>${t('result.reds')}</span>
      <b>${items}</b>
    </div>`;
}

// Tablero con la táctica del último partido (el que cerró la run): el once tal
// como saltó al campo (kickoff11), pintado con la lógica compartida del tablero
// táctico (lineupBoard) — huecos por línea, rol de cada hueco y coordenadas
// exactas del dibujo. Los expulsados se muestran en su sitio con tarjeta roja.
// Sin kickoff11 (saves antiguos) cae al once actual. Vacío sin alineación.
function lastTacticHTML(state) {
  if (!state.formation || !FORMATIONS[state.formation]) return '';
  const m = state.lastMatch;
  const byUid = new Map((state.squad || []).map((p) => [p.uid, p]));
  const kickoff = m?.kickoff11;
  const lineFor = (line) => kickoff
    ? (kickoff[line] || []).map((uid) => (uid != null && byUid.get(uid)) || null)
    : (state.starting11?.[line] || []);
  const expelled = new Set((m?.expulsadosA || []).map((e) => e.uid));
  const injured = new Set((m?.lesionadosA || []).map((e) => e.uid));
  const slots = LINES.flatMap((line) => {
    const filled = assignLineToSlots(state.formation, line, lineFor(line))
      .filter((slot) => slot.player);
    return positionSlots(state.formation, line, filled);
  });
  if (!slots.length) return '';
  const chipClassFor = (uid) => expelled.has(uid)
    ? 'scout-chip chip-expelled'
    : injured.has(uid) ? 'scout-chip chip-injured' : 'scout-chip';
  const field = lineupFieldHTML({
    formation: state.formation,
    slots,
    fieldClass: 'gameover-tactic-field',
    chip: (slot) => staticChipHTML(slot.player, {
      portraitSrc: portraitPathForPlayer(slot.player),
      flagSrc: flagSrcForNation(slot.player.nation),
      chipClass: chipClassFor(slot.player.uid),
    }),
  });
  return `
    <div class="gameover-tactic arcade-panel">
      <span class="gameover-match-label">${t('result.lastTactic')} · ${t('scouting.formation', { formation: state.formation })}</span>
      ${field}
    </div>`;
}

// Fila de cambios del resumen (resultado y gameover): tras expulsar a un DEF/ARQ
// entra un suplente de esa posición y sale un atacante (cambio de posición). Se
// nombra a quién entró y a quién dejó su puesto.
function subsRowHTML(subs) {
  if (!subs || !subs.length) return '';
  const items = subs.map((s) => {
    const inLabel = `${esc(s.inName)}${s.inPos ? ` <small>${esc(POSITION_LABEL[s.inPos] || s.inPos)}</small>` : ''}`;
    const out = s.outName
      ? `${esc(s.outName)}${s.outPos ? ` <small>${esc(POSITION_LABEL[s.outPos] || s.outPos)}</small>` : ''}`
      : '';
    return `<span class="result-sub">
        <span class="result-sub-in">▲ ${inLabel}</span>${out ? `<span class="result-sub-out">▼ ${out}</span>` : ''}
        <small class="result-sub-min">${s.minute}'</small>
      </span>`;
  }).join('');
  return `
    <div class="result-scorers result-subs">
      <span>${t('result.subs')}</span>
      <b>${items}</b>
    </div>`;
}

// Fila de lesionados del resumen: cruz médica con el nº de partidos que se
// perderá (0/1/3/6 según gravedad) + nombre + minuto + tipo de lesión.
function injuriesRowHTML(injuries) {
  if (!injuries || !injuries.length) return '';
  const items = injuries.map((inj) => {
    const type = tIndexed(`injury.types.${inj.severity}`, inj.typeIndex);
    const ban = CONFIG.INJURY_BAN[inj.severity] || 0;
    return `<span class="result-injury">
        <span class="result-injury-badge" title="${esc(t('result.injuryMatchesTitle', { n: ban }))}"><span class="result-injury-cross" aria-hidden="true"></span><span class="result-injury-count">${ban}</span></span>
        ${esc(inj.name)} <small>${inj.minute}'</small> <small>${esc(type)}</small>
      </span>`;
  }).join('');
  return `
    <div class="result-scorers result-injuries">
      <span>${t('result.injuries')}</span>
      <b>${items}</b>
    </div>`;
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
  const { scorers, reds } = summarize(m.eventos);
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
          ${redsRowHTML(reds)}
          ${injuriesRowHTML(m.lesionadosA)}
          ${subsRowHTML(m.sustitucionesA)}
        </div>
      </div>
      ${pressArticleHTML(state)}
      <div class="result-progress-row">
        <div class="tower-next arcade-panel">
          <img class="tower-next-img" src="${UI_ASSETS.results.tower}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <span>${t('generic.floor', { floor: state.level })}</span>
        </div>
        ${rewardHTML}
      </div>
      <div class="result-cta action-bar">
        <button id="next" class="primary big glass-cta">${nextLabel}</button>
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

  // Resumen del partido que cerró la run: al caer se llega aquí sin pasar por
  // la pantalla de resultado, así que el marcador va arriba, a la vista.
  const m = state.lastMatch;
  let lastMatchHTML = '';
  if (m) {
    const { scorers, reds } = summarize(m.eventos);
    const oppName = state.opponent ? localizeOpponentName(state.opponent) : '';
    lastMatchHTML = `
      <div class="gameover-match arcade-panel">
        <span class="gameover-match-label">${t('result.lastMatch')}</span>
        <div class="gameover-match-score">
          <span>${esc(state.team?.name || 'Leyendas')}</span>
          <b class="final-score">${m.golesA} <span class="sep">:</span> ${m.golesB}</b>
          <span>${esc(oppName)}</span>
        </div>
        <div class="result-scorers">
          <span>${t('result.scorers')}</span>
          <b>${scorers.length ? esc(scorers.join(', ')) : '—'}</b>
        </div>
        ${redsRowHTML(reds)}
        ${injuriesRowHTML(m.lesionadosA)}
        ${subsRowHTML(m.sustitucionesA)}
      </div>
      ${lastTacticHTML(state)}
      ${pressArticleHTML(state)}`;
  }

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
      ${lastMatchHTML}
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
