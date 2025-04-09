const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "Unauthorized - No token provided" });
  }

  // Support both "Bearer <TOKEN>" and "<TOKEN>"
  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Invalid token structure" });
    }

    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ success: false, message: "Forbidden - Invalid user data" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden - Admin access required" });
  }

  next();
};

module.exports = { authMiddleware, adminMiddleware };
