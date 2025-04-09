import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus, updatePaymentStatus } from "../Utils/api";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [orders, statusFilter, dateFilter]);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            setOrders(data);
        } catch (err) {
            alert(err.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...orders];
        if (statusFilter !== "All") {
            filtered = filtered.filter(order => order.order_status === statusFilter);
        }
        if (dateFilter) {
            filtered = filtered.filter(order => new Date(order.created_at).toISOString().slice(0, 10) === dateFilter);
        }
        setFilteredOrders(filtered);
    };

    const handleOrderStatusChange = async (order_id, newStatus) => {
        try {
            await updateOrderStatus(order_id, newStatus);
            setOrders(prev =>
                prev.map(order =>
                    order.order_id === order_id ? { ...order, order_status: newStatus } : order
                )
            );
        } catch (err) {
            alert(err.message || "Failed to update order status");
        }
    };

    const handlePaymentStatusChange = async (order_id, newStatus) => {
        try {
            await updatePaymentStatus(order_id, newStatus);
            setOrders(prev =>
                prev.map(order =>
                    order.order_id === order_id ? { ...order, payment_status: newStatus } : order
                )
            );
        } catch (err) {
            alert(err.message || "Failed to update payment status");
        }
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-gray-700 text-xl font-sans animate-pulse">Loading Orders...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-sans font-bold text-gray-800 mb-8">Order Management</h1>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6 items-center">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                    />
                </div>

                {/* Table */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <p className="text-gray-700 text-lg font-sans">No orders found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-800 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Order Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Payment Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Payment Method</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Ordered On</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredOrders.slice(0, visibleCount).map(order => (
                                    <tr key={order.order_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{order.order_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.user_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.items || "No items"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-semibold">${order.total_amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.order_status}
                                                onChange={(e) => handleOrderStatusChange(order.order_id, e.target.value)}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={order.payment_status}
                                                onChange={(e) => handlePaymentStatusChange(order.order_id, e.target.value)}
                                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600 text-sm bg-white"
                                            >
                                                <option value="Complete">Complete</option>
                                                <option value="Incomplete">Incomplete</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.address || "Not provided"}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.payment_method}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Load More Button */}
                {visibleCount < filteredOrders.length && (
                    <div className="text-center mt-8">
                        <button
                            onClick={handleLoadMore}
                            className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors shadow-sm font-medium"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;