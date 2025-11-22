

(function (Cart) {
  let allProducts = [];
  let filteredProducts = [];

  const grid = document.querySelector(".product-grid");
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-filter");
  const priceRange = document.getElementById("price-filter");
  const priceValue = document.getElementById("price-value");
  const emptyState = document.getElementById("empty-state");

  async function loadProducts() {
    if (!grid) return;

    try {
      const res = await fetch("data/product.json");
      if (!res.ok) throw new Error("Failed to load products.json");
      const data = await res.json();
      allProducts = Array.isArray(data) ? data : [];
      filteredProducts = [...allProducts];

      
      const maxPrice =
        allProducts.reduce((max, p) => Math.max(max, Number(p.price) || 0), 0) ||
        10;
      if (priceRange) {
        priceRange.max = Math.ceil(maxPrice + 0.5);
        priceRange.value = priceRange.max;
      }
      if (priceValue && priceRange) {
        priceValue.textContent = `$${Number(priceRange.value).toFixed(2)}`;
      }

      renderProducts();
      initFilterEvents();
    } catch (err) {
      console.error(err);
      grid.innerHTML =
        '<p class="empty">Failed to load products. Please refresh the page.</p>';
    }
  }

  function renderProducts() {
    if (!grid) return;

    grid.innerHTML = "";

    if (!filteredProducts.length) {
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;

    filteredProducts.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.productId = product.id;
      card.dataset.productName = product.name;
      card.dataset.productPrice = product.price;
      card.dataset.productImage = product.image;

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${Number(product.price).toFixed(2)}</p>
        <button type="button" class="add-to-cart-btn">Add to Cart</button>
      `;

      grid.appendChild(card);
    });

    bindAddToCartButtons();
  }

  function bindAddToCartButtons() {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card) => {
      const btn = card.querySelector(".add-to-cart-btn");
      if (!btn) return;

      btn.addEventListener("click", () => {
        const { productId, productName, productPrice, productImage } =
          card.dataset;

        const product = {
          id: productId,
          name: productName,
          price: parseFloat(productPrice || "0"),
          image: productImage || "",
        };

        Cart.addItem(product, 1);
      });
    });
  }

  function applyFilters() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const selectedCategory = categorySelect?.value || "all";
    const maxPrice = parseFloat(priceRange?.value || "9999");

    filteredProducts = allProducts.filter((p) => {
      const nameMatch =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);

      const categoryMatch =
        selectedCategory === "all"
          ? true
          : p.category.toLowerCase() === selectedCategory.toLowerCase();

      const priceMatch = Number(p.price) <= maxPrice;

      return nameMatch && categoryMatch && priceMatch;
    });

    renderProducts();
  }

  function initFilterEvents() {
    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
    if (categorySelect) {
      categorySelect.addEventListener("change", applyFilters);
    }
    if (priceRange) {
      priceRange.addEventListener("input", () => {
        if (priceValue) {
          priceValue.textContent = `$${Number(priceRange.value).toFixed(2)}`;
        }
        applyFilters();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", loadProducts);

  window.ProductModule = {
    reload: loadProducts,
  };
})(window.CartModule);
