"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
    FiCalendar, FiClock, FiUser, FiArrowLeft, FiArrowRight,
    FiHeart, FiShare2, FiBookmark, FiMessageCircle, FiEye,
    FiFacebook, FiTwitter, FiLinkedin, FiCopy
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

// Mock blog data
const mockBlog = {
    _id: "1",
    title: "10 Essential UI/UX Design Principles Every Designer Should Know",
    titleBn: "প্রতিটি ডিজাইনারের জানা উচিত এমন ১০টি অপরিহার্য UI/UX ডিজাইন নীতি",
    slug: "essential-ui-ux-design-principles",
    excerpt: "Learn the fundamental principles that will help you create better user experiences and interfaces.",
    content: `
        <h2>Introduction</h2>
        <p>Creating exceptional user experiences requires understanding and applying fundamental design principles. These principles have evolved over decades of research and practice, and they continue to guide designers in creating intuitive, accessible, and delightful interfaces.</p>
        
        <h2>1. Clarity is Key</h2>
        <p>The most important principle in UI/UX design is clarity. Users should never have to guess what something does or how to use it. Every element should have a clear purpose and be immediately understandable.</p>
        
        <h2>2. Consistency Creates Comfort</h2>
        <p>Consistent design patterns help users learn your interface faster and build confidence in using it. Use the same colors, typography, and interaction patterns throughout your product.</p>
        
        <h2>3. Feedback is Essential</h2>
        <p>Users need to know that their actions have been received and processed. Provide immediate, clear feedback for every interaction—whether it's a button click, form submission, or data loading.</p>
        
        <h2>4. Simplicity Over Complexity</h2>
        <p>Remove anything that doesn't serve a purpose. Every element should earn its place on the screen. If you can achieve the same result with fewer elements, do it.</p>
        
        <h2>5. Visual Hierarchy Guides Attention</h2>
        <p>Use size, color, contrast, and spacing to create a clear visual hierarchy. Users should be able to quickly identify what's most important on any given screen.</p>
        
        <h2>Conclusion</h2>
        <p>These principles form the foundation of good UI/UX design. Apply them consistently, and you'll create products that users love to use.</p>
    `,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200",
    category: "Design",
    tags: ["UI/UX", "Design", "Principles", "User Experience"],
    author: {
        name: "Sarah Johnson",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        bio: "Senior UI/UX Designer with 10+ years of experience creating digital products."
    },
    createdAt: "2024-01-15",
    readTime: "8 min",
    views: 2340,
    likes: 189,
    comments: 45
};

const relatedPosts = [
    { _id: "2", title: "Getting Started with React Native in 2024", slug: "getting-started-react-native-2024", thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400", category: "Development", readTime: "12 min" },
    { _id: "3", title: "How to Build a Successful Online Course Business", slug: "build-successful-online-course-business", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400", category: "Business", readTime: "10 min" },
    { _id: "4", title: "The Complete Guide to Figma Auto Layout", slug: "complete-guide-figma-auto-layout", thumbnail: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400", category: "Tutorials", readTime: "15 min" },
];

export default function BlogPostPage() {
    const params = useParams();
    const { language } = useLanguage();
    const [blog, setBlog] = useState(mockBlog);
    const [loading, setLoading] = useState(false);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleShare = async (platform) => {
        const url = window.location.href;
        if (platform === 'copy') {
            await navigator.clipboard.writeText(url);
            toast.success('Link copied!');
        } else if (platform === 'facebook') {
            window.open(`https://facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        } else if (platform === 'twitter') {
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${blog.title}`, '_blank');
        } else if (platform === 'linkedin') {
            window.open(`https://linkedin.com/shareArticle?url=${url}&title=${blog.title}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-24">
                <div className="absolute inset-0 h-[500px] overflow-hidden">
                    <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-950 via-white/50 dark:via-gray-950/50 to-transparent" />
                </div>
                <div className="container px-6 lg:px-12 max-w-[900px] mx-auto relative z-10 pt-[300px]">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary mb-6">
                            <FiArrowLeft className="w-4 h-4" />
                            {language === 'bn' ? 'ব্লগে ফিরুন' : 'Back to Blog'}
                        </Link>

                        <span className="inline-block px-3 py-1 bg-primary text-black text-xs font-bold uppercase rounded-full mb-4">{blog.category}</span>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            {language === 'bn' ? blog.titleBn : blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 mb-8">
                            <div className="flex items-center gap-3">
                                <img src={blog.author?.avatar} alt="" className="w-12 h-12 rounded-full" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{blog.author?.name}</p>
                                    <p className="text-sm">{blog.author?.bio?.substring(0, 50)}...</p>
                                </div>
                            </div>
                            <span className="flex items-center gap-1"><FiCalendar className="w-4 h-4" />{blog.createdAt}</span>
                            <span className="flex items-center gap-1"><FiClock className="w-4 h-4" />{blog.readTime}</span>
                            <span className="flex items-center gap-1"><FiEye className="w-4 h-4" />{blog.views}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[900px] mx-auto">
                    <div className="flex gap-8">
                        {/* Sidebar - Share Buttons */}
                        <div className="hidden lg:block sticky top-24 self-start space-y-3">
                            <button onClick={() => setLiked(!liked)} className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${liked ? 'bg-red-100 border-red-500 text-red-500' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                <FiHeart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                            </button>
                            <button onClick={() => setSaved(!saved)} className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${saved ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                                <FiBookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                            </button>
                            <div className="w-12 h-px bg-gray-200 dark:bg-gray-700" />
                            <button onClick={() => handleShare('facebook')} className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-blue-100 hover:border-blue-500 hover:text-blue-600 transition-colors">
                                <FiFacebook className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleShare('twitter')} className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-sky-100 hover:border-sky-500 hover:text-sky-600 transition-colors">
                                <FiTwitter className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleShare('linkedin')} className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-blue-100 hover:border-blue-600 hover:text-blue-700 transition-colors">
                                <FiLinkedin className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleShare('copy')} className="w-12 h-12 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                <FiCopy className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary" dangerouslySetInnerHTML={{ __html: blog.content }} />

                            {/* Tags */}
                            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-4">{language === 'bn' ? 'ট্যাগ' : 'Tags'}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags?.map((tag) => (
                                        <Link key={tag} href={`/blog?tag=${tag}`} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium hover:bg-primary hover:text-black transition-colors">
                                            {tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Share */}
                            <div className="lg:hidden mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setLiked(!liked)} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${liked ? 'bg-red-100 border-red-500 text-red-500' : 'border-gray-200'}`}>
                                        <FiHeart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} /> {blog.likes + (liked ? 1 : 0)}
                                    </button>
                                    <button onClick={() => handleShare('copy')} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200">
                                        <FiShare2 className="w-4 h-4" /> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{language === 'bn' ? 'সম্পর্কিত পোস্ট' : 'Related Posts'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((post) => (
                            <Link key={post._id} href={`/blog/${post.slug}`} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all">
                                <div className="aspect-[16/10] overflow-hidden">
                                    <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-5">
                                    <span className="text-xs font-bold uppercase text-primary">{post.category}</span>
                                    <h3 className="font-bold text-gray-900 dark:text-white mt-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                                    <p className="text-sm text-gray-500 mt-2">{post.readTime} read</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
