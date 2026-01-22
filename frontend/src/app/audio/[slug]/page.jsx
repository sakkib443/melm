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
    FiMusic,
    FiClock,
    FiVolume2,
    FiX,
    FiMaximize2,
    FiExternalLink,
    FiActivity,
    FiDisc,
    FiEye,
    FiInfo
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { selectIsAuthenticated } from "@/redux/features/authSlice";
import { audioService, downloadService } from "@/services/api";
import toast from "react-hot-toast";

export default function AudioDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const dispatch = useDispatch();
    const audioRef = useRef(null);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [audio, setAudio] = useState(null);
    const [relatedAudios, setRelatedAudios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [hasAccess, setHasAccess] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [viewCount, setViewCount] = useState(0);

    useEffect(() => {
        const fetchAudioData = async () => {
            if (!params.slug) return;
            setLoading(true);
            try {
                const res = await audioService.getById(params.slug);
                if (res?.data) {
                    setAudio(res.data);
                    setLikeCount(res.data.likes || 0);
                    setViewCount(res.data.views || 0);

                    // Check liked (mock for now or from localStorage)
                    const likedItems = JSON.parse(localStorage.getItem('likedAudio') || '[]');
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

                    // Fetch related
                    try {
                        const relatedRes = await audioService.getAll(`?category=${res.data.category}&limit=3`);
                        if (relatedRes?.success) {
                            setRelatedAudios(relatedRes.data.filter(i => i._id !== res.data._id));
                        }
                    } catch (e) { console.error(e); }
                }
            } catch (error) {
                console.error("Error fetching audio:", error);
                toast.error(language === 'bn' ? 'অডিও লোড করতে ব্যর্থ হয়েছে' : 'Failed to load audio');
            } finally {
                setLoading(false);
            }
        };

        fetchAudioData();
    }, [params.slug, language, isAuthenticated]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            setAudioDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e) => {
        if (audioRef.current && audioRef.current.duration) {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = percent * audioRef.current.duration;
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddToCart = () => {
        if (!audio) return;
        dispatch(addToCart({
            _id: audio._id,
            title: audio.title,
            price: audio.salePrice || audio.price,
            originalPrice: audio.price,
            thumbnail: audio.thumbnail,
            type: 'audio',
            slug: audio.slug,
        }));
        toast.success(language === 'bn' ? '🛒 কার্টে যোগ করা হয়েছে!' : '🛒 Added to cart!');
        router.push('/cart');
    };

    const handleBuyNow = () => {
        if (!audio) return;
        dispatch(addToCart({
            _id: audio._id,
            title: audio.title,
            price: audio.salePrice || audio.price,
            originalPrice: audio.price,
            thumbnail: audio.thumbnail,
            type: 'audio',
            slug: audio.slug,
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

    if (!audio) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="pt-32 container px-6 mx-auto text-center">
                    <FiInfo className="w-24 h-24 mx-auto text-gray-200 mb-6" />
                    <h1 className="text-3xl font-bold mb-4">{language === 'bn' ? 'অডিও পাওয়া যায়নি' : 'Audio Not Found'}</h1>
                    <Link href="/audio" className="text-primary font-bold">Browse Audio Library</Link>
                </div>
            </div>
        );
    }

    const discount = audio.price > 0 && audio.salePrice ? Math.round(((audio.price - audio.salePrice) / audio.price) * 100) : 0;
    const progress = audioDuration ? (currentTime / audioDuration) * 100 : 0;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />
            <audio ref={audioRef} src={audio.previewAudio} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />

            {/* Breadcrumb */}
            <div className="pt-28 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary transition-colors">{language === 'bn' ? 'হোম' : 'Home'}</Link>
                        <span>/</span>
                        <Link href="/audio" className="hover:text-primary transition-colors">{language === 'bn' ? 'অডিও' : 'Audio'}</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">{audio.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-8 lg:py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Left - Player & Cover */}
                        <div className="lg:col-span-7 space-y-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-square md:aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-violet-600 to-indigo-900 shadow-2xl shadow-indigo-500/20 group"
                            >
                                <img src={audio.thumbnail} alt={audio.title} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" />

                                {/* Pulse Effect when Playing */}
                                {isPlaying && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-64 h-64 bg-primary/20 rounded-full animate-ping opacity-20"></div>
                                    </div>
                                )}

                                {/* Main Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.button
                                        onClick={togglePlay}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl group/play"
                                    >
                                        {isPlaying ? <FiPause className="w-10 h-10" /> : <FiPlay className="w-10 h-10 ml-1.5" />}
                                    </motion.button>
                                </div>

                                {/* Modern Progress Bar Container */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black/80 to-transparent">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-white font-mono text-sm">{formatTime(currentTime)}</span>
                                        <div
                                            className="flex-1 h-3 bg-white/20 rounded-full cursor-pointer relative group/progress"
                                            onClick={handleSeek}
                                        >
                                            <div className="absolute inset-0 bg-white/10 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full transition-all duration-300 relative" style={{ width: `${progress}%` }}>
                                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-white/60 font-mono text-sm">{formatTime(audioDuration || audio.duration)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-white/80 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                                            <FiActivity className="animate-pulse text-primary" />
                                            {isPlaying ? 'Now Playing Preview' : 'Preview Available'}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <FiVolume2 className="text-white/60" />
                                            <div className="w-20 h-1 bg-white/20 rounded-full">
                                                <div className="w-3/4 h-full bg-white/60 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Tech Specs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiClock className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Duration</p>
                                    <p className="font-black text-gray-900 dark:text-white uppercase">{formatTime(audio.duration)}</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiActivity className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">BPM</p>
                                    <p className="font-black text-gray-900 dark:text-white uppercase">{audio.bpm || '120'}</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiDisc className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Key</p>
                                    <p className="font-black text-gray-900 dark:text-white uppercase">{audio.key || 'C MIN'}</p>
                                </div>
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                                    <FiMusic className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Vocal</p>
                                    <p className="font-black text-gray-900 dark:text-white uppercase">{audio.vocals ? 'YES' : 'NO'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Content & Purchase */}
                        <div className="lg:col-span-5 space-y-8">
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="flex flex-wrap items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">{audio.category}</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{audio.genre || 'Epic'} Genre</span>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight uppercase font-heading">
                                    {audio.title}
                                </h1>

                                <div className="grid grid-cols-4 gap-2 mb-8 p-1.5 bg-gray-50 dark:bg-gray-900 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
                                    <div className="p-3 text-center">
                                        <FiStar className="w-5 h-5 mx-auto mb-1.5 text-amber-500 fill-amber-500" />
                                        <span className="block text-sm font-black">{audio.rating || '5.0'}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">{audio.reviewCount || 0} Reviews</span>
                                    </div>
                                    <div className="p-3 text-center border-l dark:border-gray-800">
                                        <FiEye className="w-5 h-5 mx-auto mb-1.5 text-blue-500" />
                                        <span className="block text-sm font-black">{viewCount.toLocaleString()}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Views</span>
                                    </div>
                                    <div className="p-3 text-center border-l dark:border-gray-800">
                                        <FiDownload className="w-5 h-5 mx-auto mb-1.5 text-green-500" />
                                        <span className="block text-sm font-black">{audio.downloads?.toLocaleString() || 0}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Sales</span>
                                    </div>
                                    <div className="p-3 text-center border-l dark:border-gray-800">
                                        <FiHeart className="w-5 h-5 mx-auto mb-1.5 text-red-500" />
                                        <span className="block text-sm font-black">{likeCount.toLocaleString()}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Likes</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">{audio.description}</p>

                                {/* Features List */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-910 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                            <FiCheck className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-bold text-sm">High Quality HQ Audio</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-910 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                            <FiCheck className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <span className="text-gray-900 dark:text-white font-bold text-sm">Full Commercial License</span>
                                    </div>
                                </div>

                                {/* Purchase Actions */}
                                <div className="sticky bottom-0 lg:static bg-white/90 dark:bg-gray-950/90 backdrop-blur-md pt-8 lg:pt-0 z-30">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Single Asset License</p>
                                            <div className="flex items-baseline gap-3">
                                                {audio.salePrice ? (
                                                    <>
                                                        <span className="text-4xl lg:text-5xl font-black text-primary font-heading">৳{audio.salePrice.toLocaleString()}</span>
                                                        <span className="text-xl text-gray-400 line-through">৳{audio.price.toLocaleString()}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white font-heading">৳{audio.price?.toLocaleString() || 0}</span>
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
                                                {language === 'bn' ? 'ডাউনলোড শুরু করুন' : 'Download Full Track'}
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
                                                    {language === 'bn' ? 'এখনই কিনুন' : 'Complete Purchase'}
                                                </motion.button>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <motion.button
                                                        onClick={handleAddToCart}
                                                        className="h-16 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all uppercase text-sm tracking-widest"
                                                    >
                                                        {language === 'bn' ? 'কার্টে যোগ' : 'Add to Cart'}
                                                    </motion.button>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <motion.button className="h-16 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-2xl hover:text-red-500 transition-all">
                                                            <FiHeart className="w-6 h-6" />
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
                    {relatedAudios.length > 0 && (
                        <div className="mt-24 pt-20 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase font-heading">{language === 'bn' ? 'সম্পর্কিত অডিও' : 'You May Also Need'}</h2>
                                    <div className="h-1.5 w-20 bg-primary mt-3 rounded-full" />
                                </div>
                                <Link href="/audio" className="group flex items-center gap-2 font-black text-primary uppercase text-sm tracking-widest">
                                    {language === 'bn' ? 'সব দেখুন' : 'Explore Library'}
                                    <FiExternalLink className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedAudios.map((item) => (
                                    <Link
                                        key={item._id}
                                        href={`/audio/${item.slug}`}
                                        className="group bg-white dark:bg-gray-910 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500"
                                    >
                                        <div className="aspect-square overflow-hidden relative">
                                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60" />
                                            <div className="absolute inset-0 bg-indigo-900/40 group-hover:bg-indigo-900/20 transition-all"></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center shadow-xl opacity-80 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
                                                    <FiPlay className="w-6 h-6 ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-2 block">{item.category}</span>
                                            <h3 className="font-black text-xl text-gray-900 dark:text-white mb-4 line-clamp-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                                <span className="font-black text-2xl text-gray-900 dark:text-white">৳{item.price}</span>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                                    <FiClock className="w-4 h-4 text-primary" />
                                                    {formatTime(item.duration)}
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

            <Footer />
        </div>
    );
}
