"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
    FiSave, FiX, FiType, FiArrowLeft, FiPlus, FiTag,
    FiDollarSign, FiLayers, FiImage, FiFile, FiCheckSquare, FiGlobe
} from "react-icons/fi";
import { fontService, categoryService } from "@/services/api";

const FONT_TYPES = [
    { value: "sans-serif", label: "Sans Serif" },
    { value: "serif", label: "Serif" },
    { value: "script", label: "Script" },
    { value: "display", label: "Display" },
    { value: "handwritten", label: "Handwritten" },
    { value: "monospace", label: "Monospace" },
    { value: "bangla", label: "Bangla" },
    { value: "arabic", label: "Arabic" },
    { value: "other", label: "Other" },
];

const STYLE_OPTIONS = [
    { value: "normal", label: "Normal" },
    { value: "italic", label: "Italic" },
    { value: "oblique", label: "Oblique" },
];

const STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending Review" },
    { value: "published", label: "Published" },
];

export default function CreateFontPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        type: "other",
        category: "",
        tags: [],
        thumbnail: "",
        previewImages: [],
        previewText: "",
        mainFile: { url: "", size: 0, format: "zip" },
        weights: [],
        styles: ["normal"],
        glyphs: 0,
        languages: [],
        webFont: false,
        variableFont: false,
        price: 0,
        salePrice: null,
        status: "draft",
        isFeatured: false,
    });

    const [tagInput, setTagInput] = useState("");
    const [weightInput, setWeightInput] = useState("");
    const [langInput, setLangInput] = useState("");
    const [previewImgInput, setPreviewImgInput] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAll();
                if (response.success && response.data) {
                    setCategories(response.data.filter(c => c.type === 'font' || c.slug === 'fonts' || !c.type));
                }
            } catch (error) { console.error("Failed to fetch categories", error); }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isEditMode && editId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await fontService.getById(editId);
                    if (response.success && response.data) {
                        const data = response.data;
                        setFormData({
                            ...data,
                            category: data.category?._id || data.category || "",
                            styles: data.styles || ["normal"],
                            mainFile: data.mainFile || { url: "", size: 0, format: "zip" },
                            weights: data.weights || [],
                            tags: data.tags || [],
                            languages: data.languages || [],
                            previewImages: data.previewImages || [],
                        });
                    }
                } catch (error) {
                    toast.error("Failed to fetch data");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [isEditMode, editId]);

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({
            ...formData,
            title,
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
        });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: { ...formData[parent], [child]: type === "number" ? Number(value) : value }
            });
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value)
            });
        }
    };

    const handleStyleToggle = (style) => {
        const currentStyles = [...formData.styles];
        if (currentStyles.includes(style)) {
            setFormData({ ...formData, styles: currentStyles.filter(s => s !== style) });
        } else {
            setFormData({ ...formData, styles: [...currentStyles, style] });
        }
    };

    // Helper to add/remove from arrays
    const addToArr = (field, val, inputSetter) => {
        if (val.trim() && !formData[field].includes(val.trim())) {
            setFormData({ ...formData, [field]: [...formData[field], val.trim()] });
            inputSetter("");
        }
    };
    const removeFromArr = (field, val) => {
        setFormData({ ...formData, [field]: formData[field].filter(item => item !== val) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) { toast.error("Title is required"); return; }
        if (!formData.category) { toast.error("Category is required"); return; }

        setSaving(true);
        try {
            const payload = { ...formData };
            // Ensure numbers are numbers
            payload.price = Number(payload.price || 0);
            payload.salePrice = payload.salePrice ? Number(payload.salePrice) : null;
            payload.glyphs = Number(payload.glyphs || 0);

            let res;
            if (isEditMode) {
                res = await fontService.update(editId, payload);
                toast.success("Font Updated Successfully!");
            } else {
                res = await fontService.create(payload);
                toast.success("Font Created Successfully!");
            }
            if (res.success) router.push("/dashboard/admin/products/fonts");
        } catch (error) {
            console.error("Save error:", error);
            // Handle real error messages from backend
            if (error.data?.errorSources) {
                error.data.errorSources.forEach(err => toast.error(`${err.path}: ${err.message}`));
            } else {
                toast.error(error.message || "Failed to save font");
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/products/fonts" className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                        <FiArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEditMode ? "Edit Font Asset" : "Launch New Font"}</h1>
                        <p className="text-sm text-gray-500">Categorize, style, and publish your typography project</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/dashboard/admin/products/fonts" className="btn btn-ghost rounded-xl"><FiX /> Cancel</Link>
                    <button onClick={handleSubmit} disabled={saving} className="btn btn-primary rounded-xl px-8">
                        {saving ? (
                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Processing...</>
                        ) : (
                            <><FiSave /> {isEditMode ? "Update Asset" : "Create Asset"}</>
                        )}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <FiType size={20} />
                            </div>
                            <h2 className="text-lg font-bold">Metadata & Description</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Asset Title *</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleTitleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="e.g. Modern Sans Serif" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Unique Slug</label>
                                    <input type="text" name="slug" value={formData.slug} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="modern-sans-serif" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Narrative</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="input w-full min-h-[150px] bg-gray-50 dark:bg-gray-800 rounded-2xl py-4" placeholder="Describe the font inspiration, usage cases, and style..." />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Default Preview Text</label>
                                <input type="text" name="previewText" value={formData.previewText} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="The quick brown fox jumps over the lazy dog" />
                            </div>
                        </div>
                    </div>

                    {/* Media Assets */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                                <FiImage size={20} />
                            </div>
                            <h2 className="text-lg font-bold">Visual Assets</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Main Thumbnail URL</label>
                                <input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="https://image-hosting.com/font-cover.jpg" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Gallery Previews</label>
                                <div className="flex gap-2 mb-3">
                                    <input type="url" value={previewImgInput} onChange={(e) => setPreviewImgInput(e.target.value)} className="input flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="Add image URL..." />
                                    <button type="button" onClick={() => addToArr('previewImages', previewImgInput, setPreviewImgInput)} className="btn btn-secondary rounded-xl"><FiPlus /></button>
                                </div>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                    {formData.previewImages.map((img, i) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                                            <img src={img} className="w-full h-full object-cover" alt="" />
                                            <button onClick={() => removeFromArr('previewImages', img)} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"><FiX /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <FiCheckSquare size={20} />
                            </div>
                            <h2 className="text-lg font-bold">Typography Specifications</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Available Weights</label>
                                <div className="flex gap-2 mb-3">
                                    <input type="text" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} className="input flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="e.g. Bold, Light, Extra" />
                                    <button type="button" onClick={() => addToArr('weights', weightInput, setWeightInput)} className="btn btn-secondary rounded-xl"><FiPlus /></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.weights.map(w => (
                                        <span key={w} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold flex items-center gap-2">
                                            {w} <FiX className="cursor-pointer hover:text-red-500" onClick={() => removeFromArr('weights', w)} />
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Styles Included</label>
                                <div className="flex flex-wrap gap-4">
                                    {STYLE_OPTIONS.map(opt => (
                                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer group">
                                            <div onClick={() => handleStyleToggle(opt.value)} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${formData.styles.includes(opt.value) ? 'bg-primary border-primary text-black' : 'border-gray-300 dark:border-gray-700'}`}>
                                                {formData.styles.includes(opt.value) && <FiSave className="w-3 h-3" />}
                                            </div>
                                            <span className="text-sm font-medium">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Glyphs Count</label>
                                    <input type="number" name="glyphs" value={formData.glyphs} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl" />
                                </div>
                                <div className="flex items-end gap-6 pb-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="webFont" checked={formData.webFont} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 accent-primary" />
                                        <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Web Font</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" name="variableFont" checked={formData.variableFont} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 accent-primary" />
                                        <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Variable</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Status & Category */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                                <FiLayers size={20} />
                            </div>
                            <h2 className="text-lg font-bold">Organization</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Publish Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Font Classification</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl">
                                    {FONT_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Store Category *</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl" required>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* File Delivery */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                                <FiFile size={20} />
                            </div>
                            <h2 className="text-lg font-bold">Secure Delivery</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Main File URL</label>
                                <input type="url" name="mainFile.url" value={formData.mainFile.url} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="https://storage.com/font-pack.zip" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Size (Bytes)</label>
                                    <input type="number" name="mainFile.size" value={formData.mainFile.size} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl" />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Ext</label>
                                    <input type="text" name="mainFile.format" value={formData.mainFile.format} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="zip" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                <FiDollarSign size={20} />
                            </div>
                            <h2 className="text-lg font-bold">License Price</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Regular License (৳)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl font-bold" min="0" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Flash Sale Price (৳)</label>
                                <input type="number" name="salePrice" value={formData.salePrice || ""} onChange={handleChange} className="input w-full bg-gray-50 dark:bg-gray-800 rounded-xl text-primary font-bold" min="0" placeholder="Optional" />
                            </div>
                            {formData.salePrice > 0 && formData.price > 0 && (
                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active Discount</span>
                                    <span className="text-lg font-black text-primary">{Math.round(((formData.price - formData.salePrice) / formData.price) * 100)}%</span>
                                </div>
                            )}
                            <label className="flex items-center gap-3 cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all">
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 rounded border-gray-300 accent-primary" />
                                <span className="text-sm font-bold uppercase tracking-widest text-gray-600 dark:text-gray-400">Featured On Home</span>
                            </label>
                        </div>
                    </div>

                    {/* Language & Tags Sidebar */}
                    <div className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                                <FiTag size={20} />
                            </div>
                            <h2 className="text-lg font-bold">Discovery</h2>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Search Tags</label>
                                <div className="flex gap-2 mb-3">
                                    <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="input flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="modern, clean..." />
                                    <button type="button" onClick={() => addToArr('tags', tagInput, setTagInput)} className="btn btn-secondary rounded-xl"><FiPlus /></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tags.map(t => (
                                        <span key={t} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold flex items-center gap-2">
                                            {t} <FiX className="cursor-pointer hover:text-red-500" onClick={() => removeFromArr('tags', t)} />
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Supported Languages</label>
                                <div className="flex gap-2 mb-3">
                                    <input type="text" value={langInput} onChange={(e) => setLangInput(e.target.value)} className="input flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl" placeholder="English, Bangla..." />
                                    <button type="button" onClick={() => addToArr('languages', langInput, setLangInput)} className="btn btn-secondary rounded-xl"><FiPlus /></button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.languages.map(l => (
                                        <span key={l} className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-bold flex items-center gap-2">
                                            {l} <FiX className="cursor-pointer hover:text-red-500" onClick={() => removeFromArr('languages', l)} />
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
