/* ═══════════════════════════════════════════════════════════════════════════
   BLOCK AERO — Session WIP Indicator v1.0.0 (Brand Kit v3)
   ═══════════════════════════════════════════════════════════════════════════
   Occupancy loader for session / agent / model / Tessaron work-in-progress.

   Mechanic (Cursor-adjacent, BA-styled):
     · 3×3 fixed slots — animation toggles which cells are lit (not a ring spin)
     · Lit cells = Spectrum Wing tooth (chevron) by default; triangle optional
     · Color walks the brand spectrum by (cellIndex/9 + time):
         ember #E8761A → gold #F5C53A → blue #1C5FC0 → green #1AAB65

   When to use:
     · Left of a session / chat / agent row title while work is in flight
     · Tab chrome for an active agent run (14–18px)
     · NOT for boot splash (use Hangar Drift), network status (SpectrumLoader),
       or generic .spinner-sm pipeline activity (legacy hex assemble)

   API:
     SessionWip.create(el, { size, glyph, animate })
       → { destroy(), element, setAnimate(bool) }
     SessionWip.mountAll(root?)
       → mounts every [data-session-wip] under root (default: document)
     SessionWip.version
   ═══════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var VERSION = '1.0.0';
  var STYLE_ID = 'ba-session-wip-css';

  /* First two frames match the Cursor occupancy screenshot (house → offset). */
  var FRAMES = [
    [1, 3, 4, 5, 6, 8],
    [0, 1, 3, 4, 8],
    [1, 2, 4, 5, 6],
    [0, 2, 3, 4, 5],
    [0, 1, 2, 4, 7],
    [2, 3, 4, 5, 6],
    [0, 1, 3, 4, 7],
    [1, 3, 4, 5, 7]
  ];

  var STOPS = [
    [232, 118, 26],
    [245, 197, 58],
    [28, 95, 192],
    [26, 171, 101]
  ];

  var FRAME_MS = 140;
  var SPECTRUM_MS = 1800;

  var instances = [];
  var raf = 0;
  var t0 = 0;
  var reduce = false;

  function ensureCss() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '.ba-session-wip{' +
        '--ba-wip-size:14px;' +
        'width:var(--ba-wip-size);height:var(--ba-wip-size);' +
        'display:inline-grid;' +
        'grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);' +
        'gap:8%;flex-shrink:0;line-height:0;vertical-align:middle;' +
      '}' +
      '.ba-session-wip .ba-wip-cell{' +
        'width:100%;height:100%;opacity:0;' +
        'transition:opacity 60ms linear;' +
        'background:var(--ba-wip-c,#1C5FC0);' +
        'clip-path:polygon(0% 0%,62% 0%,100% 50%,62% 100%,0% 100%,38% 50%);' +
      '}' +
      '.ba-session-wip.ba-wip-tri .ba-wip-cell{' +
        'clip-path:polygon(8% 8%,92% 50%,8% 92%);' +
      '}' +
      '.ba-session-wip .ba-wip-cell.on{opacity:1;}';
    document.head.appendChild(s);
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function spectrumAt(t) {
    var n = STOPS.length - 1;
    var x = ((t % 1) + 1) % 1;
    var p = x * n;
    var i = Math.floor(p);
    var f = p - i;
    var a = STOPS[i];
    var b = STOPS[Math.min(i + 1, n)];
    return 'rgb(' +
      Math.round(lerp(a[0], b[0], f)) + ',' +
      Math.round(lerp(a[1], b[1], f)) + ',' +
      Math.round(lerp(a[2], b[2], f)) + ')';
  }

  function paintAll(now) {
    if (!t0) t0 = now;
    var elapsed = now - t0;
    var fi = reduce ? 0 : Math.floor(elapsed / FRAME_MS) % FRAMES.length;
    var on = FRAMES[fi];
    var phase = reduce ? 0.15 : (elapsed / SPECTRUM_MS);
    var n, i, inst, cell, lit;

    for (n = 0; n < instances.length; n++) {
      inst = instances[n];
      if (!inst.alive || !inst.animate) continue;
      for (i = 0; i < 9; i++) {
        cell = inst.cells[i];
        lit = on.indexOf(i) !== -1;
        if (lit) cell.classList.add('on');
        else cell.classList.remove('on');
        if (lit) cell.style.setProperty('--ba-wip-c', spectrumAt(i / 9 + phase));
      }
    }

    if (!reduce && instances.some(function (x) { return x.alive && x.animate; })) {
      raf = requestAnimationFrame(paintAll);
    } else {
      raf = 0;
    }
  }

  function armLoop() {
    if (raf) return;
    if (typeof window === 'undefined') return;
    reduce = !!(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    t0 = 0;
    if (reduce) paintAll(performance.now());
    else raf = requestAnimationFrame(paintAll);
  }

  function create(host, opts) {
    opts = opts || {};
    if (!host) throw new Error('SessionWip.create: host element required');
    ensureCss();

    var size = opts.size != null ? opts.size : 14;
    var glyph = opts.glyph === 'triangle' ? 'triangle' : 'chevron';
    var animate = opts.animate !== false;

    host.classList.add('ba-session-wip');
    host.classList.toggle('ba-wip-tri', glyph === 'triangle');
    host.style.setProperty('--ba-wip-size', size + 'px');
    host.setAttribute('role', host.getAttribute('role') || 'status');
    if (!host.getAttribute('aria-label')) {
      host.setAttribute('aria-label', 'Work in progress');
    }
    host.innerHTML = '';

    var cells = [];
    for (var i = 0; i < 9; i++) {
      var c = document.createElement('span');
      c.className = 'ba-wip-cell';
      host.appendChild(c);
      cells.push(c);
    }

    var inst = {
      alive: true,
      animate: animate,
      cells: cells,
      element: host
    };
    instances.push(inst);
    if (animate) armLoop();
    else {
      /* Static first frame for reduced / paused cases */
      var on = FRAMES[0];
      for (i = 0; i < 9; i++) {
        if (on.indexOf(i) !== -1) {
          cells[i].classList.add('on');
          cells[i].style.setProperty('--ba-wip-c', spectrumAt(i / 9 + 0.15));
        }
      }
    }

    return {
      element: host,
      destroy: function () {
        inst.alive = false;
        var idx = instances.indexOf(inst);
        if (idx >= 0) instances.splice(idx, 1);
        host.innerHTML = '';
        host.classList.remove('ba-session-wip', 'ba-wip-tri');
      },
      setAnimate: function (on) {
        inst.animate = !!on;
        if (inst.animate) armLoop();
      }
    };
  }

  function mountAll(root) {
    root = root || document;
    var nodes = root.querySelectorAll
      ? root.querySelectorAll('[data-session-wip]')
      : [];
    var out = [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.getAttribute('data-session-wip-mounted') === '1') continue;
      var size = parseInt(el.getAttribute('data-size'), 10);
      var glyph = el.getAttribute('data-glyph') || 'chevron';
      var handle = create(el, {
        size: isNaN(size) ? 14 : size,
        glyph: glyph,
        animate: el.getAttribute('data-animate') !== '0'
      });
      el.setAttribute('data-session-wip-mounted', '1');
      out.push(handle);
    }
    return out;
  }

  var api = {
    create: create,
    mountAll: mountAll,
    version: VERSION,
    FRAMES: FRAMES,
    FRAME_MS: FRAME_MS
  };
  root.SessionWip = api;
  if (!root.BlockAeroSessionWip) root.BlockAeroSessionWip = api;
})(typeof window !== 'undefined' ? window : this);
