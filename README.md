# Tower of Legends

## Versionado del juego

La versión visible del juego (pie del menú, p. ej. `v0.1.1`) vive en
`data/version.js` (`GAME_VERSION`) y se mantiene sincronizada con el campo
`version` de `package.json`.

**Sube sola en cada commit**: el hook `.githooks/pre-commit` ejecuta
`tools/bump_version.mjs --auto`, que incrementa el *patch* y añade los archivos
al commit en curso. No hay que editar el número a mano.

```text
git commit -m "..."              → 0.1.0 → 0.1.1   (patch, automático)
BUMP=minor git commit -m "..."   → 0.1.4 → 0.2.0   (cambio grande)
BUMP=major git commit -m "..."   → 0.2.3 → 1.0.0   (hito)
```

También se puede subir antes del commit (el hook lo respeta y no vuelve a
incrementar encima):

```bash
npm run version:patch   # o version:minor / version:major
```

El hook se activa con `git config core.hooksPath .githooks` (lo deja hecho el
`postinstall` de npm; en un clon nuevo basta con `npm install`). Esta versión
es independiente del hash de caché de los assets (sección siguiente).

## Caché de despliegue

El servidor genera automáticamente una versión de assets para cada despliegue.
Usa el SHA del commit proporcionado por la plataforma y, si no está disponible,
calcula un hash del código fuente.

`index.html` se sirve sin caché y referencia las entradas con esta versión:

```text
styles.css?v=<commit>
design/tokens.css?v=<commit>
main.js?v=<commit>
```

El servidor propaga esa versión por todo el grafo de módulos ES y por los
`url(...)` del CSS. Los recursos versionados se pueden cachear como `immutable`;
las rutas sin versión se revalidan con `Cache-Control: no-cache,
must-revalidate`. No hay que actualizar versiones manualmente al hacer push.
