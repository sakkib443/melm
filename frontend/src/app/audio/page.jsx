"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiGrid, FiList, FiHeart, FiShoppingCart,
    FiStar, FiDownload, FiArrowRight, FiChevronDown, FiEye, FiLoader,
    FiMusic, FiPlay, FiPause, FiClock
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { audioService, cartService } from "@/services/api";

// Audio Categories
const categories = [
    { name: "All", nameBn: "সব" },
    { name: "Music", nameBn: "মিউজিক" },
    { name: "Sound Effects", nameBn: "সাউন্ড ইফেক্ট" },
    { name: "Podcast", nameBn: "পডকাস্ট" },
    { name: "Ambient", nameBn: "অ্যাম্বিয়েন্ট" },
    { name: "Beats", nameBn: "বিটস" },
];

export default function AudioPage() {
    const { t, language } = useLanguage();
    const [audios, setAudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        const fetchAudios = async () => {
            try {
                setLoading(true);
                const res = await audioService.getAll("?status=published");
                if (res.success) {
                    setAudios(res.data || []);
                }
            } catch (error) {
                console.error("Error fetching audios:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAudios();
    }, []);

    // Filter and sort
    const filteredAudios = audios
        .filter(audio => {
            if (selectedCategory !== "All" && audio.category !== selectedCategory) return false;
            if (search && !audio.title?.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "price-low") return (a.salePrice || a.price) - (b.salePrice || b.price);
            if (sortBy === "price-high") return (b.salePrice || b.price) - (a.salePrice || a.price);
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
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
                            <FiMusic className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'অডিও কালেকশন' : 'Audio Collection'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-heading uppercase">
                            {language === 'bn' ? 'প্রিমিয়াম' : 'PREMIUM'}
                            <span className="text-primary"> {language === 'bn' ? 'অডিও' : 'AUDIO'}</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn'
                                ? 'আপনার প্রজেক্টের জন্য সেরা মিউজিক, সাউন্ড ইফেক্ট এবং অডিও ট্র্যাক খুঁজুন।'
                                : 'Discover the perfect music, sound effects and audio tracks for your projects.'}
                        </p>

                        <div className="relative max-w-xl mx-auto">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={language === 'bn' ? 'অডিও খুঁজুন...' : 'Search audio...'}
                                className="w-full pl-14 pr-6 py-4 bg-gray-100 dark:bg-gray-900 border-0 rounded-full text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters & Grid */}
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
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="popular">{language === 'bn' ? 'জনপ্রিয়' : 'Most Popular'}</option>
                                    <option value="newest">{language === 'bn' ? 'নতুন' : 'Newest'}</option>
                                    <option value="price-low">{language === 'bn' ? 'দাম: কম' : 'Price: Low'}</option>
                                    <option value="price-high">{language === 'bn' ? 'দাম: বেশি' : 'Price: High'}</option>
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
                        </div>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'bn' ? `${filteredAudios.length}টি অডিও` : `Showing ${filteredAudios.length} audios`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="aspect-square skeleton" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 skeleton rounded w-1/4" />
                                        <div className="h-5 skeleton rounded w-3/4" />
                                        <div className="h-8 skeleton rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredAudios.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                                <FiMusic className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {language === 'bn' ? 'কোন অডিও পাওয়া যায়নি' : 'No audio found'}
                            </h3>
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                            {filteredAudios.map((audio, index) => (
                                <AudioCard key={audio._id} audio={audio} index={index} language={language} />
                            ))}
                        </div>
                    )}

                    {filteredAudios.length > 0 && (
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

// Audio Card Component
function AudioCard({ audio, index, language }) {
    const [addingToCart, setAddingToCart] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const discount = audio.price > 0 && audio.salePrice
        ? Math.round(((audio.price - audio.salePrice) / audio.price) * 100)
        : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({
                productId: audio._id,
                productType: 'audio',
                price: audio.salePrice || audio.price,
                title: audio.title,
                image: audio.thumbnail
            });
            if (res.success) {
                toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added to cart!');
            }
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
            className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
        >
            <Link href={`/audio/${audio.slug || audio._id}`} className="relative block">
                <div className="relative aspect-square bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center overflow-hidden">
                    {audio.thumbnail ? (
                        <img
                            src={audio.thumbnail}
                            alt={audio.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="text-center">
                            <FiMusic className="w-16 h-16 text-white/50" />
                        </div>
                    )}

                    {discount > 0 && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full uppercase">
                            {discount}% OFF
                        </div>
                    )}

                    {/* Play Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                            onClick={(e) => { e.preventDefault(); setIsPlaying(!isPlaying); }}
                            className="w-16 h-16 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors"
                        >
                            {isPlaying ? <FiPause className="w-7 h-7" /> : <FiPlay className="w-7 h-7 ml-1" />}
                        </button>
                    </div>
                </div>
            </Link>

            <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                        {audio.category || 'Audio'}
                    </span>
                    {audio.duration && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                            <FiClock className="w-3 h-3" />
                            {audio.duration}
                        </span>
                    )}
                </div>

                <Link href={`/audio/${audio.slug || audio._id}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {audio.title}
                    </h3>
                </Link>

                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                        <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {audio.rating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiDownload className="w-3.5 h-3.5" />
                        {audio.downloads || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiHeart className="w-3.5 h-3.5" />
                        {audio.likes || 0}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        {discount > 0 ? (
                            <>
                                <span className="text-xl font-bold text-primary">৳{audio.salePrice}</span>
                                <span className="text-sm text-gray-400 line-through">৳{audio.price}</span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-gray-900 dark:text-white">৳{audio.price || 0}</span>
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
