// Block Aero — site interactions
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Highlight active nav link
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  // Product screenshots: if a real screenshot file isn't hosted yet, remove its
  // frame so no broken-image icon shows (concept graphics are unaffected).
  document.querySelectorAll('img.shot-img').forEach(function (img) {
    img.addEventListener('error', function () {
      var fig = img.closest('.shot');
      var wrap = img.closest('.shot-wrap');
      if (fig) fig.remove();
      if (wrap && !wrap.querySelector('.shot')) wrap.remove();
    });
  });

  // Build nav dropdowns (single source — keeps all pages in sync)
  (function () {
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    function caret(a) {
      var c = document.createElement('span');
      c.className = 'ddc'; c.setAttribute('aria-hidden', 'true'); c.textContent = '▾';
      a.appendChild(c);
    }
    function link(label, href, badge) {
      var a = document.createElement('a');
      a.href = href; a.textContent = label;
      if (/^https?:/.test(href)) { a.target = '_blank'; a.rel = 'noopener'; }
      if (badge) {
        var b = document.createElement('span');
        b.className = badge === 'Coming Soon' ? 'dd-ea dd-soon' : 'dd-ea';
        b.textContent = badge;
        a.appendChild(b);
      }
      return a;
    }

    // SOLUTIONS — grouped by customer business type
    var solItems = [
      ['Parts Distributors', 'solutions.html#parts-distributors'],
      ['Asset Managers & Traders', 'solutions.html#asset-managers'],
      ['Disassembly & Teardown Specialists', 'solutions.html#disassembly'],
      ['MROs', 'solutions.html#mros'],
      ['Lessors', 'solutions.html#lessors'],
      ['OEMs', 'solutions.html#oems'],
      ['Regulators & Authorities', 'solutions.html#regulators']
    ];
    var solA = navLinks.querySelector('a[href="solutions.html"]');
    if (solA) {
      var li = solA.closest('li'); li.classList.add('has-dd'); caret(solA);
      solA.setAttribute('aria-haspopup', 'true');
      var dd = document.createElement('div'); dd.className = 'dd';
      solItems.forEach(function (it) { dd.appendChild(link(it[0], it[1])); });
      li.appendChild(dd);
    }

    // PRODUCTS — mega menu grouped by category (Blockchain / AI & Agentic / FinTech)
    var prodGroups = [
      { h: 'Blockchain', items: [
        ['Digital Asset Manager', 'products.html#dam'],
        ['Registry Manager', 'products.html#registry']
      ]},
      { h: 'AI & Agentic', items: [
        ['AI Records Manager', 'arm.html', 'Early Access'],
        ['AI QC Manager', 'products.html#aiqc', 'Early Access']
      ]},
      { h: 'FinTech', items: [
        ['Cross-Border Asset Seller Financing', 'products.html#fintech', 'Coming Soon'],
        ['Aero-to-Power for Microgrid & Mobile Power', 'products.html#fintech', 'Coming Soon']
      ]}
    ];
    var prodA = navLinks.querySelector('a[href="products.html"]');
    if (prodA) {
      var pli = prodA.closest('li'); pli.classList.add('has-dd', 'dd-end'); caret(prodA);
      prodA.setAttribute('aria-haspopup', 'true');
      var mega = document.createElement('div'); mega.className = 'dd dd-mega';
      prodGroups.forEach(function (g) {
        var col = document.createElement('div'); col.className = 'dd-col';
        var hl = document.createElement('span'); hl.className = 'dd-h'; hl.textContent = g.h;
        col.appendChild(hl);
        g.items.forEach(function (it) { col.appendChild(link(it[0], it[1], it[2])); });
        mega.appendChild(col);
      });
      pli.appendChild(mega);
    }

    // ABOUT — simple list. Each item is a summary page that carries its own
    // overview content and routes on to its dedicated child pages, so the
    // children (Leadership, Contact Us, and the Americas programs) are
    // deliberately absent from the menu itself.
    var aboutItems = [
      ['Company Information', 'company.html'],
      ['Compliance & Certifications', 'trust.html']
      // ['Block Aero Americas', 'americas.html']  <- add when the Americas pages ship
    ];
    var abtA = navLinks.querySelector('a[href="about.html"]');
    if (abtA) {
      var ali = abtA.closest('li'); ali.classList.add('has-dd'); caret(abtA);
      abtA.setAttribute('aria-haspopup', 'true');
      var add = document.createElement('div'); add.className = 'dd';
      aboutItems.forEach(function (it) { add.appendChild(link(it[0], it[1])); });
      ali.appendChild(add);
    }

    // Light the parent nav item for any page inside its cluster, including
    // children that never appear in a dropdown. The href match above only
    // covers top-level pages.
    var cluster = {
      'about.html': ['company.html', 'leadership.html', 'board.html', 'contact.html', 'trust.html', 'policies.html'],
      'solutions.html': ['earc.html'],
      // registries.html and arm.html are their own top-level nav items, so the
      // href match above already highlights them.
      'products.html': ['pricing.html']
    };
    Object.keys(cluster).forEach(function (parent) {
      if (cluster[parent].indexOf(path) === -1) return;
      var a = navLinks.querySelector('a[href="' + parent + '"]');
      if (a) a.classList.add('active');
    });
  })();

  // Brand mark — animated hex ring (Block Aero Logo Engine v1.3.0)
  document.querySelectorAll('[data-ba-logo]').forEach(function (el) {
    var mode = el.getAttribute('data-ba-logo') || 'static';
    if (window.BlockAeroLogo) {
      BlockAeroLogo.create(el, { size: 34, animate: mode !== 'static', animation: mode });
    } else {
      // Fallback: static brand mark image
      var img = document.createElement('img');
      img.src = 'images/brand/mark.svg';
      img.alt = 'Block Aero';
      el.appendChild(img);
    }
  });

  // Full-bleed article carousel
  (function () {
    var cz = document.querySelector('.cz');
    if (!cz) return;
    var slides = Array.prototype.slice.call(cz.querySelectorAll('.cz-slide'));
    var dotsWrap = cz.querySelector('.cz-dots');
    var bar = cz.querySelector('.cz-bar');
    if (slides.length < 2) return;
    var i = 0, timer = null, DURATION = 6500;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var dots = slides.map(function (_, n) {
      var b = document.createElement('button');
      b.className = 'cz-dot' + (n === 0 ? ' is-active' : '');
      b.setAttribute('aria-label', 'Show slide ' + (n + 1));
      b.addEventListener('click', function () { go(n); reset(); });
      dotsWrap.appendChild(b);
      return b;
    });

    function show(n) {
      slides[i].classList.remove('is-active');
      dots[i].classList.remove('is-active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-active');
      dots[i].classList.add('is-active');
    }
    function go(n) { show(n); }
    function next() { show(i + 1); }
    function prev() { show(i - 1); }

    function animateBar() {
      if (!bar || reduce) return;
      bar.style.transition = 'none'; bar.style.width = '0';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          bar.style.transition = 'width ' + DURATION + 'ms linear';
          bar.style.width = '100%';
        });
      });
    }
    function start() {
      if (reduce) return;
      stop(); animateBar();
      timer = setInterval(function () { next(); animateBar(); }, DURATION);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function reset() { stop(); start(); }

    cz.querySelector('.cz-next').addEventListener('click', function () { next(); reset(); });
    cz.querySelector('.cz-prev').addEventListener('click', function () { prev(); reset(); });
    cz.addEventListener('mouseenter', stop);
    cz.addEventListener('mouseleave', start);
    cz.addEventListener('focusin', stop);
    cz.addEventListener('focusout', start);
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });

    cz.setAttribute('tabindex', '0');
    cz.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { next(); reset(); }
      else if (e.key === 'ArrowLeft') { prev(); reset(); }
    });
    var x0 = null;
    cz.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    cz.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); }
      x0 = null; start();
    });

    start();
  })();

  // Scroll-reveal micro-interactions (subtle, performant, motion-aware)
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealTargets = document.querySelectorAll(
      '.card, .feature-row, .section-head, .stat-band .grid > div, .cta-band, .logo-row span, .spec-table'
    );
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
      // Gentle stagger based on position among siblings
      var siblings = el.parentNode ? el.parentNode.children : [];
      var index = Array.prototype.indexOf.call(siblings, el);
      el.style.transitionDelay = Math.min(Math.max(index, 0) * 60, 360) + 'ms';
      observer.observe(el);
    });
  }
});
