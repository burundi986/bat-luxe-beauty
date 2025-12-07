
        // Cart functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Cart elements
            const cartIcon = document.getElementById('cartIcon');
            const cartSidebar = document.getElementById('cartSidebar');
            const closeCart = document.getElementById('closeCart');
            const overlay = document.getElementById('overlay');
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const emptyCartMessage = document.getElementById('emptyCartMessage');
            const subtotalElement = document.getElementById('subtotal');
            const deliveryFeeElement = document.getElementById('deliveryFee');
            const totalElement = document.getElementById('total');
            const notification = document.getElementById('notification');
            const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
            
            // Cart data
            let cart = [];
            const deliveryFee = 5.99; // Fixed delivery fee
            const freeDeliveryThreshold = 50.00; // Free delivery for orders over $50
            
            // Event Listeners
            cartIcon.addEventListener('click', openCart);
            closeCart.addEventListener('click', closeCartSidebar);
            overlay.addEventListener('click', closeCartSidebar);
            
            // Add to cart buttons
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    const productName = this.getAttribute('data-name');
                    const productPrice = parseFloat(this.getAttribute('data-price'));
                    const productImage = this.getAttribute('data-image');
                    
                    addToCart(productId, productName, productPrice, productImage);
                });
            });
            
            // Functions
            function openCart() {
                cartSidebar.classList.add('active');
                overlay.classList.add('active');
            }
            
            function closeCartSidebar() {
                cartSidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
            
            function addToCart(id, name, price, image) {
                // Check if item already exists in cart
                const existingItemIndex = cart.findIndex(item => item.id === id);
                
                if (existingItemIndex !== -1) {
                    // Update quantity if item already exists
                    cart[existingItemIndex].quantity += 1;
                } else {
                    // Add new item to cart
                    cart.push({
                        id: id,
                        name: name,
                        price: price,
                        image: image,
                        quantity: 1
                    });
                }
                
                // Update UI
                updateCartUI();
                
                // Show notification
                showNotification();
            }
            
            function updateCartUI() {
                // Update cart count
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                cartCount.textContent = totalItems;
                
                // Update cart items
                cartItems.innerHTML = '';
                
                if (cart.length === 0) {
                    emptyCartMessage.style.display = 'block';
                } else {
                    emptyCartMessage.style.display = 'none';
                    
                    cart.forEach((item, index) => {
                        const cartItem = document.createElement('div');
                        cartItem.className = 'cart-item';
                        cartItem.innerHTML = `
                            <div class="item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="item-details">
                                <div class="item-name">${item.name}</div>
                                <div class="item-price">$${item.price.toFixed(2)}</div>
                                <div class="item-quantity">
                                    <button class="quantity-btn minus" data-index="${index}">-</button>
                                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                                    <button class="quantity-btn plus" data-index="${index}">+</button>
                                </div>
                                <button class="remove-item" data-index="${index}">Remove</button>
                            </div>
                        `;
                        cartItems.appendChild(cartItem);
                    });
                    
                    // Add event listeners to quantity buttons and remove buttons
                    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                        btn.addEventListener('click', decreaseQuantity);
                    });
                    
                    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                        btn.addEventListener('click', increaseQuantity);
                    });
                    
                    document.querySelectorAll('.quantity-input').forEach(input => {
                        input.addEventListener('change', updateQuantity);
                    });
                    
                    document.querySelectorAll('.remove-item').forEach(btn => {
                        btn.addEventListener('click', removeItem);
                    });
                }
                
                // Update cart summary
                updateCartSummary();
            }
            
            function updateCartSummary() {
                const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                
                // Calculate delivery fee (free if subtotal is over threshold)
                const calculatedDeliveryFee = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
                
                const total = subtotal + calculatedDeliveryFee;
                
                subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
                deliveryFeeElement.textContent = calculatedDeliveryFee === 0 ? 'FREE' : `$${calculatedDeliveryFee.toFixed(2)}`;
                totalElement.textContent = `$${total.toFixed(2)}`;
            }
            
            function decreaseQuantity(e) {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCartUI();
                }
            }
            
            function increaseQuantity(e) {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart[index].quantity++;
                updateCartUI();
            }
            
            function updateQuantity(e) {
                const index = parseInt(e.target.getAttribute('data-index'));
                const newQuantity = parseInt(e.target.value);
                
                if (newQuantity > 0) {
                    cart[index].quantity = newQuantity;
                    updateCartUI();
                } else {
                    // If invalid quantity, reset to previous value
                    e.target.value = cart[index].quantity;
                }
            }
            
            function removeItem(e) {
                const index = parseInt(e.target.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCartUI();
            }
            
            function showNotification() {
                notification.classList.add('active');
                setTimeout(() => {
                    notification.classList.remove('active');
                }, 3000);
            }
            
            // Mobile Navigation Toggle
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');

            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Countdown Timer
            const target = new Date('2025-12-01T00:00:00Z').getTime();
            function tick(){
                const now = Date.now();
                const diff = target - now;
                if(diff<=0){
                    document.getElementById('countdown').innerHTML='<div style="padding:12px;background:var(--white);border-radius:10px">We are live!</div>';
                    return;
                }
                const days = Math.floor(diff / (1000*60*60*24));
                const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
                const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
                const seconds = Math.floor((diff % (1000*60)) / 1000);
                document.getElementById('days').textContent = String(days).padStart(2,'0');
                document.getElementById('hours').textContent = String(hours).padStart(2,'0');
                document.getElementById('minutes').textContent = String(minutes).padStart(2,'0');
                document.getElementById('seconds').textContent = String(seconds).padStart(2,'0');
            }
            setInterval(tick,1000);
            tick();
        });
                document.addEventListener('DOMContentLoaded', function () {
            // Find elements robustly
            const toggle = document.querySelector('.search-toggle');
            const container = document.getElementById('searchContainer');
            const input = document.getElementById('searchInput');

            if (!toggle) {
                console.error('Search toggle button not found (.search-toggle).');
                return;
            }
            if (!container || !input) {
                console.error('Search container or input not found (#searchContainer or #searchInput).');
                return;
            }

            // Toggle function
            function openSearch() {
                container.classList.add('open');
                container.setAttribute('aria-hidden', 'false');
                input.focus();
            }
            function closeSearch() {
                container.classList.remove('open');
                container.setAttribute('aria-hidden', 'true');
                input.value = '';
            }
            function toggleSearch() {
                if (container.classList.contains('open')) {
                closeSearch();
                } else {
                openSearch();
                }
            }

            // Click on icon toggles
            toggle.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleSearch();
            });

            // Click outside closes
            document.addEventListener('click', function (e) {
                if (!container.contains(e.target) && !toggle.contains(e.target)) {
                closeSearch();
                }
            });

            // Close on ESC
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' || e.key === 'Esc') {
                closeSearch();
                }
            });

            // Optional: handle Enter (for now just log search value)
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                const q = input.value.trim();
                if (q.length) {
                    // Replace the next line with real search logic or redirect, e.g:
                    // window.location.href = `search.html?q=${encodeURIComponent(q)}`;
                    console.log('Search for:', q);
                    // For demo, we'll close after "search"
                    closeSearch();
                }
                }
            });
            });

                y