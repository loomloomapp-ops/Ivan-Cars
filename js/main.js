/* =========================================================
   IVAN CARS — interactions
========================================================= */
(function () {
  "use strict";

  /* ---- Preloader: brand intro, smooth exit on full load ---- */
  var pl = document.getElementById("preloader");
  if (pl) {
    var plStart = Date.now();
    var PL_MIN = 1100;   // keep the intro on screen at least this long
    var PL_MAX = 6000;   // hard safety cap so it never hangs
    var plHidden = false;
    document.documentElement.classList.add("pl-lock");
    var plHide = function () {
      if (plHidden) return;
      plHidden = true;
      pl.classList.add("is-done");
      document.documentElement.classList.remove("pl-lock");
      pl.addEventListener("transitionend", function (e) {
        if (e.target === pl && pl.parentNode) pl.parentNode.removeChild(pl);
      });
    };
    var plFinish = function () {
      window.setTimeout(plHide, Math.max(0, PL_MIN - (Date.now() - plStart)));
    };
    if (document.readyState === "complete") plFinish();
    else window.addEventListener("load", plFinish);
    window.setTimeout(plHide, PL_MAX);
  }

  /* ---- Nav: scrolled state ---- */
  var nav = document.querySelector(".nav");
  var onScroll = function () {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var burger = document.getElementById("navBurger");
  var menu = document.getElementById("navMenu");
  var toggleMenu = function (open) {
    var willOpen = open !== undefined ? open : !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", willOpen);
    burger.classList.toggle("is-open", willOpen);
    burger.setAttribute("aria-expanded", willOpen ? "true" : "false");
    document.body.style.overflow = willOpen ? "hidden" : "";
  };
  burger.addEventListener("click", function (e) { e.stopPropagation(); toggleMenu(); });
  var closeBtn = document.getElementById("navClose");
  if (closeBtn) closeBtn.addEventListener("click", function () { toggleMenu(false); });
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () { toggleMenu(false); });
  });
  /* close when tapping outside the panel */
  document.addEventListener("click", function (e) {
    if (!menu.classList.contains("is-open")) return;
    if (menu.contains(e.target) || burger.contains(e.target)) return;
    toggleMenu(false);
  });
  /* close on Escape */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") toggleMenu(false);
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
          setTimeout(function () { el.classList.add("is-in"); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Před / Po gallery: service tabs ---- */
  var predpoFilters = document.getElementById("predpoFilters");
  var predpoGrid = document.getElementById("predpoGrid");
  if (predpoFilters && predpoGrid) {
    var predpoChips = predpoFilters.querySelectorAll(".filter-chip");
    var predpoEmpty = document.getElementById("predpoEmpty");
    var applyPredpoFilter = function (filter) {
      var shown = 0;
      predpoGrid.querySelectorAll(".predpo-card").forEach(function (card) {
        var cats = (card.getAttribute("data-cat") || "").split(/\s+/);
        var show = cats.indexOf(filter) !== -1;
        card.hidden = !show;
        if (show) shown++;
      });
      if (predpoEmpty) predpoEmpty.hidden = shown !== 0;
    };
    predpoChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        predpoChips.forEach(function (c) {
          var active = c === chip;
          c.classList.toggle("is-active", active);
          c.setAttribute("aria-pressed", active ? "true" : "false");
        });
        applyPredpoFilter(chip.getAttribute("data-filter"));
      });
    });
    var predpoInit = predpoFilters.querySelector(".filter-chip.is-active");
    if (predpoInit) applyPredpoFilter(predpoInit.getAttribute("data-filter"));
  }

  /* ---- Order form ---- */
  var form = document.getElementById("orderForm");
  var success = document.getElementById("formSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      success.hidden = false;
      form.querySelector('button[type="submit"]').disabled = true;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(function () {
        form.reset();
        form.querySelector('button[type="submit"]').disabled = false;
      }, 600);
    });
  }

  /* ---- Year ---- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
