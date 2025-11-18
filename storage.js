
(function () {
  const STORAGE_KEY = "hami_cart";

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }

  function clearCart() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Failed to clear cart from localStorage", e);
    }
  }

  window.StorageModule = {
    STORAGE_KEY,
    loadCart,
    saveCart,
    clearCart,
  };
})();
