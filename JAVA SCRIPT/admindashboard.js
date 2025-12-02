
        // Data storage
        let products = JSON.parse(localStorage.getItem('batluxe_products')) || [];
        let orders = JSON.parse(localStorage.getItem('batluxe_orders')) || [];
        let customers = JSON.parse(localStorage.getItem('batluxe_customers')) || [];

        // Initialize with sample data if empty
        if (products.length === 0) {
            products = [
                {
                    id: 1,
                    name: "BatLuxe Feline Lashes",
                    sku: "BLX-LS-001",
                    category: "lashes",
                    price: 24.99,
                    stock: 42,
                    status: "active",
                    description: "Premium luxury lashes for a dramatic look",
                    image: "https://images.unsplash.com/photo-1583494939362-4c6b63b29e76?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                },
                {
                    id: 2,
                    name: "Lush Lips Gloss - Pink Sparkle",
                    sku: "BLX-LG-001",
                    category: "lipgloss",
                    price: 18.99,
                    stock: 3,
                    status: "active",
                    description: "Non-sticky lip gloss with subtle sparkle",
                    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                },
                {
                    id: 3,
                    name: "Luxury Press-on Nails - French Tip",
                    sku: "BLX-PN-001",
                    category: "nails",
                    price: 29.99,
                    stock: 25,
                    status: "active",
                    description: "Elegant press-on nails with French tip design",
                    image: "https://images.unsplash.com/photo-1604658244477-623b31c87fd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                }
            ];
            localStorage.setItem('batluxe_products', JSON.stringify(products));
        }

        if (orders.length === 0) {
            orders = [
                {
                    id: "BLX-5876",
                    customerId: 1,
                    date: "2023-10-15",
                    total: 97.96,
                    status: "processing",
                    items: [
                        { productId: 1, name: "BatLuxe Feline Lashes", price: 24.99, quantity: 1 },
                        { productId: 2, name: "Lush Lips Gloss - Pink Sparkle", price: 18.99, quantity: 2 },
                        { productId: 3, name: "Luxury Press-on Nails - French Tip", price: 29.99, quantity: 1 }
                    ]
                },
                {
                    id: "BLX-5875",
                    customerId: 2,
                    date: "2023-10-14",
                    total: 43.98,
                    status: "shipped",
                    items: [
                        { productId: 1, name: "BatLuxe Feline Lashes", price: 24.99, quantity: 1 },
                        { productId: 2, name: "Lush Lips Gloss - Pink Sparkle", price: 18.99, quantity: 1 }
                    ]
                }
            ];
            localStorage.setItem('batluxe_orders', JSON.stringify(orders));
        }

        if (customers.length === 0) {
            customers = [
                {
                    id: 1,
                    name: "Jessica Parker",
                    email: "jessica@example.com",
                    phone: "+1 (555) 123-4567"
                },
                {
                    id: 2,
                    name: "Michael Brown",
                    email: "michael@example.com",
                    phone: "+1 (555) 987-6543"
                }
            ];
            localStorage.setItem('batluxe_customers', JSON.stringify(customers));
        }

        // DOM elements
        const menuToggle = document.getElementById('menuToggle');
        const adminSidebar = document.getElementById('adminSidebar');
        const menuItems = document.querySelectorAll('.menu-item');
        const contentSections = document.querySelectorAll('.content-section');
        const productsGrid = document.getElementById('productsGrid');
        const ordersTableBody = document.getElementById('ordersTableBody');
        const allOrdersTableBody = document.getElementById('allOrdersTableBody');
        const addProductBtn = document.getElementById('addProductBtn');
        const addProductModal = document.getElementById('addProductModal');
        const editProductModal = document.getElementById('editProductModal');
        const orderDetailsModal = document.getElementById('orderDetailsModal');
        const closeModals = document.querySelectorAll('.close-modal');
        const cancelProduct = document.getElementById('cancelProduct');
        const cancelEditProduct = document.getElementById('cancelEditProduct');
        const closeOrderDetails = document.getElementById('closeOrderDetails');
        const saveProduct = document.getElementById('saveProduct');
        const updateProduct = document.getElementById('updateProduct');
        const updateOrderStatus = document.getElementById('updateOrderStatus');
        const addProductForm = document.getElementById('addProductForm');
        const editProductForm = document.getElementById('editProductForm');
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notificationMessage');

        // Initialize the dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadProducts();
            loadOrders();
            updateDashboardStats();
            
            // Simulate a new order every 30 seconds for demo purposes
            setInterval(simulateNewOrder, 30000);
        });

        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('active');
        });

        // Dashboard navigation
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
                
                // Refresh data if needed
                if (target === 'products') {
                    loadProducts();
                } else if (target === 'orders') {
                    loadAllOrders();
                }
            });
        });

        // Modal controls
        addProductBtn.addEventListener('click', () => {
            addProductModal.classList.add('active');
        });

        closeModals.forEach(btn => {
            btn.addEventListener('click', () => {
                addProductModal.classList.remove('active');
                editProductModal.classList.remove('active');
                orderDetailsModal.classList.remove('active');
            });
        });

        cancelProduct.addEventListener('click', () => {
            addProductModal.classList.remove('active');
        });

        cancelEditProduct.addEventListener('click', () => {
            editProductModal.classList.remove('active');
        });

        closeOrderDetails.addEventListener('click', () => {
            orderDetailsModal.classList.remove('active');
        });

        // Add Product Form Submission
        addProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const productName = document.getElementById('productName').value;
            const productSku = document.getElementById('productSku').value;
            const productCategory = document.getElementById('productCategory').value;
            const productPrice = parseFloat(document.getElementById('productPrice').value);
            const productStock = parseInt(document.getElementById('productStock').value);
            const productStatus = document.getElementById('productStatus').value;
            const productDescription = document.getElementById('productDescription').value;

            const newProduct = {
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                name: productName,
                sku: productSku,
                category: productCategory,
                price: productPrice,
                stock: productStock,
                status: productStatus,
                description: productDescription,
                image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" // Default image
            };

            products.push(newProduct);
            localStorage.setItem('batluxe_products', JSON.stringify(products));
            
            showNotification("Product ${productName}  has been added successfully!", 'success');
            addProductForm.reset();
            loadProducts();
            updateDashboardStats();
        });

        // Save Product from Modal
        saveProduct.addEventListener('click', () => {
            const productName = document.getElementById('modalProductName').value;
            if (productName) {
                showNotification("Product ${productName} has been added successfully!", 'success');
                addProductModal.classList.remove('active');
                document.getElementById('modalProductForm').reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });

        // Update Product
        updateProduct.addEventListener('click', () => {
            const productId = parseInt(document.getElementById('editProductId').value);
            const productName = document.getElementById('editProductName').value;
            const productSku = document.getElementById('editProductSku').value;
            const productCategory = document.getElementById('editProductCategory').value;
            const productPrice = parseFloat(document.getElementById('editProductPrice').value);
            const productStock = parseInt(document.getElementById('editProductStock').value);
            const productStatus = document.getElementById('editProductStatus').value;
            const productDescription = document.getElementById('editProductDescription').value;

            const productIndex = products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                products[productIndex] = {
                    ...products[productIndex],
                    name: productName,
                    sku: productSku,
                    category: productCategory,
                    price: productPrice,
                    stock: productStock,
                    status: productStatus,
                    description: productDescription
                };

                localStorage.setItem('batluxe_products', JSON.stringify(products));
                showNotification("Product ${productName} has been updated successfully!", 'success');
                editProductModal.classList.remove('active');
                loadProducts();
            }
        });

        // Update Order Status
        updateOrderStatus.addEventListener('click', () => {
            const orderId = document.getElementById('orderId').textContent;
            const newStatus = document.getElementById('orderStatusSelect').value;

            const orderIndex = orders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = newStatus;
                localStorage.setItem('batluxe_orders', JSON.stringify(orders));
                showNotification("Order ${orderId} status updated to ${newStatus}", 'success');
                orderDetailsModal.classList.remove('active');
                loadOrders();
                loadAllOrders();
            }
        });

        // Load Products
        function loadProducts() {
            productsGrid.innerHTML = '';
            
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                
                const stockClass = product.stock < 10 ? 'stock-low' : 'stock-ok';
                const statusBadge = product.status === 'active' ? '<div class="product-badge">Active</div>' : '';
                
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        ${statusBadge}
                    </div>
                    <div class="product-info">
                        <div class="product-category">${product.category}</div>
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <div class="product-stock">
                            <span>Stock: <span class="${stockClass}">${product.stock}</span></span>
                            <span>SKU: ${product.sku}</span>
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-small edit-product" data-id="${product.id}">Edit</button>
                            <button class="btn btn-small btn-outline view-product">View</button>
                            <button class="btn btn-small btn-danger delete-product" data-id="${product.id}">Delete</button>
                        </div>
                    </div>
                `;
                
                productsGrid.appendChild(productCard);
            });
            
            // Add event listeners to edit and delete buttons
            document.querySelectorAll('.edit-product').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.getAttribute('data-id'));
                    openEditProductModal(productId);
                });
            });
            
            document.querySelectorAll('.delete-product').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.getAttribute('data-id'));
                    deleteProduct(productId);
                });
            });
        }

        // Load Orders for Dashboard
        function loadOrders() {
            ordersTableBody.innerHTML = '';
            
            // Show only recent orders (last 5)
            const recentOrders = orders.slice(-5);
            
            recentOrders.forEach(order => {
                const customer = customers.find(c => c.id === order.customerId) || { name: 'Unknown Customer' };
                const orderRow = document.createElement('tr');
                
                orderRow.innerHTML = `
                    <td>${order.id}</td>
                    <td>${customer.name}</td>
                    <td>${order.date}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td><button class="btn btn-small view-order" data-id="${order.id}">View</button></td>
                `;
                
                ordersTableBody.appendChild(orderRow);
            });
            
            // Add event listeners to view order buttons
            document.querySelectorAll('.view-order').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const orderId = e.target.getAttribute('data-id');
                    openOrderDetailsModal(orderId);
                });
            });
        }

        // Load All Orders for Orders Page
        function loadAllOrders() {
            allOrdersTableBody.innerHTML = '';
            
            orders.forEach(order => {
                const customer = customers.find(c => c.id === order.customerId) || { name: 'Unknown Customer' };
                const orderRow = document.createElement('tr');
                
                orderRow.innerHTML = `
                    <td>${order.id}</td>
                    <td>${customer.name}</td>
                    <td>${order.date}</td>
                    <td>$${order.total.toFixed(2)}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td><button class="btn btn-small view-order" data-id="${order.id}">View</button></td>
                `;
                
                allOrdersTableBody.appendChild(orderRow);
            });
            
            // Add event listeners to view order buttons
            document.querySelectorAll('.view-order').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const orderId = e.target.getAttribute('data-id');
                    openOrderDetailsModal(orderId);
                });
            });
        }

        // Open Edit Product Modal
        function openEditProductModal(productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                document.getElementById('editProductId').value = product.id;
                document.getElementById('editProductName').value = product.name;
                document.getElementById('editProductSku').value = product.sku;
                document.getElementById('editProductCategory').value = product.category;
                document.getElementById('editProductPrice').value = product.price;
                document.getElementById('editProductStock').value = product.stock;
                document.getElementById('editProductStatus').value = product.status;
                document.getElementById('editProductDescription').value = product.description;
                
                editProductModal.classList.add('active');
            }
        }

        // Open Order Details Modal
        function openOrderDetailsModal(orderId) {
            const order = orders.find(o => o.id === orderId);
            if (order) {
                const customer = customers.find(c => c.id === order.customerId) || { 
                    name: 'Unknown Customer', 
                    email: 'N/A', 
                    phone: 'N/A' 
                };
                
                document.getElementById('orderId').textContent = order.id;
                document.getElementById('orderCustomerName').textContent = customer.name;
                document.getElementById('orderCustomerEmail').textContent = customer.email;
                document.getElementById('orderCustomerPhone').textContent = customer.phone;
                document.getElementById('orderDate').textContent = order.date;
                document.getElementById('orderStatus').textContent = order.status;
                document.getElementById('orderTotal').textContent = order.total.toFixed(2);
                document.getElementById('orderStatusSelect').value = order.status;
                
                // Clear and populate order items
                const orderItemsContainer = document.getElementById('orderItems');
                orderItemsContainer.innerHTML = '';
                
                order.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'order-item';
                    itemElement.innerHTML = `
                        <span>${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    `;
                    orderItemsContainer.appendChild(itemElement);
                });
                
                orderDetailsModal.classList.add('active');
            }
        }

        // Delete Product
        function deleteProduct(productId) {
            if (confirm('Are you sure you want to delete this product?')) {
                products = products.filter(p => p.id !== productId);
                localStorage.setItem('batluxe_products', JSON.stringify(products));
                showNotification('Product deleted successfully!', 'success');
                loadProducts();
                updateDashboardStats();
            }
        }




           
            
            orders.push(newOrder);
            localStorage.setItem('batluxe_orders', JSON.stringify(orders));
            
            // Show notification
            showNotification("New order from ${randomCustomer} for $${randomTotal}", 'success');
            
            // Update dashboard
            loadOrders();
            loadAllOrders();
            updateDashboardStats();
        

        // Function to add a new order from checkout (to be called from checkout page)
        window.addNewOrder = function(orderData) {
            // Create a new customer if needed
            let customer = customers.find(c => c.email === orderData.email);
            if (!customer) {
                const newCustomerId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
                customer = {
                    id: newCustomerId,
                    name: orderData.name,
                    email: orderData.email,
                    phone: orderData.phone
                };
                customers.push(customer);
                localStorage.setItem('batluxe_customers', JSON.stringify(customers));
            }
            
        }