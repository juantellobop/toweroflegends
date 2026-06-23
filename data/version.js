// Torre de Leyendas — Versión visible del juego (pie del menú).
// Se sube SOLA en cada commit (hook .githooks/pre-commit → tools/bump_version.mjs):
// patch por defecto; para cambios grandes, BUMP=minor git commit ... (o antes
// del commit: npm run version:minor). No editar el número a mano.
// Es independiente del hash de build para caché (BUILD_VERSION en
// tools/admin_server.mjs).

export const GAME_VERSION = '0.13.18';
