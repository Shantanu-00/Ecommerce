const db = require("../config/db");

exports.createOrder = async (req, res) => {
    const { address, alt_phone, payment_method } = req.body;
    const user_id = req.user.id;

    if (!payment_method || !["COD", "Credit_Card", "Paypal"].includes(payment_method)) {
        return res.status(400).json({ success: false, message: "Invalid payment method" });
    }

    console.log(`[Order Creation] Starting for user_id: ${user_id}, payment_method: ${payment_method}`);

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // Fetch cart items
        const [cartItems] = await connection.query(
            "SELECT c.product_id, c.quantity, p.stock, p.price, p.name FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?",
            [user_id]
        );
        console.log("[Order Creation] Cart items fetched:", cartItems);
        if (cartItems.length === 0) {
            throw new Error("Cart is empty");
        }

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Check stock and update products
        for (const item of cartItems) {
            if (item.quantity > item.stock) {
                throw new Error(`Insufficient stock for product ${item.name}`);
            }
            const [stockUpdate] = await connection.query(
                "UPDATE products SET stock = stock - ? WHERE product_id = ?",
                [item.quantity, item.product_id]
            );
            console.log(`[Order Creation] Stock updated for product ${item.product_id}:`, stockUpdate.affectedRows);
        }

        // Insert order with address
        const [orderResult] = await connection.query(
            "INSERT INTO orders (user_id, total_amount, order_status, address) VALUES (?, ?, ?, ?)",
            [user_id, total, "Pending", address || null]
        );
        const order_id = orderResult.insertId;
        console.log("[Order Creation] Order inserted, ID:", order_id);

        // Insert order items
        const orderItems = cartItems.map((item) => [order_id, item.product_id, item.quantity, item.price]);
        const [itemsResult] = await connection.query(
            "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
            [orderItems]
        );
        console.log("[Order Creation] Order items inserted:", itemsResult.affectedRows);

        // Insert payment
        const [paymentResult] = await connection.query(
            "INSERT INTO payments (order_id, payment_method, payment_status) VALUES (?, ?, ?)",
            [order_id, payment_method, payment_method === "COD" ? "Incomplete" : "Complete"]
        );
        console.log("[Order Creation] Payment inserted:", paymentResult.affectedRows);

        // Clear cart
        const [cartClear] = await connection.query("DELETE FROM cart WHERE user_id = ?", [user_id]);
        console.log("[Order Creation] Cart cleared:", cartClear.affectedRows);

        await connection.commit();
        console.log("[Order Creation] Transaction committed for order_id:", order_id);
        res.json({ success: true, message: "Order placed successfully", order_id });
    } catch (err) {
        if (connection) {
            await connection.rollback();
            console.error("[Order Creation] Rolled back due to error:", err);
        }
        res.status(500).json({ success: false, message: err.message || "Failed to create order" });
    } finally {
        if (connection) connection.release();
    }
};

exports.getAllOrders = async (req, res) => {
  try {
      const [orders] = await db.query(`
          SELECT 
              o.order_id, 
              o.user_id, 
              u.name AS user_name, 
              o.total_amount, 
              o.order_status, 
              o.created_at, 
              o.address,
              p.payment_method,
              p.payment_status,
              GROUP_CONCAT(CONCAT(oi.quantity, ' x ', pr.name) SEPARATOR ', ') AS items
          FROM orders o
          LEFT JOIN users u ON o.user_id = u.user_id
          LEFT JOIN payments p ON o.order_id = p.order_id
          LEFT JOIN order_items oi ON o.order_id = oi.order_id
          LEFT JOIN products pr ON oi.product_id = pr.product_id
          GROUP BY 
              o.order_id, 
              o.user_id, 
              u.name, 
              o.total_amount, 
              o.order_status, 
              o.created_at, 
              o.address,
              p.payment_method, 
              p.payment_status
          ORDER BY o.created_at DESC
      `);
      res.json({ success: true, data: orders });
  } catch (err) {
      console.error("[Get All Orders] Error:", err);
      res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
    const { order_id, order_status } = req.body;
    if (!["Pending", "Shipped", "Delivered", "Cancelled"].includes(order_status)) {
        return res.status(400).json({ success: false, message: "Invalid order status" });
    }
    try {
        const [result] = await db.query("UPDATE orders SET order_status = ? WHERE order_id = ?", [order_status, order_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        res.json({ success: true, message: "Order status updated" });
    } catch (err) {
        console.error("[Update Order Status] Error:", err);
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    const { order_id, payment_status } = req.body;
    if (!["Complete", "Incomplete"].includes(payment_status)) {
        return res.status(400).json({ success: false, message: "Invalid payment status" });
    }
    try {
        const [result] = await db.query("UPDATE payments SET payment_status = ? WHERE order_id = ?", [payment_status, order_id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }
        res.json({ success: true, message: "Payment status updated" });
    } catch (err) {
        console.error("[Update Payment Status] Error:", err);
        res.status(500).json({ success: false, message: "Failed to update payment status" });
    }
};