/* TOMfit quiz: 15 questions, 4 picture answers, 3 lifelines, safe levels */
(function(){
'use strict';
var Q=window.TF_QUIZ,root=document.getElementById('qz');if(!Q||!root)return;
var PTS=[10,20,30,50,100,200,400,800,1500,3000,6000,12000,25000,50000,100000],SAFE=[4,9],N=15;
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
function stateArt(it){var v=it.vb,pad=Math.max(v[2],v[3])*.06,m=Math.max(v[2],v[3])/70;return '<svg viewBox="'+[v[0]-pad,v[1]-pad,v[2]+2*pad,v[3]+2*pad].join(' ')+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="'+it.d+'" fill="#dbe8ff" stroke="#0b4ba8" stroke-width="2.4" vector-effect="non-scaling-stroke" stroke-linejoin="round"/></svg>'}
function initials(n){var w=n.replace(/\./g,'').split(' ').filter(Boolean);return (w[0][0]+(w.length>1?w[w.length-1][0]:'')).toUpperCase()}
function presArt(it){return '<img src="/img/quiz/presidents/'+it.id+'.jpg" alt="" onerror="this.outerHTML=\'<div class=&quot;qz-ph&quot;><b>'+esc(initials(it.n))+'</b></div>\'">'}
function art(it){return Q.type==='space'?planetArt(it):Q.type==='elem'?elemArt(it):Q.type==='state'?stateArt(it):presArt(it)}

/* ---------- building a game ---------- */
function pool(fact,cor){var q=fact[1],t=Q.type,it=Q.items;
 function g(){var gs=[].slice.call(arguments);return it.filter(function(x){return gs.indexOf(x.g)>-1})}
 if(t==='space'){if(/^Which moon/.test(q))return g('moon');if(/^Which dwarf planet/.test(q))return g('dwarf','planet');if(/^Which planet/.test(q))return g('planet');if(/^Which world/.test(q))return g('planet','dwarf','moon')}
 if(t==='elem'){if(/metal/.test(q))return g('lmet','metal');if(/gas/.test(q))return g('gas')}
 return it}
function distractors(cor,fact){var P=pool(fact,cor).filter(function(x){return x.id!==cor.id&&!(fact[3]||[]).concat(cor.x||[]).some(function(e){return e===x.id})});
 var near=shuf((cor.nr&&cor.nr.length?cor.nr.map(function(i){return byId[i]}).filter(Boolean):P.filter(function(x){return x.g===cor.g})).filter(function(x,i,a){return P.indexOf(x)>-1&&a.indexOf(x)===i}));
 var ch=near.slice(0,2);
 if(ch.length<2){shuf(P).forEach(function(x){if(ch.length<2&&ch.indexOf(x)<0)ch.push(x)})}
 var far=shuf(P).filter(function(x){return ch.indexOf(x)<0&&near.indexOf(x)<0&&(cor.o!=null?Math.abs(x.o-cor.o)>=12:x.g!==cor.g)});
 if(!far.length)far=shuf(P).filter(function(x){return ch.indexOf(x)<0});
 return {near:ch,far:far[0]}}
function buildGame(){var used={},qs=[];
 for(var lv=1;lv<=3;lv++){var cand=[];Q.items.forEach(function(it){it.f.forEach(function(f,k){if(f[0]===lv)cand.push([it,f])})});
  var lst=shuf(cand),got=0;
  lst.forEach(function(c){if(got<5&&!used[c[0].id]){used[c[0].id]=1;qs.push({it:c[0],f:c[1],lv:lv});got++}});
  if(got<5){shuf(Q.items).forEach(function(it){if(got<5&&!used[it.id]){var f=it.f[rnd(it.f.length)];used[it.id]=1;qs.push({it:it,f:f,lv:lv});got++}})}}
 qs.forEach(function(q){var d=distractors(q.it,q.f);q.dn=d.near;q.df=d.far;q.opts=shuf([q.it].concat(d.near,[d.far]))});
 return qs}

/* ---------- screens ---------- */
function start(){var best=lsGet(BEST);
 root.innerHTML='<div class="qz-box qz-start"><p class="qz-intro">'+Q.intro+'</p><p class="qz-rules"><b>15 questions</b> · 4 pictures to choose from · <b>3 helpers</b> · safe points at questions 5 and 10</p>'+(best?'<p class="qz-best">Your best score: <b>'+fmt(best)+' points</b></p>':'')+'<button type="button" class="btn y qz-go" id="qz-play">Start the quiz</button></div>';
 el('qz-play').onclick=newGame}
function newGame(){S={qs:buildGame(),i:0,sel:-1,locked:false,life:{fifty:1,aud:1,friend:1},hid:[],done:false};render()}
function ladder(){var h='<div class="qz-lad" role="img" aria-label="Question '+(S.i+1)+' of '+N+'">';for(var k=0;k<N;k++){h+='<i class="'+(k<S.i?'d':k===S.i?'c':'')+(SAFE.indexOf(k)>-1?' s':'')+'"></i>'}return h+'</div>'}
function render(){var q=S.qs[S.i],won=S.i>0?PTS[S.i-1]:0,h='';
 h+='<div class="qz-box"><div class="qz-top"><span class="qz-n">Question <b>'+(S.i+1)+'</b> of '+N+'</span><span class="qz-p">Playing for <b>'+fmt(PTS[S.i])+'</b> points</span></div>'+ladder();
 h+='<h2 class="qz-q" id="qz-q">'+esc(q.f[1])+'</h2><div class="qz-opts" id="qz-opts" role="group" aria-labelledby="qz-q">';
 q.opts.forEach(function(o,k){h+='<button type="button" class="qz-o" data-k="'+k+'" aria-label="'+LET[k]+': '+esc(o.n)+'"><span class="qz-l">'+LET[k]+'</span><span class="qz-a">'+art(o)+'</span><span class="qz-nm">'+esc(o.n)+'</span></button>'});
 h+='</div><div class="qz-life" id="qz-life"><button type="button" id="qz-fifty">50 : 50</button><button type="button" id="qz-aud">Ask the crowd</button><button type="button" id="qz-friend">Ask a friend</button></div>';
 h+='<div class="qz-help" id="qz-help" role="status" aria-live="polite" hidden></div>';
 h+='<div class="qz-act"><button type="button" class="btn y" id="qz-final" disabled>Final answer</button>'+(S.i>0?'<button type="button" class="btn o" id="qz-walk">Stop and keep '+fmt(won)+' points</button>':'')+'</div><div id="qz-res" class="qz-res" role="status" aria-live="polite" hidden></div></div>';
 root.innerHTML=h;
 [].forEach.call(root.querySelectorAll('.qz-o'),function(b){b.onclick=function(){pick(+b.getAttribute('data-k'))}});
 el('qz-final').onclick=lock;el('qz-fifty').onclick=fifty;el('qz-aud').onclick=aud;el('qz-friend').onclick=friend;
 var w=el('qz-walk');if(w)w.onclick=function(){finish('walk',won)};
 syncLife()}
function syncLife(){['fifty','aud','friend'].forEach(function(k){var b=el('qz-'+k);if(!b)return;var u=!S.life[k];b.disabled=u||S.locked;b.className=u?'used':''})}
function pick(k){if(S.locked||S.hid.indexOf(k)>-1)return;S.sel=k;[].forEach.call(root.querySelectorAll('.qz-o'),function(b){b.classList.toggle('sel',+b.getAttribute('data-k')===k)});el('qz-final').disabled=false;el('qz-final').textContent='Final answer: '+LET[k]}
function lock(){if(S.locked||S.sel<0)return;S.locked=true;var q=S.qs[S.i],ok=q.opts[S.sel]===q.it,cor=q.opts.indexOf(q.it);
 [].forEach.call(root.querySelectorAll('.qz-o'),function(b){var k=+b.getAttribute('data-k');b.disabled=true;b.classList.remove('sel');if(k===cor)b.classList.add('ok');else if(k===S.sel)b.classList.add('bad')});
 syncLife();el('qz-final').hidden=true;var wk=el('qz-walk');if(wk)wk.hidden=true;el('qz-help').hidden=true;
 var r=el('qz-res'),last=S.i===N-1;
 r.hidden=false;r.className='qz-res '+(ok?'ok':'bad');
 r.innerHTML='<p class="qz-v">'+(ok?'✔ Correct!':'✘ Not this time.')+'</p><p class="qz-fact"><b>'+esc(q.it.n)+'</b> – '+esc(q.f[2])+'</p><button type="button" class="btn y" id="qz-next">'+(ok?(last?'See my score':'Next question'):'See my score')+'</button>';
 el('qz-next').onclick=function(){if(ok){if(last)finish('win',PTS[N-1]);else{S.i++;S.sel=-1;S.locked=false;S.hid=[];render();window.scrollTo({top:root.getBoundingClientRect().top+window.pageYOffset-70,behavior:'smooth'})}}else finish('lose',S.i>=10?PTS[9]:S.i>=5?PTS[4]:0)};
 r.scrollIntoView({block:'nearest',behavior:'smooth'});el('qz-next').focus({preventScroll:true})}
function finish(kind,pts){var b=+lsGet(BEST)||0;if(pts>b)lsSet(BEST,pts);
 var T=kind==='win'?'Brilliant – you reached the top!':kind==='walk'?'You stopped and kept your points.':'Game over – but you learned something new.';
 root.innerHTML='<div class="qz-box qz-end"><h2 class="qz-q">'+T+'</h2><p class="qz-score"><b>'+fmt(pts)+'</b> points</p><p class="qz-best">Your best score: <b>'+fmt(Math.max(b,pts))+' points</b></p><div class="qz-act"><button type="button" class="btn y" id="qz-again">Play again</button><a class="btn o" href="/puzzles">← All puzzles</a></div></div>';
 el('qz-again').onclick=newGame}
/* ---------- helpers ---------- */
function help(h){var e=el('qz-help');e.hidden=false;e.innerHTML=h}
function fifty(){if(!S.life.fifty||S.locked)return;S.life.fifty=0;var q=S.qs[S.i],cor=q.opts.indexOf(q.it),keepIdx=q.opts.indexOf(q.dn[rnd(2)]);
 q.opts.forEach(function(o,k){if(k!==cor&&k!==keepIdx){S.hid.push(k);var b=root.querySelector('.qz-o[data-k="'+k+'"]');b.classList.add('gone');b.disabled=true}});
 if(S.sel>-1&&S.hid.indexOf(S.sel)>-1){S.sel=-1;el('qz-final').disabled=true;el('qz-final').textContent='Final answer'}
 help('Two wrong answers have been taken away.');syncLife()}
function aud(){if(!S.life.aud||S.locked)return;S.life.aud=0;var q=S.qs[S.i],cor=q.opts.indexOf(q.it),left=[0,1,2,3].filter(function(k){return S.hid.indexOf(k)<0});
 var base=[0,.75,.55,.42][q.lv]+(Math.random()*.2-.1),w={};left.forEach(function(k){w[k]=k===cor?0:(q.opts[k]===q.df?.4:1)});
 var tot=0;left.forEach(function(k){if(k!==cor)tot+=w[k]});var out={},sum=0;
 left.forEach(function(k){if(k===cor)out[k]=Math.round(base*100);else out[k]=Math.round((1-base)*100*w[k]/tot);sum+=out[k]});
 out[cor]+=100-sum;var h='<p><b>The crowd says:</b></p><div class="qz-bars">';
 left.forEach(function(k){h+='<div><span>'+LET[k]+'</span><i style="width:'+Math.max(out[k],2)+'%"></i><em>'+out[k]+'%</em></div>'});
 help(h+'</div><p class="qz-sm">The crowd is not always right!</p>');syncLife()}
function friend(){if(!S.life.friend||S.locked)return;S.life.friend=0;var q=S.qs[S.i],cor=q.opts.indexOf(q.it),left=[0,1,2,3].filter(function(k){return S.hid.indexOf(k)<0}),acc=[0,.9,.75,.6][q.lv],right=Math.random()<acc,k,conf;
 if(right){k=cor;conf=[0,80,65,50][q.lv]+rnd(15)}else{var w=left.filter(function(x){return x!==cor&&q.opts[x]!==q.df});k=w.length?w[rnd(w.length)]:left.filter(function(x){return x!==cor})[0];conf=40+rnd(12)}
 help('<p><b>Your friend says:</b> “I think it is <b>'+LET[k]+' – '+esc(q.opts[k].n)+'</b>. I am about '+conf+'% sure.”</p><p class="qz-sm">Friends can be wrong too.</p>');syncLife()}
if(location.hash==="#qzdebug")window.__qzc=function(){return S.qs[S.i].opts.indexOf(S.qs[S.i].it)};window.__qzs=function(){return S.qs.map(function(q){return {lv:q.lv,q:q.f[1],o:q.opts.map(function(o){return o.id}),c:q.it.id}})};
start();
})();
