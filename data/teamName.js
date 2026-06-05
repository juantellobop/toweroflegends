export const TEAM_NAME_MAX_LENGTH = 18;
export const TEAM_NAME_FALLBACK = 'Leyendas';

const LETTER_RE = /\p{L}/u;
const SPACE_RE = /\s/u;

function normalizeText(value) {
  return String(value ?? '').normalize('NFKC');
}

export function hasDisallowedTeamNameChars(value) {
  return Array.from(normalizeText(value)).some((char) => !LETTER_RE.test(char) && !SPACE_RE.test(char));
}

export function filterTeamNameInput(value, max = TEAM_NAME_MAX_LENGTH) {
  const out = [];
  let lastWasSpace = true;

  for (const char of Array.from(normalizeText(value))) {
    if (LETTER_RE.test(char)) {
      out.push(char);
      lastWasSpace = false;
    } else if (SPACE_RE.test(char) && !lastWasSpace) {
      out.push(' ');
      lastWasSpace = true;
    }

    if (out.length >= max) break;
  }

  return out.join('');
}

export function sanitizeTeamName(value, fallback = TEAM_NAME_FALLBACK, max = TEAM_NAME_MAX_LENGTH) {
  const clean = filterTeamNameInput(value, max).trim().replace(/\s+/g, ' ');
  return clean || fallback;
}

export function isBlankTeamName(value) {
  return filterTeamNameInput(value).trim().length === 0;
}
