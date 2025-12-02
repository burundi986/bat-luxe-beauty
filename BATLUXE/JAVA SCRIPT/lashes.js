

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
            const freeDeliveryThreshold = 5000.00; // Free delivery for orders over $5000
            
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
                deliveryFeeElement.textContent = calculatedDeliveryFee === 0 ? "FREE" : `$${calculatedDeliveryFee.toFixed(2)}`;
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
            
            // Currency Conversion Functionality
            const currencyBtn = document.querySelector('.currency-btn');
            const currencyDropdown = document.querySelector('.currency-dropdown');
            const currencyOptions = document.querySelectorAll('.currency-option');
            const selectedCurrency = document.querySelector('.selected-currency');
            const productPrices = document.querySelectorAll('.product-price');
            
            // Toggle dropdown visibility
            currencyBtn.addEventListener('click', function() {
                currencyDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                if (!event.target.closest('.currency-selector')) {
                    currencyDropdown.classList.remove('show');
                }
            });
            
            // Handle currency selection
            currencyOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const currency = this.getAttribute('data-currency');
                    const rate = parseFloat(this.getAttribute('data-rate'));
                    const symbol = this.getAttribute('data-symbol');
                    
                    // Update selected currency display
                    selectedCurrency.textContent = currency;
                    
                    // Update active state
                    currencyOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Convert all prices
                    convertPrices(rate, symbol);
                    
                    // Close dropdown
                    currencyDropdown.classList.remove('show');
                });
            });
            
            // Function to convert prices
            function convertPrices(rate, symbol) {
                productPrices.forEach(priceElement => {
                    const originalPrice = parseFloat(priceElement.getAttribute('data-original-price'));
                    const convertedPrice = (originalPrice * rate).toFixed(2);
                    
                    // Check if there's an old price (for sale items)
                    const oldPriceElement = priceElement.querySelector('.old-price');
                    if (oldPriceElement) {
                        const oldOriginalPrice = parseFloat(oldPriceElement.textContent.replace('$', ''));
                        const oldConvertedPrice = (oldOriginalPrice * rate).toFixed(2);
                        priceElement.innerHTML = `${symbol}${convertedPrice} <span class="old-price">${symbol}${oldConvertedPrice}</span>`;
                    } else {
                        priceElement.textContent = `${symbol}${convertedPrice}`;
                    }
                });
            }
            
            // Mobile Navigation Toggle
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');

            hamburger.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            // Wishlist Toggle
            const wishlistButtons = document.querySelectorAll('.wishlist-btn');
            
            wishlistButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const icon = button.querySelector('i');
                    button.classList.toggle('active');
                    
                    if (button.classList.contains('active')) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                    } else {
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                    }
                });
            });
        });

            checkoutBtn.addEventListener('click', function() {
                // Check if cart is empty
                if (cart.length === 0) {
                    showNotification('Your cart is empty! Add some products first.', 'error');
                    return;
                }
                
                // Prepare checkout data
                const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
                const calculatedDeliveryFee = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
                const total = subtotal + calculatedDeliveryFee;
                
                const checkoutData = {
                    items: cart,
                    subtotal: subtotal,
                    deliveryFee: calculatedDeliveryFee,
                    total: total,
                    timestamp: new Date().toISOString()
                };
                
                // Store checkout data in localStorage
                localStorage.setItem('batluxe_checkout_data', JSON.stringify(checkoutData));
                
                // Redirect to checkout page
                window.location.href = 'checkoutpage.html';
            });
            // Add this to your existing JavaScript on both home and shop pages

        // Checkout functionality
        const checkoutBtn = document.getElementById('checkoutBtn');

        checkoutBtn.addEventListener('click', function(e) {
            // Prevent default link behavior
            e.preventDefault();
            
            // Check if cart is empty
            if (cart.length === 0) {
                showNotification('Your cart is empty! Add some products first.', 'error');
                return;
            }
            
            // Prepare checkout data
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const calculatedDeliveryFee = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
            const total = subtotal + calculatedDeliveryFee;
            
            const checkoutData = {
                items: cart,
                subtotal: subtotal,
                deliveryFee: calculatedDeliveryFee,
                total: total,
                timestamp: new Date().toISOString()
            };
            
            // Store checkout data in localStorage
            localStorage.setItem('batluxe_checkout_data', JSON.stringify(checkoutData));
            
            // Redirect to checkout page
            window.location.href = 'checkoutpage.html';
        });

        // Enhanced notification function
        function showNotification(message = 'Item added to cart successfully!', type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            
            // Reset classes
            notification.className = 'notification';
            
            // Add type class
            notification.classList.add(type);
            notification.classList.add('active');
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
  checkoutBtn.addEventListener('click', function(e) {
    // Prevent default link behavior
    e.preventDefault();
    
    // Check if cart is empty
    if (cart.length === 0) {
        alert('Your cart is empty! Add some products first.');
        return;
    }
    
    // Prepare checkout data
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const calculatedDeliveryFee = subtotal >= freeDeliveryThreshold ? 0 : deliveryFee;
    const total = subtotal + calculatedDeliveryFee;
    
    // Store cart data in localStorage
    localStorage.setItem('batluxe_cart', JSON.stringify(cart));
    localStorage.setItem('batluxe_subtotal', subtotal.toFixed(2));
    localStorage.setItem('batluxe_delivery', calculatedDeliveryFee.toFixed(2));
    localStorage.setItem('batluxe_total', total.toFixed(2));
    
    // Redirect to checkout page
    window.location.href = 'checkoutpage.html';
 });