document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsContainer = document.getElementById('cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Cart data (loaded from localStorage)
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Initialize everything
    function initCart() {
        renderCartItems();
        updateCartSummary();
        toggleEmptyCartMessage();
        updateCartCount(); // Added this line
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

        // Event listeners
        cartItem.querySelector('.minus').addEventListener('click', () => updateQuantity(index, -1));
        cartItem.querySelector('.plus').addEventListener('click', () => updateQuantity(index, 1));
        cartItem.querySelector('.remove-item').addEventListener('click', () => removeItem(index));

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
        updateCartCount(); // Added this line
    }

    // Remove item from cart
    function removeItem(index) {
        cart.splice(index, 1);
        saveCart();
        updateCartCount(); // Added this line
    }

    // Update cart summary
    function updateCartSummary() {
        const subtotal = calculateSubtotal();
        const shipping = 100; // Fixed shipping
        const total = subtotal + shipping;

        cartSubtotal.textContent = `P${subtotal.toFixed(2)}`;
        cartTotal.textContent = `P${total.toFixed(2)}`;
        cartSummary.style.display = cart.length > 0 ? 'block' : 'none';
    }

    // Helper functions
    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function toggleEmptyCartMessage() {
        emptyCartMessage.style.display = cart.length === 0 ? 'flex' : 'none';
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
        updateCartSummary();
        toggleEmptyCartMessage();
    }

    // Checkout handler
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert(`Order confirmed! Total: P${(calculateSubtotal() + 100).toFixed(2)}`);
        cart = [];
        saveCart();
    });

    initCart();
});

// External function to add items (called from product pages)
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product exists
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
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
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// Update cart count in header/navbar
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}
