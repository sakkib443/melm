"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHome,
    FiBook,
    FiPackage,
    FiDownload,
    FiHeart,
    FiStar,
    FiUser,
    FiSettings,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronRight,
    FiBell,
    FiSearch,
    FiArrowLeft
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, logout } from "@/redux/features/authSlice";

const userMenuItems = [
    {
        name: "Overview",
        href: "/dashboard/user",
        icon: FiHome,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
        name: "My Courses",
        href: "/dashboard/user/courses",
        icon: FiBook,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/20"
    },
    {
        name: "Order History",
        href: "/dashboard/user/orders",
        icon: FiPackage,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/20"
    },
    {
        name: "Downloads",
        href: "/dashboard/user/downloads",
        icon: FiDownload,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
        name: "Wishlist",
        href: "/dashboard/user/wishlist",
        icon: FiHeart,
        color: "text-pink-500",
        bg: "bg-pink-50 dark:bg-pink-900/20"
    },
    {
        name: "My Reviews",
        href: "/dashboard/user/reviews",
        icon: FiStar,
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
        name: "Profile",
        href: "/dashboard/user/profile",
        icon: FiUser,
        color: "text-indigo-500",
        bg: "bg-indigo-50 dark:bg-indigo-900/20"
    },
    {
        name: "Security",
        href: "/dashboard/user/security",
        icon: FiSettings,
        color: "text-gray-500",
        bg: "bg-gray-50 dark:bg-gray-900/20"
    },
];

export default function UserDashboardLayout({ children }) {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Auth Guard
    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push("/login");
        }
    }, [isAuthenticated, router, mounted]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    if (!mounted || !isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 sticky top-0 h-screen">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                            C
                        </div>
                        <span className="font-bold text-xl text-gray-900 dark:text-white">Student Hub</span>
                    </Link>
                </div>

                <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                    {userMenuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isActive ? "bg-white/20" : item.bg
                                        }`}>
                                        <item.icon className={isActive ? "text-white" : item.color} size={18} />
                                    </div>
                                    <span className="font-medium">{item.name}</span>
                                </div>
                                {isActive && <FiChevronRight />}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <Link
                        href="/dashboard/user/profile"
                        className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-colors ${pathname === '/dashboard/user/profile'
                            ? "bg-gray-100 dark:bg-gray-700"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            }`}
                    >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user?.firstName?.[0]}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.firstName}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium text-sm"
                    >
                        <FiLogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                            <FiMenu size={20} />
                        </button>
                        <Link href="/" className="flex lg:hidden items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">C</div>
                        </Link>
                        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 capitalize">
                            <span>Dashboard</span>
                            <FiChevronRight size={14} />
                            <span className="text-primary font-medium">{pathname.split('/').pop()?.replace(/-/g, ' ')}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative">
                            <FiBell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800" />
                        </button>
                        <Link href="/dashboard/user/profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-primary/20">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary flex items-center justify-center text-white text-xs md:text-sm font-bold">
                                    {user?.firstName?.[0]}
                                </div>
                            )}
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -288 }}
                            animate={{ x: 0 }}
                            exit={{ x: -288 }}
                            className="fixed top-0 left-0 z-50 w-72 h-screen bg-white dark:bg-gray-800 shadow-2xl lg:hidden flex flex-col"
                        >
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                <Link href="/" className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold shadow-lg">C</div>
                                    <span className="font-bold text-xl text-gray-900 dark:text-white">Student Hub</span>
                                </Link>
                                <button onClick={() => setIsMobileOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <FiX size={24} />
                                </button>
                            </div>
                            <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                                {userMenuItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                                ? "bg-primary text-white shadow-lg"
                                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                }`}
                                        >
                                            <item.icon size={18} />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                            <div className="p-6 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={handleLogout} className="w-full btn btn-ghost text-red-500 justify-start gap-3">
                                    <FiLogOut size={18} /> Logout
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
