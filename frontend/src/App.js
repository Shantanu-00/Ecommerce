import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import ProductPage from "./Pages/ProductPage";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import AdminPanel from "./Pages/AdminPanel";
import AdminOrders from "./Pages/AdminOrders";
import Checkout from "./Pages/Checkout";
import { useState, useEffect } from "react";
import { logoutUser } from "./Utils/api";
import { CartProvider } from "./Context/CartContext";
import OffersPage from "./Components/Offers/OffersPage";
import LatestProducts from "./Pages/LatestProducts";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
        if (token) {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            setUserRole(decoded.role || "customer");
        }
    }, []);

    const handleLogout = () => {
        logoutUser();
        setIsLoggedIn(false);
        setUserRole(null);
    };

    return (
        <CartProvider>
            <BrowserRouter>
                <MainApp isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} handleLogout={handleLogout} userRole={userRole} setUserRole={setUserRole} />
            </BrowserRouter>
        </CartProvider>
    );
}

function MainApp({ isLoggedIn, setIsLoggedIn, handleLogout, userRole, setUserRole }) {
    const location = useLocation();
    const hideNavbar = location.pathname === "/login";

    return (
        <div>
            {!hideNavbar && <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} userRole={userRole} />}
            <Routes>
                <Route path="/" element={<Shop />} />
                <Route path="/watches" element={<ShopCategory category="watches" />} />
                <Route path="/bikes" element={<ShopCategory category="bikes" />} />
                <Route path="/all-products" element={<ShopCategory category="all-products" />} />
                <Route path="/product/:id" element={<ProductPage userRole={userRole} />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<LoginSignup setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
                <Route path="/offers-page" element={<OffersPage />} />
                <Route path="/latest-products" element={<LatestProducts />} /> {/* Fixed typo */}
                {userRole === "admin" && (
                    <>
                        <Route path="/admin/panel" element={<AdminPanel />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                    </>
                )}
            </Routes>
        </div>
    );
}

export default App;