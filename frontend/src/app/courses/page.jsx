"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    FiSearch, FiFilter, FiStar, FiClock, FiUsers, FiPlay,
    FiBook, FiGrid, FiList, FiChevronDown, FiLoader
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { courseService } from "@/services/api";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");
    const [sortBy, setSortBy] = useState("popular");

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await courseService.getAll({ status: "published" });
                if (response.success && response.data) {
                    setCourses(response.data);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // Filter and sort courses
    const filteredCourses = courses
        .filter(c => {
            const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
            const matchLevel = levelFilter === "all" || c.level === levelFilter;
            return matchSearch && matchLevel;
        })
        .sort((a, b) => {
            if (sortBy === "popular") return (b.totalEnrollments || 0) - (a.totalEnrollments || 0);
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "price-low") return (a.discountPrice || a.price) - (b.discountPrice || b.price);
            if (sortBy === "price-high") return (b.discountPrice || b.price) - (a.discountPrice || a.price);
            if (sortBy === "rating") return (b.averageRating || 0) - (a.averageRating || 0);
            return 0;
        });

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-32 pb-20 overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
                </div>

                <div className="container relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center text-white max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                            <FiBook className="w-4 h-4" />
                            Learn from Industry Experts
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Master New Skills with Our Courses
                        </h1>
                        <p className="text-lg md:text-xl opacity-90 mb-8">
                            High-quality video courses in Bangla & English. Start learning today and build your career.
                        </p>

                        {/* Search Bar */}
                        <div className="flex items-center bg-white rounded-2xl shadow-2xl p-2 max-w-xl mx-auto">
                            <div className="flex items-center flex-1 px-4">
                                <FiSearch className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for courses..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 ml-3 py-3 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
                                />
                            </div>
                            <button className="btn btn-primary">Search</button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Courses Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container">
                    {/* Filters Bar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <p className="text-gray-600 dark:text-gray-300">
                                <span className="font-bold text-gray-900 dark:text-white">{filteredCourses.length}</span> courses found
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Level Filter */}
                            <select
                                value={levelFilter}
                                onChange={(e) => setLevelFilter(e.target.value)}
                                className="input py-2 pr-10"
                            >
                                <option value="all">All Levels</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>

                            {/* Sort By */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="input py-2 pr-10"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="newest">Newest First</option>
                                <option value="rating">Highest Rated</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>

                            {/* View Mode */}
                            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2 rounded ${viewMode === "grid" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
                                >
                                    <FiGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2 rounded ${viewMode === "list" ? "bg-white dark:bg-gray-600 shadow" : ""}`}
                                >
                                    <FiList className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Course Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <FiLoader className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-20">
                            <FiBook className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No courses found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        <div className={viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            : "space-y-4"
                        }>
                            {filteredCourses.map((course, index) => (
                                <CourseCard key={course._id} course={course} index={index} viewMode={viewMode} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </>
    );
}

// Course Card Component
function CourseCard({ course, index, viewMode }) {
    const discount = course.price > 0 && course.discountPrice
        ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
        : 0;

    if (viewMode === "list") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
            >
                <Link
                    href={`/courses/${course.slug || course._id}`}
                    className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
                >
                    {/* Thumbnail */}
                    <div className="relative w-full md:w-72 h-48 md:h-auto flex-shrink-0">
                        <img
                            src={course.thumbnail || "/placeholder-course.jpg"}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {course.isFree && (
                            <span className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                FREE
                            </span>
                        )}
                        {discount > 0 && (
                            <span className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${course.level === "beginner" ? "bg-green-100 text-green-700" :
                                    course.level === "intermediate" ? "bg-yellow-100 text-yellow-700" :
                                        "bg-red-100 text-red-700"
                                }`}>
                                {course.level}
                            </span>
                            <span className="text-sm text-gray-500 capitalize">{course.language || "Bangla"}</span>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                        </h3>

                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.shortDescription}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                                <FiClock className="w-4 h-4" />
                                {course.totalDuration || 0} min
                            </span>
                            <span className="flex items-center gap-1">
                                <FiBook className="w-4 h-4" />
                                {course.totalLessons || 0} lessons
                            </span>
                            <span className="flex items-center gap-1">
                                <FiUsers className="w-4 h-4" />
                                {course.totalEnrollments || 0} students
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <FiStar className="w-5 h-5 text-amber-500 fill-amber-500" />
                                <span className="font-bold">{course.averageRating?.toFixed(1) || "0.0"}</span>
                                <span className="text-gray-400">({course.totalReviews || 0})</span>
                            </div>
                            <div className="text-right">
                                {course.isFree ? (
                                    <span className="text-2xl font-bold text-emerald-600">Free</span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {discount > 0 && (
                                            <span className="text-gray-400 line-through">৳{course.price}</span>
                                        )}
                                        <span className="text-2xl font-bold text-primary">
                                            ৳{course.discountPrice || course.price}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
        >
            <Link
                href={`/courses/${course.slug || course._id}`}
                className="block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group"
            >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={course.thumbnail || "/placeholder-course.jpg"}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                            <FiPlay className="w-6 h-6 text-primary ml-1" />
                        </div>
                    </div>
                    {course.isFree && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                            FREE
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                            {discount}% OFF
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${course.level === "beginner" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                course.level === "intermediate" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                            {course.level}
                        </span>
                    </div>

                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                    </h3>

                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                            <FiBook className="w-4 h-4" />
                            {course.totalLessons || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            {Math.round((course.totalDuration || 0) / 60)}h
                        </span>
                        <span className="flex items-center gap-1">
                            <FiUsers className="w-4 h-4" />
                            {course.totalEnrollments || 0}
                        </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-sm">{course.averageRating?.toFixed(1) || "0.0"}</span>
                        </div>
                        <div>
                            {course.isFree ? (
                                <span className="text-lg font-bold text-emerald-600">Free</span>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {discount > 0 && (
                                        <span className="text-sm text-gray-400 line-through">৳{course.price}</span>
                                    )}
                                    <span className="text-lg font-bold text-primary">
                                        ৳{course.discountPrice || course.price}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
