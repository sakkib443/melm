"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FiUsers, FiSearch, FiLoader, FiRefreshCw, FiBook, FiCalendar,
    FiDollarSign, FiCheckCircle, FiClock, FiMail
} from "react-icons/fi";
import { enrollmentService } from "@/services/api";

export default function EnrollmentsPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const mockData = [
        { _id: "1", user: { firstName: "John", lastName: "Doe", email: "john@example.com" }, course: { title: "React Masterclass" }, enrolledAt: new Date(), progress: 75, status: "active", paidAmount: 2999 },
        { _id: "2", user: { firstName: "Jane", lastName: "Smith", email: "jane@example.com" }, course: { title: "UI/UX Design" }, enrolledAt: new Date(Date.now() - 86400000), progress: 45, status: "active", paidAmount: 1999 },
        { _id: "3", user: { firstName: "Mike", lastName: "Johnson", email: "mike@example.com" }, course: { title: "Web Development" }, enrolledAt: new Date(Date.now() - 172800000), progress: 100, status: "completed", paidAmount: 3999 },
        { _id: "4", user: { firstName: "Sarah", lastName: "Williams", email: "sarah@example.com" }, course: { title: "Python Basics" }, enrolledAt: new Date(Date.now() - 259200000), progress: 20, status: "active", paidAmount: 999 },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await enrollmentService.getAll();
            setEnrollments(response.success && response.data ? response.data : mockData);
        } catch { setEnrollments(mockData); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = enrollments.filter(e => {
        const matchSearch = e.user?.email?.toLowerCase().includes(search.toLowerCase()) || e.course?.title?.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" || e.status === filter;
        return matchSearch && matchFilter;
    });

    const stats = {
        total: enrollments.length,
        active: enrollments.filter(e => e.status === "active").length,
        completed: enrollments.filter(e => e.status === "completed").length,
        revenue: enrollments.reduce((sum, e) => sum + (e.paidAmount || 0), 0),
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FiUsers className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enrollments</h1>
                        <p className="text-sm text-gray-500">{enrollments.length} students enrolled</p>
                    </div>
                </div>
                <button onClick={fetchData} className="btn btn-ghost p-3"><FiRefreshCw className={loading ? "animate-spin" : ""} /></button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-xs text-gray-500">Total Enrollments</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                    <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                    <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="card p-4 text-center">
                    <p className="text-xl font-bold text-primary">৳{stats.revenue.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                </div>
            </div>

            <div className="card p-4 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input placeholder="Search by student or course..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-12 w-full" />
                </div>
                <div className="flex gap-2">
                    {["all", "active", "completed"].map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${filter === f ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{f}</button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Student</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Course</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase">Progress</th>
                                    <th className="text-center px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase">Paid</th>
                                    <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase">Enrolled</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filtered.map((item, i) => (
                                    <motion.tr key={item._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                                                    {item.user?.firstName?.[0]}{item.user?.lastName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{item.user?.firstName} {item.user?.lastName}</p>
                                                    <p className="text-xs text-gray-500">{item.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                <FiBook size={14} className="text-primary" />
                                                {item.course?.title}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${item.progress}%` }} />
                                                </div>
                                                <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{item.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${item.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                                                }`}>
                                                {item.status === "completed" ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-gray-900 dark:text-white">৳{item.paidAmount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <FiCalendar size={12} />
                                                {new Date(item.enrolledAt).toLocaleDateString()}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
