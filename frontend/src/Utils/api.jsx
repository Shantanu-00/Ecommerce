import axios from "axios";

const BASE_URL = "http://localhost:3002/api";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Auth-related functions
export const registerUser = async (name, email, phone_no, address, password) => {
    const response = await api.post("/auth/register", { name, email, phone_no, address, password });
    return response.data;
};

export const loginUser = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
};

export const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const response = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem("token");
};

// Product-related functions
export const fetchPopularProducts = async () => {
    const response = await api.get("/popular-products");
    return response.data.success ? response.data.data : [];
};

export const fetchProductById = async (id) => {
    try {
        const response = await api.get(`/product/${id}`);
        if (!response.data.success) throw new Error(response.data.message || "Product not found");
        return response.data.data;
    } catch (err) {
        console.error("fetchProductById error:", err);
        throw err;
    }
};

export const fetchAllProducts = async () => {
    const response = await api.get("/products");
    return response.data.success ? response.data.data : [];
};

export const fetchAllProductsPaginated = async (page = 1, limit = 10) => {
    const response = await api.get(`/products/paginated?page=${page}&limit=${limit}`);
    return response.data.success ? response.data : { data: [], total: 0 };
};

export const fetchCategories = async () => {
    const response = await api.get("/categories");
    return response.data.success ? response.data.data : [];
};

export const searchProducts = async (query) => {
    if (!query.trim()) return [];
    const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
    return response.data.success ? response.data.data : [];
};

// Cart-related functions
export const getCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return [];
    try {
        const response = await api.get("/cart", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data.success ? response.data.data : [];
    } catch (err) {
        console.error("getCart error:", err);
        throw err;
    }
};

export const addToCart = async (product_id, quantity = 1) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("You must be logged in");
    const response = await api.post("/cart/add", { product_id, quantity }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateCartQuantity = async (product_id, quantity) => {
    const token = localStorage.getItem("token");
    const response = await api.put("/cart/update", { product_id, quantity }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const removeFromCart = async (product_id) => {
    const token = localStorage.getItem("token");
    const response = await api.delete("/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { product_id },
    });
    return response.data;
};

// Order-related functions
export const createOrder = async (address, alt_phone, payment_method) => {
    const token = localStorage.getItem("token");
    const response = await api.post("/order/create", { address, alt_phone, payment_method }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getAllOrders = async () => {
    const token = localStorage.getItem("token");
    const response = await api.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.success ? response.data.data : [];
};

export const updateOrderStatus = async (order_id, order_status) => {
    const token = localStorage.getItem("token");
    const response = await api.put("/admin/orders/status", { order_id, order_status }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updatePaymentStatus = async (order_id, payment_status) => {
    const token = localStorage.getItem("token");
    const response = await api.put("/admin/orders/payment", { order_id, payment_status }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Admin product management
export const addProduct = async (formData) => {
    const token = localStorage.getItem("token");
    const response = await api.post("/products/add", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateProductStock = async (product_id, stock) => {
    const token = localStorage.getItem("token");
    const response = await api.put("/products/stock", { product_id, stock }, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteProduct = async (product_id) => {
    const token = localStorage.getItem("token");
    const response = await api.delete("/products/delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { product_id },
    });
    return response.data;
};


export const fetchLatestProducts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/products/latest`);
        return response.data.success ? response.data.data : [];
    } catch (error) {
        console.error("Error fetching latest products:", error);
        return [];
    }
};

