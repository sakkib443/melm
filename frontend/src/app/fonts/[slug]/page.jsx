"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiArrowLeft, FiHeart, FiShoppingCart, FiShare2, FiDownload,
    FiStar, FiEye, FiCheck, FiLoader, FiType, FiCopy, FiInfo, FiExternalLink, FiMaximize2, FiX
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { fontService, downloadService } from "@/services/api";

const mockFonts = [
    { _id: "1", title: "Bangla Modern Sans", slug: "bangla-modern-sans", category: "Sans Serif", price: 499, salePrice: 299, thumbnail: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800", downloads: 1250, views: 5600, likes: 340, rating: 4.8, description: "A clean, modern sans-serif font designed specifically for high-readability on digital screens. Includes full Bangla and Latin character sets with multiple weights.", weights: ["Light", "Regular", "Bold"], styles: ["normal", "italic"], glyphs: 450, version: "2.1" },
    { _id: "6", title: "Minimal Sans Light", slug: "minimal-sans-light", category: "Sans Serif", price: 249, salePrice: 149, thumbnail: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=800", downloads: 3200, views: 12000, likes: 890, rating: 4.9, description: "Minimal Sans is a geometric sans-serif typeface designed for clarity and simplicity. The Light weight is perfect for elegant headlines and modern editorial layouts.", weights: ["Light"], styles: ["normal"], glyphs: 320, version: "1.0" },
];

export default function FontDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { language } = useLanguage();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [font, setFont] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [previewText, setPreviewText] = useState("");
    const [previewSize, setPreviewSize] = useState(48);
    const [hasAccess, setHasAccess] = useState(false);
    const [relatedFonts, setRelatedFonts] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    useEffect(() => {
        const fetchFont = async () => {
            if (!params.slug) return;
            try {
                setLoading(true);
                const res = await fontService.getById(params.slug);

                let fontData = res.data;

                // Fallback to mock data if not found in API
                if (!fontData) {
                    fontData = mockFonts.find(f => f.slug === params.slug);
                }

                if (fontData) {
                    setFont(fontData);
                    setLikeCount(fontData.likes || 0);
                    setViewCount(fontData.views || 0);
                    setPreviewText(fontData.previewText || (language === 'bn' ? 'আমার সোনার বাংলা আমি তোমায় ভালোবাসি' : 'The quick brown fox jumps over the lazy dog'));

                    // Check if user has liked
                    const likedItems = JSON.parse(localStorage.getItem('likedFonts') || '[]');
                    setIsLiked(likedItems.includes(fontData._id));

                    // Check access if authenticated and has real ID
                    if (isAuthenticated && fontData._id.length > 5) {
                        try {
                            const accessRes = await downloadService.checkAccess(fontData._id);
                            if (accessRes?.success) {
                                setHasAccess(accessRes.data.hasAccess);
                            }
                        } catch (err) {
                            console.error("Access check error:", err);
                        }
                    }

                    // Fetch related fonts
                    try {
                        const relatedRes = await fontService.getAll(`?category=${fontData.category}&limit=3`);
                        if (relatedRes.success && relatedRes.data?.length > 0) {
                            setRelatedFonts(relatedRes.data.filter(f => f._id !== fontData._id));
                        } else {
                            setRelatedFonts(mockFonts.filter(f => f.slug !== params.slug).slice(0, 3));
                        }
                    } catch (e) {
                        setRelatedFonts(mockFonts.filter(f => f.slug !== params.slug).slice(0, 3));
                    }
                }
            } catch (error) {
                console.error("Error fetching font:", error);

                // Final fallback trial on error
                const fallback = mockFonts.find(f => f.slug === params.slug);
                if (fallback) {
                    setFont(fallback);
                    setLikeCount(fallback.likes || 0);
                    setViewCount(fallback.views || 0);
                    setPreviewText(language === 'bn' ? 'আমার সোনার বাংলা আমি তোমায় ভালোবাসি' : 'The quick brown fox jumps over the lazy dog');
                    setRelatedFonts(mockFonts.filter(f => f.slug !== params.slug).slice(0, 3));
                } else {
                    toast.error(language === 'bn' ? 'ফন্ট লোড করতে ব্যর্থ হয়েছে' : 'Failed to load font');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchFont();
    }, [params.slug, isAuthenticated, language]);

    const handleAddToCart = () => {
        if (!font) return;
        dispatch(addToCart({
            _id: font._id,
            title: font.title,
            price: font.salePrice || font.price,
            originalPrice: font.price,
            thumbnail: font.thumbnail,
            type: 'font',
            slug: font.slug,
        }));
        toast.success(language === 'bn' ? '🛒 কার্টে যোগ করা হয়েছে!' : '🛒 Added to cart!');
        router.push('/cart');
    };

    const handleBuyNow = () => {
        if (!font) return;
        dispatch(addToCart({
            _id: font._id,
            title: font.title,
            price: font.salePrice || font.price,
            originalPrice: font.price,
            thumbnail: font.thumbnail,
            type: 'font',
            slug: font.slug,
        }));
        router.push('/checkout');
    };

    const handleDownload = () => {
        router.push('/dashboard/user/downloads');
    };

    const handleToggleLike = async () => {
        if (!font) return;
        if (font._id.length < 5) {
            // Mock like for demo items
            setIsLiked(!isLiked);
            setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
            toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
            return;
        }

        setLikeLoading(true);
        const action = isLiked ? 'unlike' : 'like';

        try {
            const res = await fontService.toggleLike(font._id, action);
            if (res.success) {
                setLikeCount(res.data.likes);
                setIsLiked(!isLiked);

                const likedItems = JSON.parse(localStorage.getItem('likedFonts') || '[]');
                if (action === 'like') {
                    likedItems.push(font._id);
                    toast.success(language === 'bn' ? '❤️ পছন্দ করা হয়েছে!' : '❤️ Added to favorites!');
                } else {
                    const index = likedItems.indexOf(font._id);
                    if (index > -1) likedItems.splice(index, 1);
                }
                localStorage.setItem('likedFonts', JSON.stringify(likedItems));
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            toast.error(language === 'bn' ? 'ব্যর্থ হয়েছে' : 'Failed to update like');
        } finally {
            setLikeLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="pt-32 pb-20 container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="aspect-[4/3] rounded-3xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        <div className="space-y-6">
                            <div className="h-8 w-32 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse" />
                            <div className="h-12 w-3/4 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                            <div className="h-32 w-full rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!font) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="pt-32 container px-6 mx-auto text-center">
                    <FiInfo className="w-16 h-16 mx-auto text-gray-300 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">{language === 'bn' ? 'ফন্ট পাওয়া যায়নি' : 'Font Not Found'}</h1>
                    <Link href="/fonts" className="text-primary font-bold">Browse all fonts</Link>
                </div>
            </div>
        );
    }

    const discount = font.price > 0 && font.salePrice ? Math.round(((font.price - font.salePrice) / font.price) * 100) : 0;
    const previewImages = [font.thumbnail, ...(font.previewImages || [])].filter(Boolean);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Breadcrumb - Minimal Modern */}
            <div className="pt-28 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'bn' ? 'হোম' : 'Home'}</Link>
                        <span>/</span>
                        <Link href="/fonts" className="hover:text-primary transition-colors">{language === 'bn' ? 'ফন্ট' : 'Fonts'}</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{font.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-8 lg:py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left - Visuals and Previews (7 cols) */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Main Preview */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-2xl shadow-black/10 ring-1 ring-gray-200 dark:ring-gray-800 group"
                            >
                                <img
                                    src={previewImages[activeImage]}
                                    alt={font.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {discount > 0 && (
                                    <div className="absolute top-8 left-8 px-5 py-2.5 bg-red-500 text-white text-sm font-black rounded-full shadow-xl">
                                        {discount}% OFF
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowImageModal(true)}
                                    className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-900 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                >
                                    <FiMaximize2 className="w-5 h-5" />
                                </button>
                            </motion.div>

                            {/* Thumbnails */}
                            {previewImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {previewImages.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(i)}
                                            className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary ring-4 ring-primary/10' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Interactive Font Preview - Premium Tool */}
                            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <FiType className="text-primary" />
                                        {language === 'bn' ? 'ফন্ট প্রিভিউ টুল' : 'Type Tester'}
                                    </h3>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                            <span className="text-xs font-bold text-gray-500 uppercase">Size</span>
                                            <input
                                                type="range"
                                                min="16"
                                                max="120"
                                                value={previewSize}
                                                onChange={(e) => setPreviewSize(Number(e.target.value))}
                                                className="w-24 h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                            <span className="text-sm font-black w-10 text-right">{previewSize}px</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <textarea
                                        value={previewText}
                                        onChange={(e) => setPreviewText(e.target.value)}
                                        placeholder="Type something to test the font..."
                                        rows={2}
                                        className="w-full p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-lg resize-none"
                                    />
                                    <div className="p-10 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 overflow-hidden flex items-center justify-center min-h-[300px]">
                                        <p
                                            style={{
                                                fontSize: `${previewSize}px`,
                                                fontFamily: font.fontFamily || 'inherit',
                                                lineHeight: 1.2
                                            }}
                                            className="text-gray-900 dark:text-white text-center break-words w-full"
                                        >
                                            {previewText || "Type something..."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Product Details (5 cols) */}
                        <div className="lg:col-span-5 space-y-8">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                {/* Category and Status */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">{font.category}</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Version {font.version || '1.0'}</span>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight uppercase font-heading">
                                    {font.title}
                                </h1>

                                {/* Seller Info */}
                                {font.seller && (
                                    <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <img src={font.seller.avatar || "https://randomuser.me/api/portraits/men/32.jpg"} alt="" className="w-12 h-12 rounded-full ring-2 ring-primary/20" />
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'ডিজাইনার' : 'Created By'}</p>
                                            <p className="font-black text-gray-900 dark:text-white">{font.seller.firstName} {font.seller.lastName}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Real Statistics */}
                                <div className="grid grid-cols-3 gap-4 mb-8">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
                                        <FiStar className="w-5 h-5 mx-auto mb-2 text-amber-500 fill-amber-500" />
                                        <span className="block text-xl font-black">{font.rating || '4.9'}</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{font.reviewCount || 0} Reviews</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center border border-gray-100 dark:border-gray-800">
                                        <FiDownload className="w-5 h-5 mx-auto mb-2 text-green-500" />
                                        <span className="block text-xl font-black">{font.downloads?.toLocaleString() || 0}</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Downloads</span>
                                    </div>
                                    <button
                                        onClick={handleToggleLike}
                                        disabled={likeLoading}
                                        className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center border border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-800 transition-all group"
                                    >
                                        <FiHeart className={`w-5 h-5 mx-auto mb-2 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-red-500'}`} />
                                        <span className="block text-xl font-black">{likeCount?.toLocaleString() || 0}</span>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Likes</span>
                                    </button>
                                </div>

                                <div className="mb-8 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl flex items-center justify-center gap-3 border border-blue-100 dark:border-blue-800/20">
                                    <FiEye className="text-blue-500" />
                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                        {viewCount?.toLocaleString() || 0} Total Content Views
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">{font.description}</p>

                                {/* Technical Specs Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                                        <span className="text-xs font-bold text-gray-500 uppercase">{language === 'bn' ? 'ওয়েট' : 'Weights'}</span>
                                        <span className="font-black text-sm">{font.weights?.length || 1}</span>
                                    </div>
                                    <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                                        <span className="text-xs font-bold text-gray-500 uppercase">{language === 'bn' ? 'স্টাইল' : 'Styles'}</span>
                                        <span className="font-black text-sm">{font.styles?.length || 1}</span>
                                    </div>
                                    <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                                        <span className="text-xs font-bold text-gray-500 uppercase">{language === 'bn' ? 'গ্লিফস' : 'Glyphs'}</span>
                                        <span className="font-black text-sm">{font.glyphs || '250+'}</span>
                                    </div>
                                    <div className="px-5 py-4 bg-gray-50 dark:bg-gray-900 rounded-2xl flex items-center justify-between border border-gray-100 dark:border-gray-800">
                                        <span className="text-xs font-bold text-gray-500 uppercase">{language === 'bn' ? 'ভাষা' : 'Formats'}</span>
                                        <span className="font-black text-sm uppercase">OTF, TTF</span>
                                    </div>
                                </div>

                                {/* Buy Options - Fixed at bottom on mobile */}
                                <div className="sticky bottom-0 lg:static bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pt-6 lg:pt-0 pb-6 lg:pb-0 z-20">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{language === 'bn' ? 'মূল্য' : 'License Price'}</p>
                                            <div className="flex items-baseline gap-3">
                                                {discount > 0 ? (
                                                    <>
                                                        <span className="text-4xl font-black text-primary">৳{font.salePrice.toLocaleString()}</span>
                                                        <span className="text-xl text-gray-400 line-through">৳{font.price.toLocaleString()}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-4xl font-black text-gray-900 dark:text-white">৳{font.price.toLocaleString()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {hasAccess ? (
                                            <motion.button
                                                onClick={handleDownload}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full h-16 flex items-center justify-center gap-3 bg-green-500 text-white font-black text-xl rounded-2xl shadow-xl shadow-green-500/20 uppercase tracking-widest group"
                                            >
                                                <FiDownload className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
                                                {language === 'bn' ? 'ডাউনলোড করুন' : 'Download Now'}
                                            </motion.button>
                                        ) : (
                                            <>
                                                <motion.button
                                                    onClick={handleBuyNow}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full h-16 flex items-center justify-center gap-3 bg-primary text-black font-black text-xl rounded-2xl shadow-xl shadow-primary/20 uppercase tracking-widest"
                                                >
                                                    <FiShoppingCart className="w-6 h-6" />
                                                    {language === 'bn' ? 'এখনই কিনুন' : 'Buy Now'}
                                                </motion.button>

                                                <div className="grid grid-cols-4 gap-3">
                                                    <motion.button
                                                        onClick={handleAddToCart}
                                                        className="col-span-2 h-14 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-sm tracking-widest"
                                                    >
                                                        {language === 'bn' ? 'কার্টে যোগ' : 'Add To Cart'}
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={handleToggleLike}
                                                        disabled={likeLoading}
                                                        className={`h-14 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-2xl transition-all ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
                                                    >
                                                        <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : ''}`} />
                                                    </motion.button>
                                                    <button className="h-14 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-2xl hover:text-primary transition-colors">
                                                        <FiShare2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div >
            </section >

            {/* Related Items Section */}
            {
                relatedFonts.length > 0 && (
                    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
                        <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase font-heading">{language === 'bn' ? 'সম্পর্কিত ফন্ট' : 'You May Also Like'}</h2>
                                    <div className="h-1.5 w-20 bg-primary mt-2 rounded-full" />
                                </div>
                                <Link href="/fonts" className="group flex items-center gap-2 font-black text-primary uppercase text-sm tracking-widest">
                                    {language === 'bn' ? 'সব দেখুন' : 'View Library'}
                                    <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedFonts.map((f) => (
                                    <Link
                                        key={f._id}
                                        href={`/fonts/${f.slug}`}
                                        className="group bg-white dark:bg-gray-900 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                    >
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            <img src={f.thumbnail} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="p-8">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">{f.category}</span>
                                                <span className="flex items-center gap-1 text-xs font-bold text-gray-400"><FiStar className="text-amber-500 fill-amber-500" /> {f.rating || '4.9'}</span>
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors uppercase truncate">{f.title}</h3>
                                            <div className="flex items-center justify-between mt-6">
                                                <div className="flex items-baseline gap-2">
                                                    {f.salePrice ? (
                                                        <><span className="text-2xl font-black text-gray-900 dark:text-white">৳{f.salePrice}</span><span className="text-sm text-gray-400 line-through">৳{f.price}</span></>
                                                    ) : (
                                                        <span className="text-2xl font-black text-gray-900 dark:text-white">৳{f.price}</span>
                                                    )}
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors">
                                                    <FiArrowLeft className="rotate-[135deg]" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* Fullscreen Image Modal */}
            <AnimatePresence>
                {showImageModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12"
                        onClick={() => setShowImageModal(false)}
                    >
                        <button className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
                            <FiX className="w-8 h-8" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={previewImages[activeImage]}
                            alt={font.title}
                            className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div >
    );
}
