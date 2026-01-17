"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiPlus, FiSearch, FiBook, FiLoader, FiEdit, FiTrash2, FiEye,
    FiRefreshCw, FiUsers, FiPlay, FiStar, FiClock, FiDollarSign
} from "react-icons/fi";
import { courseService } from "@/services/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const mockCourses = [
        {
            _id: "1",
            title: "Complete Web Development Bootcamp",
            slug: "complete-web-development-bootcamp",
            thumbnail: "https://via.placeholder.com/400x300/6366f1/ffffff?text=Web+Dev",
            price: 4999,
            salePrice: 2999,
            status: "published",
            enrolledCount: 234,
            lessonsCount: 48,
            duration: "32 hours",
            rating: 4.8,
            instructor: { firstName: "John", lastName: "Doe" },
        },
        {
            _id: "2",
            title: "React & Next.js Masterclass",
            slug: "react-nextjs-masterclass",
            thumbnail: "https://via.placeholder.com/400x300/10b981/ffffff?text=React",
            price: 3999,
            salePrice: null,
            status: "published",
            enrolledCount: 156,
            lessonsCount: 36,
            duration: "24 hours",
            rating: 4.9,
            instructor: { firstName: "Jane", lastName: "Smith" },
        },
        {
            _id: "3",
            title: "UI/UX Design Fundamentals",
            slug: "ui-ux-design-fundamentals",
            thumbnail: "https://via.placeholder.com/400x300/f59e0b/ffffff?text=UI+UX",
            price: 2999,
            salePrice: 1999,
            status: "draft",
            enrolledCount: 89,
            lessonsCount: 24,
            duration: "16 hours",
            rating: 4.6,
            instructor: { firstName: "Mike", lastName: "Johnson" },
        },
    ];

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await courseService.getAll();
            if (response.success && response.data) {
                setCourses(response.data);
            } else {
                setCourses(mockCourses);
            }
        } catch (err) {
            console.log("Using mock data");
            setCourses(mockCourses);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this course?")) return;
        try {
            await courseService.delete(id);
            toast.success("Course deleted");
            fetchCourses();
        } catch (err) {
            toast.error("Failed to delete course");
        }
    };

    const filtered = courses.filter(c => {
        const matchSearch = c.title?.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: courses.length,
        published: courses.filter(c => c.status === "published").length,
        draft: courses.filter(c => c.status === "draft").length,
        totalEnrollments: courses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0),
    };

    const getStatusBadge = (status) => {
        const styles = {
            published: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            draft: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
            pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        };
        return styles[status] || "bg-gray-100 text-gray-600";
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FiBook className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
                        <p className="text-sm text-gray-500">Manage LMS courses</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchCourses} className="btn btn-ghost p-3">
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                    <Link href="/dashboard/admin/courses/create" className="btn btn-primary">
                        <FiPlus size={16} /> Add Course
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                            <FiBook className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Total Courses</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <FiPlay className="text-white" />
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
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                            <FiUsers className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEnrollments}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Enrollments</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search courses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-12 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {["all", "published", "draft", "pending"].map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${statusFilter === status
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <FiLoader className="animate-spin text-primary" size={32} />
                </div>
            ) : filtered.length === 0 ? (
                <div className="card p-12 text-center">
                    <FiBook className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first course</p>
                    <Link href="/dashboard/admin/courses/create" className="btn btn-primary inline-flex">
                        <FiPlus /> Create Course
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((course, index) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="card overflow-hidden group"
                        >
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {course.salePrice && (
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                                        SALE
                                    </div>
                                )}
                                <div className="absolute top-3 right-3">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold capitalize ${getStatusBadge(course.status)}`}>
                                        {course.status}
                                    </span>
                                </div>
                                {/* Hover Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Link
                                        href={`/dashboard/admin/courses/${course._id}`}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <FiEye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/dashboard/admin/courses/${course._id}/edit`}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                                    >
                                        <FiEdit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                    {course.title}
                                </h3>

                                {/* Instructor */}
                                <p className="text-sm text-gray-500 mb-3">
                                    by {course.instructor?.firstName} {course.instructor?.lastName}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                    <span className="flex items-center gap-1">
                                        <FiUsers className="w-3 h-3" />
                                        {course.enrolledCount} students
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiPlay className="w-3 h-3" />
                                        {course.lessonsCount} lessons
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiStar className="w-3 h-3 text-amber-500" />
                                        {course.rating}
                                    </span>
                                </div>

                                {/* Price */}
                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        {course.salePrice ? (
                                            <>
                                                <span className="text-lg font-bold text-primary">৳{course.salePrice}</span>
                                                <span className="text-sm text-gray-400 line-through">৳{course.price}</span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">৳{course.price}</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <FiClock className="w-3 h-3" />
                                        {course.duration}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
