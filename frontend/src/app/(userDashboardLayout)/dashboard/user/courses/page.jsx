"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiBook, FiSearch, FiLoader, FiPlay, FiCheckCircle, FiClock, FiArrowRight, FiBookOpen } from "react-icons/fi";
import { enrollmentService } from "@/services/api";

export default function UserCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await enrollmentService.getMyEnrollments();
                if (response.success) {
                    setCourses(response.data || []);
                }
            } catch (error) {
                console.error("Error fetching enrolled courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filtered = courses.filter(c => {
        if (filter === "all") return true;
        if (filter === "completed") return c.progress === 100;
        if (filter === "in-progress") return c.progress > 0 && c.progress < 100;
        return true;
    });

    return (
        <div className="p-6 lg:p-12 space-y-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                        <FiBookOpen className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Access Your Library</h1>
                        <p className="text-gray-500 font-medium">You have active access to {courses.length} courses</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
                    {["all", "in-progress", "completed"].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                }`}
                        >
                            {f.replace("-", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {(!mounted || loading) ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sycing your library...</p>
                </div>
            ) : filtered.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card p-16 text-center bg-white dark:bg-gray-800 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-[3rem]"
                >
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiBook className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No courses here yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto font-medium">Explore our vast library of professional Bangla Font Portfolio design courses and start your journey today.</p>
                    <Link href="/courses" className="px-10 py-4 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2">
                        Browse Courses <FiArrowRight />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((item, i) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all"
                            >
                                {/* Thumbnail Header */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img src={item.course?.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Badges */}
                                    <div className="absolute top-5 left-5 right-5 flex justify-between items-center">
                                        {item.progress === 100 && (
                                            <div className="px-3 py-1 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-xl">
                                                <FiCheckCircle size={12} /> Certified
                                            </div>
                                        )}
                                        <div className="ml-auto px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg border border-white/20">
                                            {item.course?.category?.name || 'Graphic Design'}
                                        </div>
                                    </div>

                                    {/* Centered Play Button on Hover */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link href={`/courses/${item.course?._id}/learn`} className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary shadow-2xl hover:scale-110 transition-transform active:scale-90">
                                            <FiPlay fill="currentColor" size={24} className="ml-1" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-6 h-6 rounded-full overflow-hidden border border-primary/20">
                                            <img src="/avatar-placeholder.png" alt="" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 truncate">{item.course?.instructor || 'MotionBoss Expert'}</span>
                                    </div>

                                    <h3 className="font-black text-gray-900 dark:text-white leading-tight mb-6 line-clamp-2 h-12 group-hover:text-primary transition-colors">
                                        {item.course?.title}
                                    </h3>

                                    {/* Progress Block */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em]">
                                                    {item.completedLessons} / {item.course?.totalLessons || 0} COMPLETED
                                                </span>
                                            </div>
                                            <span className="text-xs font-black text-primary">{item.progress}%</span>
                                        </div>
                                        <div className="h-2.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden p-0.5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.progress}%` }}
                                                className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-gray-700/50">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                            <FiClock size={12} className="text-primary" /> Last Accessed {new Date(item.lastAccessed).toLocaleDateString()}
                                        </span>
                                        <Link href={`/courses/${item.course?._id}/learn`} className="text-xs text-primary font-black uppercase tracking-widest flex items-center gap-2 group/btn">
                                            Go to Class <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
