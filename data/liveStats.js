// Torre de Leyendas — Estadísticas en vivo (/api/stats): partidas jugadas en
// total y jugadores conectados ahora mismo. Todo es "mejor si está": sin
// servidor (hosting estático) las llamadas devuelven null y los contadores
// simplemente no se muestran.

import { requestJson } from './api.js';

// Latido < TTL de presencia del servidor (60s): un cliente vivo nunca caduca.
const HEARTBEAT_MS = 25_000;
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

// Latido periódico de presencia: mantiene a este cliente en el recuento de
// jugadores en vivo mientras la pestaña siga abierta. Idempotente.
export function startPresence() {
  if (heartbeatTimer) return;
  const beat = () => requestJson('/api/stats/heartbeat', {
    method: 'POST',
    body: JSON.stringify({ id: clientId }),
  });
  beat();
  heartbeatTimer = setInterval(beat, HEARTBEAT_MS);
}
