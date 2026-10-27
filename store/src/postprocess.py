"""Aplatit les PNG rendus par Playwright en PNG 24 bits (RGB, sans alpha) et vérifie
les contraintes des stores : dimensions, poids < 8 Mo.

Usage : python3 -I postprocess.py fichier.png [...]
"""
import os
import sys

from PIL import Image

MAX_BYTES = 8 * 1024 * 1024

bad = 0
for p in sys.argv[1:]:
    im = Image.open(p)
    w, h = im.size
    im.convert("RGB").save(p, format="PNG", optimize=True)
    size = os.path.getsize(p)
    ok = size < MAX_BYTES
    bad += not ok
    print(f"  {os.path.relpath(p):56s} {w}×{h}  RGB  {size/1024:7.0f} Ko{'' if ok else '  TROP LOURD'}")
sys.exit(1 if bad else 0)
