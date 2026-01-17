"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiPlus, FiSearch, FiLayout, FiLoader, FiEdit, FiTrash2,
    FiRefreshCw, FiBook, FiList, FiCheck, FiX
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ModulesPage() {
    const [modules, setModules] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [courseFilter, setCourseFilter] = useState("all");
    const token = useSelector(selectToken);

    const fetchCourses = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/courses`);
            const data = await res.json();
            if (data.success) {
                setCourses(data.data || []);
            }
        } catch (err) {
            console.log("Failed to fetch courses");
        }
    };

    const fetchModules = async () => {
        try {
            setLoading(true);
            // Fetch modules for all courses or a specific course
            if (courseFilter === "all") {
                // Get all courses first, then fetch modules for each
                const allModules = [];
                for (const course of courses) {
                    try {
                        const res = await fetch(`${API_BASE}/api/modules/course/${course._id}`);
                        const data = await res.json();
                        if (data.success && data.data) {
                            allModules.push(...data.data.map(m => ({ ...m, courseName: course.title })));
                        }
                    } catch (e) {
                        // Continue if one fails
                    }
                }
                setModules(allModules);
            } else {
                const res = await fetch(`${API_BASE}/api/modules/course/${courseFilter}`);
                const data = await res.json();
                if (data.success) {
                    const course = courses.find(c => c._id === courseFilter);
                    setModules((data.data || []).map(m => ({ ...m, courseName: course?.title || "Unknown" })));
                }
            }
        } catch (err) {
            console.log("Failed to fetch modules");
            setModules([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (courses.length > 0) {
            fetchModules();
        } else {
            setLoading(false);
        }
    }, [courses, courseFilter]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this module?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/modules/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Module deleted successfully");
                fetchModules();
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch (err) {
            toast.error("Failed to delete module");
        }
    };

    const filtered = modules.filter(m => {
        const matchSearch = m.title?.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
    });

    const stats = {
        total: modules.length,
        published: modules.filter(m => m.isPublished).length,
        draft: modules.filter(m => !m.isPublished).length,
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <FiLayout className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modules</h1>
                        <p className="text-sm text-gray-500">Manage course modules</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchModules} className="btn btn-ghost p-3">
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                    <Link href="/dashboard/admin/modules/create" className="btn btn-primary">
                        <FiPlus size={16} /> Add Module
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                            <FiLayout className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Total Modules</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <FiCheck className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.published}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Published</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <FiEdit className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.draft}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Draft</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search modules..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-12 w-full"
                        />
                    </div>
                    <select
                        value={courseFilter}
                        onChange={(e) => setCourseFilter(e.target.value)}
                        className="input w-full md:w-64"
                    >
                        <option value="all">All Courses</option>
                        {courses.map(c => (
                            <option key={c._id} value={c._id}>{c.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <FiLoader className="animate-spin text-primary" size={32} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="card p-12 text-center">
                    <FiLayout className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No modules found</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first module</p>
                    <Link href="/dashboard/admin/modules/create" className="btn btn-primary inline-flex">
                        <FiPlus /> Create Module
                    </Link>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Module</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filtered.map((module, index) => (
                                    <motion.tr
                                        key={module._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold">
                                                    {module.order || 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{module.title}</p>
                                                    {module.titleBn && <p className="text-xs text-gray-500">{module.titleBn}</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{module.courseName}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{module.order || 1}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${module.isPublished
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                }`}>
                                                {module.isPublished ? <FiCheck size={12} /> : <FiX size={12} />}
                                                {module.isPublished ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/admin/modules/${module._id}/edit`}
                                                    className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors"
                                                >
                                                    <FiEdit size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(module._id)}
                                                    className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
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
