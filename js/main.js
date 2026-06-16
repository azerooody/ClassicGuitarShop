function getCart() {
    try {
        var data = JSON.parse(localStorage.getItem('cart'));
        if (Array.isArray(data)) return data;
    } catch (e) {}
    return [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartZnachok();
}

function addToCart(productId) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].qty++;
            saveCart(cart);
            return;
        }
    }
    cart.push({ id: productId, qty: 1 });
    saveCart(cart);
}

function removeFromCart(productId) {
    var cart = getCart();
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }
    saveCart(newCart);
}

function updateQty(productId, delta) {
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].qty += delta;
            if (cart[i].qty < 1) cart[i].qty = 1;
            saveCart(cart);
            return;
        }
    }
}

function updateCartZnachok() {
    var count = 0;
    var cart = getCart();
    for (var i = 0; i < cart.length; i++) count += cart[i].qty;
    var links = document.querySelectorAll('.header__cart');
    for (var j = 0; j < links.length; j++) {
        var znachok = links[j].querySelector('.cart-znachok');
        if (count > 0) {
            if (!znachok) {
                znachok = document.createElement('span');
                znachok.className = 'cart-znachok';
                links[j].appendChild(znachok);
            }
            znachok.textContent = count;
        } else if (znachok) {
            znachok.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {

    var products = [
        { id: 1, name: 'Alhambra Classical Concert 8P', type: 'Классическая гитара 4/4', price: 261100, img: 'images/AlhambraClassicalConcert8P.jpg', popular: true, brand: 'Alhambra', size: '4/4' },
        { id: 2, name: 'Alhambra Classica Student 2C', type: 'Классическая гитара 4/4', price: 77700, img: 'images/AlhambraClassicaStudent2C.jpg', popular: true, brand: 'Alhambra', size: '4/4' },
        { id: 3, name: 'Manuel Rodriguez E-57 Ecologia', type: 'Классическая гитара 3/4', price: 44000, img: 'images/ManuelRodriguezE-57Ecologia.jpg', popular: true, brand: 'Manuel Rodriguez', size: '3/4' },
        { id: 4, name: 'Esteve 12 SP', type: 'Классическая гитара 4/4', price: 371900, img: 'images/Esteve12SP.jpg', popular: true, brand: 'Esteve', size: '4/4' },
        { id: 5, name: 'Manuel Rodriguez A-S Superior', type: 'Классическая гитара 4/4', price: 92000, img: 'images/ManuelRodriguezA-SSuperior.jpg', brand: 'Manuel Rodriguez', size: '4/4' },
        { id: 6, name: 'LTD TL-6N Thinline Natural', type: 'Классическая гитара 4/4', price: 70000, img: 'images/LTDTL-6NThinlineNatural.jpg', brand: 'LTD', size: '4/4' },
        { id: 7, name: 'Prudencio Saez Cutaway Stage', type: 'Классическая гитара 4/4', price: 172900, img: 'images/PrudencioSaezCutawayStage.jpg', brand: 'Prudencio Saez', size: '4/4' }
    ];

    function formatPrice(num) {
        var s = '';
        var str = Math.round(num).toString();
        var len = str.length;
        for (var i = 0; i < len; i++) {
            if (i > 0 && (len - i) % 3 === 0) s += ' ';
            s += str[i];
        }
        return s + ' руб.';
    }

    function maskPhone(val) {
        var d = '';
        for (var i = 0; i < val.length; i++) {
            if (val[i] >= '0' && val[i] <= '9') d += val[i];
        }
        if (d.charAt(0) === '8' || d.charAt(0) === '7') d = d.slice(1);
        d = d.slice(0, 10);
        if (!d) return '';
        var r = '+7 (' + d.slice(0, 3);
        if (d.length >= 4) r += ') ' + d.slice(3, 6);
        if (d.length >= 7) r += '-' + d.slice(6, 8);
        if (d.length >= 9) r += '-' + d.slice(8, 10);
        return r;
    }

    function checkField(el) {
        if (!el) return true;
        el.classList.remove('error', 'valid');
        var v = el.value.trim();
        if (el.hasAttribute('required') && !v) { el.classList.add('error'); return false; }
        if (v) {
            if (el.type === 'email' && (v.indexOf('@') === -1 || v.indexOf('.') === -1)) {
                el.classList.add('error'); return false;
            }
            if ((el.id === 'phone' || el.id === 'orderPhone')) {
                var dc = 0;
                for (var i = 0; i < v.length; i++) {
                    if (v[i] >= '0' && v[i] <= '9') dc++;
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
        var container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        for (var i = 0; i < items.length; i++) {
            var p = items[i];
            var card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML =
                '<div class="product-card__image"><img src="' + p.img + '" alt="' + p.name + '" loading="lazy"></div>' +
                '<div class="product-card__content">' +
                '<div class="product-card__name">' + p.name + '</div>' +
                '<div class="product-card__type">' + p.type + '</div>' +
                '<div class="product-card__price">' + formatPrice(p.price) + '</div>' +
                '</div>' +
                '<button class="product-card__btn">' + 'В корзину' + '</button>';
            var btn = card.querySelector('.product-card__btn');
            var productId = p.id;
            btn.onclick = (function (id, element) {
                return function () {
                    addToCart(id);
                    element.textContent = '✓ Добавлено';
                    element.classList.add('added');
                    setTimeout(function () {
                        element.textContent = 'В корзину';
                        element.classList.remove('added');
                    }, 1500);
                };
            })(productId, btn);
            container.appendChild(card);
        }
    }

    var popularItems = [];
    for (var i = 0; i < products.length; i++) {
        if (products[i].popular) popularItems.push(products[i]);
    }
    renderProductCards('popularProducts', popularItems);

    var catalogContainer = document.getElementById('catalogProducts');
    var countEl = document.querySelector('.catalog__count');
    var sortSelect = document.querySelector('.catalog__select');
    var applyBtn = document.querySelector('.filters__actions .btn--accent');
    var resetBtn = document.querySelector('.filters__actions .btn--ghost');
    var priceFrom = document.querySelector('.filter__price-inputs .filter__input:first-child');
    var priceTo = document.querySelector('.filter__price-inputs .filter__input:last-child');
    var sizeChecks = document.querySelectorAll('.filter__options input[name="size"]');
    var brandChecks = document.querySelectorAll('.filter__options input[name="brand"]');

    if (catalogContainer) {

        function renderCatalog() {
            var sizes = [], brands = [], priceMin = 0, priceMax = Infinity;

            for (var i = 0; i < sizeChecks.length; i++) {
                if (sizeChecks[i].checked) sizes.push(sizeChecks[i].value);
            }
            for (var i = 0; i < brandChecks.length; i++) {
                if (brandChecks[i].checked) brands.push(brandChecks[i].value);
            }

            var fromVal = priceFrom ? parseFloat(priceFrom.value) : NaN;
            var toVal = priceTo ? parseFloat(priceTo.value) : NaN;
            if (!isNaN(fromVal) && fromVal > 0) priceMin = fromVal;
            if (!isNaN(toVal) && toVal > 0) priceMax = toVal;

            var filtered = [];
            for (var i = 0; i < products.length; i++) {
                var p = products[i];
                if (sizes.length > 0 && sizes.indexOf(p.size) === -1) continue;
                if (brands.length > 0 && brands.indexOf(p.brand) === -1) continue;
                if (p.price < priceMin || p.price > priceMax) continue;
                filtered.push(p);
            }

            var sortVal = sortSelect ? sortSelect.value : 'popular';
            var sorted = filtered.slice();
            if (sortVal === 'price-asc') sorted.sort(function (a, b) { return a.price - b.price; });
            else if (sortVal === 'price-desc') sorted.sort(function (a, b) { return b.price - a.price; });
            else sorted.sort(function (a, b) { return (b.popular ? 1 : 0) - (a.popular ? 1 : 0); });

            renderProductCards('catalogProducts', sorted);
            if (countEl) {
                var l = sorted.length;
                var word = 'товаров';
                if (l % 10 === 1 && l % 100 !== 11) word = 'товар';
                else if (l % 10 >= 2 && l % 10 <= 4 && (l % 100 < 10 || l % 100 >= 20)) word = 'товара';
                countEl.textContent = 'Сортировать ' + l + ' ' + word;
            }
        }

        function resetFilters() {
            for (var i = 0; i < sizeChecks.length; i++) sizeChecks[i].checked = false;
            for (var i = 0; i < brandChecks.length; i++) brandChecks[i].checked = false;
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

    var burger = document.getElementById('burgerBtn');
    var nav = document.getElementById('mainNav');
    if (burger && nav) {
        burger.addEventListener('click', function () {
            nav.classList.toggle('open');
            burger.classList.toggle('open');
            var expanded = nav.classList.contains('open');
            burger.setAttribute('aria-expanded', expanded);
        });
    }

    var cartBody = document.getElementById('cartItems');
    if (cartBody) {
        var subtotalEl = document.getElementById('subtotal');
        var totalEl = document.getElementById('total');
        var cartCountEl = document.getElementById('cartCount');
        var cartHeader = document.getElementById('cartHeader');

        function renderCart() {
            var cart = getCart();
            cartBody.innerHTML = '';
            var subtotal = 0;
            var itemCount = 0;

            for (var i = 0; i < cart.length; i++) {
                var pr = null;
                for (var j = 0; j < products.length; j++) {
                    if (products[j].id === cart[i].id) { pr = products[j]; break; }
                }
                if (!pr) continue;
                var total = pr.price * cart[i].qty;
                subtotal += total;
                itemCount += cart[i].qty;

                var item = document.createElement('div');
                item.className = 'cart-item';
                item.setAttribute('data-id', cart[i].id);
                item.setAttribute('data-price', pr.price);
                item.innerHTML =
                    '<div class="cart-item__image" style="background:#D9D9D9;border-radius:10px;overflow:hidden"><img src="'
                     + pr.img + '" style="width:100%;height:100%;object-fit:cover" alt="' + pr.name + '"></div>' +
                    '<div class="cart-item__info">' +
                    '<h3 class="cart-item__name">' + pr.name + '</h3>' +
                    '<p class="cart-item__desc">' + pr.type + '</p>' +
                    '<button class="cart-item__remove">Удалить</button>' +
                    '</div>' +
                    '<div class="cart-item__price">' + formatPrice(pr.price) + '</div>' +
                    '<div class="cart-item__qty">' +
                    '<button class="cart-item__qty-btn" data-dir="minus">−</button>' +
                    '<span class="cart-item__qty-val">' + cart[i].qty + '</span>' +
                    '<button class="cart-item__qty-btn" data-dir="plus">+</button>' +
                    '</div>' +
                    '<div class="cart-item__total">' + formatPrice(total) + '</div>';
                cartBody.appendChild(item);
            }

            var delivery = subtotal > 0 ? 1500 : 0;
            var totalCost = subtotal + delivery;
            if (cartCountEl) cartCountEl.textContent = itemCount;
            if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
            if (totalEl) totalEl.textContent = formatPrice(totalCost);
            if (cartHeader) cartHeader.style.display = cart.length === 0 ? 'none' : '';

            if (cart.length === 0) {
                cartBody.innerHTML = '<div style="text-align:center;padding:60px 0;font-size:24px;color:#999">Корзина пуста</div>';
            }
        }

        cartBody.addEventListener('click', function (e) {
            var btn = e.target.closest('.cart-item__qty-btn');
            if (btn) {
                var id = parseInt(btn.closest('.cart-item').dataset.id);
                if (btn.dataset.dir === 'plus') updateQty(id, 1);
                else if (btn.dataset.dir === 'minus') updateQty(id, -1);
                renderCart();
                return;
            }
            var del = e.target.closest('.cart-item__remove');
            if (del) {
                removeFromCart(parseInt(del.closest('.cart-item').dataset.id));
                renderCart();
            }
        });

        renderCart();
    }

    var searchBtns = document.querySelectorAll('.header__search');
    if (searchBtns.length) {
        var overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.id = 'searchOverlay';
        overlay.innerHTML =
            '<div class="search-overlay__box">' +
            '<input class="search-overlay__input" id="searchInput" type="text" placeholder="Поиск гитар..." autocomplete="off">' +
            '<button class="search-overlay__close" id="searchClose" aria-label="Закрыть">✕</button>' +
            '</div>' +
            '<div class="search-overlay__results" id="searchResults"></div>';
        document.body.appendChild(overlay);

        var searchInput = document.getElementById('searchInput');
        var searchResults = document.getElementById('searchResults');
        var searchClose = document.getElementById('searchClose');

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

        for (var i = 0; i < searchBtns.length; i++) searchBtns[i].onclick = openSearch;
        searchClose.onclick = closeSearch;
        overlay.onclick = function (e) { if (e.target === overlay) closeSearch(); };

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
        });

        searchInput.addEventListener('input', function () {
            var q = this.value.trim().toLowerCase();
            if (!q) { searchResults.innerHTML = '<div class="search-overlay__empty">Начните вводить название гитары</div>'; return; }

            var matches = [];
            for (var i = 0; i < products.length; i++) {
                if (products[i].name.toLowerCase().indexOf(q) !== -1 || products[i].type.toLowerCase().indexOf(q) !== -1) {
                    matches.push(products[i]);
                }
            }

            if (matches.length === 0) {
                searchResults.innerHTML = '<div class="search-overlay__empty">Ничего не найдено</div>';
                return;
            }

            var html = '';
            for (var i = 0; i < matches.length; i++) {
                var p = matches[i];
                html += '<div class="search-overlay__result" data-id="' + p.id + '">' +
                    '<img class="search-overlay__result-img" src="' + p.img + '" alt="' + p.name + '" loading="lazy">' +
                    '<div class="search-overlay__result-info">' +
                    '<div class="search-overlay__result-name">' + p.name + '</div>' +
                    '<div class="search-overlay__result-type">' + p.type + '</div>' +
                    '</div>' +
                    '<div class="search-overlay__result-price">' + formatPrice(p.price) + '</div>' +
                    '</div>';
            }
            searchResults.innerHTML = html;
        });

        searchResults.addEventListener('click', function (e) {
            var res = e.target.closest('.search-overlay__result');
            if (res) { closeSearch(); window.location.href = 'catalog.html'; }
        });
    }

    var filtersToggle = document.getElementById('filtersToggle');
    var filtersSidebar = document.getElementById('filtersSidebar');
    var filtersClose = document.getElementById('filtersClose');
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

    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        var inputs = {
            name: contactForm.querySelector('#name'),
            phone: contactForm.querySelector('#phone'),
            email: contactForm.querySelector('#email'),
            message: contactForm.querySelector('#message')
        };
        var submitBtn = contactForm.querySelector('.btn--wide');

        if (inputs.phone) {
            inputs.phone.addEventListener('input', function () { this.value = maskPhone(this.value); });
            inputs.phone.addEventListener('focus', function () {
                if (!this.value) this.value = '+7 (';
                this.setSelectionRange(this.value.length, this.value.length);
            });
        }

        var fieldIds = ['name', 'phone', 'email', 'message'];
        for (var fi = 0; fi < fieldIds.length; fi++) {
            var el = inputs[fieldIds[fi]];
            if (!el) continue;
            var errSpan = document.createElement('div');
            errSpan.className = 'contact-form__error';
            el.parentElement.appendChild(errSpan);

            el.addEventListener('blur', function () { checkField(this); });
            el.addEventListener('input', function () {
                this.classList.remove('error');
                var err = this.parentElement.querySelector('.contact-form__error');
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
            var isValid = true;
            for (var fi = 0; fi < fieldIds.length; fi++) {
                if (!checkField(inputs[fieldIds[fi]])) isValid = false;
            }
            if (!isValid) {
                var firstErr = contactForm.querySelector('.error');
                if (firstErr) firstErr.focus();
                return;
            }

            submitBtn.classList.add('loading');

            function showSuccess() {
                submitBtn.classList.remove('loading');
                var groups = contactForm.querySelector('.contact-form__groups');
                if (groups) groups.style.display = 'none';
                var success = contactForm.querySelector('.contact-form__success');
                if (success) success.classList.add('show');
            }

            fetch('/send-message', {
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
                alert('Ошибка: ' + err.message + '. Убедись, что сервер запущен (server.py)');
            });
        });
    }

    var orderBtn = document.querySelector('.cart-summary .btn--accent');
    var modal = document.getElementById('orderModal');
    if (modal && orderBtn) {
        var modalOverlay = document.getElementById('orderModalOverlay');
        var closeBtn = document.getElementById('orderModalClose');
        var form = document.getElementById('orderForm');
        var successEl = modal.querySelector('.order-modal__success');
        var formEl = modal.querySelector('.order-form');
        var successBtn = document.getElementById('orderSuccessBtn');

        function openModal() {
            var c = getCart(), cnt = 0;
            for (var i = 0; i < c.length; i++) cnt += c[i].qty;
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
            var orderInputs = {
                name: document.getElementById('orderName'),
                phone: document.getElementById('orderPhone'),
                email: document.getElementById('orderEmail'),
                address: document.getElementById('orderAddress')
            };

            if (orderInputs.phone) {
                orderInputs.phone.addEventListener('input', function () { this.value = maskPhone(this.value); });
            }

            var orderFields = ['name', 'phone', 'email', 'address'];
            for (var oi = 0; oi < orderFields.length; oi++) {
                var el = orderInputs[orderFields[oi]];
                if (!el) continue;
                var errSpan = document.createElement('div');
                errSpan.className = 'order-form__error';
                el.parentElement.appendChild(errSpan);

                el.addEventListener('blur', function () { checkField(this); });
                el.addEventListener('input', function () {
                    this.classList.remove('error');
                    var err = this.parentElement.querySelector('.order-form__error');
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
                var isValid = true;
                for (var oi = 0; oi < orderFields.length; oi++) {
                    if (!checkField(orderInputs[orderFields[oi]])) isValid = false;
                }
                if (!isValid) {
                    var firstErr = form.querySelector('.error');
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
