const API_URL = 'https://ecommerce-web-97xr.onrender.com/api/products';
 
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
 
/* ── Toast ── */
function showToast(msg, type = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    setTimeout(() => { t.className = 'toast'; }, 2800);
}
 
/* ── Step 1: Selection ── */
function selectTemplate(name, e) {
    const template = productTemplates[name];
    if (!template) return;
    document.getElementById("nameInput").value = name;
    document.getElementById("priceInput").value = template.price;
    document.getElementById("categoryInput").value = template.category;
    const btn = document.getElementById("addBtn");
    btn.disabled = false;
    document.querySelectorAll('.selectable-item').forEach(el => el.classList.remove('active'));
    if (e) e.currentTarget.classList.add('active');
}
 
/* ── Step 2: Add to DB ── */
async function addProduct() {
    const name = document.getElementById("nameInput").value;
    const price = document.getElementById("priceInput").value;
    const category = document.getElementById("categoryInput").value;
    if (!name) return showToast("Select a product first!", 'error');
    try {
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price: parseFloat(price), category })
        });
        document.getElementById("addBtn").disabled = true;
        document.getElementById("nameInput").value = '';
        document.getElementById("priceInput").value = '';
        document.querySelectorAll('.selectable-item').forEach(el => el.classList.remove('active'));
        showToast(`${name} added to store!`, 'success');
        loadProducts();
    } catch {
        showToast("Failed to add product.", 'error');
    }
}
 
/* ── Step 3: Load & Render ── */
async function loadProducts() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        renderProducts(data);
    } catch {
        document.getElementById("product-list").innerHTML = '<p class="state-msg">⚠ Server connecting... please wait.</p>';
        document.getElementById("product-count").textContent = '0 products';
    }
}
 
function renderProducts(products) {
    const list = document.getElementById("product-list");
    const countBadge = document.getElementById("product-count");
    countBadge.textContent = products.length + ' product' + (products.length !== 1 ? 's' : '');
 
    if (products.length === 0) {
        list.innerHTML = '<p class="state-msg">No products in store yet. Add one above!</p>';
        return;
    }
 
    const fallback = "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400";
    list.innerHTML = products.map(p => {
        const key = Object.keys(productTemplates).find(k => k.toLowerCase() === p.name.toLowerCase());
        const img = key ? productTemplates[key].img : fallback;
        const cat = p.category || 'general';
        return `
        <div class="product-card">
            <img src="${img}" alt="${p.name}" onerror="this.src='${fallback}'">
            <div class="product-info">
                <span class="product-category">${cat}</span>
                <h3>${p.name}</h3>
                <div class="product-price">₹${p.price.toLocaleString('en-IN')}</div>
                <div class="card-actions">
                    <button class="cart-btn" onclick="addToCart('${p.name}', ${p.price}, ${p.id})">Add to Cart</button>
                    <button class="del-btn" onclick="deleteProduct(${p.id})">Delete</button>
                </div>
            </div>
        </div>`;
    }).join('');
}
 
/* ── Cart ── */
async function addToCart(name, price, id) {
    cart.push({ name, price });
    updateCartUI();
    showToast(`${name} added to cart!`, 'success');
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    loadProducts();
}
 
function removeFromCart(index) {
    const removed = cart.splice(index, 1)[0];
    updateCartUI();
    showToast(`${removed.name} removed.`);
}
 
function updateCartUI() {
    const cartList = document.getElementById("cart");
    const totalDisplay = document.getElementById("cart-total");
    const emptyMsg = document.getElementById("cart-empty-msg");
    const countBadge = document.getElementById("cart-count");
 
    countBadge.textContent = cart.length + ' item' + (cart.length !== 1 ? 's' : '');
 
    if (cart.length === 0) {
        cartList.innerHTML = '';
        emptyMsg.style.display = 'flex';
        totalDisplay.innerHTML = '<span>Total</span><strong>₹0.00</strong>';
        return;
    }
 
    emptyMsg.style.display = 'none';
    cartList.innerHTML = cart.map((item, i) => `
        <li>
            <span class="item-name">${item.name}</span>
            <span class="item-price">₹${item.price.toLocaleString('en-IN')}</span>
            <button class="remove-btn" onclick="removeFromCart(${i})" title="Remove">✕</button>
        </li>`).join('');
 
    const total = cart.reduce((sum, i) => sum + i.price, 0);
    totalDisplay.innerHTML = `<span>Total</span><strong>₹${total.toLocaleString('en-IN')}</strong>`;
}
 
/* ── Search ── */
async function searchProducts() {
    const term = document.getElementById("search").value.toLowerCase();
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        renderProducts(data.filter(p => p.name.toLowerCase().includes(term)));
    } catch {}
}
 
/* ── Delete ── */
async function deleteProduct(id) {
    if (confirm("Remove this product from the store permanently?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        showToast("Product removed.", 'error');
        loadProducts();
    }
}
 
/* ── Checkout ── */
function checkout() {
    if (cart.length === 0) return showToast("Your cart is empty!", 'error');
    showToast("Order placed! Thank you for shopping at HIE.", 'success');
    setTimeout(() => { alert("Order Successful!\nThank you for shopping from HIE Store. 🎉"); }, 400);
    cart = [];
    updateCartUI();
}