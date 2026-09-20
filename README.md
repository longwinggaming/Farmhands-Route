# Farmhand's Route

A Stardew Valley 1.6 planner for two players on one farm: the Community Center done by the end of Year 1, a money engine into Year 2, then the road to Perfection. Built for a phone in one hand and a controller in the other: every step is one line, every cost names its items, the reasons stay folded away.

Sections: Route (Spring 1 to Winter 28, tickable), Bundles (standard and remixed), Focus (money engines), Perfection, People (birthdays, gifts, heart events), Legend (fish, crops, artisan goods, skills, calendar), Items.

## Running it

Static files, no build step. Open `index.html` through any web server (for example `python -m http.server 8766` in this folder). Installed as a home-screen app it works with no connection: `sw.js` caches everything on first load.

After a change that should reach installed phones: `python tools/make_sw.py`, commit, push.

- `node tools/check.js` checks the data (ids, references, weights, placeholders).
- `tools/sweep.js` drives every control on the live page; run it from the browser console.
- `node tools/art_names.js > art/names.json && python tools/fetch_art.py` rebuilds the sprite sheet when new item names appear.
- `python tools/make_icons.py` rebuilds the app icons.

## Credits

Game facts come from the [Stardew Valley Wiki](https://stardewvalleywiki.com) (CC BY-NC-SA 3.0), read through its API and checked against version 1.6. Item and portrait art is from the game, © ConcernedApe, used here in a free fan guide. Not affiliated with ConcernedApe.
