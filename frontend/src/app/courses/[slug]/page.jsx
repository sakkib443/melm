"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    FiPlay, FiClock, FiBook, FiUsers, FiStar, FiGlobe, FiAward,
    FiCheck, FiChevronDown, FiChevronUp, FiLock, FiDownload,
    FiHeart, FiShare2, FiArrowLeft, FiLoader, FiCheckCircle,
    FiSmartphone, FiMonitor, FiLifeBuoy, FiX, FiShoppingCart
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { courseService, orderService, cartService } from "@/services/api";

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState([0]);
    const [isLiked, setIsLiked] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await courseService.getBySlug(params.slug);
                if (response.success && response.data) {
                    setCourse(response.data);
                }
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.slug) {
            fetchCourse();
        }
    }, [params.slug]);

    const toggleModule = (index) => {
        setExpandedModules(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const handlePurchase = () => {
        setShowPaymentModal(true);
    };

    const handlePaymentSubmit = async () => {
        if (!paymentMethod && !course.isFree) {
            toast.error("Please select a payment method");
            return;
        }

        setPaymentLoading(true);

        try {
            // Demo payment simulation
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create actual Order instead of direct enrollment
            const orderData = {
                items: [{
                    productId: course._id,
                    productType: 'course',
                    title: course.title,
                    price: course.price || 0,
                    image: course.thumbnail
                }],
                paymentMethod: paymentMethod || 'bkash',
                paymentStatus: 'completed' // For simulation, we mark as completed
            };

            const response = await orderService.create(orderData);

            if (response.success) {
                toast.success("🎉 Purchase Successful! Course added to your library.", {
                    duration: 5000,
                    icon: "🎓"
                });
                setShowPaymentModal(false);
                // Redirect to the professional course learn page
                router.push(`/courses/${course._id || id}/learn`);
            }
        } catch (error) {
            toast.error(error.message || "Failed to complete purchase. Please try again.");
            console.error("Order creation error:", error);
        } finally {
            setPaymentLoading(false);
            setPaymentMethod("");
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <FiLoader className="w-12 h-12 animate-spin text-primary" />
                </div>
            </>
        );
    }

    if (!course) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <FiBook className="w-24 h-24 text-gray-300 mb-6" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course not found</h1>
                    <p className="text-gray-500 mb-6">The course you're looking for doesn't exist.</p>
                    <Link href="/courses" className="btn btn-primary">
                        <FiArrowLeft /> Browse Courses
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    const discount = course.price > 0 && course.discountPrice
        ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
        : 0;

    // Use curriculum from API response
    const modules = course.curriculum || [];

    return (
        <>
            <Navbar />

            {/* Hero Section - Modern Light Style */}
            <section className="relative bg-white dark:bg-gray-950 pt-28 pb-16 overflow-hidden">
                {/* Background Pattern - Dot Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Content */}
                        <div className="lg:col-span-2">
                            <Link href="/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors text-sm font-medium">
                                <FiArrowLeft className="w-4 h-4" /> Back to Courses
                            </Link>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${course.level === "beginner" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                        course.level === "intermediate" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                                            "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                        }`}>
                                        {course.level}
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1 text-sm">
                                        <FiGlobe className="w-4 h-4" />
                                        {course.language === "bangla" ? "বাংলা" : course.language === "english" ? "English" : "Bangla & English"}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                                    {course.title}
                                </h1>

                                {course.titleBn && (
                                    <p className="text-xl text-gray-500 dark:text-gray-400 mb-4 font-bengali">{course.titleBn}</p>
                                )}

                                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 max-w-2xl">
                                    {course.shortDescription}
                                </p>

                                {/* Stats */}
                                <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 mb-6">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                                        <FiStar className="w-5 h-5 text-amber-500 fill-amber-500" />
                                        <span className="font-bold text-gray-900 dark:text-white">{course.averageRating?.toFixed(1) || "0.0"}</span>
                                        <span className="text-gray-500 text-sm">({course.totalReviews || 0} reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiUsers className="w-5 h-5" />
                                        <span className="font-medium">{course.totalEnrollments || 0} students</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiClock className="w-5 h-5" />
                                        <span className="font-medium">{Math.round((course.totalDuration || 0) / 60)} hours</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiBook className="w-5 h-5" />
                                        <span className="font-medium">{course.totalLessons || 0} lessons</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className={`p-3 rounded-xl border transition-all ${isLiked
                                            ? "bg-red-500/20 border-red-500 text-red-500"
                                            : "border-gray-600 text-gray-400 hover:border-gray-500"
                                            }`}
                                    >
                                        <FiHeart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                                    </button>
                                    <button className="p-3 rounded-xl border border-gray-600 text-gray-400 hover:border-gray-500 transition-all">
                                        <FiShare2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right - Purchase Card */}
                        <div className="lg:col-span-1">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl sticky top-24"
                            >
                                {/* Video Preview */}
                                <div className="relative aspect-video bg-gray-900 group cursor-pointer">
                                    <img
                                        src={course.thumbnail || "/placeholder-course.jpg"}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <FiPlay className="w-8 h-8 text-primary ml-1" />
                                        </div>
                                    </div>
                                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 text-white text-sm rounded-lg">
                                        Preview this course
                                    </span>
                                </div>

                                {/* Price & CTA */}
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        {course.isFree ? (
                                            <span className="text-4xl font-bold text-emerald-600">Free</span>
                                        ) : (
                                            <>
                                                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                                    ৳{course.discountPrice || course.price}
                                                </span>
                                                {discount > 0 && (
                                                    <>
                                                        <span className="text-xl text-gray-400 line-through">৳{course.price}</span>
                                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded">
                                                            {discount}% OFF
                                                        </span>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    {course.isEnrolled ? (
                                        <Link
                                            href={`/courses/${course._id}/learn`}
                                            className="btn btn-primary w-full text-lg py-4 mb-3"
                                        >
                                            Go to Course
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handlePurchase}
                                            className="btn btn-primary w-full text-lg py-4 mb-3"
                                        >
                                            {course.isFree ? "Enroll for Free" : "Buy Now"}
                                        </button>
                                    )}

                                    <button
                                        onClick={async () => {
                                            try {
                                                setAddingToCart(true);
                                                const res = await cartService.addToCart({
                                                    productId: course._id,
                                                    productType: 'course',
                                                    price: course.discountPrice || course.price,
                                                    title: course.title,
                                                    image: course.thumbnail
                                                });
                                                if (res.success) {
                                                    toast.success('Added to cart!');
                                                }
                                            } catch (error) {
                                                toast.error(error.message || 'Failed to add to cart');
                                            } finally {
                                                setAddingToCart(false);
                                            }
                                        }}
                                        disabled={addingToCart || course.isEnrolled}
                                        className="btn btn-ghost w-full border border-gray-200 dark:border-gray-700 flex items-center justify-center gap-2"
                                    >
                                        {addingToCart ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiShoppingCart className="w-5 h-5" />}
                                        {addingToCart ? 'Adding...' : 'Add to Cart'}
                                    </button>

                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        30-Day Money-Back Guarantee
                                    </p>

                                    {/* Features */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 space-y-3">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4">This course includes:</h4>
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                            <FiPlay className="w-5 h-5 text-primary" />
                                            <span>{Math.round((course.totalDuration || 0) / 60)} hours on-demand video</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                            <FiDownload className="w-5 h-5 text-primary" />
                                            <span>Downloadable resources</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                            <FiSmartphone className="w-5 h-5 text-primary" />
                                            <span>Access on mobile & TV</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                            <FiAward className="w-5 h-5 text-primary" />
                                            <span>Certificate of completion</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                            <FiLifeBuoy className="w-5 h-5 text-primary" />
                                            <span>Lifetime access</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Content Tabs */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container">
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            {/* What you'll learn */}
                            {course.whatYouWillLearn?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What you'll learn</h2>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {course.whatYouWillLearn.map((item, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <FiCheck className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600 dark:text-gray-300">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Course Curriculum */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Course Curriculum</h2>
                                    <span className="text-gray-500">
                                        {course.totalModules || 3} modules • {course.totalLessons || 10} lessons
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {modules.map((module, moduleIndex) => (
                                        <div key={moduleIndex} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggleModule(moduleIndex)}
                                                className="w-full flex items-center justify-between p-5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {expandedModules.includes(moduleIndex) ? (
                                                        <FiChevronUp className="w-5 h-5 text-primary" />
                                                    ) : (
                                                        <FiChevronDown className="w-5 h-5" />
                                                    )}
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {module.moduleTitle}
                                                    </span>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {module.lessons.length} lessons
                                                </span>
                                            </button>

                                            <AnimatePresence>
                                                {expandedModules.includes(moduleIndex) && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                                            {module.lessons.map((lesson, lessonIndex) => (
                                                                <div
                                                                    key={lessonIndex}
                                                                    className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        {lesson.isFree ? (
                                                                            <FiPlay className="w-5 h-5 text-primary" />
                                                                        ) : (
                                                                            <FiLock className="w-5 h-5 text-gray-400" />
                                                                        )}
                                                                        <span className="text-gray-700 dark:text-gray-300">
                                                                            {lesson.title}
                                                                        </span>
                                                                        {lesson.isFree && (
                                                                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-full">
                                                                                Preview
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <span className="text-sm text-gray-500">{Math.round((lesson.videoDuration || 0) / 60)} min</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Requirements */}
                            {course.requirements?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
                                >
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Requirements</h2>
                                    <ul className="space-y-3">
                                        {course.requirements.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Description</h2>
                                <div className="prose dark:prose-invert max-w-none">
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                                        {course.description}
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar - Target Audience */}
                        <div className="lg:col-span-1">
                            {course.targetAudience?.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 sticky top-24">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Who this course is for</h3>
                                    <ul className="space-y-4">
                                        {course.targetAudience.map((item, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <FiCheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-gray-600 dark:text-gray-300">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowPaymentModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Complete Purchase</h3>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Course Summary */}
                                <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-20 h-14 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                            {course.title}
                                        </h4>
                                        <p className="text-2xl font-bold text-primary mt-1">
                                            ৳{course.discountPrice || course.price}
                                        </p>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Select Payment Method</h4>
                                    <div className="space-y-3">
                                        {[
                                            { id: "bkash", name: "bKash", icon: "📱", color: "bg-pink-500" },
                                            { id: "nagad", name: "Nagad", icon: "💳", color: "bg-orange-500" },
                                            { id: "rocket", name: "Rocket", icon: "🚀", color: "bg-purple-500" },
                                            { id: "card", name: "Credit/Debit Card", icon: "💳", color: "bg-blue-500" }
                                        ].map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === method.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                    }`}
                                            >
                                                <span className={`w-12 h-12 ${method.color} rounded-xl flex items-center justify-center text-2xl`}>
                                                    {method.icon}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">{method.name}</span>
                                                {paymentMethod === method.id && (
                                                    <FiCheckCircle className="w-6 h-6 text-primary ml-auto" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Demo Notice */}
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
                                    <p className="text-sm text-amber-700 dark:text-amber-400">
                                        <strong>Demo Mode:</strong> This is a demonstration. No real payment will be processed.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handlePaymentSubmit}
                                    disabled={paymentLoading || !paymentMethod}
                                    className="btn btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {paymentLoading ? (
                                        <span className="flex items-center gap-2">
                                            <FiLoader className="animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        `Pay ৳${course.discountPrice || course.price}`
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </>
    );
}
