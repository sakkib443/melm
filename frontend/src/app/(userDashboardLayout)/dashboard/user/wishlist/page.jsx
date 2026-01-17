"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiHeart, FiSearch, FiLoader, FiTrash2, FiShoppingCart, FiStar, FiArrowRight, FiShoppingBag, FiLayers } from "react-icons/fi";
import { wishlistService } from "@/services/api";

export default function UserWishlistPage() {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await wishlistService.getWishlist();
            if (response.success) {
                setWishlist(response.data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            toast.error("Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            const response = await wishlistService.removeFromWishlist(productId);
            if (response.success) {
                toast.success("Removed from wishlist", {
                    icon: "🗑️",
                    style: { borderRadius: '12px', background: '#333', color: '#fff' }
                });
                fetchWishlist(); // Refresh
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = (product) => {
        toast.success(`${product.title} added to cart!`, {
            icon: "🛒",
            style: { borderRadius: '12px', background: '#333', color: '#fff' }
        });
    };

    const items = wishlist?.items || [];
    const filtered = items.filter(item =>
        item.product?.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-12 space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-2xl shadow-rose-500/20">
                        <FiHeart className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Your Wishlist</h1>
                        <p className="text-gray-500 font-medium">You have saved {items.length} items for later</p>
                    </div>
                </div>

                <div className="relative group min-w-[300px]">
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        placeholder="Search favorites..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                </div>
            </div>

            {(!mounted || loading) ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Gathering your favorites...</p>
                </div>
            ) : filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-20 text-center bg-white dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-[3.5rem]"
                >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiHeart className="w-10 h-10 text-gray-200" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Save items you like and they will appear here. Start exploring our premium assets.</p>
                    <Link href="/products" className="px-10 py-4 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2">
                        Browse Marketplace <FiArrowRight />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((item, i) => (
                            <motion.div
                                key={item.product?._id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all relative"
                            >
                                {/* Media Section */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img src={item.product?.thumbnail || item.product?.images?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="absolute top-4 left-4">
                                        <div className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black tracking-widest uppercase rounded-full border border-white/20">
                                            {item.productType}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRemove(item.product?._id)}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all shadow-xl group/trash"
                                        title="Remove from Wishlist"
                                    >
                                        <FiTrash2 className="group-hover/trash:scale-110 transition-transform" />
                                    </button>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl">
                                            <FiLayers />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-black mb-2 uppercase tracking-widest">
                                        <FiStar className="fill-amber-500" />
                                        <span>4.9 (24 Reviews)</span>
                                    </div>

                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 line-clamp-1 group-hover:text-primary transition-colors">
                                        {item.product?.title}
                                    </h3>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700/50">
                                        <div>
                                            {item.product?.discountPrice ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">৳{item.product.discountPrice.toLocaleString()}</span>
                                                    <span className="text-xs text-gray-400 line-through font-bold">৳{item.product.price.toLocaleString()}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">৳{(item.product?.price || 0).toLocaleString()}</span>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(item.product)}
                                            className="w-12 h-12 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary hover:scale-110 active:scale-95 transition-all shadow-sm"
                                        >
                                            <FiShoppingCart size={18} />
                                        </button>
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
