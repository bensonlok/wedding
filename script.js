/**
 * Benson & Mecki — Wedding Invitation
 * Countdown, scroll reveal, menu, photo carousel, optional RSVP.
 */

const CONFIG = {
  // Ceremony start: Friday 20 November 2026, 3:30 PM Malaysia time (UTC+8)
  weddingISO: "2026-11-20T15:30:00+08:00",

  // RSVP block is hidden until a real link is provided.
  // To enable: set enabled: true and fill in link (and optionally deadline, e.g. "1 November 2026").
  rsvp: {
    enabled: false,
    link: "",
    deadline: "",
  },
};

/* ----- Countdown ----- */
(function initCountdown() {
  const root = document.getElementById("countdown");
  if (!root) return;
  const target = new Date(CONFIG.weddingISO);
  if (Number.isNaN(target.getTime())) return;

  const els = {
    days: root.querySelector('[data-unit="days"]'),
    hours: root.querySelector('[data-unit="hours"]'),
    mins: root.querySelector('[data-unit="mins"]'),
    secs: root.querySelector('[data-unit="secs"]'),
  };
  const pad = (n) => String(Math.max(0, n)).padStart(2, "0");

  function tick() {
    let diff = target.getTime() - Date.now();
    if (diff <= 0) {
      Object.values(els).forEach((el) => (el.textContent = "00"));
      return;
    }
    const days = Math.floor(diff / 86400000); diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000); diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ----- Scroll reveal ----- */
(function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  items.forEach((el) => io.observe(el));
})();

/* ----- Top bar + menu ----- */
(function initMenu() {
  const bar = document.getElementById("topbar");
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("menu");
  if (!bar || !btn || !menu) return;

  function onScroll() {
    bar.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.6);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setOpen(open) {
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  }
  btn.addEventListener("click", () => setOpen(menu.hidden));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
})();

/* ----- Photo carousel dots ----- */
(function initCarousel() {
  const car = document.getElementById("carousel");
  const dotsWrap = document.getElementById("carouselDots");
  if (!car || !dotsWrap) return;
  const slides = Array.from(car.children);
  slides.forEach(() => dotsWrap.appendChild(document.createElement("i")));
  const dots = Array.from(dotsWrap.children);

  function update() {
    const mid = car.scrollLeft + car.clientWidth / 2;
    let best = 0, bestDist = Infinity;
    slides.forEach((s, i) => {
      const d = Math.abs(s.offsetLeft + s.offsetWidth / 2 - mid);
      if (d < bestDist) { best = i; bestDist = d; }
    });
    dots.forEach((d, i) => d.classList.toggle("on", i === best));
  }
  car.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  window.addEventListener("resize", update);
  update();
})();

/* ----- RSVP (hidden unless CONFIG.rsvp.enabled and a link is set) ----- */
(function initRsvp() {
  const cfg = CONFIG.rsvp || {};
  const section = document.getElementById("rsvp");
  if (!section || !cfg.enabled || !cfg.link) return;
  const btn = section.querySelector("[data-rsvp-link]");
  if (btn) btn.setAttribute("href", cfg.link);
  const deadlineEl = section.querySelector("[data-rsvp-deadline]");
  if (deadlineEl && cfg.deadline) {
    deadlineEl.querySelector("strong").textContent = cfg.deadline;
    deadlineEl.hidden = false;
  }
  section.hidden = false;
})();
