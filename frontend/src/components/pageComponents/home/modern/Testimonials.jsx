"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiStar } from "react-icons/fi";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Testimonials() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { t } = useLanguage();

    const testimonialsData = [
        {
            quoteKey: "testimonial1",
            author: "Sarah Johnson",
            titleKey: "freelanceDesigner",
            rating: 5,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
        },
        {
            quoteKey: "testimonial2",
            author: "Michael Chen",
            titleKey: "creativeDirector",
            rating: 5,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
        },
        {
            quoteKey: "testimonial3",
            author: "Emily Rodriguez",
            titleKey: "founderTechStart",
            rating: 5,
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
        }
    ];

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length);
    };

    return (
        <section className="py-20 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Quote */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        {/* Label */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-[2px] bg-primary" />
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">{t('customerReviews')}</span>
                        </div>

                        {/* Quote */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Rating Stars */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(testimonialsData[currentIndex].rating)].map((_, i) => (
                                        <FiStar key={i} size={20} className="text-primary fill-primary" />
                                    ))}
                                </div>

                                <p className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-8 font-heading">
                                    "{t(testimonialsData[currentIndex].quoteKey)}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-1 h-12 bg-primary" />
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white">{testimonialsData[currentIndex].author}</h4>
                                        <p className="text-gray-500 dark:text-gray-400">{t(testimonialsData[currentIndex].titleKey)}</p>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex items-center gap-4 mt-10">
                            <button
                                onClick={prev}
                                className="w-14 h-14 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all"
                            >
                                <FiArrowLeft size={20} />
                            </button>
                            <button
                                onClick={next}
                                className="w-14 h-14 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all"
                            >
                                <FiArrowRight size={20} />
                            </button>
                            <span className="ml-4 text-gray-400 font-bold">
                                <span className="text-gray-900 dark:text-white">0{currentIndex + 1}</span> / 0{testimonialsData.length}
                            </span>
                        </div>
                    </motion.div>

                    {/* Right: Image */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                className="relative h-[500px] rounded-3xl overflow-hidden"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={testimonialsData[currentIndex].image}
                                    alt={testimonialsData[currentIndex].author}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Decorative */}
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-3xl -z-10" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
