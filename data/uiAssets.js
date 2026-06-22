// Central manifest for original UI pixel assets.
// Keep paths relative to index.html so they work with the static server.

export const UI_ASSETS = {
  backgrounds: {
    // Fondos fotográficos (pixel-art) para las pantallas principales. WebP-only
    // (target Safari 16.2+): convertidos con tools/convert_to_webp.mjs.
    title: 'assets/ui/background-3.webp',       // pantalla de inicio
    pitch: 'assets/ui/background.webp',         // armar equipo / sobres / scouting
    celebration: 'assets/ui/background-2.webp', // resultado al ganar
    managerPack: 'assets/ui/background-4.webp', // apertura del sobre de DT
  },
  // Sobres sellados (arte de cromos) para la pantalla de apertura.
  packs: {
    player: 'assets/ui/cromos-jugadores.webp',
    item: 'assets/ui/cromos-items.webp',
    manager: 'assets/ui/cromos-managers.webp',
  },
  cards: {
    packBack: 'assets/ui/pixel/pack-back.svg',
    backPlayer: 'assets/ui/item-player.webp', // dorso de carta de jugador
    backItem: 'assets/ui/item-back.webp',     // dorso de carta de objeto (y de DT)
    frames: {
      common: 'assets/ui/pixel/card-frame-common.svg',
      rare: 'assets/ui/pixel/card-frame-rare.svg',
      epic: 'assets/ui/pixel/card-frame-epic.svg',
      legend: 'assets/ui/pixel/card-frame-legend.svg',
    },
    // Fondos a sangre de la carta "escaparate" (sobres + modal de info), por
    // tipo y rareza. Jugador y DT comparten el fondo player-dt; el objeto usa
    // el suyo. Nombres de archivo en castellano (comun/rara/epica/leyenda).
    bg: {
      playerCommon: 'assets/ui/cards/card-comun-player-dt.webp',
      playerRare: 'assets/ui/cards/card-rara-player-dt.webp',
      playerEpic: 'assets/ui/cards/card-epica-player-dt.webp',
      playerLegend: 'assets/ui/cards/card-leyenda-player-dt.webp',
      // Rarezas especiales (item "Representante corrupto" y su recompensa Shiny).
      playerCorrupto: 'assets/ui/cards/card-corrupto-player.webp',
      playerShiny: 'assets/ui/cards/card-shiny-player.webp',
      itemCommon: 'assets/ui/cards/card-comun-item.webp',
      itemRare: 'assets/ui/cards/card-rara-item.webp',
      itemEpic: 'assets/ui/cards/card-epica-item.webp',
      itemLegend: 'assets/ui/cards/card-leyenda-item.webp',
    },
  },
  icons: {
    attack: 'assets/ui/pixel/stat-attack.svg',
    midfield: 'assets/ui/pixel/stat-midfield.svg',
    defense: 'assets/ui/pixel/stat-defense.svg',
    gk: 'assets/ui/pixel/stat-gk.svg',
  },
  results: {
    cup: 'assets/ui/copa.webp',     // copa (póster de victoria)
    tower: 'assets/ui/torre.webp',  // torre (progreso / fin de run)
    win: 'assets/ui/copa.webp',
    winBadge: 'assets/ui/pixel/result-win.svg',
    loss: 'assets/ui/pixel/result-loss.svg',
  },
};

function collectAssetPaths(value, output) {
  if (typeof value === 'string') {
    if (/\.(?:ico|jpe?g|png|svg|webp)(?:\?|$)/i.test(value)) output.push(value);
    return;
  }
  if (!value || typeof value !== 'object') return;
  Object.values(value).forEach((entry) => collectAssetPaths(entry, output));
}

// Grupos de precarga por escena. Antes se bajaban los ~9 MB de assets/ui al
// arrancar (preloadUiAssets aplanaba TODO); ahora cada grupo se calienta cuando
// se entra en su pantalla. La unión de los grupos cubre todo UI_ASSETS, así que
// uiAssetList() (suma total, para el test de cobertura) no cambia.
const ASSET_GROUPS = {
  core: [UI_ASSETS.backgrounds.title],                 // pantalla de inicio
  build: [UI_ASSETS.backgrounds.pitch],                // build / scouting / sobres
  managerPack: [UI_ASSETS.backgrounds.managerPack],    // background-4 (0.7 MB)
  packs: [UI_ASSETS.packs, UI_ASSETS.cards, UI_ASSETS.icons], // cromos + cartas
  result: [UI_ASSETS.backgrounds.celebration, UI_ASSETS.results],
};

export function uiAssetGroup(name) {
  const paths = [];
  collectAssetPaths(ASSET_GROUPS[name], paths);
  return [...new Set(paths)];
}

export function uiAssetList() {
  const paths = [];
  collectAssetPaths(UI_ASSETS, paths);
  return [...new Set(paths)];
}

// Inicia la descarga de una lista de imágenes en segundo plano (van a la caché
// HTTP del navegador). Devuelve los objetos Image para conservar sus referencias
// y que el navegador no aborte las descargas en curso.
export function preloadImages(srcs, { priority = 'low', ImageCtor = globalThis.Image } = {}) {
  if (typeof ImageCtor !== 'function' || !srcs) return [];
  const seen = new Set();
  const images = [];
  for (const src of srcs) {
    if (!src || seen.has(src)) continue;
    seen.add(src);
    const image = new ImageCtor();
    image.decoding = 'async';
    image.fetchPriority = typeof priority === 'function' ? priority(src) : priority;
    image.src = src;
    images.push(image);
  }
  return images;
}

// Precarga del grupo de una escena (bajo demanda). Devuelve los Image creados
// para conservar sus referencias. Idempotencia/deduplicación las gestiona quien
// llama (main.js warmUiGroup) o la propia caché HTTP del navegador.
export function preloadUiGroup(name, { ImageCtor = globalThis.Image, priority = 'low' } = {}) {
  return preloadImages(uiAssetGroup(name), { ImageCtor, priority });
}

// Al arrancar solo se calienta lo de la pantalla de inicio (background del
// título, prioridad alta). El resto de assets/ui se difiere a su escena.
export function preloadUiAssets(ImageCtor = globalThis.Image) {
  return preloadImages(uiAssetGroup('core'), { ImageCtor, priority: 'high' });
}
