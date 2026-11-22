/* TOMfit Number Crossword: tap an empty square, then a number from the pool. Correct = green, wrong = light red. */
(function () {
  var NX = window.NX, board = document.getElementById('nx-board'); if (!NX || !board) return;
  var poolEl = document.getElementById('nx-pool'), movesEl = document.getElementById('nx-moves'), okEl = document.getElementById('nx-ok'),
      doneEl = document.getElementById('nx-done'), liveEl = document.getElementById('nx-live'), lvBtns = document.querySelectorAll('[data-level]');
  var SYM = { '+': '+', '-': '−', '×': '×', '÷': '÷' };
  var level = 'easy', last = {}, P = null, placed = {}, status = {}, pool = [], selCell = -1, selPool = -1, moves = 0, won = false;
  var cellOf = {}; NX.nums.forEach(function (rc, id) { cellOf[rc[0] + ',' + rc[1]] = id; });

  function pick() {
    var arr = NX.puzzles[level], n; do { n = Math.floor(Math.random() * arr.length); } while (arr.length > 1 && n === last[level]);
    last[level] = n; board.dataset.pz = level + ':' + n; return arr[n];
  }
  function reset() {
    placed = {}; status = {}; selCell = -1; selPool = -1; moves = 0; won = false; pool = [];
    P.n.forEach(function (v, id) { if (P.h[id] === '1') pool.push({ v: v, used: false }); });
    pool.sort(function (a, b) { return a.v - b.v; });
    doneEl.hidden = true; liveEl.textContent = '';
    lvBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.level === level ? 'true' : 'false'); });
    draw();
  }
  function start(keep) { if (!keep || !P) P = pick(); reset(); }

  function drawBoard() {
    var cells = new Array(121);
    NX.eqs.forEach(function (eq, k) {
      eq.forEach(function (rc, i) {
        var idx = rc[0] * 11 + rc[1];
        if (i === 1) cells[idx] = { t: 'o', s: SYM[P.o[k]] };
        else if (i === 3) cells[idx] = { t: 'o', s: '=' };
        else cells[idx] = { t: 'n', id: cellOf[rc[0] + ',' + rc[1]] };
      });
    });
    var html = '';
    for (var i = 0; i < 121; i++) {
      var c = cells[i];
      if (!c) { html += '<span></span>'; continue; }
      if (c.t === 'o') { html += '<span class="nx-c nx-o" aria-hidden="true">' + c.s + '</span>'; continue; }
      var id = c.id;
      if (P.h[id] !== '1') { html += '<span class="nx-c nx-n">' + P.n[id] + '</span>'; continue; }
      var pl = placed[id], st = status[id], cls = 'nx-c nx-b' + (st === 'ok' ? ' ok' : st === 'bad' ? ' bad' : '') + (selCell === id ? ' sel' : '');
      var label = pl === undefined ? 'Empty square' : (st === 'ok' ? 'Correct: ' : 'Wrong: ') + pool[pl].v;
      html += '<button type="button" class="' + cls + '" data-id="' + id + '" aria-label="' + label + '"' + (st === 'ok' ? ' disabled' : '') + '>' + (pl === undefined ? '' : pool[pl].v) + '</button>';
    }
    board.innerHTML = html;
  }
  function drawPool() {
    poolEl.innerHTML = pool.map(function (p, i) { return p.used ? '' : '<button type="button" class="nx-pb' + (selPool === i ? ' sel' : '') + '" data-p="' + i + '">' + p.v + '</button>'; }).join('');
  }
  function draw() {
    drawBoard(); drawPool();
    var ok = 0, tot = 0; for (var id in status) if (status[id] === 'ok') ok++;
    P.h.split('').forEach(function (c) { if (c === '1') tot++; });
    okEl.textContent = ok + ' of ' + tot; movesEl.textContent = moves;
    if (!won && ok === tot) {
      won = true; doneEl.hidden = false;
      var t = 'Well done! You completed the puzzle in ' + moves + ' moves.';
      document.getElementById('nx-donetxt').textContent = t; liveEl.textContent = t;
      poolEl.innerHTML = '';
      var r = doneEl.getBoundingClientRect(); if (r.bottom > window.innerHeight || r.top < 0) doneEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  function place(id, pi) {
    if (placed[id] !== undefined) pool[placed[id]].used = false;
    placed[id] = pi; pool[pi].used = true; moves++;
    status[id] = pool[pi].v === P.n[id] ? 'ok' : 'bad';
    selCell = -1; selPool = -1;
    liveEl.textContent = status[id] === 'ok' ? 'Correct.' : 'Not correct. Try another number.';
    draw();
  }
  board.addEventListener('click', function (e) {
    var b = e.target.closest('.nx-b'); if (!b || won) return;
    var id = +b.dataset.id; if (status[id] === 'ok') return;
    if (selPool >= 0) { place(id, selPool); return; }
    selCell = selCell === id ? -1 : id; drawBoard();
  });
  poolEl.addEventListener('click', function (e) {
    var b = e.target.closest('.nx-pb'); if (!b || won) return;
    var pi = +b.dataset.p;
    if (selCell >= 0) { place(selCell, pi); return; }
    selPool = selPool === pi ? -1 : pi; drawPool();
  });
  lvBtns.forEach(function (b) { b.addEventListener('click', function () { level = b.dataset.level; start(false); }); });
  document.getElementById('nx-new').addEventListener('click', function () { start(false); });
  document.getElementById('nx-next').addEventListener('click', function () { start(false); });
  document.getElementById('nx-restart').addEventListener('click', function () { start(true); });
  start(false);
})();
