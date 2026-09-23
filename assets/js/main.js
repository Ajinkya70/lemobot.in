/* Lemobot single-page — interactions. No dependencies.
   Theme is pre-applied by an inline <head> script (light default). */
(function () {
  'use strict';
  var WA = 'https://wa.me/919819413273?text=';
  var enc = encodeURIComponent;
  var root = document.documentElement;

  /* ---------- theme toggle (light default; no system-follow) ---------- */
  var tt = document.querySelector('[data-theme-toggle]');
  if (tt) tt.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('lemobot-theme', next); } catch (e) {}
  });

  /* ---------- mobile nav ---------- */
  var nt = document.querySelector('[data-nav-toggle]');
  var mm = document.querySelector('[data-mobile-menu]');
  if (nt && mm) {
    nt.addEventListener('click', function () { mm.classList.toggle('open'); });
    mm.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { mm.classList.remove('open'); }); });
  }

  /* ---------- reveal ---------- */
  var rev = document.querySelectorAll('.reveal');
  if (rev.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12 });
    rev.forEach(function (el) { io.observe(el); });
  } else rev.forEach(function (el) { el.classList.add('in'); });

  /* ---------- stat counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseFloat(el.getAttribute('data-count')), suf = el.getAttribute('data-suffix') || '', t0 = null;
        function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / 1300, 1); el.textContent = Math.round(target * p) + suf; if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step); co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- scroll spy (nav underline) ---------- */
  var links = [].slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function spy() {
    var y = window.scrollY + 90, cur = 0;
    for (var i = 0; i < sections.length; i++) { if (sections[i] && sections[i].offsetTop <= y) cur = i; }
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur); });
  }

  /* ---------- scroll-to-top ---------- */
  var toTop = document.querySelector('[data-to-top]');
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  function onScroll() { spy(); if (toTop) toTop.classList.toggle('show', window.scrollY > 500); }
  var ticking = false;
  window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(function () { onScroll(); ticking = false; }); ticking = true; } }, { passive: true });
  onScroll();

  /* ---------- marquee: duplicate track for seamless loop ---------- */
  document.querySelectorAll('[data-marquee] .marq-track').forEach(function (tr) { tr.innerHTML += tr.innerHTML; });

  /* ---------- year ---------- */
  var yr = document.querySelector('[data-year]'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- legal modals ---------- */
  function openModal(name) { var o = document.querySelector('[data-modal-overlay="' + name + '"]'); if (o) { o.classList.add('open'); document.body.style.overflow = 'hidden'; } }
  function closeModals() { document.querySelectorAll('.modal-overlay.open').forEach(function (o) { o.classList.remove('open'); }); document.body.style.overflow = ''; }
  document.querySelectorAll('[data-modal]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); openModal(b.getAttribute('data-modal')); }); });
  document.querySelectorAll('[data-modal-close]').forEach(function (b) { b.addEventListener('click', closeModals); });
  document.querySelectorAll('.modal-overlay').forEach(function (o) { o.addEventListener('click', function (e) { if (e.target === o) closeModals(); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModals(); });

  /* ---------- chat widget ---------- */
  var fab = document.querySelector('[data-chat-fab]');
  var panel = document.querySelector('[data-chat-panel]');
  var body = document.querySelector('[data-chat-body]');
  var form = document.querySelector('[data-chat-form]');
  var input = document.querySelector('[data-chat-input]');
  var badge = document.querySelector('[data-chat-badge]');
  var started = false;

  function scroll() { body.scrollTop = body.scrollHeight; }
  function addUser(t) { var d = document.createElement('div'); d.className = 'msg user'; d.textContent = t; body.appendChild(d); scroll(); }
  function addBot(html, cb) { var d = document.createElement('div'); d.className = 'msg bot'; d.innerHTML = html; body.appendChild(d); scroll(); if (cb) setTimeout(cb, 480); }
  function addQuicks(items) {
    var wrap = document.createElement('div'); wrap.className = 'quicks';
    items.forEach(function (it) { var b = document.createElement('button'); b.className = 'quick'; b.type = 'button'; b.textContent = it.label; b.addEventListener('click', function () { wrap.remove(); it.onClick(); }); wrap.appendChild(b); });
    body.appendChild(wrap); scroll();
  }
  function waLink(t) { return WA + enc(t); }
  function waButton(t, label) {
    return '<a class="quick" style="display:inline-flex;align-items:center;gap:.4rem;margin-top:.5rem" href="' + waLink(t) + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.7-1.5-3.7-3.3-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.9 1.2 2.9.8 3.5.8.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4M12 21.5c-1.7 0-3.3-.5-4.7-1.3L3 21.5l1.3-4.2C3.5 15.8 3 14 3 12 3 6.8 7.2 2.5 12.5 2.5S22 6.8 22 12s-4.3 9.5-10 9.5"/></svg>' +
      (label || 'Open WhatsApp') + '</a>';
  }

  var topics = {
    'Custom software / ERP': { recap: "Got it — turning manual, Excel-and-WhatsApp work into proper software is exactly our core.", sols: ['Custom Business Software — your process, one reliable system', 'ERP & Operations — sales, stock, billing & CRM in one place', 'Business Automation — cut the repetitive back-office work'], wa: "Hi Lemobot, I'd like to talk about turning my business workflow into software." },
    'Sell online': { recap: "Nice — we build online stores that are made to convert, not just to look good.", sols: ['Shopify — fast, on-brand stores set up properly', 'WooCommerce / WordPress — stores you can run yourself', 'Custom e-commerce — when a template can\'t handle your rules'], wa: "Hi Lemobot, I'd like to discuss building or improving an e-commerce store." },
    'SaaS / product': { recap: "Love it — we take product ideas from MVP to a full, launchable platform.", sols: ['MVP development — a focused first version, shipped fast', 'SaaS platform — multi-tenant, subscriptions, dashboards', 'Custom platform — built to scale as you grow'], wa: "Hi Lemobot, I have a product/SaaS idea and would like to discuss it." },
    'A website': { recap: "Perfect — we build fast, credible sites designed to turn visitors into enquiries.", sols: ['Business websites — clean, professional, conversion-focused', 'WordPress — fast and editable, without the bloat', 'Custom websites — bespoke when you need it'], wa: "Hi Lemobot, I'd like to discuss a website for my business." },
    'Add AI': { recap: "We add practical AI inside the software and workflows you already run — where it genuinely helps.", sols: ['AI assistants inside your app', 'Document processing & data extraction', 'Workflow & back-office automation'], wa: "Hi Lemobot, I'd like to add AI features to an existing system or workflow." }
  };

  function showTopics() {
    var items = Object.keys(topics).map(function (k) { return { label: k, onClick: function () { chooseTopic(k); } }; });
    items.push({ label: 'Something else', onClick: function () { addUser('Something else'); addBot("No problem — tell me in a sentence what you're trying to solve, and I'll point you the right way.", function () { input && input.focus(); }); } });
    addQuicks(items);
  }
  function startConversation() {
    if (started) return; started = true; if (badge) badge.style.display = 'none';
    addBot("Hi! I'm the Lemobot assistant 👋", function () {
      addBot("What are you looking to build? Pick one, or type your own below.", function () { showTopics(); });
    });
  }
  function chooseTopic(k) {
    addUser(k);
    var t = topics[k];
    // step 1: acknowledge the situation
    addBot(t.recap, function () {
      // step 2: show relevant solutions
      addBot("Here's where we'd help:<br>" + t.sols.map(function (s) { return '• ' + s; }).join('<br>'), function () {
        // step 3: offer next step — WhatsApp appears only at the end
        addBot("Want to take it further?", function () {
          addQuicks([
            { label: 'Talk to the team on WhatsApp', onClick: function () { addUser('Talk on WhatsApp'); addBot("Great — tap below and it'll open WhatsApp with your context ready:" + waButton(t.wa, 'Continue on WhatsApp')); } },
            { label: 'Type my requirement here', onClick: function () { addUser('Type my requirement'); addBot("Sure — type it below and we'll take it from there.", function () { input && input.focus(); }); } },
            { label: 'See other options', onClick: function () { addUser('See other options'); addBot('No problem — what else are you looking at?', function () { showTopics(); }); } }
          ]);
        });
      });
    });
  }

  if (fab) fab.addEventListener('click', function () {
    var open = panel.classList.toggle('open'); fab.classList.toggle('open', open); fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) { startConversation(); setTimeout(function () { input && input.focus(); }, 300); }
  });
  document.querySelectorAll('[data-chat-close]').forEach(function (b) { b.addEventListener('click', function () { panel.classList.remove('open'); fab.classList.remove('open'); fab.setAttribute('aria-expanded', 'false'); }); });

  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault(); var v = (input.value || '').trim(); if (!v) return; addUser(v); input.value = '';
    addBot("Thanks — that helps. The quickest way to get you a real, useful answer is a short WhatsApp chat with our team, pre-filled with your message:" +
      waButton('Hi Lemobot, ' + v, 'Send on WhatsApp'), function () {
        addBot('Prefer email? <a class="quick" style="display:inline-block;margin-top:.3rem" href="mailto:info@lemobot.in">info@lemobot.in</a>');
      });
  });
})();
