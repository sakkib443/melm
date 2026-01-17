"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FiUser, FiShoppingBag, FiDownload, FiHeart, FiBook, FiStar,
    FiPackage, FiTrendingUp, FiLoader, FiPlay
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/authSlice";
import { statsService, orderService, enrollmentService } from "@/services/api";

export default function UserDashboard() {
    const currentUser = useSelector(selectCurrentUser);
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, ordersRes, coursesRes] = await Promise.all([
                    statsService.getUserStats(),
                    orderService.getMyOrders({ limit: 3 }),
                    enrollmentService.getMyEnrollments()
                ]);

                if (statsRes.success) setStats(statsRes.data);
                if (ordersRes.success) setRecentOrders(ordersRes.data || []);
                if (coursesRes.success) setEnrolledCourses(coursesRes.data?.slice(0, 3) || []);

            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const quickLinks = [
        { name: "My Orders", href: "/dashboard/user/orders", icon: FiPackage, color: "from-blue-500 to-indigo-500", count: stats?.orders },
        { name: "Downloads", href: "/dashboard/user/downloads", icon: FiDownload, color: "from-emerald-500 to-teal-500", count: stats?.downloads },
        { name: "Wishlist", href: "/dashboard/user/wishlist", icon: FiHeart, color: "from-pink-500 to-rose-500", count: stats?.wishlist },
        { name: "My Courses", href: "/dashboard/user/courses", icon: FiBook, color: "from-amber-500 to-orange-500", count: stats?.courses },
        { name: "My Reviews", href: "/dashboard/user/reviews", icon: FiStar, color: "from-purple-500 to-violet-500", count: stats?.reviews },
        { name: "Profile", href: "/dashboard/user/profile", icon: FiUser, color: "from-cyan-500 to-blue-500", count: null },
    ];

    if (!mounted || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FiLoader className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-8">
            {/* Professional Profile Header */}
            <div className="relative group">
                {/* Cover Image */}
                <div className="h-48 md:h-64 rounded-3xl overflow-hidden relative shadow-2xl">
                    <img
                        src={currentUser?.coverImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2070"}
                        alt="Cover"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>

                {/* Profile Info Overlay */}
                <div className="absolute -bottom-6 left-6 right-6 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
                            {currentUser?.avatar ? (
                                <img src={currentUser.avatar} alt={currentUser.firstName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold">
                                    {currentUser?.firstName?.[0]}
                                </div>
                            )}
                        </div>
                        <div className="mb-2 md:mb-0">
                            <h1 className="text-2xl md:text-3xl font-black text-white drop-shadow-lg">
                                {currentUser?.firstName} {currentUser?.lastName}
                            </h1>
                            <div className="flex items-center gap-2 text-white/90 text-sm font-medium">
                                <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md uppercase tracking-wider text-[10px]">
                                    {currentUser?.role || 'Student'}
                                </span>
                                <span>•</span>
                                <span>Member since {new Date(currentUser?.createdAt).getFullYear()}</span>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/user/profile"
                        className="mb-2 px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 border border-gray-100 dark:border-gray-700 text-sm"
                    >
                        <FiUser size={18} />
                        Edit Profile
                    </Link>
                </div>
            </div>

            <div className="pt-4" />

            {/* Quick Links */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {quickLinks.map((link, i) => (
                    <motion.div key={link.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Link href={link.href} className="card p-4 block group hover:shadow-lg transition-all">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                                <link.icon size={18} />
                            </div>
                            <p className="font-bold text-gray-900 dark:text-white">{link.name}</p>
                            {link.count !== null && (
                                <p className="text-2xl font-bold text-primary mt-1">{link.count}</p>
                            )}
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Stats */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Account Overview</h2>
                    <span className="text-sm text-gray-500">All time</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{stats?.orders || 0}</p>
                        <p className="text-sm text-gray-500">Orders</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-emerald-500">{stats?.downloads || 0}</p>
                        <p className="text-sm text-gray-500">Downloads</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-amber-500">{stats?.courses || 0}</p>
                        <p className="text-sm text-gray-500">Courses</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">৳{(stats?.totalSpent || 0).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total Spent</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="card">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white">Recent Orders</h3>
                        <Link href="/user/orders" className="text-sm text-primary font-medium">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {recentOrders.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No orders yet.</div>
                        ) : recentOrders.map((order) => (
                            <div key={order._id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{order.items[0]?.title}</p>
                                    <p className="text-xs text-gray-500">{order.orderNumber} • {new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-white">৳{order.totalAmount}</p>
                                    <span className={`text-xs font-medium capitalize ${order.paymentStatus === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enrolled Courses */}
                <div className="card">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 dark:text-white">My Courses</h3>
                        <Link href="/user/courses" className="text-sm text-primary font-medium">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                        {enrolledCourses.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">No courses enrolled yet.</div>
                        ) : enrolledCourses.map((item, i) => (
                            <div key={i} className="p-4 flex items-center gap-4">
                                <img src={item.course?.thumbnail} alt="" className="w-16 h-10 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.course?.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                                            <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${item.progress}%` }} />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500">{item.progress}%</span>
                                    </div>
                                </div>
                                <Link href={`/courses/${item.course?._id}/learn`} className="text-primary p-2 hover:bg-primary/10 rounded-lg">
                                    <FiPlay size={16} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
