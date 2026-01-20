"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiFilter, FiGrid, FiList, FiHeart, FiShoppingCart,
    FiStar, FiDownload, FiArrowRight, FiChevronDown, FiEye, FiLoader, FiType
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { fontService, cartService } from "@/services/api";

// Font Categories
const categories = [
    { name: "All", nameBn: "সব" },
    { name: "Sans Serif", nameBn: "সেন্স সেরিফ" },
    { name: "Serif", nameBn: "সেরিফ" },
    { name: "Script", nameBn: "স্ক্রিপ্ট" },
    { name: "Display", nameBn: "ডিসপ্লে" },
    { name: "Handwritten", nameBn: "হ্যান্ডরিটেন" },
];

// Mock fonts data for demo
const mockFonts = [
    { _id: "1", title: "Bangla Modern Sans", slug: "bangla-modern-sans", category: "Sans Serif", price: 499, salePrice: 299, thumbnail: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800", downloads: 1250, views: 5600, likes: 340, rating: 4.8 },
    { _id: "2", title: "Creative Script Pro", slug: "creative-script-pro", category: "Script", price: 699, salePrice: 499, thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800", downloads: 890, views: 4200, likes: 256, rating: 4.9 },
    { _id: "3", title: "Display Bold XL", slug: "display-bold-xl", category: "Display", price: 399, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800", downloads: 2100, views: 8900, likes: 567, rating: 4.7 },
    { _id: "4", title: "Classic Serif Regular", slug: "classic-serif-regular", category: "Serif", price: 299, salePrice: 199, thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800", downloads: 1567, views: 6700, likes: 423, rating: 4.6 },
    { _id: "5", title: "Handwritten Notes", slug: "handwritten-notes", category: "Handwritten", price: 349, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800", downloads: 780, views: 3400, likes: 189, rating: 4.5 },
    { _id: "6", title: "Minimal Sans Light", slug: "minimal-sans-light", category: "Sans Serif", price: 249, salePrice: 149, thumbnail: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=800", downloads: 3200, views: 12000, likes: 890, rating: 4.9 },
];

export default function FontsPage() {
    const { t, language } = useLanguage();
    const [fonts, setFonts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        const fetchFonts = async () => {
            try {
                setLoading(true);
                const res = await fontService.getAll();
                if (res.success && res.data?.length > 0) {
                    setFonts(res.data);
                } else {
                    // Use mock data as fallback
                    setFonts(mockFonts);
                }
            } catch (error) {
                console.error("Error fetching fonts:", error);
                // Use mock data on error
                setFonts(mockFonts);
            } finally {
                setLoading(false);
            }
        };
        fetchFonts();
    }, []);

    // Filter and sort
    const filteredFonts = fonts
        .filter(font => {
            if (selectedCategory !== "All" && font.category !== selectedCategory) return false;
            if (search && !font.title?.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "price-low") return (a.salePrice || a.price) - (b.salePrice || b.price);
            if (sortBy === "price-high") return (b.salePrice || b.price) - (a.salePrice || a.price);
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            return (b.downloads || 0) - (a.downloads || 0); // popular
        });

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Dot Grid Background */}
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
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <FiType className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'ফন্ট কালেকশন' : 'Font Collection'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-heading uppercase">
                            {language === 'bn' ? 'প্রিমিয়াম' : 'PREMIUM'}
                            <span className="text-primary"> {language === 'bn' ? 'ফন্টস' : 'FONTS'}</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn'
                                ? 'আপনার প্রজেক্টের জন্য সেরা টাইপোগ্রাফি খুঁজুন। হ্যান্ডরিটেন, সেরিফ, ডিসপ্লে এবং আরও অনেক।'
                                : 'Discover the perfect typography for your projects. Handwritten, Serif, Display and more.'}
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={language === 'bn' ? 'ফন্ট খুঁজুন...' : 'Search fonts...'}
                                className="w-full pl-14 pr-6 py-4 bg-gray-100 dark:bg-gray-900 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Grid */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    {/* Filter Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
                        {/* Categories */}
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.name}
                                    onClick={() => setSelectedCategory(cat.name)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.name
                                        ? 'bg-primary text-black'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {language === 'bn' ? cat.nameBn : cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-3">
                            {/* Sort */}
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

                            {/* View Toggle */}
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
                        </div>
                    </div>

                    {/* Results Count */}
                    <div className="mb-6">
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'bn' ? `${filteredFonts.length}টি ফন্ট পাওয়া গেছে` : `Showing ${filteredFonts.length} fonts`}
                        </p>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="aspect-[4/3] skeleton" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 skeleton rounded w-1/4" />
                                        <div className="h-5 skeleton rounded w-3/4" />
                                        <div className="h-8 skeleton rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredFonts.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                                <FiType className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {language === 'bn' ? 'কোন ফন্ট পাওয়া যায়নি' : 'No fonts found'}
                            </h3>
                            <p className="text-gray-500">
                                {language === 'bn' ? 'অন্য কীওয়ার্ড দিয়ে খুঁজুন' : 'Try different keywords or filters'}
                            </p>
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                            {filteredFonts.map((font, index) => (
                                <FontCard key={font._id} font={font} index={index} language={language} />
                            ))}
                        </div>
                    )}

                    {/* Load More */}
                    {filteredFonts.length > 0 && (
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-black transition-all">
                                {language === 'bn' ? 'আরো দেখুন' : 'Load More'}
                                <FiArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

// Font Card Component
function FontCard({ font, index, language }) {
    const [addingToCart, setAddingToCart] = useState(false);
    const discount = font.price > 0 && font.salePrice
        ? Math.round(((font.price - font.salePrice) / font.price) * 100)
        : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({
                productId: font._id,
                productType: 'font',
                price: font.salePrice || font.price,
                title: font.title,
                image: font.thumbnail
            });
            if (res.success) {
                toast.success(language === 'bn' ? 'কার্টে যুক্ত হয়েছে!' : 'Added to cart!');
            }
        } catch (error) {
            toast.error(error.message || (language === 'bn' ? 'ব্যর্থ হয়েছে' : 'Failed to add'));
        } finally {
            setAddingToCart(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
        >
            {/* Preview */}
            <Link href={`/fonts/${font.slug || font._id}`} className="relative block">
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                    {font.thumbnail ? (
                        <img
                            src={font.thumbnail}
                            alt={font.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="text-center p-6">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: font.fontFamily }}>
                                Aa Bb Cc
                            </span>
                            <p className="text-gray-500 mt-2">{font.title}</p>
                        </div>
                    )}

                    {/* Sale Badge */}
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full uppercase">
                            {discount}% OFF
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                            <FiEye className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors disabled:opacity-50"
                        >
                            {addingToCart ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiShoppingCart className="w-5 h-5" />}
                        </button>
                        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                            <FiHeart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5">
                {/* Category */}
                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {font.category || 'Font'}
                </span>

                {/* Title */}
                <Link href={`/fonts/${font.slug || font._id}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {font.title}
                    </h3>
                </Link>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                        <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {font.rating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiDownload className="w-3.5 h-3.5" />
                        {font.downloads || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiEye className="w-3.5 h-3.5" />
                        {font.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiHeart className="w-3.5 h-3.5" />
                        {font.likes || 0}
                    </span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        {discount > 0 ? (
                            <>
                                <span className="text-xl font-bold text-primary">৳{font.salePrice}</span>
                                <span className="text-sm text-gray-400 line-through">৳{font.price}</span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-gray-900 dark:text-white">৳{font.price || 0}</span>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={addingToCart}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {addingToCart ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiShoppingCart className="w-4 h-4" />}
                        {language === 'bn' ? 'কার্টে' : 'Add'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
