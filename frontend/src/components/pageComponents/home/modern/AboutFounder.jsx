"use client";

import { motion } from "framer-motion";
import { FiAward, FiUsers, FiDownload, FiStar, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutFounder() {
    const { t } = useLanguage();

    const stats = [
        { icon: FiAward, value: "14+", labelKey: "yearsExperience" },
        { icon: FiUsers, value: "2K+", labelKey: "happyClients" },
        { icon: FiDownload, value: "10K+", labelKey: "downloads" },
        { icon: FiStar, value: "4.9", labelKey: "avgRating" },
    ];

    return (
        <section className="py-24 bg-[#F8F8F8] dark:bg-gray-900 overflow-hidden relative">

            {/* Professional Background Texture */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
                style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Floating Decorative Shapes */}
            <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-primary/5 blur-2xl" />
            <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[#C4EE18]/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full border border-gray-200 dark:border-gray-800" />

            {/* Grid Lines */}
            <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gray-200/50 dark:bg-gray-800/50" />
            <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gray-200/50 dark:bg-gray-800/50" />

            <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* Left: Image with decorative elements */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Main Image Container */}
                        <div className="relative max-w-[480px] mx-auto lg:mx-0">
                            {/* Background Shape */}
                            <div className="absolute -top-4 -left-4 w-full h-full bg-primary/10 rounded-[32px]" />

                            {/* Image */}
                            <div className="relative rounded-[32px] overflow-hidden shadow-2xl">
                                <img
                                    src="/images/abu-sayeed.jpg"
                                    alt="Abu Sayeed - Founder"
                                    className="w-full h-[500px] object-cover object-top"
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </div>

                            {/* Floating Badge - Experience */}
                            <motion.div
                                className="absolute -right-6 top-20 bg-white dark:bg-gray-800 px-6 py-4 rounded-2xl shadow-xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3 }}
                            >
                                <p className="text-4xl font-bold text-primary font-heading">14+</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Years of<br />Experience</p>
                            </motion.div>

                            {/* Floating Badge - Projects */}
                            <motion.div
                                className="absolute -left-4 bottom-32 bg-[#C4EE18] px-6 py-4 rounded-2xl shadow-xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                <p className="text-4xl font-bold text-black font-heading">500+</p>
                                <p className="text-sm text-black/70">Projects<br />Completed</p>
                            </motion.div>

                            {/* Decorative Circle */}
                            <div className="absolute -bottom-8 right-20 w-16 h-16 rounded-full border-4 border-primary" />
                        </div>
                    </motion.div>

                    {/* Right: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Section Label */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[2px] bg-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">{t('aboutMe')}</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.0] mb-6 font-heading uppercase">
                            {t('creativeDesigner')}
                            <span className="block text-primary">{t('andEntrepreneur')}</span>
                        </h2>

                        {/* Description */}
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                            {t('aboutFounderDesc1')}
                        </p>

                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                            {t('aboutFounderDesc2')}
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-shadow"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white font-heading">{stat.value}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">{t(stat.labelKey)}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <Link href="/about">
                            <motion.button
                                className="group flex items-center gap-3 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-full hover:bg-primary hover:text-black transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {t('learnMoreAboutMe')}
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
