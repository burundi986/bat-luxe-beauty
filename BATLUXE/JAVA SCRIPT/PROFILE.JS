
        // Mobile Navigation Toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Dashboard Navigation
        const menuItems = document.querySelectorAll('.menu-item');
        const contentSections = document.querySelectorAll('.content-section');

        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active class from all menu items and sections
                menuItems.forEach(i => i.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked menu item
                item.classList.add('active');
                
                // Show corresponding content section
                const target = item.getAttribute('data-target');
                document.getElementById(target).classList.add('active');
            });
        });

        // Remove from wishlist functionality
        const removeWishlistButtons = document.querySelectorAll('.wishlist-actions .btn-outline');
        removeWishlistButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const wishlistItem = button.closest('.wishlist-item');
                wishlistItem.style.opacity = '0';
                setTimeout(() => {
                    wishlistItem.remove();
                }, 300);
            });
        });

        // Remove address functionality
        const removeAddressButtons = document.querySelectorAll('.address-actions .btn-outline');
        removeAddressButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const addressCard = button.closest('.address-card');
                if (!addressCard.classList.contains('default')) {
                    addressCard.style.opacity = '0';
                    setTimeout(() => {
                        addressCard.remove();
                    }, 300);
                } else {
                    alert('Cannot remove default address. Please set another address as default first.');
                }
            });
        });

        // Settings form submission
        const settingsForm = document.querySelector('.settings-form');
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Your account settings have been updated successfully!');
        });
    
        // Dashboard navigation functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Menu item click handling
            const menuItems = document.querySelectorAll('.menu-item');
            const contentSections = document.querySelectorAll('.content-section');
            
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    const targetId = this.getAttribute('data-target');
                    
                    // Remove active class from all menu items and content sections
                    menuItems.forEach(menuItem => menuItem.classList.remove('active'));
                    contentSections.forEach(section => section.classList.remove('active'));
                    
                    // Add active class to clicked menu item and corresponding content section
                    this.classList.add('active');
                    document.getElementById(targetId).classList.add('active');
                });
            });
            
            // Logout button functionality
            const logoutBtn = document.querySelector('.logout-btn');
            logoutBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to log out?')) {
                    // Redirect to login page or homepage
                    window.location.href = 'index.html';
                }
            });
            
            // Password visibility toggle
            const passwordToggles = document.querySelectorAll('.password-toggle');
            passwordToggles.forEach(toggle => {
                toggle.addEventListener('click', function() {
                    const input = this.parentElement.querySelector('input');
                    const icon = this.querySelector('i');
                    
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                });
            });
            
            // Form submission handling
            const accountForm = document.getElementById('accountSettingsForm');
            if (accountForm) {
                accountForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Basic validation
                    const newPassword = document.getElementById('newPassword').value;
                    const confirmPassword = document.getElementById('confirmPassword').value;
                    
                    if (newPassword && newPassword !== confirmPassword) {
                        alert('New password and confirm password do not match.');
                        return;
                    }
                    
                    // In a real application, you would send this data to the server
                    alert('Account settings updated successfully!');
                });
            }
            
            // Hamburger menu for mobile
            const hamburger = document.querySelector('.hamburger');
            const navLinks = document.querySelector('.nav-links');
            
            if (hamburger) {
                hamburger.addEventListener('click', function() {
                    navLinks.classList.toggle('active');
                });
            }
            
            // Add address button functionality
            const addAddressBtn = document.getElementById('addAddressBtn');
            if (addAddressBtn) {
                addAddressBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('Address form would open here. In a real application, this would show a modal with an address form.');
                });
            }
            
            // Update order dates to current year
            const currentYear = new Date().getFullYear();
            const orderDates = document.querySelectorAll('.order-date');
            orderDates.forEach(dateElement => {
                dateElement.textContent = dateElement.textContent.replace(/202[0-9]/g, currentYear);
            });
            
            const orderIds = document.querySelectorAll('.order-id');
            orderIds.forEach(idElement => {
                idElement.textContent = idElement.textContent.replace(/BLX-202[0-9]/g, `BLX-${currentYear}`);
            });
            
            // Update currency in any JavaScript-generated content
            document.addEventListener('DOMContentLoaded', function() {
                // This ensures any dynamically added content will also use GBP
                const currencyObserver = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length) {
                            // Check and update any new nodes
                            mutation.addedNodes.forEach(function(node) {
                                if (node.nodeType === 1) { // Element node
                                    const textNodes = node.querySelectorAll('*');
                                    textNodes.forEach(function(element) {
                                        if (element.textContent.includes('$')) {
                                            element.textContent = element.textContent.replace(/\$/g, '£');
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
                
                // Start observing the document body for added nodes
                currencyObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        });