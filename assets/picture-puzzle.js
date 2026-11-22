/* TOMfit Picture Swap. Easy: 16 pieces (4x4), Hard: 20 pieces (5x4). Click two pieces to swap them.
   To add pictures: put 4:3 JPG files (1200x900) in /img/puzzle/ and add a line to PICS. */
(function () {
  var PICS = [
    { src: '/img/puzzle/spring-blossom.jpg', name: 'Spring blossom and daffodils' },
    { src: '/img/puzzle/winter-pond.jpg', name: 'Skating on the village pond' },
    { src: '/img/puzzle/christmas-tree.jpg', name: 'Decorating the Christmas tree' },
    { src: '/img/puzzle/halloween.jpg', name: 'Halloween trick-or-treating' },
    { src: '/img/puzzle/autumn-reflections-at-malbork-castle.jpg', name: 'Autumn Reflections at Malbork Castle' },
    { src: '/img/puzzle/autumn-reflections-in-hallstatt.jpg', name: 'Autumn Reflections in Hallstatt' },
    { src: '/img/puzzle/autumn-tower-bridge-by-the-thames.jpg', name: 'Autumn Tower Bridge by the Thames' },
    { src: '/img/puzzle/autumn-at-sacre-coeur-montmartre.jpg', name: 'Autumn at Sacré-Cœur, Montmartre' },
    { src: '/img/puzzle/autumn-boating-at-el-retiro.jpg', name: 'Autumn boating at El Retiro' },
    { src: '/img/puzzle/big-ben-and-bus-on-westminster-bridge.jpg', name: 'Big Ben and bus on Westminster Bridge' },
    { src: '/img/puzzle/charles-bridge-and-prague-castle-in-autumn.jpg', name: 'Charles Bridge and Prague Castle in Autumn' },
    { src: '/img/puzzle/gamla-stan-waterfront-in-summer.jpg', name: 'Gamla Stan Waterfront in Summer' },
    { src: '/img/puzzle/gdansks-colorful-motlawa-waterfront.jpg', name: 'Gdańsk\'s Colorful Motława Waterfront' },
    { src: '/img/puzzle/geirangerfjord-and-the-seven-sisters.jpg', name: 'Geirangerfjord and the Seven Sisters' },
    { src: '/img/puzzle/golden-autumn-over-florences-ponte-vecchio.jpg', name: 'Golden Autumn Over Florence\'s Ponte Vecchio' },
    { src: '/img/puzzle/golden-autumn-at-the-colosseum.jpg', name: 'Golden Autumn at the Colosseum' },
    { src: '/img/puzzle/krakow-market-square-in-early-summer.jpg', name: 'Kraków Market Square in Early Summer' },
    { src: '/img/puzzle/naples-waterfront-castel-dellovo-and-vesuvius.jpg', name: 'Naples Waterfront, Castel dell\'Ovo and Vesuvius' },
    { src: '/img/puzzle/pisas-leaning-tower-in-spring.jpg', name: 'Pisa\'s Leaning Tower in Spring' },
    { src: '/img/puzzle/plaza-mayor-in-spring-sunshine.jpg', name: 'Plaza Mayor in Spring Sunshine' },
    { src: '/img/puzzle/rozenhoedkaai-canal-in-autumn.jpg', name: 'Rozenhoedkaai Canal in Autumn' },
    { src: '/img/puzzle/spring-morning-at-schonbrunn-palace.jpg', name: 'Spring Morning at Schönbrunn Palace' },
    { src: '/img/puzzle/springtime-paris-by-the-seine.jpg', name: 'Springtime Paris by the Seine' },
    { src: '/img/puzzle/springtime-in-warsaw-castle-square.jpg', name: 'Springtime in Warsaw Castle Square' },
    { src: '/img/puzzle/springtime-windmills-at-kinderdijk.jpg', name: 'Springtime windmills at Kinderdijk' },
    { src: '/img/puzzle/st-wolfgang-by-turquoise-waters.jpg', name: 'St Wolfgang by Turquoise Waters' },
    { src: '/img/puzzle/sunlit-rialto-bridge-and-gondola.jpg', name: 'Sunlit Rialto Bridge and Gondola' },
    { src: '/img/puzzle/sunny-nyhavn-with-colorful-waterfront-boats.jpg', name: 'Sunny Nyhavn with Colorful Waterfront Boats' },
    { src: '/img/puzzle/sunny-stephansplatz-with-st-stephens-cathedral.jpg', name: 'Sunny Stephansplatz with St. Stephen\'s Cathedral' },
    { src: '/img/puzzle/trevi-fountain-in-spring-sunlight.jpg', name: 'Trevi Fountain in spring sunlight' },
    { src: '/img/puzzle/verona-s-arena-in-morning-light.jpg', name: 'Verona\'s Arena in Morning Light' }
  ];
  var LEVELS = { easy: [4, 4], hard: [5, 4] };   /* [columns, rows] */
  var board = document.getElementById('pp-board'); if (!board) return;
  var movesEl = document.getElementById('pp-moves'), okEl = document.getElementById('pp-ok'),
      doneEl = document.getElementById('pp-done'), liveEl = document.getElementById('pp-live'),
      refEl = document.getElementById('pp-ref'), nameEl = document.getElementById('pp-name'),
      lvBtns = document.querySelectorAll('[data-level]');
  var level = 'easy', pic = -1, order = [], sel = -1, moves = 0, solved = false, cols = 4, rows = 4;

  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function inPlace() { var n = 0; order.forEach(function (v, i) { if (v === i) n++; }); return n; }

  function pieceStyle(v) {
    var c = v % cols, r = Math.floor(v / cols), p = PICS[pic];
    return 'background-image:url(' + p.src + ');background-size:' + (cols * 100) + '% ' + (rows * 100) + '%;background-position:' + (cols > 1 ? c / (cols - 1) * 100 : 0) + '% ' + (rows > 1 ? r / (rows - 1) * 100 : 0) + '%';
  }
  function draw() {
    board.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
    board.innerHTML = order.map(function (v, i) {
      return '<button type="button" class="pp-p' + (v === i ? ' ok' : '') + (i === sel ? ' sel' : '') + '" data-i="' + i + '" style="' + pieceStyle(v) + '" aria-label="Piece ' + (i + 1) + ' of ' + order.length + (v === i ? ', in the right place' : '') + '"></button>';
    }).join('');
    okEl.textContent = inPlace() + ' of ' + order.length; movesEl.textContent = moves;
  }
  function newGame(keepPic) {
    var cfg = LEVELS[level]; cols = cfg[0]; rows = cfg[1];
    if (!keepPic || pic < 0) { var n; do { n = Math.floor(Math.random() * PICS.length); } while (PICS.length > 1 && n === pic); pic = n; }
    refEl.src = PICS[pic].src; nameEl.textContent = PICS[pic].name;
    var ids = []; for (var i = 0; i < cols * rows; i++) ids.push(i);
    do { order = shuffle(ids.slice()); } while (inPlace() > 2);   /* start well mixed */
    sel = -1; moves = 0; solved = false; board.classList.remove('won'); doneEl.hidden = true; liveEl.textContent = '';
    lvBtns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.level === level ? 'true' : 'false'); });
    draw();
  }
  board.addEventListener('click', function (e) {
    var b = e.target.closest('.pp-p'); if (!b || solved) return;
    var i = +b.dataset.i;
    if (sel < 0) { sel = i; draw(); var f = board.children[i]; if (f) f.focus({ preventScroll: true }); return; }
    if (sel === i) { sel = -1; draw(); return; }
    var t = order[sel]; order[sel] = order[i]; order[i] = t; sel = -1; moves++; draw();
    var n = inPlace(); liveEl.textContent = n + ' of ' + order.length + ' pieces in place.';
    if (n === order.length) {
      solved = true; board.classList.add('won'); doneEl.hidden = false;
      document.getElementById('pp-donetxt').textContent = 'Well done! You rebuilt the picture in ' + moves + ' moves.';
      liveEl.textContent = 'Well done! You rebuilt the picture in ' + moves + ' moves.';
      okEl.textContent = n + ' of ' + n;
      var rect = doneEl.getBoundingClientRect(); if (rect.bottom > window.innerHeight) doneEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  lvBtns.forEach(function (b) { b.addEventListener('click', function () { level = b.dataset.level; newGame(true); }); });
  document.getElementById('pp-new').addEventListener('click', function () { newGame(false); });
  document.getElementById('pp-next').addEventListener('click', function () { newGame(false); });
  document.getElementById('pp-shuffle').addEventListener('click', function () { newGame(true); });
  newGame(false);
})();
