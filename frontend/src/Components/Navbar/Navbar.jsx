import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart-icon.png";
import box_icon from "../Assets/box-icon.svg";
import gear_icon from "../Assets/gear-icon.png";
import Search from "../Search/Search";
import TopBar from "../TopBar/TopBar";
import { getCart } from "../../Utils/api";
import { Menu, X } from "lucide-react";

const Navbar = ({ isLoggedIn, handleLogout, userRole }) => {
    const [menu, setMenu] = useState("Shop");
    const [cartCount, setCartCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        switch (location.pathname) {
            case "/":
                setMenu("Shop");
                break;
            case "/watches":
                setMenu("Watches");
                break;
            case "/bikes":
                setMenu("Bikes");
                break;
            case "/all-products":
                setMenu("All Products");
                break;
            default:
                setMenu("");
        }
    }, [location.pathname]);

    useEffect(() => {
        if (isLoggedIn && userRole === "customer") {
            const fetchCartCount = async () => {
                try {
                    const items = await getCart();
                    setCartCount(items.reduce((sum, item) => sum + item.quantity, 0));
                } catch (err) {
                    console.error("Cart count error:", err);
                }
            };
            fetchCartCount();
        }
    }, [isLoggedIn, userRole]);

    return (
        <div>
            <TopBar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

            <nav className="bg-slate-900 text-white px-4 py-3 shadow-md w-full">
                <div className="flex justify-between items-center w-full">
                    {/* LEFT: Logo & Site Name */}
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="Logo" className="w-10 h-10" />
                        <span className="text-yellow-400 text-xl font-bold">Penguins</span>
                    </Link>

                    {/* MIDDLE: Categories (only on lg) */}
                    <ul className="hidden lg:flex gap-6 font-semibold">
                        {["Shop", "Watches", "Bikes", "All Products"].map((item) => (
                            <li key={item}>
                                <Link
                                    to={`/${item === "Shop" ? "" : item.toLowerCase().replace(/\s/g, "-")}`}
                                    onClick={() => setMenu(item)}
                                    className={`hover:text-yellow-400 ${
                                        menu === item ? "text-yellow-400" : ""
                                    }`}
                                >
                                    {item}
                                </Link>
                                {menu === item && <hr className="border-yellow-400 mt-1" />}
                            </li>
                        ))}
                    </ul>

                    {/* RIGHT: Search (md+), Cart, Hamburger */}
                    <div className="flex items-center gap-4">
                        {/* Search bar (only md and above) */}
                        <div className="hidden md:block">
                            <Search />
                        </div>

                        {/* Admin or Cart */}
                        {isLoggedIn && userRole === "admin" ? (
                            <div className="flex gap-4 items-center">
                                <Link to="/admin/orders">
                                    <img src={box_icon} alt="Orders" className="w-6 h-6" />
                                </Link>
                                <Link to="/admin/panel">
                                    <img src={gear_icon} alt="Admin Panel" className="w-6 h-6" />
                                </Link>
                            </div>
                        ) : (
                            <div className="relative">
                                <Link to="/cart">
                                    <img src={cart_icon} alt="Cart" className="w-7 h-7 filter invert" />
                                </Link>
                                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                                    {cartCount}
                                </div>
                            </div>
                        )}

                        {/* Hamburger (md and below) */}
                        <button
                            className="lg:hidden text-white focus:outline-none"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Dropdown Menu: visible only when hamburger is open */}
                {isOpen && (
                    <div className="lg:hidden mt-3 px-4">
                        <div className="flex flex-col gap-4 bg-slate-800 p-4 rounded-md shadow-md">
                            {/* Show Search only on small (hidden on md) */}
                            <div className="md:hidden">
                                <Search />
                            </div>

                            {/* Categories (on both md and sm) */}
                            <ul className="flex flex-col gap-2 text-white font-medium">
                                {["Shop", "Watches", "Bikes", "All Products"].map((item) => (
                                    <li key={item}>
                                        <Link
                                            to={`/${item === "Shop" ? "" : item.toLowerCase().replace(/\s/g, "-")}`}
                                            onClick={() => {
                                                setMenu(item);
                                                setIsOpen(false);
                                            }}
                                            className={`block hover:text-yellow-400 ${
                                                menu === item ? "text-yellow-400" : ""
                                            }`}
                                        >
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
