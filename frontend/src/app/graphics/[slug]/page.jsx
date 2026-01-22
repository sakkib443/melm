"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHeart,
    FiShoppingCart,
    FiStar,
    FiDownload,
    FiShare2,
    FiCheck,
    FiArrowLeft,
    FiArrowRight,
    FiZoomIn,
    FiEye,
    FiFileText,
    FiLayers,
    FiPackage,
    FiCopy,
    FiX,
    FiMaximize2,
    FiExternalLink,
    FiInfo
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { graphicsService, downloadService } from "@/services/api";
import toast from "react-hot-toast";

export default function GraphicsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!params.slug) return;
            setLoading(true);
            try {
                const res = await graphicsService.getBySlug(params.slug);
                if (res?.data) {
                    setProduct(res.data);
                    setLikeCount(res.data.likes || 0);
                    setViewCount(res.data.views || 0);

                    // Check if user has liked
                    const likedItems = JSON.parse(localStorage.getItem('likedGraphics') || '[]');
                    setIsLiked(likedItems.includes(res.data._id));

                    // Check access if authenticated
                    if (isAuthenticated) {
                        try {
                            const accessRes = await downloadService.checkAccess(res.data._id);
                            if (accessRes?.success) {
                                setHasAccess(accessRes.data.hasAccess);
                            }
                        } catch (err) {
                            console.error("Access check error:", err);
                        }
                    }

                    // Fetch related products
                    if (res.data.category?._id) {
                        const relatedRes = await graphicsService.getAll(`?category=${res.data.category._id}&status=published&limit=4`);
                        if (relatedRes?.data) {
                            setRelatedProducts(relatedRes.data.filter(item => item._id !== res.data._id).slice(0, 4));
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error(language === 'bn' ? 'প্রোডাক্ট লোড করতে ব্যর্থ হয়েছে' : 'Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [params.slug, language, isAuthenticated]);

    const handleToggleLike = async () => {
        if (!product) return;

        setLikeLoading(true);
        const action = isLiked ? 'unlike' : 'like';

        try {
            const res = await graphicsService.toggleLike(product._id, action);
            if (res?.success) {
                setLikeCount(res.data.likes);
                setIsLiked(!isLiked);

                const likedItems = JSON.parse(localStorage.getItem('likedGraphics') || '[]');
                if (action === 'like') {
                    likedItems.push(product._id);
                    toast.success(language === 'bn' ? '❤️ পছন্দ করা হয়েছে!' : '❤️ Added to likes!');
                } else {
                    const index = likedItems.indexOf(product._id);
                    if (index > -1) likedItems.splice(index, 1);
                }
                localStorage.setItem('likedGraphics', JSON.stringify(likedItems));
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setLikeLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            _id: product._id,
            title: language === 'bn' ? (product.titleBn || product.title) : product.title,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            thumbnail: product.thumbnail,
            type: 'graphics',
            slug: product.slug,
        }));
        toast.success(language === 'bn' ? '🛒 কার্টে যোগ করা হয়েছে!' : '🛒 Added to cart!');
        router.push('/cart');
    };

    const handleBuyNow = () => {
        if (!product) return;
        dispatch(addToCart({
            _id: product._id,
            title: language === 'bn' ? (product.titleBn || product.title) : product.title,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            thumbnail: product.thumbnail,
            type: 'graphics',
            slug: product.slug,
        }));
        router.push('/checkout');
    };

    const handleDownload = () => {
        router.push('/dashboard/user/downloads');
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : '');
        toast.success(language === 'bn' ? 'লিংক কপি হয়েছে!' : 'Link copied!');
        setShowShareModal(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="pt-32 pb-20 container px-6 lg:px-12 max-w-[1400px] mx-auto text-center">
                    <div className="flex items-center justify-center p-20">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="pt-32 container px-6 mx-auto text-center">
                    <FiPackage className="w-24 h-24 mx-auto text-gray-200 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">{language === 'bn' ? 'প্রোডাক্ট পাওয়া যায়নি' : 'Product Not Found'}</h1>
                    <Link href="/graphics" className="text-primary font-bold">Browse Graphics</Link>
                </div>
            </div>
        );
    }

    const title = language === 'bn' ? (product.titleBn || product.title) : product.title;
    const description = language === 'bn' ? (product.descriptionBn || product.description) : product.description;
    const catName = language === 'bn' ? (product.category?.nameBn || product.category?.name || "Graphics") : (product.category?.name || "Graphics");
    const features = language === 'bn' ? (product.featuresBn || product.features || []) : (product.features || []);
    const allImages = [product.thumbnail, ...(product.previewImages || [])].filter(Boolean);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Breadcrumb */}
            <div className="pt-28 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'bn' ? 'হোম' : 'Home'}</Link>
                        <span>/</span>
                        <Link href="/graphics" className="hover:text-primary transition-colors">{language === 'bn' ? 'গ্রাফিক্স' : 'Graphics'}</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-8 lg:py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left: Images */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-2xl shadow-black/10 ring-1 ring-gray-200 dark:ring-gray-800 group"
                            >
                                <img
                                    src={allImages[selectedImage]}
                                    alt={title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {product.salePrice > 0 && (
                                    <div className="absolute top-8 left-8 px-6 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-black rounded-full uppercase text-xs tracking-widest shadow-xl shadow-red-500/30">
                                        {Math.round((1 - product.salePrice / product.price) * 100)}% DISCOUNT
                                    </div>
                                )}
                                <div className="absolute bottom-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={handleShare} className="w-14 h-14 bg-white/95 backdrop-blur rounded-full flex items-center justify-center text-gray-900 hover:bg-primary transition-all shadow-xl">
                                        <FiShare2 className="w-6 h-6" />
                                    </button>
                                    <button onClick={() => setShowImageModal(true)} className="w-14 h-14 bg-white/95 backdrop-blur rounded-full flex items-center justify-center text-gray-900 hover:bg-primary transition-all shadow-xl">
                                        <FiMaximize2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-primary ring-4 ring-primary/10'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Detailed Description Section */}
                            <div className="pt-12 border-t border-gray-100 dark:border-gray-800">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase font-heading mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-primary rounded-full" />
                                    {language === 'bn' ? 'প্রোডাক্ট বিবরণ' : 'Project Insights'}
                                </h2>
                                <div
                                    className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: description }}
                                />
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="lg:col-span-5 space-y-8">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                {/* Category and Tags */}
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">
                                        {catName}
                                    </span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Premium Assets</span>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight uppercase font-heading">
                                    {title}
                                </h1>

                                {/* Stats Bar - Real Statistics */}
                                <div className="grid grid-cols-4 gap-2 mb-8 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
                                    <div className="p-3 text-center">
                                        <FiStar className="w-5 h-5 mx-auto mb-1.5 text-amber-500 fill-amber-500" />
                                        <span className="block text-sm font-black text-gray-900 dark:text-white">{product.rating?.toFixed(1) || '5.0'}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{product.reviewCount || 0} Reviews</span>
                                    </div>
                                    <div className="p-3 text-center border-l dark:border-gray-800">
                                        <FiEye className="w-5 h-5 mx-auto mb-1.5 text-blue-500" />
                                        <span className="block text-sm font-black text-gray-900 dark:text-white">{viewCount.toLocaleString()}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Views</span>
                                    </div>
                                    <div className="p-3 text-center border-l dark:border-gray-800">
                                        <FiDownload className="w-5 h-5 mx-auto mb-1.5 text-green-500" />
                                        <span className="block text-sm font-black text-gray-900 dark:text-white">{product.downloads?.toLocaleString() || 0}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Downloads</span>
                                    </div>
                                    <button
                                        onClick={handleToggleLike}
                                        className="p-3 text-center border-l dark:border-gray-800 group hover:bg-white dark:hover:bg-gray-800 rounded-2xl transition-all"
                                    >
                                        <FiHeart className={`w-5 h-5 mx-auto mb-1.5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover:text-red-500'}`} />
                                        <span className="block text-sm font-black text-gray-900 dark:text-white">{likeCount.toLocaleString()}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Likes</span>
                                    </button>
                                </div>

                                {/* Technical Specs Grid */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                        <FiLayers className="w-6 h-6 mx-auto mb-2 text-primary" />
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Formats</p>
                                        <span className="text-sm font-black uppercase text-gray-900 dark:text-white">{product.fileFormats?.[0] || 'PSD'}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                        <FiPackage className="w-6 h-6 mx-auto mb-2 text-primary" />
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Size</p>
                                        <span className="text-sm font-black text-gray-900 dark:text-white">
                                            {product.mainFile?.size ? (product.mainFile.size / (1024 * 1024)).toFixed(1) + " MB" : "Premium"}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 text-center">
                                        <FiFileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                                        <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Resolution</p>
                                        <span className="text-sm font-black text-gray-900 dark:text-white">HQ</span>
                                    </div>
                                </div>

                                {/* Features List */}
                                {features.length > 0 && (
                                    <div className="mb-8 space-y-3">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Core Benefits</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-910 rounded-2xl border border-gray-100 dark:border-gray-800 ring-1 ring-white dark:ring-gray-800/50">
                                                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                                        <FiCheck className="w-3.5 h-3.5 text-white" />
                                                    </div>
                                                    <span className="text-gray-900 dark:text-white font-bold text-sm">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Buy Options */}
                                <div className="sticky bottom-0 lg:static bg-white/90 dark:bg-gray-950/90 backdrop-blur-md pt-8 lg:pt-0 z-30">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full License Price</p>
                                            <div className="flex items-baseline gap-3">
                                                {product.salePrice ? (
                                                    <>
                                                        <span className="text-4xl lg:text-5xl font-black text-primary font-heading">৳{product.salePrice.toLocaleString()}</span>
                                                        <span className="text-xl text-gray-400 line-through">৳{product.price.toLocaleString()}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white font-heading">৳{product.price?.toLocaleString() || 0}</span>
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
                                                className="w-full h-16 flex items-center justify-center gap-3 bg-green-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-green-500/20 uppercase tracking-widest group"
                                            >
                                                <FiDownload className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                                                {language === 'bn' ? 'ডাউনলোড শুরু করুন' : 'Download Now'}
                                            </motion.button>
                                        ) : (
                                            <>
                                                <motion.button
                                                    onClick={handleBuyNow}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full h-20 flex items-center justify-center gap-4 bg-primary text-black font-black text-2xl rounded-2xl shadow-2xl shadow-primary/30 uppercase tracking-widest"
                                                >
                                                    <FiShoppingCart className="w-7 h-7" />
                                                    {language === 'bn' ? 'এখনই কিনুন' : 'Complete Order'}
                                                </motion.button>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <motion.button
                                                        onClick={handleAddToCart}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="h-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-sm tracking-widest"
                                                    >
                                                        {language === 'bn' ? 'কার্টে যোগ' : 'Add to Cart'}
                                                    </motion.button>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <motion.button
                                                            onClick={handleToggleLike}
                                                            className={`h-16 flex items-center justify-center rounded-2xl transition-all ${isLiked ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-gray-100 dark:bg-gray-800 hover:text-red-500'}`}
                                                        >
                                                            <FiHeart className={`w-6 h-6 ${isLiked ? 'fill-white' : ''}`} />
                                                        </motion.button>
                                                        <motion.button
                                                            onClick={handleShare}
                                                            className="h-16 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-2xl hover:text-primary transition-all"
                                                        >
                                                            <FiShare2 className="w-6 h-6" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <p className="mt-6 text-center text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
                                        Secure Payment & Instant Access
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-24 pt-20 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase font-heading">{language === 'bn' ? 'সম্পর্কিত ডিজাইন' : 'Similar Creations'}</h2>
                                    <div className="h-1.5 w-20 bg-primary mt-3 rounded-full" />
                                </div>
                                <Link href="/graphics" className="group flex items-center gap-2 font-black text-primary uppercase text-sm tracking-widest">
                                    {language === 'bn' ? 'সব দেখুন' : 'View Library'}
                                    <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {relatedProducts.map((item) => (
                                    <Link
                                        key={item._id}
                                        href={`/graphics/${item.slug}`}
                                        className="group bg-white dark:bg-gray-910 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
                                    >
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            <img
                                                src={item.thumbnail}
                                                alt={language === 'bn' ? (item.titleBn || item.title) : item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-xl">
                                                    <FiMaximize2 className="w-6 h-6" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 block">
                                                {language === 'bn' ? (item.category?.nameBn || item.category?.name) : item.category?.name}
                                            </span>
                                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-4 line-clamp-1 group-hover:text-primary transition-colors">
                                                {language === 'bn' ? (item.titleBn || item.title) : item.title}
                                            </h3>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                                <div className="flex items-baseline gap-2">
                                                    {item.salePrice ? (
                                                        <><span className="text-2xl font-black text-gray-900 dark:text-white">৳{item.salePrice}</span><span className="text-sm text-gray-400 line-through">৳{item.price}</span></>
                                                    ) : (
                                                        <span className="text-2xl font-black text-gray-900 dark:text-white">৳{item.price}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                    <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                    {item.rating || '5.0'}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setShowShareModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-widest">
                                    {language === 'bn' ? 'শেয়ার করুন' : 'Share Asset'}
                                </h3>
                                <button onClick={() => setShowShareModal(false)} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Asset Link</p>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={typeof window !== 'undefined' ? window.location.href : ''}
                                            readOnly
                                            className="flex-1 bg-transparent outline-none text-sm font-medium truncate"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="w-12 h-12 bg-primary text-black flex items-center justify-center rounded-xl hover:bg-primary/90 transition-all shadow-lg"
                                        >
                                            <FiCopy className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Modal */}
            <AnimatePresence>
                {showImageModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                        onClick={() => setShowImageModal(false)}
                    >
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
                        >
                            <FiX className="w-8 h-8" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={allImages[selectedImage]}
                            alt={title}
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
