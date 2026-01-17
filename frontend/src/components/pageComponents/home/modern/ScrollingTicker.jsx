"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function ScrollingTicker() {
    const { t } = useLanguage();

    const tickerKeys = [
        "templates",
        "fonts",
        "graphicsWord",
        "icons",
        "illustrations",
        "mockups",
        "uiKitsWord",
        "branding"
    ];

    return (
        <section className="py-6 bg-primary overflow-hidden">
            <div className="relative">
                <motion.div
                    className="flex gap-12 whitespace-nowrap"
                    animate={{ x: [0, -1920] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {/* Duplicate items for seamless loop */}
                    {[...tickerKeys, ...tickerKeys, ...tickerKeys].map((key, index) => (
                        <div key={index} className="flex items-center gap-12">
                            <span className="text-3xl md:text-4xl font-bold text-black font-heading uppercase tracking-wider">
                                {t(key)}
                            </span>
                            <span className="text-black text-2xl">★</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
