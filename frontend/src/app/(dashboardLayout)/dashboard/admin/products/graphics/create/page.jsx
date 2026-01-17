"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiSave, FiX, FiImage, FiUpload, FiPlus, FiTrash2,
    FiArrowLeft, FiEye, FiTag, FiDollarSign, FiLayers
} from "react-icons/fi";
import { graphicsService, categoryService } from "@/services/api";

// Graphics Types
const GRAPHICS_TYPES = [
    { value: "logo", label: "Logo Templates" },
    { value: "flyer", label: "Flyer Designs" },
    { value: "banner", label: "Banner Templates" },
    { value: "social-media", label: "Social Media Templates" },
    { value: "poster", label: "Poster Designs" },
    { value: "brochure", label: "Brochure Templates" },
    { value: "business-card", label: "Business Card Templates" },
    { value: "infographic", label: "Infographic Templates" },
    { value: "resume", label: "CV/Resume Templates" },
    { value: "certificate", label: "Certificate Templates" },
    { value: "invitation", label: "Invitation Cards" },
    { value: "mockup", label: "Product Mockups" },
    { value: "icon-set", label: "Icon Packs" },
    { value: "illustration", label: "Illustrations" },
    { value: "other", label: "Other" },
];

const FILE_FORMATS = [
    { value: "psd", label: "PSD (Photoshop)" },
    { value: "ai", label: "AI (Illustrator)" },
    { value: "eps", label: "EPS Vector" },
    { value: "svg", label: "SVG" },
    { value: "png", label: "PNG" },
    { value: "jpg", label: "JPG/JPEG" },
    { value: "pdf", label: "PDF" },
    { value: "figma", label: "Figma" },
    { value: "xd", label: "Adobe XD" },
    { value: "sketch", label: "Sketch" },
    { value: "canva", label: "Canva" },
];

const STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending Review" },
    { value: "published", label: "Published" },
];

export default function CreateGraphicsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        shortDescription: "",
        type: "logo",
        category: "",
        tags: [],
        thumbnail: "",
        previewImages: [],
        price: 0,
        salePrice: null,
        status: "draft",
        fileFormats: [],
        layered: false,
        editable: true,
        features: [],
        highlights: [],
        whatIncluded: [],
        isFeatured: false,
        mainFile: { url: "", size: 0, format: "psd" },
    });

    const [tagInput, setTagInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAll();
                if (response.success && response.data) {
                    setCategories(response.data);
                }
            } catch (error) {
                console.log("Failed to fetch categories");
            }
        };
        fetchCategories();
    }, []);

    // Fetch data for edit mode
    useEffect(() => {
        if (isEditMode && editId) {
            const fetchGraphics = async () => {
                setLoading(true);
                try {
                    const response = await graphicsService.getById(editId);
                    if (response.success && response.data) {
                        const data = response.data;
                        setFormData({
                            title: data.title || "",
                            slug: data.slug || "",
                            description: data.description || "",
                            shortDescription: data.shortDescription || "",
                            type: data.type || "logo",
                            category: data.category?._id || data.category || "",
                            tags: data.tags || [],
                            thumbnail: data.thumbnail || "",
                            previewImages: data.previewImages || [],
                            price: data.price || 0,
                            salePrice: data.salePrice || null,
                            status: data.status || "draft",
                            fileFormats: data.fileFormats || [],
                            layered: data.layered || false,
                            editable: data.editable || true,
                            features: data.features || [],
                            highlights: data.highlights || [],
                            whatIncluded: data.whatIncluded || [],
                            isFeatured: data.isFeatured || false,
                            mainFile: data.mainFile || { url: "", size: 0, format: "psd" },
                        });
                    }
                } catch (error) {
                    toast.error("Failed to fetch graphics data");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchGraphics();
        }
    }, [isEditMode, editId]);

    // Auto-generate slug from title
    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        });
    };

    // Handle form field changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Handle array fields
    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
            setTagInput("");
        }
    };

    const removeTag = (tag) => {
        setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    };

    const addFeature = () => {
        if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
            setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
            setFeatureInput("");
        }
    };

    const removeFeature = (feature) => {
        setFormData({ ...formData, features: formData.features.filter((f) => f !== feature) });
    };

    const toggleFileFormat = (format) => {
        if (formData.fileFormats.includes(format)) {
            setFormData({ ...formData, fileFormats: formData.fileFormats.filter((f) => f !== format) });
        } else {
            setFormData({ ...formData, fileFormats: [...formData.fileFormats, format] });
        }
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Title is required");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                salePrice: formData.salePrice ? Number(formData.salePrice) : null,
            };

            if (isEditMode) {
                await graphicsService.update(editId, payload);
                toast.success("Graphics updated successfully!");
            } else {
                await graphicsService.create(payload);
                toast.success("Graphics created successfully!");
            }
            router.push("/dashboard/admin/products/graphics");
        } catch (error) {
            toast.error(error.message || "Failed to save graphics");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="card p-12 text-center">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading graphics data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link
                        href="/dashboard/admin/products/graphics"
                        className="w-10 h-10 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <FiArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {isEditMode ? "Edit Graphics" : "Create Graphics"}
                        </h1>
                        <p className="text-xs text-gray-500">
                            {isEditMode ? "Update graphics details" : "Add a new graphics item to marketplace"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/dashboard/admin/products/graphics"
                        className="btn btn-ghost"
                    >
                        <FiX size={16} />
                        Cancel
                    </Link>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="btn btn-primary"
                    >
                        <FiSave size={16} />
                        {saving ? "Saving..." : isEditMode ? "Update" : "Create"}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiImage size={16} /> Basic Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleTitleChange}
                                        className="input w-full"
                                        placeholder="Enter graphics title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="input w-full"
                                        placeholder="auto-generated-slug"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Short Description
                                    </label>
                                    <input
                                        type="text"
                                        name="shortDescription"
                                        value={formData.shortDescription}
                                        onChange={handleChange}
                                        className="input w-full"
                                        placeholder="Brief description (max 200 characters)"
                                        maxLength={200}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="input w-full min-h-[150px]"
                                        placeholder="Detailed description of the graphics..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiUpload size={16} /> Media & Files
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Thumbnail URL
                                    </label>
                                    <input
                                        type="url"
                                        name="thumbnail"
                                        value={formData.thumbnail}
                                        onChange={handleChange}
                                        className="input w-full"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                                {formData.thumbnail && (
                                    <div className="w-32 h-24 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Main File URL
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.mainFile.url}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            mainFile: { ...formData.mainFile, url: e.target.value }
                                        })}
                                        className="input w-full"
                                        placeholder="https://example.com/file.zip"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Features & Tags */}
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiTag size={16} /> Tags & Features
                            </h2>
                            <div className="space-y-4">
                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tags
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                            className="input flex-1"
                                            placeholder="Add a tag"
                                        />
                                        <button type="button" onClick={addTag} className="btn btn-ghost">
                                            <FiPlus />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs flex items-center gap-1"
                                            >
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                                                    <FiX size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Features */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Features
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={featureInput}
                                            onChange={(e) => setFeatureInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                                            className="input flex-1"
                                            placeholder="Add a feature"
                                        />
                                        <button type="button" onClick={addFeature} className="btn btn-ghost">
                                            <FiPlus />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1"
                                            >
                                                {feature}
                                                <button type="button" onClick={() => removeFeature(feature)} className="hover:text-red-500">
                                                    <FiX size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* File Formats */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        File Formats Included
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {FILE_FORMATS.map((format) => (
                                            <button
                                                key={format.value}
                                                type="button"
                                                onClick={() => toggleFileFormat(format.value)}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${formData.fileFormats.includes(format.value)
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                    }`}
                                            >
                                                {format.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status & Type */}
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiLayers size={16} /> Status & Type
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="input w-full"
                                    >
                                        {STATUS_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Graphics Type
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="input w-full"
                                    >
                                        {GRAPHICS_TYPES.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="input w-full"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        name="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <label htmlFor="isFeatured" className="text-sm text-gray-600 dark:text-gray-400">
                                        Featured Product
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="layered"
                                        name="layered"
                                        checked={formData.layered}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <label htmlFor="layered" className="text-sm text-gray-600 dark:text-gray-400">
                                        Layered File
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="editable"
                                        name="editable"
                                        checked={formData.editable}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <label htmlFor="editable" className="text-sm text-gray-600 dark:text-gray-400">
                                        Fully Editable
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiDollarSign size={16} /> Pricing
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Regular Price (৳) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="input w-full"
                                        placeholder="0"
                                        min="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Sale Price (৳)
                                    </label>
                                    <input
                                        type="number"
                                        name="salePrice"
                                        value={formData.salePrice || ""}
                                        onChange={handleChange}
                                        className="input w-full"
                                        placeholder="Leave empty if no sale"
                                        min="0"
                                    />
                                </div>
                                {formData.salePrice && formData.price > 0 && (
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
                                        <p className="text-xs text-emerald-600 font-medium">
                                            Discount: {Math.round(((formData.price - formData.salePrice) / formData.price) * 100)}% off
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
