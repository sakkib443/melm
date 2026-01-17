"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

const logos = [
    { name: "Google", letter: "G" },
    { name: "Microsoft", letter: "M" },
    { name: "Apple", letter: "A" },
    { name: "Amazon", letter: "Am" },
    { name: "Meta", letter: "Me" },
    { name: "Netflix", letter: "N" },
    { name: "Spotify", letter: "S" },
    { name: "Tesla", letter: "T" }
];

export default function ClientLogos() {
    const { t } = useLanguage();

    return (
        <section className="py-16 bg-white dark:bg-gray-950 border-y border-gray-100 dark:border-gray-800">
            <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <motion.p
                        className="text-gray-500 dark:text-gray-400 uppercase tracking-widest text-sm font-bold"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {t('trustedByIndustry')}
                    </motion.p>
                </div>

                {/* Logo Grid */}
                <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center">
                    {logos.map((logo, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center justify-center h-16 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 0.5, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <div className="text-3xl font-bold text-gray-400 dark:text-gray-600 font-heading hover:text-primary transition-colors">
                                {logo.letter}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Awards Text */}
                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-gray-400 dark:text-gray-500 text-sm">
                        {t('recognizedBy')} <span className="text-primary font-bold">Awwwards</span>, <span className="text-primary font-bold">CSS Design Awards</span>, {t('and')} <span className="text-primary font-bold">FWA</span>
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
