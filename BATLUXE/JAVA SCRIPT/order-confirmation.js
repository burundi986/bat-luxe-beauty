
        document.addEventListener('DOMContentLoaded', function() {
            // Retrieve order data
            const orderData = JSON.parse(localStorage.getItem('batluxe_last_order'));
            const orderDetails = document.getElementById('orderDetails');
            
            if (orderData) {
                orderDetails.innerHTML = `
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                    <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
                    <p><strong>Total Amount:</strong> $${orderData.total.toFixed(2)}</p>
                    <p><strong>Shipping to:</strong> ${orderData.customer.shipping.firstName} ${orderData.customer.shipping.lastName}</p>
                    <p><strong>Email:</strong> ${orderData.customer.shipping.email}</p>
                `;
            } else {
                orderDetails.innerHTML = '<p>No order details found.</p>';
            }
        });
    