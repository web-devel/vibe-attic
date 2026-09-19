// Vibe Coding TV deck: scaling, navigation, step reveals, overview, and the pixel sprites.
(function () {
  'use strict';

  var STAGE_W = 1920;
  var STAGE_H = 1080;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var stage = document.getElementById('stage');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var railFill = document.getElementById('railFill');
  var railCount = document.getElementById('railCount');
  var overview = document.getElementById('overview');
  var blackout = document.getElementById('blackout');

  var index = 0;
  var step = 0;

  // ---------- Scaling ----------

  function resize() {
    var scale = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
    stage.style.setProperty('--scale', scale);
  }

  // Shrink one-line headlines and commands until they fit, whatever fonts the machine has.
  function fitText() {
    document.querySelectorAll('.fit').forEach(function (el) {
      var box = el.parentElement;
      var style = getComputedStyle(box);
      var room = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      Array.prototype.forEach.call(box.children, function (sibling) {
        if (sibling !== el) { room -= sibling.offsetWidth + (parseFloat(style.columnGap) || 0); }
      });
      el.style.fontSize = '';
      var size = parseFloat(getComputedStyle(el).fontSize);
      while (el.offsetWidth > room && size > 48) {
        size -= 4;
        el.style.fontSize = size + 'px';
      }
    });
  }

  // ---------- Navigation ----------

  function stepsIn(slide) {
    var max = 0;
    slide.querySelectorAll('[data-step]').forEach(function (el) {
      max = Math.max(max, Number(el.getAttribute('data-step')));
    });
    return max;
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function render() {
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === index);
    });
    slides[index].querySelectorAll('[data-step]').forEach(function (el) {
      el.classList.toggle('is-shown', Number(el.getAttribute('data-step')) <= step);
    });
    railFill.style.width = (slides.length > 1 ? (index / (slides.length - 1)) * 100 : 100) + '%';
    railCount.textContent = pad(index + 1) + ' / ' + pad(slides.length);
    document.title = (slides[index].getAttribute('data-title') || 'Slide') + ' — Vibe Coding';
    // Keep the slide number in the address so a refresh stays on the same slide.
    if (location.hash !== '#' + (index + 1)) {
      try { history.replaceState(null, '', '#' + (index + 1)); } catch (e) { location.hash = '#' + (index + 1); }
    }
  }

  function go(target, showAllSteps) {
    index = Math.max(0, Math.min(slides.length - 1, target));
    step = showAllSteps ? stepsIn(slides[index]) : 0;
    render();
  }

  function next() {
    if (step < stepsIn(slides[index])) { step += 1; render(); return; }
    if (index < slides.length - 1) { go(index + 1); }
  }

  function prev() {
    if (step > 0) { step -= 1; render(); return; }
    if (index > 0) { go(index - 1, true); }
  }

  function fromHash() {
    var n = parseInt(location.hash.replace('#', ''), 10);
    if (n >= 1 && n <= slides.length && n - 1 !== index) { go(n - 1); }
  }

  // ---------- Fullscreen, blackout, overview ----------

  function toggleFullscreen() {
    var doc = document;
    var root = doc.documentElement;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
    } else {
      (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
    }
    keepAwake();
  }

  var wakeLock = null;
  function keepAwake() {
    if (wakeLock || !navigator.wakeLock) { return; }
    navigator.wakeLock.request('screen').then(function (lock) {
      wakeLock = lock;
      lock.addEventListener('release', function () { wakeLock = null; });
    }).catch(function () { /* not available here; the TV's own settings apply */ });
  }

  function accentOf(slide) {
    return 'var(--' + (slide.getAttribute('data-accent') || 'ink') + ')';
  }

  function buildOverview() {
    var heading = document.createElement('h2');
    heading.textContent = 'All slides';
    var list = document.createElement('ol');
    slides.forEach(function (slide, i) {
      var item = document.createElement('li');
      var button = document.createElement('button');
      var num = document.createElement('span');
      var label = document.createElement('span');
      button.type = 'button';
      button.style.setProperty('--c', accentOf(slide));
      num.className = 'num';
      num.textContent = pad(i + 1);
      label.textContent = slide.getAttribute('data-title') || 'Slide ' + (i + 1);
      button.appendChild(num);
      button.appendChild(label);
      button.addEventListener('click', function () { go(i); toggleOverview(false); });
      item.appendChild(button);
      list.appendChild(item);
    });
    overview.appendChild(heading);
    overview.appendChild(list);
  }

  function toggleOverview(open) {
    var show = typeof open === 'boolean' ? open : overview.hidden;
    if (show && !overview.firstChild) { buildOverview(); }
    overview.hidden = !show;
    if (show) {
      var buttons = overview.querySelectorAll('button');
      buttons.forEach(function (b, i) { b.classList.toggle('is-current', i === index); });
      buttons[index].focus();
    }
  }

  // ---------- Input ----------

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) { return; }
    var key = e.key;

    if (!overview.hidden) {
      if (key === 'Escape' || key === 'o' || key === 'O') { toggleOverview(false); e.preventDefault(); }
      return;
    }
    if (!blackout.hidden) { blackout.hidden = true; e.preventDefault(); return; }

    switch (key) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter':
        next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace':
        prev(); break;
      case 'Home': go(0); break;
      case 'End': go(slides.length - 1, true); break;
      case 'f': case 'F': toggleFullscreen(); break;
      case 'o': case 'O': case 'Escape': toggleOverview(true); break;
      case 'b': case 'B': case '.': blackout.hidden = false; break;
      default: return;
    }
    e.preventDefault();
    keepAwake();
  });

  stage.addEventListener('click', function (e) {
    if (String(window.getSelection())) { return; }
    if (e.clientX < window.innerWidth * 0.3) { prev(); } else { next(); }
  });

  blackout.addEventListener('click', function () { blackout.hidden = true; });

  var touchX = null;
  document.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (touchX === null || !overview.hidden) { return; }
    var dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 60) { if (dx < 0) { next(); } else { prev(); } }
  }, { passive: true });

  var cursorTimer = null;
  document.addEventListener('mousemove', function () {
    document.body.classList.remove('cursor-hidden');
    clearTimeout(cursorTimer);
    cursorTimer = setTimeout(function () { document.body.classList.add('cursor-hidden'); }, 2500);
  });

  // ---------- Pixel sprites ----------

  var SPRITES = {
    dino: {
      gradient: ['#f1813c', '#e94b89'],
      body: [
        '............XXXXXXXX..',
        '...........XXXXXXXXXX.',
        '...........XX.XXXXXXX.',
        '...........XXXXXXXXXX.',
        '...........XXXXXXXXXX.',
        '...........XXXXX......',
        '...........XXXXXXXX...',
        'X.........XXXXX.......',
        'X........XXXXXX.......',
        'XX.....XXXXXXXXXX.....',
        'XXX...XXXXXXXXX.X.....',
        'XXXX.XXXXXXXXXX.......',
        'XXXXXXXXXXXXXXX.......',
        '.XXXXXXXXXXXXX........',
        '..XXXXXXXXXXXX........',
        '...XXXXXXXXXX.........',
        '....XXXXXXXX..........'
      ],
      // Two leg poses; the title slide alternates them so the dinosaur runs.
      frames: [
        [
          '.....XXX.XXX..........',
          '.....XX...XX..........',
          '.....X....XXX.........',
          '.....XX...............'
        ],
        [
          '.....XXX.XXX..........',
          '.....XX...XX..........',
          '.....XXX..X...........',
          '..........XX..........'
        ]
      ]
    },
    cactus: {
      color: '#04f05c',
      body: [
        '..XX..',
        '..XX.X',
        'X.XX.X',
        'X.XX.X',
        'X.XXXX',
        'XXXX..',
        '..XX..',
        '..XX..',
        '..XX..'
      ],
      frames: []
    }
  };

  // One path per set of rows; each run of filled cells becomes a single rectangle.
  function rowsToPath(rows, cell, rowOffset) {
    var d = '';
    rows.forEach(function (row, r) {
      var start = -1;
      for (var c = 0; c <= row.length; c += 1) {
        var filled = row.charAt(c) === 'X';
        if (filled && start < 0) { start = c; }
        if (!filled && start >= 0) {
          d += 'M' + start * cell + ' ' + (r + rowOffset) * cell + 'h' + (c - start) * cell + 'v' + cell + 'h' + (start - c) * cell + 'z';
          start = -1;
        }
      }
    });
    return d;
  }

  var spriteCount = 0;

  function buildSprite(host) {
    var sprite = SPRITES[host.getAttribute('data-sprite')];
    if (!sprite) { return; }
    var cell = Number(host.getAttribute('data-cell')) || 10;
    var cols = sprite.body[0].length;
    var rowCount = sprite.body.length + (sprite.frames[0] ? sprite.frames[0].length : 0);
    var width = cols * cell;
    var height = rowCount * cell;
    var inSvg = host.namespaceURI === SVG_NS;
    var root = host;

    if (inSvg) {
      host.setAttribute('transform', 'translate(' + (host.getAttribute('data-x') || 0) + ' ' + (host.getAttribute('data-y') || 0) + ')');
    } else {
      root = document.createElementNS(SVG_NS, 'svg');
      root.setAttribute('width', width);
      root.setAttribute('height', height);
      root.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
      host.appendChild(root);
    }

    var fill = sprite.color;
    if (sprite.gradient) {
      spriteCount += 1;
      var id = 'sprite-fill-' + spriteCount;
      var defs = document.createElementNS(SVG_NS, 'defs');
      var gradient = document.createElementNS(SVG_NS, 'linearGradient');
      gradient.setAttribute('id', id);
      gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
      gradient.setAttribute('x1', 0);
      gradient.setAttribute('x2', width);
      sprite.gradient.forEach(function (color, i) {
        var stop = document.createElementNS(SVG_NS, 'stop');
        stop.setAttribute('offset', i);
        stop.setAttribute('stop-color', color);
        gradient.appendChild(stop);
      });
      defs.appendChild(gradient);
      root.appendChild(defs);
      fill = 'url(#' + id + ')';
    }

    function addPath(rows, rowOffset, className) {
      var path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', rowsToPath(rows, cell, rowOffset));
      path.setAttribute('fill', fill);
      path.setAttribute('shape-rendering', 'crispEdges');
      if (className) { path.setAttribute('class', className); }
      root.appendChild(path);
    }

    addPath(sprite.body, 0);
    sprite.frames.forEach(function (rows, i) {
      addPath(rows, sprite.body.length, i === 0 ? 'frame-a' : 'frame-b');
    });
    if (host.getAttribute('data-run') === 'true') { root.classList.add('is-running'); }
  }

  // ---------- Start ----------

  document.querySelectorAll('[data-sprite]').forEach(buildSprite);
  window.addEventListener('resize', resize);
  window.addEventListener('hashchange', fromHash);
  resize();
  fitText();
  if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitText); }

  var initial = parseInt(location.hash.replace('#', ''), 10);
  go(initial >= 1 && initial <= slides.length ? initial - 1 : 0);
})();
