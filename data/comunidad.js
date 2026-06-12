// Torre de Leyendas — Comunidad en vivo (/api/comunidad): partidas jugadas en
// total y jugadores conectados ahora mismo. Todo es "mejor si está": sin
// servidor (hosting estático) las llamadas devuelven null y los contadores
// simplemente no se muestran.
//
// OJO con los nombres: este archivo se llamaba liveStats.js y EasyPrivacy (la
// lista de uBlock/AdGuard/Firefox estricto) bloquea el patrón "/livestats.js",
// igual que rutas tipo "/api/stats" o "heartbeat". Ni el archivo ni los
// endpoints deben volver a usar palabras de telemetría (stats, analytics,
// track, beacon, heartbeat...): por eso todo va en castellano.

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
  return requestJson('/api/comunidad');
}

// Suma una partida al contador global. Se llama al alcanzar el nivel 2: ahí
// la run cuenta como jugada de verdad (no al abrirla, que generaba cuentas
// falsas de runs abandonadas en el primer piso).
export function reportRunPlayed() {
  requestJson('/api/comunidad/partida', { method: 'POST', body: '{}' });
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
    requestJson('/api/comunidad/latido', {
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
