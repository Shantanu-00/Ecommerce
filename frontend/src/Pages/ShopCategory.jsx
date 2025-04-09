import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../Utils/api";

const ShopCategory = ({ category }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            const allProducts = await fetchAllProducts();
            const filtered = allProducts.filter((p) => {
                if (category === "watches") return p.category_id === 5; // Assume category_id 5 is watches
                if (category === "bikes") return p.category_id === 6; // Assume category_id 6 is bikes
                return true; // For all-products
            });
            setProducts(filtered);
            setLoading(false);
        };
        loadProducts();
    }, [category]);

    if (loading) return <div className="text-lg text-gray-600 text-center mt-12">Loading Elegance...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <h1 className="text-3xl md:text-4xl font-sans font-medium text-gray-800 text-center mb-12 tracking-wide">
                {category.charAt(0).toUpperCase() + category.slice(1)}
            </h1>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link
                        to={`/product/${product.product_id}`}
                        key={product.product_id}
                        className="no-underline"
                    >
                        <div className="group bg-white rounded-md overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                            <div className="relative w-full pt-[100%]"> {/* Square aspect ratio */}
                                <img
                                    src={(() => {
                                        try {
                                            return require(`../Components/Assets/${product.image_url}`);
                                        } catch {
                                            return require("../Components/Assets/default.jpg");
                                        }
                                    })()}
                                    alt={product.name}
                                    className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-4 flex flex-col items-center gap-1">
                                <h3 className="text-base font-medium text-gray-800 group-hover:text-amber-600 truncate">
                                    {product.name}
                                </h3>
                                <p className="text-lg font-semibold text-gray-700">
                                    ${product.price}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ShopCategory;