/* ============================================================
   KAIROS — script.js
   Mobile menu · header shadow · scroll reveal · stat counters
   · survey bar animation · contact form validation · year
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Mobile navigation ---------- */
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close the menu when a link is tapped
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- 2. Header shadow on scroll ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Reveal-on-scroll animations ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---------- 4. Animated stat counters (51%, 67%, …) ---------- */
  const counters = document.querySelectorAll(".stat__num[data-count]");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && counters.length) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            co.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }

  /* ---------- 5. Grow survey bars when visible ---------- */
  const bars = document.querySelectorAll(".survey__bars .bar");
  if ("IntersectionObserver" in window && bars.length) {
    const bo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.transition = "width 1.1s cubic-bezier(.22,.9,.35,1)";
            entry.target.style.width = entry.target.style.getPropertyValue("--w");
            bo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    bars.forEach((bar) => {
      bar.style.width = "0%";
      bo.observe(bar);
    });
  }

  /* ---------- 6. Contact form (demo validation) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (name.length < 2) {
        status.textContent = "Please enter your name (min. 2 characters).";
        status.className = "form__status err";
        form.name.focus();
        return;
      }
      if (!emailOk) {
        status.textContent = "Please enter a valid email address.";
        status.className = "form__status err";
        form.email.focus();
        return;
      }
      if (message.length < 10) {
        status.textContent = "Please write a message of at least 10 characters.";
        status.className = "form__status err";
        form.message.focus();
        return;
      }

      // Demo endpoint — replace with a real backend or service later.
      status.textContent = "✅ Message sent! The Kairos team will get back to you.";
      status.className = "form__status ok";
      form.reset();
    });
  }

  /* ---------- 7. Footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
