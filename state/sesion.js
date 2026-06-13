// Torre de Leyendas — Sesión única entre pestañas (Web Locks).
//
// El autosave (tdl_save) es un slot único, pero dos pestañas pueden cargar el
// mismo save y jugar copias divergentes. Para evitarlo, una pestaña retiene un
// cerrojo exclusivo mientras tiene una run activa: la segunda pestaña que intente
// continuar/empezar lo encuentra ocupado y avisa en vez de duplicar la partida.
//
// navigator.locks mantiene el lock mientras la promesa del callback siga abierta
// y lo libera SOLO al destruirse la pestaña (cerrar/recargar). Así, si abandonas
// la pestaña A, el cerrojo queda libre y la B puede retomar — sin TTL ni latidos.

const LOCK_NAME = 'tdl-run-activa';
let release = null;

// Pide el cerrojo. Resuelve true si lo conseguimos (y lo deja retenido hasta
// releaseRunLock o el cierre de la pestaña), o false si otra pestaña lo tiene.
// Sin soporte de Web Locks no se bloquea (degrada al comportamiento anterior; el
// dedup por runId del ranking sigue de red de seguridad).
export function acquireRunLock() {
  if (release) return Promise.resolve(true); // ya retenido por esta pestaña
  if (!globalThis.navigator?.locks) return Promise.resolve(true);
  return new Promise((resolveGot) => {
    navigator.locks
      .request(LOCK_NAME, { ifAvailable: true }, (lock) => {
        if (!lock) {
          resolveGot(false); // ocupado por otra pestaña
          return undefined;
        }
        resolveGot(true); // conseguido: lo retenemos hasta release
        return new Promise((resolveHeld) => { release = resolveHeld; });
      })
      .catch(() => resolveGot(false));
  });
}

// Suelta el cerrojo (al volver al menú tras gameover). Idempotente.
export function releaseRunLock() {
  if (release) {
    release();
    release = null;
  }
}
