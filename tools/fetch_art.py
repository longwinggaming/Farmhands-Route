"""Farmhand's Route - fetch item icons and villager portraits from the Stardew Valley Wiki and pack them
into one sprite sheet. Run from the repo root: node tools/art_names.js > art/names.json && python tools/fetch_art.py
Sources are cached in art/src (gitignored); outputs are art/sheet.png and js/art.js.
Pixel art is ConcernedApe's, served by the wiki under CC BY-NC-SA 3.0; this is a private planner."""
import json, os, re, sys, time, urllib.parse, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, 'art'); SRC = os.path.join(ART, 'src')
os.makedirs(SRC, exist_ok=True)
UA = 'FarmhandRoute/1.0 (personal planner; contact longwinggaming@gmail.com)'
API = 'https://stardewvalleywiki.com/mediawiki/api.php'
ITEM = 48; PORTRAIT = 64

# names whose wiki file differs from the display name
ALIAS = {
 'Large Brown Egg': ['Large Brown Egg', 'Large Egg (brown)'], 'Egg (brown)': ['Brown Egg', 'Egg (brown)'], 'Egg (white)': ['Egg'], 'Large Egg (brown)': ['Large Brown Egg', 'Large Egg (brown)'], 'Large Egg (white)': ['Large Egg'],
 'Ancient Seed': ['Ancient Seed'],
 'Ancient Seed (artifact)': ['Ancient Seed'],
 'Warp Totem: Beach': ['Warp Totem Beach'], 'Warp Totem: Mountains': ['Warp Totem Mountains'], 'Warp Totem: Farm': ['Warp Totem Farm'],
 'Warp Totem: Desert': ['Warp Totem Desert'], 'Warp Totem: Island': ['Warp Totem Island'],
 'Backpack': ['Large Pack', 'Backpack'], 'Trash Can': ['Trash Can Copper'],
 'Wild Seeds': ['Spring Seeds'], 'Bait': ['Bait'], 'Deluxe Bait': ['Deluxe Bait'],
 'Cabin': ['Log Cabin Stage 1'], 'Cellar': [], 'Bamboo Pole': ['Bamboo Pole'], 'Chicken': ['White Chicken'], 'Cow': ['White Cow'], 'Pet Bowl': ['Pet Bowl Wood'], 'Shipping Bin': ['ShippingBox'], 'Stable': ['Horse'], 'Vault': [], 'Transmute (Fe)': ['Iron Bar'], 'Transmute (Au)': ['Gold Bar'],
 'Mermaid’s Pendant': ["Mermaid's Pendant"], 'Rabbit’s Foot': ["Rabbit's Foot"],
 'Dish O’ The Sea': ["Dish O' The Sea"], 'Blacksmith’s': [], 'Geologist’s': [],
 'Quality Sprinkler': ['Quality Sprinkler'], 'Basic Fertilizer': ['Basic Fertilizer'],
 'Slime': ['Slime'], 'Copper Pan': ['Copper Pan', 'Pan'], 'Scythe': ['Scythe'],
 'Green Tea': ['Green Tea'], 'Coffee Bean': ['Coffee Bean'], 'Hay': ['Hay'],
 '2,500g': [], '5,000g': [], '10,000g': [], '25,000g': [],
 'Cranberries': ['Cranberries'], 'Sweet Gem Berry': ['Sweet Gem Berry'], 'Tea Leaves': ['Tea Leaves'],
 'Powdermelon': ['Powdermelon'], 'Summer Squash': ['Summer Squash'], 'Broccoli': ['Broccoli'], 'Carrot': ['Carrot'],
 'Unmilled Rice': ['Unmilled Rice'], 'Blue Jazz': ['Blue Jazz'], 'Fairy Rose': ['Fairy Rose'],
 'Golden Walnut': ['Golden Walnut'], 'Gold Clock': ['Gold Clock'], 'Qi Gem': ['Qi Gem'],
 'Junimo Hut': ['Junimo Hut'], 'Greenhouse': ['Greenhouse'],
 'Mill': ['Mill'], 'Well': ['Well'], 'Silo': ['Silo'],
 'Fish Pond': ['Fish Pond'], 'Slime Hutch': ['Slime Hutch'], 'Shed': ['Shed'], 'Big Shed': ['Big Shed'],
 'Rusty Sword': ['Rusty Sword'], 'Templar’s Blade': ["Templar's Blade"], 'Burglar’s Ring': ["Burglar's Ring"],
}

def q(params):
    url = API + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    for attempt in range(3):
        try:
            return json.load(urllib.request.urlopen(req, timeout=30))
        except Exception as e:
            time.sleep(1.5 * (attempt + 1)); err = e
    raise err

def lookup(titles, width):
    """titles: list of file titles without 'File:'; returns {title: thumburl} (missing ones absent)."""
    out = {}
    for i in range(0, len(titles), 40):
        chunk = titles[i:i+40]
        d = q({'action':'query', 'titles':'|'.join('File:'+t+'.png' for t in chunk), 'prop':'imageinfo',
               'iiprop':'url|size', 'iiurlwidth':str(width), 'format':'json'})
        norm = {}
        for n in d['query'].get('normalized', []): norm[n['to']] = n['from']
        for p in d['query']['pages'].values():
            if 'missing' in p or 'imageinfo' not in p: continue
            info = p['imageinfo'][0]
            title = p['title']; key = norm.get(title, title)
            key = re.sub(r'^File:', '', key); key = re.sub(r'\.png$', '', key)
            out[key] = info.get('thumburl') or info.get('url')
        time.sleep(0.4)
    return out

def fetch(url, dest):
    if os.path.exists(dest): return True
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    for attempt in range(3):
        try:
            data = urllib.request.urlopen(req, timeout=30).read()
            open(dest, 'wb').write(data); time.sleep(0.25); return True
        except Exception:
            time.sleep(1.5 * (attempt + 1))
    return False

def resolve(names, width, kind):
    """returns {display name: local file path}; also records misses"""
    cand = {}
    for n in names:
        opts = ALIAS.get(n, [n]) if n in ALIAS else [n]
        if n in ALIAS and not opts: continue
        base = re.sub(r'\s*\((any|white|brown)\)$', '', n)
        if base != n and n not in ALIAS: opts = opts + [base, n.replace(' (brown)', '').replace('Large Egg', 'Large Brown Egg').replace('Egg (', 'Brown Egg (')]
        cand[n] = opts
    titles = sorted(set(t for opts in cand.values() for t in opts))
    found = lookup(titles, width)
    out, miss = {}, []
    for n, opts in cand.items():
        hit = None
        for t in opts:
            if t in found: hit = (t, found[t]); break
        if not hit: miss.append(n); continue
        fn = os.path.join(SRC, kind + '_' + re.sub(r'[^A-Za-z0-9]+', '_', hit[0]) + '_' + str(width) + '.png')
        if fetch(hit[1], fn): out[n] = fn
        else: miss.append(n)
    return out, miss

def main():
    names = json.load(open(os.path.join(ART, 'names.json'), encoding='utf-8'))
    items, miss1 = resolve(names['items'], ITEM, 'i')
    portraits, miss2 = resolve(names['portraits'], PORTRAIT, 'p')
    print('items found %d, missing %d; portraits found %d, missing %d' % (len(items), len(miss1), len(portraits), len(miss2)))
    if miss1: print('MISSING items:', '; '.join(miss1))
    if miss2: print('MISSING portraits:', '; '.join(miss2))
    # pack: portraits in 64px rows first, then items in 48px rows; sheet width 768
    W = 768
    entries = []
    x = y = 0; rowh = PORTRAIT
    for n in sorted(portraits):
        if x + PORTRAIT > W: x = 0; y += rowh
        entries.append((n, portraits[n], x, y, PORTRAIT)); x += PORTRAIT
    if portraits: y += rowh
    x = 0; rowh = ITEM
    for n in sorted(items):
        if x + ITEM > W: x = 0; y += rowh
        entries.append((n, items[n], x, y, ITEM)); x += ITEM
    H = y + rowh
    sheet = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    art = {}
    for n, fn, ex, ey, s in entries:
        try:
            im = Image.open(fn).convert('RGBA')
        except Exception:
            continue
        im.thumbnail((s, s), Image.NEAREST if max(im.size) <= s else Image.LANCZOS)
        ox = ex + (s - im.width) // 2; oy = ey + (s - im.height) // 2
        sheet.paste(im, (ox, oy), im)
        art[n] = [ex, ey, s]
    sheet.save(os.path.join(ART, 'sheet.png'), optimize=True)
    js = ("/* Farmhand's Route - sprite sheet map, generated by tools/fetch_art.py. Icons and portraits come from the\n"
          "   Stardew Valley Wiki (stardewvalleywiki.com, CC BY-NC-SA 3.0); the pixel art is ConcernedApe's. name -> [x, y, cell]. */\n"
          "'use strict';\nvar ART = {w:%d, h:%d, map:%s};\n" % (W, H, json.dumps(art, ensure_ascii=False, separators=(',', ':'))))
    open(os.path.join(ROOT, 'js', 'art.js'), 'w', encoding='utf-8').write(js)
    print('sheet %dx%d, %d sprites, %.0f KB' % (W, H, len(art), os.path.getsize(os.path.join(ART, 'sheet.png')) / 1024))

if __name__ == '__main__':
    main()
