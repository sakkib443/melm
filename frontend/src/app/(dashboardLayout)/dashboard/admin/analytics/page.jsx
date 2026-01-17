"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiDollarSign, FiShoppingCart, FiUsers, FiPackage,
    FiBook, FiGlobe, FiCode, FiRefreshCw, FiDownload,
    FiTrendingUp, FiUserPlus, FiActivity, FiClock, FiLayers
} from "react-icons/fi";
import { analyticsService } from "@/services/api";

// ==================== AREA CHART COMPONENT ====================
const AreaChart = ({ data, height = 280 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const maxValue = Math.max(...data.map(d => d.value), 1);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getPoints = () => {
        return data.map((d, i) => ({
            x: (i / (data.length - 1)) * 100,
            y: 100 - (d.value / maxValue) * 80
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
            path += ` C ${current.x + (next.x - current.x) * tension} ${current.y}, ${next.x - (next.x - current.x) * tension} ${next.y}, ${next.x} ${next.y}`;
        }
        return path;
    };

    const generateAreaPath = () => {
        const curvePath = generateCurvePath();
        const points = getPoints();
        return `${curvePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;
    };

    return (
        <div style={{ height }} className="w-full relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-right pr-2">
                {[4, 3, 2, 1, 0].map((i) => (
                    <span key={i} className="text-[10px] text-gray-400">৳{Math.round((maxValue / 4) * i / 1000)}k</span>
                ))}
            </div>

            {/* Chart area */}
            <div className="absolute left-10 right-0 top-0 bottom-8">
                {/* Grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-b border-gray-100 dark:border-gray-800" style={{ height: 1 }} />
                    ))}
                </div>

                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
                    <defs>
                        <linearGradient id="chartGradientGreen" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="5%" stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="95%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={generateAreaPath()} fill="url(#chartGradientGreen)" className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`} />
                    <path d={generateCurvePath()} fill="none" stroke="#10b981" strokeWidth="0.4" className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`} />
                </svg>
            </div>

            {/* X-axis labels */}
            <div className="absolute left-10 right-0 bottom-0 h-6 flex justify-between items-start pt-2">
                {data.map((d, i) => (
                    <span key={i} className="text-[10px] text-gray-400">{d.label}</span>
                ))}
            </div>
        </div>
    );
};

// ==================== STAT CARD - TOP ====================
const TopStatCard = ({ title, value, change, icon: Icon, iconBg, prefix = "" }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 flex items-center justify-between border border-gray-200 dark:border-gray-700"
    >
        <div>
            <p className="text-xs text-gray-500 mb-1">{title}</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">{prefix}{value}</p>
            <p className="text-[10px] text-emerald-500 mt-1">↗{change}% vs last month</p>
        </div>
        <div className={`w-10 h-10 rounded-md ${iconBg} flex items-center justify-center`}>
            <Icon className="text-white" size={18} />
        </div>
    </motion.div>
);

// ==================== CATEGORY CARD ====================
const CategoryCard = ({ title, value, icon: Icon, iconBg }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 text-center border border-gray-200 dark:border-gray-700"
    >
        <div className={`w-10 h-10 mx-auto rounded-md ${iconBg} flex items-center justify-center mb-2`}>
            <Icon className="text-white" size={18} />
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
    </motion.div>
);

// ==================== MAIN ANALYTICS PAGE ====================
export default function AnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [data, setData] = useState({
        totalRevenue: 0,
        monthlyRevenue: 0,
        todayRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalUsers: 0,
        totalSellers: 0,
        totalBuyers: 0,
        newUsersThisMonth: 0,
        totalProducts: 0,
        totalCourses: 0,
        totalGraphics: 0,
        totalEnrollments: 0,
        avgRating: 0,
        totalReviews: 0,
        revenueChartData: [],
        breakdown: { courses: 0, websites: 0, software: 0, designs: 0 }
    });

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const response = await analyticsService.getDashboard();
            if (response.success && response.data) {
                setData(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.log("Using default data", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Default chart data if API doesn't return
    const chartData = data.revenueChartData?.length > 0 ? data.revenueChartData : [
        { label: "Jan", value: 0 }, { label: "Feb", value: 0 }, { label: "Mar", value: 0 },
        { label: "Apr", value: 0 }, { label: "May", value: 0 }, { label: "Jun", value: 0 },
        { label: "Jul", value: 0 }, { label: "Aug", value: 0 }, { label: "Sep", value: 0 },
        { label: "Oct", value: 0 }, { label: "Nov", value: 0 }, { label: "Dec", value: 0 },
    ];

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Overview</h1>
                    <p className="text-xs text-gray-500">Real-time performance metrics and sales data.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchData}
                        disabled={refreshing}
                        className="btn btn-ghost flex items-center gap-2 text-sm"
                    >
                        <FiRefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <button className="btn btn-primary flex items-center gap-2 text-sm">
                        <FiDownload size={14} />
                        Download Report
                    </button>
                </div>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <TopStatCard
                    title="Total Revenue"
                    value={loading ? "..." : `৳${data.totalRevenue.toLocaleString()}`}
                    change="12"
                    icon={FiDollarSign}
                    iconBg="bg-amber-400"
                />
                <TopStatCard
                    title="Total Orders"
                    value={loading ? "..." : data.totalOrders}
                    change="8"
                    icon={FiShoppingCart}
                    iconBg="bg-orange-500"
                />
                <TopStatCard
                    title="Total Users"
                    value={loading ? "..." : data.totalUsers}
                    change="15"
                    icon={FiUsers}
                    iconBg="bg-blue-500"
                />
                <TopStatCard
                    title="Total Products"
                    value={loading ? "..." : data.totalProducts}
                    change="5"
                    icon={FiPackage}
                    iconBg="bg-emerald-500"
                />
            </div>

            {/* Chart + Platform Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 card p-5 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Revenue by Category</h3>
                            <p className="text-xs text-gray-500">Monthly comparison across products</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="text-gray-500">Courses</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-gray-500">Websites</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-gray-500">Software</span>
                            </div>
                        </div>
                    </div>
                    <AreaChart data={chartData} height={280} />

                    {/* Bottom breakdown */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-6 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 uppercase">Courses</span>
                                <span className="font-semibold text-blue-600">৳{data.breakdown?.courses || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 uppercase">Websites</span>
                                <span className="font-semibold text-emerald-600">৳{data.breakdown?.websites || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 uppercase">Software</span>
                                <span className="font-semibold text-amber-600">৳{data.breakdown?.software || 0}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-500 uppercase">Total Revenue</span>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">৳{data.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Platform Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-5 border border-gray-200 dark:border-gray-700"
                >
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Platform Status</h3>

                    <div className="space-y-4">
                        {/* Monthly Revenue */}
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <p className="text-xs text-gray-500 uppercase mb-1">Monthly Revenue</p>
                            <p className="text-xl font-semibold text-gray-900 dark:text-white">৳{data.monthlyRevenue.toLocaleString()}</p>
                        </div>

                        {/* Students & New Users */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                <p className="text-xs text-gray-500 uppercase mb-1">Students</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.totalBuyers}</p>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                <p className="text-xs text-gray-500 uppercase mb-1">New Users</p>
                                <p className="text-lg font-semibold text-emerald-600">+{data.newUsersThisMonth}</p>
                            </div>
                        </div>

                        {/* Active Enrollments */}
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Active Enrollments</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.totalEnrollments}</p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full font-medium">LIVE</span>
                        </div>

                        {/* Pending Orders */}
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 uppercase mb-1">Pending Orders</p>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.pendingOrders}</p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full font-medium">ACTION</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <CategoryCard title="Websites" value={data.breakdown?.websites || 0} icon={FiGlobe} iconBg="bg-blue-500" />
                <CategoryCard title="Software" value={data.breakdown?.software || 0} icon={FiCode} iconBg="bg-indigo-500" />
                <CategoryCard title="Courses" value={data.totalCourses} icon={FiBook} iconBg="bg-orange-500" />
                <CategoryCard title="Students" value={data.totalBuyers} icon={FiUsers} iconBg="bg-teal-500" />
                <CategoryCard title="Enrollments" value={data.totalEnrollments} icon={FiActivity} iconBg="bg-pink-500" />
                <CategoryCard title="Lessons" value={0} icon={FiLayers} iconBg="bg-purple-500" />
            </div>

            {/* Top Products & Top Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card border border-gray-200 dark:border-gray-700"
                >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Top Selling Products</h3>
                        <p className="text-xs text-gray-500">Best performing items</p>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[
                            { name: "Premium UI Kit", category: "Design", sales: 156, revenue: 312000 },
                            { name: "React Admin Dashboard", category: "Software", sales: 124, revenue: 248000 },
                            { name: "Flutter App Template", category: "App", sales: 98, revenue: 196000 },
                            { name: "WordPress Theme", category: "Website", sales: 87, revenue: 174000 },
                            { name: "Logo Template Pack", category: "Graphics", sales: 76, revenue: 114000 },
                        ].map((product, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                                        <p className="text-xs text-gray-500">{product.category} • {product.sales} sales</p>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">৳{product.revenue.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Mentors */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card border border-gray-200 dark:border-gray-700"
                >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Top Mentors</h3>
                        <p className="text-xs text-gray-500">Highest earning instructors</p>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {[
                            { name: "John Doe", role: "Mentor", products: 24, revenue: 456000 },
                            { name: "Sarah Khan", role: "Author", products: 18, revenue: 324000 },
                            { name: "Mike Chen", role: "Mentor", products: 15, revenue: 289000 },
                            { name: "Lisa Park", role: "Author", products: 12, revenue: 198000 },
                            { name: "Ahmed Rahman", role: "Mentor", products: 10, revenue: 167000 },
                        ].map((mentor, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                                        {mentor.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{mentor.name}</p>
                                        <p className="text-xs text-gray-500">{mentor.role} • {mentor.products} courses</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">৳{mentor.revenue.toLocaleString()}</p>
                                    <p className="text-[10px] text-amber-500">⭐ Top Mentor</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Activity & Platform Health */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 card border border-gray-200 dark:border-gray-700"
                >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
                            <p className="text-xs text-gray-500">Latest transactions</p>
                        </div>
                        <span className="text-xs text-primary cursor-pointer hover:underline">View All →</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="text-left p-3 font-medium">Order ID</th>
                                    <th className="text-left p-3 font-medium">Customer</th>
                                    <th className="text-left p-3 font-medium">Product</th>
                                    <th className="text-left p-3 font-medium">Amount</th>
                                    <th className="text-left p-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {(data.recentOrders || [
                                    { id: "ORD-001", customer: "Customer 1", product: "Product 1", amount: 2500, status: "completed" },
                                    { id: "ORD-002", customer: "Customer 2", product: "Product 2", amount: 1800, status: "pending" },
                                    { id: "ORD-003", customer: "Customer 3", product: "Product 3", amount: 3200, status: "completed" },
                                ]).slice(0, 5).map((order, i) => (
                                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">{order.id}</td>
                                        <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{order.customer}</td>
                                        <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{order.product}</td>
                                        <td className="p-3 text-sm font-medium text-gray-900 dark:text-white">৳{order.amount?.toLocaleString()}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Platform Health */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card border border-gray-200 dark:border-gray-700 p-5"
                >
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Platform Health</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Average Rating</span>
                            <span className="text-sm font-semibold text-amber-500">⭐ {data.avgRating || 4.8}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{data.totalReviews || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
                            <span className="text-sm font-semibold text-emerald-600">{data.totalOrders && data.totalUsers ? ((data.totalOrders / data.totalUsers) * 100).toFixed(1) : 0}%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Avg Order Value</span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">৳{data.totalOrders ? Math.round(data.totalRevenue / data.totalOrders).toLocaleString() : 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
                            <span className="text-sm text-emerald-700 dark:text-emerald-400">System Status</span>
                            <span className="text-sm font-semibold text-emerald-600">● Online</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
