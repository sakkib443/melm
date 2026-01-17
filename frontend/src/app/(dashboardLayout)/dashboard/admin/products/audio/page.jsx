"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiSearch, FiMusic, FiLoader, FiEdit, FiTrash2, FiRefreshCw, FiDownload, FiStar, FiPlay, FiPause } from "react-icons/fi";
import { audioService } from "@/services/api";

export default function AudioPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [playing, setPlaying] = useState(null);

    const mockData = [
        { _id: "1", title: "Upbeat Corporate Music", thumbnail: "https://via.placeholder.com/200/6366f1/fff?text=🎵", price: 499, type: "music", status: "published", downloads: 1234, rating: 4.8, duration: "2:45" },
        { _id: "2", title: "Podcast Intro Pack", thumbnail: "https://via.placeholder.com/200/ec4899/fff?text=🎙️", price: 299, type: "podcast", status: "published", downloads: 567, rating: 4.9, duration: "0:15" },
        { _id: "3", title: "Cinematic SFX Bundle", thumbnail: "https://via.placeholder.com/200/10b981/fff?text=🔊", price: 999, type: "sfx", status: "published", downloads: 890, rating: 4.7, duration: "various" },
        { _id: "4", title: "Relaxing Ambient", thumbnail: "https://via.placeholder.com/200/f59e0b/fff?text=🎶", price: 399, type: "music", status: "draft", downloads: 234, rating: 4.5, duration: "4:30" },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await audioService.getAll();
            setItems(response.success && response.data ? response.data : mockData);
        } catch { setItems(mockData); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this item?")) return;
        try { await audioService.delete(id); toast.success("Deleted"); fetchData(); }
        catch { toast.error("Failed"); }
    };

    const filtered = items.filter(item => {
        const matchSearch = item.title?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || item.type === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                        <FiMusic className="text-white text-lg" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Audio</h1>
                        <p className="text-xs text-gray-500">{items.length} items</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="btn btn-ghost p-3"><FiRefreshCw className={loading ? "animate-spin" : ""} /></button>
                    <Link href="/dashboard/admin/products/audio/create" className="btn btn-primary"><FiPlus /> Add Audio</Link>
                </div>
            </div>

            <div className="card border border-gray-200 dark:border-gray-700 p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-12 w-full" />
                </div>
                <div className="flex gap-2">
                    {["all", "music", "sfx", "podcast"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-md text-xs font-medium capitalize ${filter === f ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{f}</button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
            ) : filtered.length === 0 ? (
                <div className="card border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <FiMusic className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">No audio found</h3>
                    <p className="text-sm text-gray-500 mb-4">Get started by adding your first audio</p>
                    <Link href="/dashboard/admin/products/audio/create" className="btn btn-primary inline-flex"><FiPlus /> Add Audio</Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((item, i) => (
                        <motion.div key={item._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card border border-gray-200 dark:border-gray-700 p-4 flex items-center gap-4 group">
                            <button onClick={() => setPlaying(playing === item._id ? null : item._id)} className={`w-12 h-12 rounded-md flex items-center justify-center transition-all ${playing === item._id ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 group-hover:bg-primary group-hover:text-white"}`}>
                                {playing === item._id ? <FiPause size={18} /> : <FiPlay size={18} />}
                            </button>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                    <span className={`px-2 py-0.5 rounded-md font-medium uppercase ${item.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
                                    <span className="uppercase font-medium">{item.type}</span>
                                    <span>{item.duration}</span>
                                    <span className="flex items-center gap-1"><FiDownload size={12} />{item.downloads}</span>
                                    <span className="flex items-center gap-1"><FiStar size={12} className="text-amber-500" />{item.rating}</span>
                                </div>
                            </div>
                            <span className="text-base font-semibold text-gray-900 dark:text-white">৳{item.price}</span>
                            <Link href={`/dashboard/admin/products/audio/create?edit=${item._id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                                <FiEdit size={16} />
                            </Link>
                            <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-all">
                                <FiTrash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
