"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiDownload, FiSearch, FiLoader, FiFile, FiCalendar, FiExternalLink, FiHardDrive, FiActivity, FiArrowRight, FiPackage } from "react-icons/fi";
import { downloadService } from "@/services/api";

export default function UserDownloadsPage() {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchDownloads();
    }, []);

    const fetchDownloads = async () => {
        try {
            setLoading(true);
            const response = await downloadService.getMyDownloads();
            if (response.success) {
                setDownloads(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching downloads:", error);
            toast.error("Failed to load downloads");
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id, title) => {
        try {
            toast.loading(`Preparing ${title}...`, { id: 'dl-toast' });
            const response = await downloadService.getDownloadLink(id);
            if (response.success) {
                const link = document.createElement('a');
                link.href = response.data.downloadUrl;
                link.setAttribute('download', title);
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.success("Ready to download!", { id: 'dl-toast' });
                fetchDownloads(); // Refresh to update count
            }
        } catch (error) {
            toast.error("Download failed to initialize", { id: 'dl-toast' });
        }
    };

    const filtered = downloads.filter(d =>
        (d.productTitle || d.product?.title)?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-12 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
                        <FiHardDrive className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Your Downloads</h1>
                        <p className="text-gray-500 font-medium">Access your purchased assets and digital files</p>
                    </div>
                </div>

                <div className="relative group min-w-[300px]">
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        placeholder="Search assets..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                </div>
            </div>

            {(!mounted || loading) ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Scanning your storage...</p>
                </div>
            ) : filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-20 text-center bg-white dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-[3.5rem]"
                >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiDownload className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No files found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Digital assets you purchase in our marketplace will appear here ready to download.</p>
                    <Link href="/products" className="px-10 py-4 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2">
                        Get Started <FiArrowRight />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((item, i) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-[3rem] hover:shadow-2xl hover:shadow-primary/5 transition-all overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-150 transition-transform duration-700 pointer-events-none">
                                    <FiPackage size={100} />
                                </div>

                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-start justify-between">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shadow-inner">
                                            <img src={item.product?.thumbnail || item.product?.images?.[0] || `https://via.placeholder.com/80?text=${item.productType}`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800/20 text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                                                {item.productType}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <FiActivity className="text-primary" /> {item.downloadCount} Downloads
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-primary transition-colors truncate">
                                            {item.productTitle}
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                                                <FiCalendar className="text-primary" /> {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-gray-400 font-bold flex items-center gap-1.5 line-clamp-1">
                                                <FiFile className="text-primary" /> Max: {item.maxDownloads}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3">
                                        <button
                                            onClick={() => handleDownload(item._id, item.productTitle)}
                                            className="flex-1 py-4 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            Download <FiDownload />
                                        </button>
                                        <Link
                                            href={`/${item.productType === 'graphics' ? 'graphics' :
                                                    item.productType === 'audio' ? 'audio' :
                                                        item.productType === 'video-template' ? 'video-templates' :
                                                            item.productType === 'ui-kit' ? 'ui-kits' :
                                                                item.productType === 'app-template' ? 'app-templates' :
                                                                    item.productType + 's'
                                                }/${item.product?.slug || item.product?._id}`}
                                            className="w-14 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-primary rounded-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all"
                                            title="View Product"
                                        >
                                            <FiExternalLink size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
