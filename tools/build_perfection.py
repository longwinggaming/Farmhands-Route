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
labels = {'crop': 'Crops', 'forage': 'Forage', 'tree fruit': 'Tree fruit', 'animal': 'Animal products', 'artisan': 'Artisan goods', 'island': 'Ginger Island', 'other': 'Ore, bars, syrups and drops'}
for r in ship:
    if (r.get('cat') or '').lower() == 'crop/forage': r['cat'] = 'forage'
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
MON_ICON = {'Slimes': 'Green Slime', 'Void Spirits': 'Shadow Brute', 'Bats': 'Bat', 'Skeletons': 'Skeleton', 'Cave Insects': 'Bug', 'Duggies': 'Duggy', 'Dust Sprites': 'Dust Sprite', 'Rock Crabs': 'Rock Crab', 'Mummies': 'Mummy', 'Pepper Rex': 'Pepper Rex', 'Serpents': 'Serpent', 'Magma Sprites': 'Magma Sprite'}
mons = P.get('monsters', [])
cats.append({'id': 'monsters', 'name': 'Monster Slayer Hero', 'weight': 10, 'icon': 'Green Slime', 'groups': [{'name': 'Every eradication goal at the Guild', 'note': 'Slime Hutch kills do not count; the Guild counts the rest anywhere.', 'items': [{'id': slug(m['name']), 'name': '%s: %s' % (m['name'], '{:,}'.format(m['count'])), 'icon': MON_ICON.get(m['name'], m['name']), 'how': short('%s. Reward: %s' % (m['where'], m['reward'])), 'needs': ''} for m in mons]}]})

# ---- 5. Great Friends ----
fr = P.get('friends', [])
def fgroup(f):
    return f.get('group') or ('Marriage candidates (8 hearts)' if f.get('hearts') == 8 else 'Everyone else (10 hearts)')
fg = {}
for f in fr: fg.setdefault(fgroup(f), []).append(f)
cats.append({'id': 'friends', 'name': 'Great Friends', 'weight': 11, 'icon': 'Bouquet', 'groups': [{'name': g, 'note': 'Two loved gifts a week (80 each), talk daily (20), birthdays count eight times.' if g.startswith('Marriage') else '', 'items': [{'id': slug(f['name']), 'name': '%s: %d hearts' % (f['name'], f['hearts']), 'icon': f['name'], 'how': short('Birthday %s. Easy love: %s. Also loves %s' % (f.get('birthday', '?'), f.get('gift', ''), ', '.join([x for x in f.get('loves', []) if x != f.get('gift')][:4]))), 'needs': ('needs a Bouquet past 8' if f['hearts'] == 8 else '')} for f in rows]} for g, rows in fg.items()]})

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

# ---- route (hand-written from the dossiers; W = wiki fact, the order is the guide consensus) ----
def st(i, j, t, c='', w='', tags=None, p=0):
    return {'id': 'pr-%d-%d' % (i, j), 't': t, 'c': c, 'w': w, 'tags': tags or [], 'p': p}
A = '\u2019'
R = [
 ('1', 'Before the boat', 'Winter Year 1 to Spring Year 2', [
   ('Finish the Community Center; Willy'+A+'s letter about the boat follows.', '', 'The boat sits in the back room of the Fish Shop. Nothing on the island opens before the Center is done.', ['bundle']),
   ('Bank 200 Hardwood.', 'Hardwood: 200', 'Six a day from the Secret Woods stumps, more from mahogany trees. The island has its own later.', ['forage']),
   ('Five Iridium Bars from Skull Cavern ore.', 'Iridium Bar: 5 (25 Iridium Ore, 5 Coal)', 'Ore starts around floor 25 and thickens past 50. One lucky day with staircases and bombs covers it.', ['mine']),
   ('Four to six Lightning Rods out before the storms; five Battery Packs.', 'Lightning Rod: 1 Iron Bar, 1 Refined Quartz, 5 Bat Wing each', 'A rod holds one strike until you empty it, so several rods catch several strikes per storm. Summer 13 and 26 always storm.', ['craft']),
   ('Greenhouse full of Ancient Fruit: every fruit through the Seed Maker until 116 plants stand.', 'Iridium Sprinkler: 1 Gold Bar, 1 Iridium Bar, 1 Battery Pack; six water the whole house', 'One plant becomes two every week through the Seed Maker. Full, the greenhouse is about 268,000g of wine a week with Artisan.', ['farm', 'money']),
   ('Kegs as the Oak Resin arrives; Artisan at Farming 10.', 'Keg: 30 Wood, 1 Copper Bar, 1 Iron Bar, 1 Oak Resin each', 'A keg turns one fruit a week, so the count of kegs is the count of plants.', ['craft', 'money']),
   ('Spring 1, Year 2: Kent arrives; start his gifts.', '', 'He needs 10 hearts like the other adults and only exists from Year 2. Roasted Hazelnuts and Fiddlehead Risotto are his loves.', ['social']),
   ('Desert Festival, Spring 15 to 17: Calico Eggs buy Truffle Oil, Mead, Squid Ink and a Tea Sapling.', 'Calico Eggs: 50, 20, 30, 10', 'Four shipped-list items in one trip without a pig, a bee house, a squid or Caroline'+A+'s scene. Eggs come from the festival races and the Skull Cavern.', ['festival']),
 ]),
 ('2', 'The island: first week', 'Spring Year 2', [
   ('Repair the boat at Willy'+A+'s, sleep, sail.', 'Boat: 200 Hardwood, 5 Iridium Bar, 5 Battery Pack; ticket: 1,000g a trip', 'The boat leaves 8am to 5pm. The Island Obelisk (20 walnuts) replaces the fare later.', ['money']),
   ('Give the parrot by the dock its first walnut; then the three easy walnuts on Island East.', 'Walnut: 1', 'The first walnut is not counted toward the 100. Island East: a bush on the jungle path, the tree in Leo'+A+'s hut, the bush by the Gem Bird shrine.', ['forage']),
   ('Wake the turtle: Island West.', 'Walnuts: 10', 'The west is where the farm, the tide pools and most of the walnuts are.', ['forage']),
   ('The Island Farmhouse: a bed on the island.', 'Walnuts: 20', 'Sleeping there skips the boat. The Mailbox (5) and the Farm Obelisk (20) come next.', ['prep']),
   ('Farm Obelisk and the mailbox.', 'Walnuts: 20, then 5', 'The obelisk is a free warp home; the mailbox needs the farmhouse first.', ['prep']),
   ('Island North: the Dig Site bridge, the Island Trader, the Volcano bridge and its exit shortcut.', 'Walnuts: 10, 10, 5, 5', 'The Volcano bridge parrot only appears after you have reached the Forge once.', ['prep']),
   ('Island Trader: Banana and Mango saplings, Pineapple and Taro seeds.', 'Banana Sapling: 5 Dragon Tooth; Mango Sapling: 75 Mussel; Pineapple Seeds: 1 Magma Cap; Taro Tuber: 2 Bone Fragment', 'All four are shipped-list items; the Banana also feeds the gorilla shrine (3 walnuts) and the Island Obelisk.', ['shop']),
   ('Ship a Ginger, a Magma Cap and a Cinder Shard on the first day; solve Journal Scrap #10 for a free Ostrich Egg.', '', 'Ginger grows wild on the island, Magma Caps and Cinder Shards are in the Volcano. The Ostrich Egg saves an incubator and a walnut-gated hatch.', ['forage']),
   ('Plant the island farm: Ancient Fruit in bulk, Starfruit for cash, fruit trees round the edge.', 'Starfruit Seeds: 400g each at the Oasis', '777 tiles, no season, no crows. This is where the ten million comes from.', ['farm', 'money']),
 ]),
 ('3', 'Walnuts to 100 and Qi'+A+'s room', 'Summer Year 2', [
   ('Sweep the walnut list with the parrot'+A+'s hints; island fishing drops five.', '', 'The Perfection tab lists all 130 by area. 123 of them are hinted by the parrot on the dock.', ['forage']),
   ('Gourmand Frog: grow a Melon, then Wheat, then Garlic on the island farm, and leave each unharvested.', 'Walnuts: 5 + 5 + 5', 'The frog in the cave at the farm'+A+'s north-east corner asks for them in that order.', ['farm']),
   ('Beach Resort: villagers visit; Gus'+A+'s bar sells Pina Colada.', 'Walnuts: 20; Pina Colada: 600g', 'Pina Colada is a cooking recipe you cannot get anywhere else.', ['shop']),
   ('Parrot Express last.', 'Walnuts: 10', '116 walnuts buy everything; the other 14 are spare.', ['prep']),
   ('At 100 counted walnuts (101 found): Qi'+A+'s Walnut Room. Read the Perfection Tracker.', 'Walnuts: 100', 'The room is on the west coast of Island West. The tracker is the in-game version of this tab.', ['prep']),
   ('Fizz writes the next day; ignore him until the very end.', 'Waiver: 500,000g per 1%', 'He sells missing percent. Fourteen waivers (7,000,000g) replace the clock and obelisks if you would rather not build them.', ['money']),
   ('Qi'+A+'s first orders for gems: Qi'+A+'s Crop, Danger In The Deep, Skull Cavern Invasion.', 'Qi Gems: 100, 50, 40', 'The gems buy six crafting recipes and the Magic Bait that ends the fish problem.', ['mine', 'farm']),
   ('Gems into the six crafting recipes first.', 'Heavy Tapper: 20; Deluxe Fertilizer: 20; Magic Bait: 20; Hyper Speed-Gro: 30; Blue Grass Starter: 40; Hopper: 50 gems', 'Each recipe is a crafting requirement; 180 gems in all. The Hopper you can also buy for 10.', ['craft']),
   ('Then Pierre'+A+'s Missing Stocklist and the Key To The Town.', 'Qi Gems: 50 and 20', 'The stocklist sells every season'+A+'s seeds all year at +50%: out-of-season ingredients for the last recipes.', ['shop']),
   ('Magic Bait for the fish mop-up: any fish, any season, any weather.', 'Magic Bait: 5 gems per 20', 'It removes the calendar from the Fish list. Legendary fish still need their spots and levels.', ['fish']),
   ('Leo to 6 hearts so he moves to the valley.', '', 'Then he takes gifts on the mainland like everyone else. Mangoes and Duck Feathers are his loves.', ['social']),
 ]),
 ('4', 'The engine at full width', 'Fall Year 2', [
   ('Fill the island with Ancient Fruit from the Seed Maker; keep 60 to 80 Starfruit for cash.', '', 'A full island farm is about 1,600,000g of wine a week; the greenhouse adds 268,000g.', ['farm', 'money']),
   ('Kegs to match the weekly harvest.', 'Keg: 30 Wood, 1 Copper Bar, 1 Iron Bar, 1 Oak Resin each', '700 plants want 700 kegs: 21,000 Wood, 700 of each bar, 700 Oak Resin. Heavy Tappers halve the resin wait.', ['craft']),
   ('Ship the wine weekly.', 'Ancient Fruit Wine: 2,310g; Starfruit Wine: 3,150g, with Artisan', 'Casks double a bottle in 56 days, but the same keg fills eight bottles in that time: sell fresh.', ['money']),
   ('Deluxe Barn and pigs for Truffle and Truffle Oil on the shipped list.', 'Deluxe Barn: 25,000g, 550 Wood, 300 Stone; Pig: 16,000g; Oil Maker: 50 Slime, 20 Hardwood, 1 Gold Bar', 'Or ship the festival Truffle Oil and a cart Truffle and skip the pigs.', ['animals']),
   ('Fall forage and Fall crops onto the shipped list: Chanterelle, Wild Plum, Hazelnut, Blackberry, Broccoli.', 'Broccoli Seeds: 5 Moss at the raccoon', 'The raccoon'+A+'s wife trades the four 1.6 crop seeds nobody sells.', ['forage', 'farm']),
   ('Rare Seed by Fall 4 for the Sweet Gem Berry.', 'Rare Seed: 1,000g at the cart', 'Twenty-four days. One berry ships, one goes to Old Master Cannoli for the Stardrop.', ['farm']),
 ]),
 ('5', 'Winter, Year 2', 'Winter Year 2', [
   ('Ship the Winter forage and a Powdermelon.', 'Powdermelon Seeds: 2 Pine Cone at the raccoon', 'Holly, Crystal Fruit, Crocus, Snow Yam, Winter Root, Nautilus Shell. Powdermelon is the only outdoor Winter crop.', ['forage', 'farm']),
   ('Winter fish: Perch, Squid, Lingcod, Glacierfish; the Night Market submarine Winter 15 to 17.', '', 'Glacierfish sits at the south tip of Arrowhead Island in Cindersap Forest, Fishing 6. Magic Bait covers the rest.', ['fish']),
   ('Queen of Sauce: the last new recipe airs Winter 28, Year 2. Watch every Sunday; Wednesdays rerun.', '', 'The TV calendar is the one hard gate on the Cooking list. The Legend tab has the dates.', ['prep']),
   ('Feast of the Winter Star: the gift to your named villager counts five times.', '', 'Pierre'+A+'s booth there sometimes sells Powdermelon and Garlic.', ['festival', 'social']),
 ]),
 ('6', 'The wall: thirteen million', 'Year 3', [
   ('Wine every week until the money is there.', 'Target: 13,000,000g and 45 Iridium Bars', 'Greenhouse alone: about 48 weeks. Greenhouse plus a full island: about 7 weeks once every keg is turning.', ['money']),
   ('One or two lucky Skull Cavern days for the 45 Iridium Bars.', 'Staircase: 99 Stone each; Bomb: 4 Iron Ore, 1 Coal', 'Stairs to about floor 60, then mine and bomb. Jade in a Crystalarium buys staircases from the Desert Trader on Sundays.', ['mine']),
   ('Obelisks as the materials land.', 'Earth: 500,000g, 10 Iridium Bar, 10 Earth Crystal; Water: 500,000g, 5 Iridium Bar, 10 Clam, 10 Coral; Desert: 1,000,000g, 20 Iridium Bar, 10 Coconut, 10 Cactus Fruit; Island: 1,000,000g, 10 Iridium Bar, 10 Dragon Tooth, 10 Banana', 'Bought at the Wizard'+A+'s tower after the Goblin Problem quest; they build instantly.', ['money']),
   ('The Gold Clock.', 'Gold Clock: 10,000,000g', 'Or fourteen waivers at 500,000g each: cheaper, but the clock ends debris and fence decay for good.', ['money']),
   ('Monster goals in the Mines: Dust Sprites 500 first, then Void Spirits 150, Skeletons 50, Bats 200, Duggies 30, Rock Crabs 60, Cave Insects 80.', 'Monster Musk: 30 Bat Wing, 30 Slime (the Wizard'+A+'s order)', 'Dust Sprites first: their reward, the Burglar'+A+'s Ring, doubles drops for everything after. Musk doubles spawns.', ['mine']),
   ('Skull Cavern goals: Serpents 250, Mummies 100, Pepper Rex 50.', 'Bomb: 4 Iron Ore, 1 Coal', 'A Mummy only stays down if you bomb it. Pepper Rex live on the prehistoric floors.', ['mine']),
   ('Volcano: Magma Sprites 150.', '', 'Sprites and Sparkers both count.', ['mine']),
   ('Slimes 1,000 in the Mines and the Secret Woods; the Slime Hutch does not count.', '', 'Big Slimes do not count either. Every colour of ordinary slime does.', ['mine']),
   ('All five skills to 10, then the Mastery Cave: 100,000 points buy all five masteries.', '', 'Seven crafting recipes live there: Anvil, Mini-Forge, Statue Of Blessings, Statue Of The Dwarf King, Heavy Furnace, Mystic Tree Seed, Treasure Totem, plus Challenge Bait.', ['prep']),
   ('The bought and ordered recipes.', 'Fish Smoker: 10,000g; Dehydrator: 10,000g; Big Chest: 5,000g; Big Stone Chest: 5,000g; Warp Totem: Island: 10,000g', 'The Special Orders give Solar Panel, Bone Mill, Geode Crusher, Farm Computer, Stone Chest, Mini-Obelisk, Monster Musk, Quality Bobber; the Deluxe Scarecrow needs all eight rarecrows.', ['craft']),
   ('The last cooking recipes: Pina Colada at the Resort, Moss Soup at Foraging 3, the friendship mails.', 'Pina Colada: 600g', 'Keep one of every ingredient in a chest; there are 88 kinds across the 81 dishes.', ['craft']),
   ('The seven Stardrops.', 'Krobus Stardrop: 20,000g', 'Fair, Mines 100, Krobus, Old Master Cannoli, a spouse at 12.5 hearts, Willy'+A+'s letter after all 72 fish, 95 museum pieces.', ['prep']),
   ('Great Friends: two loved gifts a week to all 34, every birthday, a Bouquet for each of the twelve.', 'Bouquet: 200g each', 'Candidates stop at 8 hearts, which is all perfection asks; the others need 10. The People tab has the cheap loves.', ['social']),
 ]),
 ('7', 'The last week', 'when the tracker reads 99', [
   ('Read the tracker: every line must show 100; it rounds down.', '', 'One missing Tomato on the shipped list is a whole percent.', ['prep']),
   ('Cook the last dishes from the ingredient chest, ship the last item, catch the last fish.', '', 'Magic Bait for the fish, the Missing Stocklist for the ingredients.', ['prep']),
   ('Sleep. The Summit and the Statue of True Perfection come the next morning.', '', 'Golden chickens, the ??? hat, and a statue that drops Prismatic Shards.', ['prep']),
 ]),
]
route = []
for n, t, when, steps in R:
    route.append({'n': n, 't': t, 'when': when, 'steps': [st(int(n), j + 1, x[0], x[1], x[2], x[3]) for j, x in enumerate(steps)]})

total = sum(c['weight'] for c in cats)
assert total == 100, total
out = "/* Farmhand's Route - perfection tracker data, assembled by tools/build_perfection.py from the wiki dossiers\n   (Perfection, Golden Walnut, Fish, Cooking, Collections, Crafting pages, 1.6). Weights are the game's own. */\n'use strict';\nvar PERF = " + json.dumps({'cats': cats, 'route': route}, ensure_ascii=False, separators=(',', ':')) + ";\n"
open(os.path.join(ROOT, 'js', 'perfection.js'), 'w', encoding='utf-8').write(out)
n = sum(len(g['items']) for c in cats for g in c['groups'])
print('perfection.js written: %d categories, %d requirements, %d route phases' % (len(cats), n, len(route)))
for c in cats:
    k = sum(len(g['items']) for g in c['groups']); print('  %-28s %3d items in %d groups' % (c['name'], k, len(c['groups'])))
