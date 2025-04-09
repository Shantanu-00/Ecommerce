require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", searchRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    } else {
        console.error('Server error:', err);
    }
});