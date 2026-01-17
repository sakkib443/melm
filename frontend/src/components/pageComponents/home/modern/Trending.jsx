"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiStar, FiExternalLink } from "react-icons/fi";

// Trending Assets Demo Data
const trendingAssets = [
    { id: 1, title: "Modern SaaS UI Kit", category: "UI Kits", price: 29, image: "https://images.unsplash.com/photo-1541462608141-ad4d059450c5?auto=format&fit=crop&q=80&w=800", rating: 4.8, sales: 120, badge: "Best Seller" },
    { id: 2, title: "Abstract 3D Elements", category: "Graphics", price: 15, image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=800", rating: 4.9, sales: 85, badge: "New" },
    { id: 3, title: "Cinematic Intro Pack", category: "Video", price: 45, image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800", rating: 4.7, sales: 210, badge: "Top Rated" },
    { id: 4, title: "E-commerce App Template", category: "App Templates", price: 59, image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800", rating: 4.6, sales: 55, badge: "Verified" },
];

export default function Trending() {
    return (
        <section className="section">
            <div className="container px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-3">
                        <span className="text-xs font-black text-secondary uppercase tracking-[0.3em]">Trending Now</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Curated Masterpieces</h2>
                    </div>
                    <div className="flex gap-2">
                        {["All", "Popular", "New"].map((tab) => (
                            <button key={tab} className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${tab === 'All' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trendingAssets.map((asset, i) => (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="group"
                        >
                            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 bg-gray-100 shadow-xl border border-gray-100 dark:border-gray-700">
                                <img src={asset.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <button className="w-full py-4 bg-white text-gray-900 font-black uppercase text-[10px] tracking-widest rounded-xl shadow-2xl transition-all hover:bg-primary hover:text-white flex items-center justify-center gap-2">
                                        Quick Preview <FiExternalLink />
                                    </button>
                                </div>
                                {asset.badge && (
                                    <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg border border-white/50">
                                        {asset.badge}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{asset.category}</span>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-amber-500"><FiStar className="fill-amber-500" /> {asset.rating}</div>
                                </div>
                                <Link href={`/product/${asset.id}`} className="text-xl font-black text-gray-900 dark:text-white leading-tight block hover:text-primary transition-colors">{asset.title}</Link>
                                <div className="flex items-center justify-between pt-2">
                                    <div className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">${asset.price}</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{asset.sales} Sales</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
