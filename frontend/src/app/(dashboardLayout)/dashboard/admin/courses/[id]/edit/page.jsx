"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiBook, FiArrowLeft, FiSave, FiLoader, FiPlus, FiTrash2, FiDollarSign
} from "react-icons/fi";
import { courseService, categoryService } from "@/services/api";

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id;

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [activeTab, setActiveTab] = useState("basic");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        shortDescription: "",
        thumbnail: "",
        previewVideo: "",
        category: "",
        level: "beginner",
        language: "Bangla",
        price: 0,
        salePrice: 0,
        duration: "",
        requirements: [""],
        whatYouWillLearn: [""],
        targetAudience: [""],
        status: "draft",
    });

    // Fetch course and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [courseRes, categoryRes] = await Promise.all([
                    courseService.getById(courseId),
                    categoryService.getAll()
                ]);

                if (courseRes.success && courseRes.data) {
                    const course = courseRes.data;
                    setFormData({
                        title: course.title || "",
                        slug: course.slug || "",
                        description: course.description || "",
                        shortDescription: course.shortDescription || "",
                        thumbnail: course.thumbnail || "",
                        previewVideo: course.previewVideo || "",
                        category: course.category?._id || course.category || "",
                        level: course.level || "beginner",
                        language: course.language || "Bangla",
                        price: course.price || 0,
                        salePrice: course.salePrice || 0,
                        duration: course.duration || "",
                        requirements: course.requirements?.length ? course.requirements : [""],
                        whatYouWillLearn: course.whatYouWillLearn?.length ? course.whatYouWillLearn : [""],
                        targetAudience: course.targetAudience?.length ? course.targetAudience : [""],
                        status: course.status || "draft",
                    });
                }

                if (categoryRes.success) {
                    setCategories(categoryRes.data?.filter(c => c.type === "course") || []);
                }
            } catch (err) {
                console.error("Failed to fetch course:", err);
                toast.error("Failed to load course data");
            } finally {
                setInitialLoading(false);
            }
        };

        if (courseId) fetchData();
    }, [courseId]);

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({ ...formData, title, slug: generateSlug(title) });
    };

    const handleArrayAdd = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ""] });
    };

    const handleArrayChange = (field, index, value) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const handleArrayRemove = (field, index) => {
        const updated = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updated.length ? updated : [""] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Course title is required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                requirements: formData.requirements.filter(r => r.trim()),
                whatYouWillLearn: formData.whatYouWillLearn.filter(w => w.trim()),
                targetAudience: formData.targetAudience.filter(t => t.trim()),
                price: Number(formData.price),
                salePrice: Number(formData.salePrice) || null,
            };

            await courseService.update(courseId, payload);
            toast.success("Course updated successfully!");
            router.push(`/dashboard/admin/courses/${courseId}`);
        } catch (err) {
            toast.error(err.message || "Failed to update course");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "basic", label: "Basic Info" },
        { id: "content", label: "Content" },
        { id: "pricing", label: "Pricing" },
        { id: "seo", label: "SEO" },
    ];

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <FiLoader className="animate-spin text-primary" size={40} />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href={`/dashboard/admin/courses/${courseId}`} className="btn btn-ghost p-3">
                    <FiArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FiBook className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Course</h1>
                        <p className="text-sm text-gray-500">Update course information</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === tab.id
                            ? "bg-primary text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                {activeTab === "basic" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Title *</label>
                                <input type="text" value={formData.title} onChange={handleTitleChange} className="input" placeholder="e.g., Complete React Masterclass" required />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Slug</label>
                                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="input font-mono" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Short Description</label>
                            <input type="text" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className="input" placeholder="Brief overview in one line" maxLength={200} />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Full Description</label>
                            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={5} className="input resize-none" placeholder="Detailed course description..." />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Category</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input">
                                    <option value="">Select category</option>
                                    {categories.map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Level</label>
                                <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="input">
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Language</label>
                                <select value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="input">
                                    <option value="Bangla">Bangla</option>
                                    <option value="English">English</option>
                                    <option value="Hindi">Hindi</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Thumbnail URL</label>
                                <input type="text" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} className="input" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Preview Video URL</label>
                                <input type="text" value={formData.previewVideo} onChange={(e) => setFormData({ ...formData, previewVideo: e.target.value })} className="input" placeholder="YouTube or Vimeo link" />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Content */}
                {activeTab === "content" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-6">
                        {/* Requirements */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-gray-500 uppercase">Requirements</label>
                                <button type="button" onClick={() => handleArrayAdd("requirements")} className="btn btn-ghost text-sm p-2"><FiPlus /> Add</button>
                            </div>
                            <div className="space-y-2">
                                {formData.requirements.map((req, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={req} onChange={(e) => handleArrayChange("requirements", i, e.target.value)} className="input flex-1" placeholder={`Requirement ${i + 1}`} />
                                        <button type="button" onClick={() => handleArrayRemove("requirements", i)} className="btn btn-ghost text-red-500 p-2"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* What You'll Learn */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-gray-500 uppercase">What You'll Learn</label>
                                <button type="button" onClick={() => handleArrayAdd("whatYouWillLearn")} className="btn btn-ghost text-sm p-2"><FiPlus /> Add</button>
                            </div>
                            <div className="space-y-2">
                                {formData.whatYouWillLearn.map((item, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={item} onChange={(e) => handleArrayChange("whatYouWillLearn", i, e.target.value)} className="input flex-1" placeholder={`Learning outcome ${i + 1}`} />
                                        <button type="button" onClick={() => handleArrayRemove("whatYouWillLearn", i)} className="btn btn-ghost text-red-500 p-2"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Target Audience */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-bold text-gray-500 uppercase">Target Audience</label>
                                <button type="button" onClick={() => handleArrayAdd("targetAudience")} className="btn btn-ghost text-sm p-2"><FiPlus /> Add</button>
                            </div>
                            <div className="space-y-2">
                                {formData.targetAudience.map((item, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={item} onChange={(e) => handleArrayChange("targetAudience", i, e.target.value)} className="input flex-1" placeholder={`Target audience ${i + 1}`} />
                                        <button type="button" onClick={() => handleArrayRemove("targetAudience", i)} className="btn btn-ghost text-red-500 p-2"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Pricing */}
                {activeTab === "pricing" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Regular Price (৳)</label>
                                <div className="relative">
                                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="input pl-10" min="0" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Sale Price (৳)</label>
                                <div className="relative">
                                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input type="number" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} className="input pl-10" min="0" placeholder="Optional" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Duration</label>
                            <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="input" placeholder="e.g., 24 hours" />
                        </div>

                        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                            <div className="flex-1">
                                <p className="font-bold text-gray-900 dark:text-white">Status</p>
                                <p className="text-sm text-gray-500">Publish course immediately or save as draft</p>
                            </div>
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input w-40">
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="pending">Pending Review</option>
                            </select>
                        </div>
                    </motion.div>
                )}

                {/* SEO */}
                {activeTab === "seo" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-6">
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                SEO meta tags will be auto-generated from the course title and description. Advanced SEO options coming soon.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Submit */}
                <div className="flex gap-4 mt-6">
                    <Link href={`/dashboard/admin/courses/${courseId}`} className="btn btn-ghost flex-1">Cancel</Link>
                    <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                        {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                        Update Course
                    </button>
                </div>
            </form>
        </div>
    );
}
