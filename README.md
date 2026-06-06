# Tower of Legends

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
