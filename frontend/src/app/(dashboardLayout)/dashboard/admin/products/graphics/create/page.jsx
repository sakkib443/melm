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
    const [errors, setErrors] = useState({});

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        titleBn: "",
        slug: "",
        description: "",
        descriptionBn: "",
        shortDescription: "",
        shortDescriptionBn: "",
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
        featuresBn: [],
        highlights: [],
        highlightsBn: [],
        whatIncluded: [],
        whatIncludedBn: [],
        isFeatured: false,
        isBestSeller: false,
        isTrending: false,
        mainFile: { url: "", size: 0, format: "psd" },
        dimensions: { width: 0, height: 0, unit: "px" },
        dpi: 300,
        colorMode: "RGB",
        seoTitle: "",
        seoDescription: "",
        seoKeywords: [],
    });

    const [tagInput, setTagInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const [featureBnInput, setFeatureBnInput] = useState("");
    const [highlightInput, setHighlightInput] = useState("");
    const [highlightBnInput, setHighlightBnInput] = useState("");
    const [includedInput, setIncludedInput] = useState("");
    const [includedBnInput, setIncludedBnInput] = useState("");
    const [seoKeywordInput, setSeoKeywordInput] = useState("");

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
                            titleBn: data.titleBn || "",
                            slug: data.slug || "",
                            description: data.description || "",
                            descriptionBn: data.descriptionBn || "",
                            shortDescription: data.shortDescription || "",
                            shortDescriptionBn: data.shortDescriptionBn || "",
                            type: data.type || "logo",
                            category: data.category || "",
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
                            featuresBn: data.featuresBn || [],
                            highlights: data.highlights || [],
                            highlightsBn: data.highlightsBn || [],
                            whatIncluded: data.whatIncluded || [],
                            whatIncludedBn: data.whatIncludedBn || [],
                            isFeatured: data.isFeatured || false,
                            isBestSeller: data.isBestSeller || false,
                            isTrending: data.isTrending || false,
                            mainFile: data.mainFile || { url: "", size: 0, format: "psd" },
                            dimensions: data.dimensions || { width: 0, height: 0, unit: "px" },
                            dpi: data.dpi || 300,
                            colorMode: data.colorMode || "RGB",
                            seoTitle: data.seoTitle || "",
                            seoDescription: data.seoDescription || "",
                            seoKeywords: data.seoKeywords || [],
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

    const addHighlight = () => {
        if (highlightInput.trim() && !formData.highlights.includes(highlightInput.trim())) {
            setFormData({ ...formData, highlights: [...formData.highlights, highlightInput.trim()] });
            setHighlightInput("");
        }
    };

    const removeHighlight = (hl) => {
        setFormData({ ...formData, highlights: formData.highlights.filter((h) => h !== hl) });
    };

    const addIncluded = () => {
        if (includedInput.trim() && !formData.whatIncluded.includes(includedInput.trim())) {
            setFormData({ ...formData, whatIncluded: [...formData.whatIncluded, includedInput.trim()] });
            setIncludedInput("");
        }
    };

    const removeIncluded = (item) => {
        setFormData({ ...formData, whatIncluded: formData.whatIncluded.filter((i) => i !== item) });
    };

    const addFeatureBn = () => {
        if (featureBnInput.trim() && !formData.featuresBn.includes(featureBnInput.trim())) {
            setFormData({ ...formData, featuresBn: [...formData.featuresBn, featureBnInput.trim()] });
            setFeatureBnInput("");
        }
    };

    const removeFeatureBn = (feature) => {
        setFormData({ ...formData, featuresBn: formData.featuresBn.filter((f) => f !== feature) });
    };

    const addHighlightBn = () => {
        if (highlightBnInput.trim() && !formData.highlightsBn.includes(highlightBnInput.trim())) {
            setFormData({ ...formData, highlightsBn: [...formData.highlightsBn, highlightBnInput.trim()] });
            setHighlightBnInput("");
        }
    };

    const removeHighlightBn = (hl) => {
        setFormData({ ...formData, highlightsBn: formData.highlightsBn.filter((h) => h !== hl) });
    };

    const addIncludedBn = () => {
        if (includedBnInput.trim() && !formData.whatIncludedBn.includes(includedBnInput.trim())) {
            setFormData({ ...formData, whatIncludedBn: [...formData.whatIncludedBn, includedBnInput.trim()] });
            setIncludedBnInput("");
        }
    };

    const removeIncludedBn = (item) => {
        setFormData({ ...formData, whatIncludedBn: formData.whatIncludedBn.filter((i) => i !== item) });
    };

    const addSeoKeyword = () => {
        if (seoKeywordInput.trim() && !formData.seoKeywords.includes(seoKeywordInput.trim())) {
            setFormData({ ...formData, seoKeywords: [...formData.seoKeywords, seoKeywordInput.trim()] });
            setSeoKeywordInput("");
        }
    };

    const removeSeoKeyword = (kw) => {
        setFormData({ ...formData, seoKeywords: formData.seoKeywords.filter((k) => k !== kw) });
    };

    const toggleFileFormat = (format) => {
        if (formData.fileFormats.includes(format)) {
            setFormData({ ...formData, fileFormats: formData.fileFormats.filter((f) => f !== format) });
        } else {
            setFormData({ ...formData, fileFormats: [...formData.fileFormats, format] });
        }
    };

    const getError = (path) => {
        // Handle nested paths like "mainFile.url"
        if (path.includes('.')) {
            const parts = path.split('.');
            let current = errors;
            for (const part of parts) {
                if (current[part] === undefined) return "";
                current = current[part];
            }
            return current;
        }
        return errors[path] || "";
    };

    const inputClass = (path) => {
        const hasError = path.includes('.') ? getError(path) : errors[path];
        return `input w-full ${hasError ? "border-red-500 focus:border-red-500 ring-red-100 dark:ring-red-900/20" : ""}`;
    };

    // Submit form
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setErrors({});

        if (!formData.title.trim()) {
            setErrors({ title: "Title is required" });
            toast.error("Title is required");
            return;
        }

        setSaving(true);
        try {
            // Clean payload for submission
            const payload = {
                title: formData.title,
                titleBn: formData.titleBn || undefined,
                description: formData.description || undefined,
                descriptionBn: formData.descriptionBn || undefined,
                shortDescription: formData.shortDescription || undefined,
                shortDescriptionBn: formData.shortDescriptionBn || undefined,
                type: formData.type,
                // Extract category ID if it's an object
                category: typeof formData.category === 'object' ? formData.category?._id : formData.category || undefined,
                tags: formData.tags?.length > 0 ? formData.tags : undefined,
                thumbnail: formData.thumbnail || undefined,
                previewImages: formData.previewImages?.length > 0 ? formData.previewImages : undefined,
                price: Number(formData.price) || 0,
                salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
                status: formData.status,
                fileFormats: formData.fileFormats?.length > 0 ? formData.fileFormats : undefined,
                layered: formData.layered,
                editable: formData.editable,
                features: formData.features?.length > 0 ? formData.features : undefined,
                featuresBn: formData.featuresBn?.length > 0 ? formData.featuresBn : undefined,
                highlights: formData.highlights?.length > 0 ? formData.highlights : undefined,
                highlightsBn: formData.highlightsBn?.length > 0 ? formData.highlightsBn : undefined,
                whatIncluded: formData.whatIncluded?.length > 0 ? formData.whatIncluded : undefined,
                whatIncludedBn: formData.whatIncludedBn?.length > 0 ? formData.whatIncludedBn : undefined,
                isFeatured: formData.isFeatured,
                isBestSeller: formData.isBestSeller,
                isTrending: formData.isTrending,
                mainFile: formData.mainFile?.url ? formData.mainFile : undefined,
                dimensions: (formData.dimensions?.width || formData.dimensions?.height) ? formData.dimensions : undefined,
                dpi: formData.dpi || undefined,
                colorMode: formData.colorMode || undefined,
                seoTitle: formData.seoTitle || undefined,
                seoDescription: formData.seoDescription || undefined,
                seoKeywords: formData.seoKeywords?.length > 0 ? formData.seoKeywords : undefined,
            };

            // Remove undefined values
            Object.keys(payload).forEach(key => {
                if (payload[key] === undefined) {
                    delete payload[key];
                }
            });

            let response;
            if (isEditMode) {
                response = await graphicsService.update(editId, payload);
            } else {
                response = await graphicsService.create(payload);
            }

            if (response.success) {
                toast.success(isEditMode ? "Graphics updated successfully!" : "Graphics created successfully!");
                router.push("/dashboard/admin/products/graphics");
            }
        } catch (error) {
            console.error("Submission error:", error);
            // Handle structured validation errors from backend
            if (error.errorSources) {
                const fieldErrors = {};
                error.errorSources.forEach(err => {
                    fieldErrors[err.path] = err.message;
                });
                setErrors(fieldErrors);
                toast.error("Please fix the errors in the form");
            } else {
                toast.error(error.message || "Failed to save graphics");
            }
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Title (English) <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleTitleChange}
                                            className={inputClass("title")}
                                            placeholder="Enter graphics title in English"
                                            required
                                        />
                                        {getError("title") && <p className="mt-1 text-xs text-red-500">{getError("title")}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Title (Bengali)
                                        </label>
                                        <input
                                            type="text"
                                            name="titleBn"
                                            value={formData.titleBn}
                                            onChange={handleChange}
                                            className="input w-full"
                                            placeholder="বাংলায় টাইটেল লিখুন"
                                        />
                                    </div>
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
                                        className={inputClass("slug")}
                                        placeholder="auto-generated-slug"
                                    />
                                    {getError("slug") && <p className="mt-1 text-xs text-red-500">{getError("slug")}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Short Description (English)
                                        </label>
                                        <input
                                            type="text"
                                            name="shortDescription"
                                            value={formData.shortDescription}
                                            onChange={handleChange}
                                            className="input w-full"
                                            placeholder="Brief description in English"
                                            maxLength={200}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Short Description (Bengali)
                                        </label>
                                        <input
                                            type="text"
                                            name="shortDescriptionBn"
                                            value={formData.shortDescriptionBn}
                                            onChange={handleChange}
                                            className="input w-full"
                                            placeholder="বাংলায় ছোট বিবরণ লিখুন"
                                            maxLength={300}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Description (English)
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className={inputClass("description")}
                                        placeholder="Detailed description in English..."
                                    />
                                    {getError("description") && <p className="mt-1 text-xs text-red-500">{getError("description")}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Full Description (Bengali)
                                    </label>
                                    <textarea
                                        name="descriptionBn"
                                        value={formData.descriptionBn}
                                        onChange={handleChange}
                                        className="input w-full h-32"
                                        placeholder="বাংলায় বিস্তারিত বিবরণ লিখুন..."
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
                                        className={inputClass("thumbnail")}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {getError("thumbnail") && <p className="mt-1 text-xs text-red-500">{getError("thumbnail")}</p>}
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
                                        className={inputClass("mainFile.url")}
                                        placeholder="https://example.com/file.zip"
                                    />
                                    {getError("mainFile.url") && <p className="mt-1 text-xs text-red-500">{getError("mainFile.url")}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Size (MB)
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.mainFile.size / (1024 * 1024) || ""}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                mainFile: { ...formData.mainFile, size: Number(e.target.value) * 1024 * 1024 }
                                            })}
                                            className={inputClass("mainFile.size")}
                                            placeholder="0"
                                            step="0.01"
                                        />
                                        {getError("mainFile.size") && <p className="mt-1 text-xs text-red-500">{getError("mainFile.size")}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Format
                                        </label>
                                        <select
                                            value={formData.mainFile.format}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                mainFile: { ...formData.mainFile, format: e.target.value }
                                            })}
                                            className="input w-full"
                                        >
                                            {FILE_FORMATS.map((f) => (
                                                <option key={f.value} value={f.value}>{f.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Details */}
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiLayers size={16} /> Technical Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Width
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.dimensions.width}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            dimensions: { ...formData.dimensions, width: Number(e.target.value) }
                                        })}
                                        className={inputClass("dimensions.width")}
                                        placeholder="0"
                                    />
                                    {getError("dimensions.width") && <p className="mt-1 text-xs text-red-500">{getError("dimensions.width")}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Height
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.dimensions.height}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            dimensions: { ...formData.dimensions, height: Number(e.target.value) }
                                        })}
                                        className={inputClass("dimensions.height")}
                                        placeholder="0"
                                    />
                                    {getError("dimensions.height") && <p className="mt-1 text-xs text-red-500">{getError("dimensions.height")}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Unit
                                    </label>
                                    <select
                                        value={formData.dimensions.unit}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            dimensions: { ...formData.dimensions, unit: e.target.value }
                                        })}
                                        className="input w-full"
                                    >
                                        <option value="px">Pixels (px)</option>
                                        <option value="in">Inches (in)</option>
                                        <option value="cm">Centimeters (cm)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        DPI (Resolution)
                                    </label>
                                    <input
                                        type="number"
                                        name="dpi"
                                        value={formData.dpi}
                                        onChange={handleChange}
                                        className="input w-full"
                                        placeholder="300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Color Mode
                                    </label>
                                    <select
                                        name="colorMode"
                                        value={formData.colorMode}
                                        onChange={handleChange}
                                        className="input w-full"
                                    >
                                        <option value="RGB">RGB</option>
                                        <option value="CMYK">CMYK</option>
                                        <option value="Grayscale">Grayscale</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Features & Tags */}
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FiTag size={16} /> Tags & Features
                            </h2>
                            <div className="space-y-6">
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    {/* Features (EN) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Features (English)
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
                                                <span key={feature} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1">
                                                    {feature}
                                                    <button type="button" onClick={() => removeFeature(feature)} className="hover:text-red-500">
                                                        <FiX size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Features (BN) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-bangla">
                                            বৈশিষ্ট্য (Bengali)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={featureBnInput}
                                                onChange={(e) => setFeatureBnInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeatureBn())}
                                                className="input flex-1"
                                                placeholder="একটি বৈশিষ্ট্য যোগ করুন"
                                            />
                                            <button type="button" onClick={addFeatureBn} className="btn btn-ghost">
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.featuresBn.map((feature) => (
                                                <span key={feature} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1">
                                                    {feature}
                                                    <button type="button" onClick={() => removeFeatureBn(feature)} className="hover:text-red-500">
                                                        <FiX size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    {/* Highlights (EN) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Highlights (English)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={highlightInput}
                                                onChange={(e) => setHighlightInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                                                className="input flex-1"
                                                placeholder="Add a highlight"
                                            />
                                            <button type="button" onClick={addHighlight} className="btn btn-ghost">
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.highlights.map((h) => (
                                                <span key={h} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs flex items-center gap-1">
                                                    {h}
                                                    <button type="button" onClick={() => removeHighlight(h)} className="hover:text-red-500">
                                                        <FiX size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Highlights (BN) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-bangla">
                                            হাইলাইটস (Bengali)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={highlightBnInput}
                                                onChange={(e) => setHighlightBnInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addHighlightBn())}
                                                className="input flex-1"
                                                placeholder="একটি হাইলাইট যোগ করুন"
                                            />
                                            <button type="button" onClick={addHighlightBn} className="btn btn-ghost">
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.highlightsBn.map((h) => (
                                                <span key={h} className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs flex items-center gap-1">
                                                    {h}
                                                    <button type="button" onClick={() => removeHighlightBn(h)} className="hover:text-red-500">
                                                        <FiX size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    {/* Included (EN) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            What's Included (English)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={includedInput}
                                                onChange={(e) => setIncludedInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIncluded())}
                                                className="input flex-1"
                                                placeholder="Add an item"
                                            />
                                            <button type="button" onClick={addIncluded} className="btn btn-ghost">
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.whatIncluded.map((item) => (
                                                <span key={item} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs flex items-center gap-1">
                                                    {item}
                                                    <button type="button" onClick={() => removeIncluded(item)} className="hover:text-red-500">
                                                        <FiX size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Included (BN) */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-bangla">
                                            যা অন্তর্ভুক্ত (Bengali)
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={includedBnInput}
                                                onChange={(e) => setIncludedBnInput(e.target.value)}
                                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addIncludedBn())}
                                                className="input flex-1"
                                                placeholder="একটি ফাইল যোগ করুন"
                                            />
                                            <button type="button" onClick={addIncludedBn} className="btn btn-ghost">
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.whatIncludedBn.map((item) => (
                                                <span key={item} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs flex items-center gap-1">
                                                    {item}
                                                    <button type="button" onClick={() => removeIncludedBn(item)} className="hover:text-red-500">
                                                        <FiX size={12} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
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

                    {/* SEO Settings */}
                    <div className="card border border-gray-200 dark:border-gray-700 p-5">
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiTag size={16} /> SEO Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    SEO Title
                                </label>
                                <input
                                    type="text"
                                    name="seoTitle"
                                    value={formData.seoTitle}
                                    onChange={handleChange}
                                    className="input w-full"
                                    placeholder="Optimize title for search engines"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    SEO Description
                                </label>
                                <textarea
                                    name="seoDescription"
                                    value={formData.seoDescription}
                                    onChange={handleChange}
                                    className="input w-full min-h-[100px]"
                                    placeholder="SEO meta description..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    SEO Keywords
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={seoKeywordInput}
                                        onChange={(e) => setSeoKeywordInput(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSeoKeyword())}
                                        className="input flex-1"
                                        placeholder="Add a keyword"
                                    />
                                    <button type="button" onClick={addSeoKeyword} className="btn btn-ghost">
                                        <FiPlus />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.seoKeywords.map((kw) => (
                                        <span key={kw} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs flex items-center gap-1">
                                            {kw}
                                            <button type="button" onClick={() => removeSeoKeyword(kw)} className="hover:text-red-500">
                                                <FiX size={12} />
                                            </button>
                                        </span>
                                    ))}
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
                                        className={inputClass("type")}
                                    >
                                        {GRAPHICS_TYPES.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    {getError("type") && <p className="mt-1 text-xs text-red-500">{getError("type")}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className={inputClass("category")}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {getError("category") && <p className="mt-1 text-xs text-red-500">{getError("category")}</p>}
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
                                        id="isBestSeller"
                                        name="isBestSeller"
                                        checked={formData.isBestSeller}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <label htmlFor="isBestSeller" className="text-sm text-gray-600 dark:text-gray-400">
                                        Best Seller
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isTrending"
                                        name="isTrending"
                                        checked={formData.isTrending}
                                        onChange={handleChange}
                                        className="w-4 h-4 rounded border-gray-300"
                                    />
                                    <label htmlFor="isTrending" className="text-sm text-gray-600 dark:text-gray-400">
                                        Trending Product
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
                                        Regular Price (৳)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className={inputClass("price")}
                                        placeholder="0"
                                        min="0"
                                    />
                                    {getError("price") && <p className="mt-1 text-xs text-red-500">{getError("price")}</p>}
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
                                        className={inputClass("salePrice")}
                                        placeholder="Leave empty if no sale"
                                        min="0"
                                    />
                                    {getError("salePrice") && <p className="mt-1 text-xs text-red-500">{getError("salePrice")}</p>}
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
