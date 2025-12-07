// BatLuxe Beauty Shop — CLEAN, OPTIMIZED & FULLY DEBUGGED VERSION
document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // ELEMENT REFERENCES
    // ==========================
    const cartIcon = document.getElementById("cartIcon");
    const cartSidebar = document.getElementById("cartSidebar");
    const closeCart = document.getElementById("closeCart");
    const overlay = document.getElementById("overlay");
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const emptyCartMessage = document.getElementById("emptyCartMessage");
    const subtotalElement = document.getElementById("subtotal");
    const deliveryFeeElement = document.getElementById("deliveryFee");
    const totalElement = document.getElementById("total");
    const notification = document.getElementById("notification");

    const checkoutBtn = document.getElementById("checkoutBtn");
    const checkoutForm = document.getElementById("checkoutForm");
    const cartSummary = document.getElementById("cartSummary");
    const backToCart = document.getElementById("backToCart");
    const checkoutFormElement = document.getElementById("checkoutFormElement");

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const productCards = document.querySelectorAll(".product-card");

    const currencyBtn = document.querySelector(".currency-btn");
    const currencyDropdown = document.querySelector(".currency-dropdown");
    const currencyOptions = document.querySelectorAll(".currency-option");
    const selectedCurrency = document.querySelector(".selected-currency");

    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

    // ==========================
    // APP VARIABLES
    // ==========================
    let cart = JSON.parse(localStorage.getItem("batluxe_cart")) || [];
    const deliveryFee = 5;
    const freeDeliveryThreshold = 5000;

    let currentCurrency = "GBP";
    let currentRate = 1;
    let currentSymbol = "£";

    initApp();

    // ==========================
    // INITIALIZER
    // ==========================
    function initApp() {
        setupEventListeners();
        updateCartUI();
        updateCurrencyDisplay();
        startPriceUpdates();
    }

    // ==========================
    // EVENT LISTENERS
    // ==========================
    function setupEventListeners() {
        if (cartIcon) cartIcon.addEventListener("click", openCart);
        if (closeCart) closeCart.addEventListener("click", closeCartSidebar);
        if (overlay) overlay.addEventListener("click", closeCartSidebar);

        if (checkoutBtn) checkoutBtn.addEventListener("click", showCheckoutForm);
        if (backToCart) backToCart.addEventListener("click", showCart);

        addToCartButtons.forEach(btn =>
            btn.addEventListener("click", () => {
                addToCart(
                    btn.dataset.id,
                    btn.dataset.name,
                    parseFloat(btn.dataset.price),
                    btn.dataset.image
                );
            })
        );

        if (checkoutFormElement)
            checkoutFormElement.addEventListener("submit", e => {
                e.preventDefault();
                processCheckout();
            });

        // Currency Selection
        if (currencyBtn)
            currencyBtn.addEventListener("click", () =>
                currencyDropdown.classList.toggle("show")
            );

        document.addEventListener("click", e => {
            if (!e.target.closest(".currency-selector"))
                currencyDropdown.classList.remove("show");
        });

        currencyOptions.forEach(option =>
            option.addEventListener("click", () => {
                currentCurrency = option.dataset.currency;
                currentRate = parseFloat(option.dataset.rate);
                currentSymbol = option.dataset.symbol;
                updateCurrencyDisplay();
                convertAllPrices();
                updateCartUI();
                currencyDropdown.classList.remove("show");
            })
        );

        // Search
        if (searchBtn) searchBtn.addEventListener("click", performSearch);
        if (searchInput) {
            searchInput.addEventListener("keyup", e => {
                if (e.key === "Enter") performSearch();
            });

            searchInput.addEventListener("input", () => {
                if (searchInput.value.length === 0) clearSearch();
                else if (searchInput.value.length > 2) performSearch();
            });
        }

        // Mobile Nav
        if (hamburger && navLinks)
            hamburger.addEventListener("click", () =>
                navLinks.classList.toggle("active")
            );
    }

    // ==========================
    // CART LOGIC
    // ==========================
    function openCart() {
        cartSidebar.classList.add("active");
        overlay.classList.add("active");
        showCart();
    }

    function closeCartSidebar() {
        cartSidebar.classList.remove("active");
        overlay.classList.remove("active");
    }

    function showCheckoutForm() {
        if (cart.length === 0)
            return showNotification("Cart is empty!", "error");

        cartSummary.style.display = "none";
        checkoutForm.style.display = "block";
        backToCart.style.display = "flex";

        const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
        const delivery = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;

        document.getElementById("checkoutItems").textContent = cart.reduce(
            (t, i) => t + i.quantity,
            0
        );
        document.getElementById("checkoutSubtotal").textContent = formatPrice(subtotal);
        document.getElementById("checkoutDelivery").textContent =
            delivery === 0 ? "FREE" : formatPrice(delivery);
        document.getElementById("checkoutTotal").textContent = formatPrice(subtotal + delivery);
    }

    function showCart() {
        cartSummary.style.display = "block";
        checkoutForm.style.display = "none";
        backToCart.style.display = "none";
    }

    function addToCart(id, name, price, image) {
        const index = cart.findIndex(i => i.id === id);

        if (index !== -1) cart[index].quantity++;
        else
            cart.push({
                id,
                name,
                price,
                image,
                quantity: 1
            });

        saveCart();
        updateCartUI();
        showNotification("Item added to cart!");
    }

    function updateCartUI() {
        cartCount.textContent = cart.reduce((t, i) => t + i.quantity, 0);
        cartItems.innerHTML = "";

        if (cart.length === 0) {
            emptyCartMessage.style.display = "block";
        } else {
            emptyCartMessage.style.display = "none";

            cart.forEach((item, i) => {
                const div = document.createElement("div");
                div.className = "cart-item";

                div.innerHTML = `
                    <div class="item-image"><img src="${item.image}" /></div>
                    <div class="item-details">
                        <div class="item-name">${item.name}</div>
                        <div class="item-price">${formatPrice(item.price)}</div>
                        <div class="item-quantity">
                            <button class="minus" data-i="${i}">-</button>
                            <input type="number" value="${item.quantity}" min="1" data-i="${i}">
                            <button class="plus" data-i="${i}">+</button>
                        </div>
                        <button class="remove-item" data-i="${i}">Remove</button>
                    </div>
                `;

                cartItems.appendChild(div);
            });

            document.querySelectorAll(".minus").forEach(btn =>
                btn.addEventListener("click", () => changeQty(btn.dataset.i, -1))
            );
            document.querySelectorAll(".plus").forEach(btn =>
                btn.addEventListener("click", () => changeQty(btn.dataset.i, +1))
            );
            document.querySelectorAll("input[type='number']").forEach(inp =>
                inp.addEventListener("change", () =>
                    updateQty(inp.dataset.i, parseInt(inp.value))
                )
            );
            document.querySelectorAll(".remove-item").forEach(btn =>
                btn.addEventListener("click", () => removeItem(btn.dataset.i))
            );
        }

        updateCartSummary();
    }

    function changeQty(i, amount) {
        let q = cart[i].quantity + amount;
        if (q < 1) q = 1;
        cart[i].quantity = q;
        saveCart();
        updateCartUI();
    }

    function updateQty(i, q) {
        if (q < 1) q = 1;
        cart[i].quantity = q;
        saveCart();
        updateCartUI();
    }

    function removeItem(i) {
        cart.splice(i, 1);
        saveCart();
        updateCartUI();
    }

    function updateCartSummary() {
        const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
        const delivery = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
        subtotalElement.textContent = formatPrice(subtotal);
        deliveryFeeElement.textContent = delivery === 0 ? "FREE" : formatPrice(delivery);
        totalElement.textContent = formatPrice(subtotal + delivery);
    }

    function saveCart() {
        localStorage.setItem("batluxe_cart", JSON.stringify(cart));
    }

    function processCheckout() {
        showNotification("Order placed successfully!", "success");
        cart = [];
        saveCart();
        updateCartUI();
        showCart();

        setTimeout(closeCartSidebar, 1500);
    }

    // ==========================
    // SEARCH
    // ==========================
    function performSearch() {
        const term = searchInput.value.toLowerCase().trim();
        if (!term) return clearSearch();

        let match = false;

        productCards.forEach(card => {
            const name = card.querySelector(".product-name").textContent.toLowerCase();
            const cat = card.querySelector(".product-category").textContent.toLowerCase();

            if (name.includes(term) || cat.includes(term)) {
                card.style.display = "block";
                card.classList.add("highlight");
                setTimeout(() => card.classList.remove("highlight"), 1000);
                match = true;
            } else card.style.display = "none";
        });

        if (!match) showNotification("No matching products", "error");
    }

    function clearSearch() {
        productCards.forEach(card => (card.style.display = "block"));
    }

    // ==========================
    // CURRENCY / PRICE SYSTEM
    // ==========================
    function updateCurrencyDisplay() {
        selectedCurrency.textContent = currentCurrency;
        currencyOptions.forEach(opt => {
            opt.classList.toggle("active", opt.dataset.currency === currentCurrency);
        });
    }

    function convertAllPrices() {
        document.querySelectorAll(".product-price").forEach(priceEl => {
            const basePrice = parseFloat(priceEl.dataset.basePrice);
            const convertedPrice = (basePrice * currentRate).toFixed(2);
            priceEl.textContent = `${currentSymbol}${convertedPrice}`;
        });
    }

    function startPriceUpdates() {
        updateProductPrices();
        setInterval(updateProductPrices, 30000);
    }

    function updateProductPrices() {
        document.querySelectorAll(".product-card").forEach(card => {
            const priceEl = card.querySelector(".product-price");
            const addBtn = card.querySelector(".add-to-cart-btn");
            if (!priceEl || !addBtn) return;

            let base = parseFloat(priceEl.dataset.basePrice);
            const change = (Math.random() - 0.5) * 0.1;
            base = (base * (1 + change)).toFixed(2);

            priceEl.dataset.basePrice = base;
            addBtn.dataset.price = base;

            priceEl.textContent = `${currentSymbol}${(base * currentRate).toFixed(2)}`;

            // sync with cart
            const id = addBtn.dataset.id;
            const idx = cart.findIndex(i => i.id === id);
            if (idx !== -1) {
                cart[idx].price = parseFloat(base);
                saveCart();
                updateCartUI();
            }
        });
    }

    // ==========================
    // HELPERS
    // ==========================
    function formatPrice(amount) {
        return `${currentSymbol}${amount.toFixed(2)}`;
    }

    function showNotification(message, type = "success") {
        notification.textContent = message;
        notification.className = `notification ${type} active`;
        setTimeout(() => notification.classList.remove("active"), 3000);
    }
});
document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const productCards = document.querySelectorAll(".product-card");

    function searchProducts() {
        const searchValue = searchInput.value.toLowerCase().trim();
        let matchFound = false;

        productCards.forEach(card => {
            const name = card.querySelector(".product-name").textContent.toLowerCase();
            const category = card.querySelector(".product-category").textContent.toLowerCase();

            if (name.includes(searchValue) || category.includes(searchValue)) {
                card.style.display = "block";
                matchFound = true;
            } else {
                card.style.display = "none";
            }
        });

        // If no result found, show a message
        let noResult = document.getElementById("noResultsMessage");

        if (!matchFound) {
            if (!noResult) {
                noResult = document.createElement("p");
                noResult.id = "noResultsMessage";
                noResult.textContent = "No products match your search.";
                noResult.style.textAlign = "center";
                noResult.style.fontSize = "18px";
                noResult.style.marginTop = "20px";
                noResult.style.color = "#e75480";
                document.querySelector(".products-grid").appendChild(noResult);
            }
        } else {
            if (noResult) noResult.remove();
        }
    }

    // 🔍 Search on typing
    searchInput.addEventListener("input", searchProducts);

    // 🔎 Search when button is clicked
    searchBtn.addEventListener("click", searchProducts);
});
// Add this to your existing shop.js file

// Handle checkout form submission
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkoutFormElement');
    const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                postcode: document.getElementById('postcode').value,
                country: document.getElementById('country').value,
                items: document.getElementById('checkoutItems').textContent,
                subtotal: document.getElementById('checkoutSubtotal').textContent,
                delivery: document.getElementById('checkoutDelivery').textContent,
                total: document.getElementById('checkoutTotal').textContent,
                cartItems: getCartItems() // You need to implement this function
            };
            
            // Save order data to localStorage
            saveOrderData(formData);
            
            // Show loading state
            proceedToPaymentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            proceedToPaymentBtn.disabled = true;
            
            // Simulate processing delay (remove this in production)
            setTimeout(function() {
                // Redirect to payment page
                window.location.href = 'payment.html';
            }, 1000);
        });
    }
});

// Function to save order data to localStorage
function saveOrderData(formData) {
    // Get current cart items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Create order object
    const order = {
        orderId: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postcode: formData.postcode,
            country: formData.country
        },
        items: cart,
        summary: {
            subtotal: formData.subtotal,
            delivery: formData.delivery,
            total: formData.total
        },
        status: 'pending'
    };
    
    // Save order to localStorage
    localStorage.setItem('currentOrder', JSON.stringify(order));
    
    // Also save to orders history
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Function to get cart items (add this if not exists)
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Add to cart functionality (make sure this exists)
function addToCart(product) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    // Show notification
    showNotification('Item added to cart!');
}

// Update cart display function
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutItemsElement = document.getElementById('checkoutItems');
    const checkoutSubtotalElement = document.getElementById('checkoutSubtotal');
    const checkoutTotalElement = document.getElementById('checkoutTotal');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const deliveryFee = 5.00;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        subtotalElement.textContent = '£0.00';
        totalElement.textContent = '£0.00';
        checkoutItemsElement.textContent = '0';
        checkoutSubtotalElement.textContent = '£0.00';
        checkoutTotalElement.textContent = '£0.00';
        return;
    }
    
    let subtotal = 0;
    let itemsHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">£${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-total">£${itemTotal.toFixed(2)}</div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    
    const total = subtotal + deliveryFee;
    
    subtotalElement.textContent = `£${subtotal.toFixed(2)}`;
    totalElement.textContent = `£${total.toFixed(2)}`;
    checkoutItemsElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    checkoutSubtotalElement.textContent = `£${subtotal.toFixed(2)}`;
    checkoutTotalElement.textContent = `£${total.toFixed(2)}`;
    
    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.id;
            const isPlus = this.classList.contains('plus');
            updateCartQuantity(itemId, isPlus);
        });
    });
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.id;
            removeFromCart(itemId);
        });
    });
}

// Show notification function
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
// Add this function to your existing JavaScript file
function handleCheckoutFormSubmission(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postcode: document.getElementById('postcode').value,
        country: document.getElementById('country').value,
        items: document.getElementById('checkoutItems').textContent,
        subtotal: document.getElementById('checkoutSubtotal').textContent,
        delivery: document.getElementById('checkoutDelivery').textContent,
        total: document.getElementById('checkoutTotal').textContent,
        cartItems: cart
    };
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || 
        !formData.city || !formData.postcode || !formData.country) {
        showNotification("Please fill in all required fields", "error");
        return;
    }
    
    // Save order data to localStorage
    saveOrderData(formData);
    
    // Show loading state
    const submitBtn = document.getElementById('proceedToPaymentBtn');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate processing delay
    setTimeout(function() {
        // Redirect to payment page
        window.location.href = "payment.html";
    }, 1500);
}

// Function to save order data to localStorage
function saveOrderData(formData) {
    // Create order object
    const order = {
        orderId: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        customer: {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postcode: formData.postcode,
            country: formData.country
        },
        items: formData.cartItems,
        summary: {
            items: formData.items,
            subtotal: formData.subtotal,
            delivery: formData.delivery,
            total: formData.total
        },
        status: 'pending'
    };
    
    // Save current order
    localStorage.setItem('currentOrder', JSON.stringify(order));
    
    // Also save to orders history
    const orders = JSON.parse(localStorage.getItem('batluxe_orders')) || [];
    orders.push(order);
    localStorage.setItem('batluxe_orders', JSON.stringify(orders));
    
    // Keep cart items for payment page
    localStorage.setItem('batluxe_checkout_cart', JSON.stringify(formData.cartItems));
}

// Update your existing processCheckout function to use the form submission
function processCheckout() {
    if (cart.length === 0) {
        showNotification("Cart is empty!", "error");
        return;
    }
    
    // Update checkout summary
    const subtotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
    const delivery = subtotal >= 5000 ? 0 : 5; // Assuming 5000 is your free delivery threshold
    
    document.getElementById("checkoutItems").textContent = cart.reduce(
        (t, i) => t + i.quantity,
        0
    );
    document.getElementById("checkoutSubtotal").textContent = formatPrice(subtotal);
    document.getElementById("checkoutDelivery").textContent = 
        delivery === 0 ? "FREE" : formatPrice(delivery);
    document.getElementById("checkoutTotal").textContent = formatPrice(subtotal + delivery);
    
    // Show checkout form
    cartSummary.style.display = "none";
    checkoutForm.style.display = "block";
    backToCart.style.display = "flex";
}

// Add event listener for form submission (place this in your setupEventListeners function)
if (checkoutFormElement) {
    checkoutFormElement.addEventListener("submit", handleCheckoutFormSubmission);
}

// Also update the showCart function to reset the form button state
function showCart() {
    cartSummary.style.display = "block";
    checkoutForm.style.display = "none";
    backToCart.style.display = "none";
    
    // Reset form button state
    const submitBtn = document.getElementById('proceedToPaymentBtn');
    if (submitBtn) {
        submitBtn.innerHTML = 'Proceed to Payment';
        submitBtn.disabled = false;
    }
    
    // Reset form fields
    if (checkoutFormElement) {
        checkoutFormElement.reset();
    }
}