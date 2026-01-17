"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
    FiUsers,
    FiDollarSign,
    FiShoppingCart,
    FiTrendingUp,
    FiTrendingDown,
    FiArrowRight,
    FiActivity,
    FiDownload,
    FiPackage,
    FiRefreshCw,
    FiCheckCircle,
    FiClock,
    FiStar,
    FiHeart,
    FiCode,
    FiGlobe,
    FiLayers,
    FiBook,
    FiImage,
    FiVideo,
    FiLayout,
    FiSmartphone,
    FiMusic,
    FiCamera,
    FiType,
    FiGrid,
    FiZap,
    FiAward,
} from "react-icons/fi";
import { analyticsService } from "@/services/api";

// ==================== ANIMATED COUNTER ====================
const AnimatedCounter = ({ value, duration = 2000, prefix = "", suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const numValue = typeof value === "number" ? value : parseInt(String(value).replace(/[^0-9]/g, "")) || 0;
        const increment = numValue / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= numValue) {
                setCount(numValue);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// ==================== STATS CARD ====================
const StatsCard = ({ title, value, change, changeType, icon: Icon, gradient, loading, subtitle }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group"
        >
            <div className="relative card p-5 transition-all duration-200 overflow-hidden">
                <div className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full blur-2xl`} />

                <div className="relative flex items-start justify-between">
                    <div className="flex-1">
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                            {loading ? (
                                <span className="inline-block w-24 h-9 skeleton rounded-lg" />
                            ) : (
                                <AnimatedCounter value={value} prefix={title.includes("Revenue") ? "৳" : ""} />
                            )}
                        </p>
                        {subtitle && <p className="text-xs text-gray-400 mb-2">{subtitle}</p>}
                        {change && (
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${changeType === "up"
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                : "bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                                }`}>
                                {changeType === "up" ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                                <span>{change}</span>
                            </div>
                        )}
                    </div>
                    <div className={`w-12 h-12 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-200`}>
                        <Icon className="text-2xl text-white" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// ==================== AREA CHART ====================
const AreaChart = ({ data, height = 250 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const maxValue = Math.max(...data.map(d => d.value), 1);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getPoints = () => {
        return data.map((d, i) => ({
            x: (i / (data.length - 1)) * 100,
            y: 100 - (d.value / maxValue) * 85
        }));
    };

    const generateCurvePath = () => {
        const points = getPoints();
        if (points.length < 2) return "";

        let path = `M ${points[0].x} ${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const tension = 0.4;
            const cp1x = current.x + (next.x - current.x) * tension;
            const cp1y = current.y;
            const cp2x = next.x - (next.x - current.x) * tension;
            const cp2y = next.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
        }

        return path;
    };

    const generateAreaPath = () => {
        const curvePath = generateCurvePath();
        const points = getPoints();
        return `${curvePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;
    };

    return (
        <div style={{ height }} className="w-full">
            <div className="relative h-full">
                <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-right pr-2">
                    {[10000, 7500, 5000, 2500, 0].map((val, i) => (
                        <span key={i} className="text-[11px] text-gray-400 font-medium leading-none">
                            {val >= 1000 ? `${val / 1000}k` : val}
                        </span>
                    ))}
                </div>

                <div className="absolute left-10 right-0 top-0 bottom-8">
                    <div className="absolute inset-0 flex flex-col justify-between">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-b border-gray-100 dark:border-gray-700 border-dashed" style={{ height: 1 }} />
                        ))}
                    </div>

                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                        <defs>
                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <path
                            d={generateAreaPath()}
                            fill="url(#chartGradient)"
                            className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
                        />

                        <path
                            d={generateCurvePath()}
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="0.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}
                        />
                    </svg>
                </div>

                <div className="absolute left-10 right-0 bottom-0 h-8 flex justify-between items-start pt-3">
                    {data.map((d, i) => (
                        <span key={i} className="text-[11px] text-gray-400 font-medium">{d.label}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ==================== DONUT CHART ====================
const DonutChart = ({ data, size = 160 }) => {
    const [animated, setAnimated] = useState(false);
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        setTimeout(() => setAnimated(true), 100);
    }, []);

    let currentOffset = 0;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                {data.map((segment, i) => {
                    const percentage = segment.value / total;
                    const segmentLength = percentage * circumference;
                    const offset = currentOffset;
                    currentOffset += segmentLength;

                    return (
                        <circle
                            key={i}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={segment.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${animated ? segmentLength : 0} ${circumference}`}
                            strokeDashoffset={-offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                            style={{ transitionDelay: `${i * 150}ms` }}
                        />
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold text-gray-800 dark:text-white">{total}</span>
                <span className="text-xs text-gray-500">Total</span>
            </div>
        </div>
    );
};

// ==================== MAIN DASHBOARD ====================
export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        totalRevenue: 125000,
        todayRevenue: 4500,
        monthlyRevenue: 45000,
        totalOrders: 234,
        pendingOrders: 12,
        completedOrders: 222,
        totalUsers: 1250,
        totalSellers: 45,
        totalBuyers: 1200,
        totalProducts: 567,
        totalCourses: 23,
        totalGraphics: 120,
        totalVideos: 85,
        totalUIKits: 45,
        totalApps: 32,
        totalAudio: 156,
        totalPhotos: 89,
        totalFonts: 34,
        totalLikes: 4532,
        newUsersThisMonth: 89,
    });

    const [recentOrders, setRecentOrders] = useState([
        { id: "ORD001", customer: "John Doe", product: "Premium UI Kit", amount: 2500, status: "completed" },
        { id: "ORD002", customer: "Jane Smith", product: "Logo Template", amount: 1500, status: "pending" },
        { id: "ORD003", customer: "Mike Johnson", product: "React Course", amount: 4999, status: "completed" },
        { id: "ORD004", customer: "Sarah Williams", product: "Music Pack", amount: 999, status: "processing" },
    ]);

    const [revenueData, setRevenueData] = useState([
        { label: "Jan", value: 0 },
        { label: "Feb", value: 0 },
        { label: "Mar", value: 0 },
        { label: "Apr", value: 0 },
        { label: "May", value: 0 },
        { label: "Jun", value: 0 },
        { label: "Jul", value: 0 },
        { label: "Aug", value: 0 },
        { label: "Sep", value: 0 },
        { label: "Oct", value: 0 },
        { label: "Nov", value: 0 },
        { label: "Dec", value: 0 },
    ]);

    const fetchDashboardData = async () => {
        setRefreshing(true);
        try {
            const response = await analyticsService.getDashboard();
            if (response.success && response.data) {
                setDashboardData(prev => ({ ...prev, ...response.data }));
                // Set recent orders from API
                if (response.data.recentOrders && response.data.recentOrders.length > 0) {
                    setRecentOrders(response.data.recentOrders);
                }
                // Set revenue chart data from API
                if (response.data.revenueChartData && response.data.revenueChartData.length > 0) {
                    setRevenueData(response.data.revenueChartData);
                }
            }
        } catch (error) {
            console.log("Using mock data - API not connected", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Top Stats - Today & Monthly
    const mainStats = [
        {
            title: "Today Revenue",
            value: dashboardData.todayRevenue,
            subtitle: "Today's earnings",
            change: "+8.5%",
            changeType: "up",
            icon: FiDollarSign,
            gradient: "from-emerald-500 to-teal-500",
        },
        {
            title: "Monthly Revenue",
            value: dashboardData.monthlyRevenue,
            subtitle: "This month",
            change: "+12.4%",
            changeType: "up",
            icon: FiTrendingUp,
            gradient: "from-amber-500 to-orange-500",
        },
        {
            title: "Today Orders",
            value: dashboardData.pendingOrders,
            subtitle: "Pending orders",
            change: "+5.2%",
            changeType: "up",
            icon: FiShoppingCart,
            gradient: "from-violet-500 to-purple-500",
        },
        {
            title: "Monthly Orders",
            value: dashboardData.totalOrders,
            subtitle: `${dashboardData.completedOrders} completed`,
            change: "+24.5%",
            changeType: "up",
            icon: FiPackage,
            gradient: "from-blue-500 to-indigo-500",
        },
    ];

    // Product stats
    const productStats = [
        { title: "Graphics", value: dashboardData.totalGraphics, icon: FiImage, gradient: "from-pink-500 to-rose-500", href: "/admin/products/graphics" },
        { title: "Video Templates", value: dashboardData.totalVideos, icon: FiVideo, gradient: "from-purple-500 to-indigo-500", href: "/admin/products/videos" },
        { title: "UI Kits", value: dashboardData.totalUIKits, icon: FiLayout, gradient: "from-blue-500 to-cyan-500", href: "/admin/products/ui-kits" },
        { title: "App Templates", value: dashboardData.totalApps, icon: FiSmartphone, gradient: "from-cyan-500 to-teal-500", href: "/admin/products/apps" },
        { title: "Audio", value: dashboardData.totalAudio, icon: FiMusic, gradient: "from-orange-500 to-amber-500", href: "/admin/products/audio" },
        { title: "Photos", value: dashboardData.totalPhotos, icon: FiCamera, gradient: "from-emerald-500 to-green-500", href: "/admin/products/photos" },
        { title: "Fonts", value: dashboardData.totalFonts, icon: FiType, gradient: "from-rose-500 to-pink-500", href: "/admin/products/fonts" },
        { title: "Courses", value: dashboardData.totalCourses, icon: FiBook, gradient: "from-indigo-500 to-violet-500", href: "/admin/courses" },
    ];

    // Platform distribution
    const platformData = [
        { name: "Graphics", value: dashboardData.totalGraphics, color: "#ec4899" },
        { name: "Videos", value: dashboardData.totalVideos, color: "#8b5cf6" },
        { name: "Courses", value: dashboardData.totalCourses, color: "#6366f1" },
        { name: "Audio", value: dashboardData.totalAudio, color: "#f59e0b" },
    ];

    // Quick actions
    const quickActions = [
        { title: "Add Graphics", href: "/admin/products/graphics/create", icon: FiImage, gradient: "from-pink-500 to-rose-500" },
        { title: "Add Video", href: "/admin/products/videos/create", icon: FiVideo, gradient: "from-purple-500 to-indigo-500" },
        { title: "Add Course", href: "/admin/courses/create", icon: FiBook, gradient: "from-indigo-500 to-blue-500" },
        { title: "Theme Settings", href: "/admin/theme", icon: FiLayers, gradient: "from-amber-500 to-orange-500" },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case "completed": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
            case "pending": return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case "processing": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="card p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md gradient-mixed flex items-center justify-center shadow-sm">
                        <FiGrid className="text-white text-lg" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Dashboard Overview</h1>
                        <p className="text-sm text-gray-500">
                            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchDashboardData}
                        disabled={refreshing}
                        className="btn btn-ghost flex items-center gap-2"
                    >
                        <FiRefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                        {refreshing ? "Syncing..." : "Reload"}
                    </button>
                    <button className="btn btn-primary flex items-center gap-2">
                        <FiDownload size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Main Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {mainStats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <StatsCard {...stat} loading={loading} />
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Area Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 card"
                >
                    <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
                            <p className="text-xs text-gray-500">Monthly revenue trend</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                <span className="text-gray-500">Revenue</span>
                            </div>
                            <div className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-bold flex items-center gap-1">
                                <FiTrendingUp size={10} />
                                +18.2%
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <AreaChart data={revenueData} height={280} />
                    </div>
                </motion.div>

                {/* Donut Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="card"
                >
                    <div className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-md">
                            <FiLayers className="text-purple-500" size={16} />
                        </div>
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Product Distribution</h3>
                            <p className="text-xs text-gray-500">Content by category</p>
                        </div>
                    </div>
                    <div className="p-6 flex flex-col items-center">
                        <DonutChart data={platformData} size={180} />
                        <div className="mt-6 w-full space-y-3">
                            {platformData.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{item.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Product Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
            >
                {productStats.map((stat) => (
                    <Link
                        key={stat.title}
                        href={stat.href}
                        className="card p-4 transition-all group text-center"
                    >
                        <div className={`w-10 h-10 mx-auto rounded-md bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform mb-3`}>
                            <stat.icon className="text-xl text-white" />
                        </div>
                        <p className="text-xl font-semibold text-gray-900 dark:text-white">
                            {loading ? "..." : stat.value}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">{stat.title}</p>
                    </Link>
                ))}
            </motion.div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="card p-5"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-md flex items-center justify-center">
                            <FiZap size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
                            <p className="text-sm text-gray-500">Manage your platform</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action) => (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="group flex flex-col items-center gap-2 p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:border-gray-400 transition-all"
                            >
                                <div className={`w-10 h-10 rounded-md bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                                    <action.icon className="text-xl text-white" />
                                </div>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center">{action.title}</span>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="lg:col-span-2 card"
                >
                    <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase tracking-wider">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Order ID</th>
                                    <th className="text-left p-4 font-semibold">Customer</th>
                                    <th className="text-left p-4 font-semibold">Product</th>
                                    <th className="text-left p-4 font-semibold">Amount</th>
                                    <th className="text-left p-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="p-4 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.customer}</td>
                                        <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{order.product}</td>
                                        <td className="p-4 text-sm font-semibold text-gray-900 dark:text-white">৳{order.amount.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
