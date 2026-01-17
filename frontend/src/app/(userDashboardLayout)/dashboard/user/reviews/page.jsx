"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiStar, FiSearch, FiLoader, FiEdit, FiTrash2, FiCalendar, FiCheck, FiMessageSquare, FiArrowRight, FiShield } from "react-icons/fi";
import { reviewService } from "@/services/api";

export default function UserReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewService.getMyReviews();
            if (response.success) {
                setReviews(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to load your reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to permanently delete this review?")) return;
        try {
            toast.loading("Deleting review...", { id: "delete-review" });
            const response = await reviewService.delete(id);
            if (response.success) {
                toast.success("Review deleted successfully", { id: "delete-review" });
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to delete review", { id: "delete-review" });
        }
    };

    const renderStars = (rating) => (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"} size={14} />
            ))}
        </div>
    );

    return (
        <div className="p-6 lg:p-12 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/20">
                        <FiMessageSquare className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Your Reviews</h1>
                        <p className="text-gray-500 font-medium">Manage your feedback and ratings for assets</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-0.5">Total Contribution</span>
                        <span className="text-xl font-black text-primary">{reviews.length} Reviews</span>
                    </div>
                </div>
            </div>

            {(!mounted || loading) ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading your feedback...</p>
                </div>
            ) : reviews.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-20 text-center bg-white dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-[3.5rem]"
                >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiStar className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No reviews yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Share your experience with the community by reviewing your purchased products.</p>
                    <Link href="/dashboard/user/courses" className="px-10 py-4 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2">
                        Browse Courses <FiArrowRight />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence mode="popLayout">
                        {reviews.map((review, i) => (
                            <motion.div
                                key={review._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 rounded-[2.5rem] hover:shadow-2xl hover:shadow-primary/5 transition-all"
                            >
                                <div className="flex flex-col lg:flex-row gap-8">
                                    {/* Product Info */}
                                    <div className="flex items-center gap-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-50 dark:border-gray-700 pb-6 lg:pb-0 lg:pr-8">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 overflow-hidden shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                            <img
                                                src={review.productDetails?.thumbnail || review.productDetails?.image || `https://via.placeholder.com/80?text=${review.productType}`}
                                                alt=""
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{review.productType}</div>
                                            <h3 className="text-lg font-black text-gray-900 dark:text-white truncate leading-tight mb-1 group-hover:text-primary transition-colors">
                                                {review.productDetails?.title || "Product Removed"}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <FiCalendar className="text-primary" /> {new Date(review.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                {renderStars(review.rating)}
                                                <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${review.status === 'approved'
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                        : review.status === 'pending'
                                                            ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                                            : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                    }`}>
                                                    {review.status === 'approved' && <FiCheck />}
                                                    {review.status}
                                                </div>
                                                {review.isVerifiedPurchase && (
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                                        <FiShield className="fill-emerald-100" /> Verified Purchase
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(review._id)}
                                                    className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
                                                    title="Delete Review"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <p className="text-gray-600 dark:text-gray-300 font-medium leading-relaxed italic pr-4">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
