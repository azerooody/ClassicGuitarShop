function getCart() {
    try {
        const data = JSON.parse(localStorage.getItem('cart'));
        if (Array.isArray(data)) return data;
    } catch (e) {}
    return [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartZnachok();
}

function addToCart(productId) {
    const cart = getCart();
    for (const item of cart) {
        if (item.id === productId) {
            item.qty++;
            saveCart(cart);
            return;
        }
    }
    cart.push({ id: productId, qty: 1 });
    saveCart(cart);
}

function removeFromCart(productId) {
    const newCart = [];
    for (const item of getCart()) {
        if (item.id !== productId) {
            newCart.push(item);
        }
    }
    saveCart(newCart);
}

function updateQty(productId, delta) {
    const cart = getCart();
    for (const item of cart) {
        if (item.id === productId) {
            item.qty += delta;
            if (item.qty < 1) item.qty = 1;
            saveCart(cart);
            return;
        }
    }
}

function updateCartZnachok() {
    let count = 0;
    for (const item of getCart()) count += item.qty;
    for (const link of document.querySelectorAll('.header_cart')) {
        let znachok = link.querySelector('.cart-znachok');
        if (count > 0) {
            if (!znachok) {
                znachok = document.createElement('span');
                znachok.className = 'cart-znachok';
                link.appendChild(znachok);
            }
            znachok.textContent = count;
        } else if (znachok) {
            znachok.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    const products = [
        { id: 1, name: 'Alhambra Classical Concert 8P', type: 'Классическая гитара 4/4', price: 261100, img: 'images/AlhambraClassicalConcert8P.jpg', popular: true, brand: 'Alhambra', size: '4/4' },
        { id: 2, name: 'Alhambra Classica Student 2C', type: 'Классическая гитара 4/4', price: 77700, img: 'images/AlhambraClassicaStudent2C.jpg', popular: true, brand: 'Alhambra', size: '4/4' },
        { id: 3, name: 'Manuel Rodriguez E-57 Ecologia', type: 'Классическая гитара 3/4', price: 44000, img: 'images/ManuelRodriguezE-57Ecologia.jpg', popular: true, brand: 'Manuel Rodriguez', size: '3/4' },
        { id: 4, name: 'Esteve 12 SP', type: 'Классическая гитара 4/4', price: 371900, img: 'images/Esteve12SP.jpg', popular: true, brand: 'Esteve', size: '4/4' },
        { id: 5, name: 'Manuel Rodriguez A-S Superior', type: 'Классическая гитара 4/4', price: 92000, img: 'images/ManuelRodriguezA-SSuperior.jpg', brand: 'Manuel Rodriguez', size: '4/4' },
        { id: 6, name: 'LTD TL-6N Thinline Natural', type: 'Классическая гитара 4/4', price: 70000, img: 'images/LTDTL-6NThinlineNatural.jpg', brand: 'LTD', size: '4/4' },
        { id: 7, name: 'Prudencio Saez Cutaway Stage', type: 'Классическая гитара 4/4', price: 172900, img: 'images/PrudencioSaezCutawayStage.jpg', brand: 'Prudencio Saez', size: '4/4' }
    ];

    function formatPrice(num) {
        let s = '';
        const str = Math.round(num).toString();
        const len = str.length;
        for (let i = 0; i < len; i++) {
            if (i > 0 && (len - i) % 3 === 0) s += ' ';
            s += str[i];
        }
        return s + ' руб.';
    }

    function maskPhone(val) {
        let d = '';
        for (const ch of val) {
            if (ch >= '0' && ch <= '9') d += ch;
        }
        if (d.charAt(0) === '8' || d.charAt(0) === '7') d = d.slice(1);
        d = d.slice(0, 10);
        if (!d) return '';
        let r = '+7 (' + d.slice(0, 3);
        if (d.length >= 4) r += ') ' + d.slice(3, 6);
        if (d.length >= 7) r += '-' + d.slice(6, 8);
        if (d.length >= 9) r += '-' + d.slice(8, 10);
        return r;
    }

    function checkField(el) {
        if (!el) return true;
        el.classList.remove('error', 'valid');
        const v = el.value.trim();
        if (el.hasAttribute('required') && !v) { el.classList.add('error'); return false; }
        if (v) {
            if (el.type === 'email' && (!v.includes('@') || !v.includes('.'))) {
                el.classList.add('error'); return false;
            }
            if (el.id === 'phone' || el.id === 'orderPhone') {
                let dc = 0;
                for (const ch of v) {
                    if (ch >= '0' && ch <= '9') dc++;
                }
                if (dc < 11) { el.classList.add('error'); return false; }
            }
            if ((el.id === 'name' || el.id === 'orderName') && v.length < 2) {
                el.classList.add('error'); return false;
            }
        }
        if (v) el.classList.add('valid');
        return true;
    }

    function renderProductCards(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        for (const p of items) {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-card_image"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
                <div class="product-card_content">
                    <div class="product-card_name">${p.name}</div>
                    <div class="product-card_type">${p.type}</div>
                    <div class="product-card_price">${formatPrice(p.price)}</div>
                </div>
                <button class="product-card_btn">В корзину</button>
            `;
            const btn = card.querySelector('.product-card_btn');
            btn.onclick = function () {
                addToCart(p.id);
                btn.textContent = '✓ Добавлено';
                btn.classList.add('added');
                setTimeout(function () {
                    btn.textContent = 'В корзину';
                    btn.classList.remove('added');
                }, 1500);
            };
            container.appendChild(card);
        }
    }

    const popularItems = products.filter(p => p.popular);
    renderProductCards('popularProducts', popularItems);

    const catalogContainer = document.getElementById('catalogProducts');
    const countEl = document.querySelector('.catalog_count');
    const sortSelect = document.querySelector('.catalog_select');
    const applyBtn = document.querySelector('.filters_actions .btn-accent');
    const resetBtn = document.querySelector('.filters_actions .btn-ghost');
    const priceFrom = document.querySelector('.filter_price-inputs .filter_input:first-child');
    const priceTo = document.querySelector('.filter_price-inputs .filter_input:last-child');
    const sizeChecks = document.querySelectorAll('.filter_options input[name="size"]');
    const brandChecks = document.querySelectorAll('.filter_options input[name="brand"]');

    if (catalogContainer) {

        function renderCatalog() {
            const sizes = [], brands = [];
            let priceMin = 0, priceMax = Infinity;

            for (const cb of sizeChecks) {
                if (cb.checked) sizes.push(cb.value);
            }
            for (const cb of brandChecks) {
                if (cb.checked) brands.push(cb.value);
            }

            const fromVal = priceFrom ? parseFloat(priceFrom.value) : NaN;
            const toVal = priceTo ? parseFloat(priceTo.value) : NaN;
            if (!isNaN(fromVal) && fromVal > 0) priceMin = fromVal;
            if (!isNaN(toVal) && toVal > 0) priceMax = toVal;

            const filtered = products.filter(p => {
                if (sizes.length > 0 && !sizes.includes(p.size)) return false;
                if (brands.length > 0 && !brands.includes(p.brand)) return false;
                if (p.price < priceMin || p.price > priceMax) return false;
                return true;
            });

            const sortVal = sortSelect ? sortSelect.value : 'popular';
            const sorted = filtered.slice();
            if (sortVal === 'price-asc') sorted.sort((a, b) => a.price - b.price);
            else if (sortVal === 'price-desc') sorted.sort((a, b) => b.price - a.price);
            else sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));

            renderProductCards('catalogProducts', sorted);
            if (countEl) {
                const l = sorted.length;
                let word = 'товаров';
                if (l % 10 === 1 && l % 100 !== 11) word = 'товар';
                else if (l % 10 >= 2 && l % 10 <= 4 && (l % 100 < 10 || l % 100 >= 20)) word = 'товара';
                countEl.textContent = `Сортировать ${l} ${word}`;
            }
        }

        function resetFilters() {
            for (const cb of sizeChecks) cb.checked = false;
            for (const cb of brandChecks) cb.checked = false;
            if (priceFrom) priceFrom.value = '';
            if (priceTo) priceTo.value = '';
            if (sortSelect) sortSelect.value = 'popular';
            renderCatalog();
        }

        if (applyBtn) applyBtn.addEventListener('click', renderCatalog);
        if (resetBtn) resetBtn.addEventListener('click', resetFilters);
        if (sortSelect) sortSelect.addEventListener('change', renderCatalog);
        renderCatalog();
    }

    const burger = document.getElementById('burgerBtn');
    const nav = document.getElementById('mainNav');
    if (burger && nav) {
        burger.addEventListener('click', function () {
            nav.classList.toggle('open');
            burger.classList.toggle('open');
            const expanded = nav.classList.contains('open');
            burger.setAttribute('aria-expanded', expanded);
        });
    }

    const cartBody = document.getElementById('cartItems');
    if (cartBody) {
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');
        const cartCountEl = document.getElementById('cartCount');
        const cartHeader = document.getElementById('cartHeader');

        function renderCart() {
            const cart = getCart();
            cartBody.innerHTML = '';
            let subtotal = 0;
            let itemCount = 0;

            for (const item of cart) {
                const pr = products.find(p => p.id === item.id);
                if (!pr) continue;
                const total = pr.price * item.qty;
                subtotal += total;
                itemCount += item.qty;

                const el = document.createElement('div');
                el.className = 'cart-item';
                el.dataset.id = item.id;
                el.dataset.price = pr.price;
                el.innerHTML = `
                    <div class="cart-item_image" style="background:#D9D9D9;border-radius:10px;overflow:hidden">
                        <img src="${pr.img}" style="width:100%;height:100%;object-fit:cover" alt="${pr.name}">
                    </div>
                    <div class="cart-item_info">
                        <h3 class="cart-item_name">${pr.name}</h3>
                        <p class="cart-item_desc">${pr.type}</p>
                        <button class="cart-item_remove">Удалить</button>
                    </div>
                    <div class="cart-item_price">${formatPrice(pr.price)}</div>
                    <div class="cart-item_qty">
                        <button class="cart-item_qty-btn" data-dir="minus">−</button>
                        <span class="cart-item_qty-val">${item.qty}</span>
                        <button class="cart-item_qty-btn" data-dir="plus">+</button>
                    </div>
                    <div class="cart-item_total">${formatPrice(total)}</div>
                `;
                cartBody.appendChild(el);
            }

            const delivery = subtotal > 0 ? 1500 : 0;
            const totalCost = subtotal + delivery;
            if (cartCountEl) cartCountEl.textContent = itemCount;
            if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
            if (totalEl) totalEl.textContent = formatPrice(totalCost);
            if (cartHeader) cartHeader.style.display = cart.length === 0 ? 'none' : '';

            if (cart.length === 0) {
                cartBody.innerHTML = '<div style="text-align:center;padding:60px 0;font-size:24px;color:#999">Корзина пуста</div>';
            }
        }

        cartBody.addEventListener('click', function (e) {
            const btn = e.target.closest('.cart-item_qty-btn');
            if (btn) {
                const id = parseInt(btn.closest('.cart-item').dataset.id);
                if (btn.dataset.dir === 'plus') updateQty(id, 1);
                else if (btn.dataset.dir === 'minus') updateQty(id, -1);
                renderCart();
                return;
            }
            const del = e.target.closest('.cart-item_remove');
            if (del) {
                removeFromCart(parseInt(del.closest('.cart-item').dataset.id));
                renderCart();
            }
        });

        renderCart();
    }

    const searchBtns = document.querySelectorAll('.header_search');
    if (searchBtns.length) {
        const overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.id = 'searchOverlay';
        overlay.innerHTML = `
            <div class="search-overlay_box">
                <input class="search-overlay_input" id="searchInput" type="text" placeholder="Поиск гитар..." autocomplete="off">
                <button class="search-overlay_close" id="searchClose" aria-label="Закрыть">✕</button>
            </div>
            <div class="search-overlay_results" id="searchResults"></div>
        `;
        document.body.appendChild(overlay);

        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');
        const searchClose = document.getElementById('searchClose');

        function openSearch() {
            overlay.classList.add('open');
            setTimeout(function () { searchInput.focus(); }, 100);
            document.body.style.overflow = 'hidden';
        }

        function closeSearch() {
            overlay.classList.remove('open');
            document.body.style.overflow = '';
            searchInput.value = '';
            searchResults.innerHTML = '';
        }

        for (const btn of searchBtns) btn.onclick = openSearch;
        searchClose.onclick = closeSearch;
        overlay.onclick = function (e) { if (e.target === overlay) closeSearch(); };

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
        });

        searchInput.addEventListener('input', function () {
            const q = this.value.trim().toLowerCase();
            if (!q) { searchResults.innerHTML = '<div class="search-overlay_empty">Начните вводить название гитары</div>'; return; }

            const matches = products.filter(p =>
                p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)
            );

            if (matches.length === 0) {
                searchResults.innerHTML = '<div class="search-overlay_empty">Ничего не найдено</div>';
                return;
            }

            let html = '';
            for (const p of matches) {
                html += `
                    <div class="search-overlay_result" data-id="${p.id}">
                        <img class="search-overlay_result-img" src="${p.img}" alt="${p.name}" loading="lazy">
                        <div class="search-overlay_result-info">
                            <div class="search-overlay_result-name">${p.name}</div>
                            <div class="search-overlay_result-type">${p.type}</div>
                        </div>
                        <div class="search-overlay_result-price">${formatPrice(p.price)}</div>
                    </div>
                `;
            }
            searchResults.innerHTML = html;
        });

        searchResults.addEventListener('click', function (e) {
            const res = e.target.closest('.search-overlay_result');
            if (res) { closeSearch(); window.location.href = 'catalog.html'; }
        });
    }

    const filtersToggle = document.getElementById('filtersToggle');
    const filtersSidebar = document.getElementById('filtersSidebar');
    const filtersClose = document.getElementById('filtersClose');
    if (filtersToggle && filtersSidebar) {
        filtersToggle.addEventListener('click', function () {
            filtersSidebar.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
        if (filtersClose) filtersClose.addEventListener('click', function () { closeFilters(); });
        filtersSidebar.addEventListener('click', function (e) { if (e.target === filtersSidebar) closeFilters(); });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && filtersSidebar.classList.contains('open')) closeFilters();
        });
        function closeFilters() {
            filtersSidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const inputs = {
            name: contactForm.querySelector('#name'),
            phone: contactForm.querySelector('#phone'),
            email: contactForm.querySelector('#email'),
            message: contactForm.querySelector('#message')
        };
        const submitBtn = contactForm.querySelector('.btn-wide');

        if (inputs.phone) {
            inputs.phone.addEventListener('input', function () { this.value = maskPhone(this.value); });
            inputs.phone.addEventListener('focus', function () {
                if (!this.value) this.value = '+7 (';
                this.setSelectionRange(this.value.length, this.value.length);
            });
        }

        const fieldIds = ['name', 'phone', 'email', 'message'];
        for (const id of fieldIds) {
            const el = inputs[id];
            if (!el) continue;
            const errSpan = document.createElement('div');
            errSpan.className = 'contact-form_error';
            el.parentElement.appendChild(errSpan);

            el.addEventListener('blur', function () { checkField(this); });
            el.addEventListener('input', function () {
                this.classList.remove('error');
                const err = this.parentElement.querySelector('.contact-form_error');
                if (err) err.textContent = '';
                if (this.value.trim()) {
                    if (this.classList.contains('valid')) checkField(this);
                } else {
                    this.classList.remove('valid');
                }
            });
        }

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;
            for (const id of fieldIds) {
                if (!checkField(inputs[id])) isValid = false;
            }
            if (!isValid) {
                const firstErr = contactForm.querySelector('.error');
                if (firstErr) firstErr.focus();
                return;
            }

            submitBtn.classList.add('loading');

            function showSuccess() {
                submitBtn.classList.remove('loading');
                const groups = contactForm.querySelector('.contact-form_groups');
                if (groups) groups.style.display = 'none';
                const success = contactForm.querySelector('.contact-form_success');
                if (success) success.classList.add('show');
            }

            fetch('https://formspree.io/f/mjgdqkgv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: inputs.name.value.trim(),
                    phone: inputs.phone.value.trim(),
                    email: inputs.email.value.trim(),
                    message: inputs.message ? inputs.message.value.trim() : ''
                })
            }).then(function (r) {
                if (r.ok) showSuccess();
                else throw new Error('Сервер вернул ' + r.status);
            }).catch(function (err) {
                submitBtn.classList.remove('loading');
                alert('Ошибка: ' + err.message);
            });
        });
    }

    const orderBtn = document.querySelector('.cart-summary .btn-accent');
    const modal = document.getElementById('orderModal');
    if (modal && orderBtn) {
        const modalOverlay = document.getElementById('orderModalOverlay');
        const closeBtn = document.getElementById('orderModalClose');
        const form = document.getElementById('orderForm');
        const successEl = modal.querySelector('.order-modal_success');
        const formEl = modal.querySelector('.order-form');
        const successBtn = document.getElementById('orderSuccessBtn');

        function openModal() {
            const cart = getCart();
            let cnt = 0;
            for (const item of cart) cnt += item.qty;
            if (cnt === 0) return;
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            formEl.style.display = 'flex';
            successEl.classList.remove('show');
            form.reset();
        }

        function closeModal() {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }

        orderBtn.onclick = openModal;
        if (closeBtn) closeBtn.onclick = closeModal;
        if (modalOverlay) modalOverlay.onclick = closeModal;
        if (successBtn) successBtn.onclick = closeModal;

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
        });

        if (form) {
            const orderInputs = {
                name: document.getElementById('orderName'),
                phone: document.getElementById('orderPhone'),
                email: document.getElementById('orderEmail'),
                address: document.getElementById('orderAddress')
            };

            if (orderInputs.phone) {
                orderInputs.phone.addEventListener('input', function () { this.value = maskPhone(this.value); });
            }

            const orderFields = ['name', 'phone', 'email', 'address'];
            for (const id of orderFields) {
                const el = orderInputs[id];
                if (!el) continue;
                const errSpan = document.createElement('div');
                errSpan.className = 'order-form_error';
                el.parentElement.appendChild(errSpan);

                el.addEventListener('blur', function () { checkField(this); });
                el.addEventListener('input', function () {
                    this.classList.remove('error');
                    const err = this.parentElement.querySelector('.order-form_error');
                    if (err) err.textContent = '';
                    if (this.value.trim()) {
                        if (this.classList.contains('valid')) checkField(this);
                    } else {
                        this.classList.remove('valid');
                    }
                });
            }

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                let isValid = true;
                for (const id of orderFields) {
                    if (!checkField(orderInputs[id])) isValid = false;
                }
                if (!isValid) {
                    const firstErr = form.querySelector('.error');
                    if (firstErr) firstErr.focus();
                    return;
                }
                saveCart([]);
                renderCart();
                formEl.style.display = 'none';
                successEl.classList.add('show');
            });
        }
    }

    updateCartZnachok();

});
