"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiArrowLeft, FiEdit, FiTrash2, FiPlus, FiLoader, FiBook,
    FiPlay, FiUsers, FiClock, FiStar, FiChevronDown, FiChevronUp,
    FiVideo, FiFileText, FiHelpCircle, FiEye, FiEyeOff, FiSave, FiX,
    FiGripVertical, FiCheckCircle
} from "react-icons/fi";
import { courseService, moduleService, lessonService } from "@/services/api";

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id;

    const [course, setCourse] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedModules, setExpandedModules] = useState({});

    // Module Modal State
    const [moduleModal, setModuleModal] = useState({ open: false, mode: "create", data: null });
    const [moduleForm, setModuleForm] = useState({ title: "", titleBn: "", description: "", isPublished: true });
    const [moduleLoading, setModuleLoading] = useState(false);

    // Lesson Modal State
    const [lessonModal, setLessonModal] = useState({ open: false, mode: "create", moduleId: null, data: null });
    const [lessonForm, setLessonForm] = useState({
        title: "", titleBn: "", description: "", lessonType: "video",
        videoUrl: "", videoDuration: 0, isFree: false, isPublished: true
    });
    const [lessonLoading, setLessonLoading] = useState(false);

    // Fetch course details
    const fetchCourse = async () => {
        try {
            const response = await courseService.getById(courseId);
            if (response.success) {
                setCourse(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch course:", err);
            toast.error("Failed to load course");
        }
    };

    // Fetch modules with lessons
    const fetchModules = async () => {
        try {
            const response = await moduleService.getByCourse(courseId);
            if (response.success) {
                setModules(response.data || []);
                // Auto-expand first module
                if (response.data?.length > 0) {
                    setExpandedModules({ [response.data[0]._id]: true });
                }
            }
        } catch (err) {
            console.error("Failed to fetch modules:", err);
        }
    };

    // Fetch lessons for a module
    const fetchLessonsForModule = async (moduleId) => {
        try {
            const response = await lessonService.getByCourse(courseId);
            if (response.success) {
                const moduleLessons = response.data?.filter(l => l.module === moduleId || l.module?._id === moduleId) || [];
                setModules(prev => prev.map(m =>
                    m._id === moduleId ? { ...m, lessons: moduleLessons } : m
                ));
            }
        } catch { /* ignore */ }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchCourse(), fetchModules()]);
            setLoading(false);
        };
        if (courseId) loadData();
    }, [courseId]);

    // Toggle module expansion
    const toggleModule = (moduleId) => {
        setExpandedModules(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
        // Fetch lessons if expanding
        if (!expandedModules[moduleId]) {
            fetchLessonsForModule(moduleId);
        }
    };

    // ==================== MODULE CRUD ====================
    const openModuleModal = (mode = "create", module = null) => {
        setModuleModal({ open: true, mode, data: module });
        setModuleForm(module ? {
            title: module.title || "",
            titleBn: module.titleBn || "",
            description: module.description || "",
            isPublished: module.isPublished ?? true
        } : { title: "", titleBn: "", description: "", isPublished: true });
    };

    const closeModuleModal = () => {
        setModuleModal({ open: false, mode: "create", data: null });
        setModuleForm({ title: "", titleBn: "", description: "", isPublished: true });
    };

    const handleModuleSave = async () => {
        if (!moduleForm.title.trim()) {
            toast.error("Module title is required");
            return;
        }
        setModuleLoading(true);
        try {
            if (moduleModal.mode === "create") {
                const payload = {
                    ...moduleForm,
                    course: courseId,
                    order: modules.length + 1
                };
                await moduleService.create(payload);
                toast.success("Module created successfully");
            } else {
                await moduleService.update(moduleModal.data._id, moduleForm);
                toast.success("Module updated successfully");
            }
            closeModuleModal();
            fetchModules();
        } catch (err) {
            toast.error(err.message || "Failed to save module");
        } finally {
            setModuleLoading(false);
        }
    };

    const handleModuleDelete = async (moduleId) => {
        if (!confirm("Are you sure you want to delete this module? All lessons will also be deleted.")) return;
        try {
            await moduleService.delete(moduleId);
            toast.success("Module deleted");
            fetchModules();
        } catch (err) {
            toast.error(err.message || "Failed to delete module");
        }
    };

    // ==================== LESSON CRUD ====================
    const openLessonModal = (moduleId, mode = "create", lesson = null) => {
        setLessonModal({ open: true, mode, moduleId, data: lesson });
        setLessonForm(lesson ? {
            title: lesson.title || "",
            titleBn: lesson.titleBn || "",
            description: lesson.description || "",
            lessonType: lesson.lessonType || "video",
            videoUrl: lesson.videoUrl || "",
            videoDuration: lesson.videoDuration || 0,
            isFree: lesson.isFree ?? false,
            isPublished: lesson.isPublished ?? true
        } : {
            title: "", titleBn: "", description: "", lessonType: "video",
            videoUrl: "", videoDuration: 0, isFree: false, isPublished: true
        });
    };

    const closeLessonModal = () => {
        setLessonModal({ open: false, mode: "create", moduleId: null, data: null });
        setLessonForm({
            title: "", titleBn: "", description: "", lessonType: "video",
            videoUrl: "", videoDuration: 0, isFree: false, isPublished: true
        });
    };

    const handleLessonSave = async () => {
        if (!lessonForm.title.trim()) {
            toast.error("Lesson title is required");
            return;
        }
        setLessonLoading(true);
        try {
            if (lessonModal.mode === "create") {
                const module = modules.find(m => m._id === lessonModal.moduleId);
                const payload = {
                    ...lessonForm,
                    course: courseId,
                    module: lessonModal.moduleId,
                    order: (module?.lessons?.length || 0) + 1
                };
                await lessonService.create(payload);
                toast.success("Lesson created successfully");
            } else {
                await lessonService.update(lessonModal.data._id, lessonForm);
                toast.success("Lesson updated successfully");
            }
            closeLessonModal();
            fetchLessonsForModule(lessonModal.moduleId);
        } catch (err) {
            toast.error(err.message || "Failed to save lesson");
        } finally {
            setLessonLoading(false);
        }
    };

    const handleLessonDelete = async (lessonId, moduleId) => {
        if (!confirm("Are you sure you want to delete this lesson?")) return;
        try {
            await lessonService.delete(lessonId);
            toast.success("Lesson deleted");
            fetchLessonsForModule(moduleId);
        } catch (err) {
            toast.error(err.message || "Failed to delete lesson");
        }
    };

    const handleLessonTogglePublish = async (lesson, moduleId) => {
        try {
            await lessonService.togglePublish(lesson._id);
            toast.success(lesson.isPublished ? "Lesson unpublished" : "Lesson published");
            fetchLessonsForModule(moduleId);
        } catch (err) {
            toast.error("Failed to toggle publish status");
        }
    };

    const getLessonTypeIcon = (type) => {
        switch (type) {
            case "video": return <FiVideo className="w-4 h-4 text-blue-500" />;
            case "text": return <FiFileText className="w-4 h-4 text-green-500" />;
            case "quiz": return <FiHelpCircle className="w-4 h-4 text-purple-500" />;
            default: return <FiPlay className="w-4 h-4 text-gray-500" />;
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <FiLoader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="p-8 text-center">
                <FiBook className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Course not found</h2>
                <Link href="/dashboard/admin/courses" className="btn btn-primary">
                    Back to Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Link href="/dashboard/admin/courses" className="btn btn-ghost p-3 mt-1">
                        <FiArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${course.status === "published"
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                }`}>
                                {course.status}
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {course.title}
                        </h1>
                        <p className="text-gray-500 text-sm line-clamp-2">{course.shortDescription}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href={`/dashboard/admin/courses/${courseId}/edit`}
                        className="btn btn-ghost"
                    >
                        <FiEdit size={16} /> Edit Course
                    </Link>
                </div>
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <FiBook className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{modules.length}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Modules</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <FiPlay className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)}
                        </p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Lessons</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <FiUsers className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{course.enrolledCount || 0}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Enrolled</p>
                    </div>
                </div>
                <div className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <FiStar className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{course.rating || 0}</p>
                        <p className="text-xs text-gray-500 uppercase font-bold">Rating</p>
                    </div>
                </div>
            </div>

            {/* Modules Section */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Course Content</h2>
                    <button
                        onClick={() => openModuleModal("create")}
                        className="btn btn-primary"
                    >
                        <FiPlus size={16} /> Add Module
                    </button>
                </div>

                {modules.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                        <FiBook className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">No modules yet</h3>
                        <p className="text-gray-500 text-sm mb-4">Start building your course by adding modules</p>
                        <button onClick={() => openModuleModal("create")} className="btn btn-primary">
                            <FiPlus /> Create First Module
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {modules.map((module, index) => (
                            <motion.div
                                key={module._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                            >
                                {/* Module Header */}
                                <div
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => toggleModule(module._id)}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <FiGripVertical className="text-gray-400 cursor-grab" />
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <span className="text-primary font-bold text-sm">{index + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {module.title}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {module.lessons?.length || 0} lessons
                                                {!module.isPublished && (
                                                    <span className="ml-2 text-amber-500">(Draft)</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); openModuleModal("edit", module); }}
                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        >
                                            <FiEdit className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleModuleDelete(module._id); }}
                                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                        {expandedModules[module._id] ? (
                                            <FiChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <FiChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                {/* Lessons List */}
                                <AnimatePresence>
                                    {expandedModules[module._id] && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                                {module.lessons?.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {module.lessons.sort((a, b) => a.order - b.order).map((lesson, lIndex) => (
                                                            <div
                                                                key={lesson._id}
                                                                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-primary/50 transition-colors group"
                                                            >
                                                                <div className="flex items-center gap-3 flex-1">
                                                                    <FiGripVertical className="text-gray-300 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    <span className="text-xs text-gray-400 font-mono w-6">{lIndex + 1}</span>
                                                                    {getLessonTypeIcon(lesson.lessonType)}
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                                            {lesson.title}
                                                                        </p>
                                                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                                                            <span className="flex items-center gap-1">
                                                                                <FiClock className="w-3 h-3" />
                                                                                {formatDuration(lesson.videoDuration)}
                                                                            </span>
                                                                            {lesson.isFree && (
                                                                                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                                                                    FREE
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => handleLessonTogglePublish(lesson, module._id)}
                                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                                                        title={lesson.isPublished ? "Unpublish" : "Publish"}
                                                                    >
                                                                        {lesson.isPublished ? (
                                                                            <FiEye className="w-4 h-4 text-green-500" />
                                                                        ) : (
                                                                            <FiEyeOff className="w-4 h-4 text-gray-400" />
                                                                        )}
                                                                    </button>
                                                                    <button
                                                                        onClick={() => openLessonModal(module._id, "edit", lesson)}
                                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                                                                    >
                                                                        <FiEdit className="w-4 h-4 text-gray-500" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleLessonDelete(lesson._id, module._id)}
                                                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                                                                    >
                                                                        <FiTrash2 className="w-4 h-4 text-red-500" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6 text-gray-500 text-sm">
                                                        No lessons in this module yet
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => openLessonModal(module._id, "create")}
                                                    className="mt-3 w-full py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                                                >
                                                    <FiPlus /> Add Lesson
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Module Modal */}
            <AnimatePresence>
                {moduleModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeModuleModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {moduleModal.mode === "create" ? "Create Module" : "Edit Module"}
                                </h3>
                                <button onClick={closeModuleModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <FiX className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Title (English) *</label>
                                    <input
                                        type="text"
                                        value={moduleForm.title}
                                        onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                                        className="input w-full"
                                        placeholder="e.g., Introduction to React"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Title (Bengali)</label>
                                    <input
                                        type="text"
                                        value={moduleForm.titleBn}
                                        onChange={(e) => setModuleForm({ ...moduleForm, titleBn: e.target.value })}
                                        className="input w-full"
                                        placeholder="e.g., রিয়েক্ট পরিচিতি"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Description</label>
                                    <textarea
                                        value={moduleForm.description}
                                        onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                                        className="input w-full resize-none"
                                        rows={3}
                                        placeholder="Brief description of this module..."
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="modulePublished"
                                        checked={moduleForm.isPublished}
                                        onChange={(e) => setModuleForm({ ...moduleForm, isPublished: e.target.checked })}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <label htmlFor="modulePublished" className="text-sm text-gray-700 dark:text-gray-300">
                                        Published (visible to students)
                                    </label>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                                <button onClick={closeModuleModal} className="btn btn-ghost">Cancel</button>
                                <button onClick={handleModuleSave} disabled={moduleLoading} className="btn btn-primary">
                                    {moduleLoading ? <FiLoader className="animate-spin" /> : <FiSave />}
                                    {moduleModal.mode === "create" ? "Create Module" : "Save Changes"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Lesson Modal */}
            <AnimatePresence>
                {lessonModal.open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeLessonModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {lessonModal.mode === "create" ? "Create Lesson" : "Edit Lesson"}
                                </h3>
                                <button onClick={closeLessonModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                                    <FiX className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Title (English) *</label>
                                    <input
                                        type="text"
                                        value={lessonForm.title}
                                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                        className="input w-full"
                                        placeholder="e.g., What is React?"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Title (Bengali)</label>
                                    <input
                                        type="text"
                                        value={lessonForm.titleBn}
                                        onChange={(e) => setLessonForm({ ...lessonForm, titleBn: e.target.value })}
                                        className="input w-full"
                                        placeholder="e.g., রিয়েক্ট কি?"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Lesson Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: "video", label: "Video", icon: FiVideo },
                                            { value: "text", label: "Text", icon: FiFileText },
                                            { value: "quiz", label: "Quiz", icon: FiHelpCircle },
                                        ].map(type => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setLessonForm({ ...lessonForm, lessonType: type.value })}
                                                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${lessonForm.lessonType === type.value
                                                        ? "border-primary bg-primary/10"
                                                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                    }`}
                                            >
                                                <type.icon className={`w-5 h-5 ${lessonForm.lessonType === type.value ? "text-primary" : "text-gray-500"}`} />
                                                <span className={`text-sm font-medium ${lessonForm.lessonType === type.value ? "text-primary" : "text-gray-600 dark:text-gray-400"}`}>
                                                    {type.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {lessonForm.lessonType === "video" && (
                                    <>
                                        <div>
                                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Video URL</label>
                                            <input
                                                type="text"
                                                value={lessonForm.videoUrl}
                                                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                                className="input w-full"
                                                placeholder="https://vimeo.com/... or YouTube URL"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Duration (seconds)</label>
                                            <input
                                                type="number"
                                                value={lessonForm.videoDuration}
                                                onChange={(e) => setLessonForm({ ...lessonForm, videoDuration: parseInt(e.target.value) || 0 })}
                                                className="input w-full"
                                                placeholder="e.g., 600 (for 10 minutes)"
                                            />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Description</label>
                                    <textarea
                                        value={lessonForm.description}
                                        onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                                        className="input w-full resize-none"
                                        rows={3}
                                        placeholder="What students will learn in this lesson..."
                                    />
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="lessonFree"
                                            checked={lessonForm.isFree}
                                            onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300"
                                        />
                                        <label htmlFor="lessonFree" className="text-sm text-gray-700 dark:text-gray-300">
                                            Free Preview
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="lessonPublished"
                                            checked={lessonForm.isPublished}
                                            onChange={(e) => setLessonForm({ ...lessonForm, isPublished: e.target.checked })}
                                            className="w-4 h-4 rounded border-gray-300"
                                        />
                                        <label htmlFor="lessonPublished" className="text-sm text-gray-700 dark:text-gray-300">
                                            Published
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
                                <button onClick={closeLessonModal} className="btn btn-ghost">Cancel</button>
                                <button onClick={handleLessonSave} disabled={lessonLoading} className="btn btn-primary">
                                    {lessonLoading ? <FiLoader className="animate-spin" /> : <FiSave />}
                                    {lessonModal.mode === "create" ? "Create Lesson" : "Save Changes"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
