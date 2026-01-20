"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiGrid, FiList, FiHeart, FiShoppingCart,
    FiStar, FiDownload, FiArrowRight, FiChevronDown, FiEye, FiLoader,
    FiLayers, FiMonitor, FiSmartphone
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { uiKitService, cartService } from "@/services/api";

// UI Kit Categories
const categories = [
    { name: "All", nameBn: "সব" },
    { name: "Web", nameBn: "ওয়েব" },
    { name: "Mobile", nameBn: "মোবাইল" },
    { name: "Dashboard", nameBn: "ড্যাশবোর্ড" },
    { name: "E-commerce", nameBn: "ই-কমার্স" },
    { name: "Landing Page", nameBn: "ল্যান্ডিং পেজ" },
];

export default function UIKitsPage() {
    const { language } = useLanguage();
    const [kits, setKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        const fetchKits = async () => {
            try {
                setLoading(true);
                const res = await uiKitService.getAll("?status=published");
                if (res.success) {
                    setKits(res.data || []);
                }
            } catch (error) {
                console.error("Error fetching UI kits:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchKits();
    }, []);

    const filteredKits = kits
        .filter(kit => {
            if (selectedCategory !== "All" && kit.category !== selectedCategory) return false;
            if (search && !kit.title?.toLowerCase().includes(search.toLowerCase())) return false;
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

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <FiLayers className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'ইউআই কিট কালেকশন' : 'UI Kit Collection'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-heading uppercase">
                            {language === 'bn' ? 'প্রিমিয়াম' : 'PREMIUM'}
                            <span className="text-primary"> UI KITS</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn'
                                ? 'ডেভেলপমেন্ট দ্রুত করুন প্রিমিয়াম UI কম্পোনেন্ট এবং ডিজাইন সিস্টেম দিয়ে।'
                                : 'Speed up development with premium UI components and design systems.'}
                        </p>

                        <div className="relative max-w-xl mx-auto">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={language === 'bn' ? 'UI কিট খুঁজুন...' : 'Search UI kits...'}
                                className="w-full pl-14 pr-6 py-4 bg-gray-100 dark:bg-gray-900 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Grid Section */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.name
                                            ? 'bg-primary text-black'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                                        }`}
                                >
                                    {language === 'bn' ? cat.nameBn : cat.name}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm font-medium cursor-pointer focus:outline-none"
                                >
                                    <option value="popular">{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</option>
                                    <option value="newest">{language === 'bn' ? 'নতুন' : 'Newest'}</option>
                                    <option value="price-low">{language === 'bn' ? 'দাম: কম' : 'Price: Low'}</option>
                                    <option value="price-high">{language === 'bn' ? 'দাম: বেশি' : 'Price: High'}</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                            </div>

                            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                                <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-full ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}>
                                    <FiGrid className="w-4 h-4" />
                                </button>
                                <button onClick={() => setViewMode("list")} className={`p-2.5 rounded-full ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}>
                                    <FiList className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-500 mb-6">{language === 'bn' ? `${filteredKits.length}টি UI কিট` : `Showing ${filteredKits.length} UI kits`}</p>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="aspect-[16/10] skeleton" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 skeleton rounded w-3/4" />
                                        <div className="h-8 skeleton rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredKits.length === 0 ? (
                        <div className="text-center py-20">
                            <FiLayers className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{language === 'bn' ? 'পাওয়া যায়নি' : 'No UI kits found'}</h3>
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                            {filteredKits.map((kit, index) => (
                                <UIKitCard key={kit._id} kit={kit} index={index} language={language} />
                            ))}
                        </div>
                    )}

                    {filteredKits.length > 0 && (
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

// UI Kit Card
function UIKitCard({ kit, index, language }) {
    const [addingToCart, setAddingToCart] = useState(false);
    const discount = kit.price > 0 && kit.salePrice ? Math.round(((kit.price - kit.salePrice) / kit.price) * 100) : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({
                productId: kit._id,
                productType: 'uikit',
                price: kit.salePrice || kit.price,
                title: kit.title,
                image: kit.thumbnail
            });
            if (res.success) toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added!');
        } catch (error) {
            toast.error(error.message || 'Failed');
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all hover:shadow-xl"
        >
            <Link href={`/ui-kits/${kit.slug || kit._id}`} className="relative block">
                <div className="relative aspect-[16/10] bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                    {kit.thumbnail ? (
                        <img src={kit.thumbnail} alt={kit.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <FiLayers className="w-16 h-16 text-white/50" />
                        </div>
                    )}
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
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-900/30 text-blue-600">{kit.category || 'UI Kit'}</span>
                    {kit.platform && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            {kit.platform === 'Mobile' ? <FiSmartphone className="w-3 h-3" /> : <FiMonitor className="w-3 h-3" />}
                            {kit.platform}
                        </span>
                    )}
                </div>

                <Link href={`/ui-kits/${kit.slug || kit._id}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">{kit.title}</h3>
                </Link>

                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{kit.rating?.toFixed(1) || "0.0"}</span>
                    <span className="flex items-center gap-1"><FiDownload className="w-3.5 h-3.5" />{kit.downloads || 0}</span>
                    <span className="flex items-center gap-1"><FiHeart className="w-3.5 h-3.5" />{kit.likes || 0}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        {discount > 0 ? (
                            <><span className="text-xl font-bold text-primary">৳{kit.salePrice}</span><span className="text-sm text-gray-400 line-through">৳{kit.price}</span></>
                        ) : (
                            <span className="text-xl font-bold text-gray-900 dark:text-white">৳{kit.price || 0}</span>
                        )}
                    </div>
                    <button onClick={handleAddToCart} disabled={addingToCart} className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full hover:bg-primary/90 disabled:opacity-50">
                        {addingToCart ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiShoppingCart className="w-4 h-4" />}
                        {language === 'bn' ? 'কার্টে' : 'Add'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
