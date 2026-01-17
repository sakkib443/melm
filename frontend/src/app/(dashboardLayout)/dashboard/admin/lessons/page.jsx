"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiPlus, FiSearch, FiVideo, FiLoader, FiEdit, FiTrash2,
    FiRefreshCw, FiBook, FiCheck, FiX, FiPlay, FiFileText, FiLayers
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function LessonsPage() {
    const [lessons, setLessons] = useState([]);
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

    const fetchLessons = async () => {
        try {
            setLoading(true);
            // Fetch all lessons via admin route
            const res = await fetch(`${API_BASE}/api/lessons`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setLessons(data.data);
            } else {
                setLessons([]);
            }
        } catch (err) {
            console.log("Failed to fetch lessons");
            setLessons([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (token) {
            fetchLessons();
        }
    }, [token]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this lesson?")) return;
        try {
            const res = await fetch(`${API_BASE}/api/lessons/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Lesson deleted successfully");
                fetchLessons();
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch (err) {
            toast.error("Failed to delete lesson");
        }
    };

    const filtered = lessons.filter(l => {
        const matchSearch = l.title?.toLowerCase().includes(search.toLowerCase());
        const matchCourse = courseFilter === "all" ||
            (l.course?._id === courseFilter || l.course === courseFilter);
        return matchSearch && matchCourse;
    });

    const stats = {
        total: lessons.length,
        published: lessons.filter(l => l.isPublished).length,
        free: lessons.filter(l => l.isFree).length,
        video: lessons.filter(l => l.lessonType === "video" || l.videoUrl).length,
    };

    const getLessonTypeIcon = (lesson) => {
        if (lesson.lessonType === "quiz") return <FiLayers className="text-purple-500" />;
        if (lesson.lessonType === "text") return <FiFileText className="text-blue-500" />;
        if (lesson.videoUrl || lesson.lessonType === "video") return <FiPlay className="text-red-500" />;
        return <FiFileText className="text-gray-500" />;
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "-";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                        <FiVideo className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lessons</h1>
                        <p className="text-sm text-gray-500">Manage course lessons</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchLessons} className="btn btn-ghost p-3">
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                    <Link href="/dashboard/admin/lessons/create" className="btn btn-primary">
                        <FiPlus size={16} /> Add Lesson
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                            <FiVideo className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Total Lessons</p>
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                            <FiPlay className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.video}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Video Lessons</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <FiBook className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.free}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Free Preview</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search lessons..."
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
                    <FiVideo className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No lessons found</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first lesson</p>
                    <Link href="/dashboard/admin/lessons/create" className="btn btn-primary inline-flex">
                        <FiPlus /> Create Lesson
                    </Link>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lesson</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Free</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filtered.map((lesson, index) => (
                                    <motion.tr
                                        key={lesson._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.02 }}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/30"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                    {lesson.order || 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">{lesson.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {lesson.module?.title || "No module"} • {lesson.course?.title || "Unknown course"}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getLessonTypeIcon(lesson)}
                                                <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                                                    {lesson.lessonType || (lesson.videoUrl ? "video" : "text")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                {formatDuration(lesson.videoDuration)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${lesson.isPublished
                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                }`}>
                                                {lesson.isPublished ? <FiCheck size={12} /> : <FiX size={12} />}
                                                {lesson.isPublished ? "Published" : "Draft"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${lesson.isFree
                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                                                }`}>
                                                {lesson.isFree ? "Free" : "Paid"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/admin/lessons/${lesson._id}/edit`}
                                                    className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors"
                                                >
                                                    <FiEdit size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(lesson._id)}
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
