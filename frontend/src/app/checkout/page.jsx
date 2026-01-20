"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiCreditCard, FiCheck, FiArrowRight, FiArrowLeft, FiLoader,
    FiShoppingBag, FiLock, FiShield, FiPhone, FiMail, FiUser
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { cartService, orderService } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";

// Payment Methods
const paymentMethods = [
    {
        id: "bkash",
        name: "bKash",
        nameBn: "বিকাশ",
        icon: "📱",
        color: "bg-pink-500",
        description: "Pay with bKash mobile payment",
        descriptionBn: "বিকাশ মোবাইল পেমেন্ট দিয়ে পে করুন"
    },
    {
        id: "nagad",
        name: "Nagad",
        nameBn: "নগদ",
        icon: "💳",
        color: "bg-orange-500",
        description: "Pay with Nagad mobile payment",
        descriptionBn: "নগদ মোবাইল পেমেন্ট দিয়ে পে করুন"
    },
    {
        id: "stripe",
        name: "Credit/Debit Card",
        nameBn: "ক্রেডিট/ডেবিট কার্ড",
        icon: "💳",
        color: "bg-indigo-500",
        description: "Pay securely with Visa, Mastercard",
        descriptionBn: "ভিসা, মাস্টারকার্ড দিয়ে নিরাপদে পে করুন"
    }
];

export default function CheckoutPage() {
    const { t, language } = useLanguage();
    const router = useRouter();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("");
    const [step, setStep] = useState(1); // 1: Review, 2: Payment, 3: Confirm
    const [billingInfo, setBillingInfo] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [paymentDetails, setPaymentDetails] = useState({
        bkashNumber: "",
        nagadNumber: "",
        transactionId: ""
    });

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

    const items = cart?.items || [];
    const totalAmount = cart?.totalAmount || 0;

    const handlePayment = async () => {
        if (!selectedPayment) {
            toast.error(language === 'bn' ? 'পেমেন্ট মেথড সিলেক্ট করুন' : 'Select a payment method');
            return;
        }

        if (!billingInfo.name || !billingInfo.email || !billingInfo.phone) {
            toast.error(language === 'bn' ? 'বিলিং তথ্য পূরণ করুন' : 'Please fill billing information');
            return;
        }

        setProcessing(true);

        try {
            // Create order with cart items
            const orderData = {
                items: items.map(item => ({
                    product: item.product,
                    productType: item.productType,
                    price: item.price,
                    title: item.title
                })),
                totalAmount,
                paymentMethod: selectedPayment,
                billingInfo,
                paymentDetails: selectedPayment === 'bkash' ? { number: paymentDetails.bkashNumber, txnId: paymentDetails.transactionId }
                    : selectedPayment === 'nagad' ? { number: paymentDetails.nagadNumber, txnId: paymentDetails.transactionId }
                        : {}
            };

            const res = await orderService.create(orderData);

            if (res.success) {
                // Clear cart after successful order
                await cartService.clearCart();
                toast.success(language === 'bn' ? '🎉 অর্ডার সফল হয়েছে!' : '🎉 Order placed successfully!');
                router.push('/dashboard/user/orders');
            }
        } catch (error) {
            toast.error(error.message || (language === 'bn' ? 'অর্ডার ব্যর্থ' : 'Order failed'));
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="flex items-center justify-center py-40">
                    <FiLoader className="w-12 h-12 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="container max-w-[1400px] mx-auto px-6 py-32 text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-8">
                        <FiShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {language === 'bn' ? 'কার্ট খালি' : 'Your cart is empty'}
                    </h1>
                    <p className="text-gray-500 mb-8">
                        {language === 'bn' ? 'চেকআউট করতে আপনার কার্টে আইটেম যোগ করুন' : 'Add items to your cart to checkout'}
                    </p>
                    <Link
                        href="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-bold rounded-full"
                    >
                        {language === 'bn' ? 'শপিং করুন' : 'Start Shopping'}
                        <FiArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-8 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    {/* Back Button */}
                    <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
                        <FiArrowLeft className="w-4 h-4" />
                        {language === 'bn' ? 'কার্টে ফিরুন' : 'Back to Cart'}
                    </Link>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-2">
                            {language === 'bn' ? 'চেকআউট' : 'CHECKOUT'}
                        </h1>
                        <p className="text-gray-500">
                            {language === 'bn' ? 'আপনার অর্ডার সম্পূর্ণ করুন' : 'Complete your order securely'}
                        </p>
                    </motion.div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= s ? 'bg-primary text-black' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                                    {step > s ? <FiCheck /> : s}
                                </div>
                                <span className={`hidden md:block text-sm font-medium ${step >= s ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                    {s === 1 ? (language === 'bn' ? 'রিভিউ' : 'Review') :
                                        s === 2 ? (language === 'bn' ? 'পেমেন্ট' : 'Payment') :
                                            (language === 'bn' ? 'কনফার্ম' : 'Confirm')}
                                </span>
                                {s < 3 && <div className="w-12 h-0.5 bg-gray-200 dark:bg-gray-800" />}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left - Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Step 1: Billing Info */}
                            <AnimatePresence mode="wait">
                                {step >= 1 && (
                                    <motion.div
                                        key="billing"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6"
                                    >
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">1</span>
                                            {language === 'bn' ? 'বিলিং তথ্য' : 'Billing Information'}
                                        </h2>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                    {language === 'bn' ? 'নাম' : 'Full Name'}
                                                </label>
                                                <div className="relative">
                                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={billingInfo.name}
                                                        onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary"
                                                        placeholder="John Doe"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                    {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                                                </label>
                                                <div className="relative">
                                                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="tel"
                                                        value={billingInfo.phone}
                                                        onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary"
                                                        placeholder="01XXXXXXXXX"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                                    {language === 'bn' ? 'ইমেইল' : 'Email Address'}
                                                </label>
                                                <div className="relative">
                                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        value={billingInfo.email}
                                                        onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary"
                                                        placeholder="you@example.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {step === 1 && (
                                            <button
                                                onClick={() => setStep(2)}
                                                disabled={!billingInfo.name || !billingInfo.email || !billingInfo.phone}
                                                className="mt-6 w-full py-3 bg-primary text-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
                                            >
                                                {language === 'bn' ? 'পেমেন্টে যান' : 'Continue to Payment'}
                                                <FiArrowRight className="inline ml-2" />
                                            </button>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 2: Payment Method */}
                                {step >= 2 && (
                                    <motion.div
                                        key="payment"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6"
                                    >
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">2</span>
                                            {language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}
                                        </h2>

                                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                                            {paymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    onClick={() => setSelectedPayment(method.id)}
                                                    className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedPayment === method.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                                                        {method.icon}
                                                    </div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                                        {language === 'bn' ? method.nameBn : method.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {language === 'bn' ? method.descriptionBn : method.description}
                                                    </p>
                                                    {selectedPayment === method.id && (
                                                        <div className="mt-2 text-primary">
                                                            <FiCheck className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Payment Details Forms */}
                                        <AnimatePresence mode="wait">
                                            {selectedPayment === 'bkash' && (
                                                <motion.div
                                                    key="bkash-form"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl space-y-4"
                                                >
                                                    <p className="text-sm text-pink-600 dark:text-pink-300">
                                                        {language === 'bn'
                                                            ? `📱 এই নম্বরে ৳${totalAmount} সেন্ড মানি করুন: 01XXXXXXXXX`
                                                            : `📱 Send ৳${totalAmount} to this bKash number: 01XXXXXXXXX`}
                                                    </p>
                                                    <input
                                                        type="text"
                                                        placeholder={language === 'bn' ? 'আপনার বিকাশ নম্বর' : 'Your bKash number'}
                                                        value={paymentDetails.bkashNumber}
                                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, bkashNumber: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-800 rounded-xl focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder={language === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}
                                                        value={paymentDetails.transactionId}
                                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-pink-200 dark:border-pink-800 rounded-xl focus:outline-none"
                                                    />
                                                </motion.div>
                                            )}

                                            {selectedPayment === 'nagad' && (
                                                <motion.div
                                                    key="nagad-form"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl space-y-4"
                                                >
                                                    <p className="text-sm text-orange-600 dark:text-orange-300">
                                                        {language === 'bn'
                                                            ? `📱 এই নম্বরে ৳${totalAmount} সেন্ড মানি করুন: 01XXXXXXXXX`
                                                            : `📱 Send ৳${totalAmount} to this Nagad number: 01XXXXXXXXX`}
                                                    </p>
                                                    <input
                                                        type="text"
                                                        placeholder={language === 'bn' ? 'আপনার নগদ নম্বর' : 'Your Nagad number'}
                                                        value={paymentDetails.nagadNumber}
                                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, nagadNumber: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-xl focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder={language === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}
                                                        value={paymentDetails.transactionId}
                                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, transactionId: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-800 rounded-xl focus:outline-none"
                                                    />
                                                </motion.div>
                                            )}

                                            {selectedPayment === 'stripe' && (
                                                <motion.div
                                                    key="stripe-form"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl"
                                                >
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <FiLock className="w-5 h-5 text-indigo-600" />
                                                        <span className="text-sm text-indigo-600 dark:text-indigo-300">
                                                            {language === 'bn' ? 'নিরাপদ কার্ড পেমেন্ট' : 'Secure card payment powered by Stripe'}
                                                        </span>
                                                    </div>
                                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-indigo-200 dark:border-indigo-800">
                                                        <p className="text-center text-gray-500">
                                                            {language === 'bn'
                                                                ? 'অর্ডার কনফার্ম করলে Stripe পেমেন্ট পেজে নিয়ে যাওয়া হবে'
                                                                : 'You will be redirected to Stripe payment page'}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {step === 2 && (
                                            <button
                                                onClick={() => setStep(3)}
                                                disabled={!selectedPayment}
                                                className="mt-6 w-full py-3 bg-primary text-black font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all"
                                            >
                                                {language === 'bn' ? 'রিভিউতে যান' : 'Review Order'}
                                                <FiArrowRight className="inline ml-2" />
                                            </button>
                                        )}
                                    </motion.div>
                                )}

                                {/* Step 3: Confirm */}
                                {step === 3 && (
                                    <motion.div
                                        key="confirm"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6"
                                    >
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">3</span>
                                            {language === 'bn' ? 'অর্ডার কনফার্ম' : 'Confirm Order'}
                                        </h2>

                                        <div className="space-y-4 mb-6">
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                <p className="text-sm text-gray-500 mb-1">{language === 'bn' ? 'বিলিং তথ্য' : 'Billing Info'}</p>
                                                <p className="font-medium text-gray-900 dark:text-white">{billingInfo.name}</p>
                                                <p className="text-sm text-gray-500">{billingInfo.email} | {billingInfo.phone}</p>
                                            </div>
                                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                                <p className="text-sm text-gray-500 mb-1">{language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}</p>
                                                <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedPayment}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setStep(2)}
                                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl"
                                            >
                                                <FiArrowLeft className="inline mr-2" />
                                                {language === 'bn' ? 'পিছনে' : 'Back'}
                                            </button>
                                            <button
                                                onClick={handlePayment}
                                                disabled={processing}
                                                className="flex-1 py-3 bg-primary text-black font-bold rounded-xl disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {processing ? (
                                                    <FiLoader className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <FiLock className="w-4 h-4" />
                                                        {language === 'bn' ? `৳${totalAmount} পে করুন` : `Pay ৳${totalAmount}`}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right - Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="sticky top-28 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                    {language === 'bn' ? 'অর্ডার সামারি' : 'Order Summary'}
                                </h3>

                                {/* Items */}
                                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.product} className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs">
                                                {item.image ? (
                                                    <img src={item.image} alt="" className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <FiShoppingBag className="text-gray-400" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{item.title}</p>
                                                <p className="text-xs text-gray-500">{item.productType}</p>
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white">৳{item.price}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                                        <span>৳{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>{language === 'bn' ? 'প্রসেসিং ফি' : 'Processing Fee'}</span>
                                        <span>৳0</span>
                                    </div>
                                    <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                                        <div className="flex justify-between">
                                            <span className="font-bold text-gray-900 dark:text-white">{language === 'bn' ? 'মোট' : 'Total'}</span>
                                            <span className="text-2xl font-bold text-primary">৳{totalAmount}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security */}
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center gap-3 text-sm text-gray-500">
                                    <FiShield className="w-5 h-5 text-emerald-500" />
                                    <span>{language === 'bn' ? 'নিরাপদ ও এনক্রিপ্টেড' : 'Secure & Encrypted'}</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
