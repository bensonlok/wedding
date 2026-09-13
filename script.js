/**
 * Benson & Mecki — Wedding Invitation
 * Countdown + scroll fade-ins + photo hero/gallery
 */

const CONFIG = {
  // TODO: Replace with your real wedding date/time (ISO 8601 with timezone).
  // Example for Malaysia (UTC+8): '2026-11-22T17:00:00+08:00'
  weddingISO: "2026-11-20T17:00:00+08:00",

  // Photo folder (relative to this page). Files expected: photo-01.jpg … photo-N.jpg
  photoDir: "assets/photos/",
  photoPrefix: "photo-",
  photoExt: ".jpg",
  maxPhotos: 36,

  // Prefer a romantic couple shot for the hero.
  // Set to a specific filename (e.g. "photo-03.jpg") once you pick one,
  // or leave null to auto-pick the first available photo.
  heroPhoto: "photo-05.jpg", // romantic couple shot — kiss with burgundy roses

  // Index (0-based among found photos) to make wide in the grid
  wideIndexes: [2, 4, 9], // boat heart, roses kiss, dress fitting
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
function revealFadeIns(scope) {
  const root = scope || document;
  const nodes = root.querySelectorAll
    ? root.querySelectorAll(".fade-in:not(.is-visible)")
    : [];
  // Also support single element
  const list =
    scope && scope.classList && scope.classList.contains("fade-in")
      ? [scope, ...nodes]
      : [...nodes];

  if (!list.length) return;

  if (!("IntersectionObserver" in window)) {
    list.forEach((el) => el.classList.add("is-visible"));
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

  list.forEach((el) => observer.observe(el));
}

(function initFadeIns() {
  revealFadeIns(document);
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

/* ----- Photos: hero + gallery (graceful if folder empty) ----- */
(function initPhotos() {
  const hero = document.querySelector(".hero");
  const heroBg = document.getElementById("heroBg");
  const gallerySection = document.getElementById("gallery");
  const galleryGrid = document.getElementById("galleryGrid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function probe(src) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  }

  async function discoverPhotos() {
    const found = [];
    // Probe sequentially in small batches so we stop early after misses
    let misses = 0;
    for (let i = 1; i <= CONFIG.maxPhotos; i++) {
      const name = CONFIG.photoPrefix + pad2(i) + CONFIG.photoExt;
      const src = CONFIG.photoDir + name;
      const ok = await probe(src);
      if (ok) {
        found.push({ name, src });
        misses = 0;
      } else {
        misses += 1;
        // Stop after a few consecutive misses once we've started
        if (found.length && misses >= 3) break;
        // Or if first ones missing, keep scanning a bit then stop
        if (!found.length && i >= 8) break;
      }
    }
    return found;
  }

  function setHero(src) {
    if (!hero || !heroBg || !src) return;
    heroBg.style.backgroundImage = 'url("' + src + '")';
    hero.classList.add("has-photo");
  }

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Wedding photo";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  function renderGallery(photos) {
    if (!gallerySection || !galleryGrid || !photos.length) return;
    galleryGrid.innerHTML = "";
    photos.forEach((photo, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery__item fade-in";
      if ((CONFIG.wideIndexes || []).includes(idx)) {
        btn.classList.add("gallery__item--wide");
      }
      btn.setAttribute("aria-label", "View photo " + (idx + 1));
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = "Benson & Mecki — photo " + (idx + 1);
      img.loading = "lazy";
      img.decoding = "async";
      btn.appendChild(img);
      btn.addEventListener("click", () => openLightbox(photo.src, img.alt));
      galleryGrid.appendChild(btn);
    });
    gallerySection.hidden = false;
    revealFadeIns(gallerySection);
  }

  discoverPhotos().then((photos) => {
    if (!photos.length) {
      // Graceful fallback: keep gradient hero, hide gallery
      console.info("[wedding] No photos found in " + CONFIG.photoDir + " — using gradient hero.");
      return;
    }

    let heroSrc = photos[0].src;
    if (CONFIG.heroPhoto) {
      const match = photos.find((p) => p.name === CONFIG.heroPhoto || p.src.endsWith(CONFIG.heroPhoto));
      if (match) heroSrc = match.src;
    }
    setHero(heroSrc);
    renderGallery(photos);
  });
})();
