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

// Mock data for demo
const mockGraphics = [
    {
        _id: "1",
        title: "Premium Logo Template Bundle",
        titleBn: "প্রিমিয়াম লোগো টেমপ্লেট বান্ডল",
        slug: "premium-logo-template-bundle",
        thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800",
        price: 2999,
        salePrice: 1999,
        category: "Logo",
        categoryBn: "লোগো",
        status: "published",
        downloads: 234,
        rating: 4.8,
        reviews: 45,
        likes: 89,
        author: "Creative Studio",
        tags: ["logo", "branding", "business"],
    },
    {
        _id: "2",
        title: "Social Media Graphics Pack",
        titleBn: "সোশ্যাল মিডিয়া গ্রাফিক্স প্যাক",
        slug: "social-media-graphics-pack",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
        price: 1499,
        salePrice: null,
        category: "Social Media",
        categoryBn: "সোশ্যাল মিডিয়া",
        status: "published",
        downloads: 567,
        rating: 4.9,
        reviews: 89,
        likes: 156,
        author: "Design Lab",
        tags: ["social", "instagram", "facebook"],
    },
    {
        _id: "3",
        title: "Business Card Designs Collection",
        titleBn: "বিজনেস কার্ড ডিজাইন কালেকশন",
        slug: "business-card-designs",
        thumbnail: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800",
        price: 999,
        salePrice: 499,
        category: "Business Card",
        categoryBn: "বিজনেস কার্ড",
        status: "published",
        downloads: 123,
        rating: 4.5,
        reviews: 23,
        likes: 45,
        author: "Print Pro",
        tags: ["business", "card", "print"],
    },
    {
        _id: "4",
        title: "Flyer & Poster Templates",
        titleBn: "ফ্লায়ার এবং পোস্টার টেমপ্লেট",
        slug: "flyer-poster-templates",
        thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800",
        price: 1999,
        salePrice: null,
        category: "Flyer",
        categoryBn: "ফ্লায়ার",
        status: "published",
        downloads: 345,
        rating: 4.7,
        reviews: 67,
        likes: 78,
        author: "Event Graphics",
        tags: ["flyer", "poster", "event"],
    },
    {
        _id: "5",
        title: "Modern Resume Templates",
        titleBn: "আধুনিক রেজিউমে টেমপ্লেট",
        slug: "modern-resume-templates",
        thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800",
        price: 799,
        salePrice: 599,
        category: "Resume",
        categoryBn: "রেজিউমে",
        status: "published",
        downloads: 890,
        rating: 4.9,
        reviews: 134,
        likes: 267,
        author: "Career Design",
        tags: ["resume", "cv", "job"],
    },
    {
        _id: "6",
        title: "Instagram Story Templates",
        titleBn: "ইনস্টাগ্রাম স্টোরি টেমপ্লেট",
        slug: "instagram-story-templates",
        thumbnail: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800",
        price: 1299,
        salePrice: null,
        category: "Social Media",
        categoryBn: "সোশ্যাল মিডিয়া",
        status: "published",
        downloads: 456,
        rating: 4.6,
        reviews: 56,
        likes: 123,
        author: "Insta Pro",
        tags: ["instagram", "story", "social"],
    },
    {
        _id: "7",
        title: "Wedding Invitation Cards",
        titleBn: "বিয়ের দাওয়াত কার্ড",
        slug: "wedding-invitation-cards",
        thumbnail: "https://images.unsplash.com/photo-1607861716497-e65ab29fc7ac?w=800",
        price: 2499,
        salePrice: 1899,
        category: "Invitation",
        categoryBn: "দাওয়াত",
        status: "published",
        downloads: 234,
        rating: 4.8,
        reviews: 78,
        likes: 189,
        author: "Wedding Studio",
        tags: ["wedding", "invitation", "card"],
    },
    {
        _id: "8",
        title: "YouTube Thumbnail Pack",
        titleBn: "ইউটিউব থাম্বনেইল প্যাক",
        slug: "youtube-thumbnail-pack",
        thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800",
        price: 999,
        salePrice: null,
        category: "YouTube",
        categoryBn: "ইউটিউব",
        status: "published",
        downloads: 678,
        rating: 4.7,
        reviews: 89,
        likes: 234,
        author: "Tube Graphics",
        tags: ["youtube", "thumbnail", "video"],
    },
];

const categories = [
    { name: "All", nameBn: "সব", count: 120 },
    { name: "Logo", nameBn: "লোগো", count: 45 },
    { name: "Social Media", nameBn: "সোশ্যাল মিডিয়া", count: 32 },
    { name: "Business Card", nameBn: "বিজনেস কার্ড", count: 28 },
    { name: "Flyer", nameBn: "ফ্লায়ার", count: 24 },
    { name: "Resume", nameBn: "রেজিউমে", count: 18 },
    { name: "Invitation", nameBn: "দাওয়াত", count: 15 },
    { name: "YouTube", nameBn: "ইউটিউব", count: 12 },
];

export default function GraphicsPage() {
    const { t, language } = useLanguage();
    const [graphics, setGraphics] = useState(mockGraphics);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("popular");
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [showFilters, setShowFilters] = useState(false);

    const filteredGraphics = graphics.filter((item) => {
        const title = language === 'bn' ? item.titleBn : item.title;
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
    });

    const sortedGraphics = [...filteredGraphics].sort((a, b) => {
        switch (sortBy) {
            case "popular":
                return b.downloads - a.downloads;
            case "newest":
                return b._id.localeCompare(a._id);
            case "price-low":
                return (a.salePrice || a.price) - (b.salePrice || b.price);
            case "price-high":
                return (b.salePrice || b.price) - (a.salePrice || a.price);
            case "rating":
                return b.rating - a.rating;
            default:
                return 0;
        }
    });

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Pattern */}
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
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'প্রিমিয়াম কালেকশন' : 'Premium Collection'}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9] mb-6">
                            {language === 'bn' ? 'গ্রাফিক্স' : 'GRAPHICS'}
                            <br />
                            <span className="text-primary">{language === 'bn' ? 'টেমপ্লেট।' : 'TEMPLATES.'}</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                            {language === 'bn'
                                ? 'আপনার প্রকল্পের জন্য প্রিমিয়াম গ্রাফিক ডিজাইন টেমপ্লেট আবিষ্কার করুন। লোগো, সোশ্যাল মিডিয়া, বিজনেস কার্ড এবং আরও অনেক কিছু।'
                                : 'Discover premium graphic design templates for your projects. Logos, social media, business cards, and much more.'}
                        </p>

                        {/* Search Bar */}
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

                        {/* Stats */}
                        <div className="flex items-center justify-center gap-8 mt-10">
                            <div className="text-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{language === 'bn' ? '৫K+' : '5K+'}</span>
                                <p className="text-sm text-gray-500">{language === 'bn' ? 'টেমপ্লেট' : 'Templates'}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
                            <div className="text-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{language === 'bn' ? '৫০K+' : '50K+'}</span>
                                <p className="text-sm text-gray-500">{language === 'bn' ? 'ডাউনলোড' : 'Downloads'}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
                            <div className="text-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{language === 'bn' ? '৪.৯' : '4.9'}</span>
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
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'bn'
                                ? `${sortedGraphics.length}টি টেমপ্লেট পাওয়া গেছে`
                                : `Showing ${sortedGraphics.length} templates`}
                        </p>

                        <div className="flex items-center gap-4">
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

                            {/* Filter Button */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-full font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <FiFilter className="w-4 h-4" />
                                {language === 'bn' ? 'ফিল্টার' : 'Filters'}
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
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
                    ) : sortedGraphics.length === 0 ? (
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
                            {sortedGraphics.map((item, index) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 ${viewMode === 'list' ? 'flex' : ''}`}
                                >
                                    {/* Image */}
                                    <Link href={`/graphics/${item.slug}`} className={`relative block ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'h-full' : 'aspect-[4/3]'}`}>
                                            <img
                                                src={item.thumbnail}
                                                alt={language === 'bn' ? item.titleBn : item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            {/* Sale Badge */}
                                            {item.salePrice && (
                                                <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full uppercase">
                                                    {language === 'bn' ? 'সেল' : 'Sale'}
                                                </div>
                                            )}
                                            {/* Quick Actions */}
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

                                    {/* Content */}
                                    <div className={`p-5 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-center' : ''}`}>
                                        {/* Category */}
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                            {language === 'bn' ? item.categoryBn : item.category}
                                        </span>

                                        {/* Title */}
                                        <Link href={`/graphics/${item.slug}`}>
                                            <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                                                {language === 'bn' ? item.titleBn : item.title}
                                            </h3>
                                        </Link>

                                        {/* Stats */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                            <span className="flex items-center gap-1">
                                                <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                {item.rating}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiDownload className="w-3.5 h-3.5" />
                                                {item.downloads}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiHeart className="w-3.5 h-3.5" />
                                                {item.likes}
                                            </span>
                                        </div>

                                        {/* Price & Action */}
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

                    {/* Load More */}
                    {sortedGraphics.length > 0 && (
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-black transition-all">
                                {language === 'bn' ? 'আরো দেখুন' : 'Load More'}
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
