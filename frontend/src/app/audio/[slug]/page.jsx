"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiArrowLeft, FiHeart, FiShoppingCart, FiShare2, FiDownload,
    FiStar, FiEye, FiPlay, FiPause, FiLoader, FiMusic, FiClock, FiVolume2
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { audioService, cartService } from "@/services/api";

// Mock audio data
const mockAudio = {
    _id: "1",
    title: "Cinematic Epic Trailer",
    slug: "cinematic-epic-trailer",
    description: "A powerful and emotional cinematic trailer music perfect for movie trailers, video games, and epic presentations. Features orchestral elements with modern electronic production for maximum impact.",
    category: "Music",
    type: "music",
    genre: "Cinematic",
    mood: ["Epic", "Powerful", "Emotional"],
    price: 599,
    salePrice: 399,
    thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
    previewAudio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: 180,
    bpm: 120,
    key: "C Minor",
    instruments: ["Orchestra", "Drums", "Synth", "Strings"],
    vocals: false,
    loopable: false,
    downloads: 890,
    views: 4200,
    likes: 256,
    rating: 4.9,
    reviewCount: 45,
    tags: ["cinematic", "epic", "trailer", "movie", "dramatic"],
    seller: { firstName: "Music", lastName: "Studio", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
    createdAt: "2024-01-10"
};

const relatedAudios = [
    { _id: "2", title: "Upbeat Corporate", slug: "upbeat-corporate", category: "Music", price: 299, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400", rating: 4.7, duration: 150 },
    { _id: "3", title: "Ambient Nature Sounds", slug: "ambient-nature", category: "Ambient", price: 199, salePrice: 99, thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400", rating: 4.8, duration: 240 },
    { _id: "4", title: "Electronic Dance Beat", slug: "electronic-dance", category: "Music", price: 499, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400", rating: 4.6, duration: 200 },
];

export default function AudioDetailsPage() {
    const params = useParams();
    const { language } = useLanguage();
    const audioRef = useRef(null);
    const [audio, setAudio] = useState(mockAudio);
    const [loading, setLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    useEffect(() => {
        const fetchAudio = async () => {
            try {
                setLoading(true);
                const res = await audioService.getById(params.slug);
                if (res.success && res.data) setAudio(res.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.slug) fetchAudio();
    }, [params.slug]);

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
        if (audioRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioRef.current.currentTime = percent * audioRef.current.duration;
        }
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({ productId: audio._id, productType: 'audio', price: audio.salePrice || audio.price, title: audio.title, image: audio.thumbnail });
            if (res.success) toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added to cart!');
        } catch (e) {
            toast.error(language === 'bn' ? 'লগইন করুন' : 'Please login first');
        } finally {
            setAddingToCart(false);
        }
    };

    const discount = audio.price > 0 && audio.salePrice ? Math.round(((audio.price - audio.salePrice) / audio.price) * 100) : 0;
    const progress = audioDuration ? (currentTime / audioDuration) * 100 : 0;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />
            <audio ref={audioRef} src={audio.previewAudio} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} />

            {/* Breadcrumb */}
            <div className="pt-24 pb-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <span>/</span>
                        <Link href="/audio" className="hover:text-primary">Audio</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white">{audio.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Left - Audio Player */}
                        <div className="space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600">
                                <img src={audio.thumbnail} alt={audio.title} className="w-full h-full object-cover opacity-60" />
                                {discount > 0 && <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">{discount}% OFF</div>}

                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button onClick={togglePlay} className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                                        {isPlaying ? <FiPause className="w-10 h-10 text-white" /> : <FiPlay className="w-10 h-10 text-white ml-1" />}
                                    </button>
                                </div>

                                {/* Waveform/Progress */}
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="h-2 bg-white/20 rounded-full cursor-pointer" onClick={handleSeek}>
                                        <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
                                    </div>
                                    <div className="flex justify-between mt-2 text-white text-sm">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(audioDuration || audio.duration)}</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Audio Details Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiClock className="w-5 h-5 mx-auto text-violet-500 mb-2" />
                                    <p className="text-xs text-gray-500 uppercase">Duration</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{formatTime(audio.duration)}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiMusic className="w-5 h-5 mx-auto text-violet-500 mb-2" />
                                    <p className="text-xs text-gray-500 uppercase">BPM</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{audio.bpm || 'N/A'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiVolume2 className="w-5 h-5 mx-auto text-violet-500 mb-2" />
                                    <p className="text-xs text-gray-500 uppercase">Key</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{audio.key || 'Various'}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiStar className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                                    <p className="text-xs text-gray-500 uppercase">Rating</p>
                                    <p className="font-bold text-gray-900 dark:text-white">{audio.rating}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Details */}
                        <div className="space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 text-xs font-bold uppercase rounded-full">{audio.type}</span>
                                    <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 text-xs font-bold uppercase rounded-full">{audio.genre}</span>
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{audio.title}</h1>

                                {audio.seller && (
                                    <div className="flex items-center gap-3 mb-6">
                                        <img src={audio.seller.avatar || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="text-sm text-gray-500">{language === 'bn' ? 'ক্রিয়েটর' : 'by'}</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{audio.seller.firstName} {audio.seller.lastName}</p>
                                        </div>
                                    </div>
                                )}

                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{audio.description}</p>

                                {/* Mood Tags */}
                                {audio.mood?.length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-sm text-gray-500 mb-2">{language === 'bn' ? 'মুড' : 'Mood'}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {audio.mood.map((m, i) => <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full">{m}</span>)}
                                        </div>
                                    </div>
                                )}

                                {/* Instruments */}
                                {audio.instruments?.length > 0 && (
                                    <div className="mb-6">
                                        <p className="text-sm text-gray-500 mb-2">{language === 'bn' ? 'ইন্সট্রুমেন্ট' : 'Instruments'}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {audio.instruments.map((i, idx) => <span key={idx} className="px-3 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-600 text-sm rounded-full">{i}</span>)}
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${audio.vocals ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {audio.vocals ? '✓ With Vocals' : '✗ No Vocals'}
                                    </span>
                                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${audio.loopable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {audio.loopable ? '✓ Loopable' : '✗ Not Loopable'}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1"><FiDownload className="w-4 h-4" />{audio.downloads} downloads</span>
                                    <span className="flex items-center gap-1"><FiEye className="w-4 h-4" />{audio.views} views</span>
                                    <span className="flex items-center gap-1"><FiHeart className="w-4 h-4" />{audio.likes} likes</span>
                                </div>

                                {/* Price & Actions */}
                                <div className="sticky bottom-0 bg-white dark:bg-gray-950 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-baseline gap-3">
                                            {discount > 0 ? (
                                                <>
                                                    <span className="text-3xl font-black text-primary">৳{audio.salePrice}</span>
                                                    <span className="text-xl text-gray-400 line-through">৳{audio.price}</span>
                                                </>
                                            ) : (
                                                <span className="text-3xl font-black text-gray-900 dark:text-white">৳{audio.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={handleAddToCart} disabled={addingToCart} className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white font-bold text-lg rounded-full transition-all disabled:opacity-50">
                                            {addingToCart ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiShoppingCart className="w-5 h-5" />}
                                            {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                                        </button>
                                        <button className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 hover:text-red-500 transition-all"><FiHeart className="w-5 h-5" /></button>
                                        <button className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-all"><FiShare2 className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{language === 'bn' ? 'সম্পর্কিত অডিও' : 'Related Audio'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedAudios.map((a) => (
                            <Link key={a._id} href={`/audio/${a.slug}`} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-violet-500/50 transition-all">
                                <div className="aspect-square overflow-hidden bg-gradient-to-br from-violet-500 to-purple-600 relative">
                                    <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"><FiPlay className="w-6 h-6 text-white" /></div></div>
                                    <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/50 text-white text-xs rounded">{formatTime(a.duration)}</div>
                                </div>
                                <div className="p-5">
                                    <span className="text-xs font-bold uppercase text-violet-500">{a.category}</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white mt-2 group-hover:text-violet-500 transition-colors">{a.title}</h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <div>{a.salePrice ? <><span className="font-bold text-primary">৳{a.salePrice}</span><span className="text-sm text-gray-400 line-through ml-1">৳{a.price}</span></> : <span className="font-bold text-gray-900 dark:text-white">৳{a.price}</span>}</div>
                                        <span className="flex items-center gap-1 text-sm text-gray-500"><FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{a.rating}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
