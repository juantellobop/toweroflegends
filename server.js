// Torre de Leyendas — Entrada de producción.
// Express delega en el dispatcher ya existente (tools/admin_server.mjs), que
// resuelve estáticos, ranking y el panel admin protegido por token.

import express from 'express';
import { ADMIN_ENABLED, BUILD_VERSION, handleRequest } from './tools/admin_server.mjs';

const app = express();
const PORT = process.env.PORT || 8080;

app.disable('x-powered-by');

// Toda la app (archivos estáticos + /api/*) la sirve la lógica reutilizada.
app.use((req, res) => handleRequest(req, res));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Torre de Leyendas escuchando en puerto ${PORT}`);
  console.log(`Versión de assets: ${BUILD_VERSION}`);
  if (ADMIN_ENABLED) console.log('Panel admin en /#playeredit');
});
