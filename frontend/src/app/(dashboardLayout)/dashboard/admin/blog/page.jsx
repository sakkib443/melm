"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiPlus, FiSearch, FiFileText, FiLoader, FiEdit, FiTrash2, FiEye,
    FiRefreshCw, FiCalendar, FiUser, FiMessageCircle
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const mockData = [
        { _id: "1", title: "Getting Started with Web Development", slug: "getting-started-web-dev", thumbnail: "https://via.placeholder.com/400x250/6366f1/fff?text=Blog", status: "published", author: { firstName: "John", lastName: "Doe" }, views: 1234, comments: 23, createdAt: new Date() },
        { _id: "2", title: "Top 10 UI Design Trends 2024", slug: "ui-design-trends-2024", thumbnail: "https://via.placeholder.com/400x250/ec4899/fff?text=Blog", status: "published", author: { firstName: "Jane", lastName: "Smith" }, views: 2345, comments: 45, createdAt: new Date(Date.now() - 86400000) },
        { _id: "3", title: "How to Build a Successful Online Business", slug: "online-business-guide", thumbnail: "https://via.placeholder.com/400x250/10b981/fff?text=Blog", status: "draft", author: { firstName: "Mike", lastName: "Johnson" }, views: 567, comments: 12, createdAt: new Date(Date.now() - 172800000) },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/blogs`);
            const data = await res.json();
            setPosts(data.success && data.data ? data.data : mockData);
        } catch { setPosts(mockData); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this post?")) return;
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;
            await fetch(`${API_BASE}/api/blogs/${id}`, {
                method: "DELETE",
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            });
            toast.success("Deleted");
            fetchData();
        } catch { toast.error("Failed"); }
    };

    const filtered = posts.filter(p => {
        const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || p.status === filter;
        return matchSearch && matchFilter;
    });

    const getStatusBadge = (status) => ({
        published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        draft: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    }[status] || "bg-gray-100 text-gray-600");

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FiFileText className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
                        <p className="text-sm text-gray-500">{posts.length} posts</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="btn btn-ghost p-3"><FiRefreshCw className={loading ? "animate-spin" : ""} /></button>
                    <Link href="/admin/blog/create" className="btn btn-primary"><FiPlus /> New Post</Link>
                </div>
            </div>

            <div className="card p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-12 w-full" />
                </div>
                <div className="flex gap-2">
                    {["all", "published", "draft"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${filter === f ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{f}</button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((post, i) => (
                        <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card overflow-hidden group">
                            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold capitalize ${getStatusBadge(post.status)}`}>{post.status}</span>
                                </div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Link href={`/admin/blog/${post._id}`} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white"><FiEye /></Link>
                                    <Link href={`/admin/blog/${post._id}/edit`} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white"><FiEdit /></Link>
                                    <button onClick={() => handleDelete(post._id)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white"><FiTrash2 /></button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{post.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                    <FiUser size={14} />
                                    <span>{post.author?.firstName} {post.author?.lastName}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <span className="flex items-center gap-1"><FiEye />{post.views}</span>
                                    <span className="flex items-center gap-1"><FiMessageCircle />{post.comments}</span>
                                    <span className="flex items-center gap-1"><FiCalendar />{new Date(post.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
