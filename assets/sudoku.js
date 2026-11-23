/* TOMfit Sudoku & Killer Sudoku – plays in the browser, progress saved on this device only */
(function(){
'use strict';
var root=document.getElementById('sd'); if(!root||!window.TF_SUDOKU) return;
var GAME=root.getAttribute('data-game'), DATA=window.TF_SUDOKU;
var LEVELS=GAME==='killer'
 ?[{k:'killm',t:'Medium',s:'9 numbers',n:9,bh:3,bw:3,kl:1},{k:'killh',t:'Hard',s:'9 numbers',n:9,bh:3,bw:3,kl:1}]
 :[{k:'easy6',t:'Easy',s:'6 numbers',n:6,bh:3,bw:2,kl:0},{k:'med9',t:'Medium',s:'9 numbers',n:9,bh:3,bw:3,kl:0},{k:'hard9',t:'Hard',s:'9 numbers',n:9,bh:3,bw:3,kl:0}];
var $=function(id){return document.getElementById(id)};
var L=0, idx=0, P, S, sel=-1, notes=false;
var KEY=function(){return 'tfsd_'+LEVELS[L].k+'_'+idx};
function ls(get,k,v){try{if(get)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}return null}
function say(t,c){var m=$('sd-msg');m.textContent=t||'';m.className='sd-msg'+(c?' '+c:'')}

function build(){
 $('sd-lv').innerHTML=LEVELS.map(function(l,i){return '<button type="button" data-l="'+i+'" aria-pressed="'+(i===L)+'">'+l.t+'<small>'+l.s+'</small></button>'}).join('');
 $('sd-lv').className='mm-lv'+(LEVELS.length===2?' two':'');
 var c=DATA[LEVELS[L].k].length,o='';
 for(var i=0;i<c;i++){var done=ls(true,'tfsd_'+LEVELS[L].k+'_'+i+'_done')==='1';o+='<option value="'+i+'">Puzzle '+(i+1)+' of '+c+(done?' ✓':'')+'</option>'}
 $('sd-sel').innerHTML=o;$('sd-sel').value=idx;
 var n=LEVELS[L].n;$('sd-pad').className='sd-pad'+(n===6?' p6':'');
 var p='';for(var d=1;d<=n;d++)p+='<button type="button" data-d="'+d+'" aria-label="Number '+d+'">'+d+'</button>';
 $('sd-pad').innerHTML=p;
}
function load(){
 var m=LEVELS[L],N=m.n,T=N*N;P=DATA[m.k][idx];
 S={v:[],nt:[],h:[],giv:[],done:false,bad:null};
 for(var i=0;i<T;i++){S.v.push(0);S.nt.push(0);S.giv.push(false)}
 if(!m.kl){for(var j=0;j<T;j++){var d=+P.p.charAt(j);if(d){S.v[j]=d;S.giv[j]=true}}}
 else{P.cg=[];P.c.forEach(function(c,k){c[0].forEach(function(i){P.cg[i]=k})});
  P.first=P.c.map(function(c){return Math.min.apply(null,c[0])})}
 var raw=ls(true,KEY());
 if(raw){try{var s=JSON.parse(raw);if(s.v&&s.v.length===T){S.v=s.v;S.nt=s.nt||S.nt;S.done=!!s.done}}catch(e){}}
 sel=-1;say('');
}
function save(){ls(false,KEY(),JSON.stringify({v:S.v,nt:S.nt,done:S.done}))}
function sol(i){return +P.s.charAt(i)}
function wrongSet(){var w={},any=0;S.v.forEach(function(v,i){if(v&&v!==sol(i)){w[i]=1;any++}});return any?w:null}

function render(){
 var m=LEVELS[L],N=m.n,b=$('sd-board');
 b.className='sd-board n'+N;
 b.style.gridTemplateColumns='repeat('+N+',1fr)';b.style.gridTemplateRows='repeat('+N+',1fr)';
 var h='';
 for(var i=0;i<N*N;i++){
  var r=(i/N)|0,c=i%N,cls='sd-c';
  if(S.giv[i])cls+=' g';
  if(c%m.bw===m.bw-1&&c<N-1)cls+=' bR';
  if(r%m.bh===m.bh-1&&r<N-1)cls+=' bB';
  if(sel>=0){if(i===sel)cls+=' sel';else if(S.v[sel]&&S.v[i]===S.v[sel])cls+=' same'}
  if(S.bad&&S.bad[i])cls+=' bad';
  var inner='';
  if(m.kl){var k=P.cg[i],st='';
   var nb=function(rr,cc){return rr<0||cc<0||rr>=N||cc>=N||P.cg[rr*N+cc]!==k};
   if(nb(r-1,c))st+='border-top-width:1px;';if(nb(r+1,c))st+='border-bottom-width:1px;';
   if(nb(r,c-1))st+='border-left-width:1px;';if(nb(r,c+1))st+='border-right-width:1px;';
   inner+='<span class="sd-cg" style="'+st+'"></span>';
   if(P.first[k]===i)inner+='<span class="sd-sum">'+P.c[k][1]+'</span>'}
  if(S.v[i])inner+=S.v[i];
  else if(S.nt[i]){var n2='';for(var d=1;d<=N;d++)n2+='<i>'+((S.nt[i]>>(d-1))&1?d:'')+'</i>';inner+='<span class="sd-nt">'+n2+'</span>'}
  var lab='Row '+(r+1)+', column '+(c+1)+', '+(S.v[i]?(S.giv[i]?'given ':'')+S.v[i]:'empty');
  h+='<button type="button" class="'+cls+'" data-i="'+i+'" aria-label="'+lab+'">'+inner+'</button>';
 }
 b.innerHTML=h;
 $('sd-info').textContent=GAME==='killer'?'Killer Sudoku – '+m.t+'. Add up each dotted group.':'Sudoku – '+m.t+(N===6?' (numbers 1 to 6)':'');
}
function start(keepMsg){load();S.bad=null;build();render();finish(true)}
function push(){S.h.push({v:S.v.slice(),nt:S.nt.slice()});if(S.h.length>300)S.h.shift()}
function finish(quiet){
 var full=S.v.every(function(v){return v}); 
 if(full&&!wrongSet()){
  if(!S.done){S.done=true;save();ls(false,KEY()+'_done','1');var o=$('sd-sel').options[idx];if(o&&o.text.indexOf('✓')<0)o.text+=' ✓'}
  $('sd-done').hidden=false;$('sd-donetxt').textContent='Well done! Puzzle solved.';say('');
 }else{$('sd-done').hidden=true;if(S.done&&quiet)say('You solved this one earlier – well done!','ok')}
}
function press(d){
 if(sel<0||S.giv[sel]){say('Tap an empty square first.','no');return}
 push();S.bad=null;say('');
 var m=LEVELS[L],N=m.n;
 if(notes){if(S.v[sel])return;S.nt[sel]^=1<<(d-1)}
 else{
  S.v[sel]=S.v[sel]===d?0:d;S.nt[sel]=0;
  if(S.v[sel]){var r=(sel/N)|0,c=sel%N,bit=1<<(d-1);
   for(var i=0;i<N*N;i++){var rr=(i/N)|0,cc=i%N;
    if(rr===r||cc===c||(((r/m.bh)|0)===((rr/m.bh)|0)&&((c/m.bw)|0)===((cc/m.bw)|0)))S.nt[i]&=~bit}}
 }
 save();render();focusSel();finish(false);
}
function focusSel(){if(sel>=0){var e=$('sd-board').querySelector('[data-i="'+sel+'"]');if(e&&document.activeElement&&document.activeElement.className&&String(document.activeElement.className).indexOf('sd-c')<0){/* keep focus on pad */}}}
function go(n){var c=DATA[LEVELS[L].k].length;idx=((n%c)+c)%c;start()}
function nextOpen(){var c=DATA[LEVELS[L].k].length;for(var s=1;s<=c;s++){var j=(idx+s)%c;if(ls(true,'tfsd_'+LEVELS[L].k+'_'+j+'_done')!=='1'){go(j);return}}go(idx+1)}

$('sd-lv').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;L=+b.getAttribute('data-l');idx=0;start()});
$('sd-board').addEventListener('click',function(e){var b=e.target.closest('.sd-c');if(!b)return;sel=+b.getAttribute('data-i');render()});
$('sd-pad').addEventListener('click',function(e){var b=e.target.closest('button');if(b)press(+b.getAttribute('data-d'))});
$('sd-prev').onclick=function(){go(idx-1)};$('sd-next').onclick=function(){go(idx+1)};
$('sd-sel').onchange=function(e){go(+e.target.value)};
$('sd-nextopen').onclick=nextOpen;
$('sd-notes').onclick=function(){notes=!notes;this.setAttribute('aria-pressed',notes);this.textContent=notes?'Notes: on':'Notes: off'};
$('sd-erase').onclick=function(){if(sel<0||S.giv[sel]){say('Tap a square you filled in.','no');return}push();S.v[sel]=0;S.nt[sel]=0;S.bad=null;save();render();finish(false)};
$('sd-undo').onclick=function(){var h=S.h.pop();if(!h){say('Nothing to undo.','no');return}S.v=h.v;S.nt=h.nt;S.bad=null;save();render();finish(false)};
$('sd-check').onclick=function(){var w=wrongSet();S.bad=w;render();
 if(w){var n=Object.keys(w).length;say(n+(n>1?' numbers are':' number is')+' wrong – shown in red.','no')}
 else if(S.v.every(function(v){return v}))finish(false);
 else say('So far so good – no mistakes.','ok')};
$('sd-hint').onclick=function(){if(sel<0||S.giv[sel]){say('Tap an empty square, then press Hint.','no');return}
 push();S.v[sel]=sol(sel);S.nt[sel]=0;S.bad=null;save();render();finish(false);if(!S.done)say('Hint: the number has been filled in.','ok')};
$('sd-reset').onclick=function(){if(!window.confirm('Start this puzzle again?'))return;ls(false,KEY(),null);ls(false,KEY()+'_done',null);start()};
document.addEventListener('keydown',function(e){
 if(e.ctrlKey||e.metaKey||e.altKey)return;var tg=e.target&&e.target.tagName;if(tg==='SELECT'||tg==='INPUT')return;
 var N=LEVELS[L].n;
 if(e.key>='1'&&e.key<='9'&&+e.key<=N){press(+e.key);return}
 if(e.key==='Backspace'||e.key==='Delete'||e.key==='0'){$('sd-erase').click();return}
 if(e.key==='n'||e.key==='N'){$('sd-notes').click();return}
 if(sel<0)return;
 var dl={ArrowLeft:-1,ArrowRight:1,ArrowUp:-N,ArrowDown:N}[e.key];
 if(dl){e.preventDefault();var n=sel+dl;if(n>=0&&n<N*N&&!(Math.abs(dl)===1&&((n/N|0)!==(sel/N|0)))){sel=n;render();var el=$('sd-board').querySelector('[data-i="'+n+'"]');if(el)el.focus()}}
});
start();
})();
