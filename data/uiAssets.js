// Central manifest for original UI pixel assets.
// Keep paths relative to index.html so they work with the static server.

export const UI_ASSETS = {
  backgrounds: {
    // Fondos fotográficos (pixel-art) para las pantallas principales.
    title: 'assets/ui/background-3.jpg',       // pantalla de inicio
    pitch: 'assets/ui/background.jpg',         // armar equipo / sobres / scouting
    celebration: 'assets/ui/background-2.jpg', // resultado al ganar
    managerPack: 'assets/ui/background-4.jpg', // apertura del sobre de DT
  },
  // Sobres sellados (arte de cromos) para la pantalla de apertura.
  packs: {
    player: 'assets/ui/cromos-jugadores.png',
    item: 'assets/ui/cromos-items.png',
    manager: 'assets/ui/cromos-managers.png',
  },
  cards: {
    packBack: 'assets/ui/pixel/pack-back.svg',
    backPlayer: 'assets/ui/item-player.jpg', // dorso de carta de jugador
    backItem: 'assets/ui/item-back.jpg',     // dorso de carta de objeto (y de DT)
    frames: {
      common: 'assets/ui/pixel/card-frame-common.svg',
      rare: 'assets/ui/pixel/card-frame-rare.svg',
      epic: 'assets/ui/pixel/card-frame-epic.svg',
      legend: 'assets/ui/pixel/card-frame-legend.svg',
    },
  },
  icons: {
    attack: 'assets/ui/pixel/stat-attack.svg',
    midfield: 'assets/ui/pixel/stat-midfield.svg',
    defense: 'assets/ui/pixel/stat-defense.svg',
    gk: 'assets/ui/pixel/stat-gk.svg',
  },
  results: {
    cup: 'assets/ui/copa.jpg',     // copa (póster de victoria)
    tower: 'assets/ui/torre.jpg',  // torre (progreso / fin de run)
    win: 'assets/ui/copa.jpg',
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

export function preloadUiAssets(ImageCtor = globalThis.Image) {
  return preloadImages(uiAssetList(), {
    ImageCtor,
    priority: (src) => (src === UI_ASSETS.backgrounds.title ? 'high' : 'low'),
  });
}
