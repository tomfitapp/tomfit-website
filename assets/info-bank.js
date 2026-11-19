/* TOMfit Info-Bank – sorts the articles into NEW / subject panels / Archives by date.
   No tracking, no cookies. Rules: NEW for 14 days; Archives after 6 months; max 5 per subject panel. */
(function () {
  'use strict';
  var NEW_DAYS = 14, ARCHIVE_MONTHS = 6, MAX_PER_PANEL = 5;
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var GROUPS = ['health', 'exercises', 'supplements'];

  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function label(s) { var d = parse(s); return MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }
  function newestFirst(list) {
    return list.map(function (a, i) { return { a: a, i: i }; })
      .sort(function (x, y) { var d = parse(y.a.added) - parse(x.a.added); return d || x.i - y.i; })
      .map(function (o) { return o.a; });
  }

  function sortArticles(articles, now) {
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var out = { 'new': [], health: [], exercises: [], supplements: [], archive: [] };
    var fresh = [], rest = { health: [], exercises: [], supplements: [] };
    articles.forEach(function (a) {
      var added = parse(a.added);
      var limit = new Date(added.getFullYear(), added.getMonth() + ARCHIVE_MONTHS, added.getDate());
      if (today >= limit) { out.archive.push(a); return; }
      var days = Math.round((today - added) / 864e5);
      if (!a.legacy && days < NEW_DAYS) { fresh.push(a); return; }
      if (rest[a.group]) rest[a.group].push(a);
    });
    out['new'] = newestFirst(fresh);
    GROUPS.forEach(function (g) {
      var list = newestFirst(rest[g]);
      out[g] = list.slice(0, MAX_PER_PANEL);
      out.archive = out.archive.concat(list.slice(MAX_PER_PANEL));
    });
    return out;
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  function pdfLink(a) {
    var l = el('a', '', 'Free PDF – open now');
    l.href = a.pdf; l.target = '_blank'; l.rel = 'noopener';
    return l;
  }

  function renderPanels(root, sorted) {
    ['new'].concat(GROUPS).forEach(function (g) {
      var box = root.querySelector('[data-g="' + g + '"] [data-list]');
      if (!box) return;
      box.textContent = '';
      var list = sorted[g];
      if (!list.length) {
        box.appendChild(el('p', 'ibempty', g === 'new' ? 'No new articles right now. Fresh guides appear here for 2 weeks.' : 'No articles here yet.'));
        return;
      }
      list.forEach(function (a) {
        var e = el('div', 'ibe');
        e.appendChild(el('b', '', a.title));
        e.appendChild(el('span', 's', a.sub));
        e.appendChild(el('span', 'd', label(a.added)));
        e.appendChild(pdfLink(a));
        box.appendChild(e);
      });
    });
  }

  function renderArchive(box, sorted) {
    box.textContent = '';
    var list = sorted.archive.slice().sort(function (x, y) {
      return x.full.toLowerCase().localeCompare(y.full.toLowerCase());
    });
    if (!list.length) {
      box.appendChild(el('p', 'ibempty', 'Nothing here yet. Articles move to the Archives after 6 months, or when a subject has more than 5 articles.'));
      return;
    }
    list.forEach(function (a) {
      var r = el('div', 'ibr');
      r.appendChild(el('b', '', a.full));
      r.appendChild(el('span', 'd', label(a.added)));
      r.appendChild(pdfLink(a));
      box.appendChild(r);
    });
  }

  window.TOMFIT_IB = { sort: sortArticles };

  var data = window.TOMFIT_ARTICLES;
  if (!data) return;
  var sorted = sortArticles(data, new Date());
  var panels = document.querySelector('[data-ib-panels]');
  if (panels) {
    renderPanels(panels, sorted);
    var pills = document.querySelectorAll('.ibpb[data-g]');
    Array.prototype.forEach.call(pills, function (b) {
      b.addEventListener('click', function () {
        var t = panels.querySelector('[data-g="' + b.dataset.g + '"]');
        if (!t) return;
        var calm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        t.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
        t.classList.add('flash');
        setTimeout(function () { t.classList.remove('flash'); }, 1400);
      });
    });
  }
  var arch = document.querySelector('[data-ib-archive]');
  if (arch) renderArchive(arch, sorted);
})();
