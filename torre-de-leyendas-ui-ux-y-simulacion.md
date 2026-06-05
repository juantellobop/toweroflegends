# Torre de Leyendas — Plan de UI/UX y simulación gráfica

> Segunda fase. El motor de juego ya está implementado. Este documento define (1) un sistema de diseño con estética de app nativa de Apple (lenguaje **Liquid Glass**, iOS 26) y (2) una **simulación gráfica del partido** inspirada en Football Manager y Hattrick, montada encima del motor de eventos existente. Está escrito para que una IA lo implemente.

---

## 0. Alcance y supuesto de plataforma

- **Qué se construye:** la capa de presentación. El motor (ratings, simulación de eventos, recompensas) **no se toca**; solo se consume su salida.
- **Plataforma:** se asume **app web** (coherente con la implementación actual). Todo lo de Apple se reproduce *en web* con CSS/SVG. Donde un efecto nativo no sea reproducible al 100%, se aproxima y se indica.
- **Nota sobre nativo real:** si en el futuro se porta a iOS nativo, hacerlo en **SwiftUI** da Liquid Glass "gratis" (materiales, concentricidad y háptica del sistema). Este plan apunta a web, pero los tokens y patrones están elegidos para que ese salto sea directo.

---

## 1. Principios de la línea Apple que adoptamos (Liquid Glass / iOS 26)

Cuatro ideas rectoras, tomadas del lenguaje actual de Apple:

1. **Jerarquía por profundidad.** La importancia se comunica con transparencia, refracción y capas, no solo con color o tamaño. Controles y navegación *se elevan* por encima del contenido.
2. **El cristal va en la capa de navegación, no en el contenido.** Liquid Glass se reserva para barras, botones flotantes y hojas que flotan sobre el contenido; **las listas y el contenido se mantienen limpios y legibles**. (Error a evitar: poner cristal en todo.)
3. **Concentricidad.** Los radios de las esquinas se anidan de forma concéntrica (el radio del hijo = radio del padre − padding) y dialogan con la forma del hardware.
4. **Deferencia al contenido + deleite.** Tipografía clara y alineada a la izquierda, espacio generoso, movimiento por muelles (springs) sutil y con propósito, y momentos de deleite (abrir un sobre, marcar un gol) con feedback háptico.

En web, el cristal se aproxima con `backdrop-filter: blur()+saturate()`, translucidez, borde de un píxel (hairline) y un reflejo especular superior con gradiente. La refracción/lensing en tiempo real no es reproducible en web; nos quedamos con el *look* y, opcionalmente, un desplazamiento del reflejo según la orientación del dispositivo.

---

## 2. Sistema de diseño (design tokens)

Esto es la base: el implementador debe crear estos tokens primero y construir todo a partir de ellos. Se dan como variables CSS, con set claro y oscuro.

### 2.1 Color (semántico, claro/oscuro)

Paleta del sistema iOS más un acento temático de fútbol (verde césped + azul del sistema).

```css
:root {
  /* Fondos (contenido limpio, sin cristal) */
  --bg-primary:    #FFFFFF;
  --bg-secondary:  #F2F2F7;
  --bg-tertiary:   #FFFFFF;
  --bg-grouped:    #F2F2F7;

  /* Texto / etiquetas */
  --label-primary:   rgba(0,0,0,1);
  --label-secondary: rgba(60,60,67,0.60);
  --label-tertiary:  rgba(60,60,67,0.30);
  --separator:       rgba(60,60,67,0.29);
  --fill-secondary:  rgba(120,120,128,0.16);

  /* Acentos del sistema */
  --accent:        #007AFF;   /* systemBlue */
  --success:       #34C759;   /* systemGreen */
  --danger:        #FF3B30;   /* systemRed   */
  --warning:       #FF9500;   /* systemOrange*/

  /* Tema fútbol */
  --pitch:         #2E9E5B;   /* césped */
  --pitch-line:    rgba(255,255,255,0.85);

  /* Rarezas de carta */
  --rarity-common: #8E8E93;
  --rarity-rare:   #0A84FF;
  --rarity-epic:   #BF5AF2;
  --rarity-legend: #FFD60A;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary:    #000000;
    --bg-secondary:  #1C1C1E;
    --bg-tertiary:   #2C2C2E;
    --bg-grouped:    #000000;
    --label-primary:   rgba(255,255,255,1);
    --label-secondary: rgba(235,235,245,0.60);
    --label-tertiary:  rgba(235,235,245,0.30);
    --separator:       rgba(84,84,88,0.60);
    --fill-secondary:  rgba(120,120,128,0.36);
    --accent:        #0A84FF;
    --success:       #30D158;
    --danger:        #FF453A;
    --warning:       #FF9F0A;
  }
}
```

Regla: el color de marca se usa con moderación; un solo acento dominante, el resto neutros. **Soporte de modo oscuro obligatorio** (parte de sentirse nativo).

### 2.2 Material de cristal (Liquid Glass aproximado)

Tres densidades. Usar **solo** en barras, botones flotantes, hojas y el marcador del partido.

```css
.glass {                      /* regular — uso general en navegación */
  background: rgba(255,255,255,0.55);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 0.5px solid rgba(255,255,255,0.30);   /* hairline */
  box-shadow: 0 1px 0 rgba(255,255,255,0.45) inset,  /* reflejo especular sup. */
              0 10px 30px rgba(0,0,0,0.12);
}
.glass-thin  { background: rgba(255,255,255,0.35); backdrop-filter: blur(12px) saturate(160%); }
.glass-thick { background: rgba(255,255,255,0.75); backdrop-filter: blur(30px) saturate(180%); }

@media (prefers-color-scheme: dark) {
  .glass       { background: rgba(28,28,30,0.55); border-color: rgba(255,255,255,0.12); }
  .glass-thin  { background: rgba(28,28,30,0.35); }
  .glass-thick { background: rgba(28,28,30,0.78); }
}
```

Opcional (deleite): leer `DeviceOrientationEvent` para desplazar levemente el gradiente del reflejo según incline el móvil. Degradar con elegancia si no hay permiso/soporte.

### 2.3 Tipografía

Pila de fuentes que usa **SF Pro de forma nativa** en dispositivos Apple, con respaldo en el resto:

```css
--font-text: -apple-system, "SF Pro Text", system-ui, "Inter", sans-serif;
--font-display: -apple-system, "SF Pro Display", system-ui, "Inter", sans-serif;
--font-rounded: "SF Pro Rounded", ui-rounded, "Nunito", sans-serif; /* marcadores/dorsales */
```

Escala tipográfica de iOS (px / peso / interlineado aproximado). Usarla tal cual:

| Estilo        | Tamaño | Peso        | Uso |
|---------------|--------|-------------|-----|
| Large Title   | 34     | Bold (700)  | Título de pantalla (colapsa al hacer scroll) |
| Title 1       | 28     | Bold        | Marcador, encabezados grandes |
| Title 2       | 22     | Bold        | Secciones |
| Title 3       | 20     | Semibold(600)| Subsecciones |
| Headline      | 17     | Semibold    | Cabecera de fila / nombre de jugador destacado |
| Body          | 17     | Regular(400)| Texto base, comentarios del partido |
| Callout       | 16     | Regular     | Texto secundario |
| Subheadline   | 15     | Regular     | Metadatos de carta |
| Footnote      | 13     | Regular     | Notas |
| Caption 1/2   | 12 / 11| Regular     | Etiquetas pequeñas, rareza |

- **Numerales tabulares** (`font-variant-numeric: tabular-nums`) en marcador, reloj y ratings, para que no "bailen".
- Marcador y dorsales en `--font-rounded` para el toque deportivo-Apple.
- Soporte de **Dynamic Type**: definir tamaños en `rem` ligados a una raíz escalable y respetar el ajuste del usuario.
- *Licencia de fuente:* SF Pro es gratuita de Apple pero su EULA restringe el uso al diseño para plataformas Apple. En web, `-apple-system` la usa de forma nativa en Apple sin redistribuirla; en otros sistemas cae a Inter. No empaquetar SF Pro como webfont.

### 2.4 Espaciado y rejilla

Rejilla de 8 pt (con sub-incrementos de 4):

```css
--space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
--space-5: 20px; --space-6: 24px; --space-7: 32px; --space-8: 40px;
--screen-margin: 16px;        /* 20px en pantallas grandes */
--touch-min: 44px;            /* objetivo táctil mínimo */
```

Respetar **safe areas** (`env(safe-area-inset-*)`) para notch/Dynamic Island y la barra inferior.

### 2.5 Forma y radios (concéntricos)

```css
--radius-s: 10px; --radius-m: 16px; --radius-l: 20px; --radius-xl: 28px; --radius-pill: 999px;
```

- Esquinas **continuas (squircle)**. En CSS basta `border-radius` para aproximar; para squircle real usar `clip-path`/SVG o `corner-shape: superellipse` donde esté disponible.
- **Concentricidad:** radio del elemento anidado = radio del contenedor − su padding. (P. ej. tarjeta `--radius-l` con 12px de padding → el contenido interior usa ~8–10px.)

### 2.6 Elevación / sombras

Sombras suaves, de baja opacidad, en capas. La profundidad la da sobre todo el cristal y el desenfoque del fondo, no sombras duras.

```css
--shadow-1: 0 1px 2px rgba(0,0,0,0.06);
--shadow-2: 0 4px 12px rgba(0,0,0,0.10);
--shadow-3: 0 10px 30px rgba(0,0,0,0.14);   /* hojas y modales */
```

### 2.7 Movimiento

iOS se mueve con **muelles**, no con curvas lineales. Tokens:

```css
--ease-standard: cubic-bezier(0.32, 0.72, 0, 1);   /* aproxima un spring Apple */
--ease-emphasis: cubic-bezier(0.2, 0.9, 0.1, 1);
--dur-fast: 200ms; --dur-base: 320ms; --dur-slow: 480ms;
```

- En React, preferir **springs reales** (Framer Motion `type:"spring"`), no duraciones fijas, para transiciones de hoja/carta.
- **Respetar `prefers-reduced-motion`:** sustituir traslados/escala por fundidos simples.

### 2.8 Iconografía

- En **nativo (SwiftUI)**: usar SF Symbols directamente.
- En **web**: SF Symbols no se puede redistribuir como fuente. Usar un set abierto de estilo afín (Lucide o Phosphor) con grosor y métrica parecidos, o SVGs propios. Mantener consistencia de peso con el texto.
- Símbolos de partido recomendados (o equivalentes): balón (gol), mano alzada (parada), flechas de cambio, escudo (defensa), banderín (córner), tarjeta.

### 2.9 Háptica

- En web la háptica es limitada (`navigator.vibrate` no funciona en Safari iOS). Implementar como **mejora progresiva**: vibración corta en gol/apertura de carta donde haya soporte; silencio donde no.
- En nativo, mapear a `UIImpactFeedbackGenerator` (impacto medio en gol, ligero al elegir carta, éxito al subir de nivel).

---

## 3. Catálogo de componentes (estilo Apple, en web)

Construir una librería pequeña y reutilizable. Cada componente, su patrón Apple y cómo se hace en web:

- **Barra de navegación con título grande.** Título *Large Title* que **colapsa a título centrado al hacer scroll**. Fondo `.glass` que aparece al desplazar. Botones de acción a los lados.
- **Tab bar inferior (cristal flotante).** Barra `.glass` con 3–5 destinos (p. ej. Jugar, Plantilla, Colección, Ajustes), íconos + etiqueta, indicador de selección con acento. Flota sobre el contenido respetando safe area.
- **Botón principal (filled).** Pastilla (`--radius-pill`), fondo de acento, texto semibold, alto ≥ 44px, presión con escala 0.97 + spring. Variante de cristal para acciones flotantes sobre contenido.
- **Segmented control.** Para alternar (p. ej. modos de visualización del partido, o formación). Píldora con fondo `--fill-secondary` y "pastilla" deslizante seleccionada.
- **Lista agrupada con inserción (inset grouped).** Bloques con fondo `--bg-tertiary`, esquinas redondeadas, filas con separadores hairline que respetan el sangrado. Contenido **limpio, sin cristal**. Para plantilla, ajustes, resúmenes.
- **Tarjeta de jugador.** El componente estrella (ver §4.2). Cara con franja de color de rareza, dorsal/posición, nombre (*Headline*), atributos (barras o números *tabular*), nación + época, rasgo.
- **Hoja modal (sheet) con asa (grabber).** Sube desde abajo con spring, fondo `.glass-thick`, asa superior, detentes (medio/expandido), cierre por arrastre. Para apertura de sobres y detalle de carta.
- **Tarjeta tipo Live Activity.** Para el marcador del partido: cápsula de cristal compacta con escudos/colores, marcador y reloj. (Estética Dynamic Island / Live Activity.)
- **Badge de rareza / etiqueta.** Cápsula pequeña con color de rareza.
- **Toast / banner.** Aviso efímero de cristal (p. ej. "¡Carta épica obtenida!").

---

## 4. Rediseño pantalla por pantalla

Aplicando el sistema. Para cada una: estructura, componentes, patrón Apple y momentos de movimiento.

### 4.1 Menú / Inicio
- *Large Title* "Torre de Leyendas". Tarjeta destacada con botón principal **Nueva run** y, si hay run guardada, **Continuar**.
- Fila de stats: mejor nivel alcanzado, rachas. Lista inset.
- Tab bar inferior de cristal.

### 4.2 Apertura de sobre de jugador / objeto
- Se presenta como **hoja modal de cristal** que sube con spring.
- Las X cartas entran escalonadas (*stagger*), boca abajo, y se voltean con animación 3D (`rotateY`) al aparecer, con leve háptica por carta.
- Cada **tarjeta de jugador** muestra todo lo necesario para decidir (pilar "lectura total"): posición, atributos (barras finas con color), rareza (franja + badge), nación, época, rasgo.
- Al tocar una carta: se eleva, las demás se atenúan y retroceden; botón **Elegir** (principal). Confirmar → la carta "vuela" a la plantilla.
- Sobre de objeto: misma mecánica, tarjeta más simple con el efecto descrito en lenguaje claro.

### 4.3 Armar equipo
- **Cabecera de cristal fija** con los cuatro ratings de equipo (ATA / MED / DEF / POR) y la **química**, en numerales tabulares, que se **actualizan en vivo** al mover jugadores. Pequeña animación de conteo al cambiar.
- Cuerpo: vista de **campo en SVG** con huecos por línea según la formación; arrastrar/soltar fichas o tocar hueco → abre selector. Suplentes en una tira inferior.
- Segmented control para cambiar de formación (si hay jugadores).
- Indicadores de enlace de química (líneas sutiles entre jugadores que comparten nación/época).
- Botón principal **Jugar** flotante (cristal) abajo.

### 4.4 Partido (simulación gráfica)
Es la pantalla grande; se detalla en §5.

### 4.5 Resultado
- Marcador grande (*Title 1*, rounded). Resumen en lista inset: goleadores, paradas clave, posesión.
- Tarjeta de **recompensa** según el margen (con el guiño al 7-0: si es goleada, celebración extra + confeti sobrio + háptica de éxito).
- Botón principal **Siguiente nivel** (o estado de fin de run).

### 4.6 Fin de run
- *Large Title* con el nivel alcanzado (= puntuación). Recorrido de resultados (timeline), plantilla final, botones **Jugar de nuevo** y **Compartir** (genera tarjeta de resumen).

---

## 5. Simulación gráfica del partido (la pieza central)

Inspiración: el **motor 2D de "puntos" de Football Manager** (vista cenital, fichas que se mueven, modo *highlights*) y el **visor por eventos con comentario y valoraciones de Hattrick**. No buscamos un simulador físico continuo: buscamos **highlights dirigidos por eventos**, que es exactamente lo que el motor actual ya produce.

### 5.1 Filosofía: highlights dirigidos por eventos
El motor ya devuelve `{ golesA, golesB, eventos[] }`, donde cada evento tiene minuto, tipo (pérdida / construcción fallida / ocasión / parada / gol / contraataque) y los jugadores implicados. La capa visual **no recalcula nada**: toma ese array y lo *reproduce en el tiempo* como una secuencia de jugadas animadas con comentario, igual que FM reproduce sus highlights. Esto es tratable, fiel al motor y reproducible (misma semilla → mismo partido → misma reproducción).

### 5.2 Anatomía de la pantalla de partido
Tres capas, de arriba abajo:

1. **Marcador tipo Live Activity (cristal, fijo arri).** Colores/escudos de ambos equipos, marcador (rounded, tabular), reloj de partido que avanza, y una **barra de momentum/posesión** fina (proporción que ya da el motor).
2. **Campo 2D (centro, el protagonista).** Vista cenital en SVG (ver §5.4). Ocupa la mayor parte de la pantalla. La "cámara" puede hacer un leve paneo/zoom hacia la zona de la jugada (opcional, estilo FM).
3. **Ticker de comentario (cristal, abajo) + controles.** Línea de comentario actual destacada (Hattrick-style) y, debajo, controles flotantes de cristal: **play/pausa, velocidad (1×/2×/4×), saltar al siguiente highlight, saltar al final**. Segmented control para **modo de visualización**.

### 5.3 El "director" de reproducción (pieza clave de implementación)
Un módulo `matchDirector` consume `eventos[]` y orquesta en el tiempo, sincronizando tres cosas por evento: **animación en el campo + revelado de comentario + actualización de marcador**.

```
matchDirector(eventos, opciones):
  reloj = 0
  velocidad = opciones.velocidad        // 1, 2, 4
  para cada evento en eventos (ordenados por minuto):
    avanzar reloj visual hasta evento.minuto (acelerar el hueco entre highlights)
    coreo = coreografiaPara(evento.tipo) // duración + pasos de animación
    en paralelo:
        - animarCampo(coreo, evento.jugadores)      // mover balón/fichas
        - mostrarComentario(plantilla(evento))       // texto Hattrick-style
        - si evento.tipo == "gol": actualizarMarcador(); resaltar; háptica; (confeti sutil)
    esperar(coreo.duracion / velocidad)
  fin → fijar marcador final, habilitar "Continuar"
```

- **Modos de visualización (como FM):**
  - *Highlights completos* — anima todas las jugadas relevantes.
  - *Solo highlights clave* — solo ocasiones claras, paradas y goles.
  - *Solo comentario* — sin campo animado; el ticker corre rápido (estilo Hattrick clásico).
  - *Resultado instantáneo* — salta directo al marcador (botón "saltar al final").
- **Pausa/velocidad/saltar** actúan sobre el bucle del director (no recalculan el partido).
- **Reduce motion:** forzar modo "solo comentario" o transiciones por fundido.

### 5.4 Render del campo 2D (SVG)
- **Campo** en SVG: rectángulo `--pitch` con líneas `--pitch-line` (centro, áreas, círculo central). Limpio y plano, estética Apple (sin texturas recargadas).
- **Fichas de jugador:** círculos con color de equipo, dorsal en `--font-rounded`, borde hairline. Se colocan por **líneas de la formación** en cada mitad del campo (no necesitan posiciones tácticas reales; basta una disposición coherente por línea).
- **Balón:** círculo blanco pequeño que viaja a lo largo de la **cadena de jugadores implicados** del evento (p. ej. asistente → rematador → portería/portero).
- **Animación:** transformar posición de balón/fichas con springs (Framer Motion) o Web Animations API. Solo se animan las fichas implicadas en la jugada; el resto reacciona sutilmente (ligero reposicionamiento), no hay simulación continua de los 22.
- **Paneo/zoom de cámara (opcional):** un `<g>` contenedor que se traslada/escala suavemente hacia la zona del balón durante un highlight, devolviendo al plano general entre jugadas.
- **Perf:** SVG + transforms es suficiente para esta densidad. Si se quisiera continuidad de los 22 jugadores en el futuro, migrar a Canvas/WebGL.

### 5.5 Mapa de coreografías por tipo de evento
Cada tipo de evento del motor se traduce a una mini-animación + plantilla de comentario. Banco inicial (ampliable):

| Evento (del motor)     | Coreografía en el campo | Comentario (Hattrick-style) | Dur. aprox. |
|------------------------|-------------------------|-----------------------------|-------------|
| Construcción / posesión| Balón circula entre fichas de medio | "{medio} mueve el balón en el círculo central." | 1.5 s |
| Pérdida (turnover)     | Ficha rival intercepta; balón cambia de color/lado | "¡{rivalMedio} corta la jugada de {medio}!" | 1.2 s |
| Construcción fallida   | Balón avanza y la defensa achica; vuelve atrás | "{medio} busca el pase pero la defensa de {rival} cierra." | 1.3 s |
| Ocasión (chance)       | Balón llega al rematador en zona de ataque; amago de remate | "¡{asistente} habilita a {rematador} en el área!" | 1.8 s |
| Parada (save)          | Remate hacia portería; ficha de portero la detiene; destello | "¡{rematador} remata y {portero} responde con una GRAN parada!" | 2.0 s |
| Gol                    | Remate a la red; red se mueve; fichas celebran; marcador sube | "¡{asistente} la pone, {rematador}…! ¡GOOOL! {equipo} se pone {parcial}." | 2.8 s |
| Contraataque (opcional)| Transición rápida campo a campo del rival | "¡Contra rápida de {rival}!" | 1.6 s |

Reglas: rellenar `{nombres}` con los jugadores que ya trae el evento. En *highlights clave* se omiten construcción y pérdidas menores. El gol siempre se muestra con su celebración y feedback.

### 5.6 Feedback en momentos clave
- **Gol:** subida del marcador con animación de conteo, breve resalte del equipo que marca, confeti sobrio en su color (respetando reduce-motion), háptica de impacto (donde haya soporte), sonido corto opcional (silenciable).
- **Parada:** destello sutil en la portería + énfasis del comentario.
- **Fin del partido:** transición con spring a la pantalla de Resultado.

### 5.7 Accesibilidad de la simulación
- Modo **solo comentario** sirve también como experiencia accesible/baja-distracción.
- El ticker de comentario debe ser texto real (no solo imagen) y anunciarse a lectores de pantalla (ARIA live region) para los eventos clave (goles).
- Respetar `prefers-reduced-motion` y permitir **silenciar** sonido/háptica.

---

## 6. Arquitectura de implementación

### 6.1 Separación de capas
- **Motor** (ya existe): pura lógica → produce `{ golesA, golesB, eventos[] }`.
- **Director de partido** (`matchDirector`): consume eventos y orquesta el tiempo (§5.3). Independiente del render.
- **Render**: componentes de campo (SVG), marcador (Live Activity), ticker y controles, que el director controla.
- **Sistema de diseño**: tokens (§2) + librería de componentes (§3), usados por todas las pantallas.

### 6.2 Stack recomendado
- **Web con React + Framer Motion + SVG** para el campo y las transiciones (springs reales, gestos de hoja, layout animations). Es lo que mejor reproduce el movimiento de iOS en web.
- Alternativa sin framework: **vanilla JS + Web Animations API + SVG**, si se quiere mantener un único archivo sin build.
- Estructura sugerida (añadida a la existente):

```
/design
  tokens.css            // §2: color, glass, tipografía, espaciado, radios, motion
  components/           // §3: NavBar, TabBar, Button, Segmented, ListInset,
                        //      PlayerCard, Sheet, ScoreboardLiveActivity, Badge, Toast
/match
  director.js           // §5.3: orquesta eventos en el tiempo (play/pause/velocidad/modos)
  choreography.js       // §5.5: mapa evento -> animación + plantilla de comentario
  pitch/                // §5.4: render SVG del campo, fichas, balón, cámara
  scoreboard/           // §5.2: marcador Live Activity + barra de momentum
  commentary/           // ticker de comentario (ARIA live)
  controls/             // play/pausa/velocidad/saltar + segmented de modos
/screens
  Menu, PackOpening, TeamBuilder, Match, Result, RunOver
```

### 6.3 Rendimiento
- Animar con `transform`/`opacity` (compuestas por GPU); evitar animar layout.
- `backdrop-filter` es costoso: limitarlo a barras/hojas/marcador, no a muchos elementos a la vez (coherente además con "cristal solo en navegación").
- Reusar nodos de fichas; no recrear el SVG en cada evento.

---

## 7. Plan por fases

### Fase A — Fundamentos de diseño
- Implementar `tokens.css` (§2) con modo claro/oscuro y el material de cristal.
- **Entregable:** una página de muestra que enseñe tokens, tipografía y los tres cristales.

### Fase B — Librería de componentes
- Construir los componentes de §3 (nav bar con título grande, tab bar de cristal, botón, segmented, lista inset, tarjeta de jugador, hoja con asa, marcador Live Activity, badge, toast).
- **Entregable:** catálogo navegable de componentes (storybook o página única).

### Fase C — Rediseño de pantallas (sin partido)
- Aplicar el sistema a Menú, Apertura de sobres, Armar equipo, Resultado, Fin de run (§4), con sus animaciones (stagger, volteo de cartas, ratings en vivo).
- **Entregable:** flujo completo rediseñado salvo el partido.

### Fase D — Simulación gráfica del partido (la grande)
- **D1 Render de campo:** SVG con fichas por línea y balón; colocación según formación.
- **D2 Director + coreografías:** `matchDirector` reproduce `eventos[]`; mapa de coreografías (§5.5); sincronía animación↔comentario↔marcador.
- **D3 Marcador y ticker:** marcador Live Activity con reloj y barra de momentum; ticker de comentario (ARIA live).
- **D4 Controles y modos:** play/pausa, velocidad, saltar highlight, saltar al final; segmented de modos (highlights completos / clave / solo comentario / instantáneo).
- **D5 Feedback:** gol (conteo, resalte, confeti sobrio, háptica/sonido opcional), parada, transición de fin.
- **Entregable:** partido jugable visualmente, fiel al motor, con todos los modos.

### Fase E — Movimiento, háptica, accesibilidad y rendimiento
- Pasar todo a springs coherentes; `prefers-reduced-motion`; háptica progresiva; ARIA y modo solo-comentario; pase de rendimiento (limitar blur, transforms GPU).
- **Entregable:** experiencia pulida, accesible y fluida.

---

## 8. Criterios de aceptación

**Estética Apple / UI**
1. Modo claro y oscuro completos; la app respeta la preferencia del sistema.
2. El **cristal aparece solo en la capa de navegación** (barras, botones flotantes, hojas, marcador); el contenido y las listas se mantienen limpios y legibles.
3. Tipografía en la escala de iOS, con SF Pro nativa en dispositivos Apple y respaldo en el resto; numerales tabulares en marcador/reloj/ratings.
4. Esquinas continuas y radios concéntricos; rejilla de 8 pt; objetivos táctiles ≥ 44 px; safe areas respetadas.
5. Transiciones por muelle, sutiles; se degradan con `prefers-reduced-motion`.
6. Título grande que colapsa al hacer scroll; tab bar de cristal flotante; hojas con asa y arrastre para cerrar.

**Simulación gráfica**
7. El partido se **reproduce a partir de los eventos del motor**, sin recalcular nada; misma semilla → misma reproducción.
8. Vista de campo 2D con fichas y balón que recorre la cadena de jugadores implicados en cada jugada.
9. Marcador tipo Live Activity con reloj y barra de momentum/posesión; ticker de comentario legible y anunciado a lectores de pantalla en los goles.
10. Controles funcionales de play/pausa, velocidad (1×/2×/4×), saltar highlight y saltar al final.
11. Cuatro modos de visualización (highlights completos / clave / solo comentario / resultado instantáneo).
12. Gol con feedback claro (conteo de marcador, resalte, confeti sobrio, háptica/sonido opcionales y silenciables).

---

## 9. Notas finales

- **Liquid Glass en web es una aproximación.** El reflejo/refracción en tiempo real del material de Apple no es reproducible en navegador; se logra el *look* con blur+saturate, translucidez, hairline y reflejo especular. Lo importante es respetar el **principio** (cristal solo en navegación, jerarquía por profundidad, concentricidad), no imitar el efecto físico exacto.
- **Marcas y assets.** No usar el nombre/efecto como si fuera un producto de Apple ni distribuir SF Pro/SF Symbols como recursos propios; en web, `-apple-system` + un set de iconos abierto afín. Mantener el descargo de "proyecto no oficial" y evitar escudos/marcas de federaciones reales (coherente con el documento de diseño previo).
- **Camino a nativo.** Si algún día se porta a iOS, SwiftUI entrega Liquid Glass, concentricidad y háptica del sistema de forma nativa; los tokens y patrones de este plan trasladan casi 1:1.
