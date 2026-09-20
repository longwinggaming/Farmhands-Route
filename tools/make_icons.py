"""Build the home-screen icons from a cached wiki sprite (art/src/i_Parsnip_48.png).
Nearest-neighbour scaling keeps the pixel art crisp. Run from the project root:
    python tools/make_icons.py
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art', 'src', 'i_Parsnip_48.png')
OUT = os.path.join(ROOT, 'art')
BG = (15, 30, 33, 255)        # --bg dark
GOLD = (237, 181, 63, 255)    # --accent dark

def icon(size, sprite_frac, border):
    im = Image.new('RGBA', (size, size), BG)
    if border:
        # thin gold frame like the app's callout rule
        w = max(2, size // 48)
        for x in range(size):
            for y in range(w):
                im.putpixel((x, y), GOLD); im.putpixel((x, size - 1 - y), GOLD)
        for y in range(size):
            for x in range(w):
                im.putpixel((x, y), GOLD); im.putpixel((size - 1 - x, y), GOLD)
    sp = Image.open(SRC).convert('RGBA')
    bbox = sp.getbbox()
    if bbox: sp = sp.crop(bbox)
    target = int(size * sprite_frac)
    k = max(1, target // max(sp.width, sp.height))
    sp = sp.resize((sp.width * k, sp.height * k), Image.NEAREST)
    im.alpha_composite(sp, ((size - sp.width) // 2, (size - sp.height) // 2))
    return im

def main():
    os.makedirs(OUT, exist_ok=True)
    icon(512, 0.72, True).save(os.path.join(OUT, 'icon-512.png'))
    icon(192, 0.72, True).save(os.path.join(OUT, 'icon-192.png'))
    icon(180, 0.72, False).save(os.path.join(OUT, 'apple-touch-icon.png'))
    icon(512, 0.5, False).save(os.path.join(OUT, 'icon-512-maskable.png'))
    print('icons written to', OUT)

if __name__ == '__main__':
    main()
