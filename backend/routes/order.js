const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const { createOrder, getAllOrders, updateOrderStatus, updatePaymentStatus } = require("../controllers/orderController");

router.post("/order/create", authMiddleware, createOrder);
router.get("/admin/orders", authMiddleware, adminMiddleware, getAllOrders);
router.put("/admin/orders/status", authMiddleware, adminMiddleware, updateOrderStatus);
router.put("/admin/orders/payment", authMiddleware, adminMiddleware, updatePaymentStatus);

module.exports = router;