"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiFolder, FiArrowLeft, FiSave, FiLoader, FiImage, FiUpload
} from "react-icons/fi";
import { categoryService } from "@/services/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CreateCategoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [parents, setParents] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        image: "",
        type: "graphics",
        isParent: true,
        parentCategory: "",
        status: "active",
    });

    const productTypes = [
        { value: "graphics", label: "Graphics" },
        { value: "videoTemplate", label: "Video Template" },
        { value: "uiKit", label: "UI Kit" },
        { value: "appTemplate", label: "App Template" },
        { value: "audio", label: "Audio" },
        { value: "photo", label: "Photo" },
        { value: "font", label: "Font" },
        { value: "course", label: "Course" },
    ];

    useEffect(() => {
        const fetchParents = async () => {
            try {
                const token = localStorage.getItem("creativehub-auth");
                const authToken = token ? JSON.parse(token).token : null;
                const res = await fetch(`${API_BASE}/api/categories?isParent=true`, {
                    headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
                });
                const data = await res.json();
                if (data.success) setParents(data.data || []);
            } catch (err) {
                console.log("Failed to fetch parent categories");
            }
        };
        fetchParents();
    }, []);

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setFormData({
            ...formData,
            name,
            slug: generateSlug(name),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Category name is required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                parentCategory: formData.isParent ? null : formData.parentCategory || null,
            };

            await categoryService.create(payload);
            toast.success("Category created successfully!");
            router.push("/dashboard/admin/categories");
        } catch (err) {
            toast.error(err.message || "Failed to create category");
        } finally {
            setLoading(false);
        }
    };

    const filteredParents = parents.filter(p => p.type === formData.type);

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/admin/categories" className="btn btn-ghost p-3">
                    <FiArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FiFolder className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Category</h1>
                        <p className="text-sm text-gray-500">Add a new category to the marketplace</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="card p-6 space-y-6">
                    {/* Name & Slug */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleNameChange}
                                className="input"
                                placeholder="e.g., Logo Templates"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                                URL Slug
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="input font-mono"
                                placeholder="logo-templates"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="input resize-none"
                            placeholder="Brief description of this category..."
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                            Category Image
                        </label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="input"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            {formData.image && (
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                                    <img src={formData.image} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Type Selection */}
                    <div>
                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                            Category Type *
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {productTypes.map(type => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type.value, parentCategory: "" })}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${formData.type === type.value
                                        ? "bg-primary text-white shadow-lg"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200"
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Parent/Child Toggle */}
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                        <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white">Is Parent Category?</p>
                            <p className="text-sm text-gray-500">Parent categories can have sub-categories</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, isParent: !formData.isParent })}
                            className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${formData.isParent ? "bg-primary justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
                                }`}
                        >
                            <div className="w-6 h-6 bg-white rounded-full shadow" />
                        </button>
                    </div>

                    {/* Parent Category Selector */}
                    {!formData.isParent && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                        >
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                                Parent Category
                            </label>
                            <select
                                value={formData.parentCategory}
                                onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                                className="input"
                            >
                                <option value="">Select parent category</option>
                                {filteredParents.map(p => (
                                    <option key={p._id} value={p._id}>{p.name}</option>
                                ))}
                            </select>
                            {filteredParents.length === 0 && (
                                <p className="text-sm text-amber-600 mt-2">
                                    No parent categories found for {formData.type}. Create a parent category first.
                                </p>
                            )}
                        </motion.div>
                    )}

                    {/* Status */}
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                        <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white">Status</p>
                            <p className="text-sm text-gray-500">Active categories are visible to users</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                ...formData,
                                status: formData.status === "active" ? "inactive" : "active"
                            })}
                            className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${formData.status === "active" ? "bg-emerald-500 justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
                                }`}
                        >
                            <div className="w-6 h-6 bg-white rounded-full shadow" />
                        </button>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 mt-6">
                    <Link href="/dashboard/admin/categories" className="btn btn-ghost flex-1">
                        Cancel
                    </Link>
                    <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                        {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                        Create Category
                    </button>
                </div>
            </form>
        </div>
    );
}
