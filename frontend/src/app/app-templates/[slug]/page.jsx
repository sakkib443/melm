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
    FiSmartphone,
    FiLayers,
    FiServer,
    FiCheck,
    FiExternalLink,
    FiCode,
    FiX,
    FiMaximize2,
    FiPackage,
    FiEye,
    FiInfo
} from "react-icons/fi";
import { SiFlutter, SiReact, SiSwift, SiKotlin, SiIonic } from "react-icons/si";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { appTemplateService, downloadService } from "@/services/api";
import toast from "react-hot-toast";

const frameworkIcons = {
    flutter: SiFlutter,
    "react-native": SiReact,
    swift: SiSwift,
    kotlin: SiKotlin,
    ionic: SiIonic
};

export default function AppTemplateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [hasAccess, setHasAccess] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!params.slug) return;
            setLoading(true);
            try {
                const res = await appTemplateService.getById(params.slug);
                if (res?.data) {
                    setProduct(res.data);
                    setLikeCount(res.data.likes || 0);
                    setViewCount(res.data.views || 0);

                    const likedItems = JSON.parse(localStorage.getItem('likedApps') || '[]');
                    setIsLiked(likedItems.includes(res.data._id));

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

                    try {
                        const relatedRes = await appTemplateService.getAll(`?category=${res.data.category}&limit=3`);
                        if (relatedRes?.success) {
                            setRelatedProducts(relatedRes.data.filter(i => i._id !== res.data._id));
                        }
                    } catch (e) { console.error(e); }
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error(language === 'bn' ? 'টেমপ্লেট লোড করতে ব্যর্থ হয়েছে' : 'Failed to load template');
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [params.slug, language, isAuthenticated]);

    const handleAddToCart = () => {
        if (!product) return;
        dispatch(addToCart({
            _id: product._id,
            title: product.title,
            price: product.salePrice || product.price,
            originalPrice: product.price,
            thumbnail: product.thumbnail,
            type: 'app-template',
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
            type: 'app-template',
            slug: product.slug,
        }));
        router.push('/checkout');
    };

    const handleDownload = () => {
        router.push('/dashboard/user/downloads');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 flex justify-center items-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 text-center">
                <FiInfo className="w-20 h-20 mx-auto text-gray-200 mb-6" />
                <h1 className="text-3xl font-bold mb-4">{language === 'bn' ? 'পাওয়া যায়নি' : 'Not Found'}</h1>
                <Link href="/app-templates" className="text-primary font-bold">Go Back</Link>
            </div>
        );
    }

    const discount = product.price > 0 && product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
    const allImages = [product.thumbnail, ...(product.previewImages || [])].filter(Boolean);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Breadcrumb */}
            <div className="pt-28 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/app-templates" className="hover:text-primary transition-colors">App Templates</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{product.title}</span>
                    </div>
                </div>
            </div>

            <section className="py-8 lg:py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left: Product Images */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-2xl ring-1 ring-gray-100 dark:ring-gray-800 group cursor-zoom-in"
                                onClick={() => setShowImageModal(true)}
                            >
                                <img
                                    src={allImages[activeImage]}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {discount > 0 && (
                                    <div className="absolute top-8 left-8 px-6 py-2.5 bg-emerald-600 text-white font-black rounded-full uppercase text-xs tracking-widest shadow-xl">
                                        {discount}% OFF FULL BUNDLE
                                    </div>
                                )}
                            </motion.div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                    {allImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveImage(index)}
                                            className={`relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border-2 transition-all ${activeImage === index
                                                ? 'border-primary ring-4 ring-primary/10'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Software/Tech Highlights */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiSmartphone className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Screens</p>
                                    <p className="font-black text-gray-900 dark:text-white">{product.screens || '40'}+</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiCode className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Framework</p>
                                    <p className="font-black text-gray-900 dark:text-white uppercase">{product.framework?.[0] || 'Flutter'}</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiServer className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Backend</p>
                                    <p className="font-black text-gray-900 dark:text-white">{product.backendIncluded ? 'YES' : 'NO'}</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiPackage className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase">Support</p>
                                    <p className="font-black text-gray-900 dark:text-white">6 MO</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Product Info & Buy */}
                        <div className="lg:col-span-5 space-y-8">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-widest rounded-full">{product.category}</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Premium Core Release</span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight uppercase font-heading">
                                    {product.title}
                                </h1>

                                {/* Stats Bar */}
                                <div className="grid grid-cols-4 gap-2 mb-8 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
                                    <div className="p-3 text-center">
                                        <FiStar className="w-5 h-5 mx-auto mb-1.5 text-amber-500 fill-amber-500" />
                                        <span className="block text-sm font-black">{product.rating || '4.9'}</span>
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

                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">{product.description}</p>

                                {/* Framework Icons Row */}
                                <div className="flex gap-4 mb-8">
                                    {product.framework?.map((fw, i) => {
                                        const Icon = frameworkIcons[fw] || FiCode;
                                        return (
                                            <div key={i} className="flex items-center gap-3 px-6 py-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                                <Icon className="text-emerald-500 w-8 h-8" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase">Framework</p>
                                                    <p className="font-black text-gray-900 dark:text-white uppercase leading-none">{fw}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Purchase Actions */}
                                <div className="sticky bottom-0 lg:static bg-white/90 dark:bg-gray-950/90 backdrop-blur-md pt-8 lg:pt-0 z-30">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Enterprise Source License</p>
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
                                                className="w-full h-16 bg-green-500 text-white font-black text-xl rounded-2xl shadow-2xl flex items-center justify-center gap-3"
                                            >
                                                <FiDownload /> Download Source Code
                                            </motion.button>
                                        ) : (
                                            <>
                                                <motion.button
                                                    onClick={handleBuyNow}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full h-20 bg-primary text-black font-black text-2xl rounded-3xl shadow-2xl uppercase tracking-widest"
                                                >
                                                    <FiShoppingCart className="inline-block mr-2" /> Complete Order
                                                </motion.button>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <motion.button
                                                        onClick={handleAddToCart}
                                                        className="h-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-sm"
                                                    >
                                                        Add to Cart
                                                    </motion.button>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <button className="h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl hover:text-red-500 transition-all">
                                                            <FiHeart className="w-6 h-6" />
                                                        </button>
                                                        <button className="h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-2xl hover:text-primary transition-all">
                                                            <FiShare2 className="w-6 h-6" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase font-heading mb-10">Premium Features Included</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(product.features || ["User Auth", "Push Notifications", "API Built", "Dashboard", "Multi-language", "Documentation"]).map((f, i) => (
                                <div key={i} className="p-6 bg-gray-50 dark:bg-gray-910 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                                        <FiCheck className="w-6 h-6" />
                                    </div>
                                    <span className="text-gray-900 dark:text-white font-bold">{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
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
                            src={allImages[activeImage]}
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
