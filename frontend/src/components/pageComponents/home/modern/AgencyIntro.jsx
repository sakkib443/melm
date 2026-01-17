"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function AgencyIntro() {
    const { t } = useLanguage();

    return (
        <section className="py-20 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Image Collage */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {/* Large Image */}
                            <div className="col-span-2 h-[300px] rounded-3xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"
                                    alt="Graphic Design Templates"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            {/* Small Images */}
                            <div className="h-[200px] rounded-3xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600"
                                    alt="Branding Assets"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <div className="h-[200px] rounded-3xl overflow-hidden relative">
                                <img
                                    src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600"
                                    alt="Typography Collection"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                />
                                {/* Stats Badge */}
                                <div className="absolute bottom-4 right-4 bg-primary text-black px-6 py-3 rounded-full">
                                    <span className="text-2xl font-bold font-heading">5K+</span>
                                    <span className="text-sm ml-1">{t('designAssets')}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        {/* Label */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-[2px] bg-primary" />
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('aboutUs')}</span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[0.9] mb-8 font-heading uppercase">
                            {t('premiumDesign')}<br />
                            {t('designMarketplace')}<br />
                            <span className="text-primary">{t('marketplaceText')}</span>
                        </h2>

                        {/* Description */}
                        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8 max-w-lg">
                            {t('introDescription')}
                        </p>

                        {/* Stats */}
                        <div className="flex gap-12 mb-10">
                            <div>
                                <span className="text-5xl font-bold text-gray-900 dark:text-white font-heading">5K+</span>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('designAssets')}</p>
                            </div>
                            <div>
                                <span className="text-5xl font-bold text-gray-900 dark:text-white font-heading">500+</span>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('topDesigners')}</p>
                            </div>
                            <div>
                                <span className="text-5xl font-bold text-gray-900 dark:text-white font-heading">99%</span>
                                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('happyBuyers')}</p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <motion.button
                            className="group flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-primary hover:text-black transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {t('exploreAllAssets')}
                            <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
