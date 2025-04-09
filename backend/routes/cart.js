const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/authMiddleware");  // Ensure correct import
const { addToCart, getCart, updateCartQuantity, removeFromCart, placeOrder } = require("../controllers/cartController");

// Apply middleware correctly
router.post("/cart/add", authMiddleware, addToCart);
router.get("/cart", authMiddleware, getCart);
router.put("/cart/update", authMiddleware, updateCartQuantity);
router.delete("/cart/remove", authMiddleware, removeFromCart);
router.post("/cart/order", authMiddleware, placeOrder);

module.exports = router;
