// Include Paystack in your HTML head
// <script src="https://js.paystack.co/v1/inline.js"></script>

document.getElementById('paymentForm').addEventListener('submit', payWithPaystack);

function payWithPaystack(e) {
    e.preventDefault();
    
    let handler = PaystackPop.setup({
        key: 'pk_test_YOUR_PUBLIC_KEY', // Replace with your public key
        email: document.getElementById('email').value,
        amount: document.getElementById('amount').value, // Amount in kobo
        firstname: document.getElementById('first_name').value,
        lastname: document.getElementById('last_name').value,
        phone: document.getElementById('phone').value,
        ref: ''+Math.floor((Math.random() * 1000000000) + 1), // Generate unique reference
        metadata: {
            custom_fields: [
                {
                    display_name: "Order Items",
                    variable_name: "order_items",
                    value: "Lush Lips Gloss, Bat Luxe Lashes, etc."
                }
            ]
        },
        callback: function(response) {
            // Payment successful
            let reference = response.reference;
            alert('Payment complete! Reference: ' + reference);
            
            // Verify payment on your server
            verifyPayment(reference);
            
            // Redirect to success page
            window.location.href = "/order-success?reference=" + reference;
        },
        onClose: function() {
            alert('Transaction was not completed.');
        }
    });
    
    handler.openIframe();
}

// Function to verify payment (call your backend)
function verifyPayment(reference) {
    fetch('/verify-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reference: reference })
    })
    .then(response => response.json())
    .then(data => {
        if(data.status === 'success') {
            // Update order status
            console.log('Payment verified successfully');
        }
    });
}