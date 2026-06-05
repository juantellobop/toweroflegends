# Torre de Leyendas — Documento de diseño e implementación

> Roguelike de fútbol. Armas una selección abriendo sobres de cartas y de objetos, y escalas una torre infinita enfrentándote a selecciones cada vez más fuertes. Una simulación calcula el partido jugada a jugada en función de tus jugadores y te muestra las jugadas y el marcador. Según el resultado recibes más o menos cartas para reforzarte antes del siguiente nivel.

Este documento está escrito para que una IA pueda implementar el juego de principio a fin. Incluye concepto, bucle, componentes, el motor de simulación con pseudocódigo y fórmulas, modelos de datos, pantallas, arquitectura, plan por fases y criterios de aceptación.

---

## 1. Resumen ejecutivo

- **Género:** roguelike de progresión infinita (estilo "battle tower") con draft de cartas.
- **Tema:** fútbol de selecciones, ambientación mundialista.
- **Bucle:** abres sobres → eliges 1 jugador y 1 objeto → completas tu formación → simulas un partido contra una selección rival → según el resultado recibes más o menos cartas → subes de nivel contra un rival un poco mejor.
- **Principio de diseño irrenunciable:** el jugador **nunca** depende de su memoria ni escribe nada. **Siempre elige entre X opciones que el juego le pone delante.** Ese gesto (elegir 1 entre X) es el verbo único de todo el juego.
- **Objetivo del jugador:** llegar lo más lejos posible en la torre. El número de nivel alcanzado es la puntuación.
- **Plataforma objetivo:** navegador (móvil y escritorio). Sin servidor en la versión inicial; todo el estado vive en memoria.

---

## 2. Pilares de diseño

1. **Elegir, no recordar.** Cada vez que el juego pide una decisión, ofrece entre 2 y 5 cartas concretas con su información visible. El reto es de criterio (¿cuál me conviene?), no de conocimiento.
2. **Lectura total de la información.** Cada carta muestra todo lo necesario para decidir: posición, atributos, rareza, nación, época y rasgo. No hay información oculta que el jugador deba saber de antemano.
3. **Variabilidad por run.** Cada partida es distinta porque los sobres son aleatorios y las sinergias cambian. La rejugabilidad viene de aquí, no de la dificultad de recordar.
4. **El margen importa.** Ganar por mucho (guiño al "7-0") da mejores recompensas que ganar por poco. Premia construir bien.
5. **Tensión creciente.** Cada nivel el rival es algo mejor. Tarde o temprano la torre te supera; la gracia es cuántos pisos aguantas.
6. **Simulación legible.** El partido no es un número que aparece: se muestran las jugadas, quién interviene y por qué pasa lo que pasa, terminando en el marcador.

---

## 3. Bucle de juego central

Este es el flujo exacto que se repite en cada nivel:

```
INICIO DE RUN
  └─ Se genera una formación inicial y se rellena con jugadores al azar (plantilla de arranque).

NIVEL N (se repite mientras no pierdas)
  1. SOBRE DE JUGADOR  → se muestran X cartas de jugador al azar → eliges 1 → se añade a tu plantilla.
  2. SOBRE DE OBJETO   → se muestran X objetos al azar → eliges 1 → se añade a tu inventario.
  3. ARMAR EQUIPO      → colocas a tus jugadores en la formación (11 titulares) y activas objetos.
  4. RIVAL             → se genera/selecciona una selección rival con fuerza acorde al nivel
                         (nivel 1 = floja; cada nivel un poco mejor).
  5. SIMULACIÓN        → el motor calcula el partido jugada a jugada, mostrando las jugadas
                         y terminando en el marcador final.
  6. RESULTADO
        - Si GANAS  → recompensa escalada por el margen (más cartas/mejores cuanto mayor el margen)
                      → NIVEL N+1 (rival un poco mejor).
        - Si EMPATAS→ recompensa mínima → NIVEL N+1.
        - Si PIERDES→ FIN DE RUN. Puntuación = nivel alcanzado. Pantalla de resumen.
```

> **Decisión de diseño a confirmar (failure condition).** Tu descripción sugiere que "se pasa al siguiente nivel" tras el partido. Para que sea un roguelike con sentido ("cuántos pisos aguantas") proponemos por defecto: **perder termina la run**. Es la opción recomendada y la que da emoción al marcador. Alternativa configurable: sistema de **vidas** (p. ej. 3 derrotas permitidas). Esto se controla con la constante `LIVES` (ver §6.6): `LIVES = 1` significa "pierdes y se acaba"; `LIVES = 3` da margen. Empatar nunca te elimina, solo da recompensa pobre.

---

## 4. Componentes del juego

### 4.1 Cartas de jugador

Cada jugador es una carta con atributos visibles. Modelo de atributos compacto (estilo arcade, valores 0–99):

- **Atributos de jugador de campo:** `pace` (velocidad), `shooting` (definición), `passing` (pase), `dribbling` (regate), `defending` (defensa), `physical` (físico).
- **Atributos de portero:** `reflexes`, `handling`, `positioning`. (Los porteros no usan los seis de campo.)
- **Posición (línea):** `GK` | `DEF` | `MID` | `FWD`. (En MVP basta con estas cuatro líneas. Posiciones más finas como LW/CB/CDM son una mejora posterior.)
- **Overall (`ovr`):** valor resumen 0–99, derivado de los atributos (ver fórmula en §6.1) o almacenado.
- **Rareza:** `common` | `rare` | `epic` | `legend`. La rareza sesga el rango de atributos y la probabilidad de aparición en sobres.
- **Nación** y **época** (`era`, p. ej. `"1986"`): se usan para **química/sinergias** (§4.7).
- **Rasgo** (`trait`, opcional): efecto especial pasivo, p. ej. *Francotirador* (+finishing en jugadas), *Muro* (+defending), *Motor* (+físico/pase en mediocampo). Lista ampliable.
- **Tipo táctico** (`tacticalType`, opcional, para mejora futura): `posesion` | `presion` | `contra`, base del piedra-papel-tijera.

### 4.2 Cartas de objeto

Objetos que modifican a tu equipo o la run. Tipos sugeridos:

- **Equipamiento** (afecta a un jugador o línea): *Botas de oro* (+pace al portador o a una línea), *Guantes mágicos* (+rating de portero), *Capitanía* (+química global).
- **Tácticas** (afectan a ratings de equipo): *Tiki-taka* (+mediocampo, −defensa), *Catenaccio* (+defensa, −ataque), *Presión alta* (+probabilidad de robo/turnover del rival).
- **Consumibles** (un solo uso): *Botiquín* (recupera a un jugador lesionado en modo Nuzlocke), *Cambio táctico* (rerollea el sobre actual).
- **Reliquias** (pasivas permanentes de la run, mejora futura): *Localía* (+5% a todos los ratings), *Suplentes de lujo* (el sobre de jugador ofrece +1 carta).

Esquema de efecto sugerido (declarativo, fácil de aplicar por el motor):

```json
{
  "id": "botas_oro",
  "name": "Botas de oro",
  "type": "equipamiento",
  "rarity": "rare",
  "effects": [
    { "target": "line", "line": "FWD", "stat": "pace", "op": "add", "value": 6 }
  ]
}
```

`op` puede ser `add` (suma plana) o `mult` (multiplicador). `target` puede ser `player`, `line`, `team` o `match` (afecta a mecánicas del partido como la probabilidad de robo).

### 4.3 Formaciones

Una formación define cuántos jugadores van en cada línea. Para MVP basta con dos o tres:

- `4-3-3` → 1 GK, 4 DEF, 3 MID, 3 FWD
- `4-4-2` → 1 GK, 4 DEF, 4 MID, 2 FWD
- `3-5-2` → 1 GK, 3 DEF, 5 MID, 2 FWD

La formación condiciona qué ratings de equipo salen más fuertes (más MID = más posesión; más FWD = más ataque). El jugador puede cambiar de formación si tiene jugadores para llenarla.

### 4.4 Tu plantilla y los 11 titulares

- **Plantilla:** todas las cartas de jugador que posees (crecen sobre por sobre).
- **Once titular:** los 11 que colocas en la formación para el partido. El resto son suplentes (pueden entrar por lesión/cambio).
- El motor solo usa los 11 titulares (más posibles cambios) para simular.

### 4.5 Rivales (selecciones mundialistas)

- Cada nivel enfrentas a una **selección rival** con una fuerza objetivo acorde al nivel.
- **Nivel 1:** selección "floja" (overall bajo). **Cada nivel:** la fuerza objetivo sube un poco.
- Dos formas de implementarlo:
  - **Procedural (recomendado para MVP):** se genera el rival a partir de un `targetOVR` por nivel (ver §6.6). Sus líneas (ataque/medio/defensa/portero) se derivan del `targetOVR` con algo de varianza. Necesita solo un nombre y un color de bandera.
  - **Curado (mejora):** una lista de selecciones reales con una **fuerza/tier** asignada, ordenadas de menor a mayor, recorridas en ascenso y repetidas con multiplicador al agotarse.
- Importante: el rival debe tener las mismas magnitudes de rating que tú para que las fórmulas de §6 funcionen simétricamente.

### 4.6 Sobres y recompensa escalada por resultado

Tabla por defecto (todo configurable en §6.6). "Pack de N" = se muestran N cartas y eliges 1; mejor margen sube N y la probabilidad de rarezas altas.

| Resultado del partido            | Sobre de jugador | Sesgo de rareza        | Extra            |
|----------------------------------|------------------|------------------------|------------------|
| Goleada (dif. ≥ 5, incl. "7-0")  | Elige 1 de 5     | Muy alto (epic/legend) | +1 objeto a elegir |
| Victoria amplia (dif. 3–4)       | Elige 1 de 4     | Alto                   | —                |
| Victoria ajustada (dif. 1–2)     | Elige 1 de 3     | Medio                  | —                |
| Empate                           | Elige 1 de 2     | Bajo (commons)         | —                |
| Derrota                          | —                | —                      | Fin de run       |

El sobre de objeto sigue su propia tabla análoga (por defecto: 3 objetos a elegir, +1 en goleada).

### 4.7 Química / sinergias (clave para la profundidad sin memoria)

Jugadores que comparten **nación** o **época** generan enlaces que potencian a su línea. Como la carta muestra nación y época, el jugador puede construir temático **leyendo, sin saber nada de antemano**.

- Por cada par de titulares en la misma línea que comparten nación → `+CHEM_NATION` a esa línea.
- Por cada par que comparte época → `+CHEM_ERA` a esa línea.
- La química total de cada línea se suma a su rating (con tope `CHEM_CAP`).

---

## 5. Modelos de datos (JSON)

### 5.1 Jugador

```json
{
  "id": "p_pele_1970",
  "name": "Pelé",
  "nation": "Brasil",
  "era": "1970",
  "position": "FWD",
  "rarity": "legend",
  "ovr": 95,
  "stats": { "pace": 90, "shooting": 94, "passing": 88, "dribbling": 95, "defending": 30, "physical": 80 },
  "gk": null,
  "trait": "Francotirador",
  "tacticalType": "posesion"
}
```

Portero:

```json
{
  "id": "p_banks_1970",
  "name": "Gordon Banks",
  "nation": "Inglaterra",
  "era": "1970",
  "position": "GK",
  "rarity": "epic",
  "ovr": 88,
  "stats": null,
  "gk": { "reflexes": 89, "handling": 86, "positioning": 88 },
  "trait": "Paradón",
  "tacticalType": null
}
```

### 5.2 Objeto

(Ver esquema de efectos en §4.2.)

### 5.3 Rival

```json
{
  "id": "opp_lvl_1",
  "name": "Selección Naranja",
  "color": "#E07A3F",
  "level": 1,
  "ratings": { "attack": 58, "midfield": 56, "defense": 60, "gk": 57 },
  "dominantType": "contra"
}
```

> En el modo procedural, `ratings` se generan a partir de `targetOVR(level)`; en el modo curado se almacenan o derivan de la plantilla real.

### 5.4 Estado de la run

```json
{
  "level": 1,
  "lives": 1,
  "formation": "4-3-3",
  "squad": ["p_pele_1970", "..."],
  "starting11": { "GK": ["..."], "DEF": ["..."], "MID": ["..."], "FWD": ["..."] },
  "items": ["botas_oro", "..."],
  "seed": 123456,
  "history": [
    { "level": 1, "score": "4-0", "result": "win" }
  ]
}
```

---

## 6. Motor de simulación (el corazón del juego)

Esta es la parte más importante. El motor debe: (a) convertir los atributos de los 11 jugadores en ratings de equipo, (b) simular el partido como una **secuencia de jugadas** donde intervienen jugadores concretos y su resultado depende de sus atributos contra los del rival, (c) producir un **registro de jugadas narradas** para mostrar, y (d) devolver el **marcador final**.

### 6.1 De atributos de jugador a ratings de equipo

Dado un once titular colocado por líneas, se calculan cuatro ratings de equipo. Las fórmulas (ajustables) son:

```
gkRating      = media(reflexes, handling, positioning) del portero

defenseRating = mediaPonderada sobre DEF de
                  (0.50*defending + 0.25*physical + 0.25*pace)
                + 0.40 * gkRating

midfieldRating= mediaPonderada sobre MID de
                  (0.35*passing + 0.25*dribbling + 0.20*defending + 0.20*physical)

attackRating  = mediaPonderada sobre FWD de
                  (0.50*shooting + 0.20*pace + 0.20*dribbling + 0.10*physical)
                + 0.30 * (media de passing de los MID)   // el medio alimenta el ataque
```

Después se aplican, en este orden, a cada rating relevante:

1. **Química** (§4.7): suma por enlaces de nación/época, con tope `CHEM_CAP`.
2. **Objetos** (§4.2): primero todos los `add`, luego todos los `mult`.
3. **Matchup táctico** (mejora futura): si tu tipo dominante cuenta el del rival, `×(1 + TYPE_BONUS)` a los ratings relevantes.

El `ovr` de un jugador, si no viene dado, se deriva como media ponderada según su posición (p. ej. para FWD pesa más shooting/dribbling; para DEF, defending/physical).

### 6.2 Modelo de partido: posesión → jugadas → embudo

El partido se modela como una sucesión de **jugadas de ataque** repartidas entre los dos equipos según la posesión. Cada jugada pasa por un **embudo de tres pasos** en el que intervienen jugadores concretos:

1. **Construcción (build-up):** mediocampo atacante vs mediocampo defensor. Si falla → **pérdida/robo** (turnover); la jugada muere (opcionalmente puede generar un contraataque del rival).
2. **Generación de ocasión:** ataque atacante vs defensa+portero rival. Si tiene éxito → **se crea una ocasión** (oportunidad de remate). Se elige al rematador entre los FWD, con peso por `shooting` (+algo de pace/dribbling).
3. **Definición (finish):** `shooting` del rematador vs `gkRating` del rival. Si tiene éxito → **GOL**. Si no → **parada/fallo** (parada destacada si el portero es bueno).

El producto de las tres probabilidades mantiene los marcadores realistas (pocos goles), y la varianza permite tanto goleadas (incluido el guiño al "7-0") como alguna sorpresa del rival débil.

### 6.3 Fórmulas de probabilidad

Para cualquier enfrentamiento de ratings `A` (atacante) vs `B` (defensor) se usa una probabilidad por **ratio con exponente**:

```
p(A vence a B) = A^THETA / (A^THETA + B^THETA)
```

- `THETA` controla cuánto manda el rating frente a la suerte. `THETA ≈ 1.6` da partidos creíbles con upsets ocasionales. Subirlo hace que el mejor gane casi siempre; bajarlo aumenta las sorpresas.

**Posesión y número de jugadas:**

```
possessionA   = midfieldA^THETA / (midfieldA^THETA + midfieldB^THETA)
totalSequences= BASE_SEQUENCES                         // p. ej. 22
sequencesA    = round(totalSequences * possessionA)
sequencesB    = totalSequences - sequencesA
```

**Por cada jugada del atacante X contra el defensor Y:**

```
p1 (build-up) = midfieldX^THETA / (midfieldX^THETA + midfieldY^THETA)
p2 (ocasión)  = attackX^THETA   / (attackX^THETA   + defenseY^THETA)
shooter       = elegir entre FWD(X) con peso = shooting*0.7 + pace*0.15 + dribbling*0.15
p3 (gol)      = shooter.shooting^THETA / (shooter.shooting^THETA + gkY^THETA)

P(gol en la jugada) = p1 * p2 * p3
```

**Comprobación de cordura (con `THETA=1.6`):** un equipo fuerte (ataque 80, medio 78, def 75, gk 78) contra uno flojo (ataque 55, medio 50, def 60, gk 55) produce de media ≈ **4–5 goles a favor y ≈ 0–1 en contra**, con varianza suficiente para que aparezcan goleadas tipo 6-0/7-0 o algún gol sorpresa del rival. Esto encaja con la sensación buscada (rival flojo al principio) sin volverse determinista.

### 6.4 Generación de jugadas narradas (play-by-play)

Cada jugada relevante produce una entrada de registro con minuto, jugadores implicados y desenlace, para mostrarla en pantalla. Banco de plantillas (ampliable), rellenando `{nombres}`:

- **Pérdida:** `Min {m}' — {medioY} corta la jugada de {medioX}. Pérdida.`
- **Ocasión fallada en construcción:** `Min {m}' — {medioX} intenta filtrar pero la defensa de {rival} achica.`
- **Parada:** `Min {m}' — ¡{rematador} prueba de {distancia} y {portero} responde con una gran parada!`
- **Gol:** `Min {m}' — {asistente} habilita a {rematador}… ¡GOOOL! {equipo} se pone {marcadorParcial}.`

Reglas de presentación:
- Asignar minutos repartidos a lo largo de 90 (p. ej. ordenar las jugadas en el tiempo).
- Mostrar siempre los goles; mostrar una selección de las ocasiones y paradas más relevantes (no todas las pérdidas, para no saturar).
- Animar la aparición progresiva de las jugadas (mejora de UI), y al final fijar el **marcador**.

### 6.5 Pseudocódigo completo del motor

```
función simularPartido(teamA, teamB, rng):
    rA = calcularRatings(teamA)        // {attack, midfield, defense, gk}
    rB = calcularRatings(teamB)

    possessionA = ratio(rA.midfield, rB.midfield, THETA)
    seqA = round(BASE_SEQUENCES * possessionA)
    seqB = BASE_SEQUENCES - seqA

    eventos = []
    golesA = 0
    golesB = 0

    cola = intercalarEnElTiempo(seqA veces "A", seqB veces "B")  // distribuye en 90'
    para cada (minuto, lado) en cola:
        atacante = (lado == "A") ? teamA : teamB
        defensor = (lado == "A") ? teamB : teamA
        rAtt = (lado == "A") ? rA : rB
        rDef = (lado == "A") ? rB : rA

        // Paso 1: construcción
        si rng.bernoulli(ratio(rAtt.midfield, rDef.midfield, THETA)) == falso:
            eventos.push(evento("perdida", minuto, atacante, defensor))
            continuar

        // Paso 2: generación de ocasión
        si rng.bernoulli(ratio(rAtt.attack, rDef.defense, THETA)) == falso:
            eventos.push(evento("construccion_fallida", minuto, atacante, defensor))
            continuar

        rematador = elegirRematador(atacante.FWD, rng)
        asistente = elegirAsistente(atacante.MID + atacante.FWD, rng)

        // Paso 3: definición
        si rng.bernoulli(ratio(rematador.shooting, rDef.gk, THETA)):
            si lado == "A": golesA += 1  si no: golesB += 1
            eventos.push(evento("gol", minuto, atacante, rematador, asistente, golesA, golesB))
        si no:
            eventos.push(evento("parada", minuto, atacante, rematador, defensor.GK))

    devolver { golesA, golesB, eventos: ordenarPorMinuto(eventos) }
```

Notas de implementación:
- `ratio(a, b, t) = a^t / (a^t + b^t)`.
- `rng` debe ser **un generador con semilla** (para poder reproducir partidos y depurar). Guardar la semilla en el estado de la run.
- `elegirRematador` y `elegirAsistente`: selección ponderada por atributos. Aplicar rasgos aquí (p. ej. *Francotirador* multiplica el peso/`shooting` del jugador).
- Opcional: tras una pérdida, con probabilidad `COUNTER_CHANCE`, inyectar una jugada extra de contraataque para el defensor.

### 6.6 Parámetros de balance (exponer todos como constantes)

```
THETA            = 1.6     // dominio del rating vs suerte
BASE_SEQUENCES   = 22      // jugadas de ataque totales por partido
COUNTER_CHANCE   = 0.20    // prob. de contraataque tras pérdida (opcional)

LIVES            = 1       // 1 = perder termina la run; 3 = sistema de vidas

// Escalado de dificultad del rival (modo procedural)
OPP_BASE_OVR     = 58      // fuerza objetivo del rival en nivel 1
OPP_GROWTH       = 1.8     // incremento de OVR por nivel
OPP_VARIANCE     = 4       // dispersión de líneas alrededor del OVR objetivo

// Química
CHEM_NATION      = 2       // bonus por par de misma nación en una línea
CHEM_ERA         = 1       // bonus por par de misma época en una línea
CHEM_CAP         = 10      // tope de química por línea

// Tipos tácticos (mejora futura)
TYPE_BONUS       = 0.10    // +10% si tu tipo cuenta el del rival

// Recompensas (tamaño de sobre por resultado)
PACK_GOLEADA     = 5       // dif >= 5
PACK_AMPLIA      = 4       // dif 3-4
PACK_AJUSTADA    = 3       // dif 1-2
PACK_EMPATE      = 2
ITEM_PACK_BASE   = 3       // objetos a elegir; +1 en goleada
```

`targetOVR(level) = OPP_BASE_OVR + (level - 1) * OPP_GROWTH`. Las cuatro líneas del rival se sortean alrededor de ese valor con dispersión `OPP_VARIANCE`.

---

## 7. Datos necesarios

### 7.1 Dataset de jugadores

Se necesita un catálogo de cartas de jugador (JSON, esquema §5.1). Recomendación para arrancar: **40–80 jugadores** repartidos por posición y rareza, suficientes para que los sobres se sientan variados. Ampliable después.

- Cubrir las cuatro posiciones con varias rarezas cada una.
- Asignar nación y época para que la química funcione.
- Los atributos pueden definirse a mano o generarse por plantilla según rareza (p. ej. `legend` → atributos clave 88–99, `common` → 55–72).

### 7.2 Selecciones rivales

- **MVP (procedural):** no requiere dataset; basta con un generador a partir de `targetOVR` + una lista de nombres/colores genéricos.
- **Mejora (curado):** lista de selecciones con su fuerza/tier por nivel.

### 7.3 Nota legal y de assets (importante)

- Los **nombres reales de futbolistas y sus datos** (posición, atributos como hechos) pueden usarse; los nombres y datos fácticos no son objeto de copyright.
- **Evitar** logos oficiales de federaciones/clubes, escudos, equipaciones oficiales, fotografías y nombres/marcas registradas de torneos. Para el torneo, usar un nombre genérico o inventado (p. ej. "Copa de Leyendas", "Mundial de Leyendas") en lugar de marcas registradas.
- El **arte** (cartas, fondos, iconos) debe ser original, generado, o de bibliotecas con licencia libre. No copiar sprites/fotos de terceros.
- Incluir un descargo de "proyecto no oficial / no afiliado" en el pie, como hacen los juegos de referencia.

---

## 8. Pantallas / UI

1. **Inicio / Menú:** botón "Nueva run", mejor puntuación, ajustes (dificultad, formación inicial, modo vidas).
2. **Apertura de sobre de jugador:** X cartas boca arriba con todos sus datos; el jugador elige 1. Animación de "abrir sobre".
3. **Apertura de sobre de objeto:** X objetos con su efecto descrito; elige 1.
4. **Armar equipo:** vista de la formación con huecos por línea; arrastrar/soltar o tocar para colocar a los 11; panel de objetos activos; indicador de **química** y de **ratings de equipo** (ataque/medio/defensa/portero) que se actualiza en vivo. Botón "Jugar".
5. **Partido (simulación):** cabecera con ambos equipos y marcador; **registro de jugadas** que aparece progresivamente (minuto + texto narrado + iconos de gol/parada); al terminar, marcador final destacado.
6. **Resultado:** marcador, resumen (goleadores, paradas clave), recompensa obtenida; botón "Siguiente nivel" (o "Fin de run" si perdiste).
7. **Fin de run / Resumen:** nivel alcanzado (= puntuación), recorrido de resultados, plantilla final; botón "Jugar de nuevo" y "Compartir".

Indicadores que el jugador siempre debe ver al decidir: **ratings de equipo**, **química**, y en cada carta **posición, atributos, rareza, nación, época y rasgo**. (Coherente con el pilar "lectura total de la información".)

---

## 9. Arquitectura técnica y estructura de archivos

### 9.1 Recomendación de stack

- **MVP:** un único archivo `index.html` autocontenido con CSS embebido y JavaScript (vanilla). Sin paso de build, sin backend, estado en memoria. Es lo más sencillo y portable de producir y ejecutar en el navegador.
- **Persistencia opcional:** `localStorage` solo para la **mejor puntuación** y, más adelante, el álmanaque. (No es necesaria para el bucle central, que es por run.)
- **Escalado posterior (opcional):** migrar a React + Vite si la UI crece, separando componentes por pantalla.

### 9.2 Estructura modular sugerida (lógica desacoplada de la UI)

```
/data
  players.js        // catálogo de cartas de jugador
  items.js          // catálogo de objetos
  opponents.js      // generador o lista de rivales
  config.js         // constantes de balance (§6.6)
/engine
  rng.js            // generador aleatorio con semilla
  teamRatings.js    // atributos -> ratings de equipo (§6.1)
  chemistry.js      // cálculo de química (§4.7)
  items.js          // aplicación de efectos de objetos (§4.2)
  simulate.js       // simulación del partido (§6.5)
  narrator.js       // plantillas de jugadas (§6.4)
  rewards.js        // tabla de recompensas por resultado (§4.6)
/state
  run.js            // estado de la run, avanzar de nivel, fin de run
/ui
  packScreen.js
  buildScreen.js
  matchScreen.js
  resultScreen.js
main.js             // orquesta el bucle (§3)
```

> Clave: **el motor (`/engine`) debe ser pura lógica testeable**, independiente de la UI. Debe poder ejecutarse en consola: dadas dos plantillas, devolver `{golesA, golesB, eventos}`. Eso permite balancear y testear sin tocar la interfaz.

---

## 10. Plan de implementación por fases

### Fase 0 — Datos y contratos
- Definir esquemas (jugador, objeto, rival, estado de run) y `config.js`.
- Crear un dataset mínimo de jugadores (≈30–40) y el generador procedural de rivales.
- **Entregable:** archivos de datos y tipos/esquemas validados.

### Fase 1 — Motor jugable en consola (sin UI)
- `rng` con semilla, `teamRatings`, `simulate`, `narrator` (texto), `rewards`.
- **Entregable:** función `simularPartido(A, B, seed)` que imprime jugadas y marcador en consola. Comprobar la cordura de §6.3 (fuerte vs flojo ≈ 4-0/5-1 con varianza).

### Fase 2 — Bucle mínimo con UI (texto/simple)
- Pantallas: sobre de jugador → sobre de objeto → armar equipo → partido (registro en texto) → resultado → siguiente nivel.
- Estado de run completo, escalado de rival por nivel, recompensa por resultado, fin de run al perder.
- **Entregable:** juego completo y jugable de principio a fin, aunque feo.

### Fase 3 — Visualización del partido y pulido
- Aparición progresiva/animada de las jugadas, iconos de gol/parada, marcador en vivo.
- Pantalla de armar equipo con arrastrar/soltar, ratings y química en vivo.
- Diseño visual de cartas y sobres, transiciones.
- **Entregable:** experiencia atractiva y clara.

### Fase 4 — Mejoras (stretch)
- Química avanzada y rasgos especiales con efecto en la simulación.
- **Tipos tácticos** (piedra-papel-tijera) con aviso del rival siguiente.
- **Reliquias** acumulables y **pisos jefe** cada 5 niveles (selección legendaria con regla especial).
- **Álmanaque/colección** persistente (meta-progresión entre runs) y **leaderboard** de mejor nivel.
- Modo **Nuzlocke** (lesiones permanentes) y consumibles de recuperación.

---

## 11. Criterios de aceptación

El juego se considera correctamente implementado si:

1. **Nunca** se le pide al jugador recordar ni escribir nada; toda adquisición es elegir 1 entre X cartas mostradas con su información completa.
2. Al empezar una run, el jugador recibe una formación con jugadores aleatorios.
3. En cada nivel: se abre un sobre de jugador y uno de objeto, el jugador elige uno de cada, arma su once y simula.
4. La simulación calcula el partido **jugada a jugada**, intervienen jugadores concretos, y el resultado de cada jugada depende de sus atributos contra los del rival.
5. Las jugadas se **muestran** (registro narrado) y el partido termina en un **marcador**.
6. La recompensa (tamaño/calidad del sobre) **escala con el margen** del resultado.
7. Tras el partido se pasa a un **nivel superior con un rival un poco más fuerte**; perder termina la run (o consume vida según `LIVES`).
8. El motor es **determinista dada una semilla** (mismo input + misma semilla → mismo partido).
9. Marcadores en rangos realistas (la mayoría de partidos en dígitos bajos), con goleadas y sorpresas ocasionales.
10. Todas las constantes de balance de §6.6 están centralizadas y son fáciles de ajustar.

---

## 12. Resumen para quien implemente

Construye un roguelike de fútbol en el navegador, sin backend, con el estado en memoria. El jugador escala una torre infinita: en cada nivel abre dos sobres (jugador y objeto), elige una carta de cada (siempre eligiendo entre varias, nunca de memoria), arma su formación y simula un partido contra una selección rival cuya fuerza crece con el nivel. La simulación reparte jugadas de ataque por posesión y resuelve cada jugada con un embudo de tres pasos (construcción → ocasión → definición) usando la fórmula `p = A^THETA/(A^THETA+B^THETA)` sobre los ratings derivados de los atributos de los jugadores implicados; genera un registro de jugadas narradas y un marcador. Según el margen, el jugador recibe un sobre mejor o peor y sube de nivel; si pierde, la run termina y la puntuación es el nivel alcanzado. Empieza por el motor en consola (Fase 1), luego el bucle con UI mínima (Fase 2) y después el pulido visual (Fase 3).
