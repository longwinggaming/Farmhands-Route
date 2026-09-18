"""Farmhand's Route - assembles js/perfection.js from the research dossiers' JSON blocks plus the hand-written
route and rules in this file. Run from the repo root: python tools/build_perfection.py <scratchpad dir>"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'research')

def jb(fn):
    t = open(os.path.join(SP, fn), encoding='utf-8').read()
    m = re.search(r'```json\s*(.*?)```', t, re.S)
    return json.loads(m.group(1))

def slug(s):
    return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))

def short(s, n=110):
    s = re.sub(r'\s+', ' ', str(s or '')).strip()
    if len(s) <= n: return s
    cut = s[:n]
    return cut[:cut.rfind(' ')].rstrip(',;:') if ' ' in cut else cut

P = jb('sdv-8-perfection.md')
W = jb('sdv-9-walnuts.md')
F = jb('sdv-10-fish-all.md')
C = jb('sdv-11-cooking.md')
S = jb('sdv-12-shipped-route.md')
CR = json.load(open(os.path.join(SP, 'parsed-crafting.json'), encoding='utf-8'))

cats = []

# ---- 1. Produce and forage shipped ----
ship = S['shipped']
order = ['crop', 'forage', 'tree fruit', 'animal', 'artisan', 'island', 'other']
labels = {'crop': 'Crops', 'forage': 'Forage', 'tree fruit': 'Tree fruit', 'animal': 'Animal products', 'artisan': 'Artisan goods', 'island': 'Ginger Island', 'other': 'Everything else'}
groups = []
for cat in order:
    rows = [r for r in ship if (r.get('cat') or 'other').lower() == cat]
    if not rows: continue
    groups.append({'name': labels[cat], 'items': [{'id': slug(r['name']), 'name': r['name'], 'how': short(r.get('how')), 'when': r.get('season') or '', 'needs': short(r.get('needs'), 40)} for r in rows]})
seen = set(r['name'].lower() for r in ship)
extra = [r for r in ship if (r.get('cat') or 'other').lower() not in order]
if extra:
    groups.append({'name': 'Everything else', 'items': [{'id': slug(r['name']), 'name': r['name'], 'how': short(r.get('how')), 'when': r.get('season') or '', 'needs': short(r.get('needs'), 40)} for r in extra]})
cats.append({'id': 'ship', 'name': 'Produce and forage shipped', 'weight': 15, 'icon': 'Parsnip', 'rule': 'Ship one of each.', 'groups': groups})

# ---- 2. Obelisks ----
ob = P.get('obelisks', [])
cats.append({'id': 'obelisks', 'name': 'Obelisks on the farm', 'weight': 4, 'icon': 'Earth Obelisk', 'groups': [{'name': 'Four obelisks from the Wizard', 'items': [{'id': slug(o['name']), 'name': o['name'], 'how': short('%s + %s' % ('{:,}g'.format(o['gold']), o['mats'])), 'needs': o.get('needs', '')} for o in ob]}]})

# ---- 3. Gold Clock ----
cats.append({'id': 'clock', 'name': 'Gold Clock', 'weight': 10, 'icon': 'Gold Clock', 'groups': [{'name': 'The clock', 'items': [{'id': 'gold-clock', 'name': 'Gold Clock', 'how': '10,000,000g at the Wizard’s tower; no debris, no fence decay', 'needs': 'Magic Ink'}]}]})

# ---- 4. Monster Slayer Hero ----
mons = P.get('monsters', [])
cats.append({'id': 'monsters', 'name': 'Monster Slayer Hero', 'weight': 10, 'icon': 'Green Slime', 'groups': [{'name': 'Every eradication goal at the Guild', 'items': [{'id': slug(m['name']), 'name': '%s: %s' % (m['name'], '{:,}'.format(m['count'])), 'icon': m.get('icon') or m['name'].rstrip('s') if m['name'] not in ('Cave Insects', 'Void Spirits', 'Magma Sprites', 'Dust Sprites', 'Rock Crabs', 'Duggies', 'Mummies', 'Serpents', 'Pepper Rex', 'Slimes', 'Bats', 'Skeletons') else {'Cave Insects': 'Bug', 'Void Spirits': 'Shadow Brute', 'Magma Sprites': 'Magma Sprite', 'Dust Sprites': 'Dust Sprite', 'Rock Crabs': 'Rock Crab', 'Duggies': 'Duggy', 'Mummies': 'Mummy', 'Serpents': 'Serpent', 'Pepper Rex': 'Pepper Rex', 'Slimes': 'Green Slime', 'Bats': 'Bat', 'Skeletons': 'Skeleton'}[m['name']], 'how': short('%s. Reward: %s' % (m['where'], m['reward'])), 'needs': ''} for m in mons]}]})

# ---- 5. Great Friends ----
fr = P.get('friends', [])
def fgroup(f):
    return f.get('group') or ('Marriage candidates' if f.get('hearts') == 8 else 'Everyone else')
fg = {}
for f in fr: fg.setdefault(fgroup(f), []).append(f)
cats.append({'id': 'friends', 'name': 'Great Friends', 'weight': 11, 'icon': 'Bouquet', 'groups': [{'name': g, 'items': [{'id': slug(f['name']), 'name': '%s: %d hearts' % (f['name'], f['hearts']), 'icon': f['name'], 'how': short('Birthday %s. %s' % (f.get('birthday', '?'), f.get('gift', ''))), 'needs': f.get('needs', '')} for f in rows]} for g, rows in fg.items()]})

# ---- 6. Farmer level ----
cats.append({'id': 'skills', 'name': 'Farmer level 25', 'weight': 5, 'icon': 'Hoe', 'groups': [{'name': 'Every skill to 10', 'items': [
    {'id': 'farming', 'name': 'Farming 10', 'icon': 'Hoe', 'how': 'Hops and blueberries in bulk; petting and milking count too'},
    {'id': 'mining', 'name': 'Mining 10', 'icon': 'Pickaxe', 'how': 'Every rock and node; Skull Cavern gem nodes are the fast XP'},
    {'id': 'foraging', 'name': 'Foraging 10', 'icon': 'Axe', 'how': 'Trees felled (14 each) and forage picked (7 each); the Secret Woods daily'},
    {'id': 'fishing', 'name': 'Fishing 10', 'icon': 'Fiberglass Rod', 'how': 'Perfect catches of hard fish; crab pots give 5 each'},
    {'id': 'combat', 'name': 'Combat 10', 'icon': 'Rusty Sword', 'how': 'Mines floors 80 to 120 and the Skull Cavern; farm monsters give a third'}]}]})

# ---- 7. Stardrops ----
sd = P.get('stardrops', [])
cats.append({'id': 'stardrops', 'name': 'Stardrops found', 'weight': 10, 'icon': 'Stardrop', 'groups': [{'name': 'All seven', 'items': [{'id': 'sd-' + slug(x['where']), 'name': x['where'], 'icon': 'Stardrop', 'how': short(x['how']), 'needs': x.get('needs', '')} for x in sd]}]})

# ---- 8. Cooking ----
def cook_group(r):
    s = r['src']
    if s.startswith('QoS'):
        return 'Queen of Sauce, Year 1' if 'Y1' in s else ('Queen of Sauce, Year 2' if 'Y2' in s else 'Queen of Sauce')
    if s.lower().startswith('mail') or 'hearts' in s.lower(): return 'Friendship mail'
    if re.match(r'^(Farming|Foraging|Fishing|Mining|Combat)', s): return 'Skill levels'
    if 'known' in s.lower(): return 'Known from the start'
    return 'Shops, events and the island'
cg = {}
for r in C:
    if r.get('counts', True) is False: continue
    cg.setdefault(cook_group(r), []).append(r)
corder = ['Known from the start', 'Skill levels', 'Queen of Sauce, Year 1', 'Queen of Sauce, Year 2', 'Queen of Sauce', 'Friendship mail', 'Shops, events and the island']
cats.append({'id': 'cooking', 'name': 'Cooking recipes made', 'weight': 10, 'icon': 'Fried Egg', 'expect': len([r for r in C if r.get('counts', True) is not False]), 'groups': [{'name': g, 'items': [{'id': slug(r['name']), 'name': r['name'], 'how': short('%s. %s' % (r['src'], r['ing']))} for r in cg[g]]} for g in corder if g in cg]})

# ---- 9. Crafting ----
rule = P.get('crafting', {}) if isinstance(P.get('crafting'), dict) else {}
exclude = set(rule.get('exclude', ['Workbench', 'Mini-Fridge', 'Wedding Ring']))
def craft_group(r):
    u = r['unlock']
    if re.match(r'^(Farming|Foraging|Fishing|Mining|Combat) \d', u): return 'Skill levels'
    if 'Starter' in u: return 'Known from the start'
    if 'Mastery' in u or 'Qi' in u: return 'Mastery and Qi Gems'
    if 'recipe' in u and ('g' in u): return 'Bought recipes'
    return 'Events, quests and special orders'
crg = {}
for r in CR:
    if r['name'] in exclude: continue
    crg.setdefault(craft_group(r), []).append(r)
crorder = ['Known from the start', 'Skill levels', 'Bought recipes', 'Events, quests and special orders', 'Mastery and Qi Gems']
cats.append({'id': 'crafting', 'name': 'Crafting recipes made', 'weight': 10, 'icon': 'Keg', 'groups': [{'name': g, 'items': [{'id': slug(r['name']), 'name': r['name'], 'how': short('%s. %s' % (r['unlock'], r['ing']))} for r in crg[g]]} for g in crorder if g in crg]})

# ---- 10. Fish ----
forder = [('river', 'Rivers'), ('lake', 'Mountain Lake'), ('ocean', 'Ocean'), ('mines', 'The Mines'), ('desert', 'Desert'), ('woods', 'Secret Woods'), ('sewers', 'Sewers'), ('swamp', 'Witch’s Swamp'), ('night market', 'Night Market submarine'), ('island', 'Ginger Island'), ('legendary', 'Legendary'), ('crab pot', 'Crab pots'), ('other', 'Other catches')]
fgroups = {}
for r in F:
    if r.get('counts', True) is False: continue
    fgroups.setdefault(r.get('group', 'other'), []).append(r)
fitems = []
for key, label in forder:
    rows = fgroups.pop(key, [])
    if not rows: continue
    fitems.append({'name': label, 'items': [{'id': slug(r['name']), 'name': r['name'], 'how': short('%s%s%s' % (r.get('where', ''), (', ' + r['time']) if r.get('time') and r['time'].lower() not in ('any', 'anytime') else '', (', ' + r['weather']) if r.get('weather') and r['weather'].lower() != 'any' else '')), 'when': r.get('season') or ''} for r in rows]})
for key, rows in fgroups.items():
    fitems.append({'name': key.title(), 'items': [{'id': slug(r['name']), 'name': r['name'], 'how': short(r.get('where', '')), 'when': r.get('season') or ''} for r in rows]})
cats.append({'id': 'fish', 'name': 'Fish caught', 'weight': 10, 'icon': 'Sturgeon', 'expect': len([r for r in F if r.get('counts', True) is not False]), 'groups': fitems})

# ---- 11. Golden walnuts ----
wg = {}
for r in W: wg.setdefault(r['area'], []).append(r)
worder = ['General', 'Island South', 'Island East', 'Island North', 'Island West']
wgroups = []
for a in worder + [k for k in wg if k not in worder]:
    if a not in wg: continue
    wgroups.append({'name': a, 'items': [{'id': slug(r['name']), 'name': r['name'], 'icon': 'Golden Walnut', 'count': r['count'], 'how': short(r['how']), 'needs': short(re.split(r'[;(]', r.get('needs') or '')[0], 34)} for r in wg[a]]})
cats.append({'id': 'walnuts', 'name': 'Golden Walnuts', 'weight': 5, 'icon': 'Golden Walnut', 'groups': wgroups})

# ---- route ----
route = []
for i, ph in enumerate(S['route']):
    steps = []
    for j, st in enumerate(ph['steps']):
        steps.append({'id': 'pr-%d-%d' % (i + 1, j + 1), 't': st['t'].strip(), 'c': st.get('c', '').strip(), 'w': st.get('w', '').strip(), 'tags': st.get('tags', []), 'p': st.get('p', 0)})
    route.append({'n': str(i + 1), 't': ph['phase'], 'when': ph.get('when', ''), 'steps': steps})

total = sum(c['weight'] for c in cats)
assert total == 100, total
out = "/* Farmhand's Route - perfection tracker data, assembled by tools/build_perfection.py from the wiki dossiers\n   (Perfection, Golden Walnut, Fish, Cooking, Collections, Crafting pages, 1.6). Weights are the game's own. */\n'use strict';\nvar PERF = " + json.dumps({'cats': cats, 'route': route}, ensure_ascii=False, separators=(',', ':')) + ";\n"
open(os.path.join(ROOT, 'js', 'perfection.js'), 'w', encoding='utf-8').write(out)
n = sum(len(g['items']) for c in cats for g in c['groups'])
print('perfection.js written: %d categories, %d requirements, %d route phases' % (len(cats), n, len(route)))
for c in cats:
    k = sum(len(g['items']) for g in c['groups']); print('  %-28s %3d items in %d groups' % (c['name'], k, len(c['groups'])))
