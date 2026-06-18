// Torre de Leyendas — "Volver a jugar": elegir un jugador de la run terminada
// para arrastrarlo a una run nueva. Se entra desde el fin de run (renderGameOver).

import { t } from '../data/i18n.js';
import { playerCardHTML } from './cards.js';

const LINE_ORDER = { GK: 0, DEF: 1, MID: 2, FWD: 3 };

export function renderCarryover(root, state, handlers) {
  const squad = (state.squad || []).slice().sort((a, b) => LINE_ORDER[a.position] - LINE_ORDER[b.position]);
  const cards = squad
    .map((p) => playerCardHTML(p, { idValue: p.uid, clickable: true, lazy: true }))
    .join('');

  root.innerHTML = `
    <section class="screen carryover-screen pixel-screen">
      <div class="carryover-head">
        <h1>${t('carryover.title')}</h1>
        <p class="carryover-hint">${t('carryover.hint')}</p>
      </div>
      <div class="card-grid carryover-grid">${cards}</div>
      <div class="action-bar carryover-actions">
        <button id="carryBack" class="ghost big glass-cta">${t('carryover.back')}</button>
      </div>
    </section>`;

  const grid = root.querySelector('.carryover-grid');
  grid.addEventListener('click', (event) => {
    const card = event.target.closest('.card.clickable');
    if (!card || !grid.contains(card)) return;
    const player = squad.find((p) => p.uid === card.dataset.id);
    if (player) handlers.onPick(player);
  });
  root.querySelector('#carryBack').addEventListener('click', () => handlers.onBack());
}
