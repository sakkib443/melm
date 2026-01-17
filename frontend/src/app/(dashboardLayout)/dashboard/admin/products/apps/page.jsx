"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiPlus, FiSearch, FiSmartphone, FiLoader, FiEdit, FiTrash2, FiEye, FiRefreshCw, FiDownload, FiStar } from "react-icons/fi";
import { appTemplateService } from "@/services/api";

export default function AppTemplatesPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const mockData = [
        { _id: "1", title: "Flutter E-commerce App", thumbnail: "https://via.placeholder.com/400x300/6366f1/fff?text=Flutter", price: 4999, salePrice: 2999, framework: "flutter", status: "published", downloads: 234, rating: 4.8 },
        { _id: "2", title: "React Native Social", thumbnail: "https://via.placeholder.com/400x300/ec4899/fff?text=React+Native", price: 3999, salePrice: null, framework: "reactNative", status: "published", downloads: 567, rating: 4.9 },
        { _id: "3", title: "SwiftUI Dashboard", thumbnail: "https://via.placeholder.com/400x300/10b981/fff?text=SwiftUI", price: 5999, salePrice: 3999, framework: "swiftui", status: "draft", downloads: 123, rating: 4.5 },
        { _id: "4", title: "Kotlin Chat App", thumbnail: "https://via.placeholder.com/400x300/f59e0b/fff?text=Kotlin", price: 3499, salePrice: null, framework: "kotlin", status: "published", downloads: 890, rating: 4.7 },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await appTemplateService.getAll();
            setItems(response.success && response.data ? response.data : mockData);
        } catch { setItems(mockData); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this template?")) return;
        try { await appTemplateService.delete(id); toast.success("Deleted"); fetchData(); }
        catch { toast.error("Failed"); }
    };

    const filtered = items.filter(item => {
        const matchSearch = item.title?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || item.framework === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                        <FiSmartphone className="text-white text-lg" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">App Templates</h1>
                        <p className="text-xs text-gray-500">{items.length} templates</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="btn btn-ghost p-3"><FiRefreshCw className={loading ? "animate-spin" : ""} /></button>
                    <Link href="/dashboard/admin/products/apps/create" className="btn btn-primary"><FiPlus /> Add Template</Link>
                </div>
            </div>

            <div className="card border border-gray-200 dark:border-gray-700 p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-12 w-full" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["all", "flutter", "reactNative", "swiftui", "kotlin"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-md text-xs font-medium ${filter === f ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{f === "reactNative" ? "React Native" : f}</button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
            ) : filtered.length === 0 ? (
                <div className="card border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <FiSmartphone className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">No templates found</h3>
                    <p className="text-sm text-gray-500 mb-4">Get started by adding your first app template</p>
                    <Link href="/dashboard/admin/products/apps/create" className="btn btn-primary inline-flex"><FiPlus /> Add Template</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((item, i) => (
                        <motion.div key={item._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card border border-gray-200 dark:border-gray-700 overflow-hidden group">
                            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                {item.salePrice && <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md">SALE</div>}
                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium capitalize ${item.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</div>
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Link href={`/dashboard/admin/products/apps/${item._id}`} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white"><FiEye /></Link>
                                    <Link href={`/dashboard/admin/products/apps/create?edit=${item._id}`} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white"><FiEdit /></Link>
                                    <button onClick={() => handleDelete(item._id)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white"><FiTrash2 /></button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">{item.framework}</span>
                                </div>
                                <h3 className="font-medium text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1"><FiDownload size={12} />{item.downloads}</span>
                                    <span className="flex items-center gap-1"><FiStar size={12} className="text-amber-500" />{item.rating}</span>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                    {item.salePrice ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-semibold text-primary">৳{item.salePrice}</span>
                                            <span className="text-sm text-gray-400 line-through">৳{item.price}</span>
                                        </div>
                                    ) : (
                                        <span className="text-base font-semibold text-gray-900 dark:text-white">৳{item.price}</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
