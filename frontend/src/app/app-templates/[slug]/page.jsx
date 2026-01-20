"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiArrowLeft, FiHeart, FiShoppingCart, FiShare2, FiDownload,
    FiStar, FiEye, FiLoader, FiSmartphone, FiLayers, FiServer, FiCheck, FiExternalLink, FiCode
} from "react-icons/fi";
import { SiFlutter, SiReact, SiSwift, SiKotlin, SiIonic } from "react-icons/si";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { appTemplateService, cartService } from "@/services/api";

// Mock data
const mockApp = {
    _id: "1", title: "E-Commerce Flutter App Template", slug: "ecommerce-flutter-app",
    description: "A complete e-commerce mobile app template built with Flutter. Features include product listing, cart, checkout, user authentication, order tracking, and admin panel. Clean code with full documentation.",
    category: "E-Commerce", type: "ecommerce",
    price: 1499, salePrice: 999,
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200",
    previewImages: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800", "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800", "https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800"],
    demoUrl: "https://example.com/demo",
    framework: ["flutter"],
    platforms: ["ios", "android"],
    screens: 50,
    backendIncluded: true, backendType: "Laravel + MySQL",
    apiDocumentation: true,
    features: ["User Authentication", "Push Notifications", "Payment Integration", "Admin Dashboard", "Multi-language Support"],
    whatIncluded: ["Flutter Source Code", "Laravel Backend", "API Documentation", "Video Tutorials", "6 Months Support"],
    downloads: 567, views: 4500, likes: 234, rating: 4.8, reviewCount: 56, version: "3.0",
    tags: ["flutter", "ecommerce", "mobile", "app", "ios", "android"],
    seller: { firstName: "App", lastName: "Developer", avatar: "https://randomuser.me/api/portraits/men/42.jpg" },
};

const relatedApps = [
    { _id: "2", title: "Food Delivery App", slug: "food-delivery", category: "Food Delivery", price: 1299, salePrice: 799, thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400", rating: 4.9, platforms: ["ios", "android"] },
    { _id: "3", title: "Social Media App UI", slug: "social-media-app", category: "Social", price: 899, salePrice: null, thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400", rating: 4.7, platforms: ["ios", "android"] },
    { _id: "4", title: "Fitness Tracker App", slug: "fitness-tracker", category: "Fitness", price: 999, salePrice: 599, thumbnail: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=400", rating: 4.8, platforms: ["ios", "android"] },
];

const frameworkIcons = { flutter: SiFlutter, "react-native": SiReact, swift: SiSwift, kotlin: SiKotlin, ionic: SiIonic };
const platformColors = { ios: "bg-gray-900 text-white", android: "bg-green-600 text-white", web: "bg-blue-600 text-white" };

export default function AppTemplateDetailsPage() {
    const params = useParams();
    const { language } = useLanguage();
    const [app, setApp] = useState(mockApp);
    const [loading, setLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchApp = async () => {
            try {
                setLoading(true);
                const res = await appTemplateService.getById(params.slug);
                if (res.success && res.data) setApp(res.data);
            } catch (error) { console.error("Error:", error); }
            finally { setLoading(false); }
        };
        if (params.slug) fetchApp();
    }, [params.slug]);

    const handleAddToCart = async () => {
        try {
            setAddingToCart(true);
            const res = await cartService.addToCart({ productId: app._id, productType: 'app-template', price: app.salePrice || app.price, title: app.title, image: app.thumbnail });
            if (res.success) toast.success(language === 'bn' ? 'কার্টে যুক্ত!' : 'Added to cart!');
        } catch (e) { toast.error(language === 'bn' ? 'লগইন করুন' : 'Please login first'); }
        finally { setAddingToCart(false); }
    };

    const discount = app.price > 0 && app.salePrice ? Math.round(((app.price - app.salePrice) / app.price) * 100) : 0;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Breadcrumb */}
            <div className="pt-24 pb-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary">Home</Link><span>/</span>
                        <Link href="/app-templates" className="hover:text-primary">App Templates</Link><span>/</span>
                        <span className="text-gray-900 dark:text-white">{app.title}</span>
                    </div>
                </div>
            </div>

            {/* Main */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left - Images */}
                        <div className="space-y-4">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <img src={app.previewImages?.[activeImage] || app.thumbnail} alt={app.title} className="w-full h-full object-cover" />
                                {discount > 0 && <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full">{discount}% OFF</div>}
                                <div className="absolute top-6 right-6 flex gap-2">
                                    {app.platforms?.map((p, i) => <span key={i} className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${platformColors[p]}`}>{p}</span>)}
                                </div>
                            </motion.div>
                            {app.previewImages?.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {app.previewImages.map((img, i) => (
                                        <button key={i} onClick={() => setActiveImage(i)} className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === i ? 'border-emerald-500' : 'border-transparent opacity-60'}`}>
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiLayers className="w-5 h-5 mx-auto text-emerald-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{app.screens}+</p>
                                    <p className="text-xs text-gray-500">Screens</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiDownload className="w-5 h-5 mx-auto text-emerald-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{app.downloads}</p>
                                    <p className="text-xs text-gray-500">Downloads</p>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiStar className="w-5 h-5 mx-auto text-amber-500 mb-2" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{app.rating}</p>
                                    <p className="text-xs text-gray-500">{app.reviewCount} Reviews</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Details */}
                        <div className="space-y-6">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <div className="flex flex-wrap items-center gap-3 mb-4">
                                    <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 text-xs font-bold uppercase rounded-full">{app.type}</span>
                                    <span className="text-sm text-gray-500">v{app.version}</span>
                                </div>

                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{app.title}</h1>

                                {app.seller && (
                                    <div className="flex items-center gap-3 mb-6">
                                        <img src={app.seller.avatar || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="text-sm text-gray-500">{language === 'bn' ? 'ডেভেলপার' : 'by'}</p>
                                            <p className="font-medium text-gray-900 dark:text-white">{app.seller.firstName} {app.seller.lastName}</p>
                                        </div>
                                    </div>
                                )}

                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{app.description}</p>

                                {/* Framework */}
                                <div className="mb-6">
                                    <p className="text-sm text-gray-500 mb-3">{language === 'bn' ? 'ফ্রেমওয়ার্ক' : 'Framework'}</p>
                                    <div className="flex flex-wrap gap-3">
                                        {app.framework?.map((fw, i) => {
                                            const Icon = frameworkIcons[fw] || FiCode;
                                            return <div key={i} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl"><Icon className="w-5 h-5 text-emerald-500" /><span className="capitalize font-medium">{fw.replace('-', ' ')}</span></div>;
                                        })}
                                    </div>
                                </div>

                                {/* Backend */}
                                {app.backendIncluded && (
                                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl mb-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FiServer className="w-5 h-5 text-emerald-600" />
                                            <p className="font-bold text-emerald-700 dark:text-emerald-400">{language === 'bn' ? 'ব্যাকেন্ড সহ' : 'Backend Included'}</p>
                                        </div>
                                        <p className="text-sm text-emerald-600 dark:text-emerald-300">{app.backendType}</p>
                                    </div>
                                )}

                                {/* Features */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${app.backendIncluded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{app.backendIncluded ? <FiCheck /> : '✗'} Backend</span>
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full ${app.apiDocumentation ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{app.apiDocumentation ? <FiCheck /> : '✗'} API Docs</span>
                                </div>

                                {/* What's Included */}
                                {app.whatIncluded?.length > 0 && (
                                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl mb-6">
                                        <p className="font-bold text-gray-900 dark:text-white mb-3">{language === 'bn' ? 'কি কি আছে' : "What's Included"}</p>
                                        <ul className="space-y-2">
                                            {app.whatIncluded.map((item, i) => <li key={i} className="flex items-center gap-2 text-gray-600 dark:text-gray-400"><FiCheck className="w-4 h-4 text-green-500" />{item}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Demo */}
                                {app.demoUrl && (
                                    <a href={app.demoUrl} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 w-full py-3 border-2 border-emerald-500 text-emerald-500 font-bold rounded-full hover:bg-emerald-500 hover:text-white transition-all mb-6">
                                        <FiExternalLink className="w-5 h-5" /> {language === 'bn' ? 'ডেমো দেখুন' : 'View Live Demo'}
                                    </a>
                                )}

                                {/* Price */}
                                <div className="sticky bottom-0 bg-white dark:bg-gray-950 pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-baseline gap-3 mb-4">
                                        {discount > 0 ? <><span className="text-3xl font-black text-primary">৳{app.salePrice}</span><span className="text-xl text-gray-400 line-through">৳{app.price}</span></> : <span className="text-3xl font-black text-gray-900 dark:text-white">৳{app.price}</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={handleAddToCart} disabled={addingToCart} className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-full transition-all disabled:opacity-50">
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
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{language === 'bn' ? 'সম্পর্কিত অ্যাপ' : 'Related Apps'}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedApps.map((a) => (
                            <Link key={a._id} href={`/app-templates/${a.slug}`} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-emerald-500/50 transition-all">
                                <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                                    <img src={a.thumbnail} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3 flex gap-1">
                                        {a.platforms?.map((p, i) => <span key={i} className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold uppercase rounded-full ${platformColors[p]}`}>{p[0]}</span>)}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <span className="text-xs font-bold uppercase text-emerald-500">{a.category}</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white mt-2 group-hover:text-emerald-500 transition-colors">{a.title}</h3>
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
