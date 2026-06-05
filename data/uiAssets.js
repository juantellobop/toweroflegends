// Central manifest for original UI pixel assets.
// Keep paths relative to index.html so they work with the static server.

export const UI_ASSETS = {
  backgrounds: {
    // Fondos fotográficos (pixel-art) para las pantallas principales.
    title: 'assets/ui/background-3.jpg',       // pantalla de inicio
    pitch: 'assets/ui/background.jpg',         // armar equipo / sobres / scouting
    celebration: 'assets/ui/background-2.jpg', // resultado al ganar
  },
  // Sobres sellados (arte de cromos) para la pantalla de apertura.
  packs: {
    player: 'assets/ui/cromos-jugadores.png',
    item: 'assets/ui/cromos-items.png',
  },
  cards: {
    packBack: 'assets/ui/pixel/pack-back.svg',
    backPlayer: 'assets/ui/item-player.png', // dorso de carta de jugador
    backItem: 'assets/ui/item-back.png',     // dorso de carta de objeto
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
    cup: 'assets/ui/copa.png',     // copa (póster de victoria)
    tower: 'assets/ui/torre.png',  // torre (progreso / fin de run)
    win: 'assets/ui/copa.png',
    loss: 'assets/ui/pixel/result-loss.svg',
  },
};

export function uiAssetList() {
  return [
    UI_ASSETS.backgrounds.title,
    UI_ASSETS.backgrounds.pitch,
    UI_ASSETS.backgrounds.celebration,
    UI_ASSETS.packs.player,
    UI_ASSETS.packs.item,
    UI_ASSETS.cards.packBack,
    UI_ASSETS.cards.backPlayer,
    UI_ASSETS.cards.backItem,
    ...Object.values(UI_ASSETS.cards.frames),
    ...Object.values(UI_ASSETS.icons),
    ...Object.values(UI_ASSETS.results),
  ];
}
