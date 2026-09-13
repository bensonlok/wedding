/**
 * Benson & Mecki — Wedding Invitation
 * Countdown + scroll fade-ins
 */

const CONFIG = {
  // TODO: Replace with your real wedding date/time (ISO 8601 with timezone).
  // Example for Malaysia (UTC+8): '2026-11-22T17:00:00+08:00'
  weddingISO: "2099-01-01T17:00:00+08:00",
};

/* ----- Countdown ----- */
(function initCountdown() {
  const root = document.getElementById("countdown");
  if (!root) return;

  const target = new Date(CONFIG.weddingISO);
  if (Number.isNaN(target.getTime())) {
    console.warn("[wedding] Invalid CONFIG.weddingISO — countdown disabled.");
    return;
  }

  const els = {
    days: root.querySelector('[data-unit="days"]'),
    hours: root.querySelector('[data-unit="hours"]'),
    mins: root.querySelector('[data-unit="mins"]'),
    secs: root.querySelector('[data-unit="secs"]'),
  };

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function tick() {
    const now = Date.now();
    let diff = target.getTime() - now;

    if (diff <= 0) {
      els.days.textContent = "00";
      els.hours.textContent = "00";
      els.mins.textContent = "00";
      els.secs.textContent = "00";
      root.setAttribute("aria-label", "The wedding day has arrived");
      return;
    }

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ----- Scroll fade-ins ----- */
(function initFadeIns() {
  const nodes = document.querySelectorAll(".fade-in");
  if (!nodes.length) return;

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((el) => observer.observe(el));
})();

/* ----- Smooth-scroll for in-page links (iOS-friendly) ----- */
(function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
