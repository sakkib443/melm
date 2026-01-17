"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPackage, FiSearch, FiLoader, FiEye, FiDownload, FiCalendar,
    FiCheck, FiClock, FiX, FiArrowRight, FiFileText, FiTag, FiShoppingBag
} from "react-icons/fi";
import { orderService } from "@/services/api";

export default function UserOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await orderService.getMyOrders();
            if (response.success) {
                setOrders(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filtered = orders.filter(o => {
        const orderNumMatch = o.orderNumber?.toLowerCase().includes(search.toLowerCase());
        const itemTitleMatch = o.items?.[0]?.title?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || o.paymentStatus === filter;
        return (orderNumMatch || itemTitleMatch) && matchFilter;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case "completed":
                return "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800/30";
            case "pending":
                return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800/30";
            case "failed":
                return "bg-red-50 dark:bg-red-900/20 text-red-600 border-red-100 dark:border-red-800/30";
            default:
                return "bg-gray-50 dark:bg-gray-900/40 text-gray-500 border-gray-100 dark:border-gray-800";
        }
    };

    return (
        <div className="p-6 lg:p-12 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
                        <FiShoppingBag className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Purchase History</h1>
                        <p className="text-gray-500 font-medium">Manage and track your {orders.length} transactions</p>
                    </div>
                </div>

                <div className="flex items-center bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
                    {["all", "completed", "pending"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search & Stats Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 relative group">
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        placeholder="Search by Order ID or Product Title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm outline-none"
                    />
                </div>
                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-0.5">Total Spent</p>
                        <p className="text-xl font-black text-gray-900 dark:text-white">৳{orders.reduce((acc, o) => acc + (o.paymentStatus === 'completed' ? o.totalAmount : 0), 0).toLocaleString()}</p>
                    </div>
                    <FiTag className="text-primary/40" size={24} />
                </div>
            </div>

            {(!mounted || loading) ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading history...</p>
                </div>
            ) : filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-16 text-center bg-white dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-[3rem]"
                >
                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiPackage className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No matching orders found</p>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((order, i) => (
                            <motion.div
                                key={order._id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-5 pl-2 rounded-3xl hover:shadow-xl hover:shadow-primary/5 transition-all relative overflow-hidden"
                            >
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="w-2 h-12 bg-primary/20 rounded-full ml-2 group-hover:bg-primary transition-colors" />

                                    <div className="relative w-20 h-20 shrink-0">
                                        <img src={order.items?.[0]?.image || order.items?.[0]?.thumbnail} alt="" className="w-full h-full rounded-2xl object-cover shadow-md" />
                                        {order.items?.length > 1 && (
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-900 text-white text-[10px] font-black border-2 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                                                +{order.items.length - 1}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-[10px] text-gray-400 font-bold uppercase tracking-tighter">#{order.orderNumber}</span>
                                            <div className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.paymentStatus)}`}>
                                                {order.paymentStatus}
                                            </div>
                                        </div>
                                        <h3 className="font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate max-w-md">
                                            {order.items?.[0]?.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5"><FiCalendar className="text-primary" /> {new Date(order.createdAt || order.orderDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            <span className="flex items-center gap-1.5"><FiClock className="text-primary" /> {new Date(order.createdAt || order.orderDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pr-4 self-stretch border-t md:border-t-0 md:border-l border-gray-50 dark:border-gray-700/50 pt-4 md:pt-0 md:pl-8">
                                        <p className="text-2xl font-black text-primary tracking-tighter">৳{order.totalAmount?.toLocaleString()}</p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-500 hover:text-primary rounded-xl transition-all hover:scale-110 active:scale-90"
                                                title="View Details"
                                            >
                                                <FiEye size={18} />
                                            </button>
                                            {order.paymentStatus === "completed" && (
                                                <button
                                                    className="p-2.5 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-xl transition-all hover:scale-110 active:scale-90"
                                                    title="Download Invoice"
                                                >
                                                    <FiFileText size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setSelectedOrder(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-800 w-full max-w-xl rounded-[2.5rem] shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Receipt Details</h3>
                                    <p className="text-xs font-mono text-gray-400 font-bold uppercase mt-1">Order ID: {selectedOrder.orderNumber}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                                    <FiX size={24} className="text-gray-400" />
                                </button>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden shadow-lg">
                                            <img src={(item.image || item.thumbnail)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">{item.productType}</span>
                                            <p className="font-bold text-gray-900 dark:text-white leading-tight mb-1">{item.title}</p>
                                            <p className="text-lg font-black text-gray-900 dark:text-white pr-2">৳{item.price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-8 border-t border-gray-100 dark:border-gray-700 space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Subtotal</span>
                                        <span className="font-bold text-gray-900 dark:text-white">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="font-bold text-gray-400 uppercase tracking-widest text-[10px]">Applied Discount</span>
                                        <span className="font-bold text-emerald-500">-৳0</span>
                                    </div>
                                    <div className="pt-4 flex justify-between items-end border-t border-gray-50 dark:border-gray-700/50">
                                        <div>
                                            <span className="font-black text-gray-900 dark:text-white uppercase tracking-widest text-xs">Total Amount</span>
                                            <p className="text-xs text-gray-400 font-medium">Charged via {selectedOrder.paymentMethod || 'Online Payment'}</p>
                                        </div>
                                        <span className="text-3xl font-black text-primary tracking-tighter">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-gray-50 dark:bg-gray-900/50 flex gap-4">
                                {selectedOrder.paymentStatus === 'completed' && (
                                    <Link
                                        href={selectedOrder.items?.[0]?.productType === 'course' ? `/courses/${selectedOrder.items?.[0]?.productId}/learn` : '#'}
                                        className="flex-1 py-4 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    >
                                        Access Content <FiArrowRight />
                                    </Link>
                                ) || (
                                        <button className="flex-1 py-4 bg-amber-500 text-white font-black uppercase text-xs tracking-widest rounded-2xl flex items-center justify-center gap-2">
                                            Retry Payment <FiRefreshCw />
                                        </button>
                                    )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
