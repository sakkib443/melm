"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
    FiMenu,
    FiX,
    FiShoppingCart,
    FiSun,
    FiMoon,
    FiSearch,
    FiChevronDown,
    FiLogOut,
    FiSettings,
    FiGrid,
    FiHeart,
    FiBox,
    FiShoppingBag,
    FiGlobe,
    FiArrowRight,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { selectCartCount } from "@/redux/features/cartSlice";
import { selectCurrentUser, selectIsAuthenticated, logout } from "@/redux/features/authSlice";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { theme, toggleDarkMode } = useTheme();
    const { language, toggleLanguage, t } = useLanguage();
    const dispatch = useDispatch();
    const cartCount = useSelector(selectCartCount);
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { nameKey: "home", href: "/" },
        { nameKey: "design", href: "/graphics" },
        { nameKey: "course", href: "/courses" },
        { nameKey: "pricing", href: "/pricing" },
        { nameKey: "uiKits", href: "/ui-kits" },
        { nameKey: "about", href: "/about" },
        { nameKey: "contact", href: "/contact" },
        // { nameKey: "explore", href: "/marketplace", hasDropdown: true },
    ];

    const handleLogout = () => {
        dispatch(logout());
        setIsProfileOpen(false);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
                    ? "py-2 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
                    : "py-4 bg-transparent"
                    }`}
            >
                <div className="container px-4 lg:px-8 max-w-[1600px] mx-auto">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo - SAID */}
                        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
                            {/* Arrow Icon */}
                            <div className="flex items-center">
                                <span className="text-4xl font-black text-primary leading-none">ʌ</span>
                                <span className="text-2xl text-gray-900 dark:text-white mx-0.5">—›</span>
                            </div>
                            {/* Logo Text */}
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-widest uppercase">
                                    SAYEED
                                </span>
                                <span className="text-[9px] font-medium text-gray-500 dark:text-gray-400 tracking-[0.15em]">
                                    Since . 2018
                                </span>
                            </div>
                        </Link>

                        {/* Center Navigation - Desktop */}
                        <div className="hidden lg:flex items-center gap-2 mx-auto">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.nameKey}
                                    href={link.href}
                                    className="relative flex items-center gap-1.5 px-5 py-2 text-[15px] font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    {t(link.nameKey)}
                                    {link.hasDropdown && <FiChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-2">

                            {/* Search Button */}
                            <motion.button
                                onClick={() => setIsSearchOpen(true)}
                                className="relative p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiSearch className="w-5 h-5" />
                            </motion.button>

                            {/* Language Toggle - Premium Design */}
                            <motion.button
                                onClick={toggleLanguage}
                                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary/50 transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <FiGlobe className="w-4 h-4 text-primary" />
                                <div className="flex items-center">
                                    <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${language === 'en' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                        EN
                                    </span>
                                    <span className="text-gray-300 dark:text-gray-600 mx-1.5 text-xs">/</span>
                                    <span className={`text-[11px] font-bold transition-colors ${language === 'bn' ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                        বাং
                                    </span>
                                </div>
                            </motion.button>

                            {/* Dark Mode Toggle */}
                            <motion.button
                                onClick={toggleDarkMode}
                                className="p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                whileHover={{ scale: 1.05, rotate: 15 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {theme.darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                            </motion.button>

                            {/* Cart */}
                            <Link href="/cart">
                                <motion.div
                                    className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiShoppingCart className="w-5 h-5" />
                                    {cartCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-lg"
                                        >
                                            {cartCount}
                                        </motion.span>
                                    )}
                                </motion.div>
                            </Link>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2" />

                            {/* Auth / Profile */}
                            {isAuthenticated && user ? (
                                <div className="relative">
                                    <motion.button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 p-1.5 pr-4 rounded-md bg-primary hover:bg-primary/90 transition-all"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="w-9 h-9 rounded-md bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                                            {user.avatar ? (
                                                <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="" />
                                            ) : (
                                                user.firstName?.[0] || "U"
                                            )}
                                        </div>
                                        <span className="hidden md:block text-sm font-bold text-white">
                                            {user.firstName}
                                        </span>
                                        <FiChevronDown className={`w-4 h-4 text-white/70 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </motion.button>

                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-full mt-3 w-72 bg-white dark:bg-gray-900 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-gray-800 py-2 overflow-hidden z-[60]"
                                            >
                                                {/* User Info */}
                                                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="font-bold text-gray-900 dark:text-white">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate mt-0.5">{user.email}</p>
                                                </div>

                                                {/* Links */}
                                                <div className="py-2">
                                                    <DropdownLink href="/dashboard/user" icon={FiGrid} label={t('myDashboard')} />
                                                    <DropdownLink href="/dashboard/user/courses" icon={FiBox} label={t('myLearning')} />
                                                    <DropdownLink href="/dashboard/user/orders" icon={FiShoppingBag} label={t('orderHistory')} />
                                                    <DropdownLink href="/dashboard/user/wishlist" icon={FiHeart} label={t('myWishlist')} />
                                                    <DropdownLink href="/dashboard/user/profile" icon={FiSettings} label={t('accountSettings')} />
                                                </div>

                                                {/* Logout */}
                                                <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                    >
                                                        <FiLogOut className="w-4 h-4" />
                                                        {t('signOut')}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center gap-3">
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        {t('login')}
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90 transition-all"
                                    >
                                        {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Menu Toggle */}
                            <motion.button
                                onClick={() => setIsMobileOpen(!isMobileOpen)}
                                className="lg:hidden p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isMobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden"
                        >
                            <div className="container px-6 py-8">
                                {/* Navigation Links */}
                                <div className="space-y-1 mb-8">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.nameKey}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                className="block px-4 py-3 text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                                                onClick={() => setIsMobileOpen(false)}
                                            >
                                                {t(link.nameKey)}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile Language Toggle */}
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {language === 'en' ? 'Language' : 'ভাষা'}
                                    </span>
                                    <button
                                        onClick={toggleLanguage}
                                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                                    >
                                        <FiGlobe className="w-4 h-4 text-primary" />
                                        <span className={`text-sm font-bold ${language === 'en' ? 'text-primary' : 'text-gray-400'}`}>EN</span>
                                        <span className="text-gray-300">/</span>
                                        <span className={`text-sm font-bold ${language === 'bn' ? 'text-primary' : 'text-gray-400'}`}>বাং</span>
                                    </button>
                                </div>

                                {/* Mobile Auth Buttons */}
                                {!isAuthenticated && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href="/login"
                                            className="py-3 text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl"
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            {t('login')}
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="py-3 text-center bg-primary text-black font-bold rounded-xl"
                                            onClick={() => setIsMobileOpen(false)}
                                        >
                                            {language === 'bn' ? 'রেজিস্টার' : 'Register'}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Search Modal */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="w-full max-w-2xl mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="relative">
                                <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={language === 'bn' ? 'টেমপ্লেট, ফন্ট, গ্রাফিক্স খুঁজুন...' : 'Search templates, fonts, graphics...'}
                                    className="w-full pl-16 pr-6 py-5 bg-white dark:bg-gray-900 text-xl rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-primary shadow-2xl"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-center text-white/60 text-sm mt-4">
                                {language === 'bn' ? 'বন্ধ করতে ESC চাপুন' : 'Press ESC to close'}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function DropdownLink({ href, icon: Icon, label }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-all"
        >
            <Icon className="w-4 h-4" />
            {label}
        </Link>
    );
}
