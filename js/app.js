// ===== SVG ILLUSTRATIONS =====
const svgs = {

    
  // Spring dress
  spring1: `<img src="img/dahoamuaxuan.png" alt="san pham" style="width: 100%; height: 100%; object-fit: contain;">`,
 
  // Spring blouse
    spring2: `<img src="img/xuan2.png" alt="san pham" style="width: 100%; height: 100%; object-fit: contain;">`,
  

  // Summer tshirt
  summer1:  `<img src="img/he1.png" alt="san pham" style="width: 100%; height: 100%; object-fit: contain;">`,

  // Summer shorts
  summer2:  `<img src="img/he2.png" alt="san pham" style="width: 100%; height: 100%; object-fit: contain;">`,
  
  // Autumn jacket
  autumn1 :  `<img src="img/thu1.png" alt="san pham" style="width: 100%; height: 100%; object-fit: contain;">`,
  

  // Autumn cardigan
  autumn2 :  `<img src="img/thu2.png" alt="san pham" style="width: 100%; height: 100%; object-fit: contain;">`,
 
  autumn2 :  `<img src="img/thu3.png" alt="san pham" style="width: 100%; height: 100%; object-fit: contain;">`,
  
  // Winter coat
  winter1 :  `<img src="img/dong1.png" alt="san pham" style="width: 100%; height: 100%; object-fit: contain;">`,
 
  // Winter sweater
  winter2 :  `<img src="img/dong2.png" alt="san pham" style="width: 100%; height: 100%; object-fit: contain;">`,
 
};

// ===== PRODUCT DATA =====
const products = [
  { id: 1, name: "Đầm Hoa Mùa Xuân", season: "spring", seasonLabel: "🌸 Mùa Xuân", price: 650000, badge: "Mới", svg: "spring1", desc: "Đầm hoa nhẹ nhàng, chất liệu lụa mềm mại, phù hợp cho các buổi dạo phố ngày xuân ấm áp.", sizes: ["XS","S","M","L","XL"] },
  { id: 2, name: "Áo Blouse Linen", season: "spring", seasonLabel: "🌸 Mùa Xuân", price: 420000, badge: "Bestseller", svg: "spring2", desc: "Áo blouse linen thoáng mát, họa tiết thêu tay tinh xảo, tone xanh lá tươi mát.", sizes: ["S","M","L","XL"] },
  { id: 3, name: "Set Áo Thun Summer", season: "summer", seasonLabel: "☀️ Mùa Hè", price: 380000, badge: "Hot", svg: "summer1", desc: "Áo thun cotton 100%, màu sắc nổi bật, co giãn tốt, thấm hút mồ hôi hiệu quả.", sizes: ["S","M","L","XL","XXL"] },
  { id: 4, name: "Quần Short Biển", season: "summer", seasonLabel: "☀️ Mùa Hè", price: 295000, badge: null, svg: "summer2", desc: "Quần short vải nhẹ, nhanh khô, kiểu dáng trẻ trung năng động cho mùa hè sôi động.", sizes: ["S","M","L","XL"] },
  { id: 5, name: "Áo Jacket Da Thu", season: "autumn", seasonLabel: "🍂 Mùa Thu", price: 1250000, badge: "Premium", svg: "autumn1", desc: "Áo jacket da bò thật, đường may thủ công, màu nâu đất ấm áp đặc trưng của mùa thu.", sizes: ["S","M","L","XL"] },
  { id: 6, name: "Cardigan Len Thu", season: "autumn", seasonLabel: "🍂 Mùa Thu", price: 720000, badge: null, svg: "autumn2", desc: "Cardigan len dệt thủ công, màu caramel ấm áp, phù hợp cho những ngày cuối thu se lạnh.", sizes: ["XS","S","M","L","XL"] },
  { id: 7, name: "Áo Phao Dáng Dài", season: "winter", seasonLabel: "❄️ Mùa Đông", price: 1890000, badge: "Mới", svg: "winter1", desc: "Áo phao lông vũ thật, giữ ấm xuất sắc, dáng dài thanh lịch phù hợp mọi hoàn cảnh.", sizes: ["S","M","L","XL","XXL"] },
  { id: 8, name: "Áo Len Cổ Lọ", season: "winter", seasonLabel: "❄️ Mùa Đông", price: 550000, badge: "Bestseller", svg: "winter2", desc: "Áo len cổ lọ dệt dày, màu tím thời thượng, ôm dáng đẹp, ấm áp suốt mùa đông.", sizes: ["S","M","L","XL"] }
];

// Season color themes
const seasonColors = {
  spring: "season-spring",
  summer: "season-summer",
  autumn: "season-autumn",
  winter: "season-winter"
};
const seasonTextColors = {
  spring: "#c06080",
  summer: "#8B6914",
  autumn: "#bf5000",
  winter: "#1a5280"
};

// ===== STATE =====
let cart = [];
let currentSeason = "all";
let filteredProducts = [...products];

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(products);
  window.addEventListener("scroll", handleScroll);
});

// ===== NAVBAR SCROLL =====
function handleScroll() {
  const nav = document.getElementById("navbar");
  nav.classList.toggle("scrolled", window.scrollY > 60);
}

// ===== SCROLL TO =====
function scrollTo(sel) {
  document.querySelector(sel)?.scrollIntoView({ behavior: "smooth" });
}

// ===== RENDER PRODUCTS =====
function renderProducts(list) {
  const grid = document.getElementById("productsGrid");
  if (!list.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;color:var(--clr-muted);padding:60px 0;">Không có sản phẩm nào</div>`;
    return;
  }
  grid.innerHTML = list.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.07}s" onclick="openModal(${p.id})">
      <div class="product-img ${seasonColors[p.season]}">
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}
        ${svgs[p.svg]}
      </div>
      <div class="product-info">
        <div class="product-season" style="color:${seasonTextColors[p.season]}">${p.seasonLabel}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-footer">
          <div class="product-price">${formatPrice(p.price)}</div>
          <button class="add-cart-btn" onclick="event.stopPropagation(); addToCart(${p.id})">+ Giỏ</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ===== FILTER BY SEASON =====
function filterSeason(season) {
  currentSeason = season;
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(`[data-season="${season}"]`).classList.add("active");
  filteredProducts = products.filter(p => p.season === season);
  renderProducts(filteredProducts);
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

// ===== SORT =====
function sortProducts(val) {
  let list = [...filteredProducts];
  if (val === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (val === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (val === "name") list.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  renderProducts(list);
}

// ===== CART =====
function addToCart(id, size = "M") {
  const p = products.find(x => x.id === id);
  const existing = cart.find(x => x.id === id && x.size === size);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...p, size, qty: 1 });
  }
  updateCartUI();
  showToast(`✓ Đã thêm "${p.name}" vào giỏ hàng`);
}

function removeFromCart(id, size) {
  cart = cart.filter(x => !(x.id === id && x.size === size));
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, x) => s + x.qty, 0);
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const countEl = document.getElementById("cartCount");
  countEl.textContent = count;
  countEl.classList.toggle("visible", count > 0);
  document.getElementById("cartTotal").textContent = formatPrice(total);

  const itemsEl = document.getElementById("cartItems");
  if (!cart.length) {
    itemsEl.innerHTML = `<p class="cart-empty">Giỏ hàng trống</p>`;
    return;
  }
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img ${seasonColors[item.season]}">${svgs[item.svg]}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name} <small style="opacity:.5">(${item.size})</small></div>
        <div class="cart-item-price">${formatPrice(item.price)} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id},'${item.size}')">✕</button>
    </div>
  `).join("");
}

function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("open");
  document.getElementById("cartOverlay").classList.toggle("open");
}

function checkout() {
  if (!cart.length) { showToast("Giỏ hàng trống!"); return; }
  showToast("🎉 Đặt hàng thành công! Cảm ơn bạn.");
  cart = [];
  updateCartUI();
  toggleCart();
}

// ===== MODAL =====
let selectedSize = "M";
function openModal(id) {
  const p = products.find(x => x.id === id);
  selectedSize = p.sizes[1] || p.sizes[0];
  document.getElementById("modalContent").innerHTML = `
    <div class="modal-product">
      <div class="modal-product-img ${seasonColors[p.season]}">${svgs[p.svg]}</div>
      <div class="modal-product-info">
        <div class="season-tag" style="color:${seasonTextColors[p.season]}">${p.seasonLabel}</div>
        <h2>${p.name}</h2>
        <p>${p.desc}</p>
        <div class="modal-price">${formatPrice(p.price)}</div>
        <p style="font-size:.8rem;color:var(--clr-muted);margin-bottom:8px">Chọn size:</p>
        <div class="size-picker">
          ${p.sizes.map(s => `<button class="size-btn ${s === selectedSize ? "selected" : ""}" onclick="selectSize('${s}',${p.id})">${s}</button>`).join("")}
        </div>
        <button class="btn-primary" onclick="addToCart(${p.id}, selectedSize); closeModal()">Thêm vào giỏ hàng</button>
      </div>
    </div>
  `;
  document.getElementById("modalOverlay").classList.add("open");
}
function selectSize(size, id) {
  selectedSize = size;
  document.querySelectorAll(".size-btn").forEach(b => b.classList.toggle("selected", b.textContent === size));
}
function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
}

// ===== MENU TOGGLE =====
function toggleMenu() {
  const links = document.querySelector(".nav-links");
  if (links.style.display === "flex") {
    links.style.display = "none";
  } else {
    links.style.display = "flex";
    links.style.flexDirection = "column";
    links.style.position = "fixed";
    links.style.top = "70px";
    links.style.left = "0";
    links.style.right = "0";
    links.style.background = "rgba(13,11,15,0.98)";
    links.style.padding = "24px";
    links.style.gap = "20px";
    links.style.backdropFilter = "blur(20px)";
    links.style.borderBottom = "1px solid var(--clr-border)";
  }
}

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

// ===== HELPERS =====
function formatPrice(n) {
  return n.toLocaleString("vi-VN") + "₫";
}