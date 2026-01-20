"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FiSearch, FiCalendar, FiClock, FiUser, FiArrowRight, FiTag,
    FiEye, FiHeart, FiMessageCircle, FiChevronDown
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";

// Blog Categories
const categories = [
    { name: "All", nameBn: "সব" },
    { name: "Design", nameBn: "ডিজাইন" },
    { name: "Development", nameBn: "ডেভেলপমেন্ট" },
    { name: "Marketing", nameBn: "মার্কেটিং" },
    { name: "Business", nameBn: "বিজনেস" },
    { name: "Tutorials", nameBn: "টিউটোরিয়াল" },
];

// Mock blog data
const mockBlogs = [
    {
        _id: "1",
        title: "10 Essential UI/UX Design Principles Every Designer Should Know",
        titleBn: "প্রতিটি ডিজাইনারের জানা উচিত এমন ১০টি অপরিহার্য UI/UX ডিজাইন নীতি",
        slug: "essential-ui-ux-design-principles",
        excerpt: "Learn the fundamental principles that will help you create better user experiences and interfaces.",
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
        category: "Design",
        author: { name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
        createdAt: "2024-01-15",
        readTime: "8 min",
        views: 2340,
        likes: 189,
        comments: 45
    },
    {
        _id: "2",
        title: "Getting Started with React Native in 2024",
        titleBn: "২০২৪ সালে React Native দিয়ে শুরু করা",
        slug: "getting-started-react-native-2024",
        excerpt: "A comprehensive guide to building mobile applications with React Native.",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        category: "Development",
        author: { name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        createdAt: "2024-01-12",
        readTime: "12 min",
        views: 3456,
        likes: 267,
        comments: 78
    },
    {
        _id: "3",
        title: "How to Build a Successful Online Course Business",
        titleBn: "কীভাবে একটি সফল অনলাইন কোর্স ব্যবসা তৈরি করবেন",
        slug: "build-successful-online-course-business",
        excerpt: "Tips and strategies for creating, marketing, and selling online courses.",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
        category: "Business",
        author: { name: "Emily Brown", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
        createdAt: "2024-01-10",
        readTime: "10 min",
        views: 1890,
        likes: 145,
        comments: 32
    },
    {
        _id: "4",
        title: "The Complete Guide to Figma Auto Layout",
        titleBn: "Figma Auto Layout এর সম্পূর্ণ গাইড",
        slug: "complete-guide-figma-auto-layout",
        excerpt: "Master auto layout in Figma to create responsive and flexible designs.",
        thumbnail: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=800",
        category: "Tutorials",
        author: { name: "Alex Kim", avatar: "https://randomuser.me/api/portraits/men/75.jpg" },
        createdAt: "2024-01-08",
        readTime: "15 min",
        views: 4567,
        likes: 389,
        comments: 92
    },
];

export default function BlogPage() {
    const { language } = useLanguage();
    const [blogs, setBlogs] = useState(mockBlogs);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    // Filter and sort
    const filteredBlogs = blogs
        .filter(blog => {
            if (selectedCategory !== "All" && blog.category !== selectedCategory) return false;
            if (search && !blog.title?.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    // Featured post (first one)
    const featuredPost = filteredBlogs[0];
    const otherPosts = filteredBlogs.slice(1);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    <motion.div className="text-center max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <FiMessageCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'ব্লগ' : 'Blog'}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-heading uppercase">
                            {language === 'bn' ? 'সর্বশেষ' : 'LATEST'}
                            <span className="text-primary"> {language === 'bn' ? 'আর্টিকেল' : 'ARTICLES'}</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn' ? 'ডিজাইন, ডেভেলপমেন্ট এবং বিজনেস সম্পর্কে সর্বশেষ আর্টিকেল পড়ুন।' : 'Read the latest articles about design, development, and business.'}
                        </p>
                        <div className="relative max-w-xl mx-auto">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={language === 'bn' ? 'আর্টিকেল খুঁজুন...' : 'Search articles...'} className="w-full pl-14 pr-6 py-4 bg-gray-100 dark:bg-gray-900 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            {categories.map((cat) => (
                                <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.name ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>
                                    {language === 'bn' ? cat.nameBn : cat.name}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm font-medium cursor-pointer focus:outline-none">
                                <option value="newest">{language === 'bn' ? 'নতুন' : 'Newest'}</option>
                                <option value="popular">{language === 'bn' ? 'জনপ্রিয়' : 'Popular'}</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="py-8">
                    <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group relative rounded-3xl overflow-hidden">
                            <Link href={`/blog/${featuredPost.slug}`}>
                                <div className="relative aspect-[21/9] overflow-hidden">
                                    <img src={featuredPost.thumbnail} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                                        <span className="inline-block px-3 py-1 bg-primary text-black text-xs font-bold uppercase rounded-full mb-4">{featuredPost.category}</span>
                                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 max-w-3xl line-clamp-2">
                                            {language === 'bn' ? featuredPost.titleBn : featuredPost.title}
                                        </h2>
                                        <p className="text-white/80 text-lg max-w-2xl mb-6 line-clamp-2">{featuredPost.excerpt}</p>
                                        <div className="flex items-center gap-6 text-white/80">
                                            <div className="flex items-center gap-2">
                                                <img src={featuredPost.author?.avatar} alt="" className="w-8 h-8 rounded-full" />
                                                <span>{featuredPost.author?.name}</span>
                                            </div>
                                            <span className="flex items-center gap-1"><FiCalendar className="w-4 h-4" />{featuredPost.createdAt}</span>
                                            <span className="flex items-center gap-1"><FiClock className="w-4 h-4" />{featuredPost.readTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Blog Grid */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {otherPosts.map((blog, index) => (
                            <BlogCard key={blog._id} blog={blog} index={index} language={language} />
                        ))}
                    </div>

                    {filteredBlogs.length > 0 && (
                        <div className="text-center mt-12">
                            <button className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold uppercase rounded-full hover:bg-primary hover:text-black transition-all">
                                {language === 'bn' ? 'আরো দেখুন' : 'Load More'} <FiArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
}

function BlogCard({ blog, index, language }) {
    return (
        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all hover:shadow-xl">
            <Link href={`/blog/${blog.slug}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white dark:bg-gray-800 text-xs font-bold uppercase rounded-full">{blog.category}</span>
                </div>
            </Link>
            <div className="p-6">
                <Link href={`/blog/${blog.slug}`}>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {language === 'bn' ? blog.titleBn : blog.title}
                    </h3>
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <img src={blog.author?.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{blog.author?.name}</p>
                            <p className="text-xs text-gray-500">{blog.createdAt}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><FiEye className="w-3.5 h-3.5" />{blog.views}</span>
                        <span className="flex items-center gap-1"><FiHeart className="w-3.5 h-3.5" />{blog.likes}</span>
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
