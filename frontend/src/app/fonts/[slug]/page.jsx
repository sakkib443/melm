"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiArrowLeft, FiHeart, FiShoppingCart, FiShare2, FiDownload,
    FiStar, FiEye, FiCheck, FiLoader, FiType, FiCopy
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { fontService, cartService } from "@/services/api";

// Mock font data for demo
const mockFont = {
    _id: "1",
    title: "Bangla Modern Sans",
    slug: "bangla-modern-sans",
    description: "A modern sans-serif font perfect for Bangla typography projects. This beautifully crafted typeface combines clean lines with excellent readability, making it ideal for both headlines and body text. Features include multiple weights, extensive character support, and optimized kerning for professional results.",
    category: "Sans Serif",
    price: 499,
    salePrice: 299,
    thumbnail: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=1200",
    previewImages: [
        "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800",
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800"
    ],
    downloads: 1250,
    views: 5600,
    likes: 340,
    rating: 4.8,
    reviewCount: 89,
    fontFamily: "Bangla Modern Sans",
    weights: ["Light", "Regular", "Medium", "Bold", "Black"],
    styles: ["Normal", "Italic"],
    glyphs: 450,
    languages: ["English", "Bangla", "Hindi"],
    webFont: true,
    variableFont: false,
    tags: ["bangla", "modern", "sans-serif", "clean", "professional"],
    seller: { firstName: "Abu", lastName: "Sayeed", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    createdAt: "2024-01-15"
};

const relatedFonts = [
    { _id: "2", title: "Creative Script Pro", slug: "creative-script-pro", category: "Script", price: 699, salePrice: 499, thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400", rating: 4.9, downloads: 890 },
    { _id: "3", title: "Display Bold XL", slug: "display-bold-xl", category: "Display", price: 399, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=400", rating: 4.7, downloads: 2100 },
    { _id: "4", title: "Classic Serif Regular", slug: "classic-serif-regular", category: "Serif", price: 299, salePrice: 199, thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400", rating: 4.6, downloads: 1567 },
];

export default function FontDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const [font, setFont] = useState(mockFont);
    const [loading, setLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [previewText, setPreviewText] = useState("The quick brown fox jumps over the lazy dog");
    const [previewSize, setPreviewSize] = useState(48);

    useEffect(() => {
        const fetchFont = async () => {
            try {
                setLoading(true);
                const res = await fontService.getById(params.slug);
                if (res.success && res.data) {
                    setFont(res.data);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.slug) fetchFont();
    }, [params.slug]);

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({
                productId: font._id,
                productType: 'font',
                price: font.salePrice || font.price,
                title: font.title,
                image: font.thumbnail
            });
            if (res.success) {
                toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added to cart!');
            }
        } catch (e) {
            toast.error(language === 'bn' ? 'লগইন করুন' : 'Please login first');
        } finally {
            setAddingToCart(false);
        }
    };

    const discount = font.price > 0 && font.salePrice ? Math.round(((font.price - font.salePrice) / font.price) * 100) : 0;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Breadcrumb */}
            <div className="pt-24 pb-6 bg-gray-50 dark:bg-gray-900/50">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <span>/</span>
                        <Link href="/fonts" className="hover:text-primary">Fonts</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white">{font.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Left - Images */}
                        <div className="space-y-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img src={font.previewImages?.[activeImage] || font.thumbnail} alt={font.title} className="w-full h-full object-cover" />
                                {discount > 0 && (
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">{discount}% OFF</div>
                                )}
                            </motion.div>

                            {/* Thumbnails */}
                            {font.previewImages?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {font.previewImages.map((img, i) => (
                                        <button key={i} onClick={() => setActiveImage(i)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Font Preview */}
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">{language === 'bn' ? 'ফন্ট প্রিভিউ' : 'Font Preview'}</h3>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        value={previewText}
                                        onChange={(e) => setPreviewText(e.target.value)}
                                        placeholder="Type to preview..."
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500">Size:</span>
                                        <input
                                            type="range"
                                            min="16"
                                            max="96"
                                            value={previewSize}
                                            onChange={(e) => setPreviewSize(Number(e.target.value))}
                                            className="flex-1"
                                        />
                                        <span className="text-sm font-bold w-12">{previewSize}px</span>
                                    </div>
                                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl min-h-[120px] flex items-center justify-center">
                                        <p style={{ fontSize: previewSize, fontFamily: font.fontFamily }} className="text-gray-900 dark:text-white text-center break-words">
                                            {previewText || "Aa Bb Cc"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right - Details */}
                        <div className="space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                {/* Category & Stats */}
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase rounded-full">{font.category}</span>
                                    <span className="flex items-center gap-1 text-sm text-gray-500"><FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />{font.rating} ({font.reviewCount})</span>
                                    <span className="flex items-center gap-1 text-sm text-gray-500"><FiDownload className="w-4 h-4" />{font.downloads}</span>
                                    <span className="flex items-center gap-1 text-sm text-gray-500"><FiEye className="w-4 h-4" />{font.views}</span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{font.title}</h1>

                                {/* Seller */}
                                {font.seller && (
                                    <div className="flex items-center gap-3 mb-6">
                                        <img src={font.seller.avatar || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="text-sm text-gray-500">{language === 'bn' ? 'ডিজাইনার' : 'by'}</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{font.seller.firstName} {font.seller.lastName}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{font.description}</p>

                                {/* Font Info */}
                                <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl mb-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">{language === 'bn' ? 'ওয়েট' : 'Weights'}</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{font.weights?.length || 1} Weights</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">{language === 'bn' ? 'স্টাইল' : 'Styles'}</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{font.styles?.length || 1} Styles</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">{language === 'bn' ? 'গ্লিফস' : 'Glyphs'}</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{font.glyphs || 200}+</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">{language === 'bn' ? 'ভাষা' : 'Languages'}</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{font.languages?.length || 1} Languages</p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {font.webFont && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 text-xs font-bold rounded-full">
                                            <FiCheck className="w-3.5 h-3.5" /> Web Font Ready
                                        </span>
                                    )}
                                    {font.variableFont && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-xs font-bold rounded-full">
                                            <FiCheck className="w-3.5 h-3.5" /> Variable Font
                                        </span>
                                    )}
                                </div>

                                {/* Price & Actions */}
                                <div className="sticky bottom-0 bg-white dark:bg-gray-950 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-baseline gap-3">
                                            {discount > 0 ? (
                                                <>
                                                    <span className="text-3xl font-black text-primary">৳{font.salePrice}</span>
                                                    <span className="text-xl text-gray-400 line-through">৳{font.price}</span>
                                                </>
                                            ) : (
                                                <span className="text-3xl font-black text-gray-900 dark:text-white">৳{font.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={handleAddToCart} disabled={addingToCart} className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black font-bold text-lg rounded-full hover:bg-primary/90 transition-all disabled:opacity-50">
                                            {addingToCart ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiShoppingCart className="w-5 h-5" />}
                                            {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                                        </button>
                                        <button className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 hover:text-red-500 transition-all">
                                            <FiHeart className="w-5 h-5" />
                                        </button>
                                        <button className="w-14 h-14 flex items-center justify-center rounded-full border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary transition-all">
                                            <FiShare2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Fonts */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{language === 'bn' ? 'সম্পর্কিত ফন্ট' : 'Related Fonts'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedFonts.map((f) => (
                            <Link key={f._id} href={`/fonts/${f.slug}`} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all">
                                <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img src={f.thumbnail} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-5">
                                    <span className="text-xs font-bold uppercase text-primary">{f.category}</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white mt-2 group-hover:text-primary transition-colors">{f.title}</h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            {f.salePrice ? (
                                                <><span className="font-bold text-primary">৳{f.salePrice}</span><span className="text-sm text-gray-400 line-through">৳{f.price}</span></>
                                            ) : (
                                                <span className="font-bold text-gray-900 dark:text-white">৳{f.price}</span>
                                            )}
                                        </div>
                                        <span className="flex items-center gap-1 text-sm text-gray-500"><FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{f.rating}</span>
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
