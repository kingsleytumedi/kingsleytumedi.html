// cart.js - Tumedi's Pet Store Cart Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Cart data structure
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize the cart display
    function initCart() {
        renderCartItems();
        updateCartSummary();
        toggleEmptyCartMessage();
    }

    // Render all cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach((item, index) => {
            const cartItemElement = createCartItemElement(item, index);
            cartItemsContainer.appendChild(cartItemElement);
        });
    }

    // Create HTML for a single cart item
    function createCartItemElement(item, index) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.id;

        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="price">P${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                </div>
            </div>
            <button class="remove-item"><i class="fas fa-trash"></i></button>
        `;

        // Add event listeners to the buttons
        const minusBtn = cartItem.querySelector('.minus');
        const plusBtn = cartItem.querySelector('.plus');
        const removeBtn = cartItem.querySelector('.remove-item');

        minusBtn.addEventListener('click', () => updateQuantity(index, -1));
        plusBtn.addEventListener('click', () => updateQuantity(index, 1));
        removeBtn.addEventListener('click', () => removeItem(index));

        return cartItem;
    }

    // Update item quantity
    function updateQuantity(index, change) {
        const newQuantity = cart[index].quantity + change;
        
        if (newQuantity < 1) {
            removeItem(index);
            return;
        }
        
        cart[index].quantity = newQuantity;
        saveCart();
        renderCartItems();
        updateCartSummary();
    }

    // Remove item from cart
    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        renderCartItems();
        updateCartSummary();
        toggleEmptyCartMessage();
    }

    // Update cart summary (subtotal, total, etc.)
    function updateCartSummary() {
        const subtotal = calculateSubtotal();
        const shipping = 100; // Fixed shipping cost
        const total = subtotal + shipping;

        cartSubtotal.textContent = `P${subtotal.toFixed(2)}`;
        cartTotal.textContent = `P${total.toFixed(2)}`;

        // Show/hide summary based on cart content
        if (cart.length > 0) {
            cartSummary.style.display = 'block';
        } else {
            cartSummary.style.display = 'none';
        }
    }

    // Calculate subtotal
    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Toggle empty cart message
    function toggleEmptyCartMessage() {
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'flex';
        } else {
            emptyCartMessage.style.display = 'none';
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Checkout button handler
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // In a real implementation, this would redirect to a checkout page
        alert(`Order confirmed! Total: P${calculateSubtotal().toFixed(2)}`);
        
        // Clear the cart after checkout
        cart = [];
        saveCart();
        renderCartItems();
        updateCartSummary();
        toggleEmptyCartMessage();
    });

    // Initialize the cart when page loads
    initCart();
});

// Function to add items to cart (to be called from product pages)
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show confirmation
    alert(`${product.name} added to cart!`);
    
    // Update cart count in header (if you implement it)
    updateCartCount();
}

// Function to update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        element.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
}
