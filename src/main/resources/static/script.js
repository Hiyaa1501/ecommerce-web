const API_URL = "http://localhost:8080/api/products";
let cart = [];

window.onload = loadProducts;

async function loadProducts() {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderProducts(data);
}

function renderProducts(products) {
    const list = document.getElementById("product-list");
    list.innerHTML = products.map(p => `
        <div class="product-card">
            <h3>${p.name}</h3>
            <p>₹${p.price.toFixed(2)}</p>
            <div class="card-actions">
                <button onclick="addToCart('${p.name}', ${p.price})">Cart</button>
                <button onclick="deleteProduct(${p.id})";">Delete</button>
            </div>
        </div>
    `).join('');
}

function addToCart(name, price) {
    cart.push({ name, price: parseFloat(price) });
    updateCartUI();
}

function updateCartUI() {
    const cartList = document.getElementById("cart");
    const totalDisplay = document.getElementById("cart-total");

    cartList.innerHTML = cart.map((item, index) => `
        <li>
            <span>${item.name}</span> 
            <span>₹${item.price.toFixed(2)}</span>
        </li>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalDisplay.innerHTML = `<strong>Total: ₹${total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</strong>`;
}

async function deleteProduct(id) {
    if (!id || !confirm("Delete this product?")) return;

    try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`, {
            method: 'DELETE',
            // Do NOT add 'Content-Type' for a DELETE request with no body
        });

        if (response.ok) {
            console.log("Deleted!");
            loadProducts(); // Refresh UI
        }
    } catch (error) {
        console.error("CORS still blocking:", error);
    }
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add some items before checking out.");
        return;
    }

    // Calculate final total for the alert
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const formattedTotal = total.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR'
    });

    alert(`Order Placed Successfully!\nTotal Amount: ${formattedTotal}\n\nThank you for shopping at MyStore 2026.`);
    
    // Clear the cart after successful checkout
    cart = [];
    updateCartUI();
}

async function filterCategory() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    
    // 1. Fetch all products from your Spring Boot API
    const res = await fetch(API_URL);
    const allProducts = await res.json();

    // 2. Filter logic
    if (selectedCategory === "all") {
        renderProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => 
            p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
        );
        renderProducts(filtered);
    }
}

async function addProduct() {
    const name = document.getElementById("nameInput").value;
    const price = document.getElementById("priceInput").value;
    const category = document.getElementById("categoryInput").value; // Get category from dropdown

    if (!name || !price) {
        alert("Please fill all fields");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name: name, 
            price: parseFloat(price), 
            category: category 
        })
    });

    loadProducts(); // Refresh the list
}