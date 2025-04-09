const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    const { name, email, phone_no, address, password } = req.body;

    if (!name || !email || !phone_no || !address || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO users (name, email, phone_no, address, password, role) VALUES (?, ?, ?, ?, ?, ?)",
            [name, email, phone_no, address, hashedPassword, "customer"]
        );

        const token = jwt.sign({ id: result.insertId, role: "customer" }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, message: "User registered", token });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ success: true, message: "Login successful", token, user: { id: user.user_id, role: user.role } });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};

exports.getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const [users] = await db.query("SELECT name, email, phone_no, address, role FROM users WHERE user_id = ?", [userId]);
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: users[0] });
    } catch (err) {
        console.error("Profile error:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
};