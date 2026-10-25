/* ==========================================================================
   PHILNEX — scroll choreography & interactions (vanilla JS)
   ========================================================================== */
(function () {
  "use strict";
  window.__ready = true;

  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a === undefined ? 0 : a, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var vw = window.innerWidth, vh = window.innerHeight;
  var dirty = true;

  if (reduce) root.classList.add("reduce");
  if (fine) root.classList.add("has-cursor");
  root.dataset.theme = "dark";

  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Helper: wrap words (keeps inline elements)
     ------------------------------------------------------------------ */
  function wrapWords(node, className, inner) {
    var out = [];
    (function walk(n) {
      Array.prototype.slice.call(n.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) {
          var frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var s = document.createElement("span");
            s.className = className;
            if (inner) { var i = document.createElement("span"); i.textContent = part; s.appendChild(i); }
            else { s.textContent = part; }
            frag.appendChild(s);
            out.push(s);
          });
          n.replaceChild(frag, ch);
        } else if (ch.nodeType === 1) { walk(ch); }
      });
    })(node);
    return out;
  }

  /* ------------------------------------------------------------------
     Preloader
     ------------------------------------------------------------------ */
  var loader = $("#loader"), loaderCount = $("#loaderCount");
  var finished = false;
  function finishLoad() {
    if (finished) return;
    finished = true;
    root.classList.add("is-loaded");
    root.classList.remove("is-loading");
    if (loader) { loader.classList.add("is-done"); setTimeout(function () { loader.remove(); }, 1500); }
    dirty = true;
  }
  if (reduce || !loader) { finishLoad(); }
  else {
    var t0 = performance.now(), pageLoaded = document.readyState === "complete", n = 0;
    if (!pageLoaded) window.addEventListener("load", function () { pageLoaded = true; });
    (function step(now) {
      var el = now - t0;
      var target = pageLoaded ? 100 : Math.min(86, (el / 1600) * 86);
      n = lerp(n, target, 0.1);
      if (pageLoaded && el > 1300) n = Math.max(n, 99.6);
      loaderCount.textContent = Math.min(100, Math.round(n));
      if (n >= 99.5 && pageLoaded && el > 1300) { loaderCount.textContent = "100"; setTimeout(finishLoad, 260); }
      else requestAnimationFrame(step);
    })(t0);
    setTimeout(finishLoad, 5000);
  }

  /* ------------------------------------------------------------------
     Split headings, lead scrub, reveal observers
     ------------------------------------------------------------------ */
  $$(".split").forEach(function (h) {
    wrapWords(h, "mask", true).forEach(function (w, i) { w.firstChild.style.setProperty("--i", i); });
  });
  $$(".contact__title .mask > span").forEach(function (s, i) { s.style.setProperty("--i", i); });

  var lead = $("#lead");
  var leadWords = lead ? wrapWords(lead, "w", false) : [];

  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("is-in"); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal, .split, .contact__title, .footer__word, .after__title").forEach(function (el) { revealIO.observe(el); });
  $$("#footerWord span").forEach(function (s, i) { s.style.setProperty("--i", i); });
  $$(".stat__l, .facts, .about__body").forEach(function (el, i) { el.style.setProperty("--d", (i % 3) * 90 + "ms"); });

  /* Counters */
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      var el = e.target, target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || "";
      if (reduce) { el.textContent = target.toLocaleString("de-DE") + suffix; return; }
      var start = null, dur = 2200;
      (function tick(ts) {
        if (!start) start = ts;
        var p = clamp((ts - start) / dur);
        el.textContent = Math.floor(easeOut(p) * target).toLocaleString("de-DE") + suffix;
        if (p < 1) requestAnimationFrame(tick); else el.textContent = target.toLocaleString("de-DE") + suffix;
      })(performance.now());
    });
  }, { threshold: 0.5 });
  $$("[data-count]").forEach(function (el) {
    if (!reduce) el.textContent = "0" + (el.dataset.suffix || "");
    countIO.observe(el);
  });

  /* ------------------------------------------------------------------
     Theme (nav colour, cursor) + menu highlight
     ------------------------------------------------------------------ */
  var nav = $("#nav");
  var themeIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var t = e.target.dataset.theme;
      root.dataset.theme = t;
      nav.classList.toggle("is-light", t !== "dark");
    });
  }, { rootMargin: "-1px 0px -97% 0px" });
  $$("[data-theme]").forEach(function (s) { themeIO.observe(s); });

  var menuLinks = $$("[data-menu-link]");
  var menuMap = { intro: "", langs: "contact" };
  var menuIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var key = e.target.dataset.menu;
      if (key in menuMap) key = menuMap[key];
      menuLinks.forEach(function (a) { a.classList.toggle("is-active", a.dataset.menuLink === key); });
    });
  }, { rootMargin: "-50% 0px -50% 0px" });
  $$("[data-menu]").forEach(function (s) { menuIO.observe(s); });

  /* ------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------ */
  var menu = $("#menu"), menuBtn = $("#menuBtn");
  function setMenu(open) {
    root.classList.toggle("menu-open", open);
    menu.setAttribute("aria-hidden", String(!open));
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
  }
  menuBtn.addEventListener("click", function () { setMenu(!root.classList.contains("menu-open")); });
  menuLinks.forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setMenu(false); closeLightbox(); } });

  /* ------------------------------------------------------------------
     Cursor + magnetic buttons
     ------------------------------------------------------------------ */
  var cursor = $("#cursor"), cursorLabel = $("#cursorLabel");
  var mx = vw / 2, my = vh / 2, cx = mx, cy = my;
  if (fine) {
    window.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener("mouseover", function (e) {
      var lab = e.target.closest("[data-cursor]");
      if (lab) { cursor.classList.add("is-label"); cursor.classList.remove("is-link"); cursorLabel.textContent = lab.dataset.cursor; return; }
      cursor.classList.remove("is-label");
      cursor.classList.toggle("is-link", !!e.target.closest("a, button, input, textarea, .brand, .filter"));
    });
    document.addEventListener("mouseleave", function () { cursor.style.opacity = 0; });
    document.addEventListener("mouseenter", function () { cursor.style.opacity = ""; });
  } else if (cursor) { cursor.remove(); }

  if (fine && !reduce) {
    $$("[data-magnetic]").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transition = "transform .18s ease-out, background .4s, color .4s, border-color .4s";
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.28 + "px," + (e.clientY - r.top - r.height / 2) * 0.36 + "px)";
      });
      b.addEventListener("mouseleave", function () {
        b.style.transition = "transform .7s cubic-bezier(.34,1.56,.64,1), background .4s, color .4s, border-color .4s";
        b.style.transform = "";
      });
    });
  }

  /* ------------------------------------------------------------------
     Marquee band
     ------------------------------------------------------------------ */
  var bands = $$(".band__track").map(function (tr) { return { tr: tr, group: tr.firstElementChild, x: 0, w: 0, dir: parseFloat(tr.dataset.dir || -1) }; });
  function layoutBands() {
    bands.forEach(function (b) {
      $$(".band__group[data-clone]", b.tr).forEach(function (c) { c.remove(); });
      b.w = b.group.offsetWidth;
      var copies = Math.ceil((vw * 2.4) / Math.max(b.w, 1));
      for (var i = 0; i < copies; i++) {
        var c = b.group.cloneNode(true);
        c.setAttribute("data-clone", ""); c.setAttribute("aria-hidden", "true");
        b.tr.appendChild(c);
      }
    });
  }

  /* ------------------------------------------------------------------
     Scroll-driven pieces
     ------------------------------------------------------------------ */
  var parEls = $$("[data-speed]").map(function (el) { return { el: el, ref: el.parentElement, sp: parseFloat(el.dataset.speed) }; });
  var shiftEls = $$(".stat[data-shift] .stat__n, .brand[data-shift] .brand__name").map(function (el) {
    var host = el.closest("[data-shift]");
    return { el: el, host: host, dir: parseFloat(host.dataset.shift), k: host.classList.contains("stat") ? 0.075 : 0.06 };
  });

  /* hero: the photo's own sun is the anchor for the orbit rings */
  var heroEl = $("#top"), heroPhoto = $("#heroPhoto"), heroImg = heroPhoto ? $("img", heroPhoto) : null;
  var hmx = 0, hmy = 0;
  function layoutHero() {
    if (!heroPhoto || !heroImg || !heroImg.naturalWidth) return;
    var cw = heroPhoto.clientWidth, ch = heroPhoto.clientHeight, iw = heroImg.naturalWidth, ih = heroImg.naturalHeight;
    var s0 = Math.max(cw / iw, ch / ih), css = 1.06;
    var ox = (cw - iw * s0) * 0.54, oy = (ch - ih * s0) * 0.36;
    var px = (ox + 0.53 * iw * s0 - cw / 2) * css + cw / 2;
    var py = (oy + 0.425 * ih * s0 - ch / 2) * css + ch / 2;
    heroPhoto.style.setProperty("--sx", px.toFixed(1) + "px");
    heroPhoto.style.setProperty("--sy", py.toFixed(1) + "px");
    heroPhoto.style.setProperty("--sr", (0.43 * iw * s0 * css).toFixed(1) + "px");
  }
  if (heroImg) { if (heroImg.complete) layoutHero(); else heroImg.addEventListener("load", layoutHero); }

  /* THE AFTERTASTE film: starts only on click, so it plays with sound from the first frame */
  var afterFilm = $("#afterFilm"), afterVid = $("#afterVideo"), afterPlay = $("#afterPlay");
  if (afterFilm && afterVid && afterPlay) {
    var afterReset = function () {
      afterFilm.classList.remove("is-playing");
      afterVid.controls = false;
    };
    afterPlay.addEventListener("click", function () {
      afterVid.muted = false; afterVid.volume = 1; afterVid.controls = true;
      afterFilm.classList.add("is-playing");
      var pr = afterVid.play();
      if (pr && pr.catch) pr.catch(afterReset);
    });
    afterVid.addEventListener("ended", function () { afterVid.currentTime = 0; afterVid.load(); afterReset(); });
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (!e.isIntersecting && !afterVid.paused) afterVid.pause(); });
    }, { threshold: 0 }).observe(afterFilm);
  }

  /* phone */
  var phoneSec = $("#vorstellung"), phone = $("#phone"), video = $("#introVideo"), muteBtn = $("#muteToggle");
  function updatePhone() {
    if (!phoneSec) return;
    var r = phoneSec.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    var total = Math.max(1, r.height - vh);
    var p = clamp(-r.top / total);
    var e = easeOut(clamp((vh - r.top) / (vh * 0.9)));
    var mobile = vw < 860;
    phone.style.setProperty("--ry", lerp(mobile ? -14 : -26, mobile ? 12 : 20, p).toFixed(2) + "deg");
    phone.style.setProperty("--rx", lerp(8, -6, p).toFixed(2) + "deg");
    phone.style.setProperty("--ty", ((1 - e) * 140 + (0.5 - p) * 26).toFixed(1) + "px");
    phone.style.setProperty("--s", (lerp(0.78, 1, e) * (1 + Math.sin(p * Math.PI) * 0.05)).toFixed(3));
    phone.style.setProperty("--sheen", lerp(-90, 130, p).toFixed(1) + "%");
    if (e > 0.62 && !phone.classList.contains("is-on")) phone.classList.add("is-on");
  }
  if (reduce && phone) phone.classList.add("is-on");

  /* Intro video: autoplay muted when visible, robust on mobile */
  var introVisible = false, needsGesture = false;
  function tryPlay() {
    if (!video) return;
    var pr = video.play();
    if (pr && pr.catch) pr.catch(function () { needsGesture = true; });
  }
  if (video) {
    video.defaultMuted = true; video.muted = true;
    video.setAttribute("muted", ""); video.setAttribute("playsinline", ""); video.setAttribute("webkit-playsinline", "");
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        introVisible = e.isIntersecting;
        if (e.isIntersecting) tryPlay(); else video.pause();
      });
    }, { threshold: 0.2 }).observe($(".phone-sec__stage"));
    ["touchstart", "pointerdown", "keydown", "wheel"].forEach(function (ev) {
      window.addEventListener(ev, function () { if (needsGesture && introVisible) { needsGesture = false; tryPlay(); } }, { passive: true });
    });
    document.addEventListener("visibilitychange", function () { if (!document.hidden && introVisible) tryPlay(); });
  }
  if (muteBtn && video) {
    muteBtn.addEventListener("click", function () {
      video.muted = !video.muted;
      var on = !video.muted;
      muteBtn.classList.toggle("is-unmuted", on);
      muteBtn.setAttribute("aria-pressed", String(on));
      muteBtn.setAttribute("aria-label", on ? "Ton ausschalten" : "Ton einschalten");
      if (video.paused) tryPlay();
    });
  }

  /* horizontal services */
  var hs = $("#leistungen"), track = $("#servicesTrack"), arts = $$(".art", hs), travel = 0;
  function layoutHS() {
    if (reduce || !track) return;
    var last = track.lastElementChild;
    var pad = parseFloat(getComputedStyle(track).paddingRight) || 0;
    travel = Math.max(0, last.offsetLeft + last.offsetWidth + pad - vw);
    hs.style.setProperty("--travel", Math.round(travel * 0.72) + "px");
  }
  function updateHS() {
    if (!hs || reduce) return;
    var r = hs.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    var p = clamp(-r.top / Math.max(1, hs.offsetHeight - vh));
    track.style.transform = "translate3d(" + (-p * travel).toFixed(1) + "px,0,0)";
    arts.forEach(function (a) {
      var pr = a.parentElement.getBoundingClientRect();
      var c = (pr.left + pr.width / 2 - vw / 2) / vw;
      a.style.transform = "translate3d(" + (c * -70).toFixed(1) + "px,0,0) scale(1.1)";
    });
  }

  /* language rings */
  var langs = $$(".lang");
  function updateRings() {
    langs.forEach(function (l) {
      var r = l.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = reduce ? 1 : easeOut(clamp((vh * 0.92 - r.top) / (vh * 0.5)));
      $(".lang__bar", l).style.strokeDashoffset = (553 * (1 - parseFloat(l.dataset.level) * p)).toFixed(1);
    });
  }

  /* about lead: words light up while reading */
  function updateLead() {
    if (!lead) return;
    var r = lead.getBoundingClientRect();
    if (r.bottom < -50 || r.top > vh + 50) return;
    var p = reduce ? 1 : clamp((vh * 0.86 - r.top) / (r.height + vh * 0.32));
    var n = leadWords.length;
    for (var i = 0; i < n; i++) {
      var o = clamp(p * (n + 3) - i, 0, 1);
      var v = (0.16 + 0.84 * o).toFixed(2);
      if (leadWords[i]._o !== v) { leadWords[i]._o = v; leadWords[i].style.opacity = v; }
    }
  }

  /* projects: columns parallax + connecting line */
  var colEls = [], work = $("#projekte"), workPath = $("#workPath");
  if (workPath) { workPath.setAttribute("pathLength", "1"); workPath.style.strokeDasharray = "1"; workPath.style.strokeDashoffset = reduce ? "0" : "1"; }
  function updateWork() {
    colEls.forEach(function (c) {
      var r = c.ref.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      c.el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - vh / 2) * c.sp).toFixed(1) + "px,0)";
    });
    if (work && workPath && !reduce) {
      var wr = work.getBoundingClientRect();
      if (wr.bottom > 0 && wr.top < vh) {
        var p = clamp((vh * 0.75 - wr.top) / (wr.height * 0.85));
        workPath.style.strokeDashoffset = (1 - p).toFixed(4);
      }
    }
  }

  /* ------------------------------------------------------------------
     Main loop
     ------------------------------------------------------------------ */
  var progress = $("#progress"), cue = $("#cue");
  var lastY = window.scrollY, svel = 0, dirF = 1;
  function frame() {
    var y = window.scrollY, dy = y - lastY;
    lastY = y;
    svel = lerp(svel, dy, 0.14);
    if (Math.abs(svel) > 0.35) dirF = svel > 0 ? 1 : -1;

    var max = document.documentElement.scrollHeight - vh;
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0).toFixed(4) + ")";
    nav.classList.toggle("is-scrolled", y > 40);
    if (cue) cue.style.opacity = y > 80 ? 0 : "";

    if (!reduce) {
      bands.forEach(function (b) {
        b.x -= (0.8 + Math.abs(svel) * 0.5) * dirF * (b.dir < 0 ? 1 : -1);
        if (b.x <= -b.w) b.x += b.w;
        if (b.x > 0) b.x -= b.w;
        b.tr.style.transform = "translate3d(" + b.x.toFixed(2) + "px,0,0) skewX(" + clamp(-svel * 0.25, -8, 8).toFixed(2) + "deg)";
      });
    }

    if (dy !== 0 || dirty) {
      dirty = false;
      if (!reduce) {
        parEls.forEach(function (p) {
          var r = p.ref.getBoundingClientRect();
          if (r.bottom < -300 || r.top > vh + 300) return;
          p.el.style.transform = "translate3d(0," + ((r.top + r.height / 2 - vh / 2) * p.sp).toFixed(1) + "px,0)";
        });
        shiftEls.forEach(function (s) {
          var r = s.host.getBoundingClientRect();
          if (r.bottom < -100 || r.top > vh + 100) return;
          var c = (r.top + r.height / 2 - vh / 2) / vh;
          s.el.style.transform = "translate3d(" + (s.dir * c * vw * s.k).toFixed(1) + "px,0,0)";
        });
        updatePhone();
        updateHS();
      }
      updateWork();
      updateLead();
      updateRings();
    }

    if (heroEl && y < vh * 1.5) {
      heroEl.style.setProperty("--hp", clamp(y / vh).toFixed(3));
      if (fine && !reduce) {
        hmx = lerp(hmx, (mx / vw) * 2 - 1, 0.06); hmy = lerp(hmy, (my / vh) * 2 - 1, 0.06);
        heroEl.style.setProperty("--mx", hmx.toFixed(3)); heroEl.style.setProperty("--my", hmy.toFixed(3));
      }
    }

    if (fine) {
      cx = lerp(cx, mx, 0.28); cy = lerp(cy, my, 0.28);
      cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
    }
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------
     Projects (data from js/projects-data.js)
     ------------------------------------------------------------------ */
  var grid = $("#projectGrid"), filtersEl = $("#filters");
  var currentCat = "Alle", colCount = 0;
  var lightbox = $("#lightbox"), lbInner = $("#lightboxInner"), lbVideo = $("#lightboxVideo"), lbTitle = $("#lightboxTitle"), lbDesc = $("#lightboxDesc");
  var lastFocus = null, lastRect = null;

  function cols() { return vw >= 1000 ? 3 : 2; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var cardVideoIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target.querySelector("video");
      if (!v) return;
      if (e.isIntersecting) { if (!v.src) v.src = v.dataset.src; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
      else v.pause();
    });
  }, { threshold: 0.65 });

  function buildCard(p, i) {
    var card = document.createElement("article");
    card.className = "card reveal card--v" + ((i % 4) + 1);
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", p.title + " – Video ansehen");
    card.setAttribute("data-cursor", "Ansehen");
    var media = p.type === "video"
      ? '<video muted loop playsinline preload="none" poster="' + esc(p.poster) + '" data-src="' + esc(p.src) + '"></video>'
      : '<img src="' + esc(p.poster) + '" alt="' + esc(p.title) + '" loading="lazy">';
    card.innerHTML =
      '<div class="card__media">' + media + "</div>" +
      '<div class="card__cap"><span class="card__cat">' + esc(p.category) + "</span><h3>" + esc(p.title) + '</h3><p class="card__brand">' + esc(p.brand) + '</p><p class="card__desc">' + esc(p.description) + "</p></div>";
    card.addEventListener("click", function () { openLightbox(p, card); });
    card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLightbox(p, card); } });
    var v = card.querySelector("video");
    if (v && fine) {
      card.addEventListener("mouseenter", function () { if (!v.src) v.src = v.dataset.src; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); });
      card.addEventListener("mouseleave", function () { v.pause(); });
    } else if (v) { cardVideoIO.observe(card); }
    return card;
  }

  function renderProjects() {
    if (typeof PROJECTS === "undefined" || !grid) return;
    var list = currentCat === "Alle" ? PROJECTS : PROJECTS.filter(function (p) { return p.category === currentCat; });
    colCount = cols();
    grid.style.setProperty("--cols", colCount);
    grid.innerHTML = "";
    var speeds = [0, -0.1, 0.06], colNodes = [];
    for (var i = 0; i < colCount; i++) { var c = document.createElement("div"); c.className = "work__col"; grid.appendChild(c); colNodes.push(c); }
    list.forEach(function (p, i) {
      var card = buildCard(p, i);
      colNodes[i % colCount].appendChild(card);
      card.style.setProperty("--d", (Math.floor(i / colCount) * 80) + "ms");
      revealIO.observe(card);
    });
    colEls = colNodes.map(function (el, i) { return { el: el, ref: el.parentElement, sp: speeds[i] || 0 }; });
    dirty = true;
  }

  function renderFilters() {
    if (typeof PROJECTS === "undefined" || !filtersEl) return;
    var cats = ["Alle"];
    PROJECTS.forEach(function (p) { if (cats.indexOf(p.category) === -1) cats.push(p.category); });
    filtersEl.innerHTML = "";
    cats.forEach(function (cat) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "filter" + (cat === currentCat ? " is-active" : ""); b.textContent = cat;
      b.addEventListener("click", function () {
        currentCat = cat;
        $$(".filter", filtersEl).forEach(function (x) { x.classList.toggle("is-active", x === b); });
        renderProjects();
      });
      filtersEl.appendChild(b);
    });
  }

  /* Lightbox: the clip grows out of its card (FLIP) */
  function openLightbox(p, from) {
    lastFocus = from;
    var media = from.querySelector(".card__media");
    lastRect = media.getBoundingClientRect();
    lbVideo.src = p.src; lbVideo.poster = p.poster;
    lbTitle.textContent = p.title;
    lbDesc.textContent = p.description + " — " + p.brand;
    lightbox.classList.add("is-open");
    root.classList.add("lb-open");
    if (!reduce) {
      lbInner.style.transition = "none"; lbInner.style.transform = "none"; lbInner.style.opacity = 1;
      var to = lbInner.getBoundingClientRect();
      var s = lastRect.width / to.width;
      lbInner.style.transform = "translate(" + (lastRect.left - to.left) + "px," + (lastRect.top - to.top) + "px) scale(" + s + ")";
      lbInner.style.opacity = 0;
      requestAnimationFrame(function () { requestAnimationFrame(function () {
        lbInner.style.transition = "transform .9s cubic-bezier(.16,1,.3,1), opacity .5s";
        lbInner.style.transform = "none"; lbInner.style.opacity = 1;
      }); });
    }
    var pr = lbVideo.play(); if (pr && pr.catch) pr.catch(function () {});
    $("#lightboxClose").focus();
  }
  function closeLightbox() {
    if (!lightbox.classList.contains("is-open")) return;
    if (!reduce && lastRect) {
      var to = lbInner.getBoundingClientRect();
      lbInner.style.transition = "transform .6s cubic-bezier(.76,0,.24,1), opacity .5s";
      lbInner.style.transform = "translate(" + (lastRect.left - to.left) + "px," + (lastRect.top - to.top) + "px) scale(" + (lastRect.width / to.width) + ")";
      lbInner.style.opacity = 0;
    }
    lightbox.classList.remove("is-open");
    root.classList.remove("lb-open");
    lbVideo.pause();
    setTimeout(function () { if (!lightbox.classList.contains("is-open")) { lbVideo.removeAttribute("src"); lbVideo.load(); } }, 600);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  $("#lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });

  /* Card tilt (desktop) */
  if (fine && !reduce) {
    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest(".card");
      if (!card) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", ((px - 0.5) * 12).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - py) * 12).toFixed(2) + "deg");
      card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
      card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
    });
    document.addEventListener("mouseout", function (e) {
      var card = e.target.closest(".card");
      if (!card || card.contains(e.relatedTarget)) return;
      card.style.setProperty("--ry", "0deg"); card.style.setProperty("--rx", "0deg");
    });
  }

  /* ------------------------------------------------------------------
     Contact form -> mailto
     ------------------------------------------------------------------ */
  var form = $("#contactForm");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("#name").value.trim(), email = $("#email").value.trim(), msg = $("#message").value.trim();
    window.location.href = "mailto:management@philnex.com?subject=" + encodeURIComponent("Anfrage von " + name + " — philnex.com") +
      "&body=" + encodeURIComponent(msg + "\n\n— " + name + " (" + email + ")");
  });

  /* ------------------------------------------------------------------
     Layout / resize
     ------------------------------------------------------------------ */
  function layoutAll() {
    vw = window.innerWidth; vh = window.innerHeight;
    layoutBands(); layoutHS(); layoutHero();
    if (cols() !== colCount) renderProjects();
    dirty = true;
  }
  var rt;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layoutAll, 120); });
  window.addEventListener("load", layoutAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutAll);

  renderFilters();
  renderProjects();
  layoutAll();
  requestAnimationFrame(frame);
})();
