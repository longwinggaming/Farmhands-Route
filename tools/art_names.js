/* Farmhand's Route - lists every name the page could show an icon for. Run: node tools/art_names.js > art/names.json */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
var ctx = {window:{}, console:console}; ctx.window = ctx; vm.createContext(ctx);
['js/data.js','js/bundles.js','js/legend.js','js/items.js','js/perfection.js','js/people.js'].forEach(function(f){
  var p = path.join(root, f); if(fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, {filename:f});
});
var items = {}, portraits = {};
function add(n){ if(n && typeof n==='string' && !/^\d/.test(n)) items[n] = true; }
Object.keys(ctx.ITEM_INFO||{}).forEach(add);
(ctx.ITEMS||[]).forEach(function(it){ if(!it.nofp) add(it.name); });
(ctx.LEGEND||[]).forEach(function(sec){ sec.blocks.forEach(function(b){
  if(!b.table) return;
  var first = String(b.table.cols[0]||'').toLowerCase();
  if(sec.id==='gifts' && first==='villager'){ b.table.rows.forEach(function(r){ portraits[r[0]] = true; }); return; }
  if(['crop','fish','item','animal','gear','thing','machine','crop (base)','sapling'].indexOf(first)>-1) b.table.rows.forEach(function(r){ add(String(r[0]).replace(/\s+\d+g$/,'').replace(/\s*\(.*\)$/,'')); });
}); });
Object.keys(ctx.ENGINES||{}).forEach(function(k){ (ctx.ENGINES[k].ladder||[]).forEach(function(r){ add(r.name.replace(/\s*\(.*\)$/,'')); }); });
if(ctx.PERF){ ctx.PERF.cats.forEach(function(c){ c.groups.forEach(function(g){ g.items.forEach(function(it){ if(it.icon!==false){ if(c.id==='friends') portraits[it.icon||it.name] = true; else add(it.icon || it.name); } }); }); }); }
if(ctx.PEOPLE){ ctx.PEOPLE.cards.forEach(function(c){ if(c.id!=='marriage' && c.name.indexOf(' and ')===-1) portraits[c.name] = true; }); }
['Golden Walnut','Stardrop','Gold Clock','Earth Obelisk','Water Obelisk','Desert Obelisk','Island Obelisk','Junimo Hut','Prismatic Shard','Bouquet','Mermaid’s Pendant','Wedding Ring','Qi Gem'].forEach(add);
process.stdout.write(JSON.stringify({items:Object.keys(items).sort(), portraits:Object.keys(portraits).sort()}, null, 1));
