import React, { useEffect, useState } from "react";
import { fetchLatestProducts } from "../Utils/api";


const LatestProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const data = await fetchLatestProducts();
                setProducts(data);
            } catch (err) {
                setError("Failed to load latest products");
            } finally {
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    if (loading) return <div className="latest-products-page">Loading...</div>;
    if (error) return <div className="latest-products-page">{error}</div>;

    return (
        <div className="latest-products-page">
            <h2>Latest Arrivals</h2>
            <div className="latest-products-grid">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.product_id} className="product-card">
                            <img
                                src={(() => {
                                    try {
                                        return require(`../Components/Assets/${product.image_url}`);
                                    } catch {
                                        return require("../Components/Assets/default.jpg"); // Fallback image
                                    }
                                })()}
                                alt={product.name}
                            />
                            <h3>{product.name}</h3>
                            <p>{product.category_name}</p>
                            <p>₹{product.price}</p>
                        </div>
                    ))
                ) : (
                    <p>No latest products found.</p>
                )}
            </div>
        </div>
    );
};

export default LatestProducts;