import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { registerUser, loginUser } from "../Utils/api";
import logo from "../Components/Assets/logo.png";

const LoginSignup = ({ setIsLoggedIn, setUserRole }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        if (!formData.email.includes("@") || !formData.email.includes(".")) {
            setError("Enter a valid email address.");
            setLoading(false);
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }
        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }
        if (!isLogin && (!formData.phone || formData.phone.length < 10 || isNaN(formData.phone))) {
            setError("Enter a valid phone number (at least 10 digits).");
            setLoading(false);
            return;
        }
        if (!isLogin && formData.address.length < 5) {
            setError("Address must be at least 5 characters.");
            setLoading(false);
            return;
        }

        try {
            let res;
            if (isLogin) {
                res = await loginUser(formData.email, formData.password);
                if (!res.success) {
                    throw new Error(res.message || "Login failed");
                }
            } else {
                res = await registerUser(formData.name, formData.email, formData.phone, formData.address, formData.password);
                if (!res.success) {
                    throw new Error(res.message || "Registration failed");
                }
            }

            localStorage.setItem("token", res.token);
            setIsLoggedIn(true);
            setUserRole(res.user.role);
            setSuccessMessage(isLogin ? "Logged in successfully!" : "Account created successfully!");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            console.error("Submit error:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-300 text-white font-poppins">
            <Link to="/" className="flex items-center gap-2 mb-5 hover:opacity-90 transition-opacity">
                <img src={logo} alt="Site Logo" className="w-16 h-16" />
                <h1 className="text-3xl font-bold text-white">Penguin Shop</h1>
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm text-black text-center">
                <div className="flex justify-between mb-4">
                    <button
                        className={`flex-1 py-2 ${isLogin ? "bg-blue-900 text-white" : "bg-gray-200 text-black"} font-bold transition-colors`}
                        onClick={() => setIsLogin(true)}
                    >
                        Sign In
                    </button>
                    <button
                        className={`flex-1 py-2 ${!isLogin ? "bg-blue-900 text-white" : "bg-gray-200 text-black"} font-bold transition-colors`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>}
                {successMessage && <div className="bg-green-100 text-green-700 p-2 rounded mb-3">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    {!isLogin && (
                        <>
                            <div className="flex flex-col text-left">
                                <label className="font-bold text-sm">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="p-2 border border-gray-300 rounded text-base"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <label className="font-bold text-sm">Phone Number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="p-2 border border-gray-300 rounded text-base"
                                />
                            </div>
                            <div className="flex flex-col text-left">
                                <label className="font-bold text-sm">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="p-2 border border-gray-300 rounded text-base"
                                />
                            </div>
                        </>
                    )}
                    <div className="flex flex-col text-left">
                        <label className="font-bold text-sm">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="p-2 border border-gray-300 rounded text-base"
                        />
                    </div>
                    <div className="flex flex-col text-left">
                        <label className="font-bold text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="p-2 border border-gray-300 rounded text-base"
                        />
                    </div>
                    {!isLogin && (
                        <div className="flex flex-col text-left">
                            <label className="font-bold text-sm">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="p-2 border border-gray-300 rounded text-base"
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-900 text-white py-3 font-bold rounded mt-3 hover:bg-blue-950 transition-colors disabled:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>

                <div className="mt-4">
                    {isLogin ? (
                        <p>
                            Don't have an account?{" "}
                            <button
                                className="bg-transparent border-none text-blue-900 font-bold hover:underline transition-colors"
                                onClick={() => setIsLogin(false)}
                            >
                                Sign Up
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{" "}
                            <button
                                className="bg-transparent border-none text-blue-900 font-bold hover:underline transition-colors"
                                onClick={() => setIsLogin(true)}
                            >
                                Sign In
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginSignup;
