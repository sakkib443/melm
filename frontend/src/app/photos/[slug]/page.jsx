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
    FiCamera,
    FiMap,
    FiGrid,
    FiInfo
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { photoService, downloadService } from "@/services/api";
import toast from "react-hot-toast";

export default function PhotoDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!params.slug) return;
            setLoading(true);
            try {
                const res = await photoService.getById(params.slug);
                if (res?.data) {
                    setProduct(res.data);
                    setLikeCount(res.data.likes || 0);
                    setViewCount(res.data.views || 0);

                    // Check if user has liked
                    const likedItems = JSON.parse(localStorage.getItem('likedPhotos') || '[]');
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
                    try {
                        const relatedRes = await photoService.getAll(`?category=${res.data.category}&limit=3`);
                        if (relatedRes?.success) {
                            setRelatedProducts(relatedRes.data.filter(item => item._id !== res.data._id));
                        }
                    } catch (e) { console.error(e); }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error(language === 'bn' ? 'ফটো লোড করতে ব্যর্থ হয়েছে' : 'Failed to load photo');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [params.slug, language, isAuthenticated]);

    const handleToggleLike = async () => {
        // Logic for like toggle if service exists
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
    };

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            _id: product._id,
            title: product.title,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            thumbnail: product.thumbnail,
            type: 'photo',
            slug: product.slug,
        }));
        toast.success(language === 'bn' ? '🛒 কার্টে যোগ করা হয়েছে!' : '🛒 Added to cart!');
        router.push('/cart');
    };

    const handleBuyNow = () => {
        if (!product) return;
        dispatch(addToCart({
            _id: product._id,
            title: product.title,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            thumbnail: product.thumbnail,
            type: 'photo',
            slug: product.slug,
        }));
        router.push('/checkout');
    };

    const handleDownload = () => {
        router.push('/dashboard/user/downloads');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="pt-32 flex justify-center items-center h-[60vh]">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="pt-32 container px-6 mx-auto text-center">
                    <FiInfo className="w-24 h-24 mx-auto text-gray-200 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">{language === 'bn' ? 'ফটো পাওয়া যায়নি' : 'Photo Not Found'}</h1>
                    <Link href="/photos" className="text-primary font-bold">Browse Gallery</Link>
                </div>
            </div>
        );
    }

    const discount = product.price > 0 && product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Breadcrumb */}
            <div className="pt-28 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'bn' ? 'হোম' : 'Home'}</Link>
                        <span>/</span>
                        <Link href="/photos" className="hover:text-primary transition-colors">{language === 'bn' ? 'ফটো' : 'Photos'}</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{product.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-8 lg:py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left: Visuals */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-2xl shadow-black/10 ring-1 ring-gray-200 dark:ring-gray-800 group cursor-zoom-in"
                                onClick={() => setShowImageModal(true)}
                            >
                                <img
                                    src={product.watermarkedPreview || product.thumbnail}
                                    alt={product.title}
                                    className="w-full h-auto group-hover:scale-105 transition-transform duration-1000"
                                />
                                {discount > 0 && (
                                    <div className="absolute top-8 left-8 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black rounded-full uppercase text-xs tracking-widest shadow-xl">
                                        {discount}% SAVINGS
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white">
                                        <FiMaximize2 className="w-8 h-8" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Color Palette */}
                            {product.colors?.length > 0 && (
                                <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div> Color Palette
                                    </h3>
                                    <div className="flex gap-4">
                                        {product.colors.map((color, i) => (
                                            <div key={i} className="flex-1 h-16 rounded-2xl shadow-inner border border-black/5" style={{ backgroundColor: color }} title={color} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="pt-8">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase font-heading mb-6">About this Capture</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{product.description}</p>
                            </div>
                        </div>

                        {/* Right: Purchase & Details */}
                        <div className="lg:col-span-5 space-y-8">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">{product.category}</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{product.type?.toUpperCase()} ASSET</span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight uppercase font-heading">
                                    {product.title}
                                </h1>

                                <div className="grid grid-cols-4 gap-2 mb-8 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
                                    <div className="p-3 text-center">
                                        <FiStar className="w-5 h-5 mx-auto mb-1.5 text-amber-500 fill-amber-500" />
                                        <span className="block text-sm font-black">{product.rating || '5.0'}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{product.reviewCount || 0} reviews</span>
                                    </div>
                                    <div className="p-3 text-center border-l dark:border-gray-800">
                                        <FiEye className="w-5 h-5 mx-auto mb-1.5 text-blue-500" />
                                        <span className="block text-sm font-black">{viewCount.toLocaleString()}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Views</span>
                                    </div>
                                    <div className="p-3 text-center border-l dark:border-gray-800">
                                        <FiDownload className="w-5 h-5 mx-auto mb-1.5 text-green-500" />
                                        <span className="block text-sm font-black">{product.downloads?.toLocaleString() || 0}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Sales</span>
                                    </div>
                                    <div className="p-3 text-center border-l dark:border-gray-800">
                                        <FiHeart className="w-5 h-5 mx-auto mb-1.5 text-red-500" />
                                        <span className="block text-sm font-black">{likeCount.toLocaleString()}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Likes</span>
                                    </div>
                                </div>

                                {/* Tech Specs */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary shadow-sm">
                                            <FiMaximize2 />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Resolution</p>
                                            <p className="font-black text-gray-900 dark:text-white uppercase">{product.resolution?.width}x{product.resolution?.height}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-primary shadow-sm">
                                            <FiGrid />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase">Aspect</p>
                                            <p className="font-black text-gray-900 dark:text-white uppercase capitalize">{product.orientation || 'Horizontal'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Purchase Box */}
                                <div className="sticky bottom-0 lg:static bg-white/90 dark:bg-gray-950/90 backdrop-blur-md pt-8 lg:pt-0 z-30">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Digital Asset License</p>
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
                                                className="w-full h-16 flex items-center justify-center gap-3 bg-green-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-green-500/20 uppercase tracking-widest"
                                            >
                                                <FiDownload className="w-6 h-6" />
                                                {language === 'bn' ? 'ডাউনলোড শুরু করুন' : 'Download Full Size'}
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
                                                    {language === 'bn' ? 'এখনই কিনুন' : 'Access Original Asset'}
                                                </motion.button>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <motion.button
                                                        onClick={handleAddToCart}
                                                        className="h-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-sm tracking-widest"
                                                    >
                                                        {language === 'bn' ? 'কার্টে যোগ' : 'Add to Cart'}
                                                    </motion.button>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <motion.button onClick={handleToggleLike} className={`h-16 flex items-center justify-center rounded-2xl transition-all ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:text-red-500'}`}>
                                                            <FiHeart className={`w-6 h-6 ${isLiked ? 'fill-white' : ''}`} />
                                                        </motion.button>
                                                        <motion.button className="h-16 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-2xl hover:text-primary transition-all">
                                                            <FiShare2 className="w-6 h-6" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-24 pt-20 border-t border-gray-100 dark:border-gray-800">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase font-heading mb-12">Related Captures</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedProducts.map((item) => (
                                    <Link
                                        key={item._id}
                                        href={`/photos/${item.slug}`}
                                        className="group bg-white dark:bg-gray-910 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
                                    >
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="p-8">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 block">{item.category}</span>
                                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-4 line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                                <span className="font-black text-2xl text-gray-900 dark:text-white">৳{item.price}</span>
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                    <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                    {item.rating || '5.0'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

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
                        <button className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all">
                            <FiX className="w-8 h-8" />
                        </button>
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            src={product.previewImage || product.thumbnail}
                            alt={product.title}
                            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
