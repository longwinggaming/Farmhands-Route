/* Farmhand's Route - browser sweep. Paste into the console (or run through the preview tool) on the live page.
   Drives every control and combination, then scans the DOM for errors and unfilled text. Returns a report. */
(async function(){
  var errors = [];
  window.addEventListener('error', function(e){ errors.push('window.error: '+e.message); });
  var log = [];
  function q(s){ return document.querySelector(s); }
  function qa(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }
  function setSel(id, v){ var s = q('#'+id); s.value = v; s.dispatchEvent(new Event('change')); }
  function click(el){ if(!el){ errors.push('missing element'); return; } el.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true})); }
  function goView(v){ click(q('#menuBtn')); click(q('#view-btn-'+v)); if(q('#view-'+v).hidden) errors.push('view '+v+' not shown'); }
  function scan(where){
    var t = document.body.innerText;
    ['undefined','NaN','[object','null','TODO','TBD','{P}','{WANTS','placeholder'].forEach(function(bad){
      var i = t.indexOf(bad); if(i>-1) errors.push(where+': found "'+bad+'" near: '+t.slice(Math.max(0,i-40), i+40).replace(/\n/g,' '));
    });
    qa('.step .t, .bitem .t, .bcard h3, .lblock h3, .phase-h h3').forEach(function(el){ if(!el.textContent.trim()) errors.push(where+': empty label in '+el.className); });
  }
  /* ---- Route ---- */
  goView('route');
  var proBtn = q('#proBtn'); var proWas = proBtn.getAttribute('aria-pressed');
  click(proBtn); click(proBtn); if(proBtn.getAttribute('aria-pressed')!==proWas) errors.push('pro toggle did not round-trip');
  ['coop','solo'].forEach(function(v){ setSel('coopSel', v); var hid = q('#whoField').hidden; if((v==='solo')!==hid) errors.push('whoField hidden state wrong for '+v); scan('route coop='+v); });
  setSel('coopSel','coop');
  qa('#who button').forEach(function(b, i){ click(b); if(qa('#who button')[i].getAttribute('aria-pressed')!=='true') errors.push('who button '+i+' not pressed'); var vis = qa('#route .step').length; log.push('who '+b.textContent.trim().slice(0,4)+': '+vis+' steps'); scan('who '+i); });
  click(qa('#who button')[0]);
  ['remix','std'].forEach(function(v){ setSel('setSel', v); log.push('set '+v+': '+qa('#route .step').length+' steps, '+qa('#route .tag.std').length+' set tags'); scan('set '+v); });
  /* engines: open the dropdown and toggle each on, then off */
  function toggleAllEngines(on){
    click(q('#engDD > button'));
    var boxes = qa('#engDD input[type=checkbox]'); if(!boxes.length) errors.push('engine dropdown did not open');
    boxes.forEach(function(cb){ if(cb.checked!==on){ cb.checked = on; cb.dispatchEvent(new Event('change')); } click(q('#engDD > button')); click(q('#engDD > button')); });
    document.body.click();
  }
  toggleAllEngines(true);
  var engPhases = qa('#route .phase.focus').length; log.push('all engines on: '+engPhases+' engine phases in Spring, '+qa('#focusBody .fsec').length+' focus sections');
  if(qa('#focusBody .fsec').length!==6) errors.push('expected 6 focus sections with all engines on, got '+qa('#focusBody .fsec').length);
  scan('all engines');
  /* seasons: nav buttons and prev/next */
  qa('#seasonnav button').forEach(function(b, i){ click(b); if(!q('#route .season')) errors.push('season '+i+' did not render'); var ph = qa('#route .phase').length; log.push('season '+i+': '+ph+' phases, '+qa('#route .step').length+' steps'); scan('season '+i); });
  click(q('#seasonnav button')); /* back to spring */
  for(var k=0;k<3;k++){ click(q('#seasonNextBtn')); }
  if(q('#seasonNextBtn').disabled!==true) errors.push('seasonNext should be disabled on Winter (season '+q('#route .season').id+')');
  for(k=0;k<3;k++){ click(q('#seasonPrevBtn')); }
  if(q('#seasonPrevBtn').disabled!==true) errors.push('seasonPrev should be disabled on Spring');
  /* phases: open/close every phase, tick first step in each */
  qa('#route .phase').forEach(function(ph, i){
    var hd = ph.querySelector('.phase-h'); var wasClosed = ph.classList.contains('closed');
    click(hd); if(ph.classList.contains('closed')===wasClosed) errors.push('phase '+i+' did not toggle');
    if(ph.classList.contains('closed')) click(hd);
    var cb = ph.querySelector('input[type=checkbox]'); var cnt = ph.querySelector('.cnt').textContent;
    cb.checked = true; cb.dispatchEvent(new Event('change'));
    if(ph.querySelector('.cnt').textContent===cnt) errors.push('phase '+i+' count did not update after tick');
    if(!cb.closest('.step').classList.contains('done')) errors.push('phase '+i+' step not marked done');
    cb.checked = false; cb.dispatchEvent(new Event('change'));
  });
  var navText = q('#seasonnav').textContent; if(navText.indexOf('/')===-1) errors.push('season nav has no counts');
  /* brief */
  var brief = q('#brief'); click(brief.querySelector('.brief-h')); if(brief.classList.contains('closed')) errors.push('brief did not open'); scan('brief open'); click(brief.querySelector('.brief-h'));
  /* setup toggle */
  click(q('#setupToggle')); click(q('#setupToggle'));
  /* copy + reset (copy may be blocked without a gesture; just make sure it does not throw) */
  try{ click(q('#copyBtn')); }catch(e){ errors.push('copy threw '+e.message); }
  click(q('#resetBtn')); if(qa('#route .step.done').length) errors.push('reset left ticks');
  toggleAllEngines(false); toggleAllEngines(true);
  /* ---- Bundles ---- */
  goView('bundles');
  var roomOpts = qa('#roomSel option').map(function(o){ return o.value; });
  ['std','remix'].forEach(function(set){
    setSel('bsetSel', set);
    if(q('#setSel').value!==set) errors.push('bsetSel did not sync setSel');
    roomOpts.forEach(function(r){ setSel('roomSel', r); var n = qa('#bundleList .bundle').length; log.push('bundles '+set+' '+r+': '+n); if(!n) errors.push('no bundles for '+set+' '+r); scan('bundles '+set+' '+r); });
    setSel('roomSel','all');
    ['todo','oneshot','all'].forEach(function(v){ setSel('bshowSel', v); log.push('bshow '+set+' '+v+': '+qa('#bundleList .bundle').length); });
  });
  setSel('bsetSel','std'); setSel('roomSel','all'); setSel('bshowSel','all');
  /* tick items in the first bundle until complete */
  var b0 = q('#bundleList .bundle'); var need = parseInt(b0.querySelector('.cnt').textContent.split('/')[1], 10);
  var boxes = qa('#bundleList .bundle:first-child input[type=checkbox]');
  for(var i=0;i<need;i++){ var cb = document.getElementById(boxes[i].id); cb.checked = true; cb.dispatchEvent(new Event('change')); }
  if(!q('#bundleList .bundle').classList.contains('complete')) errors.push('bundle did not complete after '+need+' ticks');
  if(q('#roomnav').textContent.indexOf('1 / ')===-1) errors.push('room nav did not count the completed bundle');
  qa('#bundleList .bundle:first-child input[type=checkbox]').forEach(function(cb){ if(cb.checked){ cb.checked=false; cb.dispatchEvent(new Event('change')); } });
  /* ---- Focus ---- */
  goView('focus');
  click(q('#engDD2 > button')); if(!qa('#engDD2 input').length) errors.push('focus engine dropdown did not open'); document.body.click();
  if(qa('#focusBody .fsec').length!==6) errors.push('focus: expected 6 sections, got '+qa('#focusBody .fsec').length);
  if(qa('#focusBody .rung').length < 20) errors.push('focus: too few ladder rungs');
  var fcb = q('#focusBody input[type=checkbox]'); fcb.checked = true; fcb.dispatchEvent(new Event('change')); if(!fcb.closest('.step').classList.contains('done')) errors.push('focus step tick failed'); fcb.checked=false; fcb.dispatchEvent(new Event('change'));
  scan('focus');
  /* ---- Perfection ---- */
  if(q('#view-btn-perf').hidden){ log.push('perfection tab hidden (no data yet)'); } else {
  goView('perf');
  if(!q('#pmeter .big b')) errors.push('perfection meter missing');
  var prows = qa('#pmeter .prow'); if(prows.length < 10) errors.push('perfection: only '+prows.length+' category rows');
  prows.forEach(function(b, i){ click(qa('#pmeter .prow')[i]); if(qa('#pmeter .prow')[i].getAttribute('aria-pressed')!=='true') errors.push('perf row '+i+' not pressed'); if(!qa('#perfList .bundle').length) errors.push('perf cat '+i+' shows no cards'); scan('perf cat '+i); });
  click(qa('#pmeter .prow')[0]); click(qa('#pmeter .prow')[0]);
  if(q('#pcatSel').value!=='all') errors.push('perf cat did not reset to all');
  if(!qa('#perfRoute .phase').length) errors.push('perfection road missing');
  qa('#perfRoute .phase').forEach(function(ph, i){ var hd = ph.querySelector('.phase-h'); var was = ph.classList.contains('closed'); click(hd); if(ph.classList.contains('closed')===was) errors.push('perf phase '+i+' did not toggle'); });
  var pcb = q('#perfList input[type=checkbox]'); var before = q('#pmeter .big b').textContent;
  pcb.checked = true; pcb.dispatchEvent(new Event('change'));
  if(!q('#perfList input[type=checkbox]').checked) errors.push('perf tick lost after re-render');
  var pcb2 = q('#perfList input[type=checkbox]'); pcb2.checked = false; pcb2.dispatchEvent(new Event('change'));
  ['todo','all'].forEach(function(v){ setSel('pshowSel', v); log.push('perf show '+v+': '+q('#pcount').textContent); });
  ['walnut','ancient','zzzz',''].forEach(function(term){ var inp = q('#pq'); inp.value = term; inp.dispatchEvent(new Event('input')); log.push('perf search "'+term+'": '+q('#pcount').textContent); if(term==='zzzz' && !q('#perfList .empty')) errors.push('perf search: no empty message'); });
  scan('perfection');
  }
  /* ---- People ---- */
  if(q('#view-btn-people').hidden){ log.push('people tab hidden (no data yet)'); } else {
  goView('people');
  qa('#pplSel option').forEach(function(o){ setSel('pplSel', o.value); var n = qa('#peopleList .bundle').length; if(!n) errors.push('people '+o.value+': no cards'); log.push('people '+o.value+': '+n); });
  setSel('pplSel','all');
  var ppcb = q('#peopleList input[type=checkbox]'); ppcb.checked = true; ppcb.dispatchEvent(new Event('change')); if(!q('#peopleList input[type=checkbox]').checked) errors.push('people tick lost'); var ppcb2 = q('#peopleList input[type=checkbox]'); ppcb2.checked = false; ppcb2.dispatchEvent(new Event('change'));
  ['todo','all'].forEach(function(v){ setSel('pplShowSel', v); });
  scan('people');
  }
  /* icons */
  goView('bundles'); setSel('roomSel','all'); if(qa('#bundleList .ico').length < 100) errors.push('bundle icons missing: '+qa('#bundleList .ico').length);
  var probe = q('#bundleList .ico'); if(probe){ var bg = getComputedStyle(probe).backgroundImage; if(bg.indexOf('sheet.png')===-1) errors.push('icon background not the sheet: '+bg); }
  goView('items'); if(qa('#itemList .ico').length < 50) errors.push('item icons missing');
  /* ---- Legend ---- */
  goView('legend');
  qa('#legSel option').forEach(function(o){ if(!o.value) return; setSel('legSel', o.value); var sec = q('#leg-'+o.value); if(!sec || sec.classList.contains('closed')) errors.push('legend '+o.value+' did not open'); if(!sec.querySelectorAll('table').length && !sec.querySelectorAll('.lblock').length) errors.push('legend '+o.value+' empty'); });
  qa('.legend-sec > h2').forEach(function(h){ click(h); });
  scan('legend');
  qa('.legend-sec').forEach(function(s){ if(!s.classList.contains('closed')) click(s.querySelector('h2')); });
  /* ---- Items ---- */
  goView('items');
  var cats = qa('#icatSel option').map(function(o){ return o.value; }); var srcs = qa('#isrcSel option').map(function(o){ return o.value; });
  cats.forEach(function(c){ setSel('icatSel', c); srcs.forEach(function(s){ setSel('isrcSel', s); var n = qa('#itemList .bcard').length; if(!n && !q('#itemList .empty')) errors.push('items '+c+'/'+s+': no cards and no empty message'); }); });
  setSel('icatSel','all'); setSel('isrcSel','all');
  ['keg','coop','sprinkler','zzzz',''].forEach(function(term){ var inp = q('#iq'); inp.value = term; inp.dispatchEvent(new Event('input')); log.push('search "'+term+'": '+qa('#itemList .bcard').length+' ('+q('#icount').textContent+')'); if(term==='zzzz' && !q('#itemList .empty')) errors.push('items search: no empty message'); });
  if(qa('#itemList .fp svg').length < 15) errors.push('items: footprints missing');
  scan('items');
  /* ---- pro mode text check ---- */
  goView('route'); if(q('#proBtn').getAttribute('aria-pressed')!=='true') click(q('#proBtn'));
  var whyVisible = qa('#route .why').filter(function(el){ return el.offsetParent !== null; }).length; if(whyVisible) errors.push('pro mode shows '+whyVisible+' why blocks');
  click(q('#proBtn')); var whyShown = qa('#route .why').filter(function(el){ return el.offsetParent !== null; }).length; if(!whyShown) errors.push('explanations did not show with pro off'); click(q('#proBtn'));
  /* ---- persistence ---- */
  var saved = JSON.parse(localStorage.getItem('farmhand-route:v1')); if(!saved || saved.view!=='route') errors.push('state not saved');
  return {errors: errors, log: log};
})();
