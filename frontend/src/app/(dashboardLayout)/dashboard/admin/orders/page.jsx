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

    const handleApprove = async (orderId, adminNote = "") => {
        try {
            const response = await orderService.approve(orderId, adminNote);
            if (response.success) {
                toast.success("Order approved and items delivered!");
                fetchOrders();
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder(response.data);
                }
            }
        } catch (err) {
            toast.error(err.message || "Failed to approve order");
        }
    };

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
            o.orderNumber?.toLowerCase().includes(search?.toLowerCase() || "") ||
            o.user?.email?.toLowerCase().includes(search?.toLowerCase() || "") ||
            `${o.user?.firstName || ""} ${o.user?.lastName || ""}`.toLowerCase().includes(search?.toLowerCase() || "");
        return matchSearch;
    });

    const stats = {
        total: orders.length,
        completed: orders.filter(o => o.paymentStatus === "completed").length,
        approved: orders.filter(o => o.paymentStatus === "approved").length,
        pending: orders.filter(o => o.paymentStatus === "pending").length,
        totalRevenue: orders
            .filter(o => ["completed", "approved"].includes(o.paymentStatus))
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0),
    };

    const getStatusBadge = (status) => {
        const styles = {
            completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            approved: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
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
                    <button onClick={fetchOrders} className="btn border border-gray-200 dark:border-gray-700 p-2 text-gray-500 hover:text-primary transition-all">
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="px-4 py-2 bg-primary text-black font-bold rounded-lg text-sm flex items-center gap-2 hover:bg-primary/90 transition-all">
                        <FiDownload size={16} /> Export
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card border dark:border-gray-800 p-5 bg-white dark:bg-gray-900 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <FiPackage className="text-gray-500 dark:text-gray-400" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Orders</p>
                </div>
                <div className="card border dark:border-gray-800 p-5 bg-white dark:bg-gray-900 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <FiCheck className="text-emerald-500" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved + stats.completed}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Approved</p>
                </div>
                <div className="card border dark:border-gray-800 p-5 bg-white dark:bg-gray-900 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <FiClock className="text-amber-500" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending</p>
                </div>
                <div className="card border dark:border-gray-800 p-5 bg-white dark:bg-gray-900 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <FiDollarSign className="text-green-500" />
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">৳{stats.totalRevenue.toLocaleString()}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Revenue</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card border dark:border-gray-800 p-4 bg-white dark:bg-gray-900 rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search by order ID or customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 text-sm outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        {["all", "pending", "approved", "completed", "failed"].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all whitespace-nowrap ${statusFilter === status
                                    ? "bg-primary text-black"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="card border dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm">
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
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-800/50 text-left border-b border-gray-100 dark:border-gray-800">
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                                {filtered.map((order) => (
                                    <motion.tr
                                        key={order._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-mono font-bold text-gray-900 dark:text-white text-xs">
                                                #{order.orderNumber?.split('-')?.[order.orderNumber?.split('-')?.length - 1] || order.orderNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                    <FiUser className="text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                                                        {order.user?.firstName} {order.user?.lastName}
                                                    </p>
                                                    <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">
                                                    {order.items?.[0]?.title || "—"}
                                                </p>
                                                <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">
                                                    {order.items?.[0]?.productType}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="font-bold text-gray-900 dark:text-white text-sm">
                                                ৳{order.totalAmount?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center whitespace-nowrap">
                                            <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusBadge(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-900 dark:text-white">
                                                    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "—"}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {order.orderDate ? new Date(order.orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-lg hover:bg-primary hover:text-black transition-all"
                                                    title="View Details"
                                                >
                                                    <FiEye size={14} />
                                                </button>
                                                {order.paymentStatus === "pending" && (
                                                    <button
                                                        onClick={() => handleApprove(order._id)}
                                                        className="w-8 h-8 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                        title="Approve Order"
                                                    >
                                                        <FiCheck size={14} />
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-950 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Order Invoice</h3>
                                <p className="text-xs text-gray-500 font-mono tracking-widest">{selectedOrder.orderNumber}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-100 rounded-xl transition-all shadow-sm"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
                            {/* Customer Info */}
                            <div className="flex items-center gap-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary p-[2px]">
                                    <div className="w-full h-full bg-white dark:bg-gray-950 rounded-[14px] flex items-center justify-center text-xl font-bold text-primary">
                                        {selectedOrder.user?.firstName?.[0]}{selectedOrder.user?.lastName?.[0]}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        {selectedOrder.user?.firstName} {selectedOrder.user?.lastName}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-1">{selectedOrder.user?.email}</p>
                                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusBadge(selectedOrder.paymentStatus)}`}>
                                        {selectedOrder.paymentStatus}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                    <p className="text-2xl font-black text-primary">৳{selectedOrder.totalAmount?.toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Purchased Items</p>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                <FiPackage className="text-gray-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</p>
                                                <span className="text-[10px] font-bold text-primary uppercase">{item.productType}</span>
                                            </div>
                                            <div className="text-right font-bold text-gray-900 dark:text-white">
                                                ৳{item.price?.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Status Management */}
                            {selectedOrder.paymentStatus === "pending" && (
                                <div className="p-6 bg-primary/5 rounded-3xl border-2 border-dashed border-primary/20 text-center">
                                    <h4 className="font-bold text-primary mb-2 uppercase tracking-widest text-xs">Authorize Order</h4>
                                    <p className="text-xs text-gray-500 mb-6">Verify payment and grant download access to items</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => { handleApprove(selectedOrder._id); setSelectedOrder(null); }}
                                            className="flex-1 bg-primary text-black font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                        >
                                            Confirm Approval
                                        </button>
                                        <button
                                            onClick={() => { handleStatusUpdate(selectedOrder._id, "failed"); setSelectedOrder(null); }}
                                            className="flex-1 bg-red-500 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                        >
                                            Reject Payment
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Already approved status management */}
                            {selectedOrder.paymentStatus !== "pending" && (
                                <div className="flex justify-center gap-4 border-t border-gray-100 dark:border-gray-800 pt-8">
                                    {["completed", "failed", "refunded"].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedOrder._id, status)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border-2 ${selectedOrder.paymentStatus === status
                                                ? "border-primary bg-primary/5 text-primary"
                                                : "border-gray-100 dark:border-gray-800 text-gray-400 hover:border-gray-200"
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
