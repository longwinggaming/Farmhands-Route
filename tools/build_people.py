"""Farmhand's Route - assembles js/people.js from the marriage dossier's JSON block (wiki candidate pages, Marriage,
Friendship, Multiplayer). Run from the repo root: python tools/build_people.py <scratchpad dir>"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'research')
t = open(os.path.join(SP, 'sdv-13-marriage.md'), encoding='utf-8').read()
D = json.loads(re.search(r'```json\s*(.*?)```', t, re.S).group(1))

def slug(s): return re.sub(r'^-|-$', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))
def clauses(s, n=120):
    out = []
    for part in re.split(r';\s*', re.sub(r'\s+', ' ', str(s or '')).strip()):
        if not part: continue
        if len('; '.join(out + [part])) > n: break
        out.append(part)
    return '; '.join(out) if out else short(s, n)

def short(s, n=120):
    s = re.sub(r'\s+', ' ', str(s or '')).strip()
    if len(s) <= n: return s
    cut = s[:n]; return (cut[:cut.rfind(' ')] if ' ' in cut else cut).rstrip(',;:')

BACHELORETTES = {'Abigail', 'Emily', 'Haley', 'Leah', 'Maru', 'Penny'}
BIRTHDAYS = {'Kent': 'Spring 4', 'Lewis': 'Spring 7', 'Vincent': 'Spring 10', 'Haley': 'Spring 14', 'Pam': 'Spring 18', 'Shane': 'Spring 20', 'Pierre': 'Spring 26', 'Emily': 'Spring 27',
 'Jas': 'Summer 4', 'Gus': 'Summer 8', 'Maru': 'Summer 10', 'Alex': 'Summer 13', 'Sam': 'Summer 17', 'Demetrius': 'Summer 19', 'Dwarf': 'Summer 22', 'Willy': 'Summer 24', 'Leo': 'Summer 26',
 'Penny': 'Fall 2', 'Elliott': 'Fall 5', 'Jodi': 'Fall 11', 'Abigail': 'Fall 13', 'Sandy': 'Fall 15', 'Marnie': 'Fall 18', 'Robin': 'Fall 21', 'George': 'Fall 24',
 'Krobus': 'Winter 1', 'Linus': 'Winter 3', 'Caroline': 'Winter 7', 'Sebastian': 'Winter 10', 'Harvey': 'Winter 14', 'Wizard': 'Winter 17', 'Evelyn': 'Winter 20', 'Leah': 'Winter 23', 'Clint': 'Winter 26'}

cards = []
R = D['rules']
cards.append({'id': 'marriage', 'name': 'Getting married', 'kind': 'Other', 'lives': 'The rules, in order',
 'note': short(R.get('groupTenHeartEvent', ''), 200),
 'path': [
  {'id': 'talk', 't': 'Talk every day and give two gifts a week.', 'how': '250 points a heart: talking 20, a liked gift 45, a loved one 80, eight times that on a birthday; disliked -20, hated -40.'},
  {'id': 'eight', 't': 'Reach 8 hearts; the Bouquet letter arrives the next morning.', 'how': 'Candidates stop at 8 until they have a Bouquet. Dating several at once carries no penalty except the group event.'},
  {'id': 'bouquet', 't': 'Buy a Bouquet and give it.', 'how': 'Bouquet: 200g at Pierre’s. Hearts 9 and 10 open; a Wilted Bouquet (Bouquet + Coal in a Furnace) ends it.'},
  {'id': 'house', 't': 'House Upgrade 1 (the host).', 'how': 'House upgrade: 10,000g, 450 Wood, 3 days at Robin’s. The pendant will not be sold without it.'},
  {'id': 'pendant', 't': 'At 10 hearts, buy the Mermaid’s Pendant from the Old Mariner.', 'how': 'Mermaid’s Pendant: 5,000g. East beach past the tide-pool bridge, rainy day 6am to 7pm, not in Winter, not during the Night Market.'},
  {'id': 'propose', 't': 'Give the pendant; the wedding is three days later.', 'how': 'Festivals and Green Rain push it back a day. Spouses can reach 14 hearts and give a Stardrop at 12.5.'},
  {'id': 'coop', 't': 'Marrying each other in co-op: craft a Wedding Ring and give it to the other player.', 'how': 'Wedding Ring recipe: 500g at the Traveling Cart (always stocked in co-op until bought); 5 Iridium Bar, 1 Prismatic Shard. Wedding three days later; a Stardrop appears by each bed.'},
  {'id': 'kids', 't': 'Children: House Upgrade 2, 10 hearts, a week married.', 'how': 'House Upgrade 2: 65,000g, 100 Hardwood. The question comes at night about one time in twenty; the baby arrives 14 days later; two at most.'},
  {'id': 'divorce', 't': 'Divorce: 50,000g at the Mayor’s Manor, effective the next morning.', 'how': 'The ex keeps no hearts. Each villager can be married by only one player.'}
 ]})

for c in D['candidates']:
    kind = 'Bachelorette' if c['name'] in BACHELORETTES else 'Bachelor'
    loves = ', '.join(c.get('loves', []))
    hates = ', '.join(c.get('hates', []))
    dg = c.get('dislikeGroups', [])
    if dg: hates = (hates + '; dislikes ' + dg[0]) if hates else 'dislikes ' + dg[0]
    path = []
    for e in c.get('events', []):
        h = e.get('hearts')
        what = short(e.get('what', ''), 90)
        path.append({'id': 'h%s' % h, 'hearts': h, 't': what, 'how': short(e.get('trigger', ''), 140), 'w': short(e.get('choice', ''), 140) if e.get('choice') and e.get('choice') not in ('none', 'none (no effect)', 'all 0') else ''})
    cards.append({'id': slug(c['name']), 'name': c['name'], 'kind': kind, 'birthday': c.get('birthday') or BIRTHDAYS.get(c['name'], ''),
                  'lives': short(c.get('lives', ''), 60), 'find': clauses(c.get('find', ''), 120), 'loves': short(loves, 160), 'cheap': short(c.get('cheapLove', ''), 60), 'hates': short(hates, 120), 'path': path})

others = {}
for o in D['others']:
    others.setdefault(o['name'], []).append(o)
for name, rows in others.items():
    disp = name.replace('Vincent+Jas', 'Vincent and Jas')
    path = []
    for i, o in enumerate(rows):
        path.append({'id': 'e%d' % (i + 1), 'hearts': o.get('hearts'), 't': short(o.get('gives', ''), 90), 'how': short(o.get('trigger', ''), 140)})
    cards.append({'id': slug(disp), 'name': disp, 'kind': 'Other', 'birthday': BIRTHDAYS.get(disp, ''), 'path': path})

out = ("/* Farmhand's Route - marriage candidates, heart events and the villager scenes that unlock things. Assembled by\n"
       "   tools/build_people.py from the wiki (Marriage, Friendship, Multiplayer and each villager page, 1.6). */\n'use strict';\nvar PEOPLE = "
       + json.dumps({'cards': cards}, ensure_ascii=False, separators=(',', ':')) + ";\n")
open(os.path.join(ROOT, 'js', 'people.js'), 'w', encoding='utf-8').write(out)
print('people.js written: %d cards (%d candidates), %d path items' % (len(cards), sum(1 for c in cards if c['kind'] != 'Other'), sum(len(c['path']) for c in cards)))
