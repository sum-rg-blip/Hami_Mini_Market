
(function (Storage) {
  let cart = Storage.loadCart();

  function findIndex(id) {
    return cart.findIndex((item) => item.id === id);
  }

  function getTotals(taxRate = 0.05, discountThreshold = 50, discountRate = 0.1) {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const discount = subtotal > discountThreshold ? subtotal * discountRate : 0;
    const taxable = subtotal - discount;
    const tax = taxable * taxRate;
    const total = taxable + tax;

    return {
      subtotal,
      discount,
      tax,
      total,
    };
  }

  function updateCartBadge() {
    const el = document.getElementById("cart-count");
    if (!el) return;
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    el.textContent = count;
  }

  function showToast(message) {
    let toast = document.getElementById("cart-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "cart-toast";
      toast.className = "cart-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("cart-toast-visible");
    setTimeout(() => {
      toast.classList.remove("cart-toast-visible");
    }, 1500);
  }

  function renderCartSidebar() {
    const container = document.getElementById("cart-items");
    const subtotalEl = document.getElementById("cart-subtotal");
    const discountEl = document.getElementById("cart-discount");
    const taxEl = document.getElementById("cart-tax");
    const totalEl = document.getElementById("cart-total");

    if (!container) return;

    container.innerHTML = "";

    if (!cart.length) {
      container.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
      if (subtotalEl) subtotalEl.textContent = "$0.00";
      if (discountEl) discountEl.textContent = "-$0.00";
      if (taxEl) taxEl.textContent = "$0.00";
      if (totalEl) totalEl.textContent = "$0.00";
      return;
    }

    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";

      row.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${item.name}</span>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
        </div>
        <div class="cart-item-actions">
          <input
            type="number"
            min="1"
            value="${item.qty}"
            class="cart-qty-input"
            data-cart-id="${item.id}"
          />
          <button class="cart-remove-btn" data-cart-id="${item.id}">Remove</button>
        </div>
      `;

      container.appendChild(row);
    });

    // bind qty change + remove
    container.querySelectorAll(".cart-qty-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const id = e.target.getAttribute("data-cart-id");
        const qty = e.target.value;
        updateQty(id, qty);
      });
    });

    container.querySelectorAll(".cart-remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-cart-id");
        removeItem(id);
      });
    });

    const totals = getTotals();

    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (discountEl) {
      discountEl.textContent = totals.discount
        ? `-$${totals.discount.toFixed(2)}`
        : "-$0.00";
    }
    if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
  }

  function persist() {
    Storage.saveCart(cart);
    updateCartBadge();
    renderCartSidebar();
  }

  function addItem(product, qty = 1) {
    const index = findIndex(product.id);
    const amount = Number(qty) || 1;
    const price = Number(product.price) || 0;

    if (index === -1) {
      cart.push({
        id: product.id,
        name: product.name,
        price,
        image: product.image || "",
        qty: amount,
      });
    } else {
      cart[index].qty += amount;
    }
    persist();
    showToast(`${product.name} added to cart`);
  }

  function updateQty(id, qty) {
    const amount = Number(qty) || 0;
    const index = findIndex(id);
    if (index === -1) return;
    if (amount <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].qty = amount;
    }
    persist();
  }

  function removeItem(id) {
    const index = findIndex(id);
    if (index === -1) return;
    cart.splice(index, 1);
    persist();
  }

  function getItems() {
    return cart.slice();
  }

  function initSidebarToggle() {
    const toggle = document.querySelector(".cart-btn");
    const sidebar = document.getElementById("cart-sidebar");
    const overlay = document.getElementById("cart-overlay");
    const closeBtn = document.getElementById("cart-close");

    if (!toggle || !sidebar) return;

    function open() {
      sidebar.classList.add("cart-open");
      overlay && overlay.classList.add("cart-overlay-visible");
    }

    function close() {
      sidebar.classList.remove("cart-open");
      overlay && overlay.classList.remove("cart-overlay-visible");
    }

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      open();
    });

    overlay && overlay.addEventListener("click", close);
    closeBtn && closeBtn.addEventListener("click", close);
  }

  function init() {
    updateCartBadge();
    renderCartSidebar();
    initSidebarToggle();
  }

  document.addEventListener("DOMContentLoaded", init);

  window.CartModule = {
    addItem,
    updateQty,
    removeItem,
    getItems,
    getTotals,
    init,
  };
})(window.StorageModule);
