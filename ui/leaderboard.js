import { flagSrcForNation } from '../data/flags.js';
import { sanitizeTeamName } from '../data/teamName.js';
import { t } from '../data/i18n.js';

export const LEADERBOARD_LIMIT = 20;

const API_URL = '/api/ranking';
const STATIC_URL = '/data/ranking.json';

function esc(s) {
  return String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function normalizeEntry(entry) {
  const floor = Math.max(0, Math.floor(Number(entry?.floor) || 0));
  const teamName = sanitizeTeamName(entry?.teamName);
  const nation = String(entry?.nation || '').trim().slice(0, 48);
  const id = String(entry?.id || `${teamName}-${nation}-${floor}`);
  const createdAt = Number.isFinite(Date.parse(entry?.createdAt)) ? new Date(entry.createdAt).toISOString() : '';
  return { id, teamName, nation, floor, createdAt };
}

function normalizePayload(payload) {
  const rawEntries = Array.isArray(payload) ? payload : payload?.entries;
  const timestamp = (entry) => Date.parse(entry.createdAt) || 0;
  const entries = Array.isArray(rawEntries)
    ? rawEntries.map(normalizeEntry)
      .sort((a, b) => b.floor - a.floor || timestamp(a) - timestamp(b))
      .slice(0, LEADERBOARD_LIMIT)
    : [];
  return {
    entries,
    entryId: payload?.entryId || null,
    rank: Number.isInteger(payload?.rank) ? payload.rank : null,
    limit: Number(payload?.limit) || LEADERBOARD_LIMIT,
  };
}

function absoluteUrl(path) {
  if (typeof window !== 'undefined' && window.location?.href) {
    return new URL(path, window.location.href).href;
  }
  return path;
}

async function requestJson(path, options = {}) {
  const fetcher = typeof window !== 'undefined' && typeof window.fetch === 'function'
    ? window.fetch.bind(window)
    : typeof fetch === 'function'
      ? fetch
      : null;
  if (!fetcher) return null;

  try {
    const response = await fetcher(absoluteUrl(path), {
      ...options,
      headers: {
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    });
    if (!response.ok) return null;
    return response.json();
  } catch (_) {
    return null;
  }
}

export async function fetchLeaderboard() {
  const apiPayload = await requestJson(API_URL);
  if (apiPayload) return normalizePayload(apiPayload);

  const staticPayload = await requestJson(STATIC_URL);
  return normalizePayload(staticPayload || { entries: [] });
}

export async function submitLeaderboardEntry(entry) {
  const payload = await requestJson(API_URL, {
    method: 'POST',
    body: JSON.stringify({
      teamName: entry.teamName,
      nation: entry.nation,
      floor: entry.floor,
    }),
  });
  if (payload) return normalizePayload(payload);

  const fallback = await fetchLeaderboard();
  return { ...fallback, entryId: null, rank: null, readOnly: true };
}

export function renderLeaderboard(entries, options = {}) {
  const limit = options.limit || LEADERBOARD_LIMIT;
  const currentId = options.currentId || null;
  const rows = entries.slice(0, limit).map((entry, index) => {
    const nation = entry.nation || entry.teamName;
    return `
      <li class="leaderboard-row${entry.id === currentId ? ' is-current' : ''}">
        <span class="leaderboard-rank">#${index + 1}</span>
        <span class="leaderboard-team">
          <img class="leaderboard-flag" src="${esc(flagSrcForNation(nation))}" alt="" loading="lazy" decoding="async" />
          <b>${esc(entry.teamName)}</b>
        </span>
        <span class="leaderboard-floor">${t('leaderboard.floor', { floor: entry.floor })}</span>
      </li>`;
  }).join('');

  let note = '';
  if (options.loading) note = `<p class="leaderboard-note">${t('leaderboard.updating')}</p>`;
  else if (options.readOnly) note = `<p class="leaderboard-note">${t('leaderboard.readOnly')}</p>`;
  else if (options.rank) note = `<p class="leaderboard-note">${t('leaderboard.rank', { rank: options.rank })}</p>`;
  else if (options.submitted) note = `<p class="leaderboard-note">${t('leaderboard.notTop')}</p>`;

  return `
    <section class="leaderboard-panel arcade-panel${options.compact ? ' compact' : ''}">
      <div class="leaderboard-head">
        <span>${t('leaderboard.title')}</span>
        <b>${t('leaderboard.top')}</b>
      </div>
      ${note}
      ${rows
        ? `<ol class="leaderboard-list">${rows}</ol>`
        : `<p class="leaderboard-empty">${options.loading ? t('generic.loading') : t('leaderboard.empty')}</p>`}
    </section>`;
}
