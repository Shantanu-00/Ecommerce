"use client"

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct, updateProductStock, deleteProduct, fetchAllProducts, fetchCategories } from "../Utils/api";

const AdminPanel = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: "",
        image: null,
        price: "",
        description: "",
        stock: "",
        popular: false,
        category_tags: "",
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("add");

    useEffect(() => {
        const fetchData = async () => {
            const [prods, cats] = await Promise.all([fetchAllProducts(), fetchCategories()]);
            setProducts(prods);
            setCategories(cats);
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setNewProduct((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
        }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", newProduct.name);
            formData.append("image", newProduct.image);
            formData.append("price", newProduct.price);
            formData.append("description", newProduct.description);
            formData.append("stock", newProduct.stock);
            formData.append("popular", newProduct.popular);
            formData.append("category_tags", newProduct.category_tags);

            await addProduct(formData);
            setNewProduct({ name: "", image: null, price: "", description: "", stock: "", popular: false, category_tags: "" });
            const updatedProducts = await fetchAllProducts();
            setProducts(updatedProducts);
            alert("Product added successfully!");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStockChange = async (product_id, stock) => {
        try {
            await updateProductStock(product_id, stock);
            const updatedProducts = await fetchAllProducts();
            setProducts(updatedProducts);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDelete = async (product_id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(product_id);
                const updatedProducts = await fetchAllProducts();
                setProducts(updatedProducts);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-sans font-bold text-gray-800 mb-8 text-center">Admin Dashboard</h1>

                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`px-6 py-3 font-medium ${activeTab === "add" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("add")}
                    >
                        Add Product
                    </button>
                    <button
                        className={`px-6 py-3 font-medium ${activeTab === "manage" ? "text-amber-600 border-b-2 border-amber-600" : "text-gray-500 hover:text-gray-700"}`}
                        onClick={() => setActiveTab("manage")}
                    >
                        Manage Inventory
                    </button>
                </div>

                {activeTab === "add" ? (
                    <div className="bg-gray-100 rounded-lg p-8">
                        <h2 className="text-2xl font-sans font-semibold text-gray-800 mb-6">Add New Product</h2>

                        <form onSubmit={handleAddProduct} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={newProduct.price}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={newProduct.stock}
                                    onChange={handleInputChange}
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="popular"
                                    name="popular"
                                    checked={newProduct.popular}
                                    onChange={handleInputChange}
                                    className="h-4 w-4 text-gray-600 focus:ring-gray-600 border-gray-300 rounded"
                                />
                                <label htmlFor="popular" className="ml-2 block text-sm text-gray-700">
                                    Featured Product
                                </label>
                            </div>

                            <div>
                                <label htmlFor="category_tags" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Tags
                                </label>
                                <input
                                    type="text"
                                    id="category_tags"
                                    name="category_tags"
                                    value={newProduct.category_tags}
                                    onChange={handleInputChange}
                                    placeholder="e.g., #watches #jewelry"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Existing categories: {categories.map((cat) => `#${cat.name}`).join(" ")}
                                </p>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 px-4 bg-gray-800 text-white rounded-md shadow-sm font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 transition-colors duration-300 disabled:opacity-50"
                                >
                                    {loading ? "Adding..." : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-sans font-semibold text-gray-800 mb-6">Manage Inventory</h2>

                        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-800 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                                            Stock
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <tr key={product.product_id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img
                                                            src={(() => {
                                                                try {
                                                                    return require(`../Components/Assets/${product.image_url || "/placeholder.svg"}`);
                                                                } catch {
                                                                    return require("../Components/Assets/default.jpg");
                                                                }
                                                            })()}
                                                            alt={product.name}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-800">{product.name}</div>
                                                        <div className="text-sm text-amber-600">${product.price}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={() => handleStockChange(product.product_id, product.stock - 1)}
                                                        disabled={product.stock <= 0}
                                                        className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-2 text-sm text-gray-700">{product.stock}</span>
                                                    <button
                                                        onClick={() => handleStockChange(product.product_id, product.stock + 1)}
                                                        className="p-1 text-gray-600 hover:text-gray-800"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleDelete(product.product_id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;