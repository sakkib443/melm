"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiArrowLeft, FiHeart, FiShoppingCart, FiShare2, FiDownload,
    FiStar, FiEye, FiLoader, FiPlay, FiPause, FiCheck, FiMonitor, FiClock
} from "react-icons/fi";
import { SiAdobeaftereffects, SiAdobepremierepro, SiDavinciresolve } from "react-icons/si";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { videoTemplateService, cartService } from "@/services/api";

// Mock data
const mockVideo = {
    _id: "1", title: "Epic Logo Reveal Animation", slug: "epic-logo-reveal",
    description: "A stunning logo reveal animation with cinematic particles and light effects. Perfect for intros, brand reveals, and professional presentations. Easy to customize with your own logo.",
    category: "Logo Reveal", type: "logo-reveal",
    price: 799, salePrice: 499,
    thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200",
    previewVideo: "https://sample-videos.com/zip/10mb.mp4",
    previewImages: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800"],
    software: ["after-effects", "premiere-pro"],
    softwareVersion: "CC 2020+",
    resolution: { width: 1920, height: 1080, label: "1080p Full HD" },
    frameRate: 30, duration: 15,
    pluginsRequired: ["Optical Flares", "Trapcode Particular"],
    fontsIncluded: true, musicIncluded: false, tutorialIncluded: true,
    features: ["4K Ready", "No Plugins Required Version", "Easy Color Control", "Video Tutorial"],
    whatIncluded: ["After Effects Project", "Premiere Pro Compatible", "Video Tutorial", "Help Documentation"],
    downloads: 1250, views: 8900, likes: 567, rating: 4.9, reviewCount: 89, version: "2.1",
    tags: ["logo", "intro", "reveal", "animation", "cinematic"],
    seller: { firstName: "Motion", lastName: "Master", avatar: "https://randomuser.me/api/portraits/men/55.jpg" },
};

const relatedVideos = [
    { _id: "2", title: "Slideshow Memories", slug: "slideshow-memories", category: "Slideshow", price: 599, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400", rating: 4.8, duration: 60 },
    { _id: "3", title: "Social Media Pack", slug: "social-media-pack", category: "Social Media", price: 399, salePrice: 249, thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400", rating: 4.7, duration: 30 },
    { _id: "4", title: "Cinematic Opener", slug: "cinematic-opener", category: "Intro", price: 699, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400", rating: 4.9, duration: 20 },
];

const softwareIcons = { "after-effects": SiAdobeaftereffects, "premiere-pro": SiAdobepremierepro, "davinci-resolve": SiDavinciresolve };

export default function VideoTemplateDetailsPage() {
    const params = useParams();
    const { language } = useLanguage();
    const videoRef = useRef(null);
    const [video, setVideo] = useState(mockVideo);
    const [loading, setLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                setLoading(true);
                const res = await videoTemplateService.getById(params.slug);
                if (res.success && res.data) setVideo(res.data);
            } catch (error) { console.error("Error:", error); }
            finally { setLoading(false); }
        };
        if (params.slug) fetchVideo();
    }, [params.slug]);

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({ productId: video._id, productType: 'video-template', price: video.salePrice || video.price, title: video.title, image: video.thumbnail });
            if (res.success) toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added to cart!');
        } catch (e) { toast.error(language === 'bn' ? 'লগইন করুন' : 'Please login first'); }
        finally { setAddingToCart(false); }
    };

    const discount = video.price > 0 && video.salePrice ? Math.round(((video.price - video.salePrice) / video.price) * 100) : 0;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Breadcrumb */}
            <div className="pt-24 pb-6 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
                        <Link href="/video-templates" className="hover:text-primary">Video Templates</Link><span>/</span>
                        <span className="text-gray-900 dark:text-white">{video.title}</span>
                    </div>
                </div>
            </div>

            {/* Main */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left - Video Preview */}
                        <div className="space-y-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80" />
                                {discount > 0 && <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">{discount}% OFF</div>}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all">
                                        <FiPlay className="w-8 h-8 text-white ml-1" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 text-white text-sm rounded-full">
                                    <FiClock className="w-4 h-4" /> {video.duration}s
                                </div>
                            </motion.div>

                            {/* Tech Specs */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiMonitor className="w-5 h-5 mx-auto text-rose-500 mb-2" />
                                    <p className="font-bold text-gray-900 dark:text-white">{video.resolution?.label}</p>
                                    <p className="text-xs text-gray-500">{video.resolution?.width}×{video.resolution?.height}</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiPlay className="w-5 h-5 mx-auto text-rose-500 mb-2" />
                                    <p className="font-bold text-gray-900 dark:text-white">{video.frameRate} FPS</p>
                                    <p className="text-xs text-gray-500">Frame Rate</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiClock className="w-5 h-5 mx-auto text-rose-500 mb-2" />
                                    <p className="font-bold text-gray-900 dark:text-white">{video.duration}s</p>
                                    <p className="text-xs text-gray-500">Duration</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Details */}
                        <div className="space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="px-3 py-1.5 bg-rose-100 dark:bg-rose-900/30 text-rose-600 text-xs font-bold uppercase rounded-full">{video.type}</span>
                                    <span className="flex items-center gap-1 text-sm text-gray-500"><FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />{video.rating} ({video.reviewCount})</span>
                                    <span className="text-sm text-gray-500">v{video.version}</span>
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{video.title}</h1>

                                {video.seller && (
                                    <div className="flex items-center gap-3 mb-6">
                                        <img src={video.seller.avatar || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="text-sm text-gray-500">{language === 'bn' ? 'ক্রিয়েটর' : 'by'}</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{video.seller.firstName} {video.seller.lastName}</p>
                                        </div>
                                    </div>
                                )}

                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{video.description}</p>

                                {/* Software */}
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-3">{language === 'bn' ? 'সফটওয়্যার' : 'Software Required'}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {video.software?.map((sw, i) => {
                                            const Icon = softwareIcons[sw] || FiPlay;
                                            return <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl"><Icon className="w-5 h-5 text-rose-500" /><span className="capitalize font-medium">{sw.replace('-', ' ')}</span></div>;
                                        })}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Version: {video.softwareVersion}</p>
                                </div>

                                {/* Plugins */}
                                {video.pluginsRequired?.length > 0 && (
                                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl mb-6">
                                        <p className="font-bold text-amber-700 dark:text-amber-400 mb-2">{language === 'bn' ? 'প্লাগইন প্রয়োজন' : 'Plugins Required'}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {video.pluginsRequired.map((p, i) => <span key={i} className="px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-sm rounded-full">{p}</span>)}
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${video.fontsIncluded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{video.fontsIncluded ? <FiCheck /> : '✗'} Fonts Included</span>
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${video.musicIncluded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{video.musicIncluded ? <FiCheck /> : '✗'} Music Included</span>
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${video.tutorialIncluded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{video.tutorialIncluded ? <FiCheck /> : '✗'} Tutorial Included</span>
                                </div>

                                {/* Price */}
                                <div className="sticky bottom-0 bg-white dark:bg-gray-950 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-baseline gap-3 mb-4">
                                        {discount > 0 ? <><span className="text-3xl font-black text-primary">৳{video.salePrice}</span><span className="text-xl text-gray-400 line-through">৳{video.price}</span></> : <span className="text-3xl font-black text-gray-900 dark:text-white">৳{video.price}</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={handleAddToCart} disabled={addingToCart} className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-lg rounded-full transition-all disabled:opacity-50">
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{language === 'bn' ? 'সম্পর্কিত ভিডিও' : 'Related Templates'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedVideos.map((v) => (
                            <Link key={v._id} href={`/video-templates/${v.slug}`} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-rose-500/50 transition-all">
                                <div className="aspect-video overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 relative">
                                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 flex items-center justify-center"><div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"><FiPlay className="w-5 h-5 text-white" /></div></div>
                                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 text-white text-xs rounded">{v.duration}s</div>
                                </div>
                                <div className="p-5">
                                    <span className="text-xs font-bold uppercase text-rose-500">{v.category}</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white mt-2 group-hover:text-rose-500 transition-colors">{v.title}</h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <div>{v.salePrice ? <><span className="font-bold text-primary">৳{v.salePrice}</span><span className="text-sm text-gray-400 line-through ml-1">৳{v.price}</span></> : <span className="font-bold text-gray-900 dark:text-white">৳{v.price}</span>}</div>
                                        <span className="flex items-center gap-1 text-sm text-gray-500"><FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{v.rating}</span>
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
