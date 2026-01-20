"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiGrid, FiHeart, FiShoppingCart,
    FiStar, FiDownload, FiArrowRight, FiChevronDown, FiEye, FiLoader,
    FiVideo, FiPlay, FiClock
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { videoTemplateService, cartService } from "@/services/api";

// Video Categories
const categories = [
    { name: "All", nameBn: "সব" },
    { name: "Intro", nameBn: "ইন্ট্রো" },
    { name: "Outro", nameBn: "আউট্রো" },
    { name: "Lower Third", nameBn: "লোয়ার থার্ড" },
    { name: "Transitions", nameBn: "ট্রানজিশন" },
    { name: "Social Media", nameBn: "সোশ্যাল মিডিয়া" },
];

export default function VideoTemplatesPage() {
    const { language } = useLanguage();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                const res = await videoTemplateService.getAll("?status=published");
                if (res.success) setVideos(res.data || []);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    const filteredVideos = videos
        .filter(v => {
            if (selectedCategory !== "All" && v.category !== selectedCategory) return false;
            if (search && !v.title?.toLowerCase().includes(search.toLowerCase())) return false;
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
                            <FiVideo className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'ভিডিও টেমপ্লেট' : 'Video Templates'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-heading uppercase">
                            VIDEO<span className="text-primary"> TEMPLATES</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn' ? 'প্রফেশনাল ভিডিও তৈরি করুন প্রিমিয়াম টেমপ্লেট দিয়ে।' : 'Create professional videos with premium templates.'}
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={language === 'bn' ? 'টেমপ্লেট খুঁজুন...' : 'Search templates...'} className="w-full pl-14 pr-6 py-4 bg-gray-100 dark:bg-gray-900 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary" />
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

                    <p className="text-gray-500 mb-6">{language === 'bn' ? `${filteredVideos.length}টি টেমপ্লেট` : `Showing ${filteredVideos.length} templates`}</p>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-video skeleton rounded-2xl" />)}
                        </div>
                    ) : filteredVideos.length === 0 ? (
                        <div className="text-center py-20">
                            <FiVideo className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{language === 'bn' ? 'পাওয়া যায়নি' : 'No templates found'}</h3>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredVideos.map((video, index) => <VideoCard key={video._id} video={video} index={index} language={language} />)}
                        </div>
                    )}

                    {filteredVideos.length > 0 && (
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

function VideoCard({ video, index, language }) {
    const [addingToCart, setAddingToCart] = useState(false);
    const discount = video.price > 0 && video.salePrice ? Math.round(((video.price - video.salePrice) / video.price) * 100) : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({ productId: video._id, productType: 'videotemplate', price: video.salePrice || video.price, title: video.title, image: video.thumbnail });
            if (res.success) toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added!');
        } catch (e) { toast.error('Failed'); } finally { setAddingToCart(false); }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all hover:shadow-xl">
            <Link href={`/video-templates/${video.slug || video._id}`} className="relative block">
                <div className="relative aspect-video bg-gradient-to-br from-rose-500 to-pink-600 overflow-hidden">
                    {video.thumbnail ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <FiVideo className="w-16 h-16 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" />}
                    {discount > 0 && <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full">{discount}% OFF</div>}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:bg-primary transition-colors"><FiPlay className="w-7 h-7 ml-1" /></button>
                    </div>
                    {video.duration && <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded flex items-center gap-1"><FiClock className="w-3 h-3" />{video.duration}</div>}
                </div>
            </Link>
            <div className="p-5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-100 dark:bg-rose-900/30 text-rose-600">{video.category || 'Video'}</span>
                <Link href={`/video-templates/${video.slug || video._id}`}><h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3></Link>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{video.rating?.toFixed(1) || "0.0"}</span>
                    <span className="flex items-center gap-1"><FiDownload className="w-3.5 h-3.5" />{video.downloads || 0}</span>
                    <span className="flex items-center gap-1"><FiHeart className="w-3.5 h-3.5" />{video.likes || 0}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>{discount > 0 ? <><span className="text-xl font-bold text-primary">৳{video.salePrice}</span><span className="text-sm text-gray-400 line-through ml-2">৳{video.price}</span></> : <span className="text-xl font-bold text-gray-900 dark:text-white">৳{video.price || 0}</span>}</div>
                    <button onClick={handleAddToCart} disabled={addingToCart} className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full hover:bg-primary/90 disabled:opacity-50">
                        {addingToCart ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiShoppingCart className="w-4 h-4" />} {language === 'bn' ? 'কার্টে' : 'Add'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
