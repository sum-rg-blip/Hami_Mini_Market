document.addEventListener("DOMContentLoaded", () => {
  
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const $  = (sel, root = document) => root.querySelector(sel);
  const text = el => (el?.textContent || "").toLowerCase();

  const toggleBtn = $('.menu-toggle');
  const nav = $('.nav');

  if (toggleBtn && nav) {
    toggleBtn.setAttribute('aria-expanded', 'false');

    toggleBtn.addEventListener('click', () => {
      nav.classList.toggle('open');
      const isOpen = nav.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    $$('a', nav).forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  const form = $(".contact-form");
  if (form) {
    const nameEl = form.querySelector('input[placeholder="Your Name"]');
    const emailEl = form.querySelector('input[placeholder="Your Email"]');
    const msgEl = form.querySelector("textarea");

    const emailOK = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const clearErrors = () => {
      $$(".error-message", form).forEach(e => e.remove());
      $$(".invalid", form).forEach(el => el.classList.remove("invalid"));
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

 
  const cards = $$(".product-card");
  const searchInput    = $("#search-input");
  const categorySelect = $("#category-filter");
  const priceRange     = $("#price-filter");
  const priceValue     = $("#price-value");
  const emptyState     = $("#empty-state");

  
  const parsePrice = (str) => {
    const m = (str || "").match(/(\d+(\.\d+)?)/);
    return m ? parseFloat(m[1]) : 0;
  };

  
  const FRUITS = new Set([
    "apple","banana","orange","grapes","grape","mango","watermelon","pineapple","strawberry"
  ]);
  const inferCategory = (name) => FRUITS.has(name.toLowerCase()) ? "Fruits" : "Vegetables";

  // extract meta from DOM once
  const meta = cards.map(card => {
    const name = (card.querySelector("h3")?.textContent || "").trim().toLowerCase();
    const priceText = card.querySelector("p")?.textContent || "";
    const price = parsePrice(priceText);
    const category = inferCategory(name);
    return { card, name, price, category };
  });


  const maxPrice = meta.reduce((m, x) => Math.max(m, x.price), 0) || 10;
  if (priceRange) {
    priceRange.max = Math.ceil(maxPrice + 0.5);
    priceRange.value = priceRange.max;
    if (priceValue) priceValue.textContent = `$${Number(priceRange.value).toFixed(2)}`;
  }

  function applyFilters() {
    const q   = (searchInput?.value || "").trim().toLowerCase();
    const cat = categorySelect?.value || "all";
    const maxP= parseFloat(priceRange?.value || (maxPrice || 9999));

    let shown = 0;
    meta.forEach(m => {
      const nameMatch  = m.name.includes(q);
      const catMatch   = cat === "all" ? true : m.category === cat;
      const priceMatch = m.price <= maxP;
      const show = nameMatch && catMatch && priceMatch;
      m.card.style.display = show ? "" : "none";
      if (show) shown++;
    });

    if (emptyState) emptyState.hidden = shown !== 0;
  }

  if (searchInput)    searchInput.addEventListener("input",  applyFilters);
  if (categorySelect) categorySelect.addEventListener("change", applyFilters);
  if (priceRange)     priceRange.addEventListener("input",  () => {
    if (priceValue) priceValue.textContent = `$${Number(priceRange.value).toFixed(2)}`;
    applyFilters();
  });

  applyFilters();

 
  const cartCountEl = $("#cart-count");
  const getCart = () => {
    try { return JSON.parse(localStorage.getItem("hami_cart") || "[]"); }
    catch { return []; }
  };
  const setCart = (items) => localStorage.setItem("hami_cart", JSON.stringify(items));
  const syncCartCount = () => {
    const items = getCart();
    const count = items.reduce((s, it) => s + (it.qty || 0), 0);
    if (cartCountEl) cartCountEl.textContent = String(count);
  };
  const addToCart = (name) => {
    const items = getCart();
    const found = items.find(i => i.name === name);
    if (found) found.qty += 1;
    else items.push({ name, qty: 1 });
    setCart(items);
    syncCartCount();
  };

  
  cards.forEach(card => {
    const btn  = card.querySelector("button");
    const name = (card.querySelector("h3")?.textContent || "Item").trim();
    if (btn) btn.addEventListener("click", () => addToCart(name));
  });
  
localStorage.removeItem("hami_cart"); 


  syncCartCount();
});
