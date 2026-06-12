// Torre de Leyendas — Estadísticas en vivo (/api/stats): partidas jugadas en
// total y jugadores conectados ahora mismo. Todo es "mejor si está": sin
// servidor (hosting estático) las llamadas devuelven null y los contadores
// simplemente no se muestran.

import { requestJson } from './api.js';

// Latido < TTL de presencia del servidor (120s): un cliente vivo aguanta
// incluso si pierde un latido. La cadencia es deliberadamente tranquila para
// no disparar la protección anti-bots del hosting (peticiones repetitivas).
const HEARTBEAT_MS = 45_000;
let heartbeatTimer = null;

// Identidad anónima de esta pestaña para el recuento de "jugando ahora".
const clientId = globalThis.crypto?.randomUUID
  ? globalThis.crypto.randomUUID()
  : `tdl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// { totalGames, online } o null si la API no está disponible.
export function fetchLiveStats() {
  return requestJson('/api/stats');
}

// Suma una partida al contador global. Se llama al arrancar una run nueva.
export function reportRunStarted() {
  requestJson('/api/stats/game', { method: 'POST', body: '{}' });
}

function tabHidden() {
  return typeof document !== 'undefined' && document.hidden;
}

// Latido periódico de presencia: mantiene a este cliente en el recuento de
// jugadores en vivo mientras la pestaña siga abierta Y visible. En segundo
// plano no se late (caduca del recuento y ahorra peticiones); al volver a la
// pestaña, un latido inmediato re-registra al cliente. Idempotente.
export function startPresence() {
  if (heartbeatTimer) return;
  const beat = () => {
    if (tabHidden()) return;
    requestJson('/api/stats/heartbeat', {
      method: 'POST',
      body: JSON.stringify({ id: clientId }),
    });
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) beat();
    });
  }
  beat();
  heartbeatTimer = setInterval(beat, HEARTBEAT_MS);
}
