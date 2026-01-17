"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiDownload, FiSearch, FiLoader, FiRefreshCw, FiFile, FiUser, FiCalendar,
    FiPackage, FiExternalLink
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DownloadsPage() {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const mockData = [
        { _id: "1", user: { firstName: "John", lastName: "Doe", email: "john@example.com" }, product: { title: "Premium UI Kit", type: "uiKit" }, downloadedAt: new Date(), ip: "192.168.1.1" },
        { _id: "2", user: { firstName: "Jane", lastName: "Smith", email: "jane@example.com" }, product: { title: "Logo Templates", type: "graphics" }, downloadedAt: new Date(Date.now() - 3600000), ip: "192.168.1.2" },
        { _id: "3", user: { firstName: "Mike", lastName: "Johnson", email: "mike@example.com" }, product: { title: "React Course", type: "course" }, downloadedAt: new Date(Date.now() - 7200000), ip: "192.168.1.3" },
        { _id: "4", user: { firstName: "Sarah", lastName: "Williams", email: "sarah@example.com" }, product: { title: "Audio Pack", type: "audio" }, downloadedAt: new Date(Date.now() - 14400000), ip: "192.168.1.4" },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;
            const res = await fetch(`${API_BASE}/api/downloads`, { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} });
            const data = await res.json();
            setDownloads(data.success && data.data ? data.data : mockData);
        } catch { setDownloads(mockData); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = downloads.filter(d =>
        d.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        d.product?.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <FiDownload className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Downloads</h1>
                        <p className="text-sm text-gray-500">{downloads.length} downloads</p>
                    </div>
                </div>
                <button onClick={fetchData} className="btn btn-ghost p-3"><FiRefreshCw className={loading ? "animate-spin" : ""} /></button>
            </div>

            <div className="card p-4">
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input placeholder="Search by user or product..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-12 w-full" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">User</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filtered.map((item, i) => (
                                    <motion.tr key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                                                    {item.user?.firstName?.[0]}{item.user?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{item.user?.firstName} {item.user?.lastName}</p>
                                                    <p className="text-xs text-gray-500">{item.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 dark:text-white">{item.product?.title}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-bold uppercase">{item.product?.type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500">{new Date(item.downloadedAt).toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="text-xs text-gray-500">{item.ip}</code>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
