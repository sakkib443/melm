"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiSave, FiX, FiMusic, FiArrowLeft, FiPlus, FiTag, FiDollarSign, FiLayers } from "react-icons/fi";
import { audioService, categoryService } from "@/services/api";

const AUDIO_TYPES = [
    { value: "music", label: "Music" },
    { value: "sfx", label: "Sound Effects" },
    { value: "podcast", label: "Podcast" },
    { value: "voiceover", label: "Voice Over" },
    { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending Review" },
    { value: "published", label: "Published" },
];

export default function CreateAudioPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        title: "", slug: "", description: "", shortDescription: "",
        type: "music", category: "", tags: [], thumbnail: "",
        audioFile: "", previewFile: "",
        price: 0, salePrice: null, status: "draft", features: [], isFeatured: false,
        duration: "", bpm: "", key: "", genre: "",
    });

    const [tagInput, setTagInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getAll();
                if (response.success && response.data) setCategories(response.data);
            } catch (error) { console.log("Failed to fetch categories"); }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (isEditMode && editId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await audioService.getById(editId);
                    if (response.success && response.data) {
                        const data = response.data;
                        setFormData({
                            title: data.title || "", slug: data.slug || "",
                            description: data.description || "", shortDescription: data.shortDescription || "",
                            type: data.type || "music",
                            category: data.category?._id || data.category || "",
                            tags: data.tags || [], thumbnail: data.thumbnail || "",
                            audioFile: data.audioFile || "", previewFile: data.previewFile || "",
                            price: data.price || 0, salePrice: data.salePrice || null,
                            status: data.status || "draft", features: data.features || [],
                            isFeatured: data.isFeatured || false,
                            duration: data.duration || "", bpm: data.bpm || "",
                            key: data.key || "", genre: data.genre || "",
                        });
                    }
                } catch (error) { toast.error("Failed to fetch data"); }
                finally { setLoading(false); }
            };
            fetchData();
        }
    }, [isEditMode, editId]);

    const handleTitleChange = (e) => {
        const title = e.target.value;
        setFormData({ ...formData, title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const addTag = () => { if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) { setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] }); setTagInput(""); } };
    const removeTag = (tag) => setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
    const addFeature = () => { if (featureInput.trim() && !formData.features.includes(featureInput.trim())) { setFormData({ ...formData, features: [...formData.features, featureInput.trim()] }); setFeatureInput(""); } };
    const removeFeature = (f) => setFormData({ ...formData, features: formData.features.filter((x) => x !== f) });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) { toast.error("Title is required"); return; }
        setSaving(true);
        try {
            const payload = { ...formData, price: Number(formData.price), salePrice: formData.salePrice ? Number(formData.salePrice) : null };
            if (isEditMode) { await audioService.update(editId, payload); toast.success("Updated!"); }
            else { await audioService.create(payload); toast.success("Created!"); }
            router.push("/dashboard/admin/products/audio");
        } catch (error) { toast.error(error.message || "Failed to save"); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="p-6 lg:p-8"><div className="card border border-gray-200 dark:border-gray-700 p-12 text-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><p className="text-gray-500">Loading...</p></div></div>;

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/admin/products/audio" className="w-10 h-10 rounded-md border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800"><FiArrowLeft /></Link>
                    <div><h1 className="text-lg font-semibold text-gray-900 dark:text-white">{isEditMode ? "Edit Audio" : "Create Audio"}</h1><p className="text-xs text-gray-500">{isEditMode ? "Update audio details" : "Add new audio"}</p></div>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/dashboard/admin/products/audio" className="btn btn-ghost"><FiX size={16} /> Cancel</Link>
                    <button onClick={handleSubmit} disabled={saving} className="btn btn-primary"><FiSave size={16} /> {saving ? "Saving..." : isEditMode ? "Update" : "Create"}</button>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiMusic size={16} /> Basic Information</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label><input type="text" name="title" value={formData.title} onChange={handleTitleChange} className="input w-full" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} className="input w-full" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label><input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleChange} className="input w-full" maxLength={200} /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="input w-full min-h-[120px]" /></div>
                            </div>
                        </div>
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Media & Files</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail URL</label><input type="url" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="input w-full" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Audio File URL</label><input type="url" name="audioFile" value={formData.audioFile} onChange={handleChange} className="input w-full" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview File URL</label><input type="url" name="previewFile" value={formData.previewFile} onChange={handleChange} className="input w-full" /></div>
                            </div>
                        </div>
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiTag size={16} /> Tags & Features</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label><div className="flex gap-2"><input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} className="input flex-1" /><button type="button" onClick={addTag} className="btn btn-ghost"><FiPlus /></button></div><div className="flex flex-wrap gap-2 mt-2">{formData.tags.map((tag) => (<span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-xs flex items-center gap-1">{tag}<button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500"><FiX size={12} /></button></span>))}</div></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features</label><div className="flex gap-2"><input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())} className="input flex-1" /><button type="button" onClick={addFeature} className="btn btn-ghost"><FiPlus /></button></div><div className="flex flex-wrap gap-2 mt-2">{formData.features.map((f) => (<span key={f} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs flex items-center gap-1">{f}<button type="button" onClick={() => removeFeature(f)} className="hover:text-red-500"><FiX size={12} /></button></span>))}</div></div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiLayers size={16} /> Status & Details</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label><select name="status" value={formData.status} onChange={handleChange} className="input w-full">{STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Audio Type</label><select name="type" value={formData.type} onChange={handleChange} className="input w-full">{AUDIO_TYPES.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className="input w-full"><option value="">Select Category</option>{categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}</select></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label><input type="text" name="duration" value={formData.duration} onChange={handleChange} className="input w-full" placeholder="e.g. 2:45" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">BPM</label><input type="text" name="bpm" value={formData.bpm} onChange={handleChange} className="input w-full" placeholder="e.g. 120" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Genre</label><input type="text" name="genre" value={formData.genre} onChange={handleChange} className="input w-full" placeholder="e.g. Electronic" /></div>
                                <div className="flex items-center gap-3"><input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-4 h-4 rounded border-gray-300" /><label htmlFor="isFeatured" className="text-sm text-gray-600 dark:text-gray-400">Featured Product</label></div>
                            </div>
                        </div>
                        <div className="card border border-gray-200 dark:border-gray-700 p-5">
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FiDollarSign size={16} /> Pricing</h2>
                            <div className="space-y-4">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Regular Price (৳) *</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="input w-full" min="0" required /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sale Price (৳)</label><input type="number" name="salePrice" value={formData.salePrice || ""} onChange={handleChange} className="input w-full" min="0" /></div>
                                {formData.salePrice && formData.price > 0 && (<div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md"><p className="text-xs text-emerald-600 font-medium">Discount: {Math.round(((formData.price - formData.salePrice) / formData.price) * 100)}% off</p></div>)}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
