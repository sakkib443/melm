"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiFileText, FiArrowLeft, FiSave, FiLoader, FiImage } from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CreateBlogPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        thumbnail: "",
        category: "",
        tags: "",
        status: "draft",
        metaTitle: "",
        metaDescription: "",
    });

    const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) { toast.error("Title is required"); return; }

        setLoading(true);
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;

            const res = await fetch(`${API_BASE}/api/blogs`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
                body: JSON.stringify({ ...formData, tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean) }),
            });

            if (res.ok) { toast.success("Blog post created!"); router.push("/admin/blog"); }
            else { const err = await res.json(); toast.error(err.message || "Failed"); }
        } catch { toast.error("Error creating post"); }
        finally { setLoading(false); }
    };

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/blog" className="btn btn-ghost p-3"><FiArrowLeft size={20} /></Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FiFileText className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Blog Post</h1>
                        <p className="text-sm text-gray-500">Write a new blog article</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="card p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Title *</label>
                            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })} className="input" required />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Slug</label>
                            <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="input font-mono" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Excerpt</label>
                        <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="input resize-none" placeholder="Brief summary..." />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Content *</label>
                        <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={12} className="input resize-none font-mono" placeholder="Write your blog content here... (Markdown supported)" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Thumbnail URL</label>
                            <input type="text" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })} className="input" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Tags (comma separated)</label>
                            <input type="text" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className="input" placeholder="web, design, tutorial" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                        <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white">Status</p>
                            <p className="text-sm text-gray-500">Publish immediately or save as draft</p>
                        </div>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input w-40">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-4 mt-6">
                    <Link href="/admin/blog" className="btn btn-ghost flex-1">Cancel</Link>
                    <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                        {loading ? <FiLoader className="animate-spin" /> : <FiSave />} Create Post
                    </button>
                </div>
            </form>
        </div>
    );
}
