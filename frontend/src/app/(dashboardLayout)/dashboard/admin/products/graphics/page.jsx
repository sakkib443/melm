"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiPlus,
    FiSearch,
    FiFilter,
    FiMoreVertical,
    FiEdit,
    FiTrash2,
    FiEye,
    FiDownload,
    FiStar,
    FiHeart,
    FiRefreshCw,
    FiImage,
} from "react-icons/fi";
import { graphicsService } from "@/services/api";

export default function GraphicsPage() {
    const [graphics, setGraphics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");
    const [selectedItems, setSelectedItems] = useState([]);

    // Mock data for demo
    const mockGraphics = [
        {
            _id: "1",
            title: "Premium Logo Template Bundle",
            slug: "premium-logo-template-bundle",
            thumbnail: "https://via.placeholder.com/400x300/6366f1/ffffff?text=Logo+Templates",
            price: 2999,
            salePrice: 1999,
            type: "logo",
            status: "published",
            downloads: 234,
            rating: 4.8,
            likes: 89,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "2",
            title: "Social Media Graphics Pack",
            slug: "social-media-graphics-pack",
            thumbnail: "https://via.placeholder.com/400x300/ec4899/ffffff?text=Social+Media",
            price: 1499,
            salePrice: null,
            type: "social",
            status: "published",
            downloads: 567,
            rating: 4.9,
            likes: 156,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "3",
            title: "Business Card Designs",
            slug: "business-card-designs",
            thumbnail: "https://via.placeholder.com/400x300/10b981/ffffff?text=Business+Cards",
            price: 999,
            salePrice: 499,
            type: "business-card",
            status: "draft",
            downloads: 123,
            rating: 4.5,
            likes: 45,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "4",
            title: "Flyer & Poster Templates",
            slug: "flyer-poster-templates",
            thumbnail: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=Flyers",
            price: 1999,
            salePrice: null,
            type: "flyer",
            status: "published",
            downloads: 345,
            rating: 4.7,
            likes: 78,
            createdAt: new Date().toISOString(),
        },
    ];

    const fetchGraphics = async () => {
        setLoading(true);
        try {
            const response = await graphicsService.getAll();
            if (response.success && response.data) {
                setGraphics(response.data);
            } else {
                setGraphics(mockGraphics);
            }
        } catch (error) {
            console.log("Using mock data");
            setGraphics(mockGraphics);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGraphics();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await graphicsService.delete(id);
            toast.success("Deleted successfully");
            fetchGraphics();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const filteredGraphics = graphics.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === "all" || item.status === filter;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "published":
                return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "draft":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case "pending":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                        <FiImage className="text-white text-lg" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Graphics</h1>
                        <p className="text-sm text-gray-500">{graphics.length} total items</p>
                    </div>
                </div>
                <Link href="/dashboard/admin/products/graphics/create" className="btn btn-primary">
                    <FiPlus className="w-4 h-4" />
                    Add New Graphics
                </Link>
            </div>

            {/* Filters */}
            <div className="card border border-gray-200 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search graphics..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input pl-10 w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        {["all", "published", "draft", "pending"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filter === f
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={fetchGraphics}
                        className="btn btn-ghost p-2.5"
                        title="Refresh"
                    >
                        <FiRefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="card overflow-hidden">
                            <div className="aspect-[4/3] skeleton" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 skeleton rounded w-3/4" />
                                <div className="h-4 skeleton rounded w-1/2" />
                                <div className="h-8 skeleton rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredGraphics.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                        <FiImage className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        No graphics found
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {searchQuery
                            ? "Try adjusting your search or filter"
                            : "Get started by adding your first graphics item"}
                    </p>
                    <Link href="/dashboard/admin/products/graphics/create" className="btn btn-primary inline-flex">
                        <FiPlus className="w-4 h-4" />
                        Add Graphics
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredGraphics.map((item, index) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card overflow-hidden group"
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {item.salePrice && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                                        SALE
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold capitalize ${getStatusBadge(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>
                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Link
                                        href={`/dashboard/admin/products/graphics/${item._id}`}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <FiEye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/dashboard/admin/products/graphics/create?edit=${item._id}`}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <FiEdit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        <FiDownload className="w-3 h-3" />
                                        {item.downloads}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiStar className="w-3 h-3 text-amber-500" />
                                        {item.rating}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiHeart className="w-3 h-3 text-red-500" />
                                        {item.likes}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {item.salePrice ? (
                                            <>
                                                <span className="text-lg font-bold text-primary">৳{item.salePrice}</span>
                                                <span className="text-sm text-gray-400 line-through">৳{item.price}</span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">৳{item.price}</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 capitalize">{item.type}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
