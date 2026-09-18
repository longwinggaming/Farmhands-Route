/* Farmhand's Route - rendering and state. Data lives in data.js, bundles.js, legend.js, items.js. */
(function(){
'use strict';

/* ---------- STATE ---------- */
var KEY = 'farmhand-route:v1';
var VIEWS = ['route','bundles','focus','perf','people','legend','items'];
var state = {view:'route', pro:true, season:'spring', setupOpen:true, briefOpen:false, coop:true, who:'both', set:'std', engines:['berries'],
  done:{}, phaseOpen:{}, legendOpen:{}, room:'all', bshow:'all', iCat:'all', iSrc:'all', iQ:'', pcat:'all', pshow:'all', pq:'', ppl:'all', pplShow:'all'};
try{
  var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
  if(saved && typeof saved === 'object'){
    state.setupOpen = false;
    if(VIEWS.indexOf(saved.view)>-1) state.view = saved.view;
    if(typeof saved.pro==='boolean') state.pro = saved.pro;
    if(SEASONS.some(function(s){return s.id===saved.season;})) state.season = saved.season;
    if(typeof saved.setupOpen==='boolean') state.setupOpen = saved.setupOpen;
    if(typeof saved.briefOpen==='boolean') state.briefOpen = saved.briefOpen;
    if(typeof saved.coop==='boolean') state.coop = saved.coop;
    if(['both','p1','p2'].indexOf(saved.who)>-1) state.who = saved.who;
    if(['std','remix'].indexOf(saved.set)>-1) state.set = saved.set;
    if(Array.isArray(saved.engines)) state.engines = saved.engines.filter(function(k){ return !!ENGINES[k]; });
    if(saved.done && typeof saved.done==='object') state.done = saved.done;
    if(saved.phaseOpen && typeof saved.phaseOpen==='object') state.phaseOpen = saved.phaseOpen;
    if(saved.legendOpen && typeof saved.legendOpen==='object') state.legendOpen = saved.legendOpen;
    if(typeof saved.room==='string') state.room = saved.room;
    if(['all','todo','oneshot'].indexOf(saved.bshow)>-1) state.bshow = saved.bshow;
    if(typeof saved.iCat==='string') state.iCat = saved.iCat;
    if(typeof saved.iSrc==='string') state.iSrc = saved.iSrc;
    if(typeof saved.iQ==='string') state.iQ = saved.iQ;
    if(typeof saved.pcat==='string') state.pcat = saved.pcat;
    if(['all','todo'].indexOf(saved.pshow)>-1) state.pshow = saved.pshow;
    if(typeof saved.pq==='string') state.pq = saved.pq;
    if(typeof saved.ppl==='string') state.ppl = saved.ppl;
    if(['all','todo'].indexOf(saved.pplShow)>-1) state.pplShow = saved.pplShow;
  }
}catch(e){}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }

/* ---------- HELPERS ---------- */
function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function icon(name, size){
  var a = window.ART && ART.map[name]; if(!a) return '';
  var s = size || 32, k = s / a[2];
  return '<i class="ico" style="width:'+s+'px;height:'+s+'px;background-position:-'+(a[0]*k)+'px -'+(a[1]*k)+'px;background-size:'+(ART.w*k)+'px '+(ART.h*k)+'px" aria-hidden="true"></i>';
}
function joinList(arr, none){
  if(!arr.length) return none || 'nothing';
  if(arr.length===1) return arr[0];
  return arr.slice(0,-1).join(', ') + ' and ' + arr[arr.length-1];
}
function toast(msg){
  var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(function(){ t.classList.remove('on'); }, 1800);
}
/* a step is visible when it matches the bundle set and, in co-op, the chosen player */
function stepVisible(st){
  if(st.set==='remix' && state.set!=='remix') return false;
  if(state.coop && state.who!=='both'){
    var p = st.p|0; if(p && ('p'+p)!==state.who) return false;
  }
  return true;
}
function currentSeason(){ return SEASONS.filter(function(s){ return s.id===state.season; })[0] || SEASONS[0]; }
function seasonIndex(){ return SEASONS.indexOf(currentSeason()); }
function enginePhases(seasonId){
  var out = [];
  state.engines.forEach(function(k){
    var e = ENGINES[k]; var steps = e.seasons[seasonId];
    if(steps && steps.length) out.push({kind:'engine',ek:k,label:'ENGINE',pid:seasonId+'-eng-'+k,t:e.name,steps:steps});
  });
  return out;
}
function allPhases(season){
  var base = season.phases.map(function(p){ return {kind:'base',label:'',pid:season.id+'-'+p.n,n:p.n,t:p.t,when:p.when,steps:p.steps}; });
  return base.concat(enginePhases(season.id));
}

/* ---------- GENERIC CONTROLS ---------- */
/* native select: opts = [{v,l}], current value, onChange(value) */
function fillSelect(id, opts, cur, onChange){
  var sel = document.getElementById(id); if(!sel) return;
  sel.innerHTML = opts.map(function(o){ return '<option value="'+esc(o.v)+'"'+(o.v===cur?' selected':'')+'>'+esc(o.l)+'</option>'; }).join('');
  sel.onchange = function(){ onChange(sel.value); };
}
/* checklist dropdown: items = [{id,label,extra,on,head?}], labelHTML -> button text, onToggle(id) */
var openDD = null;
function fillDD(id, items, labelHTML, onToggle){
  var box = document.getElementById(id); if(!box) return;
  var open = openDD === id;
  var h = '<button type="button" aria-expanded="'+(open?'true':'false')+'">'+labelHTML+'</button>';
  if(open){
    h += '<div class="ddpanel">'+items.map(function(it){
      if(it.head) return '<div class="ddhead">'+esc(it.head)+'</div>';
      return '<label class="ddrow"><input type="checkbox" data-id="'+esc(it.id)+'"'+(it.on?' checked':'')+'><span>'+esc(it.label)+'</span>'+(it.extra?'<small>'+esc(it.extra)+'</small>':'')+'</label>';
    }).join('')+'</div>';
  }
  box.innerHTML = h;
  box.querySelector('button').addEventListener('click', function(e){ e.stopPropagation(); openDD = open ? null : id; renderAll(); });
  box.querySelectorAll('input[type=checkbox]').forEach(function(cb){
    cb.addEventListener('change', function(){ onToggle(cb.getAttribute('data-id')); });
  });
  if(open) box.querySelector('.ddpanel').addEventListener('click', function(e){ e.stopPropagation(); });
}
document.addEventListener('click', function(){ if(openDD){ openDD = null; renderAll(); } });
document.addEventListener('touchstart', function(e){ if(openDD && !e.target.closest('.dd')){ openDD = null; renderAll(); } }, {passive:true});
document.addEventListener('keydown', function(e){ if(e.key==='Escape' && openDD){ openDD = null; renderAll(); } });

/* ---------- SETUP ---------- */
var SET_LABEL = {std:'Standard bundles', remix:'Remixed bundles'};
var WHO = [{id:'both',code:'BOTH',name:'whole day',cls:''},{id:'p1',code:'P1',name:'farmer',cls:'p1'},{id:'p2',code:'P2',name:'fisher, miner',cls:'p2'}];
function engineNames(){ return state.engines.map(function(k){ return ENGINES[k].name; }); }
function renderSetupSummary(){
  var el = document.getElementById('setupSum');
  var who = state.coop ? (state.who==='both' ? '2 players' : (state.who==='p1' ? 'Player 1' : 'Player 2')) : 'solo';
  var eng = engineNames();
  el.innerHTML = '<span class="sum-p">'+esc(who.toUpperCase())+'</span>'+
    '<span class="sum-t"><b>'+esc(SET_LABEL[state.set])+'</b> · '+(eng.length ? 'Engines: <b>'+esc(eng.join(', '))+'</b>' : 'no engine picked')+'</span>'+
    '<button type="button" id="setupToggle">'+(state.setupOpen?'Done':'Change')+'</button>';
  document.getElementById('setup').hidden = !state.setupOpen;
  document.getElementById('setupToggle').addEventListener('click', function(){ state.setupOpen = !state.setupOpen; save(); renderSetupSummary(); });
}
function engineItems(){
  return ENGINE_ORDER.map(function(k){ return {id:k, label:ENGINES[k].name, extra:ENGINES[k].from, on:state.engines.indexOf(k)>-1}; });
}
function engineLabel(){
  var eng = engineNames();
  return eng.length ? '<b>'+esc(eng.join(', '))+'</b>' : '<b>None picked</b> <small>choose one or two</small>';
}
function toggleEngine(k){
  var i = state.engines.indexOf(k); if(i>-1) state.engines.splice(i,1); else state.engines.push(k);
  state.engines = ENGINE_ORDER.filter(function(x){ return state.engines.indexOf(x)>-1; });
  save(); renderAll();
}
function renderSetup(){
  fillSelect('coopSel', [{v:'coop', l:'Two players, one farm (co-op)'},{v:'solo', l:'One player'}], state.coop?'coop':'solo', function(v){ state.coop = (v==='coop'); if(!state.coop) state.who='both'; save(); renderAll(); });
  var wf = document.getElementById('whoField'); wf.hidden = !state.coop;
  var wh = document.getElementById('who'); wh.innerHTML = '';
  WHO.forEach(function(w){
    var b = document.createElement('button'); b.type='button'; b.className = w.cls; b.setAttribute('aria-pressed', String(state.who===w.id));
    b.innerHTML = '<span class="code">'+esc(w.code)+'</span><span class="name">'+esc(w.name)+'</span>';
    b.addEventListener('click', function(){ state.who = w.id; save(); renderAll(); });
    wh.appendChild(b);
  });
  fillSelect('setSel', [{v:'std', l:'Standard (game default)'},{v:'remix', l:'Remixed'}], state.set, function(v){ state.set = v; save(); renderAll(); });
  fillDD('engDD', engineItems(), engineLabel(), toggleEngine);
  renderSetupSummary();
  document.body.classList.toggle('coop-on', !!state.coop);
}

/* ---------- BRIEF ---------- */
function renderBrief(){
  var el = document.getElementById('brief');
  el.classList.toggle('closed', !state.briefOpen);
  var cells = SEASONS.map(function(s){
    var b = BRIEF.seasons[s.id] || {must:[], money:''};
    return '<div class="brief-cell" style="--sc:var(--s-'+s.id+')"><h3>'+esc(s.name)+'</h3><ul>'+b.must.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul>'+(b.money?'<p class="money">'+esc(b.money)+'</p>':'')+'</div>';
  }).join('');
  var split;
  if(state.coop){
    split = '<div class="split"><div class="p1"><h4>PLAYER 1 · FARMER</h4><ul>'+BRIEF.split.p1.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>'+
      '<div class="p2"><h4>PLAYER 2 · FISHER, MINER</h4><ul>'+BRIEF.split.p2.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div></div>';
  } else {
    split = '<ul>'+BRIEF.solo.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>';
  }
  el.innerHTML =
    '<div class="brief-h" role="button" tabindex="0" aria-expanded="'+(state.briefOpen?'true':'false')+'"><h2>THE YEAR AT A GLANCE<small>The dates that cannot move, the money targets, and who does what each day.</small></h2></div>'+
    '<div class="brief-grid">'+cells+'<div class="brief-cell wide"><h3>'+(state.coop?'Who does what':'The daily rhythm')+'</h3>'+split+'</div></div>';
  var hd = el.querySelector('.brief-h');
  var go = function(){ state.briefOpen = !state.briefOpen; save(); renderBrief(); };
  hd.addEventListener('click', go);
  hd.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); go(); } });
}

/* ---------- STEPS ---------- */
var TAG_LABEL = {money:'money', bundle:'bundle', deadline:'deadline', farm:'farm', fish:'fish', mine:'mine', forage:'forage', animals:'animals', shop:'shop', festival:'festival', craft:'craft', social:'social', prep:'prep'};
function stepHTML(st){
  var done = !!state.done[st.id];
  var p = st.p|0;
  var cls = 'step'+(done?' done':'')+(p?' p'+p:'');
  var tags = '';
  if(p) tags += '<span class="tag p'+p+'">P'+p+'</span>';
  (st.tags||[]).forEach(function(tg){ tags += '<span class="tag '+esc(tg)+'">'+esc(TAG_LABEL[tg]||tg)+'</span>'; });
  if(st.set==='std' && state.set==='remix') tags += '<span class="tag std">standard set</span>';
  if(st.set==='remix') tags += '<span class="tag std">remixed set</span>';
  if(st.risk) tags += '<span class="tag risk">'+esc(st.risk)+'</span>';
  return '<li class="'+cls+'" data-id="'+esc(st.id)+'">'+
    '<input type="checkbox" id="chk-'+esc(st.id)+'"'+(done?' checked':'')+'>'+
    '<label class="t" for="chk-'+esc(st.id)+'">'+esc(st.t)+'</label>'+
    '<span class="cost">'+esc(st.c||'')+'</span>'+
    '<div class="meta">'+tags+'</div>'+
    (st.w ? '<details class="why"><summary>Why</summary><p>'+esc(st.w)+'</p></details>' : '')+
  '</li>';
}
function phaseCounts(ph){
  var vis = ph.steps.filter(stepVisible), done = 0;
  vis.forEach(function(st){ if(state.done[st.id]) done++; });
  return {tot:vis.length, done:done};
}
function phaseIsOpen(ph, firstOpenPid){
  if(typeof state.phaseOpen[ph.pid]==='boolean') return state.phaseOpen[ph.pid];
  return ph.pid === firstOpenPid;
}
function bindSteps(root, after){
  root.querySelectorAll('input[type=checkbox][id^="chk-"]').forEach(function(cb){
    cb.addEventListener('change', function(){
      var id = cb.id.replace('chk-','');
      if(cb.checked) state.done[id] = true; else delete state.done[id];
      var li = cb.closest('.step,.bitem'); if(li) li.classList.toggle('done', cb.checked);
      save(); if(after) after();
    });
  });
}

/* ---------- ROUTE ---------- */
function renderRoute(){
  var root = document.getElementById('route'); root.innerHTML='';
  var season = currentSeason();
  var sec = document.createElement('section'); sec.className='season'; sec.id='season-'+season.id;
  sec.style.setProperty('--ec','var(--s-'+season.id+')');
  var h = '<div class="season-head"><span class="kicker">'+esc(season.kicker)+'</span><h2>'+esc(season.name.toUpperCase())+'</h2>'+
    '<div class="season-facts"><div class="goal"><b>Goal</b>'+esc(season.goal)+'</div><div class="must"><b>Cannot wait</b>'+esc(season.must)+'</div><div class="money"><b>Money</b>'+esc(season.money)+'</div></div></div>';
  var phases = allPhases(season).filter(function(ph){ return ph.steps.filter(stepVisible).length; });
  var firstOpen = null;
  phases.forEach(function(ph){ if(firstOpen) return; var c = phaseCounts(ph); if(c.done < c.tot) firstOpen = ph.pid; });
  phases.forEach(function(ph){
    var c = phaseCounts(ph), open = phaseIsOpen(ph, firstOpen);
    var head;
    if(ph.kind==='base'){
      head = '<span class="num">'+esc(ph.n)+'</span><h3>'+esc(ph.t)+'</h3><span class="when">'+esc(ph.when)+'</span>';
    } else {
      head = '<span class="kind">'+esc(ph.label)+'</span><h3>'+esc(ph.t)+'</h3>';
    }
    head += '<span class="cnt">'+c.done+'/'+c.tot+'</span>';
    var style = ph.kind==='engine' ? ' style="--fc:var(--e-'+esc(ph.ek)+')"' : '';
    h += '<div class="phase '+(ph.kind==='base'?'':'focus')+(open?'':' closed')+(c.tot && c.done===c.tot?' complete':'')+'" data-pid="'+esc(ph.pid)+'"'+style+'>'+
      '<div class="phase-h" role="button" tabindex="0" aria-expanded="'+(open?'true':'false')+'">'+head+'</div><ul class="steps">';
    ph.steps.filter(stepVisible).forEach(function(st){ h += stepHTML(st); });
    h += '</ul></div>';
  });
  if(!phases.length) h += '<p class="empty">No steps for this player this season. Switch to Both to see the whole day.</p>';
  if(season.avoid && season.avoid.length){
    h += '<div class="avoid"><h3>DO NOT, THIS SEASON</h3><ul>'+season.avoid.map(function(a){ return '<li>'+esc(a)+'</li>'; }).join('')+'</ul></div>';
  }
  sec.innerHTML = h;
  root.appendChild(sec);
  bindPhaseHeads(root);
  bindSteps(root, function(){ renderNav(); refreshPhaseCounts(); });
  renderNext();
}
function bindPhaseHeads(root){
  root.querySelectorAll('.phase-h').forEach(function(hd){
    var go = function(){
      var phEl = hd.parentNode, pid = phEl.getAttribute('data-pid');
      var open = phEl.classList.contains('closed');
      state.phaseOpen[pid] = open; save();
      phEl.classList.toggle('closed', !open); hd.setAttribute('aria-expanded', String(open));
    };
    hd.addEventListener('click', go);
    hd.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); go(); } });
  });
}
function phaseBlockHTML(ph, open, c){
  var head = '<span class="num">'+esc(ph.n)+'</span><h3>'+esc(ph.t)+'</h3><span class="when">'+esc(ph.when)+'</span><span class="cnt">'+c.done+'/'+c.tot+'</span>';
  return '<div class="phase'+(open?'':' closed')+(c.tot && c.done===c.tot?' complete':'')+'" data-pid="'+esc(ph.pid)+'"><div class="phase-h" role="button" tabindex="0" aria-expanded="'+(open?'true':'false')+'">'+head+'</div><ul class="steps">'+ph.steps.filter(stepVisible).map(stepHTML).join('')+'</ul></div>';
}
function refreshPhaseCounts(){
  var season = currentSeason();
  allPhases(season).forEach(function(ph){
    var el = document.querySelector('.phase[data-pid="'+ph.pid+'"]'); if(!el) return;
    var c = phaseCounts(ph);
    var cnt = el.querySelector('.cnt'); if(cnt) cnt.textContent = c.done+'/'+c.tot;
    el.classList.toggle('complete', c.tot>0 && c.done===c.tot);
  });
}
function renderNext(){
  var el = document.getElementById('seasonnext'); var i = seasonIndex();
  el.innerHTML = '<button type="button" id="seasonPrevBtn"'+(i===0?' disabled':'')+'>← '+(i>0?esc(SEASONS[i-1].name):'')+'</button>'+
    '<button type="button" id="seasonNextBtn"'+(i===SEASONS.length-1?' disabled':'')+'>'+(i<SEASONS.length-1?esc(SEASONS[i+1].name):'')+' →</button>';
  document.getElementById('seasonPrevBtn').addEventListener('click', function(){ if(i>0) gotoSeason(SEASONS[i-1].id); });
  document.getElementById('seasonNextBtn').addEventListener('click', function(){ if(i<SEASONS.length-1) gotoSeason(SEASONS[i+1].id); });
}
function gotoSeason(id){
  state.season = id; save(); renderRoute(); renderNav();
  document.getElementById('route').scrollIntoView({block:'start'});
}

/* ---------- NAV + FINISH + NOTES ---------- */
function seasonProgress(season){
  var tot=0, done=0;
  allPhases(season).forEach(function(ph){ ph.steps.filter(stepVisible).forEach(function(st){ tot++; if(state.done[st.id]) done++; }); });
  return {tot:tot, done:done};
}
function renderNav(){
  var nav = document.getElementById('seasonnav'); nav.innerHTML='';
  SEASONS.forEach(function(season){
    var pr = seasonProgress(season);
    var b = document.createElement('button'); b.type='button'; b.style.setProperty('--ec','var(--s-'+season.id+')');
    b.className = season.id===state.season ? 'cur' : '';
    b.setAttribute('aria-pressed', String(season.id===state.season));
    b.innerHTML = '<span class="n">'+esc(season.name.toUpperCase())+'</span><span class="p">'+pr.done+' / '+pr.tot+'</span><span class="meter"><i style="width:'+(pr.tot?Math.round(pr.done/pr.tot*100):0)+'%"></i></span>';
    b.addEventListener('click', function(){ gotoSeason(season.id); });
    nav.appendChild(b);
  });
}
function renderFinish(){
  var extra = '';
  state.engines.forEach(function(k){ if(ENGINES[k].finish) extra += '<li>'+esc(ENGINES[k].finish)+'</li>'; });
  document.getElementById('finish').innerHTML = '<h2>FINISH LINE</h2><ul>'+FINISH.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+extra+'</ul>';
}
function renderNotes(){
  document.getElementById('notes').innerHTML = '<h2>WHAT IS VERIFIED AND WHAT IS NOT</h2><p>'+esc(NOTES.intro)+'</p><ul>'+NOTES.items.map(function(x){ return '<li>'+esc(x)+'</li>'; }).join('')+'</ul>';
}

/* ---------- COPY AS TEXT ---------- */
function routeText(){
  var out = [];
  out.push("FARMHAND'S ROUTE - " + (state.coop ? 'two players' : 'one player') + ', ' + SET_LABEL[state.set].toLowerCase());
  if(state.engines.length) out.push('Money engines: ' + engineNames().join(', '));
  out.push('');
  SEASONS.forEach(function(season){
    out.push('== ' + season.name.toUpperCase() + ' ==');
    out.push('Goal: ' + season.goal);
    out.push('Cannot wait: ' + season.must);
    allPhases(season).forEach(function(ph){
      var vis = ph.steps.filter(stepVisible); if(!vis.length) return;
      out.push('');
      out.push(ph.kind==='base' ? (ph.n + '. ' + ph.t + ' (' + ph.when + ')') : (ph.label + ': ' + ph.t));
      vis.forEach(function(st){
        var p = st.p|0;
        out.push('  [' + (state.done[st.id]?'x':' ') + '] ' + (state.coop && p ? 'P'+p+' ' : '') + st.t + (st.c ? '  (' + st.c + ')' : ''));
      });
    });
    if(season.avoid && season.avoid.length){ out.push(''); out.push('Do not: ' + season.avoid.join(' | ')); }
    out.push('');
  });
  return out.join('\n');
}

/* ---------- VIEWS + MENU + PRO ---------- */
var VIEW_NAMES = {route:'Route', bundles:'Bundles', focus:'Focus', perf:'Perfection', people:'People', legend:'Legend', items:'Items'};
function renderViews(){
  /* tabs whose data file is not shipped yet stay out of the menu */
  var gated = {perf:!!window.PERF, people:!!window.PEOPLE};
  Object.keys(gated).forEach(function(v){ var b = document.getElementById('view-btn-'+v); if(b) b.hidden = !gated[v]; if(!gated[v] && state.view===v) state.view = 'route'; });
  VIEWS.forEach(function(v){
    var b = document.getElementById('view-btn-'+v); if(b) b.setAttribute('aria-pressed', String(state.view===v));
    var el = document.getElementById('view-'+v); if(el) el.hidden = (state.view!==v);
  });
  var cv = document.getElementById('curView'); if(cv) cv.textContent = VIEW_NAMES[state.view] || '';
  document.body.classList.toggle('pro-on', !!state.pro);
  document.body.classList.toggle('coop-on', !!state.coop);
  var pb = document.getElementById('proBtn'); if(pb) pb.setAttribute('aria-pressed', String(!!state.pro));
}
function setMenu(open){
  var panel = document.getElementById('menuPanel'), btn = document.getElementById('menuBtn');
  panel.hidden = !open; btn.setAttribute('aria-expanded', String(open));
}
document.getElementById('menuBtn').addEventListener('click', function(e){ e.stopPropagation(); if(openDD){ openDD = null; renderAll(); } setMenu(document.getElementById('menuPanel').hidden); });
document.addEventListener('click', function(e){ if(!e.target.closest('#views')) setMenu(false); });
document.addEventListener('touchstart', function(e){ if(!e.target.closest('#views')) setMenu(false); }, {passive:true});
document.addEventListener('keydown', function(e){ if(e.key==='Escape') setMenu(false); });
document.querySelectorAll('#views button[data-view]').forEach(function(b){
  b.addEventListener('click', function(){ state.view = b.getAttribute('data-view'); save(); renderViews(); setMenu(false); window.scrollTo(0,0); });
});
document.getElementById('proBtn').addEventListener('click', function(){ state.pro = !state.pro; save(); renderViews(); toast(state.pro ? 'Pro mode: explanations hidden' : 'Explanations shown'); });

/* ---------- BUNDLES ---------- */
function bundleItemKey(b, it){ return 'b:'+b.id+':'+it.id; }
function bundleCounts(b){
  var done = 0;
  b.items.forEach(function(it){ if(state.done[bundleItemKey(b,it)]) done++; });
  return {done:done, need:b.need, tot:b.items.length, complete:done>=b.need};
}
function bundlesInSet(){ return BUNDLES.filter(function(b){ return b.set===state.set; }); }
function roomProgress(room){
  var bs = bundlesInSet().filter(function(b){ return b.room===room.id; });
  var done = bs.filter(function(b){ return bundleCounts(b).complete; }).length;
  var tot = state.set==='remix' ? (room.slots||bs.length) : bs.length;
  return {done:Math.min(done,tot), tot:tot};
}
function seasonTag(s){
  var k = String(s||'').toLowerCase();
  var cls = k.indexOf('spring')>-1&&k.indexOf(',')===-1 ? 'spring' : k==='summer' ? 'summer' : k==='fall' ? 'fall' : k==='winter' ? 'winter' : '';
  return '<span class="tag stag '+cls+'">'+esc(s||'any season')+'</span>';
}
function bundleCard(b){
  var room = ROOMS.filter(function(r){ return r.id===b.room; })[0] || {name:b.room};
  var c = bundleCounts(b);
  var h = '<div class="bundle'+(c.complete?' complete':'')+'" style="--rc:var(--r-'+esc(b.room)+')" id="bundle-'+esc(b.id)+'">'+
    '<div class="bundle-h"><span class="room">'+esc(room.name.toUpperCase())+(b.set==='remix'?' · REMIXED':'')+'</span><h3>'+esc(b.name)+'</h3><span class="cnt">'+c.done+' / '+c.need+(c.tot>c.need?' of '+c.tot:'')+'</span>'+
    '<span class="reward">Reward: <b>'+esc(b.reward)+'</b>'+(b.slot?' · '+esc(b.slot):'')+'</span></div><ul class="bitems">';
  b.items.forEach(function(it){
    var key = bundleItemKey(b,it), done = !!state.done[key];
    var when = [];
    if(it.time) when.push(it.time);
    if(it.weather) when.push(it.weather);
    var tags = seasonTag(it.season);
    if(it.cat) tags += '<span class="tag">'+esc(it.cat)+'</span>';
    if(it.q) tags += '<span class="tag">'+esc(it.q)+'</span>';
    if(it.risk) tags += '<span class="tag risk">'+esc(it.risk)+'</span>';
    h += '<li class="bitem'+(done?' done':'')+'"><input type="checkbox" id="chk-'+esc(key)+'"'+(done?' checked':'')+'>'+
      '<label class="t" for="chk-'+esc(key)+'">'+icon(it.name, 28)+esc(it.name)+'</label><span class="qty">'+(it.qty>1?'x'+it.qty:'')+'</span>'+
      '<div class="how">'+esc(it.how)+(when.length?' · '+esc(when.join(', ')):'')+'</div>'+
      '<div class="meta">'+tags+'</div>'+
    '</li>';
  });
  h += '</ul>'+(b.note?'<div class="rmnote">'+esc(b.note)+'</div>':'')+'</div>';
  return h;
}
function renderBundles(){
  var list = document.getElementById('bundleList'); if(!list) return;
  fillSelect('roomSel', [{v:'all', l:'All rooms'}].concat(ROOMS.map(function(r){ return {v:r.id, l:r.name}; })), state.room, function(v){ state.room = v; save(); renderBundles(); });
  fillSelect('bsetSel', [{v:'std', l:'Standard (game default)'},{v:'remix', l:'Remixed'}], state.set, function(v){ state.set = v; save(); renderAll(); });
  fillSelect('bshowSel', [{v:'all', l:'All bundles'},{v:'todo', l:'Not done yet'},{v:'oneshot', l:'With one-shot items'}], state.bshow, function(v){ state.bshow = v; save(); renderBundles(); });
  var nav = document.getElementById('roomnav');
  nav.innerHTML = ROOMS.map(function(r){
    var pr = roomProgress(r);
    return '<div style="--rc:var(--r-'+esc(r.id)+')"><span class="n">'+esc(r.name.toUpperCase())+'</span><span class="p">'+pr.done+' / '+pr.tot+' bundles</span><span class="meter"><i style="width:'+(pr.tot?Math.round(pr.done/pr.tot*100):0)+'%"></i></span><span class="rw">'+esc(r.reward)+'</span></div>';
  }).join('');
  var rows = bundlesInSet().filter(function(b){
    if(state.room!=='all' && b.room!==state.room) return false;
    if(state.bshow==='todo' && bundleCounts(b).complete) return false;
    if(state.bshow==='oneshot' && !b.items.some(function(it){ return !!it.risk; })) return false;
    return true;
  });
  var all = bundlesInSet();
  document.getElementById('bundleCount').textContent = rows.length + ' of ' + all.length + ' bundles · ' + all.filter(function(b){ return bundleCounts(b).complete; }).length + ' done';
  list.innerHTML = rows.length ? rows.map(bundleCard).join('') : '<p class="empty">Nothing matches. Change the room or the filter.</p>';
  bindSteps(list, function(){ renderBundles(); });
}

/* ---------- FOCUS ---------- */
function rungCard(r, ek){
  var facts = (r.facts||[]).map(function(f){ return '<span>'+esc(f)+'</span>'; }).join('');
  var rico = icon(r.icon || r.name.replace(/\s*\(.*\)$/,''), 48);
  return '<div class="bcard" style="--ec:var(--e-'+esc(ek)+')">'+
    '<h3>'+esc(r.name)+'</h3>'+(rico?'<div class="fp">'+rico+'</div>':'')+
    '<div class="era">'+esc((r.kind||'').toUpperCase())+(r.sub?'<span>'+esc(r.sub)+'</span>':'')+'</div>'+
    (r.use?'<div class="use">'+esc(r.use)+'</div>':'')+
    (r.io?'<div class="io">'+esc(r.io)+'</div>':'')+
    (facts?'<div class="facts">'+facts+'</div>':'')+
    (r.note?'<div class="note">'+esc(r.note)+'</div>':'')+
  '</div>';
}
function ladderHTML(chain, ek){
  var h = '<div class="fladder">';
  chain.forEach(function(r, i){
    h += '<div class="rung">'+rungCard(r, ek)+'</div>';
    if(r.link && i < chain.length-1) h += '<div class="link"><span>'+esc(r.link)+'</span></div>';
  });
  return h + '</div>';
}
function seasonStepsHTML(obj){
  var h = '<div class="fera">';
  SEASONS.forEach(function(s){
    var steps = (obj[s.id] || []).filter(stepVisible); if(!steps.length) return;
    h += '<div class="fe"><h4 style="--ec:var(--s-'+s.id+')">'+esc(s.name.toUpperCase())+'</h4><ul class="steps">'+steps.map(stepHTML).join('')+'</ul></div>';
  });
  return h + '</div>';
}
function renderFocus(){
  fillDD('engDD2', engineItems(), engineLabel(), toggleEngine);
  var el = document.getElementById('focusBody'); if(!el) return;
  var h = '';
  state.engines.forEach(function(k){
    var e = ENGINES[k];
    h += '<section class="fsec" style="--fc:var(--e-'+esc(k)+')"><div class="fsec-h"><span class="kind">'+esc((e.kind||'engine').toUpperCase())+'</span><h2>'+esc(e.name.toUpperCase())+'</h2><span class="meta">'+esc(e.from)+' · '+esc(e.price)+'</span><p>'+esc(e.sum)+'</p></div>'+
      '<div class="fsec-b"><div><h3>THE LADDER</h3>'+ladderHTML(e.ladder || [], k)+'</div>'+
      (e.numbers && e.numbers.length ? '<div><h3>THE NUMBERS</h3><div class="two"><div><ul>'+e.numbers.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>'+(e.avoid&&e.avoid.length?'<div><h4>Do not</h4><ul>'+e.avoid.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>':'')+'</div></div>' : '')+
      '<div><h3>STEPS BY SEASON</h3>'+seasonStepsHTML(e.seasons)+'</div></div></section>';
  });
  if(!h) h = '<p class="empty">Nothing picked. Choose an engine above.</p>';
  el.innerHTML = h;
  bindSteps(el, function(){ renderNav(); });
}

/* ---------- PERFECTION ---------- */
function perfKey(cat, it){ return 'pf:'+cat.id+':'+it.id; }
function perfCatCounts(cat){
  var tot=0, done=0;
  cat.groups.forEach(function(g){ g.items.forEach(function(it){ var c = it.count||1; tot+=c; if(state.done[perfKey(cat,it)]) done+=c; }); });
  return {tot:tot, done:done};
}
function perfTotal(){
  var sum=0;
  PERF.cats.forEach(function(cat){ var c=perfCatCounts(cat); if(c.tot) sum += cat.weight * c.done / c.tot; });
  return Math.floor(sum);
}
function perfCard(cat, g, items){
  var tot=0, done=0;
  g.items.forEach(function(it){ var c=it.count||1; tot+=c; if(state.done[perfKey(cat,it)]) done+=c; });
  var h = '<div class="bundle'+(done>=tot?' complete':'')+'" style="--rc:var(--accent)">'+
    '<div class="bundle-h"><span class="room">'+esc(cat.name.toUpperCase())+'</span><h3>'+esc(g.name)+'</h3><span class="cnt">'+done+' / '+tot+'</span>'+
    (g.note?'<span class="reward">'+esc(g.note)+'</span>':'')+'</div><ul class="bitems">';
  items.forEach(function(it){
    var key = perfKey(cat,it), on = !!state.done[key];
    var tags = '';
    if(it.when) tags += seasonTag(it.when);
    if(it.needs) tags += '<span class="tag risk">'+esc(it.needs)+'</span>';
    h += '<li class="bitem'+(on?' done':'')+'"><input type="checkbox" id="chk-'+esc(key)+'"'+(on?' checked':'')+'>'+
      '<label class="t" for="chk-'+esc(key)+'">'+icon(it.icon || it.name, 28)+esc(it.name)+'</label><span class="qty">'+((it.count||1)>1?'x'+it.count:'')+'</span>'+
      (it.how?'<div class="how">'+esc(it.how)+'</div>':'')+
      (tags?'<div class="meta">'+tags+'</div>':'')+
    '</li>';
  });
  return h + '</ul></div>';
}
function renderPerf(){
  var meter = document.getElementById('pmeter'); if(!meter || !window.PERF) return;
  var h = '<div class="big"><b>'+perfTotal()+'%</b><span>weighted the way the game weighs it</span></div>';
  PERF.cats.forEach(function(cat){
    var c = perfCatCounts(cat), pct = c.tot ? Math.round(c.done/c.tot*100) : 0;
    h += '<button type="button" class="prow'+(c.tot&&c.done>=c.tot?' full':'')+'" data-cat="'+esc(cat.id)+'" aria-pressed="'+(state.pcat===cat.id?'true':'false')+'"><span class="n">'+icon(cat.icon||'', 28)+esc(cat.name)+'</span><span class="w">'+cat.weight+'% \u00b7 '+c.done+' / '+c.tot+'</span><span class="meter"><i style="width:'+pct+'%"></i></span></button>';
  });
  meter.innerHTML = h;
  meter.querySelectorAll('.prow').forEach(function(b){ b.addEventListener('click', function(){ var id = b.getAttribute('data-cat'); state.pcat = (state.pcat===id) ? 'all' : id; save(); renderPerf(); }); });
  fillSelect('pcatSel', [{v:'all', l:'All categories'}].concat(PERF.cats.map(function(c){ return {v:c.id, l:c.name+' ('+c.weight+'%)'}; })), state.pcat, function(v){ state.pcat = v; save(); renderPerf(); });
  fillSelect('pshowSel', [{v:'all', l:'All requirements'},{v:'todo', l:'Not done yet'}], state.pshow, function(v){ state.pshow = v; save(); renderPerf(); });
  var q = document.getElementById('pq'); if(q.value !== state.pq) q.value = state.pq;
  var needle = state.pq.trim().toLowerCase();
  /* the road */
  var rr = document.getElementById('perfRoute');
  if(state.pcat==='all' && !needle){
    var phases = PERF.route.map(function(p){ return {pid:'perf-'+p.n, n:p.n, t:p.t, when:p.when, steps:p.steps}; });
    var firstOpen = null;
    phases.forEach(function(ph){ if(firstOpen) return; var c = phaseCounts(ph); if(c.done < c.tot) firstOpen = ph.pid; });
    rr.innerHTML = phases.map(function(ph){ return phaseBlockHTML(ph, phaseIsOpen(ph, firstOpen), phaseCounts(ph)); }).join('');
    bindPhaseHeads(rr);
    bindSteps(rr, function(){ phases.forEach(function(ph){ var el = rr.querySelector('.phase[data-pid="'+ph.pid+'"]'); if(!el) return; var c = phaseCounts(ph); el.querySelector('.cnt').textContent = c.done+'/'+c.tot; el.classList.toggle('complete', c.tot>0 && c.done===c.tot); }); });
  } else rr.innerHTML = '';
  /* the requirements */
  var list = document.getElementById('perfList'); var cards = [], shown = 0, all = 0;
  PERF.cats.forEach(function(cat){
    if(state.pcat!=='all' && cat.id!==state.pcat) return;
    cat.groups.forEach(function(g){
      var items = g.items.filter(function(it){
        all++;
        if(state.pshow==='todo' && state.done[perfKey(cat,it)]) return false;
        if(needle && (it.name+' '+(it.how||'')+' '+(it.when||'')+' '+(it.needs||'')+' '+g.name+' '+cat.name).toLowerCase().indexOf(needle)===-1) return false;
        return true;
      });
      if(!items.length) return; shown += items.length;
      cards.push(perfCard(cat, g, items));
    });
  });
  document.getElementById('pcount').textContent = shown+' of '+all+' requirements';
  list.innerHTML = cards.length ? cards.join('') : '<p class="empty">Nothing matches. Clear the search or change the category.</p>';
  bindSteps(list, function(){ renderPerf(); });
}
document.getElementById('pq').addEventListener('input', function(){ state.pq = this.value; save(); renderPerf(); });

/* ---------- PEOPLE ---------- */
function pplKey(cid, it){ return 'pp:'+cid+':'+it.id; }
function pplCard(c){
  var tot=0, done=0;
  c.path.forEach(function(it){ tot++; if(state.done[pplKey(c.id,it)]) done++; });
  var items = c.path.filter(function(it){ return !(state.pplShow==='todo' && state.done[pplKey(c.id,it)]); });
  var h = '<div class="bundle'+(done>=tot?' complete':'')+'" style="--rc:var(--'+(c.kind==='Bachelor'?'p1':c.kind==='Bachelorette'?'p2':'accent')+')">'+
    '<div class="bundle-h'+(ART.map[c.name]?' withpic':'')+'">'+(ART.map[c.name]?'<span class="pic">'+icon(c.name, 64)+'</span>':'')+'<span class="room">'+esc((c.kind||'').toUpperCase())+(c.birthday?' \u00b7 BIRTHDAY '+esc(c.birthday.toUpperCase()):'')+'</span><h3>'+esc(c.name)+'</h3><span class="cnt">'+done+' / '+tot+'</span>'+
    (c.lives?'<span class="reward">'+esc(c.lives)+(c.find?' \u00b7 '+esc(c.find):'')+'</span>':'')+'</div>';
  if(c.loves || c.likes || c.hates){
    h += '<div class="bio">'+(c.cheap?'<span><b>Easy love:</b> '+esc(c.cheap)+'</span>':'')+(c.loves?'<span><b>Loves:</b> '+esc(c.loves)+'</span>':'')+(c.likes?'<span><b>Likes:</b> '+esc(c.likes)+'</span>':'')+(c.hates?'<span><b>Never:</b> '+esc(c.hates)+'</span>':'')+'</div>';
  }
  h += '<ul class="bitems">';
  items.forEach(function(it){
    var key = pplKey(c.id,it), on = !!state.done[key];
    h += '<li class="bitem'+(on?' done':'')+'"><input type="checkbox" id="chk-'+esc(key)+'"'+(on?' checked':'')+'>'+
      '<label class="t" for="chk-'+esc(key)+'">'+esc(it.t)+'</label><span class="hearts">'+(it.hearts!=null?esc(String(it.hearts))+'\u2665':'')+'</span>'+
      (it.how?'<div class="how">'+esc(it.how)+'</div>':'')+
      (it.w?'<div class="note">'+esc(it.w)+'</div>':'')+
    '</li>';
  });
  if(!items.length) h += '<li class="bitem"><span></span><span class="how">All done.</span></li>';
  return h + '</ul>'+(c.note?'<div class="rmnote">'+esc(c.note)+'</div>':'')+'</div>';
}
function renderPeople(){
  var list = document.getElementById('peopleList'); if(!list || !window.PEOPLE) return;
  var opts = [{v:'all', l:'Everyone'},{v:'Bachelorette', l:'Bachelorettes'},{v:'Bachelor', l:'Bachelors'},{v:'Other', l:'Other villagers and the rules'}].concat(PEOPLE.cards.filter(function(c){ return c.kind!=='Other'; }).map(function(c){ return {v:c.id, l:c.name}; }));
  if(!opts.some(function(o){ return o.v===state.ppl; })) state.ppl = 'all';
  fillSelect('pplSel', opts, state.ppl, function(v){ state.ppl = v; save(); renderPeople(); });
  fillSelect('pplShowSel', [{v:'all', l:'All steps'},{v:'todo', l:'Not done yet'}], state.pplShow, function(v){ state.pplShow = v; save(); renderPeople(); });
  var cards = PEOPLE.cards.filter(function(c){
    if(state.ppl==='all') return true;
    if(state.ppl==='Other') return c.kind==='Other';
    if(state.ppl==='Bachelor' || state.ppl==='Bachelorette') return c.kind===state.ppl;
    return c.id===state.ppl;
  });
  list.innerHTML = cards.length ? cards.map(pplCard).join('') : '<p class="empty">Nothing to show.</p>';
  bindSteps(list, function(){ renderPeople(); });
}

/* ---------- LEGEND ---------- */
function tableHTML(t){
  var h = '<div class="tbl"><table><thead><tr>'+t.cols.map(function(c){return '<th>'+esc(c)+'</th>';}).join('')+'</tr></thead><tbody>';
  t.rows.forEach(function(r){
    h += '<tr>'+r.map(function(c, i){ var num = (t.num||[]).indexOf(i)>-1; var ic = (i===0) ? icon(String(c).replace(/\s+\d+g$/,'').replace(/\s*\(.*\)$/,''), 24) : ''; return '<td data-label="'+esc(t.cols[i]||'')+'"'+(num?' class="num"':'')+'>'+ic+esc(c)+'</td>'; }).join('')+'</tr>';
  });
  return h + '</tbody></table></div>';
}
function renderLegend(){
  var body = document.getElementById('legendBody'); if(!body) return;
  var secs = window.LEGEND || [];
  fillSelect('legSel', [{v:'', l:'Choose a section'}].concat(secs.map(function(s){ return {v:s.id, l:s.title}; })), '', function(v){
    if(!v) return; state.legendOpen[v] = true; save(); renderLegend();
    var s = document.getElementById('leg-'+v); if(s) s.scrollIntoView({block:'start'});
  });
  var h = '';
  secs.forEach(function(sec){
    var open = !!state.legendOpen[sec.id];
    h += '<section class="legend-sec'+(open?'':' closed')+'" id="leg-'+esc(sec.id)+'" data-sid="'+esc(sec.id)+'"><h2 role="button" tabindex="0" aria-expanded="'+(open?'true':'false')+'">'+esc(sec.title.toUpperCase())+'</h2>';
    sec.blocks.forEach(function(b){
      h += '<div class="lblock"><h3>'+esc(b.h)+'</h3>';
      if(b.p) h += '<p>'+esc(b.p)+'</p>';
      if(b.table) h += tableHTML(b.table);
      if(b.notes && b.notes.length) h += '<ul>'+b.notes.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>';
      h += '</div>';
    });
    h += '</section>';
  });
  body.innerHTML = h;
  body.querySelectorAll('.legend-sec>h2').forEach(function(hd){
    var go = function(){ var s = hd.parentNode, id = s.getAttribute('data-sid'); state.legendOpen[id] = s.classList.contains('closed'); save(); renderLegend(); };
    hd.addEventListener('click', go);
    hd.addEventListener('keydown', function(e){ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); go(); } });
  });
}

/* ---------- ITEMS ---------- */
var ICAT_ORDER = ['Tool','Machine','Building','Weapon','Gear'];
var ICAT_LABEL = {Tool:'Tools', Machine:'Machines and crafting', Building:'Buildings', Weapon:'Weapons', Gear:'Rings and boots'};
var ICAT_COLOR = {Tool:'var(--e-kegs)', Machine:'var(--e-animals)', Building:'var(--e-fish)', Weapon:'var(--red)', Gear:'var(--e-ancient)'};
function footprintSVG(w, h){
  w = Math.max(1, w|0); h = Math.max(1, h|0);
  var m = Math.max(w, h), t = m <= 8 ? 10 : (m <= 12 ? 7 : 5), g = 1;
  var W = w*t, H = h*t, rects = '';
  for(var y=0;y<h;y++){ for(var x=0;x<w;x++){ rects += '<rect x="'+(x*t+g/2)+'" y="'+(y*t+g/2)+'" width="'+(t-g)+'" height="'+(t-g)+'"/>'; } }
  return '<svg viewBox="0 0 '+W+' '+H+'" width="'+W+'" height="'+H+'" fill="var(--ec)" fill-opacity=".7" role="img" aria-label="'+w+' by '+h+' tiles">'+rects+'</svg>';
}
function fmtMoney(n){ return n ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'g' : ''; }
function costLine(gold, mats){
  var parts = [];
  if(gold) parts.push(fmtMoney(gold));
  if(mats) parts.push(mats);
  return parts.join(' + ');
}
function itemCard(b){
  var facts = [];
  if(b.unlock) facts.push(b.unlock);
  if(b.days) facts.push(b.days+(b.days===1?' day':' days')+' to build');
  if(b.time) facts.push(b.time);
  if(b.makes) facts.push('makes '+b.makes);
  var cost = costLine(b.gold, b.mats);
  var ups = '';
  if(b.tiers && b.tiers.length){
    ups = '<div class="ups"><b>Tiers</b> '+b.tiers.map(function(u){ return esc(u.name)+(u.gold||u.mats?' '+esc(costLine(u.gold,u.mats)):'')+(u.fx?' ('+esc(u.fx)+')':''); }).join(' · ')+'</div>';
  }
  return '<div class="bcard'+(b.guess?' guess':'')+'" style="--ec:'+(ICAT_COLOR[b.cat]||'var(--ink-2)')+'">'+
    '<h3>'+esc(b.name)+'</h3>'+
    ((b.w || icon(b.name)) ? '<div class="fp">'+icon(b.name, 48)+(b.w ? footprintSVG(b.w, b.h)+'<span class="sz">'+b.w+' × '+b.h+' <small>tiles</small></span>' : '')+'</div>' : '')+
    '<div class="era">'+esc((b.cat||'').toUpperCase())+'<span>'+esc(b.from||'')+(b.v16==='changed'?' · changed in 1.6':b.v16?' · new in 1.6':'')+'</span></div>'+
    (b.use ? '<div class="use">'+esc(b.use)+'</div>' : '')+
    (cost ? '<div class="mats">'+esc(cost)+'</div>' : '')+
    '<div class="facts">'+facts.map(function(f){return '<span>'+esc(f)+'</span>';}).join('')+'</div>'+
    ups+
    (b.note ? '<div class="note">'+esc(b.note)+'</div>' : '')+
  '</div>';
}
function renderItems(){
  var list = document.getElementById('itemList'); if(!list) return;
  var all = window.ITEMS || [];
  var cats = ICAT_ORDER.filter(function(c){ return all.some(function(b){ return b.cat===c; }); });
  fillSelect('icatSel', [{v:'all', l:'All types'}].concat(cats.map(function(c){ return {v:c, l:ICAT_LABEL[c]||c}; })), state.iCat, function(v){ state.iCat = v; save(); renderItems(); });
  var srcs = []; all.forEach(function(b){ if(b.from && srcs.indexOf(b.from)===-1) srcs.push(b.from); }); srcs.sort();
  if(state.iSrc!=='all' && srcs.indexOf(state.iSrc)===-1) state.iSrc = 'all';
  fillSelect('isrcSel', [{v:'all', l:'Any source'}].concat(srcs.map(function(s){ return {v:s, l:s}; })), state.iSrc, function(v){ state.iSrc = v; save(); renderItems(); });
  var q = document.getElementById('iq'); if(q.value !== state.iQ) q.value = state.iQ;
  var needle = state.iQ.trim().toLowerCase();
  var rows = all.filter(function(b){
    if(state.iCat!=='all' && b.cat!==state.iCat) return false;
    if(state.iSrc!=='all' && b.from!==state.iSrc) return false;
    if(needle && (b.name+' '+(b.cat||'')+' '+(b.from||'')+' '+(b.use||'')+' '+(b.mats||'')+' '+(b.unlock||'')+' '+(b.makes||'')).toLowerCase().indexOf(needle)===-1) return false;
    return true;
  });
  rows.sort(function(a,b){ var ca = ICAT_ORDER.indexOf(a.cat), cb = ICAT_ORDER.indexOf(b.cat); if(ca!==cb) return ca-cb; return a.name < b.name ? -1 : a.name > b.name ? 1 : 0; });
  document.getElementById('icount').textContent = rows.length+' of '+all.length+' items';
  list.innerHTML = rows.length ? rows.map(itemCard).join('') : '<p class="empty">Nothing matches. Clear the search or change the type.</p>';
}
document.getElementById('iq').addEventListener('input', function(){ state.iQ = this.value; save(); renderItems(); });

/* ---------- BOOT ---------- */
function renderAll(){ renderViews(); renderSetup(); renderBrief(); renderFocus(); renderRoute(); renderNav(); renderFinish(); renderNotes(); renderBundles(); renderPerf(); renderPeople(); renderLegend(); renderItems(); }
document.getElementById('copyBtn').addEventListener('click', function(){
  var txt = routeText();
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(function(){ toast('Route copied'); }, function(){ fallbackCopy(txt); });
  } else fallbackCopy(txt);
});
function fallbackCopy(txt){
  var ta = document.createElement('textarea'); ta.value = txt; ta.style.position='fixed'; ta.style.opacity='0';
  document.body.appendChild(ta); ta.select();
  try{ document.execCommand('copy'); toast('Route copied'); }catch(e){ toast('Copy blocked; select and copy manually'); }
  document.body.removeChild(ta);
}
document.getElementById('printBtn').addEventListener('click', function(){ window.print(); });
document.getElementById('resetBtn').addEventListener('click', function(){ state.done = {}; state.phaseOpen = {}; save(); renderAll(); toast('Ticks cleared'); });
renderAll();
})();
