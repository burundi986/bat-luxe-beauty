
        // Mobile Navigation Toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Auth Tabs Functionality
        const authTabs = document.querySelectorAll('.auth-tab');
        const authForms = document.querySelectorAll('.auth-form');
        const switchToSignupLinks = document.querySelectorAll('.switch-to-signup');
        const switchToLoginLinks = document.querySelectorAll('.switch-to-login');

        // Switch tab function
        function switchTab(tabName) {
            // Update tabs
            authTabs.forEach(tab => {
                if (tab.dataset.tab === tabName) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Update forms
            authForms.forEach(form => {
                if (form.id === `${tabName}Form`) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
        }

        // Tab click events
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchTab(tab.dataset.tab);
            });
        });

        // Switch to signup
        switchToSignupLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab('signup');
            });
        });

        // Switch to login
        switchToLoginLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchTab('login');
            });
        });

        // Show Notification
        function showNotification(message, type = 'info') {
            const notification = document.getElementById('notification');
            const notificationTitle = document.getElementById('notificationTitle');
            const notificationMessage = document.getElementById('notificationMessage');
            
            notificationMessage.textContent = message;
            
            // Set notification type
            notification.className = 'notification';
            if (type === 'success') {
                notification.classList.add('notification-success');
                notificationTitle.textContent = 'Success!';
            } else if (type === 'error') {
                notification.classList.add('notification-error');
                notificationTitle.textContent = 'Error!';
            } else {
                notificationTitle.textContent = 'Info';
            }
            
            notification.classList.add('active');
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                notification.classList.remove('active');
            }, 5000);
        }

        // Login Form Submission
        const loginForm = document.getElementById('loginFormElement');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Basic validation
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing In...';
            submitBtn.disabled = true;
            
            try {
                // In a real application, you would make an API call here
                // For demo purposes, we'll simulate an API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate successful login
                if (email === 'demo@batluxe.com' && password === 'password') {
                    showNotification('Login successful! Redirecting...', 'success');
                    
                    // Store user data in localStorage
                    localStorage.setItem('batluxe_user', JSON.stringify({
                        id: 1,
                        email: email,
                        firstName: 'Demo',
                        lastName: 'User',
                        isLoggedIn: true
                    }));
                    
                    // Store auth token
                    localStorage.setItem('batluxe_token', 'demo-auth-token');
                    
                    // Redirect to dashboard or previous page
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showNotification('Invalid email or password', 'error');
                }
            } catch (error) {
                showNotification('Login failed. Please try again.', 'error');
                console.error('Login error:', error);
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        // Signup Form Submission
        const signupForm = document.getElementById('signupFormElement');
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const firstName = document.getElementById('signupFirstName').value;
            const lastName = document.getElementById('signupLastName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('signupPhone').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // Validation
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8  characters', 'error');
                return;
            }
            
            if (!agreeTerms) {
                showNotification('Please agree to the Terms of Service', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;
            
            try {
                // In a real application, you would make an API call here
                // For demo purposes, we'll simulate an API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Simulate successful registration
                showNotification('Account created successfully! Welcome to BatLuxe Beauty.', 'success');
                
                // Store user data in localStorage
                localStorage.setItem('batluxe_user', JSON.stringify({
                    id: Math.floor(Math.random() * 1000),
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    isLoggedIn: true
                }));
                
                // Store auth token
                localStorage.setItem('batluxe_token', 'demo-auth-token');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 2000);
            } catch (error) {
                showNotification('Registration failed. Please try again.', 'error');
                console.error('Signup error:', error);
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });

        // Social Login Buttons
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const provider = button.classList.contains('google') ? 'Google' : 'Facebook';
                showNotification(`${provider} authentication would be implemented here`, 'info');
            });
        });

        // Forgot Password
        const forgotPasswordLink = document.querySelector('.forgot-password');
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Password reset functionality would be implemented here', 'info');
        });

        // Newsletter Form
        const newsletterForm = document.getElementById('newsletterForm');
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            newsletterForm.reset();
        });

        // Terms and Privacy Policy links
        document.querySelectorAll('a[href="#"]').forEach(link => {
            if (link.textContent.includes('Terms of Service') || link.textContent.includes('Privacy Policy')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    showNotification('This would open the Terms of Service or Privacy Policy page', 'info');
                });
            }
        });

        // Check if user is already logged in
        document.addEventListener('DOMContentLoaded', () => {
            const userData = localStorage.getItem('batluxe_user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.isLoggedIn) {
                    // Update navigation to show user is logged in
                    const userIcon = document.querySelector('.fa-user');
                    userIcon.style.color = 'var(--dark-pink)';
                    
                    // You could also show a welcome message
                    console.log('User is logged in:', user.firstName);
                }
            }
        });
