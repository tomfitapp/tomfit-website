/* TOMfit.app – small page helpers (no tracking, no cookies) */
(function () {
  'use strict';

  /* ---- header picture carousel ---- */
  var car = document.querySelector('[data-car]');
  if (car) {
    var IM = [
      ['/img/01_walk.jpg', 'Walk – today'],
      ['/img/02_walk_progress_charts.jpg', 'Walk – progress charts'],
      ['/img/03_health.jpg', 'Health – your numbers'],
      ['/img/04_health_report.jpg', 'Health – report for your doctor'],
      ['/img/05_meds.jpg', 'Meds & supps – today'],
      ['/img/06_meds_list.jpg', 'Meds & supps – your list'],
      ['/img/07_exercise_daily_core_chair_squats.jpg', 'Exercises – daily core'],
      ['/img/08_exercise_kettlebell_swing.jpg', 'Exercises – kettlebell'],
      ['/img/09_settings.jpg', 'Settings']
    ];
    var n = IM.length, i = 0;
    var box = car.querySelector('.imgs'), cap = document.querySelector('[data-cap]'), dots = document.querySelector('[data-dots]');
    var imgs = box.querySelectorAll('img');
    var show = function () {
      [-2, -1, 0, 1, 2].forEach(function (o, j) {
        var k = (i + o + n) % n, el = imgs[j];
        el.src = IM[k][0]; el.alt = 'TOMfit app: ' + IM[k][1]; el.className = 'c' + Math.abs(o); el.dataset.k = k;
      });
      cap.textContent = IM[i][1];
      Array.prototype.forEach.call(dots.children, function (d, k) { d.className = k === i ? 'on' : ''; });
    };
    var go = function (k) { i = (k + n) % n; show(); };
    car.querySelector('[data-prev]').addEventListener('click', function () { go(i - 1); });
    car.querySelector('[data-next]').addEventListener('click', function () { go(i + 1); });
    box.addEventListener('click', function (e) { if (e.target.dataset.k) go(+e.target.dataset.k); });
    var tx = null;
    car.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    car.addEventListener('touchend', function (e) {
      if (tx == null) return; var d = e.changedTouches[0].clientX - tx;
      if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1)); tx = null;
    });
    show();
  }

  /* ---- The App page: tabs + picture switcher ---- */
  var tabs = document.querySelectorAll('[data-tab]');
  if (tabs.length) {
    var secs = document.querySelectorAll('.sec');
    var names = Array.prototype.map.call(secs, function (s) { return s.dataset.name; });
    var cur = 0;
    var pick = function (t, push) {
      cur = (t + secs.length) % secs.length;
      secs.forEach(function (s, x) { s.hidden = x !== cur; });
      tabs.forEach(function (b, x) { b.setAttribute('aria-selected', x === cur ? 'true' : 'false'); });
      document.querySelector('[data-prevtab]').textContent = '← ' + names[(cur - 1 + secs.length) % secs.length];
      document.querySelector('[data-nexttab]').textContent = names[(cur + 1) % secs.length] + ' →';
      if (push) history.replaceState(null, '', '#' + secs[cur].id);
    };
    tabs.forEach(function (b, x) { b.addEventListener('click', function () { pick(x, true); }); });
    document.querySelector('[data-prevtab]').addEventListener('click', function () { pick(cur - 1, true); window.scrollTo({ top: document.querySelector('.gp').offsetTop - 20, behavior: 'smooth' }); });
    document.querySelector('[data-nexttab]').addEventListener('click', function () { pick(cur + 1, true); window.scrollTo({ top: document.querySelector('.gp').offsetTop - 20, behavior: 'smooth' }); });
    secs.forEach(function (s) {
      if (!s.dataset.imgs) return;
      var list = s.dataset.imgs.split('|'), k = 0, img = s.querySelector('.shot img'), no = s.querySelector('[data-no]');
      var set = function () { img.src = list[k]; no.textContent = 'Picture ' + (k + 1) + ' of ' + list.length; };
      s.querySelectorAll('.sbtn').forEach(function (b) {
        b.addEventListener('click', function () { k = (k + (b.dataset.d === '1' ? 1 : -1) + list.length) % list.length; set(); });
      });
    });
    var h = location.hash.slice(1), start = 0;
    secs.forEach(function (s, x) { if (s.id === h) start = x; });
    pick(start, false);
  }

  /* ---- Info-Bank: show one article at a time ---- */
  var arts = document.querySelectorAll('.art');
  if (arts.length) {
    var rows = document.querySelectorAll('.arow'), ghds = document.querySelectorAll('.ghd'), tbs = document.querySelectorAll('.tbtn');
    var openArt = function (id, scroll) {
      var el = document.getElementById(id); if (!el) return;
      var g = el.dataset.g;
      arts.forEach(function (a) { a.hidden = a !== el; });
      rows.forEach(function (r) { r.classList.toggle('on', r.getAttribute('href') === '#' + id); });
      ghds.forEach(function (b) { b.classList.toggle('on', b.dataset.g === g); });
      tbs.forEach(function (b) { b.classList.toggle('on', b.dataset.g === g); });
      if (scroll && window.innerWidth < 900) el.scrollIntoView({ behavior: 'smooth' });
    };
    var firstOf = function (g) { return document.querySelector('.art[data-g="' + g + '"]').id; };
    rows.forEach(function (r) {
      r.addEventListener('click', function (e) { e.preventDefault(); var id = r.getAttribute('href').slice(1); history.replaceState(null, '', '#' + id); openArt(id, true); });
    });
    Array.prototype.forEach.call(ghds, function (b) { b.addEventListener('click', function () { var id = firstOf(b.dataset.g); history.replaceState(null, '', '#' + id); openArt(id, false); }); });
    Array.prototype.forEach.call(tbs, function (b) { b.addEventListener('click', function () { var id = firstOf(b.dataset.g); history.replaceState(null, '', '#' + id); openArt(id, false); }); });
    var hh = location.hash.slice(1);
    openArt(document.getElementById(hh) && document.getElementById(hh).classList.contains('art') ? hh : arts[0].id, false);
  }
})();
