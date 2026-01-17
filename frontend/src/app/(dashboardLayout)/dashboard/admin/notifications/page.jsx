"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiBell, FiCheck, FiCheckCircle, FiLoader, FiRefreshCw, FiTrash2,
    FiShoppingBag, FiUser, FiStar, FiMessageCircle, FiDollarSign
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const mockData = [
        { _id: "1", type: "order", title: "New Order Received", message: "John Doe purchased Premium UI Kit for ৳2,999", isRead: false, createdAt: new Date() },
        { _id: "2", type: "user", title: "New User Registration", message: "jane@example.com joined as a buyer", isRead: false, createdAt: new Date(Date.now() - 3600000) },
        { _id: "3", type: "review", title: "New Review", message: "5-star review on React Course by Mike", isRead: true, createdAt: new Date(Date.now() - 7200000) },
        { _id: "4", type: "withdrawal", title: "Withdrawal Request", message: "Seller John requested ৳15,000 withdrawal", isRead: false, createdAt: new Date(Date.now() - 14400000) },
        { _id: "5", type: "message", title: "New Support Message", message: "Customer support ticket #1234 received", isRead: true, createdAt: new Date(Date.now() - 28800000) },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;
            const res = await fetch(`${API_BASE}/api/notifications`, { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} });
            const data = await res.json();
            setNotifications(data.success && data.data ? data.data : mockData);
        } catch { setNotifications(mockData); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const markAsRead = async (id) => {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        toast.success("Marked as read");
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        toast.success("All marked as read");
    };

    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n._id !== id));
        toast.success("Deleted");
    };

    const getIcon = (type) => {
        const icons = { order: FiShoppingBag, user: FiUser, review: FiStar, withdrawal: FiDollarSign, message: FiMessageCircle };
        const Icon = icons[type] || FiBell;
        return <Icon size={18} />;
    };

    const getColor = (type) => {
        const colors = { order: "from-green-500 to-emerald-500", user: "from-blue-500 to-indigo-500", review: "from-amber-500 to-orange-500", withdrawal: "from-purple-500 to-pink-500", message: "from-cyan-500 to-blue-500" };
        return colors[type] || "from-gray-500 to-gray-600";
    };

    const filtered = notifications.filter(n => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.isRead;
        return n.type === filter;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg relative">
                        <FiBell className="text-white text-xl" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                        )}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                        <p className="text-sm text-gray-500">{unreadCount} unread</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={markAllAsRead} className="btn btn-ghost"><FiCheckCircle /> Mark All Read</button>
                    <button onClick={fetchData} className="btn btn-ghost p-3"><FiRefreshCw className={loading ? "animate-spin" : ""} /></button>
                </div>
            </div>

            <div className="card p-4">
                <div className="flex gap-2 flex-wrap">
                    {["all", "unread", "order", "user", "review", "withdrawal"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${filter === f ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{f}</button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
            ) : filtered.length === 0 ? (
                <div className="card p-12 text-center">
                    <FiBell className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No notifications</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((notif, i) => (
                        <motion.div
                            key={notif._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className={`card p-4 flex items-center gap-4 ${!notif.isRead ? "bg-primary-10 border-primary/20" : ""}`}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColor(notif.type)} flex items-center justify-center text-white shadow-lg`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-gray-900 dark:text-white">{notif.title}</h3>
                                    {!notif.isRead && <span className="w-2 h-2 bg-primary rounded-full" />}
                                </div>
                                <p className="text-sm text-gray-500 truncate">{notif.message}</p>
                            </div>
                            <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(notif.createdAt)}</span>
                            <div className="flex gap-1">
                                {!notif.isRead && (
                                    <button onClick={() => markAsRead(notif._id)} className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg">
                                        <FiCheck size={16} />
                                    </button>
                                )}
                                <button onClick={() => handleDelete(notif._id)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
