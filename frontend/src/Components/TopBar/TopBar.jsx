import React from "react";
import { Link, useNavigate } from "react-router-dom";

const TopBar = ({ isLoggedIn, handleLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            handleLogout();
            navigate("/");
        }
    };

    const handleHelpClick = () => {
        navigate("/");
        setTimeout(() => {
            const helpSection = document.getElementById("help-section");
            if (helpSection) {
                helpSection.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);
    };

    return (
        <div className="w-full bg-gradient-to-r from-gray-100 to-gray-200 shadow-sm py-2 px-4">
            <div className="flex justify-end items-center w-full max-w-screen-2xl mx-auto">
                <div className="flex gap-4 sm:gap-6">
                    <button
                        onClick={handleHelpClick}
                        className="text-gray-800 font-semibold hover:bg-gray-300 px-3 py-1 rounded-md transition"
                    >
                        Help
                    </button>
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogoutClick}
                            className="text-gray-800 font-semibold hover:bg-gray-300 px-3 py-1 rounded-md transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            className="text-gray-800 font-semibold hover:bg-gray-300 px-3 py-1 rounded-md transition"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopBar;
