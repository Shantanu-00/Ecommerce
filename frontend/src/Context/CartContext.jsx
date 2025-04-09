import React, { createContext, useState, useEffect, useCallback } from "react";
import { getCart } from "../Utils/api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    // Optimized function with useCallback to prevent unnecessary re-creation
    const fetchCart = useCallback(async () => {
        if (!token) {
            setCart([]);
            return;
        }

        try {
            const cartData = await getCart();
            setCart(cartData);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setCart([]);
        }
    }, [token]); // Only runs when token changes

    // Fetch cart when component mounts or token changes
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Listen for localStorage changes (e.g., user logs in/out in another tab)
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <CartContext.Provider value={{ cart, setCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
