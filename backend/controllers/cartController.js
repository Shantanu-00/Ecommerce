const db = require("../config/db");

exports.addToCart = async (req, res) => {
    const { product_id, quantity = 1 } = req.body;
    const user_id = req.user.id;

    if (!product_id || quantity < 1) {
        return res.status(400).json({ success: false, message: "Invalid product ID or quantity" });
    }

    try {
        const [product] = await db.query("SELECT stock FROM products WHERE product_id = ?", [product_id]);
        if (product.length === 0) return res.status(404).json({ success: false, message: "Product not found" });

        const stock = product[0].stock;
        if (stock < quantity) return res.status(400).json({ success: false, message: "Insufficient stock" });

        await db.query(
            "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
            [user_id, product_id, quantity, quantity]
        );

        res.json({ success: true, message: "Added to cart" });
    } catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const [cartItems] = await db.query(
            "SELECT c.*, p.name, p.price, p.image_url FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?",
            [userId]
        );
        res.json({ success: true, data: cartItems });
    } catch (err) {
        console.error("Get cart error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.updateCartQuantity = async (req, res) => {
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    if (!product_id || quantity < 0) {
        return res.status(400).json({ success: false, message: "Invalid product ID or quantity" });
    }

    try {
        const [product] = await db.query("SELECT stock FROM products WHERE product_id = ?", [product_id]);
        if (product.length === 0) return res.status(404).json({ success: false, message: "Product not found" });

        const stock = product[0].stock;
        if (quantity > stock) return res.status(400).json({ success: false, message: "Quantity exceeds stock" });

        if (quantity === 0) {
            await db.query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [user_id, product_id]);
            return res.json({ success: true, message: "Removed from cart" });
        } else {
            await db.query("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?", [quantity, user_id, product_id]);
            return res.json({ success: true, message: "Cart updated" });
        }
    } catch (err) {
        console.error("Update cart quantity error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.removeFromCart = async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.user.id;

    try {
        await db.query("DELETE FROM cart WHERE user_id = ? AND product_id = ?", [user_id, product_id]);
        res.json({ success: true, message: "Removed from cart" });
    } catch (err) {
        console.error("Remove from cart error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.placeOrder = async (req, res) => {
    const user_id = req.user.id;

    try {
        const [cartItems] = await db.query(
            "SELECT c.product_id, c.quantity, p.stock, p.price FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?",
            [user_id]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        for (const item of cartItems) {
            if (item.quantity > item.stock) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${item.product_id}` });
            }
        }

        // Update stock
        for (const item of cartItems) {
            await db.query("UPDATE products SET stock = stock - ? WHERE product_id = ?", [item.quantity, item.product_id]);
        }

        // Clear cart
        await db.query("DELETE FROM cart WHERE user_id = ?", [user_id]);

        res.json({ success: true, message: "Order placed successfully" });
    } catch (err) {
        console.error("Place order error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};
