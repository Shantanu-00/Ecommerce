const db = require("../config/db");

exports.getAllProducts = async (req, res) => {
    try {
        const [results] = await db.query(
            "SELECT DISTINCT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id"
        );
        res.json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.getPopularProducts = async (req, res) => {
    try {
        const [results] = await db.query(
            "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id WHERE p.popular = 1 ORDER BY RAND() LIMIT 4"
        );
        res.json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.getProductById = async (req, res) => {
  const productId = req.params.id;
  try {
      const [results] = await db.query(
          "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id WHERE p.product_id = ?",
          [productId]
      );
      if (results.length === 0) {
          return res.status(404).json({ success: false, message: "Product not found" });
      }
      res.json({ success: true, data: results[0] });
  } catch (err) {
      console.error("Get product by ID error:", err);
      res.status(500).json({ success: false, message: "Database error" });
  }
};

exports.searchProducts = async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ success: false, message: "Query parameter is required" });
    try {
        const [results] = await db.query(
            "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.category_id WHERE p.name LIKE ? OR p.description LIKE ?",
            [`%${query}%`, `%${query}%`]
        );
        res.json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.getProductsByCategory = async (req, res) => {
    const categoryId = req.params.categoryId;
    try {
        const [results] = await db.query(
            "SELECT p.*, c.name as category_name FROM products p JOIN categories c ON p.category_id = c.category_id WHERE p.category_id = ?",
            [categoryId]
        );
        res.json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.addProduct = async (req, res) => {
    const { name, description, price, stock, popular, category_tags } = req.body;
    const image_url = req.file ? req.file.filename : "default.jpg"; // Use uploaded file or default

    try {
        // Handle category tags (e.g., "#watches #electronics")
        const tags = category_tags.split(" ").map(tag => tag.replace("#", "").trim()).filter(tag => tag);
        let category_id = null;

        if (tags.length > 0) {
            const primaryTag = tags[0]; // Use first tag as primary category
            const [category] = await db.query("SELECT category_id FROM categories WHERE name = ?", [primaryTag]);
            if (category.length > 0) {
                category_id = category[0].category_id;
            } else {
                const [result] = await db.query("INSERT INTO categories (name) VALUES (?)", [primaryTag]);
                category_id = result.insertId;
            }
        }

        await db.query(
            "INSERT INTO products (name, image_url, price, description, stock, popular, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [name, image_url, price, description, stock, popular ? 1 : 0, category_id]
        );
        res.json({ success: true, message: "Product added" });
    } catch (err) {
        console.error("Add product error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.updateProductStock = async (req, res) => {
    const { product_id, stock } = req.body;
    try {
        await db.query("UPDATE products SET stock = ? WHERE product_id = ?", [stock, product_id]);
        res.json({ success: true, message: "Stock updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.deleteProduct = async (req, res) => {
    const { product_id } = req.body;
    try {
        await db.query("DELETE FROM products WHERE product_id = ?", [product_id]);
        res.json({ success: true, message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const [categories] = await db.query("SELECT * FROM categories");
        res.json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.fetchLatestProducts = async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT 
                p.product_id,
                p.name,
                p.price,
                p.image_url,
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.category_id
            ORDER BY p.created_at DESC
            LIMIT 10
        `);
        res.json(products); // Returning raw array since LatestProducts expects it
    } catch (err) {
        console.error("[Fetch Latest Products] Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch latest products" });
    }
};