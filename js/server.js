// ===== SÉASON - Backend Server (Node.js + Express) =====
// Chạy: npm install express cors && node server.js

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ===== IN-MEMORY DATABASE =====
let orders = [];
let orderIdCounter = 1000;

const products = [
  { id: 1, name: "Đầm Hoa Mùa Xuân", season: "spring", price: 650000, badge: "Mới", stock: 25, sizes: ["XS","S","M","L","XL"] },
  { id: 2, name: "Áo Blouse Linen", season: "spring", price: 420000, badge: "Bestseller", stock: 40, sizes: ["S","M","L","XL"] },
  { id: 3, name: "Set Áo Thun Summer", season: "summer", price: 380000, badge: "Hot", stock: 60, sizes: ["S","M","L","XL","XXL"] },
  { id: 4, name: "Quần Short Biển", season: "summer", price: 295000, badge: null, stock: 55, sizes: ["S","M","L","XL"] },
  { id: 5, name: "Áo Jacket Da Thu", season: "autumn", price: 1250000, badge: "Premium", stock: 15, sizes: ["S","M","L","XL"] },
  { id: 6, name: "Cardigan Len Thu", season: "autumn", price: 720000, badge: null, stock: 30, sizes: ["XS","S","M","L","XL"] },
  { id: 7, name: "Áo Phao Dáng Dài", season: "winter", price: 1890000, badge: "Mới", stock: 20, sizes: ["S","M","L","XL","XXL"] },
  { id: 8, name: "Áo Len Cổ Lọ", season: "winter", price: 550000, badge: "Bestseller", stock: 45, sizes: ["S","M","L","XL"] }
];

// ===== ROUTES =====

// GET /api/products — lấy tất cả sản phẩm
app.get("/api/products", (req, res) => {
  const { season, sort, q } = req.query;
  let result = [...products];

  if (season && season !== "all") {
    result = result.filter(p => p.season === season);
  }
  if (q) {
    const query = q.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(query));
  }
  if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
  else if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name, "vi"));

  res.json({ success: true, count: result.length, data: result });
});

// GET /api/products/:id — lấy sản phẩm theo ID
app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
  res.json({ success: true, data: product });
});

// GET /api/products/season/:season — sản phẩm theo mùa
app.get("/api/products/season/:season", (req, res) => {
  const valid = ["spring", "summer", "autumn", "winter"];
  const { season } = req.params;
  if (!valid.includes(season)) {
    return res.status(400).json({ success: false, message: "Mùa không hợp lệ. Chọn: spring, summer, autumn, winter" });
  }
  const result = products.filter(p => p.season === season);
  res.json({ success: true, season, count: result.length, data: result });
});

// POST /api/orders — tạo đơn hàng mới
app.post("/api/orders", (req, res) => {
  const { customerName, phone, address, items } = req.body;

  // Validate
  if (!customerName || !phone || !address || !items || !items.length) {
    return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin đơn hàng" });
  }

  // Check products exist & calculate total
  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const product = products.find(p => p.id === item.productId);
    if (!product) return res.status(404).json({ success: false, message: `Sản phẩm #${item.productId} không tồn tại` });
    if (!product.sizes.includes(item.size)) return res.status(400).json({ success: false, message: `Size ${item.size} không có cho "${product.name}"` });
    total += product.price * item.qty;
    orderItems.push({ ...product, size: item.size, qty: item.qty, subtotal: product.price * item.qty });
  }

  const order = {
    id: `ORD-${orderIdCounter++}`,
    customerName,
    phone,
    address,
    items: orderItems,
    total,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  console.log(`📦 Đơn hàng mới: ${order.id} - ${customerName} - ${total.toLocaleString("vi-VN")}₫`);

  res.status(201).json({
    success: true,
    message: "Đặt hàng thành công! Chúng tôi sẽ liên hệ xác nhận sớm.",
    data: order
  });
});

// GET /api/orders — lấy tất cả đơn hàng
app.get("/api/orders", (req, res) => {
  res.json({ success: true, count: orders.length, data: orders });
});

// GET /api/orders/:id — lấy đơn hàng theo ID
app.get("/api/orders/:id", (req, res) => {
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
  res.json({ success: true, data: order });
});

// PATCH /api/orders/:id/status — cập nhật trạng thái đơn hàng
app.patch("/api/orders/:id/status", (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
  }
  const order = orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
  order.status = status;
  order.updatedAt = new Date().toISOString();
  res.json({ success: true, message: "Cập nhật trạng thái thành công", data: order });
});

// GET /api/stats — thống kê
app.get("/api/stats", (req, res) => {
  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const seasonCount = products.reduce((acc, p) => { acc[p.season] = (acc[p.season] || 0) + 1; return acc; }, {});
  res.json({
    success: true,
    data: {
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      ordersByStatus: {
        pending: orders.filter(o => o.status === "pending").length,
        confirmed: orders.filter(o => o.status === "confirmed").length,
        shipping: orders.filter(o => o.status === "shipping").length,
        delivered: orders.filter(o => o.status === "delivered").length,
        cancelled: orders.filter(o => o.status === "cancelled").length,
      },
      productsBySeason: seasonCount
    }
  });
});

// Serve index.html for root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Endpoint không tồn tại" });
});

// Start server
app.listen(PORT, () => {
  console.log("\n🌿 ================================");
  console.log(`   SÉASON Fashion Store Server`);
  console.log("🌿 ================================");
  console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);
  console.log(`🛍️  Frontend:        http://localhost:${PORT}/`);
  console.log(`📦 API Products:    http://localhost:${PORT}/api/products`);
  console.log(`📋 API Orders:      http://localhost:${PORT}/api/orders`);
  console.log(`📊 API Stats:       http://localhost:${PORT}/api/stats`);
  console.log("================================\n");
});

module.exports = app;