"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight, FiDownload } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function Portfolio() {
    const { t } = useLanguage();

    const portfolioData = [
        {
            titleKey: "premiumUIKit",
            tags: ["UI Kit", "Figma"],
            price: "$49",
            downloads: "2.4K",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200"
        },
        {
            titleKey: "creativeFontCollection",
            tags: ["Fonts", "Typography"],
            price: "$29",
            downloads: "5.1K",
            image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=1200"
        },
        {
            titleKey: "socialMediaTemplates",
            tags: ["Templates", "Instagram"],
            price: "$35",
            downloads: "3.8K",
            image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200"
        },
        {
            titleKey: "brandIdentityPack",
            tags: ["Branding", "Logo"],
            price: "$59",
            downloads: "1.9K",
            image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200"
        }
    ];

    return (
        <section className="py-20 bg-white dark:bg-gray-950">
            <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-[2px] bg-primary" />
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('featured')}</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9]">
                            {t('trending')}<br />
                            <span className="text-primary">{t('products')}</span>
                        </h2>
                    </motion.div>

                    <motion.button
                        className="w-28 h-28 rounded-full border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white font-bold uppercase text-xs tracking-wider hover:bg-primary hover:border-primary hover:text-black transition-all self-start flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        {t('viewAll')}
                    </motion.button>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {portfolioData.map((product, index) => (
                        <motion.div
                            key={index}
                            className="group cursor-pointer"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Image */}
                            <div className="relative h-[400px] rounded-3xl overflow-hidden mb-6">
                                <img
                                    src={product.image}
                                    alt={t(product.titleKey)}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                                {/* Price Badge */}
                                <div className="absolute top-6 left-6 bg-primary text-black px-4 py-2 rounded-full font-bold text-lg">
                                    {product.price}
                                </div>

                                {/* Arrow Button */}
                                <div className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all">
                                    <FiArrowUpRight size={24} className="text-black" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex items-start justify-between">
                                <div>
                                    {/* Tags */}
                                    <div className="flex gap-3 mb-3">
                                        {product.tags.map((tag, i) => (
                                            <span key={i} className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {tag}{i < product.tags.length - 1 ? " /" : ""}
                                            </span>
                                        ))}
                                    </div>
                                    {/* Title */}
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-heading uppercase group-hover:text-primary transition-colors">
                                        {t(product.titleKey)}
                                    </h3>
                                </div>
                                {/* Downloads */}
                                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                                    <FiDownload size={16} />
                                    <span className="font-bold">{product.downloads}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
