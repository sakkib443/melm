"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSearch, FiGrid, FiList, FiFilter, FiX, FiShoppingCart,
    FiStar, FiDownload, FiArrowRight, FiChevronDown, FiLoader,
    FiBook, FiImage, FiMusic, FiPackage, FiType, FiVideo, FiCamera
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { cartService } from "@/services/api";

// Product type icons and colors
const productTypes = [
    { key: "all", name: "All", nameBn: "সব", icon: FiGrid, color: "bg-gray-100" },
    { key: "course", name: "Courses", nameBn: "কোর্স", icon: FiBook, color: "bg-blue-100" },
    { key: "graphics", name: "Graphics", nameBn: "গ্রাফিক্স", icon: FiImage, color: "bg-primary/10" },
    { key: "font", name: "Fonts", nameBn: "ফন্ট", icon: FiType, color: "bg-purple-100" },
    { key: "audio", name: "Audio", nameBn: "অডিও", icon: FiMusic, color: "bg-violet-100" },
    { key: "photo", name: "Photos", nameBn: "ফটো", icon: FiCamera, color: "bg-emerald-100" },
    { key: "uikit", name: "UI Kits", nameBn: "UI কিট", icon: FiPackage, color: "bg-indigo-100" },
    { key: "video", name: "Videos", nameBn: "ভিডিও", icon: FiVideo, color: "bg-rose-100" },
];

// Mock search results
const mockResults = [
    { _id: "1", type: "course", title: "Complete Web Development", price: 4999, salePrice: 2999, thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400", rating: 4.8, downloads: 1234 },
    { _id: "2", type: "graphics", title: "Premium Logo Bundle", price: 1999, salePrice: 999, thumbnail: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=400", rating: 4.9, downloads: 567 },
    { _id: "3", type: "font", title: "Modern Sans Font Family", price: 799, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=400", rating: 4.7, downloads: 890 },
    { _id: "4", type: "audio", title: "Cinematic Music Pack", price: 1499, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", rating: 4.6, downloads: 456 },
    { _id: "5", type: "photo", title: "Nature Photography Pack", price: 599, salePrice: 299, thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", rating: 4.8, downloads: 234 },
    { _id: "6", type: "uikit", title: "Dashboard UI Kit", price: 2999, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400", rating: 4.9, downloads: 789 },
];

function SearchContent() {
    const searchParams = useSearchParams();
    const { language } = useLanguage();
    const query = searchParams.get("q") || "";

    const [search, setSearch] = useState(query);
    const [results, setResults] = useState(mockResults);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("all");
    const [sortBy, setSortBy] = useState("relevance");

    // Filter results
    const filteredResults = results
        .filter(r => {
            if (selectedType !== "all" && r.type !== selectedType) return false;
            if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "price-low") return (a.salePrice || a.price) - (b.salePrice || b.price);
            if (sortBy === "price-high") return (b.salePrice || b.price) - (a.salePrice || a.price);
            if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
            return (b.downloads || 0) - (a.downloads || 0);
        });

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Search Header */}
            <section className="relative pt-32 pb-8 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            {query ? (language === 'bn' ? `"${query}" এর ফলাফল` : `Results for "${query}"`) : (language === 'bn' ? 'সব প্রোডাক্ট খুঁজুন' : 'Search All Products')}
                        </h1>

                        <div className="relative">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={language === 'bn' ? 'কোর্স, গ্রাফিক্স, ফন্ট খুঁজুন...' : 'Search courses, graphics, fonts...'}
                                className="w-full pl-14 pr-12 py-4 bg-gray-100 dark:bg-gray-900 border-0 rounded-full text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                                    <FiX className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Type Filters */}
            <section className="py-6 border-b border-gray-100 dark:border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex flex-wrap items-center gap-3 overflow-x-auto pb-2">
                        {productTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.key}
                                    onClick={() => setSelectedType(type.key)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${selectedType === type.key
                                            ? 'bg-primary text-black'
                                            : `${type.color} text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {language === 'bn' ? type.nameBn : type.name}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                        <p className="text-gray-500">
                            {language === 'bn' ? `${filteredResults.length}টি ফলাফল পাওয়া গেছে` : `Found ${filteredResults.length} results`}
                        </p>
                        <div className="relative">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm font-medium cursor-pointer focus:outline-none">
                                <option value="relevance">{language === 'bn' ? 'প্রাসঙ্গিক' : 'Relevance'}</option>
                                <option value="price-low">{language === 'bn' ? 'দাম: কম' : 'Price: Low'}</option>
                                <option value="price-high">{language === 'bn' ? 'দাম: বেশি' : 'Price: High'}</option>
                                <option value="rating">{language === 'bn' ? 'রেটিং' : 'Rating'}</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <FiLoader className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredResults.length === 0 ? (
                        <div className="text-center py-20">
                            <FiSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{language === 'bn' ? 'কিছু পাওয়া যায়নি' : 'No results found'}</h3>
                            <p className="text-gray-500">{language === 'bn' ? 'অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন' : 'Try different keywords'}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredResults.map((item, index) => (
                                <SearchResultCard key={item._id} item={item} index={index} language={language} />
                            ))}
                        </div>
                    )}

                    {filteredResults.length > 0 && (
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

function SearchResultCard({ item, index, language }) {
    const [addingToCart, setAddingToCart] = useState(false);
    const discount = item.price > 0 && item.salePrice ? Math.round(((item.price - item.salePrice) / item.price) * 100) : 0;

    const typeInfo = productTypes.find(t => t.key === item.type) || productTypes[0];
    const Icon = typeInfo.icon;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({ productId: item._id, productType: item.type, price: item.salePrice || item.price, title: item.title, image: item.thumbnail });
            if (res.success) toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added!');
        } catch (e) { toast.error('Failed'); } finally { setAddingToCart(false); }
    };

    const getLink = () => {
        const links = { course: '/courses', graphics: '/graphics', font: '/fonts', audio: '/audio', photo: '/photos', uikit: '/ui-kits', video: '/video-templates' };
        return `${links[item.type] || '/products'}/${item._id}`;
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all hover:shadow-xl">
            <Link href={getLink()} className="relative block">
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {discount > 0 && <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full">{discount}% OFF</div>}
                    <div className="absolute top-4 right-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${typeInfo.color} text-gray-700`}>
                            <Icon className="w-3 h-3" /> {typeInfo.name}
                        </span>
                    </div>
                </div>
            </Link>
            <div className="p-5">
                <Link href={getLink()}><h3 className="font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">{item.title}</h3></Link>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{item.rating?.toFixed(1)}</span>
                    <span className="flex items-center gap-1"><FiDownload className="w-3.5 h-3.5" />{item.downloads}</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>{discount > 0 ? <><span className="text-xl font-bold text-primary">৳{item.salePrice}</span><span className="text-sm text-gray-400 line-through ml-2">৳{item.price}</span></> : <span className="text-xl font-bold text-gray-900 dark:text-white">৳{item.price}</span>}</div>
                    <button onClick={handleAddToCart} disabled={addingToCart} className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full hover:bg-primary/90 disabled:opacity-50">
                        {addingToCart ? <FiLoader className="w-4 h-4 animate-spin" /> : <FiShoppingCart className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><FiLoader className="w-8 h-8 animate-spin" /></div>}>
            <SearchContent />
        </Suspense>
    );
}
