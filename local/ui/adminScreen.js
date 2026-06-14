import { playerOVR } from '../../engine/ovr.js';
import {
  FIELD_STAT_KEYS, GK_STAT_KEYS, TACTICAL_TYPES,
  basePlayerById, getAdminPlayer, getAdminRoster,
  saveAdminPlayer, sanitizePlayerDraft,
} from '../data/adminPlayers.js';
import { playerInitials, portraitPathForPlayer } from '../../data/playerAssets.js';
import { adminAuthHeaders, clearAdminToken } from '../data/adminAuth.js';
import { playerCardHTML, POSITION_LABEL, RARITY_LABEL } from '../../ui/cards.js';
import { esc } from '../../ui/dom.js';
import { localizeEra, localizeNation, t } from '../../data/i18n.js';

const positionOptions = () => [
  ['GK', t('admin.positionOption.GK')],
  ['DEF', t('admin.positionOption.DEF')],
  ['MID', t('admin.positionOption.MID')],
  ['FWD', t('admin.positionOption.FWD')],
];

const rarityOptions = () => [
  ['common', RARITY_LABEL.common],
  ['rare', RARITY_LABEL.rare],
  ['epic', RARITY_LABEL.epic],
  ['legend', RARITY_LABEL.legend],
];

const tacticalOptions = () => [
  ['', t('admin.noType')],
  ...TACTICAL_TYPES.map((value) => [value, t(`admin.tactical.${value}`)]),
];

let selectedId = null;
let searchText = '';
let positionFilter = '';

function comparePlayersBestFirst(a, b) {
  const ovrDiff = playerOVR(b) - playerOVR(a);
  if (ovrDiff) return ovrDiff;
  return a.name.localeCompare(b.name, 'es');
}

function sortPlayersBestFirst(players) {
  return players.slice().sort(comparePlayersBestFirst);
}

function optionHTML(options, selected) {
  return options.map(([value, label]) =>
    `<option value="${esc(value)}" ${value === selected ? 'selected' : ''}>${esc(label)}</option>`
  ).join('');
}

function statInputs(player) {
  const isGK = player.position === 'GK';
  const keys = isGK ? GK_STAT_KEYS : FIELD_STAT_KEYS;
  const source = isGK ? player.gk : player.stats;
  return keys.map((key) => `
    <label class="admin-stat-field">
      <span>${esc(t(`admin.stat.${key}`))}</span>
      <input type="number" name="${esc(key)}" min="1" max="99" value="${source?.[key] ?? 50}" inputmode="numeric" />
    </label>
  `).join('');
}

function filteredPlayers(players) {
  const q = searchText.trim().toLowerCase();
  return players.filter((player) => {
    if (positionFilter && player.position !== positionFilter) return false;
    if (!q) return true;
    return `${player.name} ${player.nation} ${player.era} ${player.id}`.toLowerCase().includes(q);
  });
}

function playerRowHTML(player) {
  return `
    <button class="admin-player-row ${player.id === selectedId ? 'is-selected' : ''}" data-id="${esc(player.id)}" type="button">
      <span class="admin-player-face rarity-${esc(player.rarity)}" aria-hidden="true">
        <img src="${esc(portraitPathForPlayer(player))}" alt="" loading="lazy" decoding="async" data-hide-on-error="true" />
        <span>${esc(playerInitials(player.name))}</span>
      </span>
      <span class="admin-player-main">
        <b>${esc(player.name)}</b>
        <small>${esc(POSITION_LABEL[player.position])} · ${esc(localizeNation(player.nation))} · ${esc(localizeEra(player.era))}</small>
      </span>
      <span class="admin-player-side">
        <b>${playerOVR(player)}</b>
      </span>
    </button>`;
}

function editorHTML(player) {
  const previewPlayer = sanitizePlayerDraft(player, basePlayerById(player.id));
  return `
    <div class="admin-editor-head">
      <div>
        <span class="admin-kicker">${t('admin.selected')}</span>
        <h2>${esc(player.name)}</h2>
        <p>${esc(player.id)}</p>
      </div>
      <div class="admin-card-preview">
        ${playerCardHTML(previewPlayer)}
      </div>
    </div>

    <form id="adminPlayerForm" class="admin-player-form">
      <div class="admin-form-grid">
        <label>${t('admin.name')}
          <input type="text" name="name" maxlength="72" value="${esc(player.name)}" />
        </label>
        <label>${t('admin.nation')}
          <input type="text" name="nation" maxlength="48" value="${esc(player.nation)}" />
        </label>
        <label>${t('admin.era')}
          <input type="text" name="era" maxlength="24" value="${esc(player.era)}" />
        </label>
        <label>${t('admin.position')}
          <select name="position">${optionHTML(positionOptions(), player.position)}</select>
        </label>
        <label>${t('admin.rarity')}
          <select name="rarity">${optionHTML(rarityOptions(), player.rarity)}</select>
        </label>
        <div class="admin-ovr-display">
          <span>${t('admin.ovr')}</span>
          <b>${playerOVR(previewPlayer)}</b>
        </div>
        <label>${t('admin.trait')}
          <input type="text" name="trait" maxlength="48" value="${esc(player.trait || '')}" placeholder="${t('admin.noTrait')}" />
        </label>
        <label>${t('admin.tacticalType')}
          <select name="tacticalType">${optionHTML(tacticalOptions(), player.tacticalType || '')}</select>
        </label>
      </div>

      <div class="admin-stat-grid">
        ${statInputs(player)}
      </div>

      <div class="admin-form-actions">
        <button class="primary" id="adminSaveStats" type="submit">${t('admin.saveStats')}</button>
      </div>
    </form>

    <section class="admin-portrait-tool" aria-label="${t('admin.portraitAria')}">
      <div class="admin-tool-head">
        <div>
          <span class="admin-kicker">${t('admin.portrait')}</span>
          <h3>${t('admin.toolEffect')}</h3>
        </div>
        <span class="admin-portrait-state">${t('admin.replaceImage')}</span>
      </div>

      <div class="admin-portrait-grid">
        <label class="portrait-drop" id="adminPortraitDrop">
          <input id="adminPortraitInput" type="file" accept="image/*" />
          <span>${t('admin.pickImage')}</span>
          <small>${t('admin.imageHint')}</small>
          <img id="adminOriginalPreview" alt="" hidden />
        </label>
        <div class="portrait-result">
          <span class="portrait-result-label">${t('admin.converted')}</span>
          <div class="portrait-result-frame">
            <img id="adminConvertedPreview" src="${esc(portraitPathForPlayer(player))}" alt="" />
          </div>
        </div>
      </div>

      <div class="admin-portrait-actions">
        <button class="primary" id="adminSavePortrait" type="button" disabled>${t('admin.savePortrait')}</button>
        <span id="adminPortraitStatus" role="status"></span>
      </div>
    </section>`;
}

export function renderAdmin(root, handlers = {}) {
  selectedId ||= sortPlayersBestFirst(getAdminRoster())[0]?.id || null;
  root.innerHTML = `
    <section class="screen admin-screen pixel-screen">
      <header class="nav-large admin-nav">
        <button id="adminBack" class="ghost" type="button">${t('admin.back')}</button>
        <div>
          <span class="level-badge">${t('admin.badge')}</span>
          <h1 class="large-title">${t('admin.title')}</h1>
        </div>
        <button id="adminLogout" class="ghost" type="button">${t('admin.logout')}</button>
      </header>

      <div class="admin-layout">
        <aside class="admin-list-panel arcade-panel">
          <div class="admin-list-tools">
            <label>${t('admin.search')}
              <input id="adminSearch" type="search" placeholder="${t('admin.searchPlaceholder')}" value="${esc(searchText)}" />
            </label>
            <label>${t('admin.position')}
              <select id="adminPositionFilter">
                <option value="">${t('admin.all')}</option>
                ${optionHTML(positionOptions(), positionFilter)}
              </select>
            </label>
          </div>
          <p class="admin-count" id="adminCount"></p>
          <div class="admin-player-list" id="adminPlayerList"></div>
        </aside>

        <main class="admin-editor-panel arcade-panel" id="adminEditor"></main>
      </div>
    </section>`;

  const list = root.querySelector('#adminPlayerList');
  const count = root.querySelector('#adminCount');
  const editor = root.querySelector('#adminEditor');
  const search = root.querySelector('#adminSearch');
  const position = root.querySelector('#adminPositionFilter');

  function renderList() {
    const players = getAdminRoster();
    const visible = sortPlayersBestFirst(filteredPlayers(players));
    if (!visible.some((player) => player.id === selectedId)) selectedId = visible[0]?.id || players[0]?.id || null;
    list.innerHTML = visible.map((player) => playerRowHTML(player)).join('');
    count.textContent = t('admin.count', { visible: visible.length, total: players.length });
  }

  function renderEditor(draft = null) {
    const base = selectedId ? basePlayerById(selectedId) : null;
    const player = draft && base ? sanitizePlayerDraft(draft, base) : getAdminPlayer(selectedId);
    if (!player) {
      editor.innerHTML = `<p class="empty-note">${t('admin.noPlayers')}</p>`;
      return;
    }
    selectedId = player.id;
    editor.innerHTML = editorHTML(player);
    wireEditor(player);
  }

  function refresh(draft = null) {
    renderList();
    renderEditor(draft);
  }

  root.querySelector('#adminBack').addEventListener('click', () => handlers.onBack?.());
  root.querySelector('#adminLogout').addEventListener('click', () => handlers.onLogout?.());
  search.addEventListener('input', () => {
    searchText = search.value;
    refresh();
  });
  position.addEventListener('change', () => {
    positionFilter = position.value;
    refresh();
  });
  list.addEventListener('click', (event) => {
    const row = event.target.closest('.admin-player-row');
    if (!row) return;
    selectedId = row.dataset.id;
    refresh();
  });

  function readDraft(player) {
    const form = editor.querySelector('#adminPlayerForm');
    const data = new FormData(form);
    const positionValue = String(data.get('position') || player.position);
    const isGK = positionValue === 'GK';
    const hasFieldInputs = FIELD_STAT_KEYS.every((key) => form.elements[key]);
    const hasGkInputs = GK_STAT_KEYS.every((key) => form.elements[key]);
    const stats = !isGK && hasFieldInputs ? Object.fromEntries(FIELD_STAT_KEYS.map((key) => [key, data.get(key)])) : null;
    const gk = isGK && hasGkInputs ? Object.fromEntries(GK_STAT_KEYS.map((key) => [key, data.get(key)])) : null;
    return {
      id: player.id,
      name: data.get('name'),
      nation: data.get('nation'),
      era: data.get('era'),
      position: positionValue,
      rarity: data.get('rarity'),
      trait: data.get('trait'),
      tacticalType: data.get('tacticalType'),
      stats,
      gk,
      portraitDataUrl: player.portraitDataUrl || null,
    };
  }

  function wireEditor(player) {
    const form = editor.querySelector('#adminPlayerForm');
    let convertedPortrait = null;

    form.elements.position.addEventListener('change', () => {
      const draft = readDraft(player);
      draft.position = form.elements.position.value;
      renderEditor(draft);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const button = editor.querySelector('#adminSaveStats');
      if (button) button.disabled = true;
      try {
        const saved = await saveAdminPlayer(readDraft(player));
        selectedId = saved.id;
        refresh();
      } catch (error) {
        window.alert(error.message);
      } finally {
        if (button?.isConnected) button.disabled = false;
      }
    });

    const input = editor.querySelector('#adminPortraitInput');
    const drop = editor.querySelector('#adminPortraitDrop');
    const original = editor.querySelector('#adminOriginalPreview');
    const converted = editor.querySelector('#adminConvertedPreview');
    const savePortrait = editor.querySelector('#adminSavePortrait');
    const status = editor.querySelector('#adminPortraitStatus');

    const setStatus = (message) => { status.textContent = message; };

    async function processFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        setStatus(t('admin.invalidImage'));
        return;
      }
      setStatus(t('admin.converting'));
      savePortrait.disabled = true;
      try {
        const originalDataUrl = await readFileAsDataUrl(file);
        original.src = originalDataUrl;
        original.hidden = false;
        convertedPortrait = await convertPortrait(originalDataUrl, player);
        converted.src = convertedPortrait;
        savePortrait.disabled = false;
        setStatus(t('admin.convertedReady'));
      } catch (error) {
        convertedPortrait = null;
        setStatus(t('admin.convertError', { message: error.message }));
      }
    }

    input.addEventListener('change', () => processFile(input.files?.[0]));
    drop.addEventListener('dragover', (event) => {
      event.preventDefault();
      drop.classList.add('is-dragging');
    });
    drop.addEventListener('dragleave', () => drop.classList.remove('is-dragging'));
    drop.addEventListener('drop', (event) => {
      event.preventDefault();
      drop.classList.remove('is-dragging');
      processFile(event.dataTransfer?.files?.[0]);
    });

    savePortrait.addEventListener('click', async () => {
      if (!convertedPortrait) return;
      const draft = readDraft(player);
      draft.portraitDataUrl = convertedPortrait;
      savePortrait.disabled = true;
      setStatus(t('admin.savingImage'));
      try {
        const saved = await saveAdminPlayer(draft);
        selectedId = saved.id;
        refresh();
      } catch (error) {
        setStatus(error.message);
        if (savePortrait.isConnected) savePortrait.disabled = false;
      }
    });
  }

  refresh();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', () => reject(new Error(t('admin.readFailed'))));
    reader.readAsDataURL(file);
  });
}

async function convertPortrait(dataUrl, player) {
  const response = await fetch('/api/admin/portrait', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...adminAuthHeaders() },
    body: JSON.stringify({
      imageDataUrl: dataUrl,
      playerId: player.id,
      playerName: player.name,
    }),
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }
  if (response.status === 401) {
    clearAdminToken();
    throw new Error(t('admin.expired'));
  }
  if (!response.ok) {
    throw new Error(payload?.error || t('admin.startServer'));
  }
  if (!payload?.portraitDataUrl?.startsWith('data:image/png')) {
    throw new Error(t('admin.invalidPortrait'));
  }
  return payload.portraitDataUrl;
}
