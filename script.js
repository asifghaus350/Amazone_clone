/* ============================================================
   Amazone Clone — interactive features
   1. Live search / category filter for cards and deals
   2. Add to cart with live count and a mini cart panel
   Cart data is saved in localStorage so it survives a refresh.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ---------- Elements ---------- */
    const searchInput = document.querySelector('.search-input');
    const categorySelect = document.querySelector('.search-select');
    const searchButton = document.querySelector('.search-icon');
    const cards = Array.from(document.querySelectorAll('.shop-section .box'));
    const deals = Array.from(document.querySelectorAll('.product-row .deal'));
    const cardsNoResults = document.getElementById('cards-no-results');
    const dealsNoResults = document.getElementById('deals-no-results');

    const CART_KEY = 'amazone_clone_cart';
    const cartToggle = document.querySelector('.nav-cart');
    const cartCountEl = document.querySelector('.cart-count');
    const cartPanel = document.getElementById('cart-panel');
    const cartItemsEl = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const cartClose = document.getElementById('cart-close');
    const cartCheckout = document.getElementById('cart-checkout');

    /* ---------- Small helpers ---------- */
    const norm = (value) => (value || '').toLowerCase().trim();

    const inr = (amount) => '₹' + Number(amount || 0).toLocaleString('en-IN');

    function escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        })[char]);
    }

    function readCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function writeCart(cart) {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (error) {
            /* Storage can be blocked (private mode / file://) — cart still works in memory. */
        }
    }

    function cartQuantity(cart) {
        return Object.values(cart).reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    }

    function cartTotal(cart) {
        return Object.values(cart).reduce(
            (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0),
            0
        );
    }

    /* ============================================================
       1. SEARCH FILTER
       ============================================================ */
    function scrollToResults() {
        const target = document.querySelector('.shop-section');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function applyFilter() {
        const query = norm(searchInput.value);
        const category = norm(categorySelect.value);

        let visibleCards = 0;
        cards.forEach((card) => {
            const matchesText = !query || norm(card.textContent).includes(query);
            const matchesCategory = category === 'all' || norm(card.dataset.category) === category;
            const show = matchesText && matchesCategory;
            card.classList.toggle('hidden', !show);
            if (show) visibleCards++;
        });
        cardsNoResults.hidden = visibleCards > 0;

        let visibleDeals = 0;
        deals.forEach((deal) => {
            const searchable = norm(deal.textContent + ' ' + (deal.dataset.name || ''));
            const matchesText = !query || searchable.includes(query);
            const matchesCategory = category === 'all' || norm(deal.dataset.category) === category;
            const show = matchesText && matchesCategory;
            deal.classList.toggle('hidden', !show);
            if (show) visibleDeals++;
        });
        dealsNoResults.hidden = visibleDeals > 0;
    }

    searchInput.addEventListener('input', applyFilter);
    categorySelect.addEventListener('change', applyFilter);

    searchButton.addEventListener('click', () => {
        applyFilter();
        scrollToResults();
    });

    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            applyFilter();
            scrollToResults();
        }
    });

    /* ============================================================
       2. ADD TO CART + MINI CART
       ============================================================ */
    function renderCart() {
        const cart = readCart();
        const ids = Object.keys(cart);

        cartCountEl.textContent = String(cartQuantity(cart));
        cartTotalEl.textContent = inr(cartTotal(cart));

        if (ids.length === 0) {
            cartItemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
            return;
        }

        cartItemsEl.innerHTML = ids.map((id) => {
            const item = cart[id];
            const name = escapeHtml(item.name || 'Item');
            const qty = Number(item.qty) || 0;
            return `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <strong>${name}</strong>
                        <span>${inr(item.price)} × ${qty}</span>
                    </div>
                    <div class="cart-qty">
                        <button type="button" class="qty-btn" data-action="dec" data-id="${escapeHtml(id)}" aria-label="Decrease quantity">−</button>
                        <span>${qty}</span>
                        <button type="button" class="qty-btn" data-action="inc" data-id="${escapeHtml(id)}" aria-label="Increase quantity">+</button>
                    </div>
                    <button type="button" class="remove-btn" data-action="remove" data-id="${escapeHtml(id)}" aria-label="Remove item">🗑</button>
                </div>`;
        }).join('');
    }

    function flashButton(button) {
        if (!button.dataset.original) button.dataset.original = button.innerHTML;
        button.classList.add('added');
        button.innerHTML = '<i class="fa-solid fa-check"></i> Added';
        clearTimeout(button._flashTimer);
        button._flashTimer = setTimeout(() => {
            button.innerHTML = button.dataset.original;
            button.classList.remove('added');
        }, 1300);
    }

    document.addEventListener('click', (event) => {
        /* Add a deal to the cart */
        const addButton = event.target.closest('.add-to-cart');
        if (addButton) {
            const deal = addButton.closest('.deal');
            if (!deal) return;

            const id = deal.dataset.id;
            const cart = readCart();
            if (cart[id]) {
                cart[id].qty = (Number(cart[id].qty) || 0) + 1;
            } else {
                cart[id] = {
                    name: deal.dataset.name || deal.querySelector('p')?.textContent.trim() || 'Item',
                    price: Number(deal.dataset.price) || 0,
                    qty: 1
                };
            }
            writeCart(cart);
            renderCart();
            flashButton(addButton);
            return;
        }

        /* Quantity / remove controls inside the mini cart */
        const actionButton = event.target.closest('.qty-btn, .remove-btn');
        if (actionButton) {
            const { action, id } = actionButton.dataset;
            const cart = readCart();
            if (!cart[id]) return;

            if (action === 'inc') {
                cart[id].qty = (Number(cart[id].qty) || 0) + 1;
            } else if (action === 'dec') {
                cart[id].qty = (Number(cart[id].qty) || 0) - 1;
                if (cart[id].qty <= 0) delete cart[id];
            } else if (action === 'remove') {
                delete cart[id];
            }

            writeCart(cart);
            renderCart();
            return;
        }

        /* Close the panel when clicking outside of it */
        if (!cartPanel.hidden && !cartToggle.contains(event.target) && !cartPanel.contains(event.target)) {
            cartPanel.hidden = true;
        }
    });

    cartToggle.addEventListener('click', () => {
        const willOpen = cartPanel.hidden;
        cartPanel.hidden = !willOpen;
        if (willOpen) renderCart();
    });

    cartClose.addEventListener('click', () => {
        cartPanel.hidden = true;
    });

    cartCheckout.addEventListener('click', () => {
        const count = cartQuantity(readCart());
        if (count === 0) {
            alert('Your cart is empty. Add a deal first!');
        } else {
            alert(`Checkout is not available in this demo. You have ${count} item(s) in your cart.`);
        }
    });

    /* ============================================================
       3. SIGN IN / CREATE ACCOUNT (localStorage demo)
       NOTE: This is a front-end demo only. Passwords are stored
       as plain text in the browser — never reuse a real password.
       ============================================================ */
    const USERS_KEY = 'amazone_clone_users';
    const SESSION_KEY = 'amazone_clone_session';

    const authOverlay = document.getElementById('auth-overlay');
    const authTitle = document.getElementById('auth-title');
    const authMessage = document.getElementById('auth-message');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const accountMenu = document.getElementById('account-menu');
    const accountDropdown = document.getElementById('account-dropdown');
    const accountGreeting = document.getElementById('account-greeting');
    const accountName = document.getElementById('account-name');
    const accountEmail = document.getElementById('account-email');
    const signinPrompt = document.getElementById('signin-prompt');
    const signinAction = document.getElementById('signin-action');
    const signinSub = document.getElementById('signin-sub');
    const rememberMe = document.getElementById('remember-me');

    function readUsers() {
        try {
            const raw = localStorage.getItem(USERS_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function writeUsers(users) {
        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch (error) {
            /* Storage unavailable — registration cannot be saved. */
        }
    }

    function readSession() {
        try {
            return localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
        } catch (error) {
            return null;
        }
    }

    function writeSession(email, remember) {
        try {
            if (!email) {
                localStorage.removeItem(SESSION_KEY);
                sessionStorage.removeItem(SESSION_KEY);
            } else if (remember) {
                localStorage.setItem(SESSION_KEY, email);
                sessionStorage.removeItem(SESSION_KEY);
            } else {
                sessionStorage.setItem(SESSION_KEY, email);
                localStorage.removeItem(SESSION_KEY);
            }
        } catch (error) {
            /* Storage unavailable — session lasts only until refresh. */
        }
    }

    function currentUser() {
        const email = readSession();
        if (!email) return null;
        return readUsers().find((user) => norm(user.email) === norm(email)) || null;
    }

    function showMessage(text, type) {
        authMessage.textContent = text;
        authMessage.className = 'auth-message ' + (type || 'info');
        authMessage.hidden = !text;
    }

    function setMode(mode) {
        const isLogin = mode !== 'register';
        loginForm.hidden = !isLogin;
        registerForm.hidden = isLogin;
        authTitle.textContent = isLogin ? 'Sign in' : 'Create account';
        document.querySelectorAll('.auth-tab').forEach((tab) => {
            const active = tab.dataset.mode === (isLogin ? 'login' : 'register');
            tab.classList.toggle('active', active);
            tab.setAttribute('aria-selected', String(active));
        });
        showMessage('');
    }

    function openAuth(mode) {
        setMode(mode || 'login');
        authOverlay.hidden = false;
        accountDropdown.hidden = true;
        const firstField = document.getElementById(mode === 'register' ? 'reg-name' : 'login-email');
        if (firstField) firstField.focus();
    }

    function closeAuth() {
        authOverlay.hidden = true;
        showMessage('');
    }

    function updateAccountUI() {
        const user = currentUser();
        if (user) {
            accountGreeting.textContent = 'Hello, ' + user.name.split(' ')[0];
            accountName.textContent = user.name;
            accountEmail.textContent = user.email;
            signinPrompt.textContent = 'Welcome back, ' + user.name + '!';
            signinAction.textContent = 'Sign out';
            signinSub.hidden = true;
        } else {
            accountGreeting.textContent = 'Hello, sign in';
            accountName.textContent = 'Guest';
            accountEmail.textContent = '';
            signinPrompt.textContent = 'See personalized recommendations';
            signinAction.textContent = 'Sign in';
            signinSub.hidden = false;
        }
    }

    /* Open the modal / toggle the account dropdown */
    accountMenu.addEventListener('click', () => {
        if (currentUser()) {
            accountDropdown.hidden = !accountDropdown.hidden;
        } else {
            openAuth('login');
        }
    });

    document.addEventListener('click', (event) => {
        if (!accountDropdown.hidden && !accountMenu.contains(event.target)) {
            accountDropdown.hidden = true;
        }
    });

    document.querySelectorAll('.auth-tab, .auth-link').forEach((control) => {
        control.addEventListener('click', () => setMode(control.dataset.mode));
    });

    document.getElementById('auth-close').addEventListener('click', closeAuth);
    authOverlay.addEventListener('click', (event) => {
        if (event.target === authOverlay) closeAuth();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (!authOverlay.hidden) closeAuth();
        else if (!accountDropdown.hidden) accountDropdown.hidden = true;
    });

    /* Show / hide password */
    document.querySelectorAll('.pw-toggle').forEach((button) => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const reveal = input.type === 'password';
            input.type = reveal ? 'text' : 'password';
            button.innerHTML = '<i class="fa-solid fa-' + (reveal ? 'eye-slash' : 'eye') + '"></i>';
            button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
        });
    });

    /* Create account */
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;

        if (name.length < 2) return showMessage('Please enter your name.', 'error');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage('Enter a valid email address.', 'error');
        if (password.length < 6) return showMessage('Password must be at least 6 characters.', 'error');
        if (password !== confirm) return showMessage('Passwords do not match.', 'error');

        const users = readUsers();
        if (users.some((user) => norm(user.email) === norm(email))) {
            return showMessage('An account with this email already exists. Try signing in.', 'error');
        }

        users.push({ name, email, password });
        writeUsers(users);
        writeSession(email, true);
        registerForm.reset();
        updateAccountUI();
        showMessage('Account created! You are now signed in.', 'success');
        setTimeout(closeAuth, 800);
    });

    /* Sign in */
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) return showMessage('Enter both email and password.', 'error');

        const user = readUsers().find((entry) => norm(entry.email) === norm(email));
        if (!user) return showMessage('No account found. Create one first.', 'error');
        if (user.password !== password) return showMessage('Incorrect password. Try again.', 'error');

        writeSession(user.email, rememberMe.checked);
        loginForm.reset();
        updateAccountUI();
        showMessage('Signed in successfully!', 'success');
        setTimeout(closeAuth, 800);
    });

    /* Sign out + prompt buttons */
    function signOut() {
        writeSession(null);
        accountDropdown.hidden = true;
        updateAccountUI();
    }

    document.getElementById('signout-btn').addEventListener('click', signOut);
    signinAction.addEventListener('click', () => {
        if (currentUser()) signOut();
        else openAuth('login');
    });
    document.getElementById('start-here').addEventListener('click', (event) => {
        event.preventDefault();
        openAuth('register');
    });
    document.getElementById('account-orders').addEventListener('click', () => {
        alert('Your Orders — coming soon in this demo!');
    });
    document.getElementById('account-profile').addEventListener('click', () => {
        const user = currentUser();
        alert(user ? 'Signed in as ' + user.email : 'Please sign in first.');
    });

    /* Restore saved state on page load */
    renderCart();
    updateAccountUI();
});
