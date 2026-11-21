# 🛒 Amazone Clone

A responsive clone of the **Amazon India homepage**, built with plain **HTML5** and **CSS3**: no frameworks and no build step.

🔗 **Live demo:** https://asifghaus350.github.io/Amazone_clone/

![Desktop preview](screenshots/desktop.png)

---

## ✨ Features

### Header
- Amazon-style dark navbar (`#131921`) with logo and **“Deliver to India”** location
- **Search bar** with category dropdown and orange search button, plus an orange glow on focus
- Language selector, **Account & Lists**, **Returns & Orders**
- **Cart** icon with item count badge
- White hover outline on every nav item, as on the real site

### Sub-navigation
- **☰ All** menu plus quick links: Fresh, miniTV, Sell, Best Sellers, Today's Deals, Mobiles, Prime, Electronics, Fashion, Home & Kitchen…
- “Shop deals in Electronics” highlight on the right

### Homepage body
- **Hero banner** that fades into the page background
- **8 category cards** overlapping the hero:
  Health & Personal Care · Electronics Deals · Furniture · Electronics · Beauty · Pet Care · Toys · Fashion
- **Today's Deals** horizontal scroll row with red discount badges (`Up to 40% off`, `Deal of the Day`, …)
- **Sign-in prompt** with the yellow Amazon button

### Interactive features (JavaScript)
- **Live search** — type in the search box to instantly filter category cards and deals
- **Category dropdown** — narrow results to Electronics, Fashion, Beauty, etc.
- **"No results" hints** shown when nothing matches
- **Add to cart** button on every deal with a live cart count in the navbar
- **Mini cart panel** — review items, change quantities, remove items and see the total
- Cart contents are saved in **localStorage**, so they survive a page refresh

### Sign in / Create account (JavaScript demo)
- **Account & Lists** opens a sign-in modal; after signing in it shows an account dropdown
- **Create account** form with name, email, password and confirm-password validation
- **Sign in** form with error messages and a **Remember me** option (localStorage vs sessionStorage)
- Password show/hide toggle, Escape / backdrop to close
- Sign-out available from the dropdown and the homepage prompt
- ⚠️ Demo only: accounts are saved as plain text in this browser — do **not** use a real password

### Footer
- **Back to top** link with smooth scrolling
- 4 link columns: *Get to Know Us*, *Connect with Us*, *Make Money with Us*, *Let Us Help You*
- Language and country buttons, legal links, copyright

### Responsive design
| Screen width | Category grid | Notes |
|---|---|---|
| > 1100px | 4 columns | Full navbar |
| 800–1100px | 3 columns | Language and Returns hidden |
| 560–800px | 2 columns | Address and deals link hidden |
| < 560px | 1 column | Search moves to its own row |

<p align="center">
  <img src="screenshots/mobile.png" alt="Mobile preview" width="300">
</p>

---

## 🧰 Tech Stack

| Technology | Use |
|---|---|
| HTML5 | Semantic page structure (`header`, `nav`, `main`, `section`, `footer`) |
| CSS3 | Flexbox, CSS Grid, gradients, media queries |
| [Font Awesome 6](https://fontawesome.com/) | Icons (location, search, cart, menu) |
| JavaScript (vanilla) | `script.js` | Search filter, add to cart, live cart count and persistence |

---

## 📁 Project Structure

```
Amazone_clone/
├── index.html          # Page markup
├── style.css           # All styles + responsive breakpoints
├── script.js           # Search filter + cart logic
├── amazon_logo.png     # Logo
├── hero_image.jpg      # Hero banner
├── box1_image.jpg … box8_image.jpg   # Category card images
└── screenshots/        # README previews
```

---

## 🚀 Getting Started

No installation is needed.

```bash
# 1. Clone the repo
git clone https://github.com/asifghaus350/Amazone_clone.git

# 2. Open the folder
cd Amazone_clone

# 3. Open index.html in your browser
start index.html      # Windows
open index.html       # macOS
xdg-open index.html   # Linux
```

**Recommended:** open the folder in VS Code and use the **Live Server** extension (*right-click `index.html` → Open with Live Server*) so the page reloads automatically while you edit.

---

## 🎨 Color Palette

| Color | Hex | Used for |
|---|---|---|
| ![](https://placehold.co/15x15/131921/131921.png) Navbar | `#131921` | Top header |
| ![](https://placehold.co/15x15/232f3e/232f3e.png) Sub-nav | `#232f3e` | Sub navbar, footer |
| ![](https://placehold.co/15x15/37475a/37475a.png) Back to top | `#37475a` | Footer top strip |
| ![](https://placehold.co/15x15/febd69/febd69.png) Search orange | `#febd69` | Search button, focus ring |
| ![](https://placehold.co/15x15/ffd814/ffd814.png) Button yellow | `#ffd814` | Sign-in button |
| ![](https://placehold.co/15x15/007185/007185.png) Link teal | `#007185` | “See more” links |
| ![](https://placehold.co/15x15/cc0c39/cc0c39.png) Deal red | `#cc0c39` | Discount badges |
| ![](https://placehold.co/15x15/e3e6e6/e3e6e6.png) Background | `#e3e6e6` | Page background |

---

## 🗺️ Roadmap

- [x] Responsive homepage UI
- [x] JavaScript: working search filter
- [x] JavaScript: add to cart with live cart count
- [x] Mini cart panel with quantity controls (localStorage)
- [x] Sign in / create account (localStorage demo)
- [ ] Auto-sliding hero carousel
- [ ] Product detail and cart pages
- [ ] Backend (Node.js / Express) with product database and login

---

## 👤 Author

**Asif Ghaus**: [@asifghaus350](https://github.com/asifghaus350)

If you found this useful, consider giving the repo a ⭐!

---

## ⚠️ Disclaimer

This is a **personal learning project** made to practise HTML and CSS. It is **not affiliated with, endorsed by, or connected to Amazon.com, Inc.** “Amazon” and its logo are trademarks of Amazon.com, Inc. or its affiliates. No real products are sold and no user data is collected.
