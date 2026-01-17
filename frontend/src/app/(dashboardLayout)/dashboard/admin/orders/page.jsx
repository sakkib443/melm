"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiPackage, FiLoader, FiEye, FiRefreshCw, FiCheck, FiX,
    FiClock, FiDollarSign, FiUser, FiCalendar, FiDownload, FiFilter
} from "react-icons/fi";
import { orderService } from "@/services/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter !== "all") params.status = statusFilter;

            const response = await orderService.getAll(params);
            if (response.success && response.data) {
                setOrders(response.data);
            }
        } catch (err) {
            toast.error("Failed to fetch orders");
            console.error("Order fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await orderService.updateStatus(orderId, newStatus);
            if (response.success) {
                toast.success(`Order status updated to ${newStatus}`);
                fetchOrders();
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder(response.data);
                }
            }
        } catch (err) {
            toast.error(err.message || "Failed to update status");
        }
    };

    const filtered = orders.filter(o => {
        const matchSearch =
            o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
            o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
            `${o.user?.firstName} ${o.user?.lastName}`.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const stats = {
        total: orders.length,
        completed: orders.filter(o => o.paymentStatus === "completed").length,
        pending: orders.filter(o => o.paymentStatus === "pending").length,
        totalRevenue: orders
            .filter(o => o.paymentStatus === "completed")
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    };

    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            refunded: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        };
        return styles[status] || "bg-gray-100 text-gray-600";
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <FiPackage className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
                        <p className="text-sm text-gray-500">Manage customer orders</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchOrders} className="btn btn-ghost p-3">
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="btn btn-primary">
                        <FiDownload size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                            <FiPackage className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Total Orders</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <FiCheck className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Completed</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <FiClock className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Pending</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                            <FiDollarSign className="text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">৳{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Revenue</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search by order ID or customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-12 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {["all", "completed", "pending", "processing", "failed"].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${statusFilter === status
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <FiLoader className="animate-spin text-primary" size={32} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <FiPackage size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="font-medium">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order ID</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Items</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase">Amount</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filtered.map((order) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-gray-900 dark:text-white">
                                                {order.orderNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {order.user?.firstName} {order.user?.lastName}
                                                </p>
                                                <p className="text-xs text-gray-400">{order.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                                    {order.items?.[0]?.title || "—"}
                                                </p>
                                                {order.items?.length > 1 && (
                                                    <p className="text-xs text-gray-400">+{order.items.length - 1} more</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                ৳{order.totalAmount?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <FiCalendar size={14} />
                                                {order.orderDate
                                                    ? new Date(order.orderDate).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })
                                                    : "—"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 bg-primary-10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                {order.paymentStatus === "pending" && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(order._id, "completed")}
                                                        className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors"
                                                    >
                                                        <FiCheck size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Details</h3>
                                <p className="text-sm text-gray-500 font-mono">{selectedOrder.orderNumber}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-10 h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 rounded-xl"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                    {selectedOrder.user?.firstName?.[0]}{selectedOrder.user?.lastName?.[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                                </div>
                                <div className="ml-auto">
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold capitalize ${getStatusBadge(selectedOrder.paymentStatus)}`}>
                                        {selectedOrder.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Items</p>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-white">৳{item.price?.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 dark:border-gray-600 mt-4 pt-4 flex justify-between">
                                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-xl font-bold text-primary">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Status Management */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-500 uppercase mb-3 text-center">Manage Order Status</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { id: "completed", label: "Completed", icon: <FiCheck />, color: "text-emerald-500", bg: "hover:bg-emerald-50" },
                                        { id: "pending", label: "Pending", icon: <FiClock />, color: "text-amber-500", bg: "hover:bg-amber-50" },
                                        { id: "failed", label: "Failed", icon: <FiX />, color: "text-red-500", bg: "hover:bg-red-50" },
                                        { id: "refunded", label: "Refunded", icon: <FiRefreshCw />, color: "text-purple-500", bg: "hover:bg-purple-50" },
                                    ].map((s) => (
                                        <button
                                            key={s.id}
                                            onClick={() => handleStatusUpdate(selectedOrder._id, s.id)}
                                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${selectedOrder.paymentStatus === s.id
                                                ? "border-primary bg-primary/5 text-primary"
                                                : `border-gray-200 dark:border-gray-600 dark:text-gray-300 ${s.bg} ${s.color}`
                                                }`}
                                        >
                                            <span className="text-lg">{s.icon}</span>
                                            <span className="text-[10px] font-bold uppercase">{s.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="btn btn-ghost flex-1 border border-gray-200 dark:border-gray-700"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
