/* ============================================================
   Casa Humo Chiloé — main.js  (IIFE, sin módulos, robusto)
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasHover = window.matchMedia("(hover: hover)").matches;

  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ---------- Splash (double safety net) ---------- */
  function initSplash() {
    var splash = $("[data-splash]");
    if (!splash) return;
    var hide = function () { splash.classList.add("is-out"); };
    if (document.readyState === "complete") setTimeout(hide, 500);
    else window.addEventListener("load", function () { setTimeout(hide, 350); });
    setTimeout(hide, 3800); // extra safety
  }

  /* ---------- Nav: solid on scroll + mobile toggle ---------- */
  function initNav() {
    var nav = $("[data-nav]");
    var menu = $("[data-menu]");
    var toggle = $("[data-toggle]");
    var onScroll = function () {
      if (window.scrollY > 40) nav.classList.add("is-solid");
      else nav.classList.remove("is-solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (toggle && menu) {
      // Scrim: se crea en JS para no duplicar markup en index y carta.
      var scrim = document.createElement("div");
      scrim.className = "nav-scrim";
      scrim.setAttribute("aria-hidden", "true");
      document.body.appendChild(scrim);

      var setMenu = function (open) {
        menu.classList.toggle("is-open", open);
        scrim.classList.toggle("is-on", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      };

      toggle.addEventListener("click", function () {
        setMenu(!menu.classList.contains("is-open"));
      });
      scrim.addEventListener("click", function () { setMenu(false); });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && menu.classList.contains("is-open")) {
          setMenu(false);
          toggle.focus();
        }
      });
      $all("a", menu).forEach(function (a) {
        a.addEventListener("click", function () { setMenu(false); });
      });
    }
  }

  /* ---------- Smooth-scroll for in-page anchors ---------- */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#" || id === "#top") {
        if (id === "#top") { e.preventDefault(); window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); }
        return;
      }
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var offset = 76;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - offset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveals() {
    var els = $all(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });
    els.forEach(function (el) { io.observe(el); });

    // Safety net: reveal anything still hidden after 6s
    setTimeout(function () {
      $all(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight + 200) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* ---------- Count-up stats: ELIMINADO ----------
     Contar 0→17 en 1400ms es gesto de dashboard, no de una casa de fuego lento.
     Las cifras (30 · 17 · 100%) ya vienen escritas en el HTML y entran con .reveal
     junto al resto del bloque. Los atributos data-count/data-suffix quedan en el
     markup como dato semántico, sin animación asociada. */

  /* ---------- Dish cards: tilt 3D + ember halo (desktop only) ---------- */
  function initTilt() {
    // `reduced` faltaba: un usuario con reduced-motion en desktop igual recibía tilt 3D.
    if (!hasHover || reduced) return;
    $all("[data-tilt]").forEach(function (card) {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = "1";
      var halo = $(".dish-halo", card);
      var enter = function () { card.style.transition = "transform .12s ease-out"; };
      var move = function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        var rx = (0.5 - py) * 7;
        var ry = (px - 0.5) * 7;
        card.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-6px)";
        if (halo) { halo.style.setProperty("--hx", (px * 100) + "%"); halo.style.setProperty("--hy", (py * 100) + "%"); }
      };
      var leave = function () {
        card.style.transition = "transform .6s cubic-bezier(.22,1,.36,1)";
        card.style.transform = "";
      };
      card.addEventListener("mouseover", function (e) { if (!card.contains(e.relatedTarget)) enter(); });
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseout", function (e) { if (!card.contains(e.relatedTarget)) leave(); });
    });
  }

  /* ---------- Showcase: native horizontal scroll-snap (robust, no pin) ---------- */
  function initShowcase() {
    var pin = $("[data-pin]");
    var track = $("[data-track]");
    if (!pin || !track) return;

    // Drag-to-scroll on desktop (pointer), native swipe on touch — both use the
    // same overflow container, so no GSAP pin / no scroll hijacking.
    var down = false, startX = 0, startScroll = 0, moved = false;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "touch") return; // let native touch scroll handle it
      down = true; moved = false;
      startX = e.clientX; startScroll = track.scrollLeft;
      track.classList.add("is-dragging");
    });
    window.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startScroll - dx;
    });
    window.addEventListener("pointerup", function () {
      down = false; track.classList.remove("is-dragging");
    });
    // prevent click navigation right after a drag
    track.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); moved = false; }
    }, true);
    // NOTE: intentionally NOT hijacking vertical wheel → keeps page scroll natural.
    // Horizontal navigation via drag (desktop), swipe (touch) and trackpad X-axis.
  }

  /* ---------- Avisar que un enlace abre pestaña nueva ----------
     WCAG G201: conviene advertirlo ANTES de activarlo. Se hace por JS para no
     repetir el mismo <span> en tres páginas, y con texto solo-lector en vez de
     aria-label: aria-label reemplazaría el nombre accesible completo y rompería
     el control por voz («haz clic en Reservar mesa» dejaría de funcionar). */
  function initAvisoPestaña() {
    $all('a[target="_blank"]').forEach(function (a) {
      if (a.dataset.avisoBound) return;
      a.dataset.avisoBound = "1";
      if (!a.getAttribute("rel")) a.setAttribute("rel", "noopener");
      var s = document.createElement("span");
      s.className = "sr-only";
      s.textContent = " (se abre en una pestaña nueva)";
      a.appendChild(s);
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    safe(initAvisoPestaña, "initAvisoPestaña");
    safe(initSplash, "initSplash");
    safe(initNav, "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initReveals, "initReveals");
    safe(initTilt, "initTilt");
    safe(initShowcase, "initShowcase");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
