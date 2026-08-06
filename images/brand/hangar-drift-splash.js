/* ═══════════════════════════════════════════════════════════════════════════
   BLOCK AERO — Hangar Drift splash (Brand Kit v3)
   Premium L→R lockup: Spectrum Wing flies in → soft wordmark unmask →
   quiet sheen → hold → fade/drift exit. Loops for boot / Open App gates.
   ═══════════════════════════════════════════════════════════════════════════ */
(function (root) {
  'use strict';

  var EASE = 'cubic-bezier(0.25, 1, 0.5, 1)';
  var EASE_IN = 'cubic-bezier(0.5, 0, 0.75, 0)';
  var STYLE_ID = 'ba-hangar-drift-css';

  /* S2 Hangar Drift timings from splash-sweep-challengers */
  var DEFAULTS = {
    totalMs: 4000,
    chevFrom: -240,
    chevMs: 550,
    maskMs: 900,
    feather: 72,
    sheenMs: 500,
    sheenOpacity: 0.05,
    holdMs: 1400,
    exitX: 160,
    exitMs: 900,
    gapMs: 120
  };

  function ensureCss() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      '.ba-hd{position:relative;display:flex;align-items:center;justify-content:center;' +
        'gap:clamp(14px,2vw,22px);will-change:transform,opacity;transform:translateZ(0)}' +
      '.ba-hd-chev{width:clamp(56px,8vw,78px);height:clamp(56px,8vw,78px);flex-shrink:0;' +
        'will-change:transform,opacity;transform:translateZ(0);' +
        'filter:drop-shadow(0 0 14px rgba(28,95,192,.2))}' +
      '.ba-hd-chev svg{width:100%;height:100%;display:block;overflow:visible}' +
      '.ba-hd-wmwrap{position:relative;overflow:visible;padding-right:.16em;' +
        'will-change:clip-path}' +
      '.ba-hd-wm{display:block;line-height:1;font-family:Outfit,Nunito,sans-serif;' +
        'font-weight:800;font-size:clamp(28px,4.2vw,44px);letter-spacing:-.03em;' +
        'color:#F3F5F8;white-space:nowrap;position:relative;' +
        'padding-right:.1em}' +
      '.ba-hd-wm .ba-hd-d{--d:.28em;--tip:calc(var(--d)*0.2071);--gap:.08em;' +
        'display:inline-block;width:var(--d);height:var(--d);background:#E8761A;' +
        'transform:rotate(45deg);' +
        'margin-left:calc(var(--gap) + var(--tip));' +
        'margin-right:calc(var(--gap) + var(--tip));' +
        'vertical-align:.12em}' +
      '.ba-hd-sheen{position:absolute;inset:-40% -20%;pointer-events:none;' +
        'background:linear-gradient(105deg,transparent 0%,transparent 42%,' +
        'rgba(255,255,255,0) 46%,rgba(255,255,255,.08) 50%,rgba(255,255,255,0) 54%,' +
        'transparent 58%,transparent 100%);' +
        'transform:translateX(-120%) rotate(-20deg) translateZ(0);' +
        'will-change:transform;mix-blend-mode:screen;opacity:0}';
    document.head.appendChild(s);
  }

  function wingSvg(gid) {
    return (
      '<svg viewBox="0 0 80 80" aria-hidden="true">' +
        '<defs><linearGradient id="' + gid + '" x1="40" y1="16" x2="40" y2="64" gradientUnits="userSpaceOnUse">' +
          '<stop offset="0%" stop-color="#E8761A"/>' +
          '<stop offset="35%" stop-color="#F5C53A"/>' +
          '<stop offset="65%" stop-color="#1C5FC0"/>' +
          '<stop offset="100%" stop-color="#1AAB65"/>' +
        '</linearGradient></defs>' +
        '<g transform="translate(-3,0)">' +
          '<path fill="url(#' + gid + ')" d="M12 16 L38 40 L12 64 L24 64 L50 40 L24 16 Z"/>' +
          '<path fill="url(#' + gid + ')" d="M36 16 L62 40 L36 64 L48 64 L74 40 L48 16 Z"/>' +
        '</g></svg>'
    );
  }

  function buildMarkup(id) {
    return (
      '<div class="ba-hd" data-ba-hd>' +
        '<div class="ba-hd-chev" data-chev>' + wingSvg(id) + '</div>' +
        '<div class="ba-hd-wmwrap" data-reveal>' +
          '<div class="ba-hd-wm">' +
            '<span>Block</span><span class="ba-hd-d" aria-hidden="true"></span><span>Aero</span>' +
            '<div class="ba-hd-sheen" data-sheen></div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function ctl(token, bag) {
    return {
      sleep: function (ms) {
        return new Promise(function (resolve) {
          var t = setTimeout(resolve, ms);
          bag.push({ cancel: function () { clearTimeout(t); } });
        });
      },
      anim: function (el, kf, opts) {
        if (!el || !token.alive) return Promise.resolve();
        var a = el.animate(kf, opts);
        bag.push(a);
        return a.finished.catch(function () {});
      },
      cancel: function () {
        bag.forEach(function (a) { if (a && a.cancel) a.cancel(); });
        bag.length = 0;
      }
    };
  }

  function clearElementAnims(el) {
    if (!el || !el.getAnimations) return;
    el.getAnimations().forEach(function (a) {
      try { if (a.commitStyles) a.commitStyles(); } catch (e) {}
      try { a.cancel(); } catch (e) {}
    });
  }

  function hideWordmark(reveal) {
    /* Correct-by-construction reveal: only the right inset changes. Unlike a
       moving CSS mask, this cannot punch out "Bl/Blo" or clip the final "o". */
    reveal.style.clipPath = 'inset(0 100% 0 0)';
  }

  function showWordmark(reveal) {
    clearElementAnims(reveal);
    reveal.style.clipPath = 'none';
  }

  async function playOnce(root, c, p) {
    var lockup = root.querySelector('[data-ba-hd]') || root;
    var chev = root.querySelector('[data-chev]');
    var reveal = root.querySelector('[data-reveal]');
    var sheen = root.querySelector('[data-sheen]');
    if (!chev || !reveal || !sheen) return;

    /* Loop seam: stay invisible while the wordmark is reset to fully clipped,
       then reveal from left to right. */
    clearElementAnims(lockup);
    clearElementAnims(chev);
    clearElementAnims(sheen);
    showWordmark(reveal);

    lockup.style.opacity = '0';
    lockup.style.transform = 'translate3d(0,0,0)';
    chev.style.opacity = '0';
    chev.style.transform = 'translate3d(' + p.chevFrom + 'px,0,0)';
    sheen.style.opacity = '0';
    sheen.style.transform = 'translate3d(-130%,0,0) rotate(-20deg)';
    hideWordmark(reveal);

    await c.sleep(32);
    lockup.style.opacity = '1';

    await c.anim(chev, [
      { opacity: 0, transform: 'translate3d(' + p.chevFrom + 'px,0,0)' },
      { opacity: 1, transform: 'translate3d(0,0,0)' }
    ], { duration: p.chevMs, easing: EASE, fill: 'forwards' });

    await c.anim(reveal, [
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)' }
    ], { duration: p.maskMs, easing: EASE, fill: 'forwards' });

    /* Remove clipping for hold/exit; right-side padding protects glyph overhang. */
    showWordmark(reveal);

    sheen.style.opacity = String(p.sheenOpacity);
    await c.anim(sheen, [
      { transform: 'translate3d(-130%,0,0) rotate(-20deg)', opacity: 0 },
      { transform: 'translate3d(-40%,0,0) rotate(-20deg)', opacity: p.sheenOpacity, offset: 0.2 },
      { transform: 'translate3d(130%,0,0) rotate(-20deg)', opacity: 0 }
    ], { duration: p.sheenMs, easing: EASE, fill: 'forwards' });

    await c.sleep(p.holdMs);

    await c.anim(lockup, [
      { opacity: 1, transform: 'translate3d(0,0,0)' },
      { opacity: 0, transform: 'translate3d(' + p.exitX + 'px,0,0)' }
    ], { duration: p.exitMs, easing: EASE_IN, fill: 'forwards' });

    await c.sleep(p.gapMs);
  }

  /**
   * Mount Hangar Drift into `el`. Returns { destroy }.
   * opts: partial timing overrides; loop (default true).
   */
  function mount(el, opts) {
    if (!el) return { destroy: function () {} };
    ensureCss();
    opts = opts || {};
    var p = {};
    Object.keys(DEFAULTS).forEach(function (k) {
      p[k] = opts[k] != null ? opts[k] : DEFAULTS[k];
    });
    var loop = opts.loop !== false;
    var token = { alive: true };
    var bag = [];
    var c = ctl(token, bag);
    var uid = 'baHd' + Math.random().toString(36).slice(2, 9);

    el.innerHTML = buildMarkup(uid);

    (async function run() {
      while (token.alive) {
        c.cancel();
        c = ctl(token, bag);
        await playOnce(el, c, p);
        if (!loop) break;
      }
    })();

    return {
      destroy: function () {
        token.alive = false;
        c.cancel();
        el.innerHTML = '';
      }
    };
  }

  root.HangarDriftSplash = { mount: mount, DEFAULTS: DEFAULTS };
})(typeof window !== 'undefined' ? window : this);
