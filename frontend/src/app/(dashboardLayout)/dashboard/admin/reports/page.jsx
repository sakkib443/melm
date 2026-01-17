"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FiBarChart2, FiDownload, FiCalendar, FiDollarSign, FiPackage,
    FiUsers, FiTrendingUp, FiFilter
} from "react-icons/fi";

export default function ReportsPage() {
    const [period, setPeriod] = useState("30d");
    const [reportType, setReportType] = useState("sales");

    const reports = [
        { id: "sales", label: "Sales Report", icon: FiDollarSign, color: "from-emerald-500 to-teal-500" },
        { id: "products", label: "Product Report", icon: FiPackage, color: "from-blue-500 to-indigo-500" },
        { id: "users", label: "User Report", icon: FiUsers, color: "from-purple-500 to-pink-500" },
        { id: "revenue", label: "Revenue Report", icon: FiTrendingUp, color: "from-amber-500 to-orange-500" },
    ];

    const mockData = {
        sales: [
            { date: "2024-01-01", orders: 45, revenue: 125000 },
            { date: "2024-01-02", orders: 52, revenue: 145000 },
            { date: "2024-01-03", orders: 38, revenue: 98000 },
            { date: "2024-01-04", orders: 67, revenue: 189000 },
            { date: "2024-01-05", orders: 54, revenue: 156000 },
        ],
        products: [
            { name: "Premium UI Kit", sales: 234, revenue: 468000 },
            { name: "Logo Templates", sales: 189, revenue: 283500 },
            { name: "React Course", sales: 156, revenue: 467844 },
            { name: "Motion Graphics", sales: 134, revenue: 401866 },
        ],
        users: [
            { month: "Jan", signups: 234, active: 189 },
            { month: "Feb", signups: 267, active: 212 },
            { month: "Mar", signups: 289, active: 245 },
            { month: "Apr", signups: 312, active: 278 },
        ],
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FiBarChart2 className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
                        <p className="text-sm text-gray-500">Generate and download reports</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        {["7d", "30d", "90d", "1y"].map(p => (
                            <button key={p} onClick={() => setPeriod(p)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${period === p ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-500"}`}>{p}</button>
                        ))}
                    </div>
                    <button className="btn btn-primary"><FiDownload /> Export</button>
                </div>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {reports.map(report => (
                    <button
                        key={report.id}
                        onClick={() => setReportType(report.id)}
                        className={`card p-4 text-left transition-all ${reportType === report.id ? "ring-2 ring-primary" : ""}`}
                    >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${report.color} flex items-center justify-center text-white shadow-lg mb-3`}>
                            <report.icon size={18} />
                        </div>
                        <p className="font-bold text-gray-900 dark:text-white">{report.label}</p>
                    </button>
                ))}
            </div>

            {/* Report Content */}
            <motion.div key={reportType} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{reports.find(r => r.id === reportType)?.label}</h3>
                    <span className="text-sm text-gray-500 flex items-center gap-1"><FiCalendar size={14} /> Last {period}</span>
                </div>

                {reportType === "sales" && (
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                                        <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase">Date</th>
                                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Orders</th>
                                        <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase">Revenue</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {mockData.sales.map((row, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-3 text-gray-900 dark:text-white">{row.date}</td>
                                            <td className="px-4 py-3 text-right font-bold">{row.orders}</td>
                                            <td className="px-4 py-3 text-right font-bold text-primary">৳{row.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {reportType === "products" && (
                    <div className="p-6">
                        <div className="space-y-4">
                            {mockData.products.map((product, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">{i + 1}</div>
                                        <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">৳{product.revenue.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500">{product.sales} sales</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {reportType === "users" && (
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {mockData.users.map((stat, i) => (
                                <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                                    <p className="text-sm text-gray-500 mb-2">{stat.month}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.signups}</p>
                                    <p className="text-xs text-emerald-500">↑ {stat.active} active</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {reportType === "revenue" && (
                    <div className="p-6">
                        <div className="h-64 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl flex items-center justify-center">
                            <div className="text-center">
                                <FiTrendingUp className="w-12 h-12 text-primary mx-auto mb-2" />
                                <p className="text-sm text-gray-500">Revenue chart placeholder</p>
                                <p className="text-xs text-gray-400">Integrate with Recharts</p>
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
