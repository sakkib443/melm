"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectCounter() {
    const ref = useRef(null);
    const { t, language } = useLanguage();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

    return (
        <section
            ref={ref}
            className="py-32 bg-gray-900 dark:bg-gray-950 overflow-hidden relative"
        >
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }}
            />

            <motion.div
                className="container px-6 lg:px-12 max-w-[1400px] mx-auto text-center"
                style={{ scale, opacity }}
            >
                <motion.h2
                    className="text-6xl md:text-8xl lg:text-[150px] xl:text-[200px] font-bold text-white font-heading uppercase leading-[0.85] tracking-tight"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-primary">{language === 'bn' ? '৫০K+' : '50K+'}</span> {t('designsDownloaded')}<br />
                    {t('downloaded')}
                </motion.h2>

                {/* Decorative Elements */}
                <div className="flex justify-center gap-8 mt-12">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                    <div className="w-3 h-3 rounded-full bg-white/30" />
                </div>
            </motion.div>
        </section>
    );
}
