# Herramienta de Retratos

Genera **avatares pixelart de cara** estilo Sega Mega Drive / Genesis a partir de
fotos de jugadores. El proceso esta estandarizado para que toda la serie sea
coherente:

1. **Detecta la cara** (MediaPipe FaceLandmarker) y la **alinea por los ojos**:
   todas quedan niveladas, centradas y mirando al mismo lado.
2. **Recorta un cuadrado de solo la cara** en una rejilla exacta (64x64 por
   defecto), conservando rasgos: forma y color del pelo, cejas, piel.
3. Recorta el fondo con `rembg`, compone sobre un **fondo plano**, cuantiza a
   **16 colores snapeados a la paleta de 9 bits de la Mega Drive** y dibuja un
   contorno de sprite.

Uso basico:

```bash
python3 -m pip install -r tools/requirements.txt
python3 tools/generate_player_portraits.py --limit 5
```

> La primera ejecucion descarga el modelo de `rembg` (~176 MB, en `~/.u2net/`) y
> el de landmarks faciales (~3.7 MB, en `~/.cache/torre-de-leyendas/`).

## Persistencia del admin

Para editar jugadores desde la app usa siempre el servidor local:

```bash
npm run serve
```

Define `ADMIN_PASSWORD` para una credencial estable:

```bash
ADMIN_USER=admin ADMIN_PASSWORD='cambia-esto' npm run serve
```

Si `ADMIN_PASSWORD` no esta definida, el servidor genera una contraseña temporal
y la imprime por consola al arrancar. No hay contraseña fija por defecto.

El panel admin reescribe directamente `data/players.js`. No hay overrides ni
otra capa intermedia: al guardar estadisticas cambia la base del roster
jugable. Al guardar una imagen, el servidor reemplaza literalmente
`assets/player-portraits/{id}.png` por el PNG convertido desde el admin.

Si el admin no puede escribir en disco, la UI no confirma el guardado.

## La foto de origen manda

El avatar conserva los rasgos de la **foto real**, asi que el resultado depende de
ella. Lo ideal es un **primer plano frontal y tranquilo** (cara despejada). Fotos
de accion, festejos (boca abierta) o con objetos delante (balon, copa) dan
avatares pobres aunque la deteccion funcione.

El buscador automatico toma la foto del articulo de Wikipedia, que suele ser
**reciente** y a veces de otra persona; la herramienta filtra por nacionalidad y
descarta homonimos/familiares (p. ej. "Maradona Jr."). Pero para una cara
concreta de epoca conviene fijarla a mano con `source` en los overrides (URL de
Commons o **ruta a un archivo local**). Las fotos libres de primer plano de
algunas leyendas son escasas; en esos casos pasa tu propia imagen por `source`.

## Parametros

Encuadre de cara:

- `--face-size` (64): lado del avatar en pixeles reales (rejilla NxN).
- `--eye-y` (0.47): altura de los ojos en el cuadro; **menor = mas aire arriba**
  (util para que entre todo el pelo).
- `--eye-dx` (0.28): separacion de ojos como fraccion del lado; **menor = cara
  mas pequena** (mas margen alrededor).
- `--no-mirror`: no normaliza la orientacion (no voltea las caras).
- `--no-face`: desactiva el modo cara y usa el encuadre vertical cabeza-y-hombros.

Color / estilo 16 bits:

- `--colors` (16), `--dither` (0; 0.5-1.0 = degradados tramados de Mega Drive),
  `--no-genesis`, `--outline` (`000034`), `--bg` (`009ac6`),
  `--saturation` (1.45), `--contrast` (1.14), `--scale` (6), `--model` (`u2net`),
  `--no-cutout`.

## Overrides manuales (`tools/portrait_overrides.json`)

Por nombre visible o `id` del jugador:

- `source`: URL o ruta local de la imagen de origen (prioridad sobre el buscador).
- `eye_y`, `eye_dx`, `face_size`, `no_mirror`, `no_face`: ajuste de encuadre por jugador.
- `bg_color`, `outline_color`, `no_outline`, `dither`, `saturation`, `contrast`: color.
- `crop` (`[izq,arr,der,ab]` en 0..1), `aspect`, `no_cutout`: solo modo `--no-face`.

Ejemplo:

```json
{
  "Carlos Valderrama": {
    "source": "https://upload.wikimedia.org/wikipedia/commons/9/99/Valderrama_Italia_90.jpg"
  },
  "Diego Maradona": {
    "source": "fotos/maradona_frontal_1986.jpg",
    "eye_y": 0.50
  }
}
```

Para batch grande usa `--sleep 2` o superior. La herramienta reusa
`.cache/player-portraits/raw/` para regenerar sin volver a consultar la red.

## Que jugadores procesa

La lista sale del **roster completo** del juego (`data/roster.js`): catalogo
curado + todos los jugadores de los rivales historicos, cada uno con su **id
unico**. El retrato se guarda como `assets/player-portraits/{id}.png`, asi que
el nombre de archivo coincide exactamente con lo que pide la UI y **nunca
colisiona** aunque dos jugadores compartan nombre.

- Sin flags: solo el catalogo curado (ids sin prefijo, 86 jugadores).
- Con `--include-opponents`: el roster entero (767), donde los jugadores
  derivados de rivales llevan id con prefijo `gen_` (p. ej. `gen_def_achraf-hakimi`).

La herramienta **salta** los retratos que ya existen; usa `--force` para
regenerarlos. Para "seguir agregando imagenes" basta volver a correr el comando:
solo procesara los que falten.

```bash
# Genera (o completa) los retratos de todo el roster sin golpear la API.
python3 tools/generate_player_portraits.py --include-opponents --sleep 2
```

## Salidas

- `assets/player-portraits/{id}.png` para **todos** los jugadores (catalogo y rivales).
- `.cache/player-portraits/raw/{id}.{ext}` para las imagenes originales descargadas.
- `assets/player-portraits/manifest.json` con fuente y licencia cuando Wikimedia la informa.
- `assets/player-portraits/REVIEW.md` con los retratos que conviene curar a mano.
