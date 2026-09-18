/* Farmhand's Route - data sweep. Loads the data files the way the page does and checks ids, references,
   placeholders and the rules the app relies on. Run: node tools/check.js */
'use strict';
var fs = require('fs'), path = require('path'), vm = require('vm');
var root = path.join(__dirname, '..');
var ctx = {window:{}, console:console};
ctx.window = ctx;
vm.createContext(ctx);
['js/data.js','js/bundles.js','js/legend.js','js/items.js','js/perfection.js','js/people.js','js/art.js'].forEach(function(f){
  var p = path.join(root, f);
  if(!fs.existsSync(p)){ console.log('note: '+f+' not present yet, its checks are skipped'); return; }
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, {filename:f});
});
var errs = [], warns = [];
function err(m){ errs.push(m); }
function warn(m){ warns.push(m); }
var PLACEHOLDER = /\b(TODO|TBD|FIXME|XXX|lorem|placeholder|verify this|\?\?\?)\b/i;
var ids = {};
function checkStep(st, where){
  if(!st || typeof st!=='object') return err(where+': step is not an object');
  if(!st.id) return err(where+': step without id');
  if(ids[st.id]) err(where+': duplicate step id '+st.id+' (also in '+ids[st.id]+')');
  ids[st.id] = where;
  if(!st.t || typeof st.t!=='string') err(where+' '+st.id+': no text');
  else {
    if(st.t.length > 140) warn(where+' '+st.id+': long step ('+st.t.length+' chars): '+st.t.slice(0,60));
    if(!/[.!?]$/.test(st.t.trim())) warn(where+' '+st.id+': step does not end in a full stop: '+st.t.slice(0,60));
    if(PLACEHOLDER.test(st.t)) err(where+' '+st.id+': placeholder in text: '+st.t);
  }
  if(st.c && PLACEHOLDER.test(st.c)) err(where+' '+st.id+': placeholder in cost');
  if(st.w && PLACEHOLDER.test(st.w)) err(where+' '+st.id+': placeholder in why');
  if(st.p!=null && [0,1,2].indexOf(st.p)===-1) err(where+' '+st.id+': bad player '+st.p);
  if(st.set && ['std','remix'].indexOf(st.set)===-1) err(where+' '+st.id+': bad set '+st.set);
  (st.tags||[]).forEach(function(t){ if(!/^[a-z]+$/.test(t)) err(where+' '+st.id+': odd tag '+t); });
  if(st.c && /\d+g\b/.test(st.c)===false && /\d/.test(st.c)===false) warn(where+' '+st.id+': cost has no number: '+st.c);
}
/* seasons */
var S = ctx.SEASONS;
if(!Array.isArray(S) || S.length!==4) err('SEASONS must have 4 seasons');
var seasonIds = {};
(S||[]).forEach(function(s){
  seasonIds[s.id] = true;
  ['id','name','kicker','goal','must','money'].forEach(function(k){ if(!s[k]) err('season '+s.id+': missing '+k); });
  if(!Array.isArray(s.phases) || !s.phases.length) err('season '+s.id+': no phases');
  (s.phases||[]).forEach(function(p){
    if(!p.n || !p.t || !p.when) err('season '+s.id+' phase '+(p.n||'?')+': needs n, t, when');
    if(!Array.isArray(p.steps) || !p.steps.length) err('season '+s.id+' phase '+p.n+': no steps');
    (p.steps||[]).forEach(function(st){ checkStep(st, s.id+'/'+p.n); });
  });
  (s.avoid||[]).forEach(function(a){ if(PLACEHOLDER.test(a)) err('season '+s.id+': placeholder in avoid'); });
});
/* engines */
var E = ctx.ENGINES, EO = ctx.ENGINE_ORDER;
if(!E || !Array.isArray(EO)) err('ENGINES / ENGINE_ORDER missing');
(EO||[]).forEach(function(k){
  var e = E[k]; if(!e) return err('engine '+k+' in ENGINE_ORDER but not in ENGINES');
  ['name','from','price','sum'].forEach(function(f){ if(!e[f]) err('engine '+k+': missing '+f); });
  if(!Array.isArray(e.ladder) || !e.ladder.length) err('engine '+k+': no ladder');
  (e.ladder||[]).forEach(function(r, i){ if(!r.name) err('engine '+k+' rung '+i+': no name'); if(PLACEHOLDER.test(JSON.stringify(r))) err('engine '+k+' rung '+i+': placeholder'); });
  if(!e.seasons) err('engine '+k+': no seasons');
  Object.keys(e.seasons||{}).forEach(function(sid){
    if(!seasonIds[sid]) err('engine '+k+': unknown season '+sid);
    e.seasons[sid].forEach(function(st){ checkStep(st, 'engine '+k+'/'+sid); });
  });
});
Object.keys(E||{}).forEach(function(k){ if(EO.indexOf(k)===-1) err('engine '+k+' not in ENGINE_ORDER'); });
/* brief, finish, notes */
var B = ctx.BRIEF;
if(!B || !B.seasons || !B.split || !B.solo) err('BRIEF needs seasons, split, solo');
else {
  Object.keys(seasonIds).forEach(function(sid){ if(!B.seasons[sid] || !B.seasons[sid].must || !B.seasons[sid].must.length) err('BRIEF.seasons.'+sid+' missing must list'); });
  if(!B.split.p1 || !B.split.p2) err('BRIEF.split needs p1 and p2');
}
if(!Array.isArray(ctx.FINISH) || !ctx.FINISH.length) err('FINISH missing');
if(!ctx.NOTES || !ctx.NOTES.intro || !Array.isArray(ctx.NOTES.items)) err('NOTES needs intro and items');
/* bundles */
var R = ctx.ROOMS, BU = ctx.BUNDLES;
if(!Array.isArray(R) || !R.length) err('ROOMS missing');
if(!Array.isArray(BU) || !BU.length) err('BUNDLES missing');
var roomIds = {}; (R||[]).forEach(function(r){ roomIds[r.id]=true; if(!r.name || !r.reward) err('room '+r.id+': needs name and reward'); });
var bids = {}, itemKeys = {};
(BU||[]).forEach(function(b){
  if(!b.id) return err('bundle without id: '+JSON.stringify(b).slice(0,60));
  if(bids[b.id]) err('duplicate bundle id '+b.id); bids[b.id]=true;
  if(!roomIds[b.room]) err('bundle '+b.id+': unknown room '+b.room);
  if(['std','remix'].indexOf(b.set)===-1) err('bundle '+b.id+': bad set '+b.set);
  if(!b.name || !b.reward) err('bundle '+b.id+': needs name and reward');
  if(!Array.isArray(b.items) || !b.items.length) return err('bundle '+b.id+': no items');
  if(!(b.need>=1 && b.need<=b.items.length)) err('bundle '+b.id+': need '+b.need+' of '+b.items.length);
  b.items.forEach(function(it){
    var key = 'b:'+b.id+':'+it.id;
    if(!it.id) err('bundle '+b.id+': item without id: '+it.name);
    if(itemKeys[key]) err('bundle '+b.id+': duplicate item id '+it.id); itemKeys[key]=true;
    ['name','cat','season','how'].forEach(function(f){ if(!it[f]) err('bundle '+b.id+' item '+(it.name||it.id)+': missing '+f); });
    if(it.how && it.how.length > 110) warn('bundle '+b.id+' item '+it.name+': long how ('+it.how.length+')');
    if(PLACEHOLDER.test(JSON.stringify(it))) err('bundle '+b.id+' item '+it.name+': placeholder');
    if(!(it.qty>=1)) err('bundle '+b.id+' item '+it.name+': qty');
  });
});
['std','remix'].forEach(function(set){
  (R||[]).forEach(function(r){
    var n = (BU||[]).filter(function(b){ return b.set===set && b.room===r.id; }).length;
    if(!n) err('room '+r.id+' has no '+set+' bundles');
    if(set==='remix' && r.slots && n < r.slots) err('room '+r.id+': remixed has '+n+' variants but '+r.slots+' slots');
  });
});
/* legend */
var L = ctx.LEGEND;
if(!Array.isArray(L) || !L.length) err('LEGEND missing');
var lids = {};
(L||[]).forEach(function(sec){
  if(!sec.id || !sec.title) err('legend section without id/title');
  if(lids[sec.id]) err('duplicate legend id '+sec.id); lids[sec.id]=true;
  if(!Array.isArray(sec.blocks) || !sec.blocks.length) err('legend '+sec.id+': no blocks');
  (sec.blocks||[]).forEach(function(b, i){
    if(!b.h) err('legend '+sec.id+' block '+i+': no heading');
    if(b.table){
      if(!Array.isArray(b.table.cols) || !Array.isArray(b.table.rows)) err('legend '+sec.id+' block '+i+': table needs cols and rows');
      else b.table.rows.forEach(function(r, ri){ if(r.length!==b.table.cols.length) err('legend '+sec.id+' block '+i+' row '+ri+': '+r.length+' cells for '+b.table.cols.length+' cols ('+r[0]+')'); if(PLACEHOLDER.test(r.join('|'))) err('legend '+sec.id+' block '+i+' row '+ri+': placeholder'); });
    }
    if(PLACEHOLDER.test((b.p||'')+(b.notes||[]).join(' '))) err('legend '+sec.id+' block '+i+': placeholder');
  });
});
/* items */
var I = ctx.ITEMS;
if(!Array.isArray(I) || !I.length) err('ITEMS missing');
var inames = {};
(I||[]).forEach(function(it){
  if(!it.name) return err('item without name');
  if(inames[it.name]) err('duplicate item name '+it.name); inames[it.name]=true;
  if(['Tool','Machine','Building','Weapon','Gear'].indexOf(it.cat)===-1) err('item '+it.name+': bad cat '+it.cat);
  if(!it.use) err('item '+it.name+': no use line');
  if(it.use && it.use.length > 120) warn('item '+it.name+': long use ('+it.use.length+')');
  if(!it.from) err('item '+it.name+': no from');
  if(it.cat==='Building' && !it.nofp && !(it.w>0 && it.h>0)) err('item '+it.name+': building without footprint');
  if(it.cat!=='Building' && (it.w||it.h)) warn('item '+it.name+': footprint on a non-building');
  if(!it.gold && !it.mats && !(it.tiers&&it.tiers.length)) warn('item '+it.name+': no cost, no materials, no tiers');
  if(PLACEHOLDER.test(JSON.stringify(it))) err('item '+it.name+': placeholder');
});
/* perfection */
var PF = ctx.PERF;
if(PF===undefined){ /* not shipped yet */ }
else if(!PF || !Array.isArray(PF.cats) || !Array.isArray(PF.route)) err('PERF needs cats and route');
else {
  var wsum = 0, pfKeys = {};
  PF.cats.forEach(function(cat){
    if(!cat.id || !cat.name || !(cat.weight>0)) err('perf cat missing id/name/weight: '+JSON.stringify(cat).slice(0,60));
    wsum += cat.weight||0;
    if(!Array.isArray(cat.groups) || !cat.groups.length) return err('perf cat '+cat.id+': no groups');
    var n = 0;
    cat.groups.forEach(function(g){
      if(!g.name) err('perf cat '+cat.id+': group without name');
      (g.items||[]).forEach(function(it){
        n++;
        if(!it.id || !it.name) err('perf '+cat.id+'/'+g.name+': item without id or name: '+JSON.stringify(it).slice(0,60));
        var k = cat.id+':'+it.id; if(pfKeys[k]) err('perf duplicate item id '+k); pfKeys[k] = true;
        if(it.count!=null && !(it.count>=1)) err('perf '+k+': bad count');
        if(PLACEHOLDER.test(JSON.stringify(it))) err('perf '+k+': placeholder');
      });
    });
    if(cat.expect && n!==cat.expect) err('perf cat '+cat.id+': '+n+' items, expected '+cat.expect);
  });
  if(wsum!==100) err('perf weights sum to '+wsum+', not 100');
  PF.route.forEach(function(p){
    if(!p.n || !p.t || !p.when) err('perf route phase needs n, t, when: '+(p.t||'?'));
    (p.steps||[]).forEach(function(st){ checkStep(st, 'perf route '+p.n); });
  });
}
/* people */
var PP = ctx.PEOPLE;
if(PP===undefined){ /* not shipped yet */ }
else if(!PP || !Array.isArray(PP.cards) || !PP.cards.length) err('PEOPLE needs cards');
else {
  var cids = {};
  PP.cards.forEach(function(c){
    if(!c.id || !c.name || !c.kind) err('people card missing id/name/kind: '+(c.name||'?'));
    if(cids[c.id]) err('people duplicate id '+c.id); cids[c.id] = true;
    if(['Bachelor','Bachelorette','Other'].indexOf(c.kind)===-1) err('people '+c.id+': bad kind '+c.kind);
    if(!Array.isArray(c.path) || !c.path.length) err('people '+c.id+': no path');
    var pids = {};
    (c.path||[]).forEach(function(it){
      if(!it.id || !it.t) err('people '+c.id+': path item without id or t');
      if(pids[it.id]) err('people '+c.id+': duplicate path id '+it.id); pids[it.id] = true;
      if(PLACEHOLDER.test(JSON.stringify(it))) err('people '+c.id+'/'+it.id+': placeholder');
    });
    if(PLACEHOLDER.test((c.loves||'')+(c.likes||'')+(c.hates||'')+(c.cheap||'')+(c.lives||'')+(c.find||''))) err('people '+c.id+': placeholder in bio');
  });
  var cand = PP.cards.filter(function(c){ return c.kind!=='Other'; }).length;
  if(cand!==12) err('people: expected 12 candidates, got '+cand);
}
/* art */
if(ctx.ART){
  var missing = [];
  Object.keys(ctx.ITEM_INFO||{}).forEach(function(n){ if(!/^\d/.test(n) && !ctx.ART.map[n]) missing.push(n); });
  if(missing.length) warn('no icon for bundle items: '+missing.join(', '));
}
/* report */
var stepCount = Object.keys(ids).length;
var pfItems = 0; ((PF&&PF.cats)||[]).forEach(function(c){ c.groups.forEach(function(g){ pfItems += (g.items||[]).length; }); });
console.log('steps: '+stepCount+', bundles: '+(BU||[]).length+', bundle items: '+Object.keys(itemKeys).length+', legend sections: '+(L||[]).length+', items: '+(I||[]).length+', perfection requirements: '+pfItems+', people cards: '+((PP&&PP.cards)||[]).length);
warns.forEach(function(w){ console.log('warn: '+w); });
errs.forEach(function(e){ console.log('ERROR: '+e); });
console.log(errs.length ? errs.length+' errors, '+warns.length+' warnings' : 'no errors, '+warns.length+' warnings');
process.exit(errs.length ? 1 : 0);
