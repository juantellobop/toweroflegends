// Banderas reales de países (imágenes descargadas en assets/flags) con caída
// a una bandera SVG estilizada cuando no hay imagen para esa nación. Se
// renderizan siempre con <img> y con estética retro (image-rendering pixelado
// en CSS), así que conviven con el resto del pixel-art del juego.

const CACHE = new Map();

function keyFor(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .toLowerCase()
    .trim();
}

// Slug para nombre de archivo: clave normalizada con guiones (p. ej.
// "Países Bajos" → "paises-bajos").
function slugFor(name) {
  return keyFor(name).replace(/\s+/g, '-');
}

const FLAG_DIR = 'assets/flags';
const FLAG_FILE_ALIAS = {
  'river-plate': 'riverplate.png',
  'san-lorenzo': 'sanlorenzo.png',
  // Alemania Occidental es la misma selección que Alemania: misma bandera.
  'alemania-occidental': 'alemania.png',
};

// Naciones/equipos con imagen real descargada. La mayoría son PNG (flagcdn);
// las históricas sin código ISO son SVG reales (Wikimedia Commons).
const FLAG_PNG = new Set([
  'riverplate', 'boca', 'independiente', 'racing', 'sanlorenzo', 'velez',
  'huracan', 'estudiantes', 'gimnasia', 'central', 'newells', 'lanus',
  'real-madrid', 'barcelona', 'valencia', 'euskadi', 'celta',
  'andalucia', 'asturias', 'aragon', 'betis', 'real-sociedad',
  'alemania', 'argentina', 'brasil', 'bulgaria', 'belgica',
  'camerun', 'checoslovaquia', 'colombia', 'corea-del-sur', 'costa-rica', 'croacia',
  'dinamarca', 'espana', 'estados-unidos', 'francia', 'ghana', 'inglaterra', 'irlanda',
  'italia', 'liberia', 'marruecos', 'mexico', 'paraguay', 'paises-bajos', 'portugal',
  'rumania', 'rusia', 'senegal', 'suecia', 'turquia', 'ucrania', 'uruguay',
]);
const FLAG_SVG_FILE = { urss: 'urss.svg', yugoslavia: 'yugoslavia.svg' };

function flagFileFor(name) {
  const slug = slugFor(name);
  if (FLAG_FILE_ALIAS[slug]) return `${FLAG_DIR}/${FLAG_FILE_ALIAS[slug]}`;
  if (FLAG_SVG_FILE[slug]) return `${FLAG_DIR}/${FLAG_SVG_FILE[slug]}`;
  if (FLAG_PNG.has(slug)) return `${FLAG_DIR}/${slug}.png`;
  return null;
}

// Nombres de nación disponibles para el selector de bandera del menú.
export const FLAG_NATIONS = [
  'River Plate', 'Boca', 'Independiente', 'Racing', 'San Lorenzo', 'Vélez',
  'Huracán', 'Estudiantes', 'Gimnasia', 'Central', "Newell's", 'Lanús',
  'Real Madrid', 'Barcelona', 'Valencia', 'Euskadi', 'Celta',
  'Andalucía', 'Asturias', 'Aragón', 'Betis', 'Real Sociedad',
  'Argentina', 'Brasil', 'España', 'Uruguay', 'Colombia', 'México', 'Paraguay', 'Costa Rica',
  'Estados Unidos', 'Italia', 'Francia', 'Alemania', 'Inglaterra',
  'Países Bajos', 'Portugal', 'Bélgica', 'Croacia', 'Dinamarca', 'Suecia', 'Irlanda',
  'Rusia', 'Ucrania', 'Rumanía', 'Bulgaria', 'Turquía', 'Corea del Sur', 'Marruecos',
  'Senegal', 'Camerún', 'Ghana', 'Liberia', 'URSS', 'Yugoslavia', 'Checoslovaquia',
];

// Color de acento del equipo según su bandera (confeti, realces). Oro por defecto.
const NATION_ACCENT = {
  'river-plate': '#e21d2f', boca: '#f4c400', independiente: '#c8102e', racing: '#67b7dc',
  'san-lorenzo': '#d71920', velez: '#005eb8', huracan: '#d71920', estudiantes: '#ed1c24',
  gimnasia: '#173a7a', central: '#f6c500', newells: '#d71920', lanus: '#6f1731',
  'real-madrid': '#febe10', barcelona: '#a50044', valencia: '#f18e00',
  euskadi: '#009b48', celta: '#8ac3ee', 'real-sociedad': '#0067b1',
  andalucia: '#007a3d', asturias: '#0066b3', aragon: '#d50032', betis: '#00954c',
  argentina: '#75aadb', brasil: '#ffdf00', uruguay: '#6cace4', colombia: '#fcd116',
  mexico: '#006847', paraguay: '#d52b1e', 'costa-rica': '#002b7f', 'estados-unidos': '#3c3b6e',
  espana: '#f1bf00', italia: '#009246', francia: '#1d3e8a', alemania: '#ffce00',
  inglaterra: '#ce1124', 'paises-bajos': '#ae1c28', portugal: '#da291c', belgica: '#fdda24',
  croacia: '#d71920', dinamarca: '#c60c30', suecia: '#fecc00', irlanda: '#169b62',
  rusia: '#0039a6', ucrania: '#ffd700', rumania: '#fcd116', bulgaria: '#00966e',
  turquia: '#e30a17', 'corea-del-sur': '#cd2e3a', marruecos: '#c1272d', senegal: '#00853f',
  camerun: '#007a5e', ghana: '#fcd116', liberia: '#bf0a30', urss: '#cc0000',
  yugoslavia: '#d22630', checoslovaquia: '#11457e', 'alemania-occidental': '#ffce00',
};

export function flagAccentForNation(name) {
  return NATION_ACCENT[slugFor(name)] || '#d4af37';
}

function enc(svg) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function svg(body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 24" shape-rendering="crispEdges">${body}</svg>`;
}

function xmlEsc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&apos;',
  }[char]));
}

function safeColor(value, fallback) {
  const color = String(value || '').trim();
  return /^#[0-9a-f]{3,8}$/i.test(color) ? color : fallback;
}

function h(colors) {
  const step = 24 / colors.length;
  return svg(colors.map((c, i) => `<rect x="0" y="${i * step}" width="36" height="${step}" fill="${c}"/>`).join(''));
}

function v(colors) {
  const step = 36 / colors.length;
  return svg(colors.map((c, i) => `<rect x="${i * step}" y="0" width="${step}" height="24" fill="${c}"/>`).join(''));
}

function cross(bg, main, secondary = main) {
  return svg(`
    <rect width="36" height="24" fill="${bg}"/>
    <rect x="0" y="9" width="36" height="6" fill="${main}"/>
    <rect x="15" y="0" width="6" height="24" fill="${secondary}"/>
  `);
}

function star(cx, cy, color = '#ffd42a') {
  return `<path d="M${cx} ${cy - 5}l1.4 3h3.4l-2.7 2 1 3.2-3.1-1.9-3.1 1.9 1-3.2-2.7-2h3.4z" fill="${color}"/>`;
}

function fallback(name, colors = []) {
  const a = safeColor(colors[0], '#123ad1');
  const b = safeColor(colors[1], '#ffd42a');
  const c = safeColor(colors[2], '#25e6ff');
  const label = xmlEsc(String(name || '?').slice(0, 2).toUpperCase());
  return svg(`
    <rect width="36" height="24" fill="${a}"/>
    <rect x="0" y="14" width="36" height="10" fill="${b}"/>
    <rect x="3" y="3" width="30" height="18" fill="none" stroke="${c}" stroke-width="2"/>
    <text x="18" y="16" text-anchor="middle" font-family="monospace" font-size="8" font-weight="900" fill="#fff">${label}</text>
  `);
}

const FLAGS = {
  'alemania': () => h(['#111111', '#dd0000', '#ffce00']),
  'alemania occidental': () => h(['#111111', '#dd0000', '#ffce00']),
  'argentina': () => svg('<rect width="36" height="8" fill="#75aadb"/><rect y="8" width="36" height="8" fill="#fff"/><rect y="16" width="36" height="8" fill="#75aadb"/><rect x="16" y="10" width="4" height="4" fill="#ffd42a"/>'),
  'belgica': () => v(['#111111', '#fdda24', '#ef3340']),
  'brasil': () => svg('<rect width="36" height="24" fill="#009b3a"/><path d="M18 3l15 9-15 9-15-9z" fill="#ffdf00"/><circle cx="18" cy="12" r="5" fill="#002776"/>'),
  'bulgaria': () => h(['#ffffff', '#00966e', '#d62612']),
  'camerun': () => v(['#007a5e', '#ce1126', '#fcd116']) .replace('</svg>', `${star(18, 12)}</svg>`),
  'checoslovaquia': () => svg('<rect width="36" height="12" fill="#fff"/><rect y="12" width="36" height="12" fill="#d7141a"/><path d="M0 0l18 12-18 12z" fill="#11457e"/>'),
  'colombia': () => h(['#fcd116', '#003893', '#ce1126']),
  'corea del sur': () => svg('<rect width="36" height="24" fill="#fff"/><path d="M18 6a6 6 0 0 1 0 12a3 3 0 0 1 0-6a3 3 0 0 0 0-6z" fill="#cd2e3a"/><path d="M18 6a3 3 0 0 0 0 6a3 3 0 0 1 0 6a6 6 0 0 1 0-12z" fill="#0047a0"/><rect x="5" y="4" width="7" height="2" fill="#111"/><rect x="24" y="18" width="7" height="2" fill="#111"/>'),
  'costa rica': () => h(['#002b7f', '#fff', '#ce1126', '#ce1126', '#fff', '#002b7f']),
  'croacia': () => svg('<rect width="36" height="8" fill="#d71920"/><rect y="8" width="36" height="8" fill="#fff"/><rect y="16" width="36" height="8" fill="#171796"/><rect x="14" y="7" width="4" height="4" fill="#d71920"/><rect x="18" y="7" width="4" height="4" fill="#fff"/><rect x="14" y="11" width="4" height="4" fill="#fff"/><rect x="18" y="11" width="4" height="4" fill="#d71920"/>'),
  'dinamarca': () => cross('#c60c30', '#ffffff'),
  'espana': () => h(['#aa151b', '#f1bf00', '#f1bf00', '#aa151b']),
  'estados unidos': () => svg('<rect width="36" height="24" fill="#fff"/><rect y="0" width="36" height="3" fill="#b22234"/><rect y="6" width="36" height="3" fill="#b22234"/><rect y="12" width="36" height="3" fill="#b22234"/><rect y="18" width="36" height="3" fill="#b22234"/><rect width="16" height="12" fill="#3c3b6e"/><rect x="3" y="3" width="2" height="2" fill="#fff"/><rect x="8" y="3" width="2" height="2" fill="#fff"/><rect x="3" y="8" width="2" height="2" fill="#fff"/><rect x="8" y="8" width="2" height="2" fill="#fff"/>'),
  'francia': () => v(['#1d3e8a', '#fff', '#e31b23']),
  'ghana': () => h(['#ce1126', '#fcd116', '#006b3f']).replace('</svg>', `${star(18, 12, '#111')}</svg>`),
  'inglaterra': () => cross('#ffffff', '#ce1124'),
  'irlanda': () => v(['#169b62', '#fff', '#ff883e']),
  'italia': () => v(['#009246', '#fff', '#ce2b37']),
  'liberia': () => svg('<rect width="36" height="24" fill="#fff"/><rect y="0" width="36" height="3" fill="#bf0a30"/><rect y="6" width="36" height="3" fill="#bf0a30"/><rect y="12" width="36" height="3" fill="#bf0a30"/><rect y="18" width="36" height="3" fill="#bf0a30"/><rect width="13" height="12" fill="#002868"/><rect x="5" y="4" width="3" height="3" fill="#fff"/>'),
  'marruecos': () => svg(`<rect width="36" height="24" fill="#c1272d"/>${star(18, 12, '#006233')}`),
  'mexico': () => v(['#006847', '#fff', '#ce1126']).replace('</svg>', '<rect x="16" y="10" width="4" height="4" fill="#8a5a2b"/></svg>'),
  'paises bajos': () => h(['#ae1c28', '#fff', '#21468b']),
  'paraguay': () => h(['#d52b1e', '#fff', '#0038a8']),
  'portugal': () => svg('<rect width="14" height="24" fill="#046a38"/><rect x="14" width="22" height="24" fill="#da291c"/><rect x="12" y="9" width="6" height="6" fill="#ffd42a"/>'),
  'rumania': () => v(['#002b7f', '#fcd116', '#ce1126']),
  'rusia': () => h(['#fff', '#0039a6', '#d52b1e']),
  'senegal': () => v(['#00853f', '#fdef42', '#e31b23']).replace('</svg>', `${star(18, 12, '#00853f')}</svg>`),
  'suecia': () => cross('#006aa7', '#fecc00'),
  'turquia': () => svg('<rect width="36" height="24" fill="#e30a17"/><circle cx="15" cy="12" r="6" fill="#fff"/><circle cx="17" cy="12" r="5" fill="#e30a17"/><rect x="23" y="10" width="4" height="4" fill="#fff"/>'),
  'ucrania': () => h(['#0057b7', '#ffd700']),
  'urss': () => svg(`<rect width="36" height="24" fill="#cc0000"/>${star(8, 7, '#ffd42a')}`),
  'uruguay': () => svg('<rect width="36" height="24" fill="#fff"/><rect y="4" width="36" height="3" fill="#6cace4"/><rect y="10" width="36" height="3" fill="#6cace4"/><rect y="16" width="36" height="3" fill="#6cace4"/><rect width="12" height="12" fill="#fff"/><circle cx="6" cy="6" r="3" fill="#ffd42a"/>'),
  'yugoslavia': () => h(['#003da5', '#fff', '#d22630']).replace('</svg>', `${star(18, 12, '#ffd42a')}</svg>`),
  'leyendas': () => fallback('Leyendas', ['#071459', '#ffd42a', '#25e6ff']),
};

export function flagSrcForNation(name, colors = []) {
  const key = keyFor(name);
  const cacheKey = `${key}:${colors.join(',')}`;
  if (CACHE.has(cacheKey)) return CACHE.get(cacheKey);
  // Preferimos la imagen real descargada; si la nación no tiene archivo,
  // caemos a la bandera SVG estilizada (o al marcador genérico).
  const file = flagFileFor(name);
  const src = file || enc((FLAGS[key] || (() => fallback(name, colors)))());
  CACHE.set(cacheKey, src);
  return src;
}
