/* TOMfit quiz: 20 questions, 4 picture answers, no points or helpers; review of wrong answers at the end */
(function(){
'use strict';
var Q=window.TF_QUIZ,root=document.getElementById('qz');if(!Q||!root)return;
var N=20,LVN=[4,6,6,4];
var LET=['A','B','C','D'],uid=0,S=null;
var byId={};Q.items.forEach(function(it,i){byId[it.id]=it;it._i=i});
function rnd(n){return Math.floor(Math.random()*n)}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t}return a}
function el(id){return document.getElementById(id)}
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function fmt(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,',')}
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
var BEST='tfqz_'+Q.id+'_best';

/* ---------- pictures ---------- */
function planetArt(it){var a=it.a,id='g'+(++uid),c=a.c,r=40,s='<svg viewBox="0 0 120 120" aria-hidden="true"><defs><radialGradient id="'+id+'" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="'+c[0]+'"/><stop offset="1" stop-color="'+c[1]+'"/></radialGradient><clipPath id="c'+id+'"><circle cx="60" cy="60" r="'+r+'"/></clipPath></defs>';
 if(a.glow)s+='<circle cx="60" cy="60" r="58" fill="'+c[0]+'" opacity=".28"/><circle cx="60" cy="60" r="50" fill="'+c[0]+'" opacity=".45"/>';
 if(a.ring)s+='<g transform="rotate(-18 60 60)"><path d="M3 60A57 15 0 0 1 117 60" fill="none" stroke="'+a.ring+'" stroke-width="7" opacity=".95"/></g>';
 s+='<circle cx="60" cy="60" r="'+r+'" fill="url(#'+id+')"/>';
 if(a.bands){s+='<g clip-path="url(#c'+id+')">';a.bands.forEach(function(b,i){s+='<rect x="15" y="'+(26+i*15)+'" width="90" height="8" fill="'+b+'" opacity=".55"/>'});s+='</g>'}
 if(a.craters){s+='<g clip-path="url(#c'+id+')" fill="#000" opacity=".18"><circle cx="44" cy="48" r="8"/><circle cx="76" cy="62" r="11"/><circle cx="58" cy="84" r="6"/><circle cx="80" cy="40" r="5"/><circle cx="40" cy="72" r="4"/></g>'}
 if(a.spot){if(it.id==='earth')s+='<g clip-path="url(#c'+id+')" fill="'+a.spot+'"><path d="M38 40q12-8 20 2t-2 16q-10 4-16-4z"/><path d="M68 62q10-4 14 6t-6 18q-8 0-10-10z"/><path d="M48 74q8 0 6 10t-10 4z"/></g>';else s+='<ellipse cx="'+(it.id==='jupiter'?74:70)+'" cy="'+(it.id==='jupiter'?72:66)+'" rx="'+(it.id==='jupiter'?10:8)+'" ry="'+(it.id==='jupiter'?6:5)+'" fill="'+a.spot+'" opacity=".85" clip-path="url(#c'+id+')"/>'}
 if(a.ring)s+='<g transform="rotate(-18 60 60)"><path d="M3 60A57 15 0 0 0 117 60" fill="none" stroke="'+a.ring+'" stroke-width="7"/></g>';
 return s+'</svg>'}
function elemArt(it){return '<div class="qz-el" style="background:'+it.col+'"><b>'+esc(it.sym)+'</b></div>'}
function stateArt(it){var v=it.vb,pad=Math.max(v[2],v[3])*.06;return '<span class="qz-st"><img class="qz-sf" src="/img/quiz/state-flags/'+it.id+'.svg" alt="" loading="lazy"><svg viewBox="'+[v[0]-pad,v[1]-pad,v[2]+2*pad,v[3]+2*pad].join(' ')+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="'+it.d+'" fill="#dbe8ff" stroke="#0b4ba8" stroke-width="2.4" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg></span>'}
function initials(n){var w=n.replace(/\./g,'').split(' ').filter(Boolean);return (w[0][0]+(w.length>1?w[w.length-1][0]:'')).toUpperCase()}
function presArt(it){return '<img src="/img/quiz/presidents/'+it.id+'.jpg" alt="" onerror="this.outerHTML=\'<div class=&quot;qz-ph&quot;><b>'+esc(initials(it.n))+'</b></div>\'">'}
function spaceArt(it){return '<img class="qz-sp" src="/img/quiz/space/'+it.id+'.jpg" alt="" loading="lazy">'}
function art(it){return Q.type==='space'?spaceArt(it):Q.type==='elem'?elemArt(it):Q.type==='state'?stateArt(it):presArt(it)}

/* ---------- building a game ---------- */
function pool(fact,cor){var q=fact[1],t=Q.type,it=Q.items;
 function g(){var gs=[].slice.call(arguments);return it.filter(function(x){return gs.indexOf(x.g)>-1})}
 if(t==='space'){if(/^Which dwarf planet/.test(q))return g('dwarf','planet');if(/^Which planet/.test(q))return g('planet');if(/^Which (world|object)/.test(q))return g('planet','dwarf','moon','star');if(/moon/.test(q))return g('moon')}
 if(t==='elem'){if(/metal/.test(q))return it.filter(function(x){return x.m});if(/gas/.test(q))return it.filter(function(x){return x.st==='gas'})}
 return it}
function distractors(cor,fact){var P=pool(fact,cor).filter(function(x){return x.id!==cor.id&&!(fact[3]||[]).concat(cor.x||[]).some(function(e){return e===x.id})});
 var near=shuf((cor.nr&&cor.nr.length?cor.nr.map(function(i){return byId[i]}).filter(Boolean):P.filter(function(x){return x.g===cor.g})).filter(function(x,i,a){return P.indexOf(x)>-1&&a.indexOf(x)===i}));
 var ch=near.slice(0,2);
 if(ch.length<2){shuf(P).forEach(function(x){if(ch.length<2&&ch.indexOf(x)<0)ch.push(x)})}
 var far=shuf(P).filter(function(x){return ch.indexOf(x)<0&&near.indexOf(x)<0&&(cor.o!=null?Math.abs(x.o-cor.o)>=12:x.g!==cor.g)});
 if(!far.length)far=shuf(P).filter(function(x){return ch.indexOf(x)<0});
 return {near:ch,far:far[0]}}
function buildGame(){var used={},qs=[];
 for(var lv=1;lv<=LVN.length;lv++){var NEED=LVN[lv-1],cand=[];Q.items.forEach(function(it){it.f.forEach(function(f,k){if(f[0]===lv)cand.push([it,f])})});
  var lst=shuf(cand),got=0;
  lst.forEach(function(c){if(got<NEED&&!used[c[0].id]){used[c[0].id]=1;qs.push({it:c[0],f:c[1],lv:lv});got++}});
  if(got<NEED){shuf(Q.items).forEach(function(it){if(got<NEED&&!used[it.id]){var f=it.f[rnd(it.f.length)];used[it.id]=1;qs.push({it:it,f:f,lv:lv});got++}})}}
 qs.forEach(function(q){var d=distractors(q.it,q.f);q.dn=d.near;q.df=d.far;q.opts=shuf([q.it].concat(d.near,[d.far]))});
 return qs}

/* ---------- screens ---------- */
function cap1(t){return t.charAt(0).toUpperCase()+t.slice(1)}
function heroCards(){var ids=Q.hero&&Q.hero.length?shuf(Q.hero).slice(0,4):shuf(Q.items.map(function(x){return x.id})).slice(0,4),h='';
 ids.forEach(function(id,k){var it=byId[id];if(!it)return;var sub=Q.type==='elem'?FAMN[it.fam]:(it.l||'');
  h+='<div class="qz-hc'+(Q.type==='space'?' dk':'')+'">'+(Q.type==='elem'?'<div class="qz-hrow"><span>'+it.num+'</span><span>'+it.st+'</span></div>':'')+'<div class="qz-ha">'+art(it)+'</div><div class="qz-hn">'+esc(it.n)+'</div><div class="qz-hu">'+esc(sub)+'</div></div>'});return h}
function start(){
 root.innerHTML='<div class="qz-box qz-start"><div class="qz-hr">'+heroCards()+'</div><button type="button" class="btn y qz-go" id="qz-play">Start – '+N+' questions</button></div>';
 el('qz-play').onclick=newGame}
function place(){var b=root.querySelector('.qz-box');if(!b)return;var r=b.getBoundingClientRect();if(r.bottom>window.innerHeight||r.top<0){window.scrollTo(0,Math.max(0,r.top+window.pageYOffset-(r.height<window.innerHeight-16?8:0)))}}
function newGame(){S={qs:buildGame(),i:0,sel:-1,locked:false,ok:0,wrong:[]};render()}
function render(){var q=S.qs[S.i],h='';
 h+='<div class="qz-box"><div class="qz-top"><span class="qz-n">Question <b>'+(S.i+1)+'</b> of '+N+'</span></div><div class="qz-prog" aria-hidden="true"><i style="width:'+(S.i/N*100)+'%"></i></div>';
 h+='<h2 class="qz-q" id="qz-q">'+esc(q.f[1])+'</h2><div class="qz-opts" id="qz-opts" role="group" aria-labelledby="qz-q">';
 q.opts.forEach(function(o,k){h+='<button type="button" class="qz-o'+(Q.type==='space'?' dk':'')+'" data-k="'+k+'" aria-label="'+esc(o.n)+'"><span class="qz-a">'+art(o)+'</span><span class="qz-nm">'+esc(o.n)+'</span>'+(Q.type==='elem'?'<span class="qz-fm" hidden>'+FAMN[o.fam]+'</span>':'')+'</button>'});
 h+='</div><div class="qz-bot"><div class="qz-act" id="qz-act"><button type="button" class="btn y qz-fin" id="qz-final" disabled>Final answer</button></div><div id="qz-res" class="qz-res" role="status" aria-live="polite" hidden></div></div></div>';
 root.innerHTML=h;
 [].forEach.call(root.querySelectorAll('.qz-o'),function(b){b.onclick=function(){pick(+b.getAttribute('data-k'))}});
 el('qz-final').onclick=lock;place()}
function pick(k){if(S.locked)return;S.sel=k;[].forEach.call(root.querySelectorAll('.qz-o'),function(b){b.classList.toggle('sel',+b.getAttribute('data-k')===k)});el('qz-final').disabled=false;el('qz-final').textContent='Final answer'}
var FAMN={nonmetal:'nonmetal',noble:'noble gas',halogen:'halogen',alkali:'alkali metal',earth:'alkaline earth metal',trans:'transition metal',post:'post-transition metal',metalloid:'metalloid',actinide:'actinide'};
function lock(){if(S.locked||S.sel<0)return;S.locked=true;var q=S.qs[S.i],ok=q.opts[S.sel]===q.it,cor=q.opts.indexOf(q.it);
 [].forEach.call(root.querySelectorAll('.qz-o'),function(b){var k=+b.getAttribute('data-k');b.disabled=true;b.classList.remove('sel');if(k===cor)b.classList.add('ok');else if(k===S.sel)b.classList.add('bad');var fm=b.querySelector('.qz-fm');if(fm)fm.hidden=false});
 if(ok)S.ok++;else S.wrong.push({n:S.i+1,q:q});
 el('qz-act').hidden=true;
 var r=el('qz-res'),last=S.i===N-1,it=q.it,extra=Q.type==='elem'?' <span class="qz-tag">'+esc(it.sym)+' · no. '+it.num+' · '+FAMN[it.fam]+'</span>':'';
 r.hidden=false;r.className='qz-res '+(ok?'ok':'bad');
 r.innerHTML='<p class="qz-fact"><b>'+(ok?'✔ Correct!':'✘ Not this time.')+'</b> '+esc(it.n)+' – '+esc(q.f[2])+extra+'</p><button type="button" class="btn y" id="qz-next">'+(last?'See my results':'Next question')+'</button>';
 el('qz-next').onclick=function(){if(last)finish();else{S.i++;S.sel=-1;S.locked=false;render()}};
 el('qz-next').focus({preventScroll:true})}
function answer(q){var it=q.it;
 if(Q.type==='pres'&&it.y){var vp=it.vp||[],v=!vp.length?'He had no Vice President.':vp.length===1?'His Vice President was '+vp[0]+'.':'His Vice Presidents were '+vp.slice(0,-1).join(', ')+' and '+vp[vp.length-1]+'.';
  return it.n+', president '+(/^\d{4} to|and/.test(it.y)?'from ':'in ')+it.y+'. '+v+' '+it.k}
 var f=q.f[2];return it.n+'. '+f}
function usaMap(){var ok={},bad={};S.qs.forEach(function(q,k){var w=S.wrong.some(function(x){return x.q===q});(w?bad:ok)[q.it.id]=1});
 var h='<div class="qz-map"><h2 class="qz-revh">Your 20 states on the map</h2><svg viewBox="-64 6 1028 608" role="img" aria-label="Map of the USA: green states you answered correctly, red states you missed">';
 Q.items.forEach(function(it){var c=ok[it.id]?'#1f9e55':bad[it.id]?'#d94a4a':'#e8f0fb';h+='<path d="'+it.d+'" fill="'+c+'" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round"><title>'+esc(it.n)+'</title></path>'});
 return h+'</svg><p class="qz-key"><i style="background:#1f9e55"></i>Correct <i style="background:#d94a4a"></i>Missed <i style="background:#e8f0fb"></i>Not asked this time</p></div>'}
function finish(){
 var h='<div class="qz-box qz-end"><p class="qz-score">Correct answers: <b>'+S.ok+'</b></p>';
 if(!S.wrong.length)h+='<p class="qz-perfect">Perfect – every answer correct!</p>';
 else{h+='<h2 class="qz-revh">The answers you missed</h2><ol class="qz-rev">';
  S.wrong.forEach(function(w){h+='<li><p class="qz-rq"><b>Q'+w.n+':</b> '+esc(w.q.f[1])+'</p><p class="qz-ra"><b>A'+w.n+':</b> '+esc(answer(w.q))+'</p></li>'});h+='</ol>'}
 if(Q.type==='state')h+=usaMap();
 h+='<div class="qz-act"><button type="button" class="btn y" id="qz-again">Play again</button><a class="btn o" href="/puzzles">← All puzzles</a></div></div>';
 root.innerHTML=h;el('qz-again').onclick=newGame;var b=root.querySelector('.qz-box');if(b)window.scrollTo(0,Math.max(0,b.getBoundingClientRect().top+window.pageYOffset-8))}
if(location.hash==="#qzdebug")window.__qzc=function(){return S.qs[S.i].opts.indexOf(S.qs[S.i].it)};window.__qzs=function(){return S.qs.map(function(q){return {lv:q.lv,q:q.f[1],o:q.opts.map(function(o){return o.id}),c:q.it.id}})};
start();
})();
