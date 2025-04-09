const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
    getAllProducts,
    getPopularProducts,
    getProductById,
    getProductsByCategory,
    addProduct,
    fetchLatestProducts, // Corrected to match controller
    updateProductStock,
    deleteProduct,
    getCategories,
} = require("../controllers/productsController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../frontend/src/Components/Assets/"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// Public routes (no auth required)
router.get("/products", getAllProducts);
router.get("/popular-products", getPopularProducts);
router.get("/product/:id", getProductById);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/categories", getCategories);
router.get("/products/latest", fetchLatestProducts); // Corrected route to match api.jsx

// Admin routes (require auth and admin role)
router.post("/products/add", authMiddleware, adminMiddleware, upload.single("image"), addProduct);
router.put("/products/stock", authMiddleware, adminMiddleware, updateProductStock);
router.delete("/products/delete", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;