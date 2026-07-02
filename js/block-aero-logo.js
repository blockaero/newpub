/* ═══════════════════════════════════════════════════════════════════════════
   BLOCK AERO — Logo Engine v1.3.0
   ═══════════════════════════════════════════════════════════════════════════
   Generates an animated hexagonal block ring matching the Block.Aero logo.
   Colors calibrated to brand: orange/gold → blue → green.

   v1.3.0 — Performance: render loop throttled to ~30fps (was uncapped 60fps).
            Cuts SVG DOM mutations from 576/frame to 576/frame at half frequency.
            Filter (drop-shadow) updates skipped when glow is 0 — avoids
            expensive repaint on 192 rects during calm phases.

   Animations:
     'assemble'  — Blocks fly in from outside, lock into hex ring, fade.
                    Use: connecting / loading / initializing.
     'wave'      — Cascading brightness sweep around the ring.
                    Use: checking connection / scanning.
     'pulse'     — 3-phase connected indicator (24s cycle):
                    Phase 1: unified pulse (5s) — all blocks brighten and decay.
                    Phase 2: clockwise sweep (9s) — each of 6 sections snaps on/off.
                    Phase 3: sustained hold (10s) — full opacity with ±3% breathing.
                    Use: connected / idle / healthy state.
     'transmit'  — Hex ring disassembles → blocks reform into a compact
                    data block shape → pulse → blocks fly back to hex ring.
                    Use: active data transfer to/from network.
     'scan'      — Radar sweep with trailing glow.
                    Use: verification / blockchain confirmation.
     'dim'       — All blocks at 25% opacity. No animation.
                    Use: disconnected / error / inactive.
     'static'    — All blocks fully visible. No animation.
                    Use: screenshots / print / static brand mark.

   API:
     BlockAeroLogo.create(element, { size, animate, animation })
       → { destroy(), setAnimation(name), element }
     BlockAeroLogo.loader(element, { size, label })
       → { destroy(), element }
   ═══════════════════════════════════════════════════════════════════════════ */
(function(root) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  /* ── Color math ────────────────────────────────────────────────────────── */
  function hex2rgb(h) {
    return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
  }
  function lerp(a, b, t) {
    var c1 = hex2rgb(a), c2 = hex2rgb(b);
    return 'rgb(' +
      Math.round(c1[0]+(c2[0]-c1[0])*t) + ',' +
      Math.round(c1[1]+(c2[1]-c1[1])*t) + ',' +
      Math.round(c1[2]+(c2[2]-c1[2])*t) + ')';
  }

  /* ── Easing ────────────────────────────────────────────────────────────── */
  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }
  function easeInOutCubic(x) { return x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x+2, 3)/2; }

  /* ── Block geometry ────────────────────────────────────────────────────── */
  /* 6 faces × 8 cols × 4 rows = 192 blocks in a hex ring.
     Colors match the Block.Aero triangle logo:
       Face 0-1: Orange → Gold   (top of hex)
       Face 2-3: Blue            (right side)
       Face 4-5: Green           (left / bottom)                         */
  var CX = 200, CY = 200;
  var _cache = null;

  /* Data block grid: 16 columns × 12 rows = 192 slots.
     Centered in 400×400 viewBox. Each slot is 9px wide, 10px tall. */
  var GRID_COLS = 16, GRID_ROWS = 12;
  var GRID_W = GRID_COLS * 9, GRID_H = GRID_ROWS * 10;
  var GRID_OX = CX - GRID_W / 2, GRID_OY = CY - GRID_H / 2;

  function genBlocks() {
    if (_cache) return _cache;
    var b = [], R = 140, BW = 10, BH = 14, G = 2.5;
    var OUT = R, INN = R * 0.58;
    var faces = [
      { cs: '#E8761A', ce: '#F5C53A', sa: 210, ea: 270 },
      { cs: '#F5C53A', ce: '#E8A020', sa: 270, ea: 330 },
      { cs: '#1C5FC0', ce: '#2B86D4', sa: 330, ea:  30 },
      { cs: '#1AAB65', ce: '#27C47A', sa:  30, ea:  90 },
      { cs: '#27C47A', ce: '#5DC48A', sa:  90, ea: 150 },
      { cs: '#2B86D4', ce: '#1C5FC0', sa: 150, ea: 210 },
    ];
    for (var fi = 0; fi < faces.length; fi++) {
      var f = faces[fi];
      var sR = (f.sa - 90) * Math.PI / 180;
      var eR = (f.ea - 90) * Math.PI / 180;
      if (f.sa > f.ea) eR += Math.PI * 2;
      for (var row = 0; row < 4; row++) {
        for (var col = 0; col < 8; col++) {
          var t = (col + 0.5) / 8, rT = (row + 0.5) / 4;
          var angle = sR + t * (eR - sR);
          var radius = INN + rT * (OUT - INN);
          var bx = CX + Math.cos(angle) * radius;
          var by = CY + Math.sin(angle) * radius;
          var idx = b.length;
          /* Grid target for transmit animation */
          var gc = idx % GRID_COLS;
          var gr = Math.floor(idx / GRID_COLS);
          b.push({
            x: bx, y: by,
            w: BW - G, h: BH - G,
            color: lerp(f.cs, f.ce, t),
            rot: angle * 180 / Math.PI + 90,
            idx: idx,
            na: (angle + Math.PI * 2) % (Math.PI * 2),
            dist: Math.sqrt((bx - CX) * (bx - CX) + (by - CY) * (by - CY)) / OUT,
            /* Data block grid target position */
            gx: GRID_OX + gc * 9 + 4.5,
            gy: GRID_OY + gr * 10 + 5,
          });
        }
      }
    }
    _cache = b;
    return b;
  }

  /* ── Animation calculators ─────────────────────────────────────────────── */
  var N = 192;

  var anim = {

    /* ─── ASSEMBLE ───────────────────────────────────────────────────────
       Blocks fly in from far outside, lock into hex ring, hold, fade.  */
    assemble: function(b, t) {
      var DUR = 2.5, lt = t % (DUR + 1.5), d = (b.idx / N) * 1.2;
      var p = Math.max(0, Math.min(1, (lt - d) / 0.6));
      /* Fade-out phase */
      if (lt > DUR + 0.3) {
        var f = Math.max(0, 1 - Math.max(0, lt - DUR - 0.3 - (b.idx / N) * 0.5) * 3);
        return { o: f, tx: 0, ty: 0, s: 0.8 + f * 0.2, r: 0, g: 0 };
      }
      /* Fly-in phase */
      if (p < 1) {
        var e = easeOutCubic(p);
        var sd = 120 + ((b.idx * 7 + 13) % 40);
        var a = b.na + Math.PI;
        return { o: e, tx: Math.cos(a)*sd*(1-e), ty: Math.sin(a)*sd*(1-e),
                 s: 0.3+e*0.7, r: (1-e)*180, g: 0 };
      }
      /* Hold phase (with landing glow) */
      return { o: 1, tx: 0, ty: 0, s: 1, r: 0,
               g: Math.max(0, 1-(lt-d-0.6)*2) * 6 };
    },

    /* ─── WAVE ───────────────────────────────────────────────────────────
       Cascading brightness sweep around the ring. Ambient.             */
    wave: function(b, t) {
      var wa = (t * 1.8) % (Math.PI * 2), d = b.na - wa;
      if (d < -Math.PI) d += Math.PI * 2;
      if (d >  Math.PI) d -= Math.PI * 2;
      var p = Math.abs(d);
      if (p < 0.9) {
        var g = Math.pow(1 - p / 0.9, 2);
        return { o: 0.35 + 0.65*(0.4+0.6*g), tx: 0, ty: 0,
                 s: 1+g*0.15, r: 0, g: g*8 };
      }
      return { o: 0.35 + Math.sin(t*0.8)*0.08, tx: 0, ty: 0, s: 1, r: 0, g: 0 };
    },

    /* ─── TRANSMIT ───────────────────────────────────────────────────────
       4-phase loop (3.6s total):
         Phase 1 (0.0–0.8s)  COLLAPSE: Hex ring blocks disappear in a
                   staggered spiral, then reappear flying inward to
                   reform as a compact 16×12 data block rectangle.
         Phase 2 (0.8–2.0s)  PULSE: Data block breathes and shimmers —
                   a rhythmic glow ripple runs across the grid rows
                   like data flowing through the block.
         Phase 3 (2.0–2.8s)  EXPAND: Data block disassembles, blocks
                   fly outward back to their hex ring positions.
         Phase 4 (2.8–3.6s)  SETTLE: Hex ring is whole, gentle glow
                   ripple confirms successful transmission.          */
    transmit: function(b, t) {
      var CYCLE = 3.6;
      var lt = t % CYCLE;

      /* Deltas: how far each block must travel from hex pos → grid pos */
      var dx = b.gx - b.x;
      var dy = b.gy - b.y;
      /* In grid form, blocks are axis-aligned (rotation 0), so undo hex rotation */
      var dr = -b.rot;

      /* Stagger patterns */
      var spiralIn  = ((b.na / (Math.PI * 2)) + b.dist * 0.3) % 1;  /* spiral for collapse */
      var rowWave   = (Math.floor(b.idx / GRID_COLS)) / GRID_ROWS;   /* row-based for pulse */
      var spiralOut = ((1 - b.na / (Math.PI * 2)) + (1 - b.dist) * 0.3) % 1; /* reverse spiral for expand */

      /* ── Phase 1: COLLAPSE (hex → data block) ─────────────────────── */
      if (lt < 0.8) {
        var raw1 = lt / 0.8;
        /* Each block has its own delayed start based on spiral position */
        var blockDelay = spiralIn * 0.4;
        var p1 = Math.max(0, Math.min(1, (raw1 - blockDelay) / (1 - blockDelay)));
        var e1 = easeInOutCubic(p1);
        /* During first half of travel, blocks shrink and fade slightly (disappearing from ring) */
        /* During second half, they grow and solidify (appearing in grid) */
        var fadeOut = p1 < 0.35 ? (1 - p1 / 0.35) : 0;
        var fadeIn  = p1 > 0.35 ? (p1 - 0.35) / 0.65 : 0;
        var opacity = 0.15 + 0.85 * (fadeOut > 0 ? (1 - fadeOut * 0.7) : fadeIn);
        var scale = p1 < 0.35 ? (1 - fadeOut * 0.6) : (0.4 + fadeIn * 0.6);
        /* Rotation: full hex rotation at start, zero at end (axis-aligned grid) */
        var rotProg = easeOutCubic(p1);
        return {
          o: opacity,
          tx: dx * e1,
          ty: dy * e1,
          s: scale,
          r: dr * rotProg,
          g: fadeIn * 3
        };
      }

      /* ── Phase 2: PULSE (data block breathes + data ripple) ────────── */
      if (lt < 2.0) {
        var p2 = (lt - 0.8) / 1.2;
        /* Breathing: entire block scales gently */
        var breath = 1 + 0.035 * Math.sin(p2 * Math.PI * 5);
        /* Row-based data ripple: a bright band sweeps top→bottom repeatedly */
        var ripplePos = (p2 * 3) % 1;
        var rippleDist = Math.abs(rowWave - ripplePos);
        var rippleGlow = rippleDist < 0.15 ? Math.pow(1 - rippleDist / 0.15, 2) * 8 : 0;
        /* Column shimmer: subtle left-to-right phase shift */
        var colPhase = (b.idx % GRID_COLS) / GRID_COLS;
        var shimmer = 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(p2 * Math.PI * 6 + colPhase * Math.PI * 2));
        return {
          o: shimmer,
          tx: dx,
          ty: dy,
          s: breath,
          r: dr,
          g: 1.5 + rippleGlow
        };
      }

      /* ── Phase 3: EXPAND (data block → hex ring) ───────────────────── */
      if (lt < 2.8) {
        var raw3 = (lt - 2.0) / 0.8;
        var blockDelay3 = spiralOut * 0.4;
        var p3 = Math.max(0, Math.min(1, (raw3 - blockDelay3) / (1 - blockDelay3)));
        var e3 = easeInOutCubic(p3);
        /* Inverse of collapse: start in grid, end in hex */
        var remaining = 1 - e3;
        var fadeOut3 = p3 < 0.35 ? (1 - p3 / 0.35) : 0;
        var fadeIn3  = p3 > 0.35 ? (p3 - 0.35) / 0.65 : 0;
        var opacity3 = 0.15 + 0.85 * (fadeOut3 > 0 ? (1 - fadeOut3 * 0.7) : fadeIn3);
        var scale3 = p3 < 0.35 ? (1 - fadeOut3 * 0.6) : (0.4 + fadeIn3 * 0.6);
        var rotProg3 = easeOutCubic(p3);
        return {
          o: opacity3,
          tx: dx * remaining,
          ty: dy * remaining,
          s: scale3,
          r: dr * (1 - rotProg3),
          g: (1 - e3) * 3
        };
      }

      /* ── Phase 4: SETTLE (hex ring whole, confirmation glow) ───────── */
      var p4 = (lt - 2.8) / 0.8;
      /* Quick glow sweep around the ring confirms successful transmission */
      var sweepAngle = p4 * Math.PI * 2;
      var angleDiff = b.na - sweepAngle;
      if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      if (angleDiff >  Math.PI) angleDiff -= Math.PI * 2;
      var sweepClose = Math.abs(angleDiff);
      var confirmGlow = sweepClose < 0.6 ? Math.pow(1 - sweepClose / 0.6, 2) * 6 : 0;
      /* Gentle scale settle */
      var settleScale = 1 + 0.02 * Math.sin(p4 * Math.PI) * (1 - p4);
      return {
        o: 0.6 + 0.4 * Math.min(1, p4 * 3),
        tx: 0,
        ty: 0,
        s: settleScale,
        r: 0,
        g: confirmGlow
      };
    },

    /* ─── SCAN ───────────────────────────────────────────────────────────
       Radar sweep with trailing glow.                                   */
    scan: function(b, t) {
      var sa = (t * 2.2) % (Math.PI * 2), d = b.na - sa;
      if (d < -Math.PI) d += Math.PI * 2;
      if (d >  Math.PI) d -= Math.PI * 2;
      if (d >= -1.5 && d <= 0) {
        var i = 1 + d / 1.5;
        return { o: 0.15+0.85*Math.pow(i,1.5), tx: 0, ty: 0,
                 s: 1, r: 0, g: Math.pow(i,2)*12 };
      }
      return { o: 0.12, tx: 0, ty: 0, s: 1, r: 0, g: 0 };
    },

    /* ─── PULSE ──────────────────────────────────────────────────────────
       3-phase connected indicator across a ~24s cycle:

       Phase 1 — Unified pulse (5s)
         All blocks brighten from dim base → full → decay back to dim.

       Phase 2 — Clockwise sweep (9s = 6 faces × 1.5s each)
         From dim, each of the 6 colored sections snaps to full brightness
         then snaps off, one at a time, clockwise. Ends fully dimmed.

       Phase 3 — Sustained hold (10s)
         All sections brighten together and hold at full opacity with
         very subtle ±3% breathing. Calm, confident resting state.

       Total cycle: 24s, then restarts.
       Use: connected / idle / healthy.                                   */
    pulse: function(b, t) {
      var PHASE1 = 5;       /* unified pulse duration */
      var PHASE2 = 9;       /* clockwise sweep duration (6 × 1.5s) */
      var PHASE3 = 10;      /* sustained hold duration */
      var CYCLE = PHASE1 + PHASE2 + PHASE3;  /* 24s total */
      var DIM = 0.25;       /* dimmed opacity */
      var FACES = 6;
      var BLOCKS_PER_FACE = 32;
      var SWEEP_PER_FACE = PHASE2 / FACES;  /* 1.5s per face */

      var lt = t % CYCLE;
      var faceIdx = Math.floor(b.idx / BLOCKS_PER_FACE);

      /* ── Phase 1: Unified pulse (0 → 5s) ──────────────────────────── */
      if (lt < PHASE1) {
        var pt = lt / PHASE1;
        var env;
        if (pt < 0.15) {
          env = easeOutCubic(pt / 0.15);
        } else if (pt < 0.3) {
          env = 1;
        } else {
          env = Math.max(0, 1 - easeInOutCubic((pt - 0.3) / 0.7));
        }
        var opacity = DIM + (1 - DIM) * env;
        var scale = 1 + 0.06 * env;
        var glow = env * 5;
        return { o: opacity, tx: 0, ty: 0, s: scale, r: 0, g: glow };
      }

      /* ── Phase 2: Clockwise sweep (5s → 14s) ──────────────────────── */
      if (lt < PHASE1 + PHASE2) {
        var sweepT = lt - PHASE1;
        var activeFace = Math.floor(sweepT / SWEEP_PER_FACE);
        /* Clamp to valid face range */
        activeFace = Math.min(activeFace, FACES - 1);
        /* Sharp on/off: this face is fully lit, all others are dim */
        var isActive = (faceIdx === activeFace) ? 1 : 0;
        var opacity = isActive ? 1 : DIM;
        var glow = isActive ? 4 : 0;
        return { o: opacity, tx: 0, ty: 0, s: 1, r: 0, g: glow };
      }

      /* ── Phase 3: Sustained hold with subtle breathing (14s → 24s) ── */
      var holdT = lt - PHASE1 - PHASE2;
      /* Fade in over the first 0.5s of the hold phase */
      var fadeIn = Math.min(1, holdT / 0.5);
      /* Very subtle breathing: ±3% opacity, slow cycle */
      var breath = 0.97 + 0.03 * Math.sin(holdT * 0.8 * Math.PI);
      var opacity = (DIM + (1 - DIM) * fadeIn) * breath;
      return { o: opacity, tx: 0, ty: 0, s: 1, r: 0, g: 0 };
    },

    /* ─── DIM ────────────────────────────────────────────────────────────
       All blocks at 25% opacity. No motion, no glow.
       Use: disconnected / error / inactive.                              */
    dim: function() { return { o: 0.25, tx: 0, ty: 0, s: 1, r: 0, g: 0 }; },

    /* ─── STATIC ─────────────────────────────────────────────────────── */
    static: function() { return { o: 1, tx: 0, ty: 0, s: 1, r: 0, g: 0 }; }
  };

  /* ── Render loop (throttled to ~30fps for performance) ───────────────── */
  var _inst = [], _running = false;
  var _lastTickTime = 0;
  var FRAME_INTERVAL = 1 / 30; /* ~33ms between frames */
  function tick() {
    var now = performance.now() / 1000;
    /* Throttle: skip frame if less than ~33ms since last render */
    if (now - _lastTickTime < FRAME_INTERVAL) {
      if (_inst.length > 0) requestAnimationFrame(tick);
      return;
    }
    _lastTickTime = now;
    var blocks = genBlocks();
    for (var j = 0; j < _inst.length; j++) {
      var I = _inst[j];
      if (I.dead) continue;
      /* Auto-cleanup: if the SVG was removed from the DOM (e.g. spinner
         replaced, toast cleared), mark instance dead so it stops burning CPU. */
      if (!I.rects[0].isConnected) { I.dead = true; continue; }
      var t = now - I.t0, fn = anim[I.anim] || anim.assemble;
      for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i], st = fn(b, t), rect = I.rects[i];
        rect.setAttribute('opacity', Math.max(0, Math.min(1, st.o)));
        rect.setAttribute('transform',
          'translate(' + (b.x + st.tx) + ',' + (b.y + st.ty) + ') ' +
          'rotate(' + (b.rot + st.r) + ') scale(' + st.s + ')');
        /* Only update filter when glow is active (saves expensive repaints) */
        if (st.g > 0.5) {
          rect.style.filter = 'drop-shadow(0 0 ' + st.g + 'px rgba(255,255,255,0.5))';
        } else if (rect.style.filter !== 'none' && rect.style.filter !== '') {
          rect.style.filter = 'none';
        }
      }
    }
    for (var k = _inst.length - 1; k >= 0; k--) {
      if (_inst[k].dead) _inst.splice(k, 1);
    }
    if (_inst.length > 0) requestAnimationFrame(tick);
    else _running = false;
  }
  function startLoop() {
    if (!_running) { _running = true; requestAnimationFrame(tick); }
  }

  /* ── Public API ────────────────────────────────────────────────────────── */
  var BlockAeroLogo = {

    create: function(el, opts) {
      opts = opts || {};
      var size = opts.size || 40;
      var doAnim = opts.animate !== false;
      var animName = opts.animation || 'assemble';
      var blocks = genBlocks();

      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('viewBox', '0 0 400 400');
      svg.style.display = 'block';

      var rects = [];
      for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i];
        var r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', -b.w / 2);
        r.setAttribute('y', -b.h / 2);
        r.setAttribute('width', b.w);
        r.setAttribute('height', b.h);
        r.setAttribute('rx', 1.8);
        r.setAttribute('ry', 1.8);
        r.setAttribute('fill', b.color);
        r.setAttribute('transform',
          'translate(' + b.x + ',' + b.y + ') rotate(' + b.rot + ')');
        svg.appendChild(r);
        rects.push(r);
      }

      el.appendChild(svg);

      var inst = {
        rects: rects,
        anim: doAnim ? animName : 'static',
        t0: performance.now() / 1000,
        dead: false
      };

      if (doAnim) { _inst.push(inst); startLoop(); }

      return {
        destroy: function() { inst.dead = true; svg.remove(); },
        setAnimation: function(a) { inst.anim = a; inst.t0 = performance.now() / 1000; },
        element: svg
      };
    },

    loader: function(el, opts) {
      opts = opts || {};
      var wrap = document.createElement('div');
      wrap.style.cssText = 'display:inline-flex;align-items:center;gap:8px;';
      var logoWrap = document.createElement('div');
      wrap.appendChild(logoWrap);
      if (opts.label) {
        var lbl = document.createElement('span');
        lbl.style.cssText = 'font-size:12px;color:#6B7589;letter-spacing:.02em;';
        lbl.textContent = opts.label;
        wrap.appendChild(lbl);
      }
      el.appendChild(wrap);
      var logo = BlockAeroLogo.create(logoWrap, {
        size: opts.size || 18, animate: true, animation: 'assemble'
      });
      return {
        destroy: function() { logo.destroy(); wrap.remove(); },
        element: wrap
      };
    }
  };

  root.BlockAeroLogo = BlockAeroLogo;
})(typeof window !== 'undefined' ? window : this);
