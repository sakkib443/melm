"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiChevronDown,
    FiChevronUp,
    FiPlay,
    FiLock,
    FiCheckCircle,
    FiMenu,
    FiX,
    FiFileText,
    FiMessageSquare,
    FiDownload,
    FiAward,
    FiArrowLeft,
    FiArrowRight,
    FiMaximize,
    FiSettings,
    FiVolume2
} from "react-icons/fi";
import { courseService } from "@/services/api";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CourseLearnPage() {
    const { slug: id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState([0]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const res = await courseService.getById(id);
                if (res.success) {
                    setCourse(res.data);
                    // Set first lesson as default
                    if (res.data.curriculum?.[0]?.lessons?.[0]) {
                        setCurrentLesson(res.data.curriculum[0].lessons[0]);
                    }
                } else {
                    toast.error("Course not found");
                    router.push("/dashboard/user/courses");
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load course");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const toggleModule = (index) => {
        setExpandedModules(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!course) return null;

    const modules = course.curriculum || [];

    return (
        <div className="min-h-screen bg-[#1c1d1f] flex flex-col overflow-hidden">
            {/* Player Header */}
            <header className="h-[60px] bg-[#2d2f31] border-b border-gray-700 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-4 truncate">
                    <Link href="/dashboard/user/courses" className="text-gray-300 hover:text-white transition-colors">
                        <FiArrowLeft size={20} />
                    </Link>
                    <div className="h-8 w-[1px] bg-gray-600 hidden md:block" />
                    <h1 className="text-white font-bold text-sm md:text-base truncate">
                        {course.title}
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '20%' }} />
                        </div>
                        <span className="text-xs text-gray-400 font-bold whitespace-nowrap">20% Complete</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                    {/* Video Player Section */}
                    <div className="bg-black aspect-video w-full flex items-center justify-center relative group">
                        {currentLesson?.videoUrl ? (
                            <iframe
                                src={currentLesson.videoUrl}
                                className="w-full h-full"
                                allowFullScreen
                                allow="autoplay"
                            />
                        ) : (
                            <div className="text-center text-gray-500">
                                <FiPlay size={64} className="mx-auto mb-4 opacity-20" />
                                <p>Select a lesson to start watching</p>
                            </div>
                        )}

                        {/* Overlay Controls (Mock for UI) */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between pointer-events-none">
                            <div className="flex items-center gap-4 pointer-events-auto">
                                <button className="text-white hover:text-primary transition-colors"><FiArrowLeft size={20} /></button>
                                <button className="text-white hover:text-primary transition-colors"><FiPlay size={24} /></button>
                                <button className="text-white hover:text-primary transition-colors"><FiArrowRight size={20} /></button>
                            </div>
                            <div className="flex items-center gap-4 pointer-events-auto">
                                <button className="text-white hover:text-primary transition-colors"><FiVolume2 size={20} /></button>
                                <button className="text-white hover:text-primary transition-colors"><FiSettings size={20} /></button>
                                <button className="text-white hover:text-primary transition-colors"><FiMaximize size={20} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Lesson Content Tabs */}
                    <div className="flex-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                        <div className="border-b border-gray-200 dark:border-gray-800 px-4 md:px-8">
                            <div className="flex gap-8">
                                {["overview", "reviews", "q&a", "resources"].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 text-sm font-bold capitalize relative transition-colors ${activeTab === tab
                                                ? "text-primary"
                                                : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 md:p-8 max-w-4xl">
                            {activeTab === "overview" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {currentLesson?.title || "Course Overview"}
                                    </h2>
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {currentLesson?.description || course.description}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <FiAward size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Instructor</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{course.instructor || 'Leadion Mentor'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                <FiCheckCircle size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Level</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{course.level || 'Beginner'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                                <FiMessageSquare size={20} />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Language</p>
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">English / Bangla</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "resources" && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <FiFileText size={20} className="text-primary" />
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">Course Source Code.zip</p>
                                                <p className="text-xs text-gray-500">12.5 MB • ZIP Archive</p>
                                            </div>
                                        </div>
                                        <button className="p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm text-gray-500 group-hover:text-primary">
                                            <FiDownload size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Sidebar */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 380, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full sticky right-0 z-40"
                        >
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <h2 className="font-bold text-gray-900 dark:text-white">Course Content</h2>
                                <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}><FiX /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {modules.map((module, idx) => (
                                        <div key={idx} className="bg-white dark:bg-gray-800">
                                            <button
                                                onClick={() => toggleModule(idx)}
                                                className="w-full flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 transition-colors"
                                            >
                                                <div className="flex-1 text-left">
                                                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Section {idx + 1}</p>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{module.moduleTitle}</p>
                                                    <p className="text-[10px] text-gray-500 font-medium">0 / {module.lessons?.length || 0} COMPLETED</p>
                                                </div>
                                                {expandedModules.includes(idx) ? <FiChevronUp /> : <FiChevronDown />}
                                            </button>

                                            <AnimatePresence>
                                                {expandedModules.includes(idx) && (
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: "auto" }}
                                                        exit={{ height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        {module.lessons?.map((lesson, lIdx) => {
                                                            const isActive = currentLesson?._id === lesson._id;
                                                            return (
                                                                <button
                                                                    key={lIdx}
                                                                    onClick={() => setCurrentLesson(lesson)}
                                                                    className={`w-full flex items-start gap-3 p-4 transition-colors ${isActive
                                                                            ? "bg-primary/5 dark:bg-primary/10 border-l-4 border-primary"
                                                                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border-l-4 border-transparent"
                                                                        }`}
                                                                >
                                                                    <div className="mt-0.5">
                                                                        {isActive ? (
                                                                            <FiPlay className="text-primary" size={16} />
                                                                        ) : (
                                                                            <div className="w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 text-left">
                                                                        <p className={`text-sm ${isActive ? "font-bold text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                                                            {idx + 1}.{lIdx + 1} {lesson.title}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 mt-1">
                                                                            <FiPlay size={12} className="text-gray-400" />
                                                                            <span className="text-[10px] text-gray-400 font-medium">
                                                                                {Math.round((lesson.videoDuration || 0) / 60)} min
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #3e4143;
                    border-radius: 10px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4b5563;
                }
            `}</style>
        </div>
    );
}
