/* TOMfit.app – Christmas decoration in the blue header.
   Garland + tree: 15 December – 15 January (every year).
   Home-page ribbon: "Merry Christmas" 20–26 December, "Happy New Year <year>" 27 December – 10 January.
   Preview: ?xmas=1 (today's look), ?xmas=xmas (Merry Christmas), ?xmas=ny (Happy New Year) */
(function () {
  'use strict';
  var hd = document.querySelector('.hd');
  if (!hd || hd.querySelector('.xg')) return;

  var css = '' +
    '.hd{position:relative}' +
    '.xg{position:absolute;left:0;right:0;top:0;height:56px;pointer-events:none;z-index:2;' +
      'background:url("data:image/svg+xml,' + encodeURIComponent(garland()) + '") repeat-x left top;background-size:400px 56px}' +
    '.xmas .topbar{padding-top:50px}' +
    '.xt{position:relative;flex:none;width:74px;height:92px;margin:2px 0 -30px;pointer-events:none}' +
    '.xt svg{width:100%;height:100%;display:block;overflow:visible}' +
    '.xt .st{transform-origin:37px 9px;animation:xtw 3.2s ease-in-out infinite}' +
    '.xt .lt{animation:xbl 2.4s ease-in-out infinite}.xt .lt.b{animation-delay:.8s}.xt .lt.c{animation-delay:1.6s}' +
    '@keyframes xtw{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.18);opacity:.8}}' +
    '@keyframes xbl{0%,100%{opacity:1}50%{opacity:.35}}' +
    '@media (max-width:1000px){.xt{width:56px;height:70px;margin:0 0 -16px}}@media (max-width:640px){.xt{position:absolute;right:0;top:54px;width:62px;height:77px;margin:0}.xmas .topbar{position:relative;padding-top:56px}}' +
    '@media (prefers-reduced-motion:reduce){.xt .st,.xt .lt{animation:none}}';
  var s = document.createElement('style');
  s.textContent = css;
  document.head.appendChild(s);

  var g = document.createElement('div');
  g.className = 'xg';
  g.setAttribute('aria-hidden', 'true');
  hd.insertBefore(g, hd.firstChild);

  var bar = hd.querySelector('.topbar'), logo = hd.querySelector('.logo');
  if (bar && logo) {
    var t = document.createElement('div');
    t.className = 'xt';
    t.setAttribute('aria-hidden', 'true');
    t.innerHTML = tree();
    logo.insertAdjacentElement('afterend', t);
  }
  document.documentElement.classList.add('xmas');

  /* ---- ribbon over the picture carousel (home page only) ---- */
  var q = (location.search.match(/[?&]xmas=(\w+)/) || [])[1], now = new Date(), mo = now.getMonth() + 1, dy = now.getDate();
  var mode = q === 'xmas' ? 'xmas' : q === 'ny' ? 'ny' : (mo === 12 && dy >= 20 && dy <= 26) ? 'xmas' : ((mo === 12 && dy >= 27) || (mo === 1 && dy <= 10)) ? 'ny' : '';
  var carw = hd.querySelector('.carw');
  if (mode && carw) {
    var yr = mo === 1 ? now.getFullYear() : now.getFullYear() + 1;
    var st = document.createElement('style');
    st.textContent = '.carw{position:relative}' +
      '.xr{position:absolute;left:50%;top:-34px;transform:translateX(-50%);width:min(620px,104%);z-index:3;pointer-events:none;filter:drop-shadow(0 6px 10px rgba(6,30,80,.35))}' +
      '.xr svg{display:block;width:100%;height:auto;overflow:visible}' +
      '.xr text{font-family:Inter,system-ui,sans-serif;font-weight:800}' +
      '@media (max-width:640px){.xr{top:-22px;width:100%}}';
    document.head.appendChild(st);
    var r = document.createElement('div');
    r.className = 'xr';
    r.setAttribute('role', 'img');
    r.setAttribute('aria-label', mode === 'xmas' ? 'Merry Christmas' : 'Happy New Year ' + yr);
    r.innerHTML = ribbon(mode === 'xmas' ? 'MERRY CHRISTMAS' : 'HAPPY NEW YEAR', mode === 'ny' ? String(yr) : '');
    carw.insertBefore(r, carw.firstChild);
  }

  function ribbon(txt, year) {
    var h = year ? 200 : 128;
    var red = '#d9261c', dark = '#9e1610';
    var out = '<svg viewBox="0 0 640 ' + h + '" aria-hidden="true">' +
      /* tails with a V-notch */
      '<path d="M8 34 H150 V104 H8 L52 69 Z" fill="' + red + '" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M632 34 H490 V104 H632 L588 69 Z" fill="' + red + '" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
      /* folds */
      '<path d="M150 104 L176 104 L176 120 Z" fill="' + dark + '"/>' +
      '<path d="M490 104 L464 104 L464 120 Z" fill="' + dark + '"/>' +
      /* front band */
      '<path d="M126 14 Q126 6 134 6 H506 Q514 6 514 14 V104 Q514 112 506 112 H134 Q126 112 126 104 Z" fill="' + red + '" stroke="#fff" stroke-width="3"/>' +
      '<path d="M134 18 H506" stroke="#fff" stroke-width="1.5" opacity=".35"/>' +
      '<text x="320" y="76" text-anchor="middle" font-size="44" fill="#fff" textLength="350" lengthAdjust="spacingAndGlyphs">' + txt + '</text>';
    if (year) {
      out += '<path d="M190 118 H450 L496 156 L450 194 H190 L144 156 Z" fill="#1557c0" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
        '<text x="320" y="180" text-anchor="middle" font-size="68" fill="#fff" letter-spacing="2">' + year + '</text>';
    }
    return out + '</svg>';
  }

  /* one 400px tile of the garland: a full green swag with a light chain and four baubles in the dips */
  function garland() {
    var W = 400, i, x, y, a, out = '', line = '', chain = '';
    for (x = -10; x <= W + 10; x += 4) { line += (line ? 'L' : 'M') + x + ' ' + sag(x).toFixed(1); chain += (chain ? 'L' : 'M') + x + ' ' + (sag(x) + 3).toFixed(1); }
    var needles = ['', ''];
    for (x = -8, i = 0; x <= W + 8; x += 3, i++) {
      y = sag(x);
      for (var k = 0; k < 4; k++) {
        a = (k * 90 + i * 37) % 360 * Math.PI / 180;
        var len = 6 + (i * 7 + k * 3) % 4;
        needles[k % 2] += 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'l' + (Math.cos(a) * len).toFixed(1) + ' ' + (Math.sin(a) * len * .8).toFixed(1);
      }
    }
    var bulbs = '', cols = ['#ffe27a', '#ffffff', '#bfe3ff'];
    for (i = 0; i < 16; i++) { x = 12 + i * 25; bulbs += '<circle cx="' + x + '" cy="' + (sag(x) + 3).toFixed(1) + '" r="2.4" fill="' + cols[i % 3] + '"/>'; }
    function ball(cx, r, c) {
      var top = sag(cx) + 4, cy = top + 5 + r;
      return '<line x1="' + cx + '" y1="' + top + '" x2="' + cx + '" y2="' + (cy - r) + '" stroke="#f5c400" stroke-width="1.3"/>' +
        '<rect x="' + (cx - 3.5) + '" y="' + (cy - r - 3.5) + '" width="7" height="4.5" rx="1.2" fill="#e9c75a"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + c + '"/>' +
        '<path d="M' + (cx - r + 1) + ' ' + cy + 'h' + (2 * r - 2) + '" stroke="' + (c === '#ffffff' ? '#bfe3ff' : '#fff') + '" stroke-width="1.6" opacity=".8"/>' +
        '<circle cx="' + (cx - r * .38) + '" cy="' + (cy - r * .4) + '" r="' + r * .28 + '" fill="#fff" opacity=".6"/>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="56" viewBox="0 0 400 56">' +
      '<path d="' + line + '" fill="none" stroke="#1d6b37" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="' + needles[0] + '" stroke="#1f7a3e" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="' + needles[1] + '" stroke="#3aa35c" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="' + chain + '" fill="none" stroke="#f5c400" stroke-width="1.2" opacity=".9"/>' + bulbs +
      ball(50, 7.5, '#f5c400') + ball(150, 7, '#ffffff') + ball(250, 7.5, '#8fd0ff') + ball(350, 7, '#ffffff') +
      '</svg>';
  }
  /* height of the swag: dips at 50, 150, 250, 350; highest at every 100 */
  function sag(x) { return 7 + 13 * Math.sin(Math.PI * (((x % 100) + 100) % 100) / 100); }

  function tree() {
    return '<svg viewBox="0 0 74 92">' +
      '<rect x="32" y="76" width="10" height="12" rx="2" fill="#8a5a2b"/>' +
      '<path d="M37 12 L14 42 H24 L8 62 H20 L2 80 H72 L54 62 H66 L50 42 H60 Z" fill="#2f9e55" stroke="#1d6b37" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M22 40 Q37 48 52 38 M14 60 Q37 70 60 58 M8 78 Q37 86 66 76" fill="none" stroke="#f5c400" stroke-width="2" stroke-linecap="round"/>' +
      '<circle class="lt" cx="30" cy="31" r="3" fill="#ffffff"/>' +
      '<circle class="lt b" cx="44" cy="33" r="3" fill="#8fd0ff"/>' +
      '<circle class="lt c" cx="24" cy="52" r="3.4" fill="#f5c400"/>' +
      '<circle class="lt" cx="48" cy="54" r="3.4" fill="#ffffff"/>' +
      '<circle class="lt b" cx="36" cy="62" r="3.4" fill="#8fd0ff"/>' +
      '<circle class="lt c" cx="18" cy="71" r="3.6" fill="#ffffff"/>' +
      '<circle class="lt" cx="54" cy="70" r="3.6" fill="#f5c400"/>' +
      '<circle class="lt b" cx="34" cy="74" r="3" fill="#ffffff"/>' +
      '<g class="st"><path d="M37 1 L40 7.5 L47 8 L41.5 12.5 L43.5 19.5 L37 15.5 L30.5 19.5 L32.5 12.5 L27 8 L34 7.5 Z" fill="#f5c400" stroke="#fff3b0" stroke-width="1"/></g>' +
      '</svg>';
  }
})();
