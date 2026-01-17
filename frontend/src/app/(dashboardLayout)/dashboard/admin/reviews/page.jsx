"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiSearch, FiStar, FiLoader, FiTrash2, FiRefreshCw, FiUser, FiCalendar, FiCheck, FiX } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const mockData = [
        { _id: "1", user: { firstName: "John", lastName: "Doe" }, product: { title: "Premium UI Kit" }, rating: 5, comment: "Amazing product! Exactly what I needed for my project.", status: "approved", createdAt: new Date() },
        { _id: "2", user: { firstName: "Jane", lastName: "Smith" }, product: { title: "React Course" }, rating: 4, comment: "Great course content, very helpful instructor.", status: "approved", createdAt: new Date(Date.now() - 86400000) },
        { _id: "3", user: { firstName: "Mike", lastName: "Johnson" }, product: { title: "Logo Templates" }, rating: 3, comment: "Good templates but could use more variety.", status: "pending", createdAt: new Date(Date.now() - 172800000) },
        { _id: "4", user: { firstName: "Sarah", lastName: "Williams" }, product: { title: "Audio Pack" }, rating: 5, comment: "Excellent quality audio files!", status: "approved", createdAt: new Date(Date.now() - 259200000) },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;
            const res = await fetch(`${API_BASE}/api/reviews/admin/all`, { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} });
            const data = await res.json();
            setReviews(data.success && data.data ? data.data : mockData);
        } catch { setReviews(mockData); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleAction = async (id, action) => {
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;
            if (action === "delete") {
                if (!confirm("Delete this review?")) return;
                await fetch(`${API_BASE}/api/reviews/${id}`, { method: "DELETE", headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} });
                toast.success("Deleted");
            } else {
                await fetch(`${API_BASE}/api/reviews/admin/${id}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
                    body: JSON.stringify({ status: action }),
                });
                toast.success(`Review ${action}`);
            }
            fetchData();
        } catch { toast.error("Failed"); }
    };

    const filtered = reviews.filter(r => {
        const matchSearch = r.comment?.toLowerCase().includes(search.toLowerCase()) || r.product?.title?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || r.status === filter;
        return matchSearch && matchFilter;
    });

    const stats = {
        total: reviews.length,
        approved: reviews.filter(r => r.status === "approved").length,
        pending: reviews.filter(r => r.status === "pending").length,
        avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0).toFixed(1),
    };

    const renderStars = (rating) => [...Array(5)].map((_, i) => (
        <FiStar key={i} className={i < rating ? "text-amber-500 fill-amber-500" : "text-gray-300"} size={14} />
    ));

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <FiStar className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
                        <p className="text-sm text-gray-500">{reviews.length} reviews</p>
                    </div>
                </div>
                <button onClick={fetchData} className="btn btn-ghost p-3"><FiRefreshCw className={loading ? "animate-spin" : ""} /></button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-xs text-gray-500">Total Reviews</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
                    <p className="text-xs text-gray-500">Approved</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                    <p className="text-xs text-gray-500">Pending</p>
                </div>
                <div className="card p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                        <FiStar className="text-amber-500 fill-amber-500" />
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgRating}</span>
                    </div>
                    <p className="text-xs text-gray-500">Avg Rating</p>
                </div>
            </div>

            <div className="card p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input placeholder="Search reviews..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-12 w-full" />
                </div>
                <div className="flex gap-2">
                    {["all", "approved", "pending", "rejected"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${filter === f ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{f}</button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((review, i) => (
                        <motion.div key={review._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">{review.user?.firstName} {review.user?.lastName}</p>
                                            <p className="text-sm text-gray-500">on <span className="font-medium text-primary">{review.product?.title}</span></p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${review.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                                                review.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                                                }`}>{review.status}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">{renderStars(review.rating)}</div>
                                    <p className="text-gray-600 dark:text-gray-300 mb-3">{review.comment}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                            <FiCalendar size={12} />{new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2">
                                            {review.status === "pending" && (
                                                <>
                                                    <button onClick={() => handleAction(review._id, "approved")} className="btn btn-ghost text-emerald-500 text-xs p-2"><FiCheck /> Approve</button>
                                                    <button onClick={() => handleAction(review._id, "rejected")} className="btn btn-ghost text-red-500 text-xs p-2"><FiX /> Reject</button>
                                                </>
                                            )}
                                            <button onClick={() => handleAction(review._id, "delete")} className="btn btn-ghost text-red-500 p-2"><FiTrash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
