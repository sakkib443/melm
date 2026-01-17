"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiImage, FiVideo, FiLayout, FiSmartphone, FiMusic, FiCamera, FiType, FiBook, FiCode } from "react-icons/fi";

// Product Categories
const categories = [
    { icon: FiImage, name: "Graphics", count: "2,500+", color: "bg-pink-500", href: "/graphics" },
    { icon: FiVideo, name: "Video Templates", count: "1,200+", color: "bg-purple-500", href: "/video-templates" },
    { icon: FiLayout, name: "UI Kits", count: "800+", color: "bg-blue-500", href: "/ui-kits" },
    { icon: FiSmartphone, name: "App Templates", count: "600+", color: "bg-cyan-500", href: "/app-templates" },
    { icon: FiMusic, name: "Audio", count: "3,000+", color: "bg-orange-500", href: "/audio" },
    { icon: FiCamera, name: "Photos", count: "10,000+", color: "bg-emerald-500", href: "/photos" },
    { icon: FiType, name: "Fonts", count: "500+", color: "bg-amber-500", href: "/fonts" },
    { icon: FiBook, name: "Courses", count: "400+", color: "bg-indigo-500", href: "/courses" },
    { icon: FiCode, name: "Software", count: "300+", color: "bg-rose-500", href: "/software" },
];

export default function Categories() {
    return (
        <section className="section bg-gray-50/50 dark:bg-gray-800/20">
            <div className="container px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-3">
                        <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">Curation</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Explore Categories</h2>
                    </div>
                    <Link href="/categories" className="flex items-center gap-2 font-bold text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors group">
                        Browse all categories <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Link href={cat.href} className="group block relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-[2rem] hover:shadow-2xl hover:shadow-primary/5 transition-all">
                                <div className={`w-14 h-14 rounded-2xl ${cat.color} text-white flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                                    <cat.icon size={24} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{cat.count} items</p>
                                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-all group-hover:-translate-x-2 group-hover:-translate-y-2">
                                    <cat.icon size={80} />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
