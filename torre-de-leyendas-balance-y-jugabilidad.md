# Torre de Leyendas — Plan de balance y jugabilidad

> Tercera fase. El motor y la nueva línea de diseño ya están implementados. Este documento define cuatro cambios de balance descubiertos al probar el juego, con reglas, fórmulas, datos y criterios de aceptación, listos para que una IA los programe. **No rehace el motor ni la UI**; ajusta reglas y datos sobre lo existente.

## Resumen de los cambios

1. **Plantilla inicial mediocre + un ancla de rareza.** Arrancas con un equipo flojo, pero con un único buen jugador (rareza) que sirve de eje.
2. **Nerfeo de objetos + rendimientos decrecientes.** Todos los objetos pierden potencia, y acumular copias del mismo da cada vez menos (decaimiento exponencial), sin stackeo infinito.
3. **Sin cartas repetidas.** La colección es única por jugador; no se puede alinear dos veces al mismo. Si una carta repetida aparece en un sobre, se muestra **deshabilitada** y no se puede elegir.
4. **Rivales = selecciones reales (cuartos de final en adelante), con alineación visible.** El rival deja de ser anónimo: es una selección real que llegó al menos a cuartos en un Mundial, y se puede ver su once antes del partido.

Al final hay un bloque consolidado de **constantes de balance** (§5), un **plan por fases** (§6) y **criterios de aceptación** (§7).

---

## 1. Cambio 1 — Plantilla inicial mediocre con un ancla de rareza

### Problema
Hoy se empieza con un equipo demasiado bueno: no hay recorrido de mejora ni tensión inicial.

### Regla nueva
La plantilla de arranque tiene **11 jugadores**: **10 mediocres** (rareza `common`, overall bajo) **+ 1 "ancla"** de rareza superior que sirve de eje desde el primer partido. Todos con `id` distinto (sin repetidos).

- Los 10 comunes salen con overall dentro de `STARTER_COMMON_OVR_RANGE` (por defecto **54–66**).
- El ancla es una carta de rareza `STARTER_ANCHOR_RARITY` (por defecto **`epic`**; bajar a `rare` si el ancla resulta demasiado dominante en pruebas).
- El conjunto debe poder rellenar la formación inicial (un jugador por posición requerida).

### Algoritmo de generación

```
generarPlantillaInicial(catalogo, formacion, config):
  ocupados = {}                      // ids ya usados (unicidad)
  // 1) Elegir el ancla primero, para reservarle su posición
  ancla = elegirAleatorio( filtrar(catalogo, rarity == STARTER_ANCHOR_RARITY) )
  ocupados.add(ancla.id)
  // 2) Calcular cuántos jugadores por línea exige la formación y restar la del ancla
  huecos = huecosPorLinea(formacion)          // p. ej. {GK:1, DEF:4, MID:3, FWD:3}
  huecos[ancla.position] -= 1
  // 3) Rellenar el resto SOLO con comunes dentro del rango de overall, ids únicos
  comunes = filtrar(catalogo, rarity == "common" AND ovr in STARTER_COMMON_OVR_RANGE)
  squad = [ancla]
  para cada linea, para cada hueco restante:
     c = elegirAleatorio(comunes, excluyendo ocupados, de la posición correcta)
     ocupados.add(c.id); squad.push(c)
  // 4) Colocar en starting11 respetando la formación
  starting11 = colocar(squad, formacion)
  devolver { squad, starting11 }
```

### Interacción con el balance global
- Equipo inicial medio resultante ≈ 60–64 de overall. Esto se combina con el escalado de rivales (§4) y el draft previo a cada partido para que **el nivel 1 sea un partido reñido, no una goleada a favor**.
- Antes de cada partido (incluido el nivel 1) sigues abriendo sobre de jugador + objeto, así que entras al primer partido con una mejora sobre la base mediocre. Eso es intencional: la base es floja, pero el draft te da margen.

### Aceptación
- La plantilla inicial tiene exactamente **1 carta de rareza ≥ ancla** y **10 `common`**, todas con `id` único.
- El overall medio del once inicial cae dentro de una banda baja configurable (objetivo ≈ 60–64).
- La plantilla siempre puede llenar la formación inicial.

---

## 2. Cambio 2 — Nerfeo de objetos + rendimientos decrecientes exponenciales

### Problema
Los objetos dan demasiado poder y se pueden acumular sin límite.

### Parte A — Nerfeo global
Se aplica un factor global `ITEM_POWER_SCALE` (por defecto **0.5**) al **valor de cada efecto** de cada objeto, más topes por rating. Principio: un objeto debe ser una mejora notable pero **nunca dominante**.

- Para efectos aditivos (`add`): `valorEfectivo = valorBase * ITEM_POWER_SCALE`.
- Para efectos multiplicativos (`mult`): se escala solo la **parte de bonus**. Si el bono base es `b` (p. ej. `+0.10` = +10%), entonces `bonoEfectivo = b * ITEM_POWER_SCALE`.

Ejemplos de objetos nerfeados (ajustar a tu catálogo real; la idea es ~mitad de potencia):

| Objeto                | Efecto anterior          | Efecto nerfeado            |
|-----------------------|--------------------------|----------------------------|
| Botas de oro          | +6 pace a delanteros     | +3 pace a delanteros       |
| Guantes mágicos       | +8 rating de portero     | +4 rating de portero       |
| Capitanía             | +4 química global        | +2 química global          |
| Tiki-taka (táctica)   | +10% MED, −? DEF         | +5% MED, −3% DEF           |
| Catenaccio (táctica)  | +10% DEF, −? ATA         | +5% DEF, −3% ATA           |
| Presión alta          | +X% robo del rival       | +X/2 % robo del rival      |
| Localía (reliquia)    | +5% a todos los ratings  | +2.5% a todos los ratings  |

### Parte B — Rendimientos decrecientes por copias repetidas (exponencial)
Acumular copias del **mismo objeto** (mismo `id`) da cada vez menos. La copia `k` (empezando en 1) aporta una fracción `DR_RATE^(k-1)` del valor de una copia (por defecto `DR_RATE = 0.5`):

```
copia 1 → 100%
copia 2 → 50%
copia 3 → 25%
copia 4 → 12.5%
...
```

Contribución total de un objeto con `N` copias y valor por copia `c` (ya nerfeado):

```
total = c * (1 - DR_RATE^N) / (1 - DR_RATE)
```

Esto es una **serie geométrica**: por más copias que acumules, **el total nunca supera** `c / (1 - DR_RATE)` (con `DR_RATE = 0.5`, el tope es **2·c**, es decir, dos copias ya valen casi lo mismo que infinitas). Así se elimina el stackeo infinito de forma natural.

> Variante estricta (opcional): aplicar el decaimiento no solo a copias del mismo `id`, sino a **objetos distintos que afectan al mismo (target, stat)** — para impedir potenciar el mismo rating apilando objetos diferentes. Por defecto se hace por `id` (lo que pediste: "si tienes dos del mismo"); la variante estricta se puede activar con `DR_BY_STAT = true`.

### Pipeline de aplicación de objetos (en `teamRatings`, tras química)
1. Agrupar los objetos en propiedad por `id`; contar copias `N` por `id`.
2. Para cada objeto único: `c = valorBase * ITEM_POWER_SCALE`; calcular `total` con la fórmula de decaimiento.
3. Sumar las contribuciones por `(target, stat)`: por separado las `add` y las `mult`.
4. Aplicar primero todas las `add`, luego todas las `mult`.
5. **Topar** por rating: `add` total ≤ `ITEM_ADD_CAP` (por defecto **12**); bono `mult` total ≤ `ITEM_MULT_CAP` (por defecto **+0.15 = +15%**).

### Aceptación
- Todos los valores de efecto se ven reducidos por `ITEM_POWER_SCALE`.
- Una segunda copia del mismo objeto aporta `DR_RATE` veces lo de la primera; la tercera, `DR_RATE²`, etc.
- El efecto total de un objeto acumulado está acotado por la suma geométrica (nunca infinito).
- Ningún rating recibe más de `ITEM_ADD_CAP` aditivo ni más de `ITEM_MULT_CAP` multiplicativo por objetos.

---

## 3. Cambio 3 — Sin cartas de jugador repetidas

### Problema
Se pueden coleccionar repetidos y alinear dos veces al mismo jugador.

### Reglas nuevas
- **Colección única por jugador.** La plantilla (`squad`) no puede contener dos cartas con el mismo `id` de jugador. (Aplica **solo a jugadores**; los **objetos sí pueden repetirse** — son la base del sistema de decaimiento del Cambio 2.)
- **Sobres:** una carta de jugador cuyo `id` ya esté en tu plantilla se muestra **deshabilitada** y **no se puede seleccionar**.
- Para no bloquear al jugador, el sobre se reparte **excluyendo los `id` ya poseídos cuando el catálogo lo permite**, de modo que los repetidos casi no aparecen; y se **garantiza al menos 1 carta seleccionable** por sobre (si existe alguna no poseída del tipo requerido).

### Algoritmo de reparto de sobre de jugador

```
drawPlayerPack(catalogo, squad, size, rarityBias):
  ownedIds = set(ids de squad)
  pool     = catalogo filtrado por las reglas del nivel (posición/tipo)
  unowned  = pool \ ownedIds
  cartas   = muestrearSinReemplazo(unowned, min(size, |unowned|), peso=rarityBias)
  // Relleno solo si no hay suficientes no poseídas:
  si |cartas| < size:
     faltan = size - |cartas|
     repetidas = muestrear(pool ∩ ownedIds, faltan)   // se mostrarán deshabilitadas
     cartas += repetidas
  // Garantía de jugabilidad:
  si PACK_GUARANTEE_SELECTABLE y |unowned| >= 1:
     asegurar que 'cartas' incluye al menos 1 carta no poseída
  // Marcar selectividad para la UI:
  para cada carta: carta.selectable = (carta.id no está en ownedIds)
  devolver cartas
```

### UI (usar el sistema de diseño ya implementado)
- Carta repetida: atenuada (opacidad reducida), con un icono de candado/check y la etiqueta **"Ya en tu plantilla"**; no responde al toque y no muestra el botón **Elegir**.
- El resto de cartas se eligen con normalidad.

### Aceptación
- `squad` nunca contiene dos jugadores con el mismo `id`.
- En un sobre, las cartas ya poseídas aparecen **no seleccionables** y claramente marcadas.
- Siempre hay al menos una carta seleccionable mientras exista en el catálogo una no poseída del tipo requerido.
- La regla de unicidad **no** afecta a los objetos.

---

## 4. Cambio 4 — Rivales = selecciones reales (cuartos de final +), con alineación visible

### Problema
El rival es anónimo y procedural; no se sabe a quién te enfrentas ni con qué once.

### Regla nueva
Cada nivel te enfrentas a una **selección real que llegó al menos a cuartos de final** en algún Mundial (un "equipo-año", p. ej. *Brasil 1970*, *Francia 1998*, *Croacia 2018*). Antes del partido puedes **ver su once principal** en una pantalla de scouting.

### 4.1 Definición del conjunto de rivales (qué selecciones entran)
Entran todas las **(selección, año)** que alcanzaron **como mínimo los cuartos de final** (los 8 mejores) de ese Mundial. Para ediciones modernas con cuadro de eliminación directa, "cuartos" = los 8 cuartofinalistas. Para ediciones antiguas con formatos de grupos en segunda fase, usar el **equivalente a los 8 mejores** (curar con cuidado).

Ejemplos verificables de cuartofinalistas (o mejor) por edición, para poblar el dataset:

- **2022:** Argentina, Francia, Croacia, Marruecos, Países Bajos, Inglaterra, Brasil, Portugal.
- **2018:** Francia, Croacia, Bélgica, Inglaterra, Uruguay, Brasil, Rusia, Suecia.
- **2014:** Alemania, Argentina, Países Bajos, Brasil, Francia, Bélgica, Colombia, Costa Rica.
- **2010:** España, Países Bajos, Alemania, Uruguay, Argentina, Brasil, Ghana, Paraguay.
- **2006:** Italia, Francia, Alemania, Portugal, Brasil, Argentina, Inglaterra, Ucrania.
- **2002:** Brasil, Alemania, Turquía, Corea del Sur, España, Inglaterra, Senegal, EE. UU.
- **1998:** Francia, Brasil, Croacia, Países Bajos, Italia, Argentina, Alemania, Dinamarca.
- **1994:** Brasil, Italia, Suecia, Bulgaria, Alemania, Países Bajos, Rumanía, España.
- **1990:** Alemania Occidental, Argentina, Italia, Inglaterra, Irlanda, Yugoslavia, Checoslovaquia, Camerún.
- **1986:** Argentina, Alemania Occidental, Francia, Bélgica, Brasil, Inglaterra, España, México.
- **Iconos antiguos** (curar el "equivalente a 8 mejores"): Brasil 1958/1962/1970, Inglaterra 1966, Países Bajos 1974/1978, Argentina 1978, Italia 1982/1934/1938, Alemania Occidental 1954/1974.

> Esto da un pool de **80+ equipos-año**, suficiente para runs largas sin repetir. Las ediciones previas a 1986 cambiaban de formato; el implementador debe mapear "al menos cuartos" a "los 8 mejores equivalentes" de cada edición y verificar contra una fuente fiable.

### 4.2 Esquema de datos del rival

```json
{
  "id": "br_1970",
  "name": "Brasil",
  "year": 1970,
  "achievement": "Campeón",                 // o "Subcampeón", "Semifinal", "Cuartos de final"
  "colors": { "primary": "#F7D117", "secondary": "#1E6FBF" },
  "strength": 95,                            // valor de juego (no es el OVR real)
  "formation": "4-2-2-2",
  "ratings": { "attack": 94, "midfield": 90, "defense": 84, "gk": 86 },
  "lineup": [
    { "name": "Félix",          "position": "GK",  "ovr": 84 },
    { "name": "Carlos Alberto", "position": "DEF", "ovr": 88 },
    { "name": "Brito",          "position": "DEF", "ovr": 82 },
    { "name": "Piazza",         "position": "DEF", "ovr": 83 },
    { "name": "Everaldo",       "position": "DEF", "ovr": 80 },
    { "name": "Clodoaldo",      "position": "MID", "ovr": 85 },
    { "name": "Gérson",         "position": "MID", "ovr": 89 },
    { "name": "Jairzinho",      "position": "FWD", "ovr": 90 },
    { "name": "Tostão",         "position": "FWD", "ovr": 88 },
    { "name": "Pelé",           "position": "FWD", "ovr": 95 },
    { "name": "Rivelino",       "position": "MID", "ovr": 89 }
  ]
}
```

- **`strength`** es un valor de juego asignado por el diseñador, no el OVR real del equipo. Sirve para el escalado por nivel (§4.4).
- **`ratings`** (las cuatro líneas) alimentan la simulación. Recomendación pragmática: asignarlas a mano coherentes con `strength`. (Opcional/avanzado: dar stats completos a cada jugador del once y **derivar** los ratings con la misma función `teamRatings` que usa tu equipo, para simetría total.)
- **`lineup`** son los 11 reales (nombre + posición; `ovr` por jugador opcional, solo para mostrar en scouting). Los **nombres y alineaciones son hechos** y pueden usarse; **verificar contra una fuente fiable**.

### 4.3 Pantalla de scouting (ver al rival antes del partido)
Antes de cada partido, una pantalla muestra al rival reutilizando la vista de campo/plantilla del sistema de diseño:

- Cabecera: nombre + año + insignia de logro ("Campeón", "Cuartos de final"), colores del equipo.
- Formación del rival y su **once en el campo** (fichas con dorsal/posición y, si existe, su `ovr`).
- Los cuatro ratings del rival (ATA/MED/DEF/POR).
- Botón para continuar a armar tu equipo / al partido.

Esto, además de dar identidad, permite al jugador **adaptar su alineación** al rival (y enlaza con los tipos tácticos si se implementan).

### 4.4 Escalado de dificultad (qué rival toca en cada nivel)
- Se ordena el pool por `strength`. La fuerza objetivo por nivel es `targetStrength(level) = OPP_BASE_STRENGTH + (level - 1) * OPP_GROWTH`.
- En el nivel N se elige un rival **no usado** cuya `strength` esté más cerca de `targetStrength(level)` (dentro de una ventana `OPP_MATCH_WINDOW`).
- **Sin repetir rival dentro de una run** (`NO_REPEAT_RIVALS = true`) hasta agotar el pool; al agotarlo, reutilizar con un pequeño multiplicador de ratings o reiniciar la rotación.
- Calibrado para que el **rival más flojo del pool ≈ `OPP_BASE_STRENGTH`** (un cuartofinalista modesto: p. ej. Costa Rica 2014, Senegal 2002, EE. UU. 2002) y los **grandes campeones ≈ 95**, repartiendo el resto entre medias. Así el nivel 1 es reñido contra tu plantilla mediocre + el draft inicial, y la torre escala hacia las leyendas.

### Aceptación
- Cada rival es una **(selección, año) real que llegó al menos a cuartos** de algún Mundial.
- Antes del partido se puede ver el **once principal** del rival y sus ratings.
- La dificultad sube con el nivel eligiendo rivales de `strength` creciente, sin repetir dentro de la run hasta agotar el pool.
- Los nombres/alineaciones usados son reales y verificados; no se usan escudos/marcas oficiales (ver §8).

---

## 5. Constantes de balance (nuevas y actualizadas)

```
// --- Plantilla inicial (Cambio 1) ---
STARTER_COMMON_OVR_RANGE = [54, 66]   // overall de los 10 comunes
STARTER_ANCHOR_RARITY    = "epic"     // rareza del ancla ("rare" si resulta muy fuerte)
STARTER_SQUAD_SIZE       = 11         // 10 comunes + 1 ancla

// --- Objetos (Cambio 2) ---
ITEM_POWER_SCALE = 0.5     // nerf global a todos los valores de efecto
DR_RATE          = 0.5     // decaimiento por copia repetida: copia k aporta DR_RATE^(k-1)
DR_BY_STAT       = false   // true = decaimiento también entre objetos distintos que tocan el mismo (target,stat)
ITEM_ADD_CAP     = 12      // tope aditivo total por rating
ITEM_MULT_CAP    = 0.15    // tope multiplicativo total por rating (+15%)

// --- Cartas (Cambio 3) ---
ALLOW_DUPLICATE_PLAYERS   = false   // colección única por id de jugador (los objetos SÍ se repiten)
PACK_GUARANTEE_SELECTABLE = true    // siempre >= 1 carta seleccionable si existe en el catálogo

// --- Rivales reales (Cambio 4) ---
OPP_BASE_STRENGTH = 64    // fuerza del rival más flojo del pool / nivel 1
OPP_GROWTH        = 1.6   // incremento de fuerza objetivo por nivel
OPP_MATCH_WINDOW  = 4     // ventana de búsqueda alrededor de la fuerza objetivo
NO_REPEAT_RIVALS  = true  // no repetir rival dentro de una run hasta agotar el pool
```

> `OPP_BASE_STRENGTH` y `OPP_GROWTH` sustituyen al escalado procedural anterior: ahora seleccionan un **equipo real** por proximidad de `strength`, no generan uno.

---

## 6. Plan de implementación por fases

### Fase 1 — Datos
- Construir el **dataset de rivales** (§4.1–4.2): equipos-año de cuartos+ con `strength`, `ratings`, `formation` y `lineup` real (verificado). Empezar por las ediciones 1986–2022 (pool grande y de formato claro) y añadir iconos antiguos después.
- Revisar el **catálogo de jugadores** para garantizar suficientes `common` en el rango de overall del arranque y suficientes cartas de la rareza del ancla.
- **Entregable:** datos validados (rivales con alineación; catálogo con comunes/ancla suficientes).

### Fase 2 — Plantilla inicial
- Implementar `generarPlantillaInicial` (§1) y reemplazar la generación actual.
- **Entregable:** las runs nuevas arrancan con 10 comunes + 1 ancla, overall medio bajo, ids únicos.

### Fase 3 — Sistema de objetos
- Aplicar `ITEM_POWER_SCALE`, el decaimiento exponencial por copias y los topes (§2), en el pipeline de `teamRatings`.
- **Entregable:** objetos nerfeados, sin stackeo infinito, con tope por rating; tests unitarios de la fórmula geométrica.

### Fase 4 — Unicidad de cartas
- Imponer unicidad por `id` en la colección; implementar `drawPlayerPack` con exclusión de poseídas, repetidas deshabilitadas y garantía de ≥1 seleccionable; UI de carta no seleccionable (§3).
- **Entregable:** imposible alinear dos veces al mismo jugador; sobres correctos.

### Fase 5 — Rivales reales + scouting
- Selección de rival por `strength` y nivel (§4.4); pantalla de **scouting** con el once del rival (§4.3); alimentar la simulación con los `ratings` reales del rival.
- **Entregable:** cada nivel muestra un rival real con su alineación; dificultad creciente sin repetir.

### Fase 6 — Re-tuneo y pruebas de balance
- Ejecutar muchas runs en modo sin interfaz (headless) y medir: **winrate por nivel**, **nivel medio alcanzado**, impacto de objetos antes/después del nerf, y frecuencia de cartas deshabilitadas en sobres.
- Objetivos sugeridos (ajustar a gusto): nivel 1 ≈ 50–60% de victoria con buen draft; curva de dificultad suave; ninguna combinación de objetos que dispare el winrate. Afinar las constantes de §5 hasta cumplir.
- **Entregable:** informe de balance + constantes finales.

---

## 7. Criterios de aceptación (checklist global)

Plantilla inicial
- [ ] El once inicial tiene 1 carta de rareza ≥ ancla y 10 `common`, todas con `id` único.
- [ ] El overall medio inicial cae en una banda baja configurable (≈ 60–64).

Objetos
- [ ] Todos los efectos están reducidos por `ITEM_POWER_SCALE`.
- [ ] La copia `k` de un objeto aporta `DR_RATE^(k-1)` de una copia; el total está acotado por la serie geométrica.
- [ ] Se respetan `ITEM_ADD_CAP` e `ITEM_MULT_CAP` por rating.

Cartas
- [ ] La colección nunca tiene jugadores repetidos por `id`.
- [ ] Las cartas ya poseídas aparecen en los sobres **deshabilitadas** y marcadas.
- [ ] Siempre hay ≥1 carta seleccionable si existe una no poseída del tipo requerido.
- [ ] La unicidad no afecta a los objetos (sí se pueden repetir).

Rivales
- [ ] Cada rival es una selección real que llegó al menos a cuartos en un Mundial.
- [ ] Se ve el once principal del rival y sus ratings antes del partido.
- [ ] La dificultad sube por `strength` creciente, sin repetir dentro de la run hasta agotar el pool.

Balance
- [ ] El nivel 1 es reñido (no goleada a favor) con la plantilla mediocre + draft inicial.
- [ ] Ninguna combinación de objetos rompe la curva de dificultad.

---

## 8. Notas

- **Datos reales como hechos.** Nombres de selecciones, jugadores y alineaciones históricas son datos verificables y pueden usarse. **Verificar las alineaciones contra una fuente fiable** antes de incluirlas.
- **Propiedad intelectual.** No usar escudos, equipaciones ni logos oficiales de federaciones, ni marcas registradas de torneos; usar nombres genéricos para el torneo (coherente con los documentos anteriores) y arte propio. Mantener el descargo de "proyecto no oficial".
- **Formato de cuartos en ediciones antiguas.** Donde el Mundial no tenía cuadro de eliminación directa, mapear "al menos cuartos" al "equivalente a los 8 mejores" de esa edición; curar con cuidado.
- **Coherencia con fases previas.** Estos cambios solo ajustan reglas y datos: el motor de simulación (eventos, fórmulas de probabilidad) y el sistema de diseño/UX ya implementados no se modifican, salvo el pipeline de objetos en `teamRatings` y la fuente de datos del rival.
