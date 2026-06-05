#!/usr/bin/env python3
"""
Genera retratos pixelart para jugadores de Torre de Leyendas.

El estilo pixela la foto real del jugador (no una plantilla sintetica): recorta
al sujeto con rembg, lo compone sobre un fondo plano arcade, realza el color con
mesura, reduce la paleta y escala con vecino mas cercano. El resultado conserva
la cara/pose reales y mantiene una serie visual coherente.

Fuente por defecto: Wikipedia/Wikimedia Commons. La herramienta guarda un
manifest con URL, pagina y licencia cuando la API la expone. No hace scraping
de buscadores ni ignora licencias de forma silenciosa.
"""

from __future__ import annotations

import os

# Silencia el ruido informativo de las librerias nativas (MediaPipe / glog /
# TensorFlow Lite / XNNPACK). NO son errores: son trazas de init. Hay que fijar
# estas variables ANTES de importar mediapipe para que surtan efecto.
os.environ.setdefault("GLOG_minloglevel", "2")        # glog: solo ERROR/FATAL
os.environ.setdefault("GLOG_logtostderr", "0")
os.environ.setdefault("TF_CPP_MIN_LOG_LEVEL", "3")    # TF Lite / XNNPACK: silencio
os.environ.setdefault("MEDIAPIPE_DISABLE_GPU", "0")

import argparse
import contextlib
import dataclasses
import json
import math
import re
import subprocess
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any


# Color de fondo plano por defecto (cian arcade, tomado de la referencia).
DEFAULT_BG = (0, 154, 198)


# Wikimedia exige un User-Agent que identifique la herramienta Y un contacto
# real (correo o URL); sin el, los servidores responden 429 con mas agresividad.
# Cambia el contacto si reutilizas este script.
USER_AGENT = "TorreDeLeyendasPortraitTool/0.1 (https://otzarreta.com; digital@otzarreta.com)"


@dataclasses.dataclass(frozen=True)
class Subject:
    key: str
    name: str
    nation: str
    era: str
    kind: str
    out_path: Path


@dataclasses.dataclass
class Candidate:
    image_url: str
    page_url: str | None = None
    file_title: str | None = None
    license_short: str | None = None
    license_url: str | None = None
    artist: str | None = None


def repo_root() -> Path:
    return Path(__file__).resolve().parents[1]


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    return text.replace("'", "").replace("’", "").lower().strip()


def slugify(text: str) -> str:
    text = normalize(text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-") or "jugador"


def parse_hex_color(value: str | None) -> tuple[int, int, int] | None:
    if not value:
        return None
    value = value.strip().lstrip("#")
    if len(value) != 6 or not re.fullmatch(r"[0-9a-fA-F]{6}", value):
        return None
    return (int(value[0:2], 16), int(value[2:4], 16), int(value[4:6], 16))


def load_game_data(root: Path) -> list[dict[str, Any]]:
    """Carga el ROSTER completo del juego (catálogo + rivales), ya con el id
    único por jugador. El retrato se guarda con ese id, de modo que el nombre
    de archivo coincide exactamente con lo que pide la UI y nunca colisiona."""
    script = """
      import { ROSTER } from './data/roster.js';
      console.log(JSON.stringify(ROSTER.map((p) => ({
        id: p.id,
        name: p.name,
        nation: p.nation,
        era: String(p.era ?? ''),
        position: p.position
      }))));
    """
    out = subprocess.check_output(
        ["node", "--input-type=module", "-e", script],
        cwd=root,
        text=True,
    )
    return json.loads(out)


def build_subjects(root: Path, include_opponents: bool, only_names: list[str]) -> list[Subject]:
    roster = load_game_data(root)
    out_dir = root / "assets" / "player-portraits"
    subjects: list[Subject] = []

    # Los jugadores sintetizados desde los rivales llevan id con prefijo "gen_";
    # el resto son cartas del catálogo curado. En ambos casos el archivo es
    # "{id}.png" (plano, sin carpeta by-name), garantizando unicidad.
    for player in roster:
        pid = player["id"]
        is_opponent = pid.startswith("gen_")
        if is_opponent and not include_opponents:
            continue
        subjects.append(Subject(
            key=pid,
            name=player["name"],
            nation=player.get("nation") or "",
            era=str(player.get("era") or ""),
            kind="opponent" if is_opponent else "catalog",
            out_path=out_dir / f"{pid}.png",
        ))

    if only_names:
        wanted = {normalize(name) for name in only_names}
        subjects = [s for s in subjects if normalize(s.name) in wanted]
    return subjects


def load_overrides(root: Path, rel_path: str | None) -> dict[str, dict[str, Any]]:
    if not rel_path:
        return {}
    path = root / rel_path
    if not path.exists():
        return {}
    raw = json.loads(path.read_text("utf-8"))
    return {normalize(key): value for key, value in raw.items()}


def fetch_json(base_url: str, params: dict[str, Any]) -> dict[str, Any]:
    query = urllib.parse.urlencode(params)
    req = urllib.request.Request(f"{base_url}?{query}", headers={"User-Agent": USER_AGENT})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            if exc.code not in {429, 500, 502, 503, 504} or attempt == 3:
                raise
            retry_after = exc.headers.get("Retry-After")
            try:
                delay = float(retry_after) if retry_after else 3.0 * (attempt + 1)
            except ValueError:
                delay = 3.0 * (attempt + 1)
            time.sleep(delay)
    raise RuntimeError("No se pudo consultar la API")


def commons_metadata(file_title: str) -> Candidate | None:
    data = fetch_json("https://commons.wikimedia.org/w/api.php", {
        "action": "query",
        "format": "json",
        "prop": "imageinfo",
        "titles": file_title if file_title.startswith("File:") else f"File:{file_title}",
        "iiprop": "url|mime|extmetadata",
    })
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        infos = page.get("imageinfo") or []
        if not infos:
            continue
        info = infos[0]
        mime = info.get("mime") or ""
        if not mime.startswith("image/") or mime == "image/svg+xml":
            continue
        meta = info.get("extmetadata") or {}
        return Candidate(
            image_url=info["url"],
            page_url=info.get("descriptionurl"),
            file_title=page.get("title"),
            license_short=(meta.get("LicenseShortName") or {}).get("value"),
            license_url=(meta.get("LicenseUrl") or {}).get("value"),
            artist=strip_html((meta.get("Artist") or {}).get("value")),
        )
    return None


def wikipedia_page_image(title: str) -> Candidate | None:
    data = fetch_json("https://en.wikipedia.org/w/api.php", {
        "action": "query",
        "format": "json",
        "prop": "pageimages|info",
        "titles": title,
        "piprop": "original",
        "pithumbsize": 900,
        "inprop": "url",
        "redirects": 1,
    })
    pages = data.get("query", {}).get("pages", {})
    for page in pages.values():
        file_name = page.get("pageimage")
        if file_name:
            candidate = commons_metadata(file_name)
            if candidate:
                candidate.page_url = candidate.page_url or page.get("fullurl")
                return candidate
        original = page.get("original")
        if original and original.get("source"):
            return Candidate(image_url=original["source"], page_url=page.get("fullurl"), file_title=file_name)
    return None


RELATIVE_TOKENS = {"jr", "junior", "filho", "sr", "senior", "ii", "iii"}


def name_matches(player_name: str, title: str) -> bool:
    """Evita matches de otra persona (p. ej. el hijo: 'Maradona Jr.')."""
    pn = normalize(player_name)
    tn_main = normalize(title).split("(")[0]
    p_tokens = [t for t in re.split(r"[\s.]+", pn) if t]
    t_tokens = {t for t in re.split(r"[\s.]+", tn_main) if t}
    surname = p_tokens[-1] if p_tokens else pn
    if surname and surname not in tn_main:
        return False
    extra_relatives = (t_tokens - set(p_tokens)) & RELATIVE_TOKENS
    if extra_relatives and not (set(p_tokens) & RELATIVE_TOKENS):
        return False
    return True


def search_wikipedia(subject: Subject, limit: int = 5) -> list[str]:
    nation = subject.nation.strip()
    queries = [
        f"{subject.name} {nation} footballer" if nation else f"{subject.name} footballer",
        f"{subject.name} footballer",
        f"{subject.name} soccer player",
        subject.name,
    ]
    titles: list[str] = []
    seen: set[str] = set()
    for query in queries:
        data = fetch_json("https://en.wikipedia.org/w/api.php", {
            "action": "query",
            "format": "json",
            "list": "search",
            "srsearch": query,
            "srlimit": limit,
        })
        for item in data.get("query", {}).get("search", []):
            title = item.get("title")
            if title and "disambiguation" not in title.lower() and title not in seen:
                titles.append(title)
                seen.add(title)
    return titles


def search_commons(subject: Subject, limit: int = 8) -> Candidate | None:
    query = f"{subject.name} footballer portrait"
    data = fetch_json("https://commons.wikimedia.org/w/api.php", {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrnamespace": 6,
        "gsrsearch": query,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|mime|extmetadata",
    })
    pages = list((data.get("query", {}).get("pages") or {}).values())
    pages.sort(key=lambda p: p.get("index", 999))
    for page in pages:
        title = page.get("title")
        if title:
            candidate = commons_metadata(title)
            if candidate:
                return candidate
    return None


# Q937857 = "association football player" (ocupacion en Wikidata). Es la senal
# fiable de que la entidad encontrada es el futbolista y no un homonimo.
FOOTBALLER_QIDS = {"Q937857", "Q628099"}  # jugador de futbol / futbol sala


def wikidata_image(subject: Subject, limit: int = 6) -> Candidate | None:
    """Busca a la PERSONA en Wikidata y usa su imagen oficial (P18).

    A diferencia de Wikipedia, no depende del titulo del articulo, asi que
    resuelve mononimicos ('Ronaldo Nazário' -> entidad Ronaldo) y nombres que
    el match por apellido descartaria. Verifica que la ocupacion sea futbolista.
    """
    search = fetch_json("https://www.wikidata.org/w/api.php", {
        "action": "wbsearchentities",
        "search": subject.name,
        "language": "en",
        "uselang": "en",
        "type": "item",
        "limit": limit,
        "format": "json",
    })
    qids = [item["id"] for item in search.get("search", []) if item.get("id")]
    if not qids:
        return None
    entities = fetch_json("https://www.wikidata.org/w/api.php", {
        "action": "wbgetentities",
        "ids": "|".join(qids),
        "props": "claims",
        "format": "json",
    }).get("entities", {})
    for qid in qids:  # respeta el orden de relevancia de la busqueda
        claims = (entities.get(qid) or {}).get("claims") or {}
        occupations = {
            (c.get("mainsnak", {}).get("datavalue", {}).get("value") or {}).get("id")
            for c in claims.get("P106", [])
        }
        if not (occupations & FOOTBALLER_QIDS):
            continue
        images = claims.get("P18") or []
        if not images:
            continue
        file_name = images[0].get("mainsnak", {}).get("datavalue", {}).get("value")
        if file_name:
            candidate = commons_metadata(file_name)
            if candidate:
                return candidate
    return None


def find_image(subject: Subject) -> Candidate | None:
    for title in search_wikipedia(subject):
        if not name_matches(subject.name, title):
            continue
        candidate = wikipedia_page_image(title)
        if candidate:
            return candidate
    # Fallback robusto antes de rendirse: la entidad-persona en Wikidata.
    candidate = wikidata_image(subject)
    if candidate:
        return candidate
    return search_commons(subject)


def strip_html(value: str | None) -> str | None:
    if not value:
        return None
    return re.sub(r"<[^>]+>", "", value).strip() or None


def download_file(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    # Igual que fetch_json: reintenta el 429/5xx respetando Retry-After. Antes la
    # descarga no reintentaba y un 429 puntual mataba al jugador entero.
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=45) as resp:
                content_type = resp.headers.get("content-type", "")
                # 'image/svg+xml' pasa el filtro 'image/' pero Pillow no lo abre:
                # lo rechazamos para que el jugador caiga como 'missing' (curable)
                # y no como 'failed' por un crudo que nunca se podra rasterizar.
                if not content_type.startswith("image/") or "svg" in content_type:
                    raise RuntimeError(f"URL no devuelve imagen rasterizable: {content_type}")
                dest.write_bytes(resp.read())
            return
        except urllib.error.HTTPError as exc:
            if exc.code not in {429, 500, 502, 503, 504} or attempt == 3:
                raise
            retry_after = exc.headers.get("Retry-After")
            try:
                delay = float(retry_after) if retry_after else 5.0 * (attempt + 1)
            except ValueError:
                delay = 5.0 * (attempt + 1)
            time.sleep(delay)


def ingest_source(source: str, cache_dir: Path, key: str, root: Path) -> Path:
    """Trae una imagen curada (URL http(s) o ruta local) a la cache del jugador."""
    cache_dir.mkdir(parents=True, exist_ok=True)
    for stale in cache_dir.glob(f"{key}.*"):
        stale.unlink()
    if re.match(r"^https?://", source, re.IGNORECASE):
        dest = cache_dir / f"{key}{raw_extension(source)}"
        download_file(source, dest)
        return dest
    src_path = Path(source)
    if not src_path.is_absolute():
        src_path = (root / source).resolve()
    if not src_path.exists():
        raise RuntimeError(f"No existe la imagen local: {src_path}")
    suffix = src_path.suffix.lower() if src_path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"} else ".jpg"
    dest = cache_dir / f"{key}{suffix}"
    dest.write_bytes(src_path.read_bytes())
    return dest


@dataclasses.dataclass
class RenderOptions:
    pixel_width: int = 112
    scale: int = 6
    colors: int = 16
    aspect: float = 0.80
    saturation: float = 1.45
    contrast: float = 1.14
    bg: tuple[int, int, int] = DEFAULT_BG
    cutout: bool = True
    model: str = "u2net"
    genesis: bool = True
    dither: float = 0.0
    outline: tuple[int, int, int] | None = (0, 0, 52)
    precrop: tuple[float, float, float, float] | None = None
    # Modo cara: detecta, alinea por los ojos y recorta un cuadrado solo de la
    # cara, en rejilla exacta. Estandariza encuadre y orientacion de toda la serie.
    face: bool = True
    face_size: int = 64
    eye_y: float = 0.47
    eye_dx: float = 0.28
    mirror: bool = True


# Niveles del DAC de la Sega Mega Drive / Genesis (3 bits por canal, paleta
# "normal" de 512 colores). Snapear a esta rejilla da el aire de 16 bits.
GENESIS_LEVELS = (0, 52, 87, 116, 144, 172, 206, 255)
_GENESIS_LUT = [min(GENESIS_LEVELS, key=lambda lv: abs(lv - i)) for i in range(256)]

# Matriz de Bayer 4x4 normalizada a [-0.5, 0.5] para tramado ordenado opcional.
BAYER4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
]


def snap_genesis(img):
    """Snapea cada canal a la rejilla de 8 niveles de la Mega Drive."""
    return img.point(_GENESIS_LUT * len(img.getbands()))


# Sesion rembg compartida entre jugadores (cargar el modelo es costoso).
_REMBG_SESSION = None
_REMBG_MODEL: str | None = None


def get_rembg_session(model: str):
    global _REMBG_SESSION, _REMBG_MODEL
    if _REMBG_SESSION is None or _REMBG_MODEL != model:
        try:
            from rembg import new_session
        except ImportError as exc:
            raise RuntimeError(
                "Falta rembg. Instala con: python3 -m pip install -r tools/requirements.txt "
                "(o usa --no-cutout para saltar el recorte de fondo)."
            ) from exc
        _REMBG_SESSION = new_session(model)
        _REMBG_MODEL = model
    return _REMBG_SESSION


# Detector de landmarks faciales (MediaPipe Tasks). Da los centros de iris para
# alinear por los ojos y la nariz para normalizar la orientacion.
FACE_MODEL_URL = (
    "https://storage.googleapis.com/mediapipe-models/face_landmarker/"
    "face_landmarker/float16/1/face_landmarker.task"
)
_FACE_LANDMARKER = None


def face_model_path() -> Path:
    cache = Path.home() / ".cache" / "torre-de-leyendas"
    cache.mkdir(parents=True, exist_ok=True)
    dest = cache / "face_landmarker.task"
    if not dest.exists():
        print("  descargando modelo de landmarks faciales (~3.7 MB)...")
        req = urllib.request.Request(FACE_MODEL_URL, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=60) as resp:
            dest.write_bytes(resp.read())
    return dest


def get_face_landmarker():
    global _FACE_LANDMARKER
    if _FACE_LANDMARKER is None:
        try:
            try:
                from absl import logging as absl_logging
                absl_logging.set_verbosity(absl_logging.ERROR)
            except ImportError:
                pass
            from mediapipe.tasks import python as mptp
            from mediapipe.tasks.python import vision
        except ImportError as exc:
            raise RuntimeError(
                "Falta mediapipe. Instala con: python3 -m pip install -r tools/requirements.txt "
                "(o usa --no-face para el encuadre vertical clasico)."
            ) from exc
        options = vision.FaceLandmarkerOptions(
            base_options=mptp.BaseOptions(model_asset_path=str(face_model_path())),
            num_faces=1,
        )
        _FACE_LANDMARKER = vision.FaceLandmarker.create_from_options(options)
    return _FACE_LANDMARKER


@contextlib.contextmanager
def suppress_native_stderr():
    """Silencia los logs nativos (absl/glog/XNNPACK 'I0000'/'W0000') que MediaPipe
    emite por el descriptor de archivo 2 en C++ y que NO se pueden apagar del todo
    con flags ni con absl Python. Redirige fd 2 a /dev/null solo durante la llamada
    nativa y lo restaura siempre, asi que los errores reales de Python siguen vivos."""
    sys.stderr.flush()
    saved = os.dup(2)
    devnull = os.open(os.devnull, os.O_WRONLY)
    try:
        os.dup2(devnull, 2)
        yield
    finally:
        os.dup2(saved, 2)
        os.close(devnull)
        os.close(saved)


def detect_eyes(img):
    """Devuelve (ojo_der, ojo_izq, nariz) en pixeles, o None si no hay cara."""
    import mediapipe as mp
    import numpy as np

    arr = np.asarray(img.convert("RGB"))
    h, w = arr.shape[:2]
    with suppress_native_stderr():
        result = get_face_landmarker().detect(mp.Image(image_format=mp.ImageFormat.SRGB, data=arr))
    if not result.face_landmarks:
        return None
    lm = result.face_landmarks[0]
    # 468 / 473 = centros de iris derecho / izquierdo; 1 = punta de la nariz.
    return (lm[468].x * w, lm[468].y * h), (lm[473].x * w, lm[473].y * h), (lm[1].x * w, lm[1].y * h)


def eye_affine(reye, leye, size: int, eye_y: float, eye_dx: float):
    """Transformacion similar (output->source) que nivela y centra los ojos."""
    qrx, qlx = (0.5 - eye_dx / 2) * size, (0.5 + eye_dx / 2) * size
    qy = eye_y * size
    dpx, dpy = leye[0] - reye[0], leye[1] - reye[1]
    scale = math.hypot(dpx, dpy) / abs(qlx - qrx)
    theta = math.atan2(dpy, dpx)
    a, b = scale * math.cos(theta), -scale * math.sin(theta)
    d, e = scale * math.sin(theta), scale * math.cos(theta)
    c = reye[0] - (a * qrx + b * qy)
    f = reye[1] - (d * qrx + e * qy)
    return (a, b, c, d, e, f)


def crop_portrait(img, aspect: float):
    """Recorta a un encuadre vertical (cabeza y hombros) centrado en horizontal."""
    w, h = img.size
    if w <= 0 or h <= 0:
        return img
    target_w = int(round(h * aspect))
    if target_w <= w:
        left = max(0, (w - target_w) // 2)
        return img.crop((left, 0, left + target_w, h))
    target_h = int(round(w / aspect))
    top = max(0, min(h - target_h, int(h * 0.04)))
    return img.crop((0, top, w, top + target_h))


def quantize_image(img, colors: int):
    from PIL import Image

    try:
        return img.quantize(colors=colors, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert("RGB")
    except AttributeError:
        return img.quantize(colors=colors).convert("RGB")


def apply_ordered_dither(small, strength: float):
    """Tramado ordenado (Bayer 4x4), al estilo de los degradados de Mega Drive."""
    import numpy as np

    arr = np.asarray(small).astype(np.float32)
    h, w = arr.shape[:2]
    tile = np.array(BAYER4, dtype=np.float32) / 16.0 - 0.5
    pattern = np.tile(tile, (h // 4 + 1, w // 4 + 1))[:h, :w]
    amp = strength * 40.0
    arr += pattern[:, :, None] * amp
    return np.clip(arr, 0, 255).astype(np.uint8)


def draw_sprite_outline(small, alpha_small, color):
    """Dibuja un contorno de 1px alrededor de la silueta, como un sprite."""
    import numpy as np
    from PIL import Image

    arr = np.asarray(small).copy()
    a = np.asarray(alpha_small) > 128
    edge = np.zeros_like(a)
    edge[1:, :] |= a[:-1, :]
    edge[:-1, :] |= a[1:, :]
    edge[:, 1:] |= a[:, :-1]
    edge[:, :-1] |= a[:, 1:]
    ring = edge & ~a
    arr[ring] = color
    return Image.fromarray(arr)


def finish_small(img, alpha, opts: RenderOptions, width: int, height: int):
    """Realce, baja resolucion, paleta plana, snap Mega Drive y contorno."""
    from PIL import Image, ImageEnhance

    resampling = getattr(Image, "Resampling", Image)
    if opts.saturation != 1.0:
        img = ImageEnhance.Color(img).enhance(opts.saturation)
    if opts.contrast != 1.0:
        img = ImageEnhance.Contrast(img).enhance(opts.contrast)

    small = img.resize((width, height), resampling.LANCZOS)
    if opts.dither > 0:
        small = Image.fromarray(apply_ordered_dither(small, opts.dither))
    small = quantize_image(small, opts.colors)
    if opts.genesis:
        small = snap_genesis(small)
    if opts.outline and alpha is not None:
        alpha_small = alpha.resize((width, height), resampling.LANCZOS)
        outline = snap_genesis(Image.new("RGB", (1, 1), opts.outline)).getpixel((0, 0)) if opts.genesis else opts.outline
        small = draw_sprite_outline(small, alpha_small, tuple(outline))
    return small


def build_face_small(img, opts: RenderOptions):
    """Detecta la cara, la alinea por los ojos y devuelve un cuadrado de solo cara."""
    from PIL import Image, ImageOps

    eyes = detect_eyes(img)
    if not eyes:
        return None
    reye, leye, nose = eyes
    size = max(256, opts.face_size * 4)
    params = eye_affine(reye, leye, size, opts.eye_y, opts.eye_dx)
    do_mirror = opts.mirror and nose[0] < (reye[0] + leye[0]) / 2

    alpha = None
    if opts.cutout:
        from rembg import remove

        cut = remove(img.convert("RGB"), session=get_rembg_session(opts.model))
        if cut.mode != "RGBA":
            cut = cut.convert("RGBA")
        face = cut.transform((size, size), Image.AFFINE, params, resample=Image.BICUBIC)
        if do_mirror:
            face = ImageOps.mirror(face)
        alpha = face.split()[3]
        comp = Image.alpha_composite(Image.new("RGBA", (size, size), opts.bg + (255,)), face).convert("RGB")
    else:
        comp = img.convert("RGB").transform((size, size), Image.AFFINE, params, resample=Image.BICUBIC)
        if do_mirror:
            comp = ImageOps.mirror(comp)

    return finish_small(comp, alpha, opts, opts.face_size, opts.face_size)


def make_pixel_portrait(img, opts: RenderOptions):
    """Pixela la foto real. En modo cara, recorta/alinea un cuadrado solo de la cara."""
    from PIL import Image

    if opts.face:
        small = build_face_small(img, opts)
        if small is not None:
            return small, True
        print("  sin cara detectada; uso el encuadre vertical clasico")

    if opts.precrop:
        w, h = img.size
        l, t, r, b = opts.precrop
        box = (int(l * w), int(t * h), int(r * w), int(b * h))
        if box[2] > box[0] and box[3] > box[1]:
            img = img.crop(box)
    img = crop_portrait(img, opts.aspect)

    alpha = None
    if opts.cutout:
        from rembg import remove

        cut = remove(img, session=get_rembg_session(opts.model))
        if cut.mode != "RGBA":
            cut = cut.convert("RGBA")
        alpha = cut.split()[3]
        backdrop = Image.new("RGBA", cut.size, opts.bg + (255,))
        img = Image.alpha_composite(backdrop, cut).convert("RGB")

    width = max(16, int(opts.pixel_width))
    w, h = img.size
    height = max(16, int(round(width * h / w)))
    return finish_small(img, alpha, opts, width, height), False


def convert_to_pixel_art(raw_path: Path, out_path: Path, opts: RenderOptions) -> bool:
    """Genera el PNG. Devuelve True si se detecto y uso una cara."""
    try:
        from PIL import Image, ImageOps
    except ImportError as exc:
        raise RuntimeError("Falta Pillow. Instala con: python3 -m pip install -r tools/requirements.txt") from exc

    resampling = getattr(Image, "Resampling", Image)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(raw_path) as source:
        img = ImageOps.exif_transpose(source).convert("RGB")
        small, face_detected = make_pixel_portrait(img, opts)
        w, h = small.size
        scale = max(1, int(opts.scale))
        pixel = small.resize((w * scale, h * scale), resampling.NEAREST)
        pixel.save(out_path, "PNG", optimize=True)
    return face_detected


def options_for_subject(base: RenderOptions, override: dict[str, Any], no_cutout: bool) -> RenderOptions:
    opts = dataclasses.replace(base)
    bg = parse_hex_color(override.get("bg_color"))
    if bg:
        opts.bg = bg
    if "saturation" in override:
        opts.saturation = float(override["saturation"])
    if "contrast" in override:
        opts.contrast = float(override["contrast"])
    if "aspect" in override:
        opts.aspect = float(override["aspect"])
    if "dither" in override:
        opts.dither = float(override["dither"])
    crop = override.get("crop")
    if isinstance(crop, (list, tuple)) and len(crop) == 4:
        opts.precrop = tuple(float(v) for v in crop)
    outline = parse_hex_color(override.get("outline_color"))
    if outline:
        opts.outline = outline
    if override.get("no_outline"):
        opts.outline = None
    if "face_size" in override:
        opts.face_size = int(override["face_size"])
    if "eye_y" in override:
        opts.eye_y = float(override["eye_y"])
    if "eye_dx" in override:
        opts.eye_dx = float(override["eye_dx"])
    if override.get("no_face"):
        opts.face = False
    if override.get("no_mirror"):
        opts.mirror = False
    if no_cutout or override.get("no_cutout"):
        opts.cutout = False
    return opts


def looks_recent(source_url: str | None, file_title: str | None) -> bool:
    """Heuristica: el nombre del archivo trae un anio >= 2000 (foto post-carrera)."""
    blob = f"{source_url or ''} {file_title or ''}"
    return any(2000 <= int(y) <= 2035 for y in re.findall(r"(?:19|20)\d{2}", blob) if int(y) >= 2000)


def write_review(manifest: dict[str, Any], path: Path) -> dict[str, list[str]]:
    """Escribe REVIEW.md listando los retratos que conviene curar a mano."""
    buckets: dict[str, list[tuple[str, str]]] = {
        "missing": [], "failed": [], "no_face": [], "maybe_recent": [],
    }
    for entry in manifest.values():
        if not isinstance(entry, dict):
            continue
        name = entry.get("name", "?")
        status = entry.get("status")
        if status == "missing":
            buckets["missing"].append((name, ""))
        elif status == "failed":
            buckets["failed"].append((name, str(entry.get("error", ""))[:80]))
        elif status == "ok":
            src = entry.get("source_url") or ""
            if not entry.get("face_detected"):
                buckets["no_face"].append((name, src))
            elif entry.get("maybe_recent"):
                buckets["maybe_recent"].append((name, src))

    titles = {
        "no_face": "Sin cara detectada (encuadre de respaldo; conviene mejor foto)",
        "maybe_recent": "Posible foto reciente / post-carrera (revisar epoca)",
        "missing": "Sin imagen encontrada en Wikimedia",
        "failed": "Fallo al procesar",
    }
    lines = ["# Retratos para revisar\n",
             "Pasa una mejor foto en `tools/portrait_overrides.json` con la clave `source` "
             "(URL de Commons o ruta local) para los que aparezcan aqui.\n"]
    for key in ("no_face", "maybe_recent", "missing", "failed"):
        rows = sorted(buckets[key])
        lines.append(f"\n## {titles[key]} ({len(rows)})\n")
        for name, info in rows:
            lines.append(f"- **{name}**" + (f" — {info}" if info else ""))
    path.write_text("\n".join(lines) + "\n", "utf-8")
    return {k: [r[0] for r in v] for k, v in buckets.items()}


def raw_extension(url: str) -> str:
    suffix = Path(urllib.parse.urlparse(url).path).suffix.lower()
    return suffix if suffix in {".jpg", ".jpeg", ".png", ".webp"} else ".jpg"


def cached_raw_path(cache_dir: Path, key: str) -> Path | None:
    for suffix in (".jpg", ".jpeg", ".png", ".webp"):
        path = cache_dir / f"{key}{suffix}"
        if path.exists():
            return path
    matches = sorted(cache_dir.glob(f"{key}.*"))
    return matches[0] if matches else None


def main() -> int:
    parser = argparse.ArgumentParser(description="Genera retratos pixelart para jugadores.")
    parser.add_argument("--include-opponents", action="store_true", help="Incluye jugadores de rivales historicos ademas del catalogo principal.")
    parser.add_argument("--player", action="append", default=[], help="Procesa solo un jugador por nombre exacto. Puede repetirse.")
    parser.add_argument("--limit", type=int, default=0, help="Limita la cantidad de jugadores procesados.")
    parser.add_argument("--force", action="store_true", help="Regenera retratos aunque ya existan.")
    parser.add_argument("--dry-run", action="store_true", help="Lista objetivos sin buscar ni descargar imagenes.")
    parser.add_argument("--sleep", type=float, default=0.2, help="Pausa entre jugadores para no golpear la API.")
    parser.add_argument("--pixel-width", type=int, default=112, help="Resolucion horizontal interna (tamano del bloque de pixel).")
    parser.add_argument("--scale", type=int, default=3, help="Factor de escalado vecino-mas-cercano para el PNG final.")
    parser.add_argument("--colors", type=int, default=16, help="Numero de colores de la paleta cuantizada (16 = sprite Mega Drive).")
    parser.add_argument("--aspect", type=float, default=0.80, help="Relacion ancho/alto del encuadre vertical.")
    parser.add_argument("--saturation", type=float, default=1.45, help="Realce de saturacion (1.0 = neutro).")
    parser.add_argument("--contrast", type=float, default=1.14, help="Realce de contraste (1.0 = neutro).")
    parser.add_argument("--bg", default="009ac6", help="Color de fondo plano en hex (sin #).")
    parser.add_argument("--model", default="u2net", help="Modelo de rembg para el recorte (u2net, u2netp, isnet-general-use...).")
    parser.add_argument("--dither", type=float, default=0.0, help="Tramado ordenado Bayer 4x4 (0 = plano; 0.5-1.0 = degradados estilo Mega Drive).")
    parser.add_argument("--outline", default="000034", help="Color del contorno de sprite en hex (vacio = sin contorno).")
    parser.add_argument("--no-genesis", action="store_true", help="No snapear a la paleta de 9 bits de la Mega Drive.")
    parser.add_argument("--no-cutout", action="store_true", help="No recorta el fondo con rembg (conserva el original).")
    parser.add_argument("--face-size", type=int, default=64, help="Lado del avatar de cara en pixeles reales (rejilla NxN).")
    parser.add_argument("--eye-y", type=float, default=0.47, help="Altura vertical de los ojos en el cuadro (0..1). Menor = mas aire arriba.")
    parser.add_argument("--eye-dx", type=float, default=0.28, help="Separacion de los ojos como fraccion del lado. Menor = cara mas pequena.")
    parser.add_argument("--no-face", action="store_true", help="Desactiva el modo cara (vuelve al encuadre vertical cabeza-y-hombros).")
    parser.add_argument("--no-mirror", action="store_true", help="No normaliza la orientacion (no voltea para que todas miren igual).")
    parser.add_argument(
        "--overrides",
        default="tools/portrait_overrides.json",
        help="JSON opcional con ajustes manuales por nombre o id de jugador.",
    )
    args = parser.parse_args()

    base_opts = RenderOptions(
        pixel_width=args.pixel_width,
        scale=args.scale,
        colors=args.colors,
        aspect=args.aspect,
        saturation=args.saturation,
        contrast=args.contrast,
        bg=parse_hex_color(args.bg) or DEFAULT_BG,
        cutout=not args.no_cutout,
        model=args.model,
        genesis=not args.no_genesis,
        dither=args.dither,
        outline=parse_hex_color(args.outline),
        face=not args.no_face,
        face_size=args.face_size,
        eye_y=args.eye_y,
        eye_dx=args.eye_dx,
        mirror=not args.no_mirror,
    )

    root = repo_root()
    subjects = build_subjects(root, args.include_opponents, args.player)
    overrides = load_overrides(root, args.overrides)
    if args.limit > 0:
        subjects = subjects[:args.limit]

    if args.dry_run:
        for subject in subjects:
            print(f"{subject.kind:8} {subject.name} -> {subject.out_path.relative_to(root)}")
        print(f"Total: {len(subjects)}")
        return 0

    cache_dir = root / ".cache" / "player-portraits" / "raw"
    manifest_path = root / "assets" / "player-portraits" / "manifest.json"
    manifest: dict[str, Any] = {}
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text("utf-8"))

    ok = 0
    skipped = 0
    failed = 0
    for i, subject in enumerate(subjects, 1):
        rel_out = subject.out_path.relative_to(root)
        if subject.out_path.exists() and not args.force:
            print(f"[{i}/{len(subjects)}] skip {subject.name}: {rel_out} ya existe")
            skipped += 1
            continue

        override = overrides.get(normalize(subject.key)) or overrides.get(normalize(subject.name)) or {}
        source = override.get("source")
        try:
            candidate = None
            raw_path = cached_raw_path(cache_dir, subject.key)
            if source:
                # Imagen curada a mano (URL o ruta local): siempre tiene prioridad.
                print(f"[{i}/{len(subjects)}] fuente fija {subject.name}: {source}")
                raw_path = ingest_source(source, cache_dir, subject.key, root)
            elif raw_path:
                print(f"[{i}/{len(subjects)}] usando cache {subject.name}...")
            else:
                print(f"[{i}/{len(subjects)}] buscando {subject.name}...")
                candidate = find_image(subject)
                if not candidate:
                    print(f"  sin imagen Wikimedia/Wikipedia")
                    failed += 1
                    manifest[subject.key] = {"name": subject.name, "status": "missing"}
                    continue
                raw_path = cache_dir / f"{subject.key}{raw_extension(candidate.image_url)}"
                download_file(candidate.image_url, raw_path)

            opts = options_for_subject(base_opts, override, args.no_cutout)
            face_detected = convert_to_pixel_art(raw_path, subject.out_path, opts)

            old_entry = manifest.get(subject.key) if isinstance(manifest.get(subject.key), dict) else {}
            if candidate:
                source_url = candidate.image_url
            elif source:
                source_url = source
            else:
                source_url = old_entry.get("source_url")
            file_title = candidate.file_title if candidate else old_entry.get("file_title")
            manifest[subject.key] = {
                "name": subject.name,
                "kind": subject.kind,
                "output": str(rel_out),
                "style": "pixel",
                "status": "ok",
                "override": bool(override),
                "curated_source": bool(source),
                "face_detected": bool(opts.face and face_detected),
                "maybe_recent": looks_recent(source_url, file_title) if not source else False,
                "era": subject.era,
                "cutout": opts.cutout,
                "pixel_width": opts.pixel_width,
                "colors": opts.colors,
                "source_url": source_url,
                "page_url": candidate.page_url if candidate else old_entry.get("page_url"),
                "file_title": file_title,
                "license": candidate.license_short if candidate else old_entry.get("license"),
                "license_url": candidate.license_url if candidate else old_entry.get("license_url"),
                "artist": candidate.artist if candidate else old_entry.get("artist"),
                "raw_cache": str(raw_path.relative_to(root)),
            }
            manifest_path.parent.mkdir(parents=True, exist_ok=True)
            manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), "utf-8")
            print(f"  ok -> {rel_out}")
            ok += 1
        except (urllib.error.URLError, RuntimeError, OSError, subprocess.CalledProcessError) as exc:
            print(f"  fallo: {exc}", file=sys.stderr)
            failed += 1
            manifest[subject.key] = {"name": subject.name, "status": "failed", "error": str(exc)}
        time.sleep(max(0, args.sleep))

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), "utf-8")

    review_path = manifest_path.parent / "REVIEW.md"
    buckets = write_review(manifest, review_path)
    print(json.dumps({
        "ok": ok, "skipped": skipped, "failed": failed,
        "sin_cara": len(buckets["no_face"]),
        "posible_reciente": len(buckets["maybe_recent"]),
        "sin_imagen": len(buckets["missing"]),
        "review": str(review_path.relative_to(root)),
    }, ensure_ascii=False))
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
