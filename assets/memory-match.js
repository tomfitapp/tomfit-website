/* TOMfit Memory Match (flags). Levels: easy 12 cards (3x4), medium 16 (4x4), hard 20 (4x5). */
(function () {
  var R = '<rect width="1" height="2" fill="', T = '<rect width="3" height=".67" fill="';
  var FL = {
    'France': ['0 0 3 2', R + '#0055a4"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ef4135"/>'],
    'Italy': ['0 0 3 2', R + '#009246"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ce2b37"/>'],
    'Poland': ['0 0 3 2', '<rect width="3" height="1" fill="#fff"/><rect y="1" width="3" height="1" fill="#dc143c"/>'],
    'Germany': ['0 0 3 2', T + '#000"/><rect y=".67" width="3" height=".67" fill="#d00"/><rect y="1.33" width="3" height=".67" fill="#ffce00"/>'],
    'Ireland': ['0 0 3 2', R + '#169b62"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ff883e"/>'],
    'Spain': ['0 0 3 2', '<rect width="3" height="2" fill="#aa151b"/><rect y=".5" width="3" height="1" fill="#f1bf00"/>'],
    'Netherlands': ['0 0 3 2', T + '#ae1c28"/><rect y=".67" width="3" height=".67" fill="#fff"/><rect y="1.33" width="3" height=".67" fill="#21468b"/>'],
    'Sweden': ['0 0 3 2', '<rect width="3" height="2" fill="#006aa7"/><rect x=".9" width=".4" height="2" fill="#fecc00"/><rect y=".8" width="3" height=".4" fill="#fecc00"/>'],
    'Ukraine': ['0 0 3 2', '<rect width="3" height="1" fill="#0057b7"/><rect y="1" width="3" height="1" fill="#ffd700"/>'],
    'United Kingdom': ['0 0 60 30', '<rect width="60" height="30" fill="#012169"/><path d="M0 0L60 30M60 0L0 30" stroke="#fff" stroke-width="6"/><path d="M0 0L60 30M60 0L0 30" stroke="#c8102e" stroke-width="2"/><path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/><path d="M30 0v30M0 15h60" stroke="#c8102e" stroke-width="6"/>']
  };
  var LEVELS = { easy: [6, 3], medium: [8, 4], hard: [10, 4] };
  var NAMES = Object.keys(FL);
  var board = document.getElementById('mm-board'); if (!board) return;
  var movesEl = document.getElementById('mm-moves'), pairsEl = document.getElementById('mm-pairs'),
      doneEl = document.getElementById('mm-done'), liveEl = document.getElementById('mm-live'),
      lvBtns = document.querySelectorAll('[data-level]');
  var level = 'easy', first = null, lock = false, moves = 0, found = 0, total = 0;

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function svg(n) { return '<svg viewBox="' + FL[n][0] + '" preserveAspectRatio="none" aria-hidden="true">' + FL[n][1] + '</svg>'; }

  function start(lv) {
    level = lv || level; first = null; lock = false; moves = 0; found = 0;
    var cfg = LEVELS[level], names = shuffle(NAMES.slice()).slice(0, cfg[0]);
    total = cfg[0]; var deck = shuffle(names.concat(names));
    board.style.setProperty('--cols', cfg[1]); board.className = 'mm-board c' + cfg[1];
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
