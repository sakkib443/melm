"use client";

import { motion } from "framer-motion";
import { FiDownload, FiLayers, FiShield } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

export default function ExpertiseCards() {
    const { t } = useLanguage();

    const expertiseData = [
        {
            icon: FiDownload,
            titleKey: "instantDownload",
            descriptionKey: "instantDownloadDesc"
        },
        {
            icon: FiLayers,
            titleKey: "premiumQuality",
            descriptionKey: "premiumQualityDesc"
        },
        {
            icon: FiShield,
            titleKey: "commercialLicense",
            descriptionKey: "commercialLicenseDesc"
        }
    ];

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
            <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {expertiseData.map((item, index) => (
                        <motion.div
                            key={index}
                            className="bg-white dark:bg-gray-800 p-10 rounded-3xl border border-gray-100 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all group"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-black transition-all">
                                <item.icon size={28} className="text-primary group-hover:text-black transition-colors" />
                            </div>

                            {/* Title */}
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-heading uppercase">
                                {t(item.titleKey)}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                                {t(item.descriptionKey)}
                            </p>

                            {/* Decorative Line */}
                            <div className="mt-6 flex items-center gap-2">
                                <div className="w-8 h-[2px] bg-primary" />
                                <div className="w-4 h-[2px] bg-gray-300 dark:bg-gray-600" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
