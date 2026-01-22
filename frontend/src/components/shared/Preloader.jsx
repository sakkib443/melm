"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Animation for the percentage counter
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    // Add a small delay after reaching 100% before starting the exit animation
                    setTimeout(() => setIsLoading(false), 500);
                    return 100;
                }
                // Random increment for a more "realistic" loading feel
                const increment = Math.floor(Math.random() * 15) + 5;
                return Math.min(prev + increment, 100);
            });
        }, 150);

        return () => clearInterval(interval);
    }, []);

    const svgVariants = {
        initial: {
            d: "M 0 0 V 100 Q 50 100 100 100 V 0 Z",
        },
        exit: {
            d: [
                "M 0 0 V 100 Q 50 100 100 100 V 0 Z",
                "M 0 0 V 50 Q 50 25 100 50 V 0 Z",
                "M 0 0 V 0 Q 50 0 100 0 V 0 Z"
            ],
            transition: {
                duration: 1.0, // Slightly faster
                ease: "linear", // Constant speed - no slowing down
                delay: 0.1
            }
        }
    };

    const containerVariants = {
        initial: { opacity: 1 },
        exit: {
            opacity: 1,
            transition: { duration: 1.2 }
        }
    };

    const contentVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            y: -100,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
    };

    return (
        <AnimatePresence mode="wait">
            {isLoading && (
                <motion.div
                    key="preloader"
                    variants={containerVariants}
                    initial="initial"
                    animate="initial"
                    exit="exit"
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* SVG Curtain with Curved Wave Animation */}
                    <svg
                        className="absolute top-0 w-full h-[100vh] fill-[#0a0a0a]"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <motion.path
                            variants={svgVariants}
                            initial="initial"
                            exit="exit"
                        />
                    </svg>

                    {/* Content Container */}
                    <motion.div
                        variants={contentVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Logo */}
                        <div className="flex items-center gap-2 mb-8 scale-110">
                            <span className="text-7xl font-black text-primary leading-none">ʌ</span>
                            <span className="text-4xl text-white mx-1">—›</span>
                            <span className="text-5xl font-black text-white tracking-[0.25em] uppercase">
                                SAKIB
                            </span>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex flex-col items-center">
                            <div className="h-10 flex items-center justify-center">
                                <motion.span
                                    className="text-white text-6xl font-light tracking-tighter tabular-nums"
                                    initial={{ y: 50 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    {progress}%
                                </motion.span>
                            </div>

                            {/* Visual Progress Bar */}
                            <div className="mt-6 w-64 h-[1px] bg-white/10 relative overflow-hidden">
                                <motion.div
                                    className="absolute left-0 top-0 h-full bg-primary"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.3, ease: "linear" }}
                                />
                            </div>

                            <motion.p
                                className="mt-4 text-[10px] text-white/40 tracking-[0.5em] uppercase font-bold"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                            >
                                Processing Assets
                            </motion.p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
