(function () {
  "use strict";

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Custom cursor
     ------------------------------------------------------------------ */
  var isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var cursor = document.querySelector(".cursor");
  var cursorRing = document.querySelector(".cursor--ring");

  if (isFinePointer && cursor && cursorRing) {
    var ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = "translate3d(" + mouseX + "px," + mouseY + "px,0)";
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = "translate3d(" + ringX + "px," + ringY + "px,0)";
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    var hoverTargets = "a, button, .project-card, .skill-card, .brand-wall__item, input, textarea";
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.add("is-hover");
        cursorRing.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(hoverTargets)) {
        cursor.classList.remove("is-hover");
        cursorRing.classList.remove("is-hover");
      }
    });
  } else if (cursor && cursorRing) {
    cursor.remove();
    cursorRing.remove();
  }

  /* ------------------------------------------------------------------
     Nav: scrolled state + light/dark theme per section
     ------------------------------------------------------------------ */
  var nav = document.getElementById("nav");
  var navToggle = document.getElementById("navToggle");
  var mobileMenu = document.getElementById("mobileMenu");

  window.addEventListener("scroll", function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener("click", function () {
    var isOpen = mobileMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  document.querySelectorAll(".js-menu-link").forEach(function (link) {
    link.addEventListener("click", function () {
      mobileMenu.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });

  var themedSections = document.querySelectorAll("[data-nav-theme]");
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var theme = entry.target.getAttribute("data-nav-theme");
        nav.classList.toggle("on-light", theme === "light");
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });

  themedSections.forEach(function (section) {
    navObserver.observe(section);
  });

  /* ------------------------------------------------------------------
     Hero entrance + subtle parallax
     ------------------------------------------------------------------ */
  var hero = document.querySelector(".hero");
  requestAnimationFrame(function () {
    setTimeout(function () {
      hero.classList.add("is-ready");
    }, 150);
  });

  var portraitImg = document.querySelector(".hero__portrait-frame img");
  var bgWord = document.querySelector(".hero__bg-word");
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y < window.innerHeight) {
      if (portraitImg) portraitImg.style.transform = "translateY(" + (y * 0.12) + "px)";
      if (bgWord) bgWord.style.transform = "translate(-50%, calc(-50% + " + (y * 0.08) + "px))";
    }
  }, { passive: true });

  /* ------------------------------------------------------------------
     Scroll reveal
     ------------------------------------------------------------------ */
  var revealTargets = document.querySelectorAll(".reveal, .reveal-stagger, .language");
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(function (el) {
    revealObserver.observe(el);
  });

  /* ------------------------------------------------------------------
     Animated stat counters
     ------------------------------------------------------------------ */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    var suffix = el.getAttribute("data-suffix");
    var duration = 1600;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = current.toLocaleString("de-DE") + (suffix ? " " + suffix : "");
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString("de-DE") + (suffix ? " " + suffix : "");
      }
    }
    requestAnimationFrame(step);
  }

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".js-counter").forEach(function (el) {
    counterObserver.observe(el);
  });

  /* ------------------------------------------------------------------
     Portfolio: render from PROJECTS data + filters + lightbox
     ------------------------------------------------------------------ */
  var grid = document.getElementById("projectGrid");
  var filtersEl = document.getElementById("filters");
  var lightbox = document.getElementById("lightbox");
  var lightboxVideo = document.getElementById("lightboxVideo");
  var lightboxTitle = document.getElementById("lightboxTitle");
  var lightboxDesc = document.getElementById("lightboxDesc");
  var lightboxClose = document.getElementById("lightboxClose");

  var cardObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  function playIconSVG() {
    return '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  }

  function renderProjects(list) {
    grid.innerHTML = "";
    list.forEach(function (project) {
      var card = document.createElement("article");
      card.className = "project-card";
      card.setAttribute("data-category", project.category);

      var mediaHTML;
      if (project.type === "video") {
        mediaHTML =
          '<video class="js-card-video" muted loop playsinline preload="none" ' +
          'poster="' + project.poster + '" data-src="' + project.src + '"></video>' +
          '<div class="project-card__play">' + playIconSVG() + "</div>";
      } else {
        mediaHTML = '<img src="' + project.poster + '" alt="' + project.title + '" loading="lazy">';
      }

      card.innerHTML =
        '<div class="project-card__media">' + mediaHTML + "</div>" +
        '<div class="project-card__body">' +
        '<span class="project-card__tag">' + project.category + "</span>" +
        '<h3 class="project-card__title">' + project.title + "</h3>" +
        '<p class="project-card__brand">' + project.brand + "</p>" +
        '<p class="project-card__desc">' + project.description + "</p>" +
        "</div>";

      card.addEventListener("click", function () {
        openLightbox(project);
      });

      var videoEl = card.querySelector(".js-card-video");
      if (videoEl) {
        card.addEventListener("mouseenter", function () {
          if (!videoEl.src) videoEl.src = videoEl.getAttribute("data-src");
          videoEl.play().catch(function () {});
        });
        card.addEventListener("mouseleave", function () {
          videoEl.pause();
        });
      }

      grid.appendChild(card);
      cardObserver.observe(card);
    });
  }

  function openLightbox(project) {
    lightboxVideo.src = project.src;
    lightboxVideo.poster = project.poster;
    lightboxTitle.textContent = project.title;
    lightboxDesc.textContent = project.description + " — " + project.brand;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lightboxVideo.play().catch(function () {});
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  function renderFilters() {
    var categories = ["Alle"];
    PROJECTS.forEach(function (p) {
      if (categories.indexOf(p.category) === -1) categories.push(p.category);
    });

    filtersEl.innerHTML = "";
    categories.forEach(function (cat, i) {
      var btn = document.createElement("button");
      btn.className = "filter-btn" + (i === 0 ? " is-active" : "");
      btn.type = "button";
      btn.textContent = cat;
      btn.addEventListener("click", function () {
        filtersEl.querySelectorAll(".filter-btn").forEach(function (b) {
          b.classList.remove("is-active");
        });
        btn.classList.add("is-active");
        var filtered = cat === "Alle" ? PROJECTS : PROJECTS.filter(function (p) {
          return p.category === cat;
        });
        renderProjects(filtered);
      });
      filtersEl.appendChild(btn);
    });
  }

  if (typeof PROJECTS !== "undefined") {
    renderFilters();
    renderProjects(PROJECTS);
  }

  /* ------------------------------------------------------------------
     Contact form -> mailto fallback (static site, no backend)
     ------------------------------------------------------------------ */
  var contactForm = document.getElementById("contactForm");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var message = document.getElementById("message").value.trim();

    var subject = encodeURIComponent("Anfrage von " + name + " — philnex.com");
    var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
    window.location.href = "mailto:management@philnex.com?subject=" + subject + "&body=" + body;
  });
})();
