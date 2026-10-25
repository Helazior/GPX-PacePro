"""Planches d'aperçu (vignettes) des visuels, pour relecture rapide et pour le README.

Usage : python3 -I store/src/apercu.py
"""
import glob
import os
import sys

from PIL import Image

STORE = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
OUT = os.path.join(STORE, "apercu")


def planche(nom, fichiers, largeur, colonnes, fond=(38, 44, 56), marge=16):
    vignettes = []
    for f in fichiers:
        im = Image.open(f).convert("RGB")
        vignettes.append(im.resize((largeur, round(im.height * largeur / im.width)), Image.LANCZOS))
    h = max(v.height for v in vignettes)
    lignes = (len(vignettes) + colonnes - 1) // colonnes
    feuille = Image.new("RGB", (colonnes * largeur + (colonnes + 1) * marge, lignes * h + (lignes + 1) * marge), fond)
    for i, v in enumerate(vignettes):
        r, c = divmod(i, colonnes)
        feuille.paste(v, (marge + c * (largeur + marge), marge + r * (h + marge)))
    dest = os.path.join(OUT, nom)
    feuille.save(dest, optimize=True)
    print(f"  {os.path.relpath(dest)}  {feuille.size[0]}×{feuille.size[1]}")


os.makedirs(OUT, exist_ok=True)
for lang in ("fr", "en"):
    planche(f"play_{lang}.png", sorted(glob.glob(os.path.join(STORE, "play", lang, "*.png"))), 300, 7)
planche(
    "bandeaux.png",
    [
        os.path.join(STORE, "play", "feature_play_1024x500_fr.png"),
        os.path.join(STORE, "connectiq", "hero_connectiq_1440x720_fr.png"),
        os.path.join(STORE, "play", "feature_play_1024x500_en.png"),
        os.path.join(STORE, "connectiq", "hero_connectiq_1440x720_en.png"),
    ],
    640,
    2,
)
planche("montre.png", sorted(glob.glob(os.path.join(STORE, "connectiq", "montre", "*.png"))), 220, 7)
sys.exit(0)
