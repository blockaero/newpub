/* ═══════════════════════════════════════════════════════════════════════════
   BLOCK AERO — Spectrum Loader v1.1.0 (Brand Kit v3)
   ═══════════════════════════════════════════════════════════════════════════
   Animated Spectrum Wing built from diamond tiles (+ triangle accents).
   Heritage of the old triangle-mosaic / pixel ring; geometry of Brand Kit v3.

   Animations:
     assemble     — tiles fly in and lock into Spectrum Wing
     wave         — tip←trail brightness sweep (connecting)
     pulse        — soft spectrum breathe (connected / idle)
     transmit     — wing → rotate into blocks → data grid pulse → wing
     reconfigure  — alias of transmit (shape morph showcase)
     dim          — 28% opacity, static (disconnected)
     static       — full opacity, no motion

   Shape language:
     Wing form  = diamonds (square @ 45°)
     Block form = same tiles rotated −45° into axis-aligned squares,
                  packed into a compact data-block grid (old logo DNA)

   API:
     SpectrumLoader.create(el, { size, animate, animation })
       → { destroy(), setAnimation(name), element }
     SpectrumLoader.loader(el, { size, label })
       → { destroy(), element }
   ═══════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var STOPS = [
    [232, 118, 26],
    [245, 197, 58],
    [28, 95, 192],
    [26, 171, 101]
  ];

  function rgb(c) { return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')'; }
  function lerpStops(t) {
    t = Math.max(0, Math.min(1, t));
    var seg = t * (STOPS.length - 1);
    var i = Math.min(Math.floor(seg), STOPS.length - 2);
    var f = seg - i;
    var a = STOPS[i], b = STOPS[i + 1];
    return [
      Math.round(a[0] + (b[0] - a[0]) * f),
      Math.round(a[1] + (b[1] - a[1]) * f),
      Math.round(a[2] + (b[2] - a[2]) * f)
    ];
  }
  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
  function easeInOut(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function pointInPoly(x, y, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i][0], yi = poly[i][1];
      var xj = poly[j][0], yj = poly[j][1];
      if (((yi > y) !== (yj > y)) &&
          (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi)) {
        inside = !inside;
      }
    }
    return inside;
  }

  /* Diamond lattice inside Spectrum Wing + block-grid targets per tile. */
  function genTiles() {
    var LEFT = [[12, 16], [38, 40], [12, 64], [24, 64], [50, 40], [24, 16]];
    var RIGHT = [[36, 16], [62, 40], [36, 64], [48, 64], [74, 40], [48, 16]];
    var OX = -3;
    var tiles = [];
    var S = 2.7;
    var stepX = S * 1.95, stepY = S * 1.55;
    var row = 0;
    for (var y = 16; y <= 64; y += stepY, row++) {
      var x0 = 10 + (row % 2 ? S * 0.95 : 0);
      for (var x = x0; x <= 76; x += stepX) {
        var px = x + OX, py = y;
        if (pointInPoly(px - OX, py, LEFT) || pointInPoly(px - OX, py, RIGHT)) {
          var tip = Math.hypot(px - (74 + OX), py - 40);
          var cyNorm = (py - 16) / 48;
          tiles.push({
            x: px, y: py, s: S,
            color: lerpStops(cyNorm),
            tip: tip,
            accent: tiles.length % 4 === 0,
            spiral: ((Math.atan2(py - 40, px - 40) / (Math.PI * 2)) + 1) % 1
          });
        }
      }
    }
    tiles.sort(function (a, b) { return b.tip - a.tip; });

    /* Compact data-block grid (axis-aligned squares). ~8×N rows centered. */
    var n = tiles.length;
    var cols = Math.ceil(Math.sqrt(n * 1.35));
    var rows = Math.ceil(n / cols);
    var cell = 5.2;
    var gridW = cols * cell;
    var gridH = rows * cell;
    var ox = 40 - gridW / 2 + cell / 2;
    var oy = 40 - gridH / 2 + cell / 2;
    for (var i = 0; i < n; i++) {
      var gc = i % cols;
      var gr = Math.floor(i / cols);
      tiles[i].gx = ox + gc * cell;
      tiles[i].gy = oy + gr * cell;
      tiles[i].gcol = gc;
      tiles[i].grow = gr;
      tiles[i].cols = cols;
      tiles[i].rows = rows;
      tiles[i].idx = i;
    }
    return tiles;
  }

  function diamondPath(cx, cy, s) {
    return 'M' + cx + ',' + (cy - s) +
      ' L' + (cx + s) + ',' + cy +
      ' L' + cx + ',' + (cy + s) +
      ' L' + (cx - s) + ',' + cy + ' Z';
  }
  function triPath(cx, cy, s) {
    var ts = s * 0.62;
    return 'M' + cx + ',' + (cy - ts * 0.85) +
      ' L' + (cx + ts * 0.75) + ',' + (cy + ts * 0.55) +
      ' L' + (cx - ts * 0.75) + ',' + (cy + ts * 0.55) + ' Z';
  }

  /* transmit / reconfigure cycle length (ms) */
  var TRANSMIT_MS = 3600;

  function create(host, opts) {
    opts = opts || {};
    var size = opts.size || 64;
    var anim = opts.animation || 'assemble';
    var animate = opts.animate !== false;
    var tiles = genTiles();

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 80 80');
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Block Aero loading');
    svg.style.display = 'block';
    svg.style.flexShrink = '0';

    var g = document.createElementNS(NS, 'g');
    svg.appendChild(g);

    var nodes = [];
    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i];
      var p = document.createElementNS(NS, 'path');
      p.setAttribute('d', diamondPath(t.x, t.y, t.s));
      p.setAttribute('fill', rgb(t.color));
      g.appendChild(p);
      var accent = null;
      if (t.accent) {
        accent = document.createElementNS(NS, 'path');
        accent.setAttribute('d', triPath(t.x, t.y, t.s));
        accent.setAttribute('fill', rgb(t.color));
        accent.setAttribute('opacity', '0.55');
        g.appendChild(accent);
      }
      nodes.push({ tile: t, path: p, accent: accent });
    }

    var ember = document.createElementNS(NS, 'path');
    ember.setAttribute('d', diamondPath(40, 40, 3.2));
    ember.setAttribute('fill', '#E8761A');
    ember.setAttribute('opacity', '0');
    g.appendChild(ember);

    host.appendChild(svg);

    var raf = 0;
    var start = performance.now();
    var running = animate;
    var lastPaint = 0;
    var FRAME_MS = 1000 / 30;

    /**
     * Wing ↔ block morph.
     * Phase 1 (0–0.9s): collapse — diamonds rotate −45° into squares, fly to grid
     * Phase 2 (0.9–2.2s): hold as data block with row ripple
     * Phase 3 (2.2–3.0s): expand — rotate back to diamonds, return to wing
     * Phase 4 (3.0–3.6s): settle glow on wing
     */
    function morphState(tile, elapsedMs) {
      var lt = (elapsedMs % TRANSMIT_MS) / 1000;
      var dx = tile.gx - tile.x;
      var dy = tile.gy - tile.y;
      var spiralIn = (tile.spiral + tile.tip / 80) % 1;
      var spiralOut = (1 - spiralIn + 0.15) % 1;
      var rowWave = tile.rows ? tile.grow / Math.max(1, tile.rows - 1) : 0;
      var colPhase = tile.cols ? tile.gcol / Math.max(1, tile.cols - 1) : 0;

      if (lt < 0.9) {
        var raw = lt / 0.9;
        var delay = spiralIn * 0.38;
        var p = Math.max(0, Math.min(1, (raw - delay) / (1 - delay)));
        var e = easeInOut(p);
        var mid = p < 0.4;
        var opacity = mid ? (0.35 + 0.65 * (1 - p / 0.4 * 0.45)) : (0.4 + 0.6 * ((p - 0.4) / 0.6));
        var scale = mid ? (1 - (p / 0.4) * 0.45) : (0.55 + 0.45 * ((p - 0.4) / 0.6));
        return {
          x: tile.x + dx * e,
          y: tile.y + dy * e,
          rot: -45 * easeOutCubic(p),
          scale: scale,
          opacity: opacity,
          bright: 0.75 + 0.25 * e,
          ember: 1 - e,
          blockish: e
        };
      }

      if (lt < 2.2) {
        var p2 = (lt - 0.9) / 1.3;
        var breath = 1 + 0.04 * Math.sin(p2 * Math.PI * 5);
        var ripplePos = (p2 * 3.2) % 1;
        var rippleDist = Math.abs(rowWave - ripplePos);
        var ripple = rippleDist < 0.18 ? Math.pow(1 - rippleDist / 0.18, 2) : 0;
        var shimmer = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(p2 * Math.PI * 6 + colPhase * Math.PI * 2));
        return {
          x: tile.gx,
          y: tile.gy,
          rot: -45,
          scale: breath * (0.95 + 0.08 * ripple),
          opacity: shimmer,
          bright: 0.85 + 0.2 * ripple,
          ember: 0.15,
          blockish: 1
        };
      }

      if (lt < 3.0) {
        var raw3 = (lt - 2.2) / 0.8;
        var delay3 = spiralOut * 0.35;
        var p3 = Math.max(0, Math.min(1, (raw3 - delay3) / (1 - delay3)));
        var e3 = easeInOut(p3);
        var mid3 = p3 < 0.4;
        var opacity3 = mid3 ? (0.4 + 0.6 * (1 - p3 / 0.4 * 0.4)) : (0.45 + 0.55 * ((p3 - 0.4) / 0.6));
        var scale3 = mid3 ? (1 - (p3 / 0.4) * 0.4) : (0.6 + 0.4 * ((p3 - 0.4) / 0.6));
        return {
          x: tile.gx + (tile.x - tile.gx) * e3,
          y: tile.gy + (tile.y - tile.gy) * e3,
          rot: -45 * (1 - easeOutCubic(p3)),
          scale: scale3,
          opacity: opacity3,
          bright: 0.8 + 0.2 * e3,
          ember: e3,
          blockish: 1 - e3
        };
      }

      /* settle */
      var p4 = (lt - 3.0) / 0.6;
      var settle = Math.sin(p4 * Math.PI);
      return {
        x: tile.x,
        y: tile.y,
        rot: 0,
        scale: 1 + 0.04 * settle,
        opacity: 1,
        bright: 0.9 + 0.1 * settle,
        ember: 0.75 + 0.25 * settle,
        blockish: 0
      };
    }

    function paint(now) {
      if (!running) return;
      if (now - lastPaint < FRAME_MS) {
        raf = requestAnimationFrame(paint);
        return;
      }
      lastPaint = now;
      var elapsed = now - start;
      var state = anim;
      if (state === 'reconfigure') state = 'transmit';

      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var tile = n.tile;
        var opacity = 1;
        var scale = 1;
        var px = tile.x, py = tile.y;
        var rot = 0;
        var bright = 1;
        var emberOp = 0;
        var hideAccent = false;

        if (state === 'assemble') {
          var dur = 2800;
          var p = Math.min(1, elapsed / dur);
          var ease = easeOutCubic(p);
          var thresh = i / Math.max(1, nodes.length - 1);
          var local = (ease - thresh * 0.82) / 0.18;
          if (local <= 0) {
            opacity = 0; scale = 0.4;
          } else {
            local = Math.min(1, local);
            var cur = 1 - Math.pow(1 - local, 2);
            opacity = cur;
            scale = 0.5 + 0.5 * cur;
            px = 40 + (tile.x - 40) * (1 + (1 - cur) * 1.35);
            py = 40 + (tile.y - 40) * (1 + (1 - cur) * 1.35);
            /* Start slightly block-like, rotate into diamond as they lock */
            rot = -45 * (1 - cur);
          }
          emberOp = Math.max(0, (p - 0.72) / 0.28);
        } else if (state === 'wave') {
          var phase = (elapsed / 1400) % 1;
          var tipN = tile.tip / 55;
          var d = Math.abs(((tipN + phase) % 1) - 0.5) * 2;
          bright = 0.35 + 0.65 * (1 - d);
          opacity = 0.55 + 0.45 * (1 - d);
          emberOp = 0.35 + 0.45 * Math.sin(elapsed / 400);
        } else if (state === 'pulse') {
          var pulse = 0.5 + 0.5 * Math.sin(elapsed / 900);
          bright = 0.85 + 0.15 * pulse;
          scale = 0.96 + 0.06 * pulse;
          emberOp = 0.7 + 0.3 * pulse;
        } else if (state === 'transmit') {
          var m = morphState(tile, elapsed);
          px = m.x; py = m.y; rot = m.rot; scale = m.scale;
          opacity = m.opacity; bright = m.bright; emberOp = m.ember;
          hideAccent = m.blockish > 0.55;
        } else if (state === 'dim') {
          opacity = 0.28;
          bright = 0.7;
          emberOp = 0.15;
        } else { /* static */
          opacity = 1;
          bright = 1;
          emberOp = 0.9;
        }

        var c = tile.color;
        var fill = rgb([
          Math.min(255, Math.round(c[0] * bright)),
          Math.min(255, Math.round(c[1] * bright)),
          Math.min(255, Math.round(c[2] * bright))
        ]);
        /* Path is authored as a diamond centered on tile.x/y; we translate to
           the current position and rotate around that point. rot=0 → diamond
           wing tile; rot=-45 → axis-aligned block square. */
        var xf =
          'translate(' + px + ',' + py + ') ' +
          'rotate(' + rot + ') ' +
          'scale(' + scale + ') ' +
          'translate(' + (-tile.x) + ',' + (-tile.y) + ')';
        n.path.setAttribute('fill', fill);
        n.path.setAttribute('opacity', String(opacity));
        n.path.setAttribute('transform', xf);
        if (n.accent) {
          n.accent.setAttribute('fill', fill);
          n.accent.setAttribute('opacity', hideAccent ? '0' : String(opacity * 0.55));
          n.accent.setAttribute('transform', xf);
        }
        ember.setAttribute('opacity', String(emberOp));
      }

      if (state === 'dim' || state === 'static') {
        running = false;
        return;
      }
      raf = requestAnimationFrame(paint);
    }

    function setAnimation(name) {
      anim = name || 'assemble';
      start = performance.now();
      running = true;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    }

    function destroy() {
      running = false;
      cancelAnimationFrame(raf);
      if (svg.parentNode) svg.parentNode.removeChild(svg);
    }

    if (animate) {
      setAnimation(anim);
    } else {
      anim = 'static';
      paint(performance.now());
    }

    return { destroy: destroy, setAnimation: setAnimation, element: svg };
  }

  function loader(host, opts) {
    opts = opts || {};
    var wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:10px;';
    var logoWrap = document.createElement('div');
    wrap.appendChild(logoWrap);
    if (opts.label) {
      var lab = document.createElement('div');
      lab.textContent = opts.label;
      lab.style.cssText = 'font-size:11px;color:#8A92A6;letter-spacing:.04em;';
      wrap.appendChild(lab);
    }
    host.appendChild(wrap);
    var handle = create(logoWrap, {
      size: opts.size || 48,
      animate: true,
      animation: 'assemble'
    });
    return {
      destroy: function () { handle.destroy(); if (wrap.parentNode) wrap.parentNode.removeChild(wrap); },
      element: wrap
    };
  }

  var api = { create: create, loader: loader, version: '1.1.0', TRANSMIT_MS: TRANSMIT_MS };
  root.SpectrumLoader = api;
  if (!root.BlockAeroLogoV3) root.BlockAeroLogoV3 = api;
})(typeof window !== 'undefined' ? window : this);
