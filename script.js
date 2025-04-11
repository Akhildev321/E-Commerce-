// DOM Elements
const productList = document.getElementById('productList');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const emptyCartBtn = document.getElementById('emptyCart');
const checkoutBtn = document.getElementById('checkoutButton');
const searchBtn = document.querySelector('.search-btn');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.querySelector('.close-search');
const searchInput = document.getElementById('searchInput');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const loadingSpinner = document.getElementById('loadingSpinner');
const toast = document.getElementById('toast');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const newsletterForm = document.getElementById('newsletterForm');

// Sample Product Data
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 999,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1695048133021-7c5b5a6b6b1f",
        rating: 4.8,
        description: "The latest iPhone with Pro camera system"
    },
    {
        id: 2,
        name: "Samsung Galaxy S23",
        price: 799,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1676046187316-0e79a7865df8",
        rating: 4.6,
        description: "Powerful Android smartphone with amazing camera"
    },
    {
        id: 3,
        name: "Sony WH-1000XM5",
        price: 349,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1655720828014-aea5a5be7090",
        rating: 4.7,
        description: "Industry-leading noise canceling headphones"
    },
    {
        id: 4,
        name: "Nike Air Max 270",
        price: 150,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        rating: 4.5,
        description: "Comfortable lifestyle sneakers"
    },
    {
        id: 5,
        name: "Levi's 501 Jeans",
        price: 69,
        category: "clothing",
        image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c",
        rating: 4.3,
        description: "Classic fit jeans for everyday wear"
    },
    {
        id: 6,
        name: "Dyson V11 Vacuum",
        price: 599,
        category: "home",
        image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924",
        rating: 4.9,
        description: "Cordless vacuum with powerful suction"
    },
    {
        id: 7,
        name: "Instant Pot Duo",
        price: 89,
        category: "home",
        image: "https://images.unsplash.com/photo-1585238342024-78d387f4a707",
        rating: 4.7,
        description: "7-in-1 multi-functional pressure cooker"
    },
    {
        id: 8,
        name: "Kindle Paperwhite",
        price: 139,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
        rating: 4.6,
        description: "Waterproof e-reader with glare-free display"
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the app
function init() {
    renderProducts();
    updateCart();
    setupEventListeners();
}

// Render Products
function renderProducts(productsToRender = products) {
    // Show loading spinner
    loadingSpinner.classList.add('active');
    
    // Clear existing products
    productList.innerHTML = '';
    
    // Simulate API delay
    setTimeout(() => {
        if (productsToRender.length === 0) {
            productList.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        } else {
            productsToRender.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-rating">
                            ${renderRatingStars(product.rating)}
                        </div>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <div class="product-actions">
                            <button class="btn btn-primary" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                            <button class="btn btn-secondary" onclick="showProductDetails(${product.id})">
                                <i class="fas fa-info-circle"></i> Details
                            </button>
                        </div>
                    </div>
                `;
                productList.appendChild(productCard);
            });
        }
        
        // Hide loading spinner
        loadingSpinner.classList.remove('active');
    }, 800);
}

// Render rating stars
function renderRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars + 1 && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}

// Filter Products
function filterProducts() {
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;
    
    let filteredProducts = products;
    
    // Filter by category
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Filter by price
    if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        
        if (priceRange.endsWith('+')) {
            filteredProducts = filteredProducts.filter(product => product.price >= min);
        } else {
            filteredProducts = filteredProducts.filter(product => 
                product.price >= min && product.price <= max
            );
        }
    }
    
    renderProducts(filteredProducts);
}

// Search Products
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    renderProducts(filteredProducts);
}

// Show product details (would normally be a modal)
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showToast(`Showing details for ${product.name}`, 'info');
        // In a real app, this would open a modal with full product details
    }
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        showToast(`${product.name} added to cart`, 'success');
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showToast('Item removed from cart', 'error');
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity > 0) {
            item.quantity = newQuantity;
        } else {
            removeFromCart(productId);
            return;
        }
        
        updateCart();
    }
}

function emptyCart() {
    cart = [];
    updateCart();
    showToast('Cart emptied', 'warning');
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    // In a real app, this would redirect to checkout or open a checkout modal
    showToast(`Checkout complete! Total: $${calculateTotal().toFixed(2)}`, 'success');
    emptyCart();
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update Cart UI
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    cartTotal.textContent = `$${calculateTotal().toFixed(2)}`;
}

// Toggle Cart
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
}

// Toggle Search Modal
function toggleSearchModal() {
    searchModal.classList.toggle('active');
    if (searchModal.classList.contains('active')) {
        searchInput.focus();
    }
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

// Show Toast Notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'toast active';
    toast.classList.add(type);
    
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.classList.remove(type), 300);
    }, 3000);
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart
    cartToggle.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);
    emptyCartBtn.addEventListener('click', emptyCart);
    checkoutBtn.addEventListener('click', checkout);
    
    // Search
    searchBtn.addEventListener('click', toggleSearchModal);
    closeSearch.addEventListener('click', toggleSearchModal);
    searchInput.addEventListener('input', (e) => searchProducts(e.target.value));
    
    // Mobile Menu
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Filters
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    
    // Newsletter Form
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value;
        // In a real app, you would send this to your backend
        showToast('Thanks for subscribing!', 'success');
        e.target.reset();
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);