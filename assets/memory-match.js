/* TOMfit Memory Match (flags). Levels: easy 12 cards (3x4), medium 16 (4x4), hard 20 (4x5). */
(function () {
  /* 100 flags: 20 each from Europe, Asia, Africa, South America & Oceania, North & Central America.
     Flag images: flag-icons (MIT licence), /img/flags/. */
  var FL = {"United Kingdom":"gb","France":"fr","Germany":"de","Italy":"it","Spain":"es","Poland":"pl","Netherlands":"nl","Sweden":"se","Ireland":"ie","Portugal":"pt","Greece":"gr","Austria":"at","Belgium":"be","Switzerland":"ch","Norway":"no","Denmark":"dk","Finland":"fi","Czechia":"cz","Hungary":"hu","Croatia":"hr","Japan":"jp","China":"cn","India":"in","South Korea":"kr","Thailand":"th","Vietnam":"vn","Indonesia":"id","Philippines":"ph","Malaysia":"my","Singapore":"sg","Pakistan":"pk","Bangladesh":"bd","Nepal":"np","Sri Lanka":"lk","Mongolia":"mn","Kazakhstan":"kz","Turkey":"tr","Saudi Arabia":"sa","United Arab Emirates":"ae","Qatar":"qa","South Africa":"za","Egypt":"eg","Nigeria":"ng","Kenya":"ke","Ghana":"gh","Morocco":"ma","Ethiopia":"et","Tanzania":"tz","Uganda":"ug","Senegal":"sn","Côte d'Ivoire":"ci","Cameroon":"cm","Algeria":"dz","Tunisia":"tn","Rwanda":"rw","Botswana":"bw","Namibia":"na","Zambia":"zm","Zimbabwe":"zw","Madagascar":"mg","Brazil":"br","Argentina":"ar","Chile":"cl","Colombia":"co","Peru":"pe","Venezuela":"ve","Ecuador":"ec","Bolivia":"bo","Paraguay":"py","Uruguay":"uy","Guyana":"gy","Suriname":"sr","Australia":"au","New Zealand":"nz","Fiji":"fj","Papua New Guinea":"pg","Samoa":"ws","Tonga":"to","Vanuatu":"vu","Solomon Islands":"sb","United States":"us","Canada":"ca","Mexico":"mx","Guatemala":"gt","Belize":"bz","Honduras":"hn","El Salvador":"sv","Nicaragua":"ni","Costa Rica":"cr","Panama":"pa","Cuba":"cu","Jamaica":"jm","Haiti":"ht","Dominican Republic":"do","Bahamas":"bs","Barbados":"bb","Trinidad and Tobago":"tt","Saint Lucia":"lc","Grenada":"gd","Dominica":"dm"};
  var LEVELS = { easy: [6, 3], medium: [8, 4], hard: [10, 4] };
  var NAMES = Object.keys(FL);
  var board = document.getElementById('mm-board'); if (!board) return;
  var movesEl = document.getElementById('mm-moves'), pairsEl = document.getElementById('mm-pairs'),
      doneEl = document.getElementById('mm-done'), liveEl = document.getElementById('mm-live'),
      lvBtns = document.querySelectorAll('[data-level]');
  var level = 'easy', first = null, lock = false, moves = 0, found = 0, total = 0;

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function svg(n) { return '<img src="/img/flags/' + FL[n] + '.svg" alt="" width="120" height="90">'; }

  function start(lv) {
    level = lv || level; first = null; lock = false; moves = 0; found = 0;
    var cfg = LEVELS[level], names = shuffle(NAMES.slice()).slice(0, cfg[0]);
    total = cfg[0]; var deck = shuffle(names.concat(names));
    board.style.setProperty('--cols', cfg[1]); board.className = 'mm-board c' + cfg[1] + ' lv-' + level;
    board.innerHTML = deck.map(function (n, i) {
      return '<button type="button" class="mm-card" data-n="' + n + '" aria-label="Card ' + (i + 1) + ', face down"><span class="in"><span class="bk" aria-hidden="true">TOM<i>fit</i></span><span class="fc">' + svg(n) + '<b>' + n + '</b></span></span></button>';
    }).join('');
    movesEl.textContent = '0'; pairsEl.textContent = '0 of ' + total; doneEl.hidden = true; liveEl.textContent = '';
    lvBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.level === level ? 'true' : 'false'); });
    if (window.TOMFIT_SHOWPROMO) window.TOMFIT_SHOWPROMO();
  }

  function setFlip(c, on) { c.classList.toggle('flip', on); c.setAttribute('aria-label', on ? c.dataset.n + ' flag' : 'Card, face down'); }

  board.addEventListener('click', function (e) {
    var c = e.target.closest('.mm-card'); if (!c || lock || c.classList.contains('flip')) return;
    setFlip(c, true);
    if (!first) { first = c; return; }
    moves++; movesEl.textContent = moves;
    if (first.dataset.n === c.dataset.n) {
      first.classList.add('ok'); c.classList.add('ok'); first.disabled = true; c.disabled = true; first = null; found++;
      pairsEl.textContent = found + ' of ' + total; liveEl.textContent = 'Match found. ' + found + ' of ' + total + ' pairs.';
      if (found === total) { doneEl.hidden = false; document.getElementById('mm-donetxt').textContent = 'Well done! You finished in ' + moves + ' moves.'; liveEl.textContent = 'Well done! You finished in ' + moves + ' moves.'; }
    } else {
      lock = true; var a = first, b = c; first = null;
      setTimeout(function () { setFlip(a, false); setFlip(b, false); lock = false; }, 1000);
    }
  });
  lvBtns.forEach(function (b) { b.addEventListener('click', function () { start(b.dataset.level); }); });
  var again = document.getElementById('mm-again'); if (again) again.addEventListener('click', function () { start(); });

  /* promo panel: one random screen + one random sentence */
  window.TOMFIT_SHOWPROMO = function () {
    var P = window.TOMFIT_PROMO; if (!P || !P.length) return;
    var s = P[Math.floor(Math.random() * P.length)], l = s.lines[Math.floor(Math.random() * s.lines.length)];
    var t = document.getElementById('pr-title'), i = document.getElementById('pr-img'), x = document.getElementById('pr-text');
    if (t) t.textContent = s.title; if (i) { i.src = s.img; i.alt = s.alt; } if (x) x.textContent = l;
  };
  start('easy');
})();
