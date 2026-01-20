"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FiSearch, FiFilter, FiStar, FiClock, FiUsers, FiPlay,
    FiBook, FiGrid, FiList, FiChevronDown, FiLoader, FiShoppingCart,
    FiArrowRight, FiEye
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { courseService, cartService } from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";

// Level categories for filtering
const levelCategories = [
    { name: "All", nameBn: "সব" },
    { name: "beginner", nameBn: "বিগিনার" },
    { name: "intermediate", nameBn: "ইন্টারমিডিয়েট" },
    { name: "advanced", nameBn: "এডভান্সড" },
];

export default function CoursesPage() {
    const { t, language } = useLanguage();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("grid");
    const [search, setSearch] = useState("");
    const [levelFilter, setLevelFilter] = useState("All");
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
            const matchLevel = levelFilter === "All" || c.level === levelFilter;
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
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Hero Section - Modern Style */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                {/* Background Pattern - Dot Grid like Graphics page */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'প্রিমিয়াম কোর্স' : 'Premium Courses'}
                            </span>
                        </div>

                        {/* Title - Uppercase like Graphics page */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9] mb-6">
                            {language === 'bn' ? 'স্কিল' : 'MASTER'}
                            <br />
                            <span className="text-primary">{language === 'bn' ? 'শিখুন।' : 'NEW SKILLS.'}</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                            {language === 'bn'
                                ? 'বাংলা ও ইংরেজিতে হাই-কোয়ালিটি ভিডিও কোর্স। আজই শেখা শুরু করুন এবং আপনার ক্যারিয়ার গড়ুন।'
                                : 'High-quality video courses in Bangla & English. Start learning today and build your career.'}
                        </p>

                        {/* Search Bar - Rounded Full like Graphics page */}
                        <div className="relative max-w-2xl mx-auto">
                            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={language === 'bn' ? 'কোর্স খুঁজুন...' : 'Search courses...'}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full text-lg focus:outline-none focus:border-primary transition-colors"
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-primary text-black font-bold uppercase text-sm rounded-full hover:bg-primary/90 transition-colors">
                                {language === 'bn' ? 'খুঁজুন' : 'Search'}
                            </button>
                        </div>

                        {/* Stats - like Graphics page */}
                        <div className="flex items-center justify-center gap-8 mt-10">
                            <div className="text-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{language === 'bn' ? '১০০+' : '100+'}</span>
                                <p className="text-sm text-gray-500">{language === 'bn' ? 'কোর্স' : 'Courses'}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
                            <div className="text-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{language === 'bn' ? '৫K+' : '5K+'}</span>
                                <p className="text-sm text-gray-500">{language === 'bn' ? 'শিক্ষার্থী' : 'Students'}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 dark:bg-gray-800" />
                            <div className="text-center">
                                <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">{language === 'bn' ? '৪.৮' : '4.8'}</span>
                                <p className="text-sm text-gray-500">{language === 'bn' ? 'রেটিং' : 'Rating'}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Bar - Sticky like Graphics page */}
            <section className="sticky top-[72px] z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-y border-gray-100 dark:border-gray-800">
                <div className="container px-6 max-w-[1400px] mx-auto">
                    <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
                        {levelCategories.map((cat) => (
                            <button
                                key={cat.name}
                                onClick={() => setLevelFilter(cat.name)}
                                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${levelFilter === cat.name
                                    ? 'bg-primary text-black'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {language === 'bn' ? cat.nameBn : cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    {/* Toolbar */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                        <p className="text-gray-500 dark:text-gray-400">
                            {language === 'bn'
                                ? `${filteredCourses.length}টি কোর্স পাওয়া গেছে`
                                : `Showing ${filteredCourses.length} courses`}
                        </p>

                        <div className="flex items-center gap-4">
                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="popular">{language === 'bn' ? 'জনপ্রিয়' : 'Most Popular'}</option>
                                    <option value="newest">{language === 'bn' ? 'নতুন' : 'Newest'}</option>
                                    <option value="price-low">{language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
                                    <option value="price-high">{language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
                                    <option value="rating">{language === 'bn' ? 'সেরা রেটিং' : 'Top Rated'}</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className={`p-2.5 rounded-full transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
                                >
                                    <FiGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className={`p-2.5 rounded-full transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-700 shadow-sm" : ""}`}
                                >
                                    <FiList className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Course Grid */}
                    {loading ? (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
                                    <div className="aspect-video skeleton" />
                                    <div className="p-5 space-y-3">
                                        <div className="h-4 skeleton rounded w-1/4" />
                                        <div className="h-5 skeleton rounded w-3/4" />
                                        <div className="h-4 skeleton rounded w-1/2" />
                                        <div className="h-8 skeleton rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                                <FiBook className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {language === 'bn' ? 'কোন কোর্স পাওয়া যায়নি' : 'No courses found'}
                            </h3>
                            <p className="text-gray-500">
                                {language === 'bn' ? 'অন্য কীওয়ার্ড দিয়ে খুঁজুন' : 'Try different keywords or filters'}
                            </p>
                        </div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                            {filteredCourses.map((course, index) => (
                                <CourseCard key={course._id} course={course} index={index} viewMode={viewMode} language={language} />
                            ))}
                        </div>
                    )}

                    {/* Load More */}
                    {filteredCourses.length > 0 && (
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase tracking-wider rounded-full hover:bg-primary hover:text-black transition-all">
                                {language === 'bn' ? 'আরো দেখুন' : 'Load More'}
                                <FiArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 dark:bg-black">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading uppercase mb-6">
                            {language === 'bn' ? 'ইন্সট্রাক্টর হতে চান?' : 'BECOME AN INSTRUCTOR?'}
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn'
                                ? 'আপনার দক্ষতা শেয়ার করুন এবং হাজার হাজার শিক্ষার্থীদের শেখান।'
                                : 'Share your expertise and teach thousands of students worldwide.'}
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all"
                        >
                            {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
                            <FiArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// Course Card Component - Matching Graphics page style
function CourseCard({ course, index, viewMode, language }) {
    const [addingToCart, setAddingToCart] = useState(false);

    const discount = course.price > 0 && course.discountPrice
        ? Math.round(((course.price - course.discountPrice) / course.price) * 100)
        : 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
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
                toast.success(language === 'bn' ? 'কার্টে যুক্ত হয়েছে!' : 'Added to cart!');
            }
        } catch (error) {
            toast.error(error.message || (language === 'bn' ? 'ব্যর্থ হয়েছে' : 'Failed to add'));
        } finally {
            setAddingToCart(false);
        }
    };

    const levelColors = {
        beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
        intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        advanced: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    };

    if (viewMode === "list") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 flex"
            >
                {/* Image */}
                <Link href={`/courses/${course.slug || course._id}`} className="relative w-72 flex-shrink-0">
                    <div className="relative h-full overflow-hidden">
                        <img
                            src={course.thumbnail || "/placeholder-course.jpg"}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Sale Badge */}
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full uppercase">
                                {discount}% OFF
                            </div>
                        )}
                        {course.isFree && (
                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase">
                                FREE
                            </div>
                        )}
                    </div>
                </Link>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-center">
                    {/* Level Badge */}
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 w-fit ${levelColors[course.level] || levelColors.beginner}`}>
                        {course.level}
                    </span>

                    {/* Title */}
                    <Link href={`/courses/${course.slug || course._id}`}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                        </h3>
                    </Link>

                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.shortDescription}</p>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center gap-1">
                            <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            {course.averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="flex items-center gap-1">
                            <FiUsers className="w-3.5 h-3.5" />
                            {course.totalEnrollments || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <FiBook className="w-3.5 h-3.5" />
                            {course.totalLessons || 0} lessons
                        </span>
                        <span className="flex items-center gap-1">
                            <FiClock className="w-3.5 h-3.5" />
                            {Math.round((course.totalDuration || 0) / 60)}h
                        </span>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            {course.isFree ? (
                                <span className="text-xl font-bold text-emerald-600">Free</span>
                            ) : discount > 0 ? (
                                <>
                                    <span className="text-xl font-bold text-primary">৳{course.discountPrice}</span>
                                    <span className="text-sm text-gray-400 line-through">৳{course.price}</span>
                                </>
                            ) : (
                                <span className="text-xl font-bold text-gray-900 dark:text-white">৳{course.price}</span>
                            )}
                        </div>
                        <Link
                            href={`/courses/${course.slug || course._id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full hover:bg-primary/90 transition-colors"
                        >
                            <FiPlay className="w-4 h-4" />
                            {language === 'bn' ? 'এনরোল' : 'Enroll'}
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid view - matching Graphics page card style
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
        >
            {/* Image */}
            <Link href={`/courses/${course.slug || course._id}`} className="relative block">
                <div className="relative aspect-video overflow-hidden">
                    <img
                        src={course.thumbnail || "/placeholder-course.jpg"}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Sale/Free Badge */}
                    {discount > 0 && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full uppercase">
                            {discount}% OFF
                        </div>
                    )}
                    {course.isFree && (
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase">
                            FREE
                        </div>
                    )}
                    {/* Quick Actions Overlay - Add to Cart */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                            <FiPlay className="w-5 h-5 ml-0.5" />
                        </button>
                        <button
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                            className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-black transition-colors disabled:opacity-50"
                        >
                            {addingToCart ? <FiLoader className="w-5 h-5 animate-spin" /> : <FiShoppingCart className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="p-5">
                {/* Level Badge */}
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${levelColors[course.level] || levelColors.beginner}`}>
                    {course.level}
                </span>

                {/* Title */}
                <Link href={`/courses/${course.slug || course._id}`}>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-2 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>
                </Link>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                        <FiStar className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {course.averageRating?.toFixed(1) || "0.0"}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiUsers className="w-3.5 h-3.5" />
                        {course.totalEnrollments || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <FiBook className="w-3.5 h-3.5" />
                        {course.totalLessons || 0}
                    </span>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        {course.isFree ? (
                            <span className="text-xl font-bold text-emerald-600">Free</span>
                        ) : discount > 0 ? (
                            <>
                                <span className="text-xl font-bold text-primary">৳{course.discountPrice}</span>
                                <span className="text-sm text-gray-400 line-through">৳{course.price}</span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-gray-900 dark:text-white">৳{course.price}</span>
                        )}
                    </div>
                    <Link
                        href={`/courses/${course.slug || course._id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-black text-sm font-bold rounded-full hover:bg-primary/90 transition-colors"
                    >
                        <FiPlay className="w-4 h-4" />
                        {language === 'bn' ? 'এনরোল' : 'Enroll'}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
