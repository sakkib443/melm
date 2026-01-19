"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiHome,
    FiUsers,
    FiBook,
    FiImage,
    FiVideo,
    FiLayout,
    FiSmartphone,
    FiMusic,
    FiCamera,
    FiType,
    FiSettings,
    FiSliders,
    FiBarChart2,
    FiTag,
    FiMenu,
    FiX,
    FiChevronDown,
    FiLogOut,
    FiBell,
    FiSearch,
    FiShoppingBag,
    FiArrowLeft,
    FiPlus,
    FiPackage,
    FiDollarSign,
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";
import { useModules } from "@/context/ModuleContext";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, selectToken, logout } from "@/redux/features/authSlice";

const menuItems = [
    {
        name: "Dashboard",
        href: "/dashboard/admin",
        icon: FiHome,
        gradient: "from-indigo-500 to-purple-500"
    },
    {
        name: "Analytics",
        href: "/dashboard/admin/analytics",
        icon: FiBarChart2,
        gradient: "from-pink-500 to-rose-500"
    },
    {
        name: "Categories",
        icon: FiTag,
        gradient: "from-violet-500 to-purple-500",
        children: [
            { name: "All Categories", href: "/dashboard/admin/categories", icon: FiTag },
            { name: "Create Category", href: "/dashboard/admin/categories/create", icon: FiPlus },
        ],
    },
    {
        name: "Marketplace",
        icon: FiShoppingBag,
        gradient: "from-emerald-500 to-teal-500",
        children: [
            { name: "All Design Templates", href: "/dashboard/admin/products/graphics", icon: FiImage },
            { name: "Create Design Template", href: "/dashboard/admin/products/graphics/create", icon: FiPlus },
            { name: "All Videos", href: "/dashboard/admin/products/videos", icon: FiVideo },
            { name: "Create Video", href: "/dashboard/admin/products/videos/create", icon: FiPlus },
            { name: "All UI Kits", href: "/dashboard/admin/products/ui-kits", icon: FiLayout },
            { name: "Create UI Kit", href: "/dashboard/admin/products/ui-kits/create", icon: FiPlus },
            { name: "All Apps", href: "/dashboard/admin/products/apps", icon: FiSmartphone },
            { name: "Create App", href: "/dashboard/admin/products/apps/create", icon: FiPlus },
            { name: "All Audio", href: "/dashboard/admin/products/audio", icon: FiMusic },
            { name: "Create Audio", href: "/dashboard/admin/products/audio/create", icon: FiPlus },
            { name: "All Photos", href: "/dashboard/admin/products/photos", icon: FiCamera },
            { name: "Create Photo", href: "/dashboard/admin/products/photos/create", icon: FiPlus },
            { name: "All Fonts", href: "/dashboard/admin/products/fonts", icon: FiType },
            { name: "Create Font", href: "/dashboard/admin/products/fonts/create", icon: FiPlus },
        ],
    },
    {
        name: "LMS",
        icon: FiBook,
        gradient: "from-amber-500 to-orange-500",
        children: [
            { name: "All Courses", href: "/dashboard/admin/courses", icon: FiBook },
            { name: "Create Course", href: "/dashboard/admin/courses/create", icon: FiPlus },
            { name: "All Modules", href: "/dashboard/admin/modules", icon: FiLayout },
            { name: "Create Module", href: "/dashboard/admin/modules/create", icon: FiPlus },
            { name: "All Lessons", href: "/dashboard/admin/lessons", icon: FiVideo },
            { name: "Create Lesson", href: "/dashboard/admin/lessons/create", icon: FiPlus },
            { name: "Live Classes", href: "/dashboard/admin/live-classes", icon: FiVideo },
            { name: "Schedule Class", href: "/dashboard/admin/live-classes/create", icon: FiPlus },
            { name: "Webinars", href: "/dashboard/admin/webinars", icon: FiUsers },
            { name: "Create Webinar", href: "/dashboard/admin/webinars/create", icon: FiPlus },
            { name: "Certificates", href: "/dashboard/admin/certificates", icon: FiImage },
            { name: "Quiz Results", href: "/dashboard/admin/quiz-results", icon: FiBarChart2 },
            { name: "Enrollments", href: "/dashboard/admin/enrollments", icon: FiUsers },
        ],
    },
    {
        name: "Users",
        icon: FiUsers,
        gradient: "from-blue-500 to-cyan-500",
        children: [
            { name: "All Users", href: "/dashboard/admin/users", icon: FiUsers },
            { name: "Create User", href: "/dashboard/admin/users/create", icon: FiPlus },
        ],
    },
    {
        name: "Orders",
        href: "/dashboard/admin/orders",
        icon: FiPackage,
        gradient: "from-green-500 to-emerald-500"
    },
    {
        name: "Content",
        icon: FiBook,
        gradient: "from-cyan-500 to-blue-500",
        children: [
            { name: "Blog", href: "/dashboard/admin/blog", icon: FiBook },
            { name: "Page Content", href: "/dashboard/admin/page-content", icon: FiBook },
        ],
    },
    {
        name: "Marketing",
        icon: FiTag,
        gradient: "from-fuchsia-500 to-pink-500",
        children: [
            { name: "Coupons", href: "/dashboard/admin/coupons", icon: FiTag },
            { name: "Reviews", href: "/dashboard/admin/reviews", icon: FiTag },
        ],
    },
    {
        name: "Support",
        icon: FiBook,
        gradient: "from-orange-500 to-red-500",
        children: [
            { name: "Messages", href: "/dashboard/admin/messages", icon: FiBook },
            { name: "Notifications", href: "/dashboard/admin/notifications", icon: FiBook },
        ],
    },
    {
        name: "Reports",
        href: "/dashboard/admin/reports",
        icon: FiBarChart2,
        gradient: "from-violet-500 to-purple-500"
    },
    {
        name: "Downloads",
        href: "/dashboard/admin/downloads",
        icon: FiPackage,
        gradient: "from-cyan-500 to-teal-500"
    },
    {
        name: "Theme Settings",
        href: "/dashboard/admin/theme",
        icon: FiSliders,
        gradient: "from-rose-500 to-pink-500"
    },
    {
        name: "Module Settings",
        href: "/dashboard/admin/module-settings",
        icon: FiSliders,
        gradient: "from-purple-500 to-indigo-500"
    },
    {
        name: "Settings",
        href: "/dashboard/admin/settings",
        icon: FiSettings,
        gradient: "from-gray-500 to-gray-700"
    },
    {
        name: "Profile",
        href: "/dashboard/admin/profile",
        icon: FiUsers,
        gradient: "from-indigo-500 to-blue-500"
    },
];

function SidebarItem({ item, isCollapsed }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const isActive = item.href
        ? pathname === item.href
        : item.children?.some((child) => pathname === child.href);

    // Auto-expand if child is active
    useEffect(() => {
        if (item.children && item.children.some(child => pathname === child.href)) {
            setIsOpen(true);
        }
    }, [pathname, item.children]);

    if (item.children) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`group w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all ${isActive
                        ? "bg-primary-10 text-primary"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive
                            ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                            : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                            } transition-all`}>
                            <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
                        </div>
                        {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                        <FiChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                    )}
                </button>
                <AnimatePresence>
                    {isOpen && !isCollapsed && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="ml-6 mt-1 space-y-1 overflow-hidden border-l-2 border-gray-100 dark:border-gray-700 pl-4"
                        >
                            {item.children.map((child) => (
                                <Link
                                    key={child.name}
                                    href={child.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${pathname === child.href
                                        ? "bg-primary text-white font-medium shadow-lg"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
                                        }`}
                                >
                                    {child.icon && <child.icon className="w-4 h-4" />}
                                    {child.name}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <Link
            href={item.href}
            className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                ? "bg-primary-10 text-primary"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
        >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isActive
                ? `bg-gradient-to-br ${item.gradient} shadow-lg`
                : "bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                } transition-all`}>
                <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}`} />
            </div>
            {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
        </Link>
    );
}

export default function DashboardLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { theme } = useTheme();
    const { isModuleEnabled } = useModules();
    const user = useSelector(selectCurrentUser);
    const token = useSelector(selectToken);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const dispatch = useDispatch();
    const router = useRouter();

    // Filter menu items based on enabled modules
    const getFilteredMenuItems = () => {
        return menuItems.map(item => {
            // For items with children (submenu)
            if (item.children) {
                const filteredChildren = item.children.filter(child => {
                    // Check if this child is a module-dependent item
                    if (child.href.includes('/courses') || child.href.includes('/modules') ||
                        child.href.includes('/lessons') || child.href.includes('/enrollments') ||
                        child.href.includes('/certificates') || child.href.includes('/live-classes') ||
                        child.href.includes('/webinars') || child.href.includes('/quiz-results')) {
                        // LMS modules - check enabled status
                        if (child.href.includes('/courses')) return isModuleEnabled('lms', 'courses');
                        if (child.href.includes('/modules')) return isModuleEnabled('lms', 'modules');
                        if (child.href.includes('/lessons')) return isModuleEnabled('lms', 'lessons');
                        if (child.href.includes('/enrollments')) return isModuleEnabled('lms', 'enrollments');
                        if (child.href.includes('/certificates')) return isModuleEnabled('lms', 'certificates');
                        if (child.href.includes('/live-classes')) return isModuleEnabled('lms', 'liveClasses');
                        if (child.href.includes('/webinars')) return isModuleEnabled('lms', 'webinars');
                        if (child.href.includes('/quiz-results')) return isModuleEnabled('lms', 'quizResults');
                    }

                    if (child.href.includes('/products/graphics')) return isModuleEnabled('marketplace', 'graphics');
                    if (child.href.includes('/products/videos')) return isModuleEnabled('marketplace', 'videoTemplates');
                    if (child.href.includes('/products/ui-kits')) return isModuleEnabled('marketplace', 'uiKits');
                    if (child.href.includes('/products/apps')) return isModuleEnabled('marketplace', 'appTemplates');
                    if (child.href.includes('/products/audio')) return isModuleEnabled('marketplace', 'audio');
                    if (child.href.includes('/products/photos')) return isModuleEnabled('marketplace', 'photos');
                    if (child.href.includes('/products/fonts')) return isModuleEnabled('marketplace', 'fonts');

                    return true; // Show other items
                });

                // Hide parent if all children are hidden
                if (filteredChildren.length === 0) return null;

                return { ...item, children: filteredChildren };
            }

            return item; // No children, keep as is
        }).filter(item => item !== null);
    };

    const filteredMenuItems = getFilteredMenuItems();

    // ==================== AUTH GUARD ====================
    // Check authentication on mount and redirect if not authenticated
    useEffect(() => {
        // If no token or not authenticated, redirect to login
        if (!token || !isAuthenticated) {
            router.replace("/login");
        } else {
            setIsLoading(false);
        }
    }, [token, isAuthenticated, router]);

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    // Show loading while checking authentication
    if (isLoading && (!token || !isAuthenticated)) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${isSidebarOpen ? "w-72" : "w-20"
                    } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden lg:block`}
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-gradient-to-br from-primary/5 to-transparent" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none bg-gradient-to-tr from-secondary/5 to-transparent" />

                {/* Logo */}
                <div className="relative h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        {isSidebarOpen && (
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                {theme.logoText || "CreativeHub"}
                            </span>
                        )}
                    </Link>
                </div>

                {/* Back to Website */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={18} />
                        {isSidebarOpen && <span className="text-sm font-medium">Back to Website</span>}
                    </Link>
                </div>

                {/* Menu */}
                <nav className="relative px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]" style={{ scrollbarWidth: "none" }}>
                    {isSidebarOpen && (
                        <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            Main Menu
                        </p>
                    )}
                    {filteredMenuItems.map((item) => (
                        <SidebarItem key={item.name} item={item} isCollapsed={!isSidebarOpen} />
                    ))}
                </nav>

                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                        <FiLogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

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
                            className="fixed top-0 left-0 z-50 w-72 h-screen bg-white dark:bg-gray-800 lg:hidden"
                        >
                            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                                <Link href="/" className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">C</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {theme.logoText}
                                    </span>
                                </Link>
                                <button onClick={() => setIsMobileOpen(false)}>
                                    <FiX className="w-6 h-6 text-gray-500" />
                                </button>
                            </div>
                            <nav className="p-4 space-y-2">
                                {filteredMenuItems.map((item) => (
                                    <SidebarItem key={item.name} item={item} isCollapsed={false} />
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`${isSidebarOpen ? "lg:ml-72" : "lg:ml-20"} transition-all duration-300`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-4 lg:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                        </button>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                        <div className="relative hidden md:block">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-72 pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 border-0 focus:ring-2 focus:ring-primary text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </button>
                        <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                <span className="text-white font-medium">
                                    {user?.firstName?.[0] || "A"}
                                </span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {user?.firstName || "Admin"}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">{user?.role || "admin"}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            </div>
        </div>
    );
}
