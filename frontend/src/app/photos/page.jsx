"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiGrid, FiList, FiHeart, FiShoppingCart,
    FiStar, FiDownload, FiArrowRight, FiChevronDown, FiEye, FiLoader,
    FiCamera, FiImage, FiMaximize
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { photoService, cartService } from "@/services/api";

// Photo Categories
const categories = [
    { name: "All", nameBn: "সব" },
    { name: "Nature", nameBn: "প্রকৃতি" },
    { name: "Business", nameBn: "বিজনেস" },
    { name: "People", nameBn: "মানুষ" },
    { name: "Technology", nameBn: "টেকনোলজি" },
    { name: "Food", nameBn: "খাবার" },
    { name: "Travel", nameBn: "ভ্রমণ" },
];

export default function PhotosPage() {
    const { t, language } = useLanguage();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                setLoading(true);
                const res = await photoService.getAll("?status=published");
                if (res.success) {
                    setPhotos(res.data || []);
                }
            } catch (error) {
                console.error("Error fetching photos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPhotos();
    }, []);

    const filteredPhotos = photos
        .filter(photo => {
            if (selectedCategory !== "All" && photo.category !== selectedCategory) return false;
            if (search && !photo.title?.toLowerCase().includes(search.toLowerCase())) return false;
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
                            <FiCamera className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'ফটো কালেকশন' : 'Photo Collection'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-heading uppercase">
                            {language === 'bn' ? 'স্টক' : 'STOCK'}
                            <span className="text-primary"> {language === 'bn' ? 'ফটোস' : 'PHOTOS'}</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn'
                                ? 'উচ্চ মানের স্টক ফটো খুঁজুন। প্রকৃতি, বিজনেস, টেকনোলজি এবং আরও অনেক।'
                                : 'Find high-quality stock photos. Nature, Business, Technology and more.'}
                        </p>

                        <div className="relative max-w-xl mx-auto">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={language === 'bn' ? 'ফটো খুঁজুন...' : 'Search photos...'}
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
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'bn' ? `${filteredPhotos.length}টি ফটো` : `Showing ${filteredPhotos.length} photos`}
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className={`skeleton rounded-2xl ${i % 3 === 0 ? 'aspect-[3/4]' : 'aspect-square'}`} />
                            ))}
                        </div>
                    ) : filteredPhotos.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                                <FiImage className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {language === 'bn' ? 'কোন ফটো পাওয়া যায়নি' : 'No photos found'}
                            </h3>
                        </div>
                    ) : (
                        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
                            {filteredPhotos.map((photo, index) => (
                                <PhotoCard key={photo._id} photo={photo} index={index} language={language} />
                            ))}
                        </div>
                    )}

                    {filteredPhotos.length > 0 && (
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

// Photo Card Component - Masonry Style
function PhotoCard({ photo, index, language }) {
    const [addingToCart, setAddingToCart] = useState(false);
    const discount = photo.price > 0 && photo.salePrice
        ? Math.round(((photo.price - photo.salePrice) / photo.price) * 100)
        : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({
                productId: photo._id,
                productType: 'photo',
                price: photo.salePrice || photo.price,
                title: photo.title,
                image: photo.thumbnail
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
            transition={{ delay: index * 0.03 }}
            className="group relative break-inside-avoid mb-4"
        >
            <Link href={`/photos/${photo.slug || photo._id}`} className="relative block rounded-2xl overflow-hidden">
                <img
                    src={photo.thumbnail || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800"}
                    alt={photo.title}
                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Top Actions */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-primary transition-colors">
                            <FiHeart className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-primary transition-colors"
                        >
                            {addingToCart ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiShoppingCart className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            -{discount}%
                        </div>
                    )}

                    {/* Bottom Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-white mb-2 line-clamp-1">{photo.title}</h3>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white/80 text-xs">
                                <span className="flex items-center gap-1">
                                    <FiEye className="w-3 h-3" /> {photo.views || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiDownload className="w-3 h-3" /> {photo.downloads || 0}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FiHeart className="w-3 h-3" /> {photo.likes || 0}
                                </span>
                            </div>
                            <span className="font-bold text-white">
                                ৳{photo.salePrice || photo.price || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
