"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight, FiArrowRight } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function BlogSection() {
    const { t } = useLanguage();

    const blogPosts = [
        {
            tagKey: "webDesign",
            titleKey: "blogTitle1",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"
        },
        {
            tagKey: "webDesign",
            titleKey: "blogTitle2",
            image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800"
        }
    ];

    return (
        <section className="py-24 bg-white dark:bg-gray-950">
            <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">

                {/* Header Area */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-20 relative">

                    {/* Decorative Half Circle */}
                    <div className="absolute -left-12 top-10 hidden xl:block">
                        <div className="w-12 h-6 bg-primary rounded-t-full" />
                        <div className="w-12 h-6 bg-black dark:bg-white rounded-b-full mt-1" />
                    </div>

                    <div className="max-w-2xl">
                        <motion.h2
                            className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9] mb-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            {t('weProvide')}<br />
                            <span className="text-gray-900 dark:text-white">{t('solutionWord')}</span>
                        </motion.h2>
                        <motion.p
                            className="text-gray-500 dark:text-gray-400 max-w-md text-lg"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            {t('blogDescription')}
                        </motion.p>
                    </div>

                    {/* Circular CTA */}
                    <motion.div
                        className="relative w-36 h-36 flex-shrink-0"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 border border-gray-100 dark:border-gray-800 rounded-full animate-spin-slow" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">{t('viewOurBlog')}</span>
                            <FiArrowUpRight size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                    </motion.div>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {blogPosts.map((post, index) => (
                        <motion.div
                            key={index}
                            className="flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-[32px] overflow-hidden border border-gray-100 dark:border-gray-800 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Image Part */}
                            <div className="md:w-2/5 h-[300px] md:h-auto overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={t(post.titleKey)}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            {/* Content Part */}
                            <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                                <div className="mb-4">
                                    <span className="px-4 py-1.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                        {t(post.tagKey)}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-tight mb-8 group-hover:text-primary transition-colors">
                                    {t(post.titleKey)}
                                </h3>

                                <motion.button
                                    className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest self-start group/btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    {t('readMore')}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
