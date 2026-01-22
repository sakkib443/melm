"use client";

import { motion } from "framer-motion";
import { FiPlay, FiArrowDown } from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";

const avatars = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100"
];

export default function Hero() {
    const { t, language } = useLanguage();
    const isBn = language === 'bn';

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <section className="relative min-h-screen flex flex-col pt-54 pb-4 overflow-hidden bg-white dark:bg-gray-950">
            {/* Moving Background Glows */}
            <motion.div
                className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none"
                animate={{
                    x: [0, 30, 0],
                    y: [0, 20, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C4EE18]/10 rounded-full blur-[120px] pointer-events-none"
                animate={{
                    x: [0, -30, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            />\n            {/* Technical Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Dot Pattern */}
            <div
                className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04]"
                style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Floating Abstract Shapes */}
            <motion.div
                className="absolute top-40 right-[20%] w-12 h-12 border border-primary/20 rounded-lg pointer-events-none z-0"
                animate={{ rotate: 360, y: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-60 left-[15%] w-16 h-16 border-2 border-gray-200 dark:border-gray-800 rounded-full pointer-events-none z-0 opacity-20"
                animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />

            {/* Scroll Down Arrow */}
            <div className="hidden xl:flex absolute left-6 bottom-32 z-20 flex-col items-center">
                <motion.div
                    className="w-8 h-14 rounded-full border border-gray-300 dark:border-gray-700 flex items-center justify-center"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <FiArrowDown className="text-gray-400 dark:text-gray-600" size={16} />
                </motion.div>
            </div>

            <motion.div
                className="container relative z-10 px-6 lg:px-12 max-w-[1400px] mx-auto flex-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">

                    {/* Left Content */}
                    <div className="flex-1 max-w-[900px]">

                        {/* Row 1: Description + CRAFTING + Bird */}
                        <div className="flex items-start gap-8 mb-[-10px]">
                            {/* Description Block */}
                            <motion.div
                                variants={itemVariants}
                                className="w-[160px] flex-shrink-0 pt-4"
                            >
                                <div className="mb-4">
                                    <div className="w-[70px] h-[2px] bg-gray-900 dark:bg-white mb-2" />
                                    <div className="w-[35px] h-[2px] bg-gray-400 dark:bg-gray-600" />
                                </div>
                                <p className="text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 font-sans">
                                    {t('heroDescription')}
                                </p>
                            </motion.div>

                            {/* CREATIVE */}
                            <motion.h1
                                variants={itemVariants}
                                className={`${isBn ? 'font-black' : 'font-bold'} text-gray-900 dark:text-white uppercase font-heading leading-[0.85] tracking-tight`}
                                style={{ fontSize: isBn ? '80px' : '100px' }}
                                whileHover={{ scale: 1.02, x: 10 }}
                            >
                                {t('heroCreative')}
                            </motion.h1>

                            {/* Bird SVG */}
                            <motion.div
                                className="mt-1 ml-2"
                                variants={floatingVariants}
                                animate="animate"
                            >
                                <svg width="60" height="40" viewBox="0 0 112 60" fill="none" className="text-gray-900 dark:text-white">
                                    <path d="M0 1C30.8503 1 34.8743 21.4865 34.8743 42.3801C46.3872 37.2924 68.8096 33.4936 66.3952 59C71.3134 46.6764 81.1497 11.5146 112 11.5146" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M40.5749 20.3333C41.1337 22.4815 42.1844 27.5918 41.9162 30.848C43.7046 29.039 48.4216 25.8281 52.982 27.4561" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </motion.div>
                        </div>

                        {/* Row 2: DESIGN + Arrow + SOLUTION */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-4 mt-[-40px] pl-[170px]"
                        >
                            <motion.h1
                                className={`${isBn ? 'font-black' : 'font-bold'} text-primary uppercase font-heading leading-[0.85] tracking-tight`}
                                style={{ fontSize: isBn ? '80px' : '100px' }}
                                whileHover={{ scale: 1.02, x: 10 }}
                            >
                                {t('heroDesign')}
                            </motion.h1>

                            {/* Arrow Pill */}
                            <motion.div
                                className="w-[100px] h-[48px] bg-[#C4EE18] rounded-full flex items-center justify-center shadow-md"
                                whileHover={{ scale: 1.1, rotate: [-2, 2, -2] }}
                            >
                                <svg className="w-[45px]" viewBox="0 0 40 16" fill="none">
                                    <path d="M29.88 15.8569L39.552 9.01379C39.6896 8.90372 39.8026 8.75338 39.8808 8.57638C39.959 8.39937 40 8.20127 40 8C40 7.79873 39.959 7.60063 39.8808 7.42363C39.8026 7.24662 39.6896 7.09628 39.552 6.98621L29.88 0.143139C29.6915 0.0179054 29.4743 -0.0269382 29.2628 0.0156776C29.0512 0.0582934 28.8572 0.185945 28.7114 0.378507C28.5656 0.571069 28.4763 0.817589 28.4575 1.0792C28.4387 1.34081 28.4916 1.60264 28.6077 1.8234L31.4128 6.82663L0.958012 6.82663C0.70393 6.82663 0.460255 6.95026 0.280594 7.1703C0.100933 7.39035 0 7.6888 0 8C0 8.3112 0.100933 8.60965 0.280594 8.8297C0.460255 9.04975 0.70393 9.17337 0.958012 9.17337L31.4128 9.17337L28.6077 14.1766C28.4916 14.3974 28.4387 14.6592 28.4575 14.9208C28.4763 15.1824 28.5656 15.4289 28.7114 15.6215C28.8572 15.8141 29.0512 15.9417 29.2628 15.9843C29.4743 16.0269 29.6915 15.9821 29.88 15.8569Z" fill="black" />
                                </svg>
                            </motion.div>

                            <motion.h1
                                className={`${isBn ? 'font-black' : 'font-bold'} text-gray-900 dark:text-white uppercase font-heading leading-[0.85] tracking-tight`}
                                style={{ fontSize: isBn ? '80px' : '100px' }}
                                whileHover={{ scale: 1.02, x: 10 }}
                            >
                                {t('heroSolution')}
                            </motion.h1>
                        </motion.div>

                        {/* Row 3: with + SAKIB + Decoration */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-3 mb-6 mt-[-15px]"
                        >
                            {/* "with" in cursive script font */}
                            <span
                                className="text-gray-400 dark:text-gray-500"
                                style={{ fontFamily: "var(--font-dancing-script), cursive", fontSize: '26px', fontStyle: 'italic' }}
                            >
                                {t('heroWith')}
                            </span>

                            <motion.h1
                                className={`${isBn ? 'font-black' : 'font-bold'} text-gray-900 dark:text-white uppercase font-heading leading-[0.85] tracking-tight`}
                                style={{ fontSize: isBn ? '80px' : '100px' }}
                                whileHover={{ scale: 1.02, x: 10 }}
                            >
                                {t('heroAbuSayeed')}
                            </motion.h1>

                            {/* Triangle Decoration */}
                            <div className="flex items-end mb-3">
                                <div className="w-[40px] h-[20px] bg-[#C4EE18]" style={{ borderTopLeftRadius: '40px', borderTopRightRadius: '40px' }} />
                                <div className="w-[40px] h-[40px] bg-gray-900 dark:bg-white ml-[-8px]" style={{ borderTopLeftRadius: '40px' }} />
                            </div>
                        </motion.div>

                        {/* Stats Row */}
                        <motion.div
                            variants={itemVariants}
                            className="flex items-center gap-10 pl-[170px]"
                        >
                            {/* Avatars + Text */}
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {avatars.map((a, i) => (
                                        <img key={i} src={a} className="w-10 h-10 rounded-full border-[3px] border-white dark:border-gray-950 object-cover" alt="" />
                                    ))}
                                </div>
                                <p className="text-[12px] leading-tight text-gray-500 dark:text-gray-400 font-sans">
                                    Over <span className="font-bold text-gray-900 dark:text-white text-lg font-heading">{t('heroAssetsCount')}</span><br />
                                    {t('heroAssetsSold')}
                                </p>
                            </div>

                            {/* Video Button */}
                            <div className="flex items-center gap-3">
                                <button className="w-12 h-12 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-black hover:scale-105 transition-transform">
                                    <FiPlay size={16} className="ml-0.5" />
                                </button>
                                <p className="text-[12px] leading-tight text-gray-500 dark:text-gray-400 font-sans italic">
                                    {t('heroWeAreGlobal')} <br /> <span className="text-gray-900 dark:text-white font-bold not-italic">{t('heroBrandAgency')}</span>
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Expertise Card - Positioned Lower */}
                    <motion.div
                        className="bg-[#F6F6F6] dark:bg-gray-900/50 p-8 rounded-[28px] w-[300px] relative border border-gray-100 dark:border-gray-800 flex-shrink-0 self-end mb-[-50px] shadow-2xl shadow-black/10 dark:shadow-black/30 hover:shadow-3xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ y: -5 }}
                    >
                        {/* Top Badge */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                <span className="text-white text-xl font-bold">✦</span>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Since 2019</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">Design Expert</p>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white font-heading">500+</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Projects</p>
                            </div>
                            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-xl">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white font-heading">5K+</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Templates</p>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Crafting premium design assets for designers, developers & businesses worldwide.
                        </p>

                        {/* Decorative Triangle */}
                        <div className="absolute bottom-4 right-4">
                            <svg width="40" height="25" viewBox="0 0 67 41" fill="none">
                                <path d="M67 0H0V41L67 0Z" fill="#C4EE18" />
                            </svg>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Full Width Image Gallery - Design Related with Animations */}
            <div className="w-full mt-0 px-4">
                <div className="flex gap-3">
                    <motion.div
                        className="flex-1 h-[140px] overflow-hidden rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"
                            alt="UI Design"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                        />
                    </motion.div>
                    <motion.div
                        className="flex-1 h-[140px] overflow-hidden rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800"
                            alt="Web Design"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                        />
                    </motion.div>
                    <motion.div
                        className="flex-1 h-[140px] overflow-hidden rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800"
                            alt="Creative Workspace"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                        />
                    </motion.div>
                    <motion.div
                        className="flex-1 h-[140px] overflow-hidden rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800"
                            alt="Branding Design"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                        />
                    </motion.div>
                </div>
            </div>
        </section >
    );
}
