"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
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
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import toast from "react-hot-toast";

// Mock data
const mockProduct = {
    _id: "1",
    title: "Premium Logo Template Bundle",
    titleBn: "প্রিমিয়াম লোগো টেমপ্লেট বান্ডল",
    slug: "premium-logo-template-bundle",
    description: "A comprehensive collection of 50+ professional logo templates perfect for businesses, startups, and personal branding. Each template is fully editable and comes in multiple formats.",
    descriptionBn: "ব্যবসা, স্টার্টআপ এবং ব্যক্তিগত ব্র্যান্ডিংয়ের জন্য উপযুক্ত ৫০+ প্রফেশনাল লোগো টেমপ্লেটের একটি ব্যাপক সংগ্রহ। প্রতিটি টেমপ্লেট সম্পূর্ণ এডিটেবল এবং একাধিক ফরম্যাটে আসে।",
    thumbnail: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200",
    images: [
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200",
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200",
        "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200",
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200",
    ],
    price: 2999,
    salePrice: 1999,
    category: "Logo",
    categoryBn: "লোগো",
    downloads: 234,
    rating: 4.8,
    reviews: 45,
    likes: 89,
    author: {
        name: "Creative Studio",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
        products: 45,
        sales: 1200,
    },
    formats: ["AI", "PSD", "EPS", "PNG", "SVG"],
    files: 52,
    size: "256 MB",
    features: [
        "50+ Logo Templates",
        "100% Editable",
        "Print Ready (300 DPI)",
        "Free Fonts Included",
        "Documentation",
        "24/7 Support",
    ],
    featuresBn: [
        "৫০+ লোগো টেমপ্লেট",
        "১০০% এডিটেবল",
        "প্রিন্ট রেডি (৩০০ DPI)",
        "ফ্রি ফন্ট অন্তর্ভুক্ত",
        "ডকুমেন্টেশন",
        "২৪/৭ সাপোর্ট",
    ],
    tags: ["logo", "branding", "business", "corporate", "minimal"],
};

const relatedProducts = [
    {
        _id: "2",
        title: "Social Media Graphics Pack",
        titleBn: "সোশ্যাল মিডিয়া গ্রাফিক্স প্যাক",
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
        price: 1499,
        rating: 4.9,
    },
    {
        _id: "3",
        title: "Business Card Collection",
        titleBn: "বিজনেস কার্ড কালেকশন",
        thumbnail: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800",
        price: 999,
        salePrice: 499,
        rating: 4.5,
    },
    {
        _id: "4",
        title: "Flyer Templates Bundle",
        titleBn: "ফ্লায়ার টেমপ্লেট বান্ডল",
        thumbnail: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800",
        price: 1999,
        rating: 4.7,
    },
    {
        _id: "5",
        title: "Resume Templates",
        titleBn: "রেজিউমে টেমপ্লেট",
        thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800",
        price: 799,
        salePrice: 599,
        rating: 4.9,
    },
];

export default function GraphicsDetailPage() {
    const params = useParams();
    const { language, t } = useLanguage();
    const dispatch = useDispatch();
    const [product, setProduct] = useState(mockProduct);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAddToCart = () => {
        dispatch(addToCart({
            _id: product._id,
            title: language === 'bn' ? product.titleBn : product.title,
            price: product.salePrice || product.price,
            thumbnail: product.thumbnail,
            type: 'graphics',
        }));
        toast.success(language === 'bn' ? 'কার্টে যোগ করা হয়েছে!' : 'Added to cart!');
    };

    const handleBuyNow = () => {
        handleAddToCart();
        window.location.href = '/cart';
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Breadcrumb */}
            <div className="pt-28 pb-4 border-b border-gray-100 dark:border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary">{language === 'bn' ? 'হোম' : 'Home'}</Link>
                        <span>/</span>
                        <Link href="/graphics" className="hover:text-primary">{language === 'bn' ? 'গ্রাফিক্স' : 'Graphics'}</Link>
                        <span>/</span>
                        <span className="text-gray-900 dark:text-white">{language === 'bn' ? product.titleBn : product.title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left: Images */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {/* Main Image */}
                            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-900 mb-4">
                                <img
                                    src={product.images[selectedImage]}
                                    alt={language === 'bn' ? product.titleBn : product.title}
                                    className="w-full h-full object-cover"
                                />
                                {product.salePrice && (
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-red-500 text-white font-bold rounded-full uppercase text-sm">
                                        {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                                    </div>
                                )}
                                <button className="absolute bottom-6 right-6 w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                                    <FiZoomIn className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-3">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-primary'
                                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Right: Details */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {/* Category */}
                            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider rounded-full mb-4">
                                {language === 'bn' ? product.categoryBn : product.category}
                            </span>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-tight mb-4">
                                {language === 'bn' ? product.titleBn : product.title}
                            </h1>

                            {/* Stats */}
                            <div className="flex items-center gap-6 mb-6">
                                <div className="flex items-center gap-1">
                                    <FiStar className="w-5 h-5 text-amber-500 fill-amber-500" />
                                    <span className="font-bold text-gray-900 dark:text-white">{product.rating}</span>
                                    <span className="text-gray-500">({product.reviews} {language === 'bn' ? 'রিভিউ' : 'reviews'})</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                    <FiDownload className="w-5 h-5" />
                                    <span>{product.downloads} {language === 'bn' ? 'ডাউনলোড' : 'downloads'}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-500">
                                    <FiHeart className="w-5 h-5" />
                                    <span>{product.likes}</span>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4 mb-8">
                                {product.salePrice ? (
                                    <>
                                        <span className="text-4xl font-bold text-primary font-heading">৳{product.salePrice}</span>
                                        <span className="text-2xl text-gray-400 line-through">৳{product.price}</span>
                                        <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-full">
                                            {language === 'bn' ? 'সেভ করুন' : 'Save'} ৳{product.price - product.salePrice}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white font-heading">৳{product.price}</span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-4 mb-8">
                                <button
                                    onClick={handleBuyNow}
                                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-primary text-black font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all"
                                >
                                    <FiShoppingCart className="w-5 h-5" />
                                    {language === 'bn' ? 'এখনই কিনুন' : 'Buy Now'}
                                </button>
                                <button
                                    onClick={handleAddToCart}
                                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold uppercase tracking-wider rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                >
                                    {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={() => setIsWishlisted(!isWishlisted)}
                                    className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${isWishlisted
                                        ? 'bg-red-500 border-red-500 text-white'
                                        : 'border-gray-300 dark:border-gray-700 hover:border-red-500 hover:text-red-500'
                                        }`}
                                >
                                    <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiFileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <span className="block text-sm text-gray-500">{language === 'bn' ? 'ফাইল' : 'Files'}</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{product.files}</span>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiPackage className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <span className="block text-sm text-gray-500">{language === 'bn' ? 'সাইজ' : 'Size'}</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{product.size}</span>
                                </div>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl text-center">
                                    <FiLayers className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <span className="block text-sm text-gray-500">{language === 'bn' ? 'ফরম্যাট' : 'Formats'}</span>
                                    <span className="font-bold text-gray-900 dark:text-white">{product.formats.length}</span>
                                </div>
                            </div>

                            {/* Formats */}
                            <div className="mb-8">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3">{language === 'bn' ? 'অন্তর্ভুক্ত ফরম্যাট' : 'Included Formats'}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {product.formats.map((format) => (
                                        <span key={format} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                                            {format}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div className="mb-8">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3">{language === 'bn' ? 'যা অন্তর্ভুক্ত' : 'What\'s Included'}</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {(language === 'bn' ? product.featuresBn : product.features).map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <FiCheck className="w-5 h-5 text-primary flex-shrink-0" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Author */}
                            <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                                <div className="flex items-center gap-4">
                                    <img
                                        src={product.author.avatar}
                                        alt={product.author.name}
                                        className="w-14 h-14 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{product.author.name}</h4>
                                        <p className="text-sm text-gray-500">
                                            {product.author.products} {language === 'bn' ? 'প্রোডাক্ট' : 'Products'} • {product.author.sales} {language === 'bn' ? 'বিক্রি' : 'Sales'}
                                        </p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-colors">
                                        {language === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Description */}
                    <div className="mt-16 pt-16 border-t border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-heading uppercase">
                            {language === 'bn' ? 'বিবরণ' : 'Description'}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl">
                            {language === 'bn' ? product.descriptionBn : product.description}
                        </p>
                    </div>

                    {/* Related Products */}
                    <div className="mt-16 pt-16 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-heading uppercase">
                                {language === 'bn' ? 'সম্পর্কিত প্রোডাক্ট' : 'Related Products'}
                            </h2>
                            <Link href="/graphics" className="flex items-center gap-2 text-primary font-bold hover:underline">
                                {language === 'bn' ? 'সব দেখুন' : 'View All'}
                                <FiArrowRight />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((item) => (
                                <Link
                                    key={item._id}
                                    href={`/graphics/${item._id}`}
                                    className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all"
                                >
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={item.thumbnail}
                                            alt={language === 'bn' ? item.titleBn : item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                            {language === 'bn' ? item.titleBn : item.title}
                                        </h3>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {item.salePrice ? (
                                                    <>
                                                        <span className="font-bold text-primary">৳{item.salePrice}</span>
                                                        <span className="text-sm text-gray-400 line-through">৳{item.price}</span>
                                                    </>
                                                ) : (
                                                    <span className="font-bold text-gray-900 dark:text-white">৳{item.price}</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                {item.rating}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
