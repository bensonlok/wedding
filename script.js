/**
 * Benson & Mecki — Wedding Invitation
 * Countdown, scroll reveal, menu, photo carousel, optional RSVP.
 */

const CONFIG = {
  // Day starts: Friday 20 November 2026, 3:00 PM Malaysia time (UTC+8) — Tea Ceremony
  weddingISO: "2026-11-20T15:00:00+08:00",

  // RSVP form posts to Supabase (sensify-tell-us / wedding_rsvp). Benson views replies in the table editor.
  rsvp: {
    enabled: true,
    deadline: "20 October 2026",
    deadlineZh: "2026年10月20日",
    supabaseUrl: "https://aukotwzggfpmepbkglro.supabase.co",
    // Public anon key (insert-only via RLS). Safe to ship in the static invite.
    supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1a290d3pnZ2ZwbWVwYmtnbHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzNjQ4MzgsImV4cCI6MjEwNTk0MDgzOH0.iF8vSE1s4gpQxxBQOytzZJ2o02tfHlaKyL_nc2lbzmM",
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

/* ----- Photo carousel dots (any [data-carousel] followed by .carousel__dots) ----- */
document.querySelectorAll("[data-carousel]").forEach((car) => {
  const dotsWrap = car.nextElementSibling;
  if (!dotsWrap || !dotsWrap.classList.contains("carousel__dots")) return;
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
});

/* ----- RSVP form (hidden unless CONFIG.rsvp.enabled) ----- */
// Bilingual status strings: [English, 简体中文]
const RSVP_TEXT = {
  sendingBtn: ["Sending…", "提交中…"],
  sending: ["Sending your reply…", "正在提交您的回复，请稍候…"],
  ok: ["Thank you! We’ve received your reply.", "衷心感谢！我们已收到您的回复。"],
  noName: ["Please enter your name.", "请填写您的姓名。"],
  noAttendance: ["Please let us know if you can attend.", "请告诉我们您能否出席。"],
  guestCount: ["Please enter a guest number between 0 and 20.", "请填写0至20位的出席人数。"],
  guestSelf: ["Please include yourself in the number of guests attending.", "请将您本人计算在出席人数内。"],
  failed: ["Sorry, your reply didn’t go through. Please try again in a moment.", "抱歉，回复未能送出，请稍后再试。"],
};

/** Fill `el` with an English line and a Chinese line (no innerHTML). */
function setBilingual(el, pair, sep) {
  el.textContent = "";
  if (!pair) return;
  el.append(pair[0]);
  el.append(sep === "br" ? document.createElement("br") : " ");
  const zh = document.createElement("span");
  zh.lang = "zh-Hans";
  zh.textContent = pair[1];
  el.append(zh);
}

(function initRsvp() {
  const cfg = CONFIG.rsvp || {};
  const section = document.getElementById("rsvp");
  if (!section || !cfg.enabled) return;

  // The deadline is hardcoded in index.html (so it never shows blank without JS,
  // in reader mode or in link previews); CONFIG only overrides it if set.
  if (cfg.deadline) {
    section.querySelectorAll("[data-rsvp-deadline]").forEach((el) => {
      const strong = el.querySelector("strong");
      const isZh = strong && strong.dataset.deadline === "zh";
      const text = isZh ? cfg.deadlineZh : cfg.deadline;
      if (!strong || !text) return;
      strong.textContent = text;
      el.hidden = false;
    });
  }
  section.hidden = false;

  const form = document.getElementById("rsvpForm");
  const status = document.getElementById("rsvpStatus");
  const submitBtn = document.getElementById("rsvpSubmit");
  if (!form || !cfg.supabaseUrl || !cfg.supabaseAnonKey) return;

  // "Not attending" → guest count is set to 0 automatically (and restored if they change their mind).
  const guestInput = form.querySelector('[name="guest_count"]');
  const guestHintNo = document.getElementById("guestHintNo");
  let lastGuests = guestInput ? guestInput.value : "1";
  function syncGuests() {
    if (!guestInput) return;
    const choice = form.querySelector('[name="attendance"]:checked');
    const notComing = !!choice && choice.value === "no";
    if (guestHintNo) guestHintNo.hidden = !notComing;
    if (notComing) {
      if (!guestInput.readOnly && guestInput.value !== "0") lastGuests = guestInput.value;
      guestInput.value = "0";
      guestInput.readOnly = true;
    } else {
      if (guestInput.readOnly || guestInput.value === "0" || guestInput.value === "") {
        guestInput.value = lastGuests && lastGuests !== "0" ? lastGuests : "1";
      }
      guestInput.readOnly = false;
    }
  }
  form.querySelectorAll('[name="attendance"]').forEach((r) => r.addEventListener("change", syncGuests));

  function setStatus(msg, kind) {
    if (!status) return;
    status.hidden = !msg;
    setBilingual(status, msg, "br");
    status.classList.remove("is-ok", "is-err");
    if (kind) status.classList.add(kind);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus(null);

    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const attendance = String(fd.get("attendance") || "").trim();
    const guestRaw = String(fd.get("guest_count") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const guest_count = attendance === "no" ? 0 : Number.parseInt(guestRaw, 10);

    if (!name) {
      setStatus(RSVP_TEXT.noName, "is-err");
      return;
    }
    if (!["yes", "no", "maybe"].includes(attendance)) {
      setStatus(RSVP_TEXT.noAttendance, "is-err");
      return;
    }
    if (!Number.isFinite(guest_count) || guest_count < 0 || guest_count > 20) {
      setStatus(RSVP_TEXT.guestCount, "is-err");
      return;
    }
    if (attendance === "yes" && guest_count < 1) {
      setStatus(RSVP_TEXT.guestSelf, "is-err");
      return;
    }

    const payload = {
      name,
      attendance,
      guest_count,
      phone: phone || null,
      message: message || null,
      user_agent: navigator.userAgent.slice(0, 240),
      source_url: location.href.slice(0, 500),
    };

    submitBtn.disabled = true;
    const prevLabel = Array.from(submitBtn.childNodes).map((n) => n.cloneNode(true));
    setBilingual(submitBtn, RSVP_TEXT.sendingBtn);
    setStatus(RSVP_TEXT.sending);

    try {
      const res = await fetch(`${cfg.supabaseUrl}/rest/v1/wedding_rsvp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: cfg.supabaseAnonKey,
          Authorization: `Bearer ${cfg.supabaseAnonKey}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `HTTP ${res.status}`);
      }
      form.reset();
      lastGuests = "1";
      if (guestInput) { guestInput.readOnly = false; guestInput.value = "1"; }
      if (guestHintNo) guestHintNo.hidden = true;
      setStatus(RSVP_TEXT.ok, "is-ok");
    } catch (err) {
      console.error(err);
      setStatus(RSVP_TEXT.failed, "is-err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.replaceChildren(...prevLabel);
    }
  });
})();
