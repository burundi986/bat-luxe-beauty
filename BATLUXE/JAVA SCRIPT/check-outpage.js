
    
        // Mobile Navigation Toggle
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Checkout Steps Navigation
        const steps = document.querySelectorAll('.step');
        const formSections = document.querySelectorAll('.form-section');
        const nextToPaymentBtn = document.getElementById('next-to-payment');
        const backToShippingBtn = document.getElementById('back-to-shipping');
        const completeOrderBtn = document.getElementById('complete-order');
        const shippingSection = document.getElementById('shipping-section');
        const paymentSection = document.getElementById('payment-section');
        const confirmationSection = document.getElementById('confirmation-section');

        // Payment Method Selection
        const paymentMethods = document.querySelectorAll('.payment-method');
        const cardForm = document.getElementById('card-form');

        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('active'));
                method.classList.add('active');
                
                // Show card form only if credit card is selected
                if (method.dataset.method === 'card') {
                    cardForm.style.display = 'block';
                } else {
                    cardForm.style.display = 'none';
                }
            });
        });

        // Next to Payment Button
        nextToPaymentBtn.addEventListener('click', () => {
            // Validate shipping form
            const shippingForm = document.getElementById('shipping-form');
            if (!shippingForm.checkValidity()) {
                shippingForm.reportValidity();
                return;
            }
            
            // Update steps
            steps[0].classList.remove('active');
            steps[0].classList.add('completed');
            steps[1].classList.add('active');
            
            // Show payment section
            shippingSection.classList.remove('active');
            paymentSection.classList.add('active');
        });

        // Back to Shipping Button
        backToShippingBtn.addEventListener('click', () => {
            // Update steps
            steps[1].classList.remove('active');
            steps[0].classList.add('active');
            steps[0].classList.remove('completed');
            
            // Show shipping section
            paymentSection.classList.remove('active');
            shippingSection.classList.add('active');
        });

        // Complete Order Button
        completeOrderBtn.addEventListener('click', () => {
            // Validate payment form if credit card is selected
            const activePayment = document.querySelector('.payment-method.active');
            if (activePayment.dataset.method === 'card') {
                const paymentForm = document.getElementById('payment-form');
                if (!paymentForm.checkValidity()) {
                    paymentForm.reportValidity();
                    return;
                }
            }
            
            // Update steps
            steps[1].classList.remove('active');
            steps[1].classList.add('completed');
            steps[2].classList.add('active');
            
            // Show confirmation section
            paymentSection.classList.remove('active');
            confirmationSection.classList.add('active');
            
            // In a real application, you would process the payment here
            // and send order confirmation email
        });

        // Format card number input
        const cardNumberInput = document.getElementById('cardNumber');
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ').substr(0, 19) || value;
            e.target.value = formattedValue;
        });

        // Format expiry date input
        const expiryDateInput = document.getElementById('expiryDate');
        expiryDateInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // Format CVV input
        const cvvInput = document.getElementById('cvv');
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/gi, '').substr(0, 4);
        });
    