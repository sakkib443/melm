"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiArrowLeft,
    FiCheck,
    FiCreditCard,
    FiShield,
    FiLock,
    FiX,
    FiChevronRight,
    FiPackage,
    FiDownload,
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectCartTotal, clearCart } from "@/redux/features/cartSlice";
import { selectCurrentUser, selectIsAuthenticated } from "@/redux/features/authSlice";
import Navbar from "@/components/shared/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";
import { orderService } from "@/services/api";

// Payment Method Images
const PAYMENT_METHODS = [
    {
        id: "bkash",
        name: "bKash",
        nameBn: "বিকাশ",
        icon: "https://upload.wikimedia.org/wikipedia/commons/f/f6/BKash-bKash-Logo.wine.png",
        description: "Pay with bKash mobile wallet",
        descriptionBn: "বিকাশ মোবাইল ওয়ালেট দিয়ে পেমেন্ট করুন",
        color: "from-pink-500 to-pink-600",
    },
    {
        id: "nagad",
        name: "Nagad",
        nameBn: "নগদ",
        icon: "https://nagad.com.bd/wp-content/uploads/2020/10/Nagad-Logo.png",
        description: "Pay with Nagad mobile wallet",
        descriptionBn: "নগদ মোবাইল ওয়ালেট দিয়ে পেমেন্ট করুন",
        color: "from-orange-500 to-orange-600",
    },
    {
        id: "sslcommerz",
        name: "Card / Net Banking",
        nameBn: "কার্ড / নেট ব্যাংকিং",
        icon: "https://sslcommerz.com/wp-content/uploads/2021/11/logo-1.png",
        description: "Visa, Mastercard, DBBL, Rocket & more",
        descriptionBn: "ভিসা, মাস্টারকার্ড, ডিবিবিএল, রকেট ও আরও",
        color: "from-blue-500 to-blue-600",
    },
    {
        id: "stripe",
        name: "International Cards",
        nameBn: "আন্তর্জাতিক কার্ড",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png",
        description: "Pay with Visa, Mastercard internationally",
        descriptionBn: "আন্তর্জাতিক ভিসা, মাস্টারকার্ড দিয়ে পেমেন্ট করুন",
        color: "from-indigo-500 to-indigo-600",
    },
];

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { language } = useLanguage();

    const cartItems = useSelector(selectCartItems);
    const cartTotal = useSelector(selectCartTotal);
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [selectedPayment, setSelectedPayment] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: "",
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
            }));
        }
    }, [user]);

    // Redirect if cart is empty
    useEffect(() => {
        if (cartItems.length === 0 && !showSuccess) {
            router.push('/cart');
        }
    }, [cartItems, router, showSuccess]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const applyCoupon = () => {
        // Demo coupon logic
        if (couponCode.toUpperCase() === "WELCOME10") {
            setDiscount(cartTotal * 0.1);
            toast.success(language === 'bn' ? '১০% ছাড় প্রয়োগ হয়েছে!' : '10% discount applied!');
        } else if (couponCode.toUpperCase() === "SAVE20") {
            setDiscount(cartTotal * 0.2);
            toast.success(language === 'bn' ? '২০% ছাড় প্রয়োগ হয়েছে!' : '20% discount applied!');
        } else {
            toast.error(language === 'bn' ? 'অবৈধ কুপন কোড' : 'Invalid coupon code');
        }
    };

    const handlePayment = async () => {
        if (!selectedPayment) {
            toast.error(language === 'bn' ? 'পেমেন্ট মেথড সিলেক্ট করুন' : 'Please select a payment method');
            return;
        }

        if (!formData.email || !formData.phone) {
            toast.error(language === 'bn' ? 'সব তথ্য পূরণ করুন' : 'Please fill all required fields');
            return;
        }

        setProcessing(true);

        try {
            // Simulate payment gateway interaction
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Map cart items to order items expected by backend
            const orderItems = cartItems.map(item => ({
                productId: item._id,
                productType: item.type === 'logo' || item.type === 'flyer' || item.type === 'banner' ? 'graphics' : (item.type || 'graphics'),
                title: item.title,
                price: item.price,
                image: item.thumbnail
            }));

            // Create order in backend with 'pending' status
            const orderResponse = await orderService.create({
                items: orderItems,
                paymentMethod: selectedPayment,
                paymentStatus: 'pending' // Orders are pending until admin approves
            });

            if (orderResponse.success) {
                setShowSuccess(true);
                dispatch(clearCart());
                toast.success(language === 'bn' ? '✅ অর্ডার সফলভাবে গ্রহণ করা হয়েছে!' : '✅ Order placed successfully!');
            } else {
                throw new Error("Failed to create order");
            }

        } catch (error) {
            console.error("Payment/Order error:", error);
            toast.error(error.message || (language === 'bn' ? 'অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে' : 'Failed to process order'));
        } finally {
            setProcessing(false);
        }
    };

    const finalTotal = cartTotal - discount;

    // Success Screen
    if (showSuccess) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <Navbar />
                <div className="pt-32 pb-20">
                    <div className="container px-6 max-w-2xl mx-auto text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            className="w-24 h-24 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-8"
                        >
                            <FiCheck className="w-12 h-12 text-white" />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-4"
                        >
                            {language === 'bn' ? 'অর্ডার সম্পন্ন!' : 'Order Complete!'}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-gray-500 mb-8"
                        >
                            {language === 'bn'
                                ? 'আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে। ডাউনলোড লিংক আপনার ইমেইলে পাঠানো হয়েছে।'
                                : 'Your order has been completed successfully. Download links have been sent to your email.'}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link
                                href="/dashboard/user/orders"
                                className="flex items-center gap-2 px-8 py-4 bg-primary text-black font-bold rounded-full hover:bg-primary/90 transition-all"
                            >
                                <FiDownload className="w-5 h-5" />
                                {language === 'bn' ? 'ডাউনলোড করুন' : 'Go to Downloads'}
                            </Link>
                            <Link
                                href="/graphics"
                                className="flex items-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                {language === 'bn' ? 'শপিং চালিয়ে যান' : 'Continue Shopping'}
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            {/* Header */}
            <div className="pt-28 pb-6 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/cart"
                            className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FiArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {language === 'bn' ? 'চেকআউট' : 'Checkout'}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {language === 'bn' ? 'পেমেন্ট সম্পন্ন করুন' : 'Complete your payment'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left: Payment Form */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
                            >
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm font-bold">1</span>
                                    {language === 'bn' ? 'যোগাযোগের তথ্য' : 'Contact Information'}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {language === 'bn' ? 'নাম' : 'First Name'} *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {language === 'bn' ? 'পদবি' : 'Last Name'}
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {language === 'bn' ? 'ইমেইল' : 'Email'} *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'} *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="01XXXXXXXXX"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:outline-none transition-colors"
                                            required
                                        />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Payment Methods */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800"
                            >
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm font-bold">2</span>
                                    {language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Method'}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {PAYMENT_METHODS.map((method) => (
                                        <motion.button
                                            key={method.id}
                                            onClick={() => setSelectedPayment(method.id)}
                                            className={`relative p-4 rounded-2xl border-2 text-left transition-all ${selectedPayment === method.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {selectedPayment === method.id && (
                                                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                    <FiCheck className="w-4 h-4 text-black" />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-4">
                                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} p-2 flex items-center justify-center`}>
                                                    <img src={method.icon} alt={method.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                                        {language === 'bn' ? method.nameBn : method.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {language === 'bn' ? method.descriptionBn : method.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Security Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800"
                            >
                                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                                    <FiShield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-green-800 dark:text-green-300">
                                        {language === 'bn' ? 'নিরাপদ পেমেন্ট' : 'Secure Payment'}
                                    </h4>
                                    <p className="text-sm text-green-600 dark:text-green-400">
                                        {language === 'bn'
                                            ? 'আপনার পেমেন্ট তথ্য এনক্রিপ্টেড এবং সম্পূর্ণ নিরাপদ।'
                                            : 'Your payment information is encrypted and completely secure.'}
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 sticky top-28"
                            >
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                    {language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}
                                </h2>

                                {/* Cart Items */}
                                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex items-center gap-3">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                                    {item.title}
                                                </h4>
                                                <p className="text-xs text-gray-500">{item.type}</p>
                                            </div>
                                            <span className="font-bold text-gray-900 dark:text-white">
                                                ৳{item.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Coupon */}
                                <div className="mb-6">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder={language === 'bn' ? 'কুপন কোড' : 'Coupon code'}
                                            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:border-primary focus:outline-none"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-sm"
                                        >
                                            {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                                        </button>
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                                        <span>৳{cartTotal.toLocaleString()}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>{language === 'bn' ? 'ছাড়' : 'Discount'}</span>
                                            <span>-৳{discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="h-px bg-gray-100 dark:bg-gray-800" />
                                    <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                                        <span>{language === 'bn' ? 'মোট' : 'Total'}</span>
                                        <span className="text-primary">৳{finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Pay Button */}
                                <motion.button
                                    onClick={handlePayment}
                                    disabled={processing || !selectedPayment}
                                    className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-bold uppercase tracking-wider rounded-xl transition-all ${processing || !selectedPayment
                                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-black hover:bg-primary/90'
                                        }`}
                                    whileHover={!processing && selectedPayment ? { scale: 1.02 } : {}}
                                    whileTap={!processing && selectedPayment ? { scale: 0.98 } : {}}
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                                            {language === 'bn' ? 'প্রসেসিং...' : 'Processing...'}
                                        </>
                                    ) : (
                                        <>
                                            <FiLock className="w-5 h-5" />
                                            {language === 'bn' ? 'পেমেন্ট করুন' : 'Pay Now'}
                                        </>
                                    )}
                                </motion.button>

                                <p className="text-center text-xs text-gray-500 mt-4">
                                    {language === 'bn'
                                        ? 'পেমেন্ট করে আপনি আমাদের শর্তাবলী মেনে নিচ্ছেন।'
                                        : 'By paying, you agree to our terms and conditions.'}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
