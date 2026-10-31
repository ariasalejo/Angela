#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Optimizador de fotografías para "El Jardín de Ángela"
=====================================================

Convierte las fotos que la familia elige en versiones ligeras, limpias de
metadatos y listas para la web. NO descarga nada, NO se conecta a ninguna
cuenta y NO publica nada: trabaja sólo con archivos que ya están en disco.

Uso
---
1. Colocá los originales en  originales/  (esa carpeta está ignorada por Git).
2. Editá  originales/album.json  (ver ejemplo abajo).
3. Ejecutá:

       python3 docs/herramientas/optimizar_fotos.py

4. Revisá  docs/assets/img/  y  docs/assets/js/fotos.js
5. Recién entonces hacé commit. Nada se publica solo.

Formato de album.json
---------------------
[
  {
    "archivo": "angela-1985.jpg",
    "alt": "Ángela María sonriendo en el patio de la casa.",
    "epigrafe": "El patio de la casa.",
    "fecha": "1985"
  }
]

- "alt"       : descripción breve para lectores de pantalla. Obligatorio.
- "epigrafe"  : texto visible bajo la foto. Opcional.
- "fecha"     : sólo si está confirmada. Opcional.

Requiere Pillow:  pip install pillow
"""

from __future__ import annotations

import base64
import io
import json
import re
import sys
import unicodedata
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover
    sys.exit("Falta Pillow. Instalá con:  pip install pillow")

RAIZ = Path(__file__).resolve().parents[2]
ORIGINALES = RAIZ / "originales"
DESTINO = RAIZ / "docs" / "assets" / "img"
MANIFIESTO = RAIZ / "docs" / "assets" / "js" / "fotos.js"

ANCHOS = (480, 720, 960, 1280, 1600, 2000)
CALIDAD_WEBP = 70
CALIDAD_JPEG = 74


def slug(texto: str) -> str:
    texto = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode()
    texto = re.sub(r"[^a-zA-Z0-9]+", "-", texto).strip("-").lower()
    return texto or "foto"


def lqip(imagen: Image.Image) -> str:
    """Miniatura de 20 px embebida como data URI: pinta el hueco antes de cargar."""
    mini = imagen.convert("RGB").copy()
    mini.thumbnail((20, 40))
    buffer = io.BytesIO()
    mini.save(buffer, "WEBP", quality=45, method=6)
    return "data:image/webp;base64," + base64.b64encode(buffer.getvalue()).decode()


def procesar(entrada: dict) -> dict | None:
    ruta = ORIGINALES / entrada["archivo"]
    if not ruta.exists():
        print(f"  ! no existe: {ruta.name}")
        return None

    with Image.open(ruta) as original:
        # Respeta la orientación y elimina EXIF/GPS al reconstruir la imagen.
        imagen = ImageOps.exif_transpose(original).convert("RGB")
        ancho, alto = imagen.size
        nombre = slug(ruta.stem)

        anchos = [w for w in ANCHOS if w <= ancho] or [ancho]
        if ancho not in anchos:
            anchos.append(ancho)

        variantes = []
        for w in sorted(set(anchos)):
            h = round(alto * w / ancho)
            redimensionada = imagen.resize((w, h), Image.LANCZOS)

            webp = DESTINO / f"{nombre}-{w}.webp"
            jpeg = DESTINO / f"{nombre}-{w}.jpg"
            redimensionada.save(webp, "WEBP", quality=CALIDAD_WEBP, method=6)
            redimensionada.save(
                jpeg, "JPEG", quality=CALIDAD_JPEG, optimize=True, progressive=True
            )
            variantes.append({"w": w, "h": h})

        base = f"assets/img/{nombre}"
        print(
            f"  ✓ {ruta.name}  {ancho}×{alto}  →  {len(variantes)} tamaños "
            f"({', '.join(str(v['w']) for v in variantes)})"
        )

        return {
            "base": base,
            "ancho": ancho,
            "alto": alto,
            "variantes": variantes,
            "lqip": lqip(imagen),
            "alt": entrada.get("alt", "").strip(),
            "epigrafe": entrada.get("epigrafe", "").strip(),
            "fecha": entrada.get("fecha", "").strip(),
        }


def main() -> int:
    if not ORIGINALES.exists():
        sys.exit(
            f"No existe la carpeta {ORIGINALES}.\n"
            "Creala y poné ahí las fotos aprobadas (esa carpeta no se versiona)."
        )

    manifiesto = ORIGINALES / "album.json"
    if not manifiesto.exists():
        sys.exit(
            "Falta originales/album.json.\n"
            "Copiá el ejemplo del encabezado de este script y completá los datos."
        )

    entradas = json.loads(manifiesto.read_text(encoding="utf-8"))
    DESTINO.mkdir(parents=True, exist_ok=True)

    fotos = []
    for entrada in entradas:
        resultado = procesar(entrada)
        if resultado:
            if not resultado["alt"]:
                print(f"  ! {entrada['archivo']}: falta 'alt' (accesibilidad)")
            fotos.append(resultado)

    MANIFIESTO.parent.mkdir(parents=True, exist_ok=True)
    MANIFIESTO.write_text(
        "// Generado por docs/herramientas/optimizar_fotos.py — no editar a mano.\n"
        "window.FOTOS = "
        + json.dumps(fotos, ensure_ascii=False, indent=2)
        + ";\n",
        encoding="utf-8",
    )

    print(f"\n{len(fotos)} foto(s) procesada(s).")
    print(f"Manifiesto: {MANIFIESTO.relative_to(RAIZ)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
