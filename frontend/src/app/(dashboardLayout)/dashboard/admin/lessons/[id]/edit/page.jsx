"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FiVideo, FiArrowLeft, FiSave, FiLoader, FiBook, FiPlay, FiFileText, FiLayers
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function EditLessonPage() {
    const router = useRouter();
    const params = useParams();
    const lessonId = params.id;
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [courses, setCourses] = useState([]);
    const [modules, setModules] = useState([]);

    const [formData, setFormData] = useState({
        course: "",
        module: "",
        title: "",
        titleBn: "",
        description: "",
        descriptionBn: "",
        lessonType: "video",
        videoUrl: "",
        videoDuration: "",
        videoProvider: "youtube",
        textContent: "",
        order: 1,
        isFree: false,
        isPublished: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch courses
                const coursesRes = await fetch(`${API_BASE}/api/courses`);
                const coursesData = await coursesRes.json();
                if (coursesData.success) {
                    setCourses(coursesData.data || []);
                }

                // Fetch lesson
                const lessonRes = await fetch(`${API_BASE}/api/lessons/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const lessonData = await lessonRes.json();
                if (lessonData.success && lessonData.data) {
                    const l = lessonData.data;
                    const courseId = l.course?._id || l.course || "";

                    setFormData({
                        course: courseId,
                        module: l.module?._id || l.module || "",
                        title: l.title || "",
                        titleBn: l.titleBn || "",
                        description: l.description || "",
                        descriptionBn: l.descriptionBn || "",
                        lessonType: l.lessonType || "video",
                        videoUrl: l.videoUrl || "",
                        videoDuration: l.videoDuration || "",
                        videoProvider: l.videoProvider || "youtube",
                        textContent: l.textContent || "",
                        order: l.order || 1,
                        isFree: l.isFree || false,
                        isPublished: l.isPublished || false,
                    });

                    // Fetch modules for the course
                    if (courseId) {
                        const modulesRes = await fetch(`${API_BASE}/api/modules/course/${courseId}`);
                        const modulesData = await modulesRes.json();
                        if (modulesData.success) {
                            setModules(modulesData.data || []);
                        }
                    }
                }
            } catch (err) {
                console.log("Failed to fetch data");
                toast.error("Failed to load lesson");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, [lessonId, token]);

    // Fetch modules when course changes
    useEffect(() => {
        const fetchModules = async () => {
            if (!formData.course || fetching) return;
            try {
                const res = await fetch(`${API_BASE}/api/modules/course/${formData.course}`);
                const data = await res.json();
                if (data.success) {
                    setModules(data.data || []);
                }
            } catch (err) {
                console.log("Failed to fetch modules");
            }
        };
        fetchModules();
    }, [formData.course, fetching]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title) {
            toast.error("Please enter a lesson title");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                title: formData.title,
                titleBn: formData.titleBn || undefined,
                description: formData.description || undefined,
                descriptionBn: formData.descriptionBn || undefined,
                lessonType: formData.lessonType,
                order: parseInt(formData.order) || 1,
                isFree: formData.isFree,
                isPublished: formData.isPublished,
            };

            // Add type-specific fields
            if (formData.lessonType === "video" || formData.lessonType === "mixed") {
                payload.videoUrl = formData.videoUrl || undefined;
                payload.videoProvider = formData.videoProvider;
                if (formData.videoDuration) {
                    payload.videoDuration = parseInt(formData.videoDuration);
                }
            }

            if (formData.lessonType === "text" || formData.lessonType === "mixed") {
                payload.textContent = formData.textContent || undefined;
            }

            const res = await fetch(`${API_BASE}/api/lessons/${lessonId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Lesson updated successfully!");
                router.push("/dashboard/admin/lessons");
            } else {
                toast.error(data.message || "Failed to update lesson");
            }
        } catch (err) {
            toast.error("Failed to update lesson");
        } finally {
            setLoading(false);
        }
    };

    const lessonTypes = [
        { value: "video", label: "Video", icon: FiPlay, color: "text-red-500" },
        { value: "text", label: "Text/Article", icon: FiFileText, color: "text-blue-500" },
        { value: "quiz", label: "Quiz", icon: FiLayers, color: "text-purple-500" },
        { value: "mixed", label: "Mixed", icon: FiBook, color: "text-amber-500" },
    ];

    const videoProviders = [
        { value: "youtube", label: "YouTube" },
        { value: "vimeo", label: "Vimeo" },
        { value: "cloudinary", label: "Cloudinary" },
        { value: "bunny", label: "Bunny.net" },
        { value: "custom", label: "Custom URL" },
    ];

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <FiLoader className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/admin/lessons"
                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <FiArrowLeft />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                        <FiVideo className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Lesson</h1>
                        <p className="text-sm text-gray-500">Update lesson details</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="space-y-6">
                    {/* Course & Module (Read Only) */}
                    <div className="card p-6 space-y-6">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <FiBook className="text-primary" /> Course & Module
                        </h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Course
                                </label>
                                <select
                                    name="course"
                                    value={formData.course}
                                    disabled
                                    className="input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                                >
                                    <option value="">-- Select a Course --</option>
                                    {courses.map(c => (
                                        <option key={c._id} value={c._id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Module
                                </label>
                                <select
                                    name="module"
                                    value={formData.module}
                                    disabled
                                    className="input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                                >
                                    <option value="">-- Select a Module --</option>
                                    {modules.map(m => (
                                        <option key={m._id} value={m._id}>{m.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Course and module cannot be changed after creation</p>
                    </div>

                    {/* Lesson Info */}
                    <div className="card p-6 space-y-6">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Lesson Information</h2>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Lesson Title (English) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g., Introduction to Variables"
                                className="input w-full"
                                required
                            />
                        </div>

                        {/* Title Bangla */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Lesson Title (বাংলা)
                            </label>
                            <input
                                type="text"
                                name="titleBn"
                                value={formData.titleBn}
                                onChange={handleChange}
                                placeholder="e.g., ভেরিয়েবল পরিচিতি"
                                className="input w-full"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief description of the lesson content..."
                                rows={3}
                                className="input w-full"
                            />
                        </div>

                        {/* Order */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={formData.order}
                                onChange={handleChange}
                                min="1"
                                className="input w-32"
                            />
                        </div>
                    </div>

                    {/* Lesson Type */}
                    <div className="card p-6 space-y-6">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Content Type</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {lessonTypes.map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, lessonType: type.value }))}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.lessonType === type.value
                                            ? "border-primary bg-primary/5"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                        }`}
                                >
                                    <type.icon className={`w-6 h-6 mx-auto mb-2 ${type.color}`} />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{type.label}</p>
                                </button>
                            ))}
                        </div>

                        {/* Video Fields */}
                        {(formData.lessonType === "video" || formData.lessonType === "mixed") && (
                            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiPlay className="text-red-500" /> Video Settings
                                </h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Video Provider
                                        </label>
                                        <select
                                            name="videoProvider"
                                            value={formData.videoProvider}
                                            onChange={handleChange}
                                            className="input w-full"
                                        >
                                            {videoProviders.map(p => (
                                                <option key={p.value} value={p.value}>{p.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Duration (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            name="videoDuration"
                                            value={formData.videoDuration}
                                            onChange={handleChange}
                                            placeholder="e.g., 600"
                                            className="input w-full"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Video URL
                                    </label>
                                    <input
                                        type="url"
                                        name="videoUrl"
                                        value={formData.videoUrl}
                                        onChange={handleChange}
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="input w-full"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Text Content */}
                        {(formData.lessonType === "text" || formData.lessonType === "mixed") && (
                            <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FiFileText className="text-blue-500" /> Text Content
                                </h3>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Content (HTML supported)
                                    </label>
                                    <textarea
                                        name="textContent"
                                        value={formData.textContent}
                                        onChange={handleChange}
                                        placeholder="Enter lesson content here... (HTML tags supported)"
                                        rows={8}
                                        className="input w-full font-mono text-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="card p-6 space-y-6">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Settings</h2>

                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isFree"
                                    name="isFree"
                                    checked={formData.isFree}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isFree" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Free Preview (Visible to all)
                                </label>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isPublished"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Published
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <FiSave /> Save Changes
                                </>
                            )}
                        </button>
                        <Link href="/dashboard/admin/lessons" className="btn btn-ghost">
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
