"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight, FiPlus } from "react-icons/fi";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Services() {
    const [activeIndex, setActiveIndex] = useState(null);
    const { t } = useLanguage();

    const categoriesData = [
        {
            number: "01",
            titleKey: "graphicTemplates",
            descriptionKey: "graphicTemplatesDesc",
            featureKeys: ["socialMedia", "presentations", "printReady"]
        },
        {
            number: "02",
            titleKey: "fontsTypography",
            descriptionKey: "fontsTypographyDesc",
            featureKeys: ["displayFonts", "scriptFonts", "sansSerif"]
        },
        {
            number: "03",
            titleKey: "uiKitsMockups",
            descriptionKey: "uiKitsMockupsDesc",
            featureKeys: ["webUI", "mobileUI", "mockupsWord"]
        },
        {
            number: "04",
            titleKey: "illustrationsIcons",
            descriptionKey: "illustrationsIconsDesc",
            featureKeys: ["vectorIcons", "illustrationsWord", "threeDAassets"]
        },
        {
            number: "05",
            titleKey: "brandIdentity",
            descriptionKey: "brandIdentityDesc",
            featureKeys: ["logoTemplates", "brandKits", "stationery"]
        }
    ];

    return (
        <section className="py-20 bg-white dark:bg-gray-950">
            <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <motion.h2
                        className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9]"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {t('browseBy')}<br />
                        <span className="text-primary">{t('category')}</span>
                    </motion.h2>

                    <motion.button
                        className="flex items-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm hover:bg-primary hover:text-black transition-all self-start"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {t('viewAllCategories')}
                        <FiArrowUpRight size={18} />
                    </motion.button>
                </div>

                {/* Category List */}
                <div className="space-y-0">
                    {categoriesData.map((category, index) => (
                        <motion.div
                            key={index}
                            className="border-t border-gray-200 dark:border-gray-800 py-8 cursor-pointer group"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                {/* Number */}
                                <span className="text-6xl font-bold text-gray-200 dark:text-gray-800 font-heading group-hover:text-primary transition-colors">
                                    {category.number}
                                </span>

                                {/* Title */}
                                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-heading uppercase flex-1 group-hover:text-primary transition-colors">
                                    {t(category.titleKey)}
                                </h3>

                                {/* Features */}
                                <div className="hidden lg:flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                    {category.featureKeys.map((featureKey, i) => (
                                        <span key={i} className="flex items-center gap-2">
                                            <FiPlus size={12} className="text-primary" />
                                            {t(featureKey)}
                                        </span>
                                    ))}
                                </div>

                                {/* Arrow */}
                                <div className="w-12 h-12 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                    <FiArrowUpRight className="text-gray-500 dark:text-gray-400 group-hover:text-black transition-colors" size={20} />
                                </div>
                            </div>

                            {/* Expanded Content */}
                            {activeIndex === index && (
                                <motion.div
                                    className="mt-6 pl-0 md:pl-24"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl leading-relaxed">
                                        {t(category.descriptionKey)}
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
