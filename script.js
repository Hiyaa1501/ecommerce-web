const API_URL = 'https://ecommerce-web-97xr.onrender.com';

let cart = [];

const productTemplates = {
    'Iphone': { price: 75000, category: 'electronics', img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400' },
    'Android Phone': { price: 25000, category: 'electronics', img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400' },
    'Laptop': { price: 65000, category: 'electronics', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
    'OnePlus Buds': { price: 4999, category: 'electronics', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400' },
    'Smart Watch': { price: 12000, category: 'electronics', img: 'https://images.unsplash.com/photo-1544117518-30dd0f7a5932?w=400' },
    'Backpack': { price: 2500, category: 'clothing', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
    'Top': { price: 1200, category: 'clothing', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400' },
    'Sneakers': { price: 5500, category: 'clothing', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    'Sunglasses': { price: 1800, category: 'clothing', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400' }
};

window.onload = loadProducts;

// Step 1: Selection Logic
function selectTemplate(name) {
    const template = productTemplates[name];
    if (template) {
        document.getElementById("nameInput").value = name;
        document.getElementById("priceInput").value = template.price;
        document.getElementById("categoryInput").value = template.category;
        
        const btn = document.getElementById("addBtn");
        btn.disabled = false;
        btn.style.opacity = "1";

        document.querySelectorAll('.selectable-item').forEach(el => el.classList.remove('active'));
        // Highlighting the selected item
        event.currentTarget.classList.add('active');
    }
}

// Step 2: Add to Database
async function addProduct() {
    const name = document.getElementById("nameInput").value;
    const price = document.getElementById("priceInput").value;
    const category = document.getElementById("categoryInput").value;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: parseFloat(price), category })
    });
    
    document.getElementById("addBtn").disabled = true;
    loadProducts(); // Refresh store list
}

// Step 3: Display Store Items
async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        renderProducts(data);
    } catch (err) { console.log("Backend offline..."); }
}

function renderProducts(products) {
    const list = document.getElementById("product-list");
    const fallback = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400";

    list.innerHTML = products.map(p => {
        const key = Object.keys(productTemplates).find(k => k.toLowerCase() === p.name.toLowerCase());
        const img = key ? productTemplates[key].img : fallback;

        return `
            <div class="product-card">
                <img src="${img}" onerror="this.src='${fallback}'">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>₹${p.price.toLocaleString('en-IN')}</p>
                    <div class="card-actions">
                        <button class="cart-btn" onclick="addToCart('${p.name}', ${p.price}, ${p.id})">Add to Cart</button>
                        <button class="del-btn" onclick="deleteProduct(${p.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// THE "INVENTORY" LOGIC: Move from Store to Cart
async function addToCart(name, price, id) {
    // Add to Cart Array
    cart.push({ name, price });
    updateCartUI();

    // Delete from Store DB so it disappears from the shelf
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadProducts(); 
}

function updateCartUI() {
    const cartList = document.getElementById("cart");
    const totalDisplay = document.getElementById("cart-total");
    cartList.innerHTML = cart.map(i => `<li><span>${i.name}</span> <span>₹${i.price.toLocaleString('en-IN')}</span></li>`).join('');
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    totalDisplay.innerHTML = `<strong>Total: ₹${total.toLocaleString('en-IN')}</strong>`;
}

async function searchProducts() {
    const term = document.getElementById("search").value.toLowerCase();
    const res = await fetch(API_URL);
    const data = await res.json();
    renderProducts(data.filter(p => p.name.toLowerCase().includes(term)));
}

async function deleteProduct(id) {
    if(confirm("Remove from store?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadProducts();
    }
}

function checkout() {
    if (cart.length === 0) return alert("Cart empty!");
    alert("Order Successful!! \nThankyou for shopping from HIE .");
    cart = [];
    updateCartUI();
}