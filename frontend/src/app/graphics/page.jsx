"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiSearch,
    FiFilter,
    FiGrid,
    FiList,
    FiHeart,
    FiShoppingCart,
    FiStar,
    FiDownload,
    FiArrowRight,
    FiChevronDown,
    FiX,
    FiEye,
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { graphicsService } from "@/services/api";

export default function GraphicsPage() {
    const { language } = useLanguage();
    const [graphics, setGraphics] = useState([]);
    const [categories, setCategories] = useState([{ name: "All", nameBn: "সব", count: 0 }]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("popular");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // Fetch Categories and initial counts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Fetch published graphics to extract categories and counts
                // In a real app, you might have a dedicated category stats endpoint
                const res = await graphicsService.getAll("?status=published&limit=1000");
                if (res?.data) {
                    const catMap = {
                        "All": { name: "All", nameBn: "সব", count: res.meta.total }
                    };

                    res.data.forEach(item => {
                        if (item.category) {
                            const catName = item.category.name;
                            if (!catMap[catName]) {
                                catMap[catName] = {
                                    name: catName,
                                    nameBn: item.category.nameBn || catName,
                                    count: 0,
                                    _id: item.category._id
                                };
                            }
                            catMap[catName].count++;
                        }
                    });
                    setCategories(Object.values(catMap));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch Graphics
    const fetchGraphics = async (isLoadMore = false) => {
        if (!isLoadMore) setLoading(true);
        try {
            let query = `?status=published&page=${page}&limit=12`;

            // Sorting mapping
            if (sortBy === "popular") query += "&sortBy=downloads&sortOrder=desc";
            if (sortBy === "newest") query += "&sortBy=createdAt&sortOrder=desc";
            if (sortBy === "price-low") query += "&sortBy=price&sortOrder=asc";
            if (sortBy === "price-high") query += "&sortBy=price&sortOrder=desc";
            if (sortBy === "rating") query += "&sortBy=rating&sortOrder=desc";

            // Category filter
            if (selectedCategory !== "All") {
                const cat = categories.find(c => c.name === selectedCategory);
                if (cat?._id) query += `&category=${cat._id}`;
            }

            // Search query
            if (searchQuery) query += `&searchTerm=${searchQuery}`;

            const res = await graphicsService.getAll(query);
            if (res?.data) {
                if (isLoadMore) {
                    setGraphics(prev => [...prev, ...res.data]);
                } else {
                    setGraphics(res.data);
                }
                setTotalPages(res.meta.totalPages);
                setTotalResults(res.meta.total);
            }
        } catch (error) {
            console.error("Error fetching graphics:", error);
        } finally {
            setLoading(false);
        }
    };

    // Refetch when filters change
    useEffect(() => {
        setPage(1);
        fetchGraphics(false);
    }, [selectedCategory, sortBy, searchQuery]);

    // Fetch more for pagination
    useEffect(() => {
        if (page > 1) {
            fetchGraphics(true);
        }
    }, [page]);

    const handleLoadMore = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    // Helper functions for localized content
    const getTitle = (item) => (language === 'bn' ? (item.titleBn || item.title) : item.title);
    const getCatName = (item) => (language === 'bn' ? (item.category?.nameBn || item.category?.name || "Graphics") : (item.category?.name || "Graphics"));

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
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'প্রিমিয়াম কালেকশন' : 'Premium Collection'}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9] mb-6">
                            {language === 'bn' ? 'গ্রাফিক্স' : 'GRAPHICS'}
                            <br />
                            <span className="text-primary">{language === 'bn' ? 'টেমপ্লেট।' : 'TEMPLATES.'}</span>
                        </h1>

                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                            {language === 'bn'
                                ? 'আপনার প্রকল্পের জন্য প্রিমিয়াম গ্রাফিক ডিজাইন টেমপ্লেট আবিষ্কার করুন। লোগো, সোশ্যাল মিডিয়া, বিজনেস কার্ড এবং আরও অনেক কিছু।'
                                : 'Discover premium graphic design templates for your projects. Logos, social media, business cards, and much more.'}
                        </p>

                        <div className="relative max-w-2xl mx-auto">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={language === 'bn' ? 'টেমপ্লেট খুঁজুন...' : 'Search templates...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-lg focus:outline-none focus:border-primary transition-colors"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-primary text-black font-bold uppercase text-sm rounded-full hover:bg-primary/90 transition-colors">
                                {language === 'bn' ? 'খুঁজুন' : 'Search'}
                            </button>
                        </div>

                        <div className="flex items-center justify-center gap-8 mt-10">
                            <div className="text-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{totalResults}+</span>
                                <p className="text-sm text-gray-500">{language === 'bn' ? 'টেমপ্লেট' : 'Templates'}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
                            <div className="text-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">50K+</span>
                                <p className="text-sm text-gray-500">{language === 'bn' ? 'ডাউনলোড' : 'Downloads'}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
                            <div className="text-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">4.9</span>
                                <p className="text-sm text-gray-500">{language === 'bn' ? 'রেটিং' : 'Rating'}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Bar */}
            <section className="sticky top-[72px] z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-y border-gray-100 dark:border-gray-800">
                <div className="container px-6 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${selectedCategory === cat.name
                                    ? 'bg-primary text-black'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {language === 'bn' ? cat.nameBn : cat.name}
                                <span className="ml-2 text-xs opacity-60">({cat.count})</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'bn'
                                ? `${totalResults}টি টেমপ্লেট পাওয়া গেছে`
                                : `Showing ${totalResults} templates`}
                        </p>

                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="popular">{language === 'bn' ? 'জনপ্রিয়' : 'Most Popular'}</option>
                                    <option value="newest">{language === 'bn' ? 'নতুন' : 'Newest'}</option>
                                    <option value="price-low">{language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
                                    <option value="price-high">{language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
                                    <option value="rating">{language === 'bn' ? 'সেরা রেটিং' : 'Top Rated'}</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>

                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2.5 rounded-full transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
                                >
                                    <FiGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2.5 rounded-full transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
                                >
                                    <FiList className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <FiFilter className="w-4 h-4" />
                                {language === 'bn' ? 'ফিল্টার' : 'Filters'}
                            </button>
                        </div>
                    </div>

                    {loading && graphics.length === 0 ? (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="card overflow-hidden">
                                    <div className="aspect-[4/3] skeleton" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-5 skeleton rounded w-3/4" />
                                        <div className="h-4 skeleton rounded w-1/2" />
                                        <div className="h-8 skeleton rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : graphics.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                                <FiSearch className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {language === 'bn' ? 'কোন টেমপ্লেট পাওয়া যায়নি' : 'No templates found'}
                            </h3>
                            <p className="text-gray-500">
                                {language === 'bn' ? 'অন্য কীওয়ার্ড দিয়ে খুঁজুন' : 'Try different keywords or filters'}
                            </p>
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                            {graphics.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 ${viewMode === 'list' ? 'flex' : ''}`}
                                >
                                    <Link href={`/graphics/${item.slug}`} className={`relative block ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'h-full' : 'aspect-[4/3]'}`}>
                                            <img
                                                src={item.thumbnail}
                                                alt={getTitle(item)}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {item.salePrice && (
                                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full uppercase">
                                                    {language === 'bn' ? 'সেল' : 'Sale'}
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                                    <FiEye className="w-5 h-5" />
                                                </button>
                                                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                                    <FiHeart className="w-5 h-5" />
                                                </button>
                                                <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                                    <FiShoppingCart className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </Link>

                                    <div className={`p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                            {getCatName(item)}
                                        </span>

                                        <Link href={`/graphics/${item.slug}`}>
                                            <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                {getTitle(item)}
                                            </h3>
                                        </Link>

                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            <span className="flex items-center gap-1">
                                                <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                {item.rating || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiDownload className="w-3.5 h-3.5" />
                                                {item.downloads || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiHeart className="w-3.5 h-3.5" />
                                                {item.likes || 0}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                            <div className="flex items-center gap-2">
                                                {item.salePrice ? (
                                                    <>
                                                        <span className="text-xl font-bold text-primary">৳{item.salePrice}</span>
                                                        <span className="text-sm text-gray-400 line-through">৳{item.price}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-xl font-bold text-gray-900 dark:text-white">৳{item.price}</span>
                                                )}
                                            </div>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full hover:bg-primary/90 transition-colors">
                                                <FiShoppingCart className="w-4 h-4" />
                                                {language === 'bn' ? 'কিনুন' : 'Buy'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {page < totalPages && (
                        <div className="text-center mt-12">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-black transition-all"
                            >
                                {loading ? (language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...') : (language === 'bn' ? 'আরো দেখুন' : 'Load More')}
                                <FiArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 dark:bg-black">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading uppercase mb-6">
                            {language === 'bn' ? 'ক্রিয়েটর হতে চান?' : 'BECOME A CREATOR?'}
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn'
                                ? 'আপনার ডিজাইন বিক্রি করুন এবং হাজার হাজার ক্রেতাদের কাছে পৌঁছান।'
                                : 'Sell your designs and reach thousands of buyers worldwide.'}
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all"
                        >
                            {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
                            <FiArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
