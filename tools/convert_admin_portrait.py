#!/usr/bin/env python3
"""Convierte una imagen subida desde el admin usando el mismo pipeline que
tools/generate_player_portraits.py.

Este helper existe para no duplicar el efecto en JavaScript: importa el módulo
principal y llama a convert_to_pixel_art con las mismas opciones por defecto del
CLI actual.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import generate_player_portraits as portraits


def base_options(model: str, overrides_path: str, player_id: str, player_name: str):
    root = portraits.repo_root()
    override = {}
    overrides = portraits.load_overrides(root, overrides_path)
    if player_id:
        override = overrides.get(portraits.normalize(player_id)) or override
    if player_name:
        override = overrides.get(portraits.normalize(player_name)) or override

    opts = portraits.RenderOptions(
        pixel_width=112,
        scale=3,
        colors=16,
        aspect=0.80,
        saturation=1.45,
        contrast=1.14,
        bg=portraits.parse_hex_color("009ac6") or portraits.DEFAULT_BG,
        cutout=True,
        model=model,
        genesis=True,
        dither=0.0,
        outline=portraits.parse_hex_color("000034"),
        face=True,
        face_size=64,
        eye_y=0.47,
        eye_dx=0.28,
        mirror=True,
    )
    return portraits.options_for_subject(opts, override, no_cutout=False)


def main() -> int:
    parser = argparse.ArgumentParser(description="Convierte un retrato admin con el tool Python real.")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--player-id", default="")
    parser.add_argument("--player-name", default="")
    parser.add_argument("--model", default="u2net")
    parser.add_argument("--overrides", default="tools/portrait_overrides.json")
    args = parser.parse_args()

    opts = base_options(args.model, args.overrides, args.player_id, args.player_name)
    face_detected = portraits.convert_to_pixel_art(args.input, args.output, opts)
    print(json.dumps({
        "ok": True,
        "face_detected": bool(opts.face and face_detected),
        "cutout": bool(opts.cutout),
        "bg": "#{:02x}{:02x}{:02x}".format(*opts.bg),
    }))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
