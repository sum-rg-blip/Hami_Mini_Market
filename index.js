

document.addEventListener("DOMContentLoaded", () => {
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $ = (sel, root = document) => root.querySelector(sel);

  
  const toggleBtn = $(".menu-toggle");
  const nav = $(".nav");

  if (toggleBtn && nav) {
    toggleBtn.setAttribute("aria-expanded", "false");

    toggleBtn.addEventListener("click", () => {
      nav.classList.toggle("open");
      const isOpen = nav.classList.contains("open");
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
    });

    $$("a", nav).forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

 
  const form = $(".contact-form");
  if (form) {
    const nameEl = form.querySelector('input[placeholder="Your Name"]');
    const emailEl = form.querySelector('input[placeholder="Your Email"]');
    const msgEl = form.querySelector("textarea");

    const emailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

    const clearErrors = () => {
      $$(".error-message", form).forEach((e) => e.remove());
      $$(".invalid", form).forEach((el) => el.classList.remove("invalid"));
    };

    const showError = (el, msg) => {
      el.classList.add("invalid");
      const s = document.createElement("small");
      s.className = "error-message";
      s.textContent = msg;
      el.parentElement.appendChild(s);
    };

    form.addEventListener("submit", (e) => {
      clearErrors();
      let ok = true;

      if (!nameEl.value.trim()) {
        ok = false;
        showError(nameEl, "Please enter your name.");
      }
      if (!emailOK(emailEl.value)) {
        ok = false;
        showError(emailEl, "Enter a valid email.");
      }
      if (!msgEl.value.trim()) {
        ok = false;
        showError(msgEl, "Please write a message.");
      }

      if (!ok) {
        e.preventDefault();
        (form.querySelector(".invalid") || nameEl).focus();
        return;
      }

      e.preventDefault();
      form.reset();
      alert("Thanks! Your message has been sent.");
    });
  }
});
