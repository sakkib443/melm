"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiGrid, FiHeart, FiShoppingCart,
    FiStar, FiDownload, FiArrowRight, FiChevronDown, FiEye, FiLoader,
    FiPackage, FiSmartphone, FiMonitor, FiGlobe
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { appTemplateService, cartService } from "@/services/api";

// App Categories
const categories = [
    { name: "All", nameBn: "সব" },
    { name: "iOS", nameBn: "iOS" },
    { name: "Android", nameBn: "অ্যান্ড্রয়েড" },
    { name: "React Native", nameBn: "রিঅ্যাক্ট নেটিভ" },
    { name: "Flutter", nameBn: "ফ্লাটার" },
    { name: "Web App", nameBn: "ওয়েব অ্যাপ" },
];

export default function AppTemplatesPage() {
    const { language } = useLanguage();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        const fetchApps = async () => {
            try {
                setLoading(true);
                const res = await appTemplateService.getAll("?status=published");
                if (res.success) setApps(res.data || []);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const filteredApps = apps
        .filter(app => {
            if (selectedCategory !== "All" && app.category !== selectedCategory) return false;
            if (search && !app.title?.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "price-low") return (a.salePrice || a.price) - (b.salePrice || b.price);
            if (sortBy === "price-high") return (b.salePrice || b.price) - (a.salePrice || a.price);
            return (b.downloads || 0) - (a.downloads || 0);
        });

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    <motion.div className="text-center max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <FiPackage className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'অ্যাপ টেমপ্লেট' : 'App Templates'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-heading uppercase">
                            APP<span className="text-primary"> TEMPLATES</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn' ? 'আপনার পরবর্তী অ্যাপ দ্রুত লঞ্চ করুন প্রিমিয়াম টেমপ্লেট দিয়ে।' : 'Launch your next app faster with premium templates.'}
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={language === 'bn' ? 'অ্যাপ খুঁজুন...' : 'Search apps...'} className="w-full pl-14 pr-6 py-4 bg-gray-100 dark:bg-gray-900 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map((cat) => (
                                <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.name ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>
                                    {language === 'bn' ? cat.nameBn : cat.name}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm font-medium cursor-pointer focus:outline-none">
                                <option value="popular">{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</option>
                                <option value="newest">{language === 'bn' ? 'নতুন' : 'Newest'}</option>
                                <option value="price-low">{language === 'bn' ? 'দাম: কম' : 'Price: Low'}</option>
                                <option value="price-high">{language === 'bn' ? 'দাম: বেশি' : 'Price: High'}</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        </div>
                    </div>

                    <p className="text-gray-500 mb-6">{language === 'bn' ? `${filteredApps.length}টি অ্যাপ` : `Showing ${filteredApps.length} apps`}</p>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800"><div className="aspect-[4/3] skeleton" /><div className="p-5 space-y-3"><div className="h-5 skeleton rounded w-3/4" /><div className="h-8 skeleton rounded" /></div></div>)}
                        </div>
                    ) : filteredApps.length === 0 ? (
                        <div className="text-center py-20">
                            <FiPackage className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{language === 'bn' ? 'পাওয়া যায়নি' : 'No apps found'}</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredApps.map((app, index) => <AppCard key={app._id} app={app} index={index} language={language} />)}
                        </div>
                    )}

                    {filteredApps.length > 0 && (
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase rounded-full hover:bg-primary hover:text-black transition-all">
                                {language === 'bn' ? 'আরো দেখুন' : 'Load More'} <FiArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

function AppCard({ app, index, language }) {
    const [addingToCart, setAddingToCart] = useState(false);
    const discount = app.price > 0 && app.salePrice ? Math.round(((app.price - app.salePrice) / app.price) * 100) : 0;

    const platformIcon = app.platform === 'iOS' ? FiSmartphone : app.platform === 'Android' ? FiSmartphone : app.platform === 'Web App' ? FiGlobe : FiMonitor;
    const PlatformIcon = platformIcon;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({ productId: app._id, productType: 'apptemplate', price: app.salePrice || app.price, title: app.title, image: app.thumbnail });
            if (res.success) toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added!');
        } catch (e) { toast.error('Failed'); } finally { setAddingToCart(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all hover:shadow-xl">
            <Link href={`/app-templates/${app.slug || app._id}`} className="relative block">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-500 to-teal-600 overflow-hidden">
                    {app.thumbnail ? <img src={app.thumbnail} alt={app.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <FiPackage className="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" />}
                    {discount > 0 && <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full">{discount}% OFF</div>}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary transition-colors"><FiEye className="w-5 h-5" /></button>
                        <button onClick={handleAddToCart} disabled={addingToCart} className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary transition-colors">
                            {addingToCart ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiShoppingCart className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </Link>
            <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">{app.category || 'App'}</span>
                    {app.platform && <span className="flex items-center gap-1 text-xs text-gray-500"><PlatformIcon className="w-3 h-3" />{app.platform}</span>}
                </div>
                <Link href={`/app-templates/${app.slug || app._id}`}><h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">{app.title}</h3></Link>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{app.rating?.toFixed(1) || "0.0"}</span>
                    <span className="flex items-center gap-1"><FiDownload className="w-3.5 h-3.5" />{app.downloads || 0}</span>
                    <span className="flex items-center gap-1"><FiHeart className="w-3.5 h-3.5" />{app.likes || 0}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>{discount > 0 ? <><span className="text-xl font-bold text-primary">৳{app.salePrice}</span><span className="text-sm text-gray-400 line-through ml-2">৳{app.price}</span></> : <span className="text-xl font-bold text-gray-900 dark:text-white">৳{app.price || 0}</span>}</div>
                    <button onClick={handleAddToCart} disabled={addingToCart} className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full hover:bg-primary/90 disabled:opacity-50">
                        {addingToCart ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiShoppingCart className="w-4 h-4" />} {language === 'bn' ? 'কার্টে' : 'Add'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
