"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHeart,
    FiShoppingCart,
    FiStar,
    FiDownload,
    FiShare2,
    FiPlay,
    FiPause,
    FiLoader,
    FiMonitor,
    FiClock,
    FiX,
    FiMaximize2,
    FiExternalLink,
    FiCheck,
    FiLayers,
    FiPackage,
    FiTool,
    FiEye,
    FiInfo
} from "react-icons/fi";
import { SiAdobeaftereffects, SiAdobepremierepro, SiDavinciresolve } from "react-icons/si";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { videoTemplateService, downloadService } from "@/services/api";
import toast from "react-hot-toast";

const softwareIcons = {
    "after-effects": SiAdobeaftereffects,
    "premiere-pro": SiAdobepremierepro,
    "davinci-resolve": SiDavinciresolve
};

export default function VideoTemplateDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const dispatch = useDispatch();
    const videoRef = useRef(null);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!params.slug) return;
            setLoading(true);
            try {
                const res = await videoTemplateService.getById(params.slug);
                if (res?.data) {
                    setProduct(res.data);
                    setLikeCount(res.data.likes || 0);
                    setViewCount(res.data.views || 0);

                    const likedItems = JSON.parse(localStorage.getItem('likedVideos') || '[]');
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
                        const relatedRes = await videoTemplateService.getAll(`?category=${res.data.category}&limit=3`);
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
            type: 'video-template',
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
            type: 'video-template',
            slug: product.slug,
        }));
        router.push('/checkout');
    };

    const handleDownload = () => {
        router.push('/dashboard/user/downloads');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 text-center flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950 pt-32 text-center">
                <FiInfo className="w-20 h-20 mx-auto text-gray-200 mb-6" />
                <h1 className="text-3xl font-bold mb-4">{language === 'bn' ? 'টেমপ্লেট পাওয়া যায়নি' : 'Template Not Found'}</h1>
                <Link href="/video-templates" className="text-primary font-bold underline">Go back</Link>
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
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/video-templates" className="hover:text-primary transition-colors">Video Templates</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{product.title}</span>
                    </div>
                </div>
            </div>

            <section className="py-8 lg:py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left: Video Preview */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl shadow-rose-500/10 group"
                            >
                                <img
                                    src={product.thumbnail}
                                    alt={product.title}
                                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="w-24 h-24 rounded-full bg-primary text-black flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 transition-transform">
                                        <FiPlay className="w-10 h-10 ml-1.5" />
                                    </button>
                                </div>

                                {discount > 0 && (
                                    <div className="absolute top-8 left-8 px-6 py-2.5 bg-rose-600 text-white font-black rounded-full uppercase text-xs tracking-widest shadow-xl">
                                        {discount}% DISCOUNT
                                    </div>
                                )}

                                <div className="absolute bottom-8 right-8 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-sm font-bold flex items-center gap-2">
                                    <FiClock /> {product.duration}s
                                </div>
                            </motion.div>

                            {/* Tech Details Bar */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiMonitor className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Resolution</p>
                                    <p className="font-black text-gray-900 dark:text-white">{product.resolution?.label || '4K'}</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiPlay className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">FPS</p>
                                    <p className="font-black text-gray-900 dark:text-white">{product.frameRate || '30'} FPS</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiLayers className="w-6 h-6 mx-auto mb-2 text-rose-500" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Software</p>
                                    <p className="font-black text-gray-900 dark:text-white uppercase">{product.software?.[0]?.replace('-', ' ') || 'AE'}</p>
                                </div>
                            </div>

                            {/* Software Icons */}
                            <div className="p-8 bg-gray-50 dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-black text-gray-500 uppercase mb-6 tracking-widest">Compatibility</h3>
                                <div className="flex flex-wrap gap-4">
                                    {product.software?.map((sw, i) => {
                                        const Icon = softwareIcons[sw] || FiTool;
                                        return (
                                            <div key={i} className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                                <Icon className="text-rose-500 w-6 h-6" />
                                                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-wider">{sw.replace('-', ' ')}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right: Info & CTA */}
                        <div className="lg:col-span-5 space-y-8">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-widest rounded-full">{product.category}</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">v{product.version || '1.0'} Release</span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight uppercase font-heading">
                                    {product.title}
                                </h1>

                                {/* Real Stats Bar */}
                                <div className="grid grid-cols-4 gap-2 mb-8 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
                                    <div className="p-3 text-center">
                                        <FiStar className="w-5 h-5 mx-auto mb-1.5 text-amber-500 fill-amber-500" />
                                        <span className="block text-sm font-black">{product.rating || '4.9'}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{product.reviewCount || 0} Reviews</span>
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

                                {/* Features List */}
                                <div className="space-y-3 mb-8">
                                    {product.features?.slice(0, 4).map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-910 rounded-2xl border border-gray-100 dark:border-gray-800">
                                            <FiCheck className="text-green-500 font-black" />
                                            <span className="text-gray-900 dark:text-white font-bold text-sm">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Purchase CTA */}
                                <div className="sticky bottom-0 lg:static bg-white/90 dark:bg-gray-950/90 backdrop-blur-md pt-8 lg:pt-0 z-30">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Commercial License Price</p>
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
                                                className="w-full h-16 bg-green-500 text-white font-black text-xl rounded-2xl shadow-2xl shadow-green-500/20 uppercase tracking-widest"
                                            >
                                                <FiDownload className="inline-block mr-2" /> Download Project
                                            </motion.button>
                                        ) : (
                                            <>
                                                <motion.button
                                                    onClick={handleBuyNow}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full h-20 bg-primary text-black font-black text-2xl rounded-3xl shadow-2xl shadow-primary/30 uppercase tracking-widest"
                                                >
                                                    <FiShoppingCart className="inline-block mr-2" /> Buy Template
                                                </motion.button>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <motion.button
                                                        onClick={handleAddToCart}
                                                        className="h-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-sm tracking-widest"
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

                    {/* Related */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-24 pt-20 border-t border-gray-100 dark:border-gray-800">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase font-heading mb-12">Related Motion Assets</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedProducts.map((item) => (
                                    <Link
                                        key={item._id}
                                        href={`/video-templates/${item.slug}`}
                                        className="group bg-white dark:bg-gray-910 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
                                    >
                                        <div className="aspect-video overflow-hidden relative">
                                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all"></div>
                                        </div>
                                        <div className="p-8">
                                            <span className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-2 block">{item.category}</span>
                                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-4 line-clamp-1 group-hover:text-rose-500 transition-colors uppercase">{item.title}</h3>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                                <span className="font-black text-2xl text-gray-900 dark:text-white">৳{item.price}</span>
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                    <FiStar className="text-amber-500" /> {item.rating || '5.0'}
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

            <Footer />
        </div>
    );
}
