"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiShoppingCart, FiX, FiMinus, FiPlus, FiTrash2, FiArrowRight,
    FiShoppingBag, FiLoader, FiHeart, FiArrowLeft
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { cartService } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";

export default function CartPage() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const res = await cartService.getCart();
            if (res.success) {
                setCart(res.data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            setRemovingId(productId);
            const res = await cartService.removeFromCart(productId);
            if (res.success) {
                setCart(res.data);
                toast.success(language === 'bn' ? 'আইটেম সরানো হয়েছে' : 'Item removed from cart');
            }
        } catch (error) {
            toast.error(language === 'bn' ? 'সরাতে ব্যর্থ' : 'Failed to remove item');
        } finally {
            setRemovingId(null);
        }
    };

    const handleClearCart = async () => {
        try {
            await cartService.clearCart();
            setCart({ items: [], totalAmount: 0 });
            toast.success(language === 'bn' ? 'কার্ট খালি করা হয়েছে' : 'Cart cleared');
        } catch (error) {
            toast.error(language === 'bn' ? 'ব্যর্থ' : 'Failed to clear cart');
        }
    };

    const items = cart?.items || [];
    const totalAmount = cart?.totalAmount || 0;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-12 overflow-hidden">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <FiShoppingCart className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-4">
                            {language === 'bn' ? 'আপনার' : 'YOUR'}
                            <span className="text-primary"> {language === 'bn' ? 'কার্ট' : 'CART'}</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
                            {language === 'bn'
                                ? 'আপনার নির্বাচিত আইটেমগুলি পর্যালোচনা করুন এবং চেকআউটে এগিয়ে যান'
                                : 'Review your selected items and proceed to checkout'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Cart Content */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <FiLoader className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    ) : items.length === 0 ? (
                        /* Empty Cart */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-20"
                        >
                            <div className="w-32 h-32 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-8">
                                <FiShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-heading">
                                {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your Cart is Empty'}
                            </h2>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                {language === 'bn'
                                    ? 'দেখে মনে হচ্ছে আপনি এখনও কার্টে কিছু যোগ করেননি। আমাদের কালেকশন এক্সপ্লোর করুন!'
                                    : "Looks like you haven't added anything to your cart yet. Explore our collection!"}
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Link
                                    href="/courses"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all"
                                >
                                    {language === 'bn' ? 'কোর্স দেখুন' : 'Browse Courses'}
                                    <FiArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="/graphics"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full hover:bg-gray-800 transition-all"
                                >
                                    {language === 'bn' ? 'ডিজাইন দেখুন' : 'Browse Designs'}
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {language === 'bn' ? `${items.length}টি আইটেম` : `${items.length} Items`}
                                    </h2>
                                    <button
                                        onClick={handleClearCart}
                                        className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                        {language === 'bn' ? 'সব মুছুন' : 'Clear All'}
                                    </button>
                                </div>

                                {/* Items List */}
                                <AnimatePresence>
                                    {items.map((item, index) => (
                                        <motion.div
                                            key={item.product}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-all"
                                        >
                                            {/* Image */}
                                            <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <FiShoppingBag className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                                    {item.productType}
                                                </span>
                                                <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {language === 'bn' ? 'যোগ করা হয়েছে' : 'Added'}: {new Date(item.addedAt).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                                    ৳{item.price}
                                                </span>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item.product)}
                                                disabled={removingId === item.product}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                            >
                                                {removingId === item.product ? (
                                                    <FiLoader className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <FiX className="w-5 h-5" />
                                                )}
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="sticky top-28 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                        {language === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}
                                    </h3>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                                            <span>৳{totalAmount}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                            <span>{language === 'bn' ? 'ডিসকাউন্ট' : 'Discount'}</span>
                                            <span className="text-emerald-500">-৳0</span>
                                        </div>
                                        <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                                            <div className="flex justify-between">
                                                <span className="font-bold text-gray-900 dark:text-white">
                                                    {language === 'bn' ? 'মোট' : 'Total'}
                                                </span>
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    ৳{totalAmount}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coupon */}
                                    <div className="mb-6">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder={language === 'bn' ? 'কুপন কোড' : 'Coupon code'}
                                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:border-primary"
                                            />
                                            <button className="px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm rounded-xl hover:bg-gray-800 transition-colors">
                                                {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Checkout Button */}
                                    <Link
                                        href="/checkout"
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-black font-bold text-lg rounded-full hover:bg-primary/90 transition-all"
                                    >
                                        {language === 'bn' ? 'চেকআউটে যান' : 'Proceed to Checkout'}
                                        <FiArrowRight className="w-5 h-5" />
                                    </Link>

                                    {/* Trust Badges */}
                                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <p className="text-center text-sm text-gray-500 mb-4">
                                            {language === 'bn' ? 'নিরাপদ পেমেন্ট' : 'Secure Payment'}
                                        </p>
                                        <div className="flex justify-center gap-3">
                                            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">bKash</div>
                                            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">Nagad</div>
                                            <div className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold">Stripe</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    )}

                    {/* Continue Shopping */}
                    {items.length > 0 && (
                        <div className="mt-8 text-center">
                            <Link
                                href="/courses"
                                className="inline-flex items-center gap-2 text-gray-500 hover:text-primary font-medium transition-colors"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                {language === 'bn' ? 'শপিং চালিয়ে যান' : 'Continue Shopping'}
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}
