"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiArrowLeft, FiHeart, FiShoppingCart, FiShare2, FiDownload, FiX,
    FiStar, FiEye, FiLoader, FiImage, FiMaximize2, FiZoomIn, FiCheck
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { photoService, cartService } from "@/services/api";

// Mock photo data
const mockPhoto = {
    _id: "1",
    title: "Mountain Sunrise Landscape",
    slug: "mountain-sunrise-landscape",
    description: "A stunning high-resolution photograph of a mountain landscape during sunrise. Perfect for websites, print materials, and desktop wallpapers. Features vibrant colors and sharp details captured with professional equipment.",
    category: "Nature",
    type: "photo",
    orientation: "horizontal",
    colors: ["#FF6B35", "#2E86AB", "#A23B72", "#F18F01"],
    price: 399,
    salePrice: 249,
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    previewImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600",
    watermarkedPreview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    resolution: { width: 6000, height: 4000 },
    dpi: 300,
    format: "JPEG",
    hasAlpha: false,
    modelRelease: false,
    propertyRelease: false,
    downloads: 1567,
    views: 8900,
    likes: 445,
    rating: 4.9,
    reviewCount: 78,
    tags: ["mountain", "sunrise", "landscape", "nature", "sky"],
    seller: { firstName: "Photo", lastName: "Master", avatar: "https://randomuser.me/api/portraits/women/32.jpg" },
    createdAt: "2024-01-05"
};

const relatedPhotos = [
    { _id: "2", title: "Ocean Sunset Beach", slug: "ocean-sunset", category: "Nature", price: 299, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", rating: 4.8 },
    { _id: "3", title: "City Night Lights", slug: "city-night", category: "Urban", price: 349, salePrice: 199, thumbnail: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400", rating: 4.7 },
    { _id: "4", title: "Forest Green Path", slug: "forest-path", category: "Nature", price: 249, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400", rating: 4.9 },
];

export default function PhotoDetailsPage() {
    const params = useParams();
    const { language } = useLanguage();
    const [photo, setPhoto] = useState(mockPhoto);
    const [loading, setLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    useEffect(() => {
        const fetchPhoto = async () => {
            try {
                setLoading(true);
                const res = await photoService.getById(params.slug);
                if (res.success && res.data) setPhoto(res.data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.slug) fetchPhoto();
    }, [params.slug]);

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({ productId: photo._id, productType: 'photo', price: photo.salePrice || photo.price, title: photo.title, image: photo.thumbnail });
            if (res.success) toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added to cart!');
        } catch (e) {
            toast.error(language === 'bn' ? 'লগইন করুন' : 'Please login first');
        } finally {
            setAddingToCart(false);
        }
    };

    const discount = photo.price > 0 && photo.salePrice ? Math.round(((photo.price - photo.salePrice) / photo.price) * 100) : 0;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                            <FiX className="w-6 h-6" />
                        </button>
                        <img src={photo.previewImage || photo.thumbnail} alt={photo.title} className="max-w-full max-h-full object-contain" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Breadcrumb */}
            <div className="pt-24 pb-6 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <span>/</span>
                        <Link href="/photos" className="hover:text-primary">Photos</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white">{photo.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Left - Image */}
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-zoom-in group"
                                onClick={() => setLightboxOpen(true)}
                            >
                                <img src={photo.watermarkedPreview || photo.thumbnail} alt={photo.title} className="w-full h-auto" />
                                {discount > 0 && <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">{discount}% OFF</div>}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <FiZoomIn className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Color Palette */}
                            {photo.colors?.length > 0 && (
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                                    <p className="text-sm text-gray-500 mb-3">{language === 'bn' ? 'কালার প্যালেট' : 'Color Palette'}</p>
                                    <div className="flex gap-2">
                                        {photo.colors.map((color, i) => (
                                            <div key={i} className="flex-1 aspect-square rounded-xl shadow-inner" style={{ backgroundColor: color }} title={color} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right - Details */}
                        <div className="space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 text-xs font-bold uppercase rounded-full">{photo.type}</span>
                                    <span className="px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-600 text-xs font-bold uppercase rounded-full">{photo.orientation}</span>
                                    <span className="flex items-center gap-1 text-sm text-gray-500"><FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />{photo.rating} ({photo.reviewCount})</span>
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{photo.title}</h1>

                                {photo.seller && (
                                    <div className="flex items-center gap-3 mb-6">
                                        <img src={photo.seller.avatar || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="text-sm text-gray-500">{language === 'bn' ? 'ফটোগ্রাফার' : 'by'}</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{photo.seller.firstName} {photo.seller.lastName}</p>
                                        </div>
                                    </div>
                                )}

                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{photo.description}</p>

                                {/* Technical Info */}
                                <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl mb-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">{language === 'bn' ? 'রেজোলিউশন' : 'Resolution'}</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{photo.resolution?.width} × {photo.resolution?.height}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">DPI</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{photo.dpi}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">{language === 'bn' ? 'ফরম্যাট' : 'Format'}</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{photo.format}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">{language === 'bn' ? 'অরিয়েন্টেশন' : 'Orientation'}</p>
                                        <p className="font-bold text-gray-900 dark:text-white capitalize">{photo.orientation}</p>
                                    </div>
                                </div>

                                {/* Releases */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${photo.modelRelease ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {photo.modelRelease ? <FiCheck className="w-3.5 h-3.5" /> : '✗'} Model Release
                                    </span>
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${photo.propertyRelease ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {photo.propertyRelease ? <FiCheck className="w-3.5 h-3.5" /> : '✗'} Property Release
                                    </span>
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${photo.hasAlpha ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {photo.hasAlpha ? <FiCheck className="w-3.5 h-3.5" /> : '✗'} Alpha Channel
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1"><FiDownload className="w-4 h-4" />{photo.downloads} downloads</span>
                                    <span className="flex items-center gap-1"><FiEye className="w-4 h-4" />{photo.views} views</span>
                                    <span className="flex items-center gap-1"><FiHeart className="w-4 h-4" />{photo.likes} likes</span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {photo.tags?.map((tag, i) => <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-full">#{tag}</span>)}
                                </div>

                                {/* Price & Actions */}
                                <div className="sticky bottom-0 bg-white dark:bg-gray-950 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-baseline gap-3">
                                            {discount > 0 ? (
                                                <>
                                                    <span className="text-3xl font-black text-primary">৳{photo.salePrice}</span>
                                                    <span className="text-xl text-gray-400 line-through">৳{photo.price}</span>
                                                </>
                                            ) : (
                                                <span className="text-3xl font-black text-gray-900 dark:text-white">৳{photo.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={handleAddToCart} disabled={addingToCart} className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg rounded-full transition-all disabled:opacity-50">
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{language === 'bn' ? 'সম্পর্কিত ফটো' : 'Related Photos'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedPhotos.map((p) => (
                            <Link key={p._id} href={`/photos/${p.slug}`} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-cyan-500/50 transition-all">
                                <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-5">
                                    <span className="text-xs font-bold uppercase text-cyan-500">{p.category}</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white mt-2 group-hover:text-cyan-500 transition-colors">{p.title}</h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <div>{p.salePrice ? <><span className="font-bold text-primary">৳{p.salePrice}</span><span className="text-sm text-gray-400 line-through ml-1">৳{p.price}</span></> : <span className="font-bold text-gray-900 dark:text-white">৳{p.price}</span>}</div>
                                        <span className="flex items-center gap-1 text-sm text-gray-500"><FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{p.rating}</span>
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
