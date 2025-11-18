
(function (Cart) {
  function initProducts() {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card) => {
      const btn = card.querySelector(".add-to-cart-btn");
      if (!btn) return;

      btn.addEventListener("click", () => {
        const { productId, productName, productPrice, productImage } = card.dataset;
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

  document.addEventListener("DOMContentLoaded", initProducts);

  window.ProductModule = {
    init: initProducts,
  };
})(window.CartModule);
