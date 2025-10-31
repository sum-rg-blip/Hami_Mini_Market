document.addEventListener("DOMContentLoaded", () => {
  
  const searchInput = document.querySelector(".search input");
  if (searchInput) {
    const cards = Array.from(document.querySelectorAll(".product-card"));
    const text = el => (el?.textContent || "").toLowerCase();

    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      cards.forEach(card => {
        const haystack =
          text(card.querySelector("h3")) + " " + text(card.querySelector("p"));
        card.style.display = haystack.includes(q) ? "" : "none";
      });
    });
  }

  
  const form = document.querySelector(".contact-form");
  if (form) {
    const nameEl = form.querySelector('input[placeholder="Your Name"]');
    const emailEl = form.querySelector('input[placeholder="Your Email"]');
    const msgEl = form.querySelector("textarea");

    const emailOK = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const clearErrors = () => {
      form.querySelectorAll(".error-message").forEach(e => e.remove());
      form.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    };
    const showError = (el, msg) => {
      el.classList.add("invalid");
      const s = document.createElement("small");
      s.className = "error-message";
      s.textContent = msg;
      el.parentElement.appendChild(s);
    };

    form.addEventListener("submit", e => {
      clearErrors();
      let ok = true;
      if (!nameEl.value.trim()) { ok = false; showError(nameEl, "Please enter your name."); }
      if (!emailOK(emailEl.value)) { ok = false; showError(emailEl, "Enter a valid email."); }
      if (!msgEl.value.trim()) { ok = false; showError(msgEl, "Please write a message."); }

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

 
  const toggleBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (toggleBtn && nav) {
    toggleBtn.setAttribute('aria-expanded', 'false');

    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

   
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
});
