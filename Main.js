// main.js - Shared functionality for Tumedi's Pet Store

// ====================
// CART FUNCTIONALITY
// ====================

// Update cart count in header (shared across all pages)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems > 0 ? totalItems : '';
        element.style.display = totalItems > 0 ? 'flex' : 'none';
    });
}

// ====================
// PRODUCT CARD SYSTEM
// ====================

// Create product card with click handler
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <h3>${product.name}</h3>
        <p class="price">P${product.price.toFixed(2)}</p>
        <button class="add-to-cart">
            <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
    `;
    
    return card;
}

// Event delegation for all product cards
document.addEventListener('click', function(e) {
    if (e.target.closest('.add-to-cart')) {
        const card = e.target.closest('.product-card');
        const product = {
            id: card.dataset.id,
            name: card.querySelector('h3').textContent,
            price: parseFloat(card.querySelector('.price').textContent.replace('P', '')),
            image: card.querySelector('img').src
        };
        addToCart(product);
    }
});

// ====================
// MOBILE MENU
// ====================

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('nav ul');
    const navItems = document.querySelectorAll('nav ul li a');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('show-mobile-menu');
            mobileMenuBtn.classList.toggle('open');
        });
        
        // Close menu when clicking nav items
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                nav.classList.remove('show-mobile-menu');
                mobileMenuBtn.classList.remove('open');
            });
        });
    }
}

// ====================
// INITIALIZATION
// ====================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Close mobile menu on larger screens
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            const nav = document.querySelector('nav ul');
            const btn = document.getElementById('mobile-menu-btn');
            if (nav) nav.classList.remove('show-mobile-menu');
            if (btn) btn.classList.remove('open');
        }
    });
});

// ====================
// SHARED CART FUNCTIONS
// ====================

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product exists
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
    updateCartCount();
    
    // Show toast notification instead of alert
    showToast(`${product.name} added to cart!`);
}

// Notification system
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, 10);
}
