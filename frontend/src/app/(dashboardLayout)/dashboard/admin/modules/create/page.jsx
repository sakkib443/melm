"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FiLayout, FiArrowLeft, FiSave, FiLoader, FiBook
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CreateModulePage() {
    const router = useRouter();
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [coursesLoading, setCoursesLoading] = useState(true);

    const [formData, setFormData] = useState({
        course: "",
        title: "",
        titleBn: "",
        description: "",
        order: 1,
        isPublished: false,
    });

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/courses`);
                const data = await res.json();
                if (data.success) {
                    setCourses(data.data || []);
                }
            } catch (err) {
                console.log("Failed to fetch courses");
            } finally {
                setCoursesLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.course) {
            toast.error("Please select a course");
            return;
        }
        if (!formData.title) {
            toast.error("Please enter a module title");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/modules`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    order: parseInt(formData.order) || 1
                })
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Module created successfully!");
                router.push("/dashboard/admin/modules");
            } else {
                toast.error(data.message || "Failed to create module");
            }
        } catch (err) {
            toast.error("Failed to create module");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard/admin/modules"
                    className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                    <FiArrowLeft />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <FiLayout className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Module</h1>
                        <p className="text-sm text-gray-500">Add a new module to a course</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl">
                <div className="card p-6 space-y-6">
                    {/* Course Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Select Course <span className="text-red-500">*</span>
                        </label>
                        {coursesLoading ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <FiLoader className="animate-spin" /> Loading courses...
                            </div>
                        ) : (
                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                className="input w-full"
                                required
                            >
                                <option value="">-- Select a Course --</option>
                                {courses.map(c => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Module Title (English) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Introduction to JavaScript"
                            className="input w-full"
                            required
                        />
                    </div>

                    {/* Title Bangla */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Module Title (বাংলা)
                        </label>
                        <input
                            type="text"
                            name="titleBn"
                            value={formData.titleBn}
                            onChange={handleChange}
                            placeholder="e.g., জাভাস্ক্রিপ্ট পরিচিতি"
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
                            placeholder="Brief description of the module content..."
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
                        <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                    </div>

                    {/* Published */}
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
                            Publish immediately
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? (
                                <>
                                    <FiLoader className="animate-spin" /> Creating...
                                </>
                            ) : (
                                <>
                                    <FiSave /> Create Module
                                </>
                            )}
                        </button>
                        <Link href="/dashboard/admin/modules" className="btn btn-ghost">
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
