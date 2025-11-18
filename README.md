# Hami MiniMarket 🥕🥭

Hami MiniMarket is a simple responsive website built with **HTML, CSS, and JavaScript**.  
It showcases a local organic food shop offering fresh fruits and vegetables, with a **modular shopping cart system** that uses `localStorage` to persist items in the browser.

---

## 🌟 Features

### UI & Layout
- Responsive design for mobile, tablet, and desktop
- Hero section with tagline and **“Shop Now”** call-to-action
- Product showcase grid for fresh fruits and vegetables
- About Us section describing the shop
- Contact form with **JavaScript validation**
- Footer with contact information and social media links

### Product Browsing
- Live product search (filters products as you type)
- Category filter (Fruits / Vegetables)
- Price range filter (slider for max price)
- “No products match your filters” empty state

### Shopping Cart System (Modular)
- **Add to Cart** buttons on each product
- Cart stored in the browser using `localStorage`
- Cart item details:
  - Product name
  - Quantity
  - Price
- Cart sidebar with:
  - List of items
  - Update quantity input
  - **Remove** item button
- Cart counter in the header showing total quantity
- Automatic cart restore on page refresh

### Order Summary Page
- Dedicated `order-summary.html` page
- Shows all items with:
  - Name
  - Unit price
  - Quantity
  - Line total
- Summary section with:
  - Subtotal
  - Discount (10% off if subtotal > $50)
  - Tax (5%)
  - Final total
- **Confirm Order** button (front-end only, no backend yet)

### Bonus UX Features
- Toast notification when an item is added to the cart
- Animated cart sidebar (slide-in / slide-out)
- Discount logic:
  - If subtotal > **$50**, automatically apply **10% discount**

---

## 🛠️ Technologies Used

- **HTML5**
- **CSS3** (Flexbox and Grid)
- **JavaScript (Vanilla JS)**
  - Modular structure:
    - `storage.js` – localStorage handling
    - `cart.js` – cart logic and sidebar UI
    - `product.js` – hooks products to cart
    - `index.js` – navigation, contact form, filters
- **Font Awesome** icons (for UI icons)

---

