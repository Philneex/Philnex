/**
 * PHILNEX – Sprachumschaltung DE / EN
 * Deutsch steht direkt im HTML. Ist Englisch gewählt, ersetzt dieses Script die Texte,
 * bevor main.js startet (Animationen, Projektkarten und Filter laufen danach ganz normal).
 * Gewählte Sprache bleibt gespeichert (localStorage). Link-Variante: ?lang=en / ?lang=de
 */
(function () {
  "use strict";
  var KEY = "philnex-lang";
  var q = new URLSearchParams(location.search).get("lang");
  try { if (q === "en" || q === "de") localStorage.setItem(KEY, q); } catch (e) {}
  var lang = "de";
  try { lang = localStorage.getItem(KEY) === "en" ? "en" : "de"; } catch (e) {}
  window.PHILNEX_LANG = lang;
  document.documentElement.lang = lang;

  /* short strings used inside main.js */
  var STR = {
    "Alle": "All", "Ansehen": "Watch", " – Video ansehen": " – watch video", "Anfrage von ": "Enquiry from ",
    "Menü öffnen": "Open menu", "Menü schließen": "Close menu",
    "Ton einschalten": "Turn sound on", "Ton ausschalten": "Turn sound off",
    "Wird gesendet …": "Sending …",
    "Danke! Deine Nachricht ist angekommen – ich melde mich bald bei dir.": "Thank you! Your message has arrived – I’ll get back to you soon.",
    "Das hat leider nicht geklappt.": "Sorry, that didn’t work.",
    "Schreib mir stattdessen direkt per E-Mail.": "Email me directly instead."
  };
  window.PHILNEX_T = function (s) { return lang === "en" && STR[s] !== undefined ? STR[s] : s; };

  /* switcher buttons */
  Array.prototype.forEach.call(document.querySelectorAll("[data-lang]"), function (b) {
    var on = b.getAttribute("data-lang") === lang;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", String(on));
    b.addEventListener("click", function () {
      var l = b.getAttribute("data-lang");
      if (l === lang) return;
      try { localStorage.setItem(KEY, l); sessionStorage.setItem("philnex-scroll", String(window.scrollY)); } catch (e) {}
      var u = new URL(location.href); u.searchParams.delete("lang");
      location.replace(u.pathname + u.search + u.hash);
    });
  });
  try {
    var y = sessionStorage.getItem("philnex-scroll");
    if (y !== null) {
      sessionStorage.removeItem("philnex-scroll");
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.addEventListener("load", function () { window.scrollTo({ top: +y, behavior: "instant" }); });
    }
  } catch (e) {}

  if (lang !== "en") return;

  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  function html(sel, list) { $$(sel).forEach(function (el, i) { if (list[i] !== undefined && list[i] !== null) el.innerHTML = list[i]; }); }
  function attr(sel, name, val) { $$(sel).forEach(function (el) { el.setAttribute(name, val); }); }

  /* meta */
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", "Phil is a Vienna-based content creator and video editor with 5 years of experience in hooks, storytelling and video content for brands on Instagram & TikTok.");
  var od = document.querySelector('meta[property="og:description"]');
  if (od) od.setAttribute("content", "Vienna-based content creator & video editor. Hooks, storytelling and video content that sticks.");

  /* navigation */
  html(".nav__links a", ["About", "Results", "Services", "UGC", "Projects", "Contact"]);
  html(".nav__cta", ["Work with me"]);
  attr(".nav__brand", "aria-label", "PHILNEX – back to top");
  attr("#menuBtn", "aria-label", "Open menu");
  var dot = '<span class="menu__dot"></span>';
  html(".menu__list a", [dot + "About", dot + "Results", dot + "Brands", dot + "Services", dot + "UGC", dot + "Projects", dot + "Contact"]);
  html(".menu__contact", ["management@philnex.com<br>Vienna, Austria"]);

  /* hero */
  html(".hero__eyebrow", ["Content Creator · Video Editor · Vienna"]);
  html(".hero__tag", ["Vienna, AT"]);
  var heroLines = $$(".hero__title .mask > span");
  if (heroLines[0]) heroLines[0].innerHTML = "Hooks that";
  if (heroLines[1]) {
    heroLines[1].innerHTML = "really <em>stick.</em>";
  }
  if (heroLines[2]) heroLines[2].innerHTML = '<i class="t-sans">Content that</i> works.';
  html(".hero__sub", ["I’m <strong>Phil</strong> — for 5 years I’ve been telling stories on camera and editing them so people keep watching. For brands. For restaurants. For my own channels."]);
  html(".hero__actions a", ['View projects <span class="btn__arrow">↓</span>', "Get in touch"]);
  attr("#heroPhoto", "data-cursor", "Click me");
  html(".band__item", ["Content Creation", "Hooks &amp; Storytelling", "Video Editing", "TikTok &amp; Instagram Growth", "Food Vlogging"]);

  /* intro phone */
  html(".phone-sec__text .label", ["Quick intro"]);
  html(".phone-sec__text .h2", ['<i class="t-sans">Get to know me in</i> 60 <em>seconds.</em>']);
  html(".phone-sec__p", ["Who I am, what I do and why I love it — in my own words."]);
  attr(".phone__mute", "aria-label", "Turn sound on");
  attr("#introVideo", "aria-label", "Intro video of Phil");
  attr("#proofVideo", "aria-label", "Video: How do I prove in 60 seconds that I create great content?");

  /* about */
  html(".about__head .label", ["About me"]);
  html(".about__head .h2", ["At home on both sides of the <em>camera.</em>"]);
  html("#lead", ["For more than <strong>5 years</strong> I’ve been working on both sides of the camera – for big brands and for my own. What started as a passion for talking on camera and editing video is now my job: I develop hooks, tell stories and create content that really sticks on Instagram and TikTok."]);
  html(".about__body", ["Based in <strong>Vienna</strong>, I work with international brands – but also close to home: as a food vlogger I’ve visited countless restaurants across the city and shown how versatile good storytelling can be, from the three-second hook to the full-scale campaign."]);
  html(".facts dt", ["5 years", "DE / EN", "Vienna", "360°"]);
  html(".facts dd", ["Experience as a creator", "Bilingual content", "Home base", "Concept to final cut"]);

  /* content in 60 seconds */
  html(".proof__text .label", ["Content in 60 seconds"]);
  html(".proof__text .h2", ["How do I prove in 60 seconds that I create great <em>content</em>?"]);
  html(".proof__p", ["Less introduction, more proof: one minute showing how hook, scenes and editing come together into content that really makes an impact."]);

  /* stats */
  html(".stats__head .label", ["Reach"]);
  html(".stats__head .h2", ['Numbers <i class="t-sans">that speak</i> <em>for themselves.</em>']);
  html(".stat__l", ["Followers on TikTok", "Followers on Instagram", "Views on individual videos"]);
  $$('.stat__n b[data-suffix=" Mio.+"]').forEach(function (b) { b.setAttribute("data-suffix", "M+"); b.textContent = "1M+"; });

  /* brands */
  html(".brands__head .label", ["Brands &amp; Partners"]);
  html(".brands__head .h2", ["Collaborations <em>that work.</em>"]);
  html(".brands__head .lede", ["From streetwear campaigns and food content to music promotion for labels worldwide — a selection of the brands and partners I’ve worked with."]);
  html(".brand--soft .brand__name", ["Music promotion<br>for labels worldwide"]);

  /* services */
  html(".panel--intro .label", ["Services"]);
  html(".panel--intro .h2", ["What I take <em>off your plate.</em>"]);
  html(".panel__txt h3", ["Content Creation", "Hooks &amp; Storytelling", "Video Editing", "Instagram &amp; TikTok Growth", "Engagement Strategies", "Food Vlogging"]);
  html(".panel__txt p", [
    "From idea to finished clip — concept, shoot and production, all in one place.",
    "The first three seconds decide everything. I build hooks that keep people watching.",
    "Editing, pacing and sound design in Adobe Premiere Pro, Adobe Audition &amp; Canva — clean, rhythmic and tailored to each platform.",
    "Strategies that grow your reach and community for the long term.",
    "Content that doesn’t just get watched, but gets commented on and shared.",
    "Relatable restaurant content that leaves people hungry for more — tried and tested in Vienna’s food scene."
  ]);

  /* UGC for brands */
  html(".ugc__text .label", ["UGC for brands"]);
  html(".ugc__text .h2", ["Content that doesn’t look like an <em>ad.</em>"]);
  html(".ugc__text .lede", ["I create UGC videos for brands: authentic, vertical and built for TikTok, Instagram and ads – from the idea and the shoot in my own studio to the final edit."]);
  html(".ugc__h", ["What you get"]);
  html(".ugc__list li", [
    "Fully edited vertical videos (9:16), 4:5 on request",
    "Several hook variations per video for testing",
    "Product shots and raw footage for your own ads",
    "Subtitles, music and sound design",
    "In German or English"
  ]);
  html(".ugc__steps li", [
    "<b>01</b><span><strong>Briefing</strong> You tell me about the product, the audience and the goal.</span>",
    "<b>02</b><span><strong>Concept &amp; shoot</strong> I develop the hooks and shoot in my studio or on location.</span>",
    "<b>03</b><span><strong>Delivery</strong> You get the finished videos, including hook variations.</span>"
  ]);
  html(".ugc__actions a", ['Request UGC <span class="btn__arrow">→</span>', "View UGC projects"]);
  html(".ugc__caption", ['<span class="ugc__tag">Spec Ad</span> DW Home – Marshmallow Cherry. Independently conceived and produced, not an official collaboration.']);
  attr("#ugcMute", "aria-label", "Turn sound on");
  attr("#ugcVideo", "aria-label", "UGC spec ad: DW Home Marshmallow Cherry candle");

  /* projects */
  html(".work__head .h2", ["Selected <em>projects.</em>"]);
  html(".work__head .lede", ["A selection of brand campaigns and food vlogging content — conceived vertically, made for Instagram &amp; TikTok."]);
  attr("#lightboxClose", "aria-label", "Close");
  if (typeof PROJECTS !== "undefined") {
    var CAT = { "Eigene Marke": "Own Brand", "Markenkampagne": "Brand Campaign", "Food-Vlogging": "Food Vlogging", "Musikpromotion": "Music Promotion" };
    var P = {
      "aftertaste-01": ["The Aftertaste – Short Film", "Independent creative project, a cinematic satire (2:27 min): a job offer withdrawn at short notice becomes a satirical short film – from concept and creative direction to editing and sound design, all in one place."],
      "diesel-01": ["Diesel Brand Campaign", "Vertical campaign clip for Diesel, focused on a strong hook in the first seconds and fast, rhythmic editing."],
      "alfric-eden-01": ["Alfric Eden Brand Campaign", "Vertical streetwear clip for Alfric Eden – extreme wide-angle shots, movement straight into the camera and fast cuts that put the outfit centre stage."],
      "art-of-techno-01": ["Art of Techno Brand Campaign", "Vertical clip for Art of Techno – shot on an escalator with a fisheye lens and cut to the rhythm, with the collection’s prints in focus."],
      "calvin-klein-01": [null, "Spec campaign for Calvin Klein – independently conceived and produced to show how I would work with an established brand. Not an official collaboration."],
      "calvin-klein-02": [null, "The second part of the Calvin Klein spec campaign – storytelling across several scenes with a consistent look. Independent concept, not an official collaboration."],
      "sang-sang-01": ["Sang Sang – Food Vlog", "Food vlog content from Sang Sang in Vienna – from ordering to the first bite, shot and edited by me."],
      "tokki-01": ["Tokki – Food Vlog", "Food vlog from Tokki – relatable storytelling with a strong hook and plenty of personality on camera."],
      "ugc-dw-home-candle": ["DW Home Marshmallow Cherry – UGC Spec Ad", "UGC spec ad for the Marshmallow Cherry candle by DW Home – independently conceived and produced in my studio: flames, caramelised marshmallows and cherries tell the story of the scent. Not an official collaboration."],
      "tortilla-01": ["Tortilla de Patata by Phil – Cooking Video", "My own cooking format: tortilla de patata – from a short dialogue as the opener through every single step to the flip and the first cut, edited so you can cook along right away."],
      "salmon-dill-01": ["Salmon in Dill Sauce by Phil – Cooking Video", "My own cooking format: salmon in dill sauce – from prep to plating, told in calm, mouth-watering shots."],
      "meatballs-01": ["Meatballs by Phil – Cooking Video", "My own cooking format: meatballs in tomato sauce – steam, texture and close-ups that make you want to cook along."]
    };
    PROJECTS.forEach(function (p) {
      var t = P[p.id];
      if (t) { if (t[0]) p.title = t[0]; if (t[1]) p.description = t[1]; }
      if (CAT[p.category]) p.category = CAT[p.category];
      if (CAT[p.brand]) p.brand = CAT[p.brand];
    });
  }

  /* languages */
  html(".langs .label", ["Languages"]);
  html(".langs .h2", ["Ready to work <em>internationally.</em>"]);
  html(".lang__txt h3", ["German", "English"]);
  html(".lang__txt p", ["Native speaker", "C1"]);

  /* contact */
  html(".contact__inner > .label", ["Contact"]);
  var cl = $$(".contact__title .mask > span");
  if (cl[0]) cl[0].innerHTML = "Let’s create";
  if (cl[1]) cl[1].innerHTML = '<em>something</em> together.';
  html(".contact__list .label", ["Instagram", "TikTok", "Email", "Location"]);
  html(".contact__list p", ["Vienna, Austria"]);
  html(".field label", ["Name", "Email", "Message"]);
  html(".form__note", ['Your message comes straight to me – I’ll get back to you as soon as possible. How your details are processed is explained in the <a href="datenschutz/">privacy policy</a>.']);
  html(".form .btn", ['Send message <span class="btn__arrow">→</span>']);

  /* footer */
  html(".footer__links a", ["Instagram", "TikTok", "Email", "Privacy"]);
  html(".footer__copy", ['<span>© <span id="year"></span> Phil. All rights reserved.</span> <span>Vienna, Austria</span>']);
})();
