
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
    