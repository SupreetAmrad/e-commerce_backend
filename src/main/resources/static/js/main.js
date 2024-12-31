// Global Variables
let cart = [];
let products = [];

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const cartBtn = document.getElementById('cartBtn');
const searchInput = document.getElementById('searchInput');
const featuredProductsContainer = document.getElementById('featuredProducts');
const latestProductsContainer = document.getElementById('latestProducts');

// Bootstrap Modals
const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));

// Event Listeners
loginBtn.addEventListener('click', () => loginModal.show());
registerBtn.addEventListener('click', () => registerModal.show());
cartBtn.addEventListener('click', () => {
    updateCartModal();
    cartModal.show();
});

// Forms
document.getElementById('loginForm').addEventListener('submit', handleLogin);
document.getElementById('registerForm').addEventListener('submit', handleRegister);
document.getElementById('searchInput').addEventListener('input', handleSearch);

// API Functions
async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        displayProducts();
    } catch (error) {
        console.error('Error fetching products:', error);
        showAlert('Error loading products. Please try again later.', 'danger');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: formData.get('email'),
                password: formData.get('password'),
            }),
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            loginModal.hide();
            updateUIAfterLogin();
            showAlert('Successfully logged in!', 'success');
        } else {
            showAlert('Invalid credentials', 'danger');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Error during login. Please try again.', 'danger');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password'),
            }),
        });
        
        if (response.ok) {
            registerModal.hide();
            showAlert('Registration successful! Please login.', 'success');
        } else {
            showAlert('Registration failed. Please try again.', 'danger');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Error during registration. Please try again.', 'danger');
    }
}

// UI Functions
function displayProducts() {
    const featured = products.slice(0, 4);
    const latest = products.slice(4, 8);

    featuredProductsContainer.innerHTML = featured.map(createProductCard).join('');
    latestProductsContainer.innerHTML = latest.map(createProductCard).join('');
}

function createProductCard(product) {
    return `
        <div class="col-md-3 col-sm-6">
            <div class="card product-card">
                <img src="${product.imageUrl}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title product-title">${product.name}</h5>
                    <p class="card-text">${product.description.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="product-price">$${product.price}</span>
                        <button class="btn btn-primary" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        showAlert('Product added to cart!', 'success');
    }
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item d-flex align-items-center">
            <img src="${item.imageUrl}" class="cart-item-image me-3" alt="${item.name}">
            <div class="flex-grow-1">
                <h6>${item.name}</h6>
                <p class="mb-0">$${item.price} x ${item.quantity}</p>
            </div>
            <div>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    updateCartModal();
    showAlert('Product removed from cart', 'info');
}

async function handleSearch(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        displayProducts();
        return;
    }

    try {
        const response = await fetch(`/api/products/search?query=${encodeURIComponent(query)}`);
        const searchResults = await response.json();
        featuredProductsContainer.innerHTML = searchResults.map(createProductCard).join('');
        latestProductsContainer.innerHTML = '';
    } catch (error) {
        console.error('Search error:', error);
    }
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
});
