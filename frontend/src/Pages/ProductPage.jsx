"use client"

import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProductById, addToCart, getCart } from "../Utils/api";

const ProductPage = ({ userRole }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [cartItem, setCartItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [zoomed, setZoomed] = useState(false);
    const [theme, setTheme] = useState("light");

    const fetchProductData = useCallback(async () => {
        try {
            if (!id || id === "undefined") {
                throw new Error("Invalid product ID");
            }

            setLoading(true);
            setError(null);

            const productData = await fetchProductById(id);
            if (!productData) throw new Error("Product not found");
            setProduct(productData);

            if (localStorage.getItem("token") && userRole === "customer") {
                try {
                    const cart = await getCart();
                    const itemInCart = cart.find((item) => item.product_id === productData.product_id);
                    setCartItem(itemInCart || null);
                } catch (cartError) {
                    console.error("Cart fetch failed:", cartError.message);
                }
            }
        } catch (err) {
            console.error("Product fetch error:", err.message);
            setError(err.message || "Failed to load product");
            setTimeout(() => navigate("/"), 3000);
        } finally {
            setLoading(false);
        }
    }, [id, navigate, userRole]);

    useEffect(() => {
        if (!id || id === "undefined") {
            setError("Invalid product ID");
            setLoading(false);
            navigate("/");
            return;
        }

        fetchProductData();
    }, [fetchProductData, id, navigate]);

    const toggleZoom = () => {
        setZoomed(!zoomed);
    };

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const getImageSrc = (imageUrl) => {
        try {
            return require(`../Components/Assets/${imageUrl}`);
        } catch {
            console.warn(`Image not found: ${imageUrl}, using default`);
            return require("../Components/Assets/default.jpg");
        }
    };

    const handleAddToCart = async () => {
        if (!localStorage.getItem("token")) {
            alert("You must be logged in to add items to your cart!");
            navigate("/login");
            return;
        }
        if (userRole !== "customer") {
            alert("Admins cannot add items to the cart.");
            return;
        }
        try {
            await addToCart(product.product_id);
            const cart = await getCart();
            const itemInCart = cart.find((item) => item.product_id === product.product_id);
            setCartItem(itemInCart || null);
            alert("Added to cart successfully!");
        } catch (err) {
            console.error("Error adding to cart:", err.message);
            alert(err.message || "Failed to add to cart");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-cyan-100">
            <div className="text-cyan-900 dark:text-cyan-200 text-xl font-sans animate-pulse">Loading luxury items...</div>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen bg-cyan-100">
            <div className="text-red-600 dark:text-red-400 text-xl font-sans">Oops! {error} - Redirecting...</div>
        </div>
    );

    if (!product) return (
        <div className="flex items-center justify-center min-h-screen bg-cyan-100">
            <div className="text-cyan-900 dark:text-cyan-200 text-xl font-sans">No product found</div>
        </div>
    );

    return (
        <div className={`flex flex-col items-center min-h-screen py-5 px-4 ${theme === "light" ? "bg-cyan-100" : "bg-gray-800 text-cyan-200"} transition-all duration-300`}>
            <button
                className="fixed top-44 right-5 px-3 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-800 font-bold z-10"
                onClick={toggleTheme}
            >
                {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>

            <div className="flex flex-col md:flex-row gap-10 max-w-5xl w-full mt-16 justify-center">
                {/* Product Image */}
                <div className={`relative ${theme === "light" ? "bg-white" : "bg-gray-700"} p-5 rounded-lg shadow-md text-center`}>
                    <img
                        src={getImageSrc(product.image_url)}
                        alt={product.name || "Unnamed Product"}
                        className={`w-full max-w-[300px] h-[400px] md:max-w-[200px] md:h-[300px] object-cover rounded-md border-2 border-cyan-600 transition-transform duration-300 ${zoomed ? "scale-[2] cursor-zoom-out" : "cursor-zoom-in"}`}
                        onClick={toggleZoom}
                    />
                    <button
                        className="absolute bottom-8 right-8 px-2 py-1 bg-cyan-600 text-white rounded-md hover:bg-cyan-800 text-sm"
                        onClick={toggleZoom}
                    >
                        {zoomed ? "🔍 Zoom Out" : "🔍 Zoom In"}
                    </button>
                </div>

                {/* Product Details */}
                <div className="max-w-md p-5">
                    <h1 className={`text-3xl md:text-4xl font-bold ${theme === "light" ? "text-cyan-900" : "text-cyan-200"} mb-3`}>
                        {product.name || "No name available"}
                    </h1>
                    <p className={`text-base ${theme === "light" ? "text-cyan-700" : "text-cyan-400"} mb-3`}>
                        Category: {product.category_name || "Uncategorized"}
                    </p>
                    <p className={`text-2xl font-bold ${theme === "light" ? "text-red-600" : "text-red-400"} mb-3`}>
                        ${product.price && !isNaN(Number(product.price)) ? Number(product.price).toFixed(2) : "Price not available"}
                    </p>
                    <p className={`text-lg ${theme === "light" ? "text-gray-700" : "text-gray-300"} mb-3`}>
                        {product.description || "No description available."}
                    </p>
                    <p className={`text-base ${theme === "light" ? "text-green-700" : "text-green-400"} mb-3`}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock!"}
                    </p>
                    {cartItem && (
                        <p className={`text-base ${theme === "light" ? "text-green-700" : "text-green-400"} mb-3`}>
                            {product.stock === 0
                                ? `Out of stock (in your cart: ${cartItem.quantity})`
                                : `${cartItem.quantity} already in your cart`}
                        </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 mt-5">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0 || userRole !== "customer"}
                            className="px-6 py-3 bg-cyan-600 text-white rounded-md font-bold hover:bg-cyan-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => navigate("/cart")}
                            className="px-6 py-3 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition-colors"
                        >
                            Go to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;