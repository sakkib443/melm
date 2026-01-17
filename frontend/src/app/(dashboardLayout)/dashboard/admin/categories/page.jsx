"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiPlus, FiEdit3, FiTrash2, FiLoader, FiCheck, FiX, FiGrid,
    FiSearch, FiRefreshCw, FiBook, FiCode, FiLayout, FiFolder,
    FiChevronRight, FiChevronDown, FiImage, FiVideo, FiMusic,
    FiSmartphone, FiCamera, FiType
} from "react-icons/fi";
import { categoryService } from "@/services/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CategoryPage() {
    const [categories, setCategories] = useState([]);
    const [hierarchicalData, setHierarchicalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editData, setEditData] = useState(null);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [viewMode, setViewMode] = useState("tree");
    const [expandedParents, setExpandedParents] = useState([]);

    // Product type options for this marketplace
    const productTypes = [
        { value: "all", label: "All", icon: FiGrid },
        { value: "graphics", label: "Graphics", icon: FiImage },
        { value: "videoTemplate", label: "Video", icon: FiVideo },
        { value: "uiKit", label: "UI Kit", icon: FiLayout },
        { value: "appTemplate", label: "App", icon: FiSmartphone },
        { value: "audio", label: "Audio", icon: FiMusic },
        { value: "photo", label: "Photo", icon: FiCamera },
        { value: "font", label: "Font", icon: FiType },
        { value: "course", label: "Course", icon: FiBook },
    ];

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;

            const res = await fetch(`${API_BASE}/api/categories`, {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            });
            const result = await res.json();

            if (result.success) {
                const allCats = result.data || [];
                setCategories(allCats);

                // Build hierarchical structure
                const parents = allCats.filter(c => c.isParent);
                const children = allCats.filter(c => !c.isParent);

                const hierarchical = parents.map(parent => ({
                    ...parent,
                    children: children.filter(c =>
                        c.parentCategory?._id === parent._id || c.parentCategory === parent._id
                    )
                }));

                setHierarchicalData(hierarchical);
                setExpandedParents(parents.map(p => p._id));
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this category?")) return;

        try {
            await categoryService.delete(id);
            toast.success("Category deleted");
            fetchCategories();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await categoryService.update(editData._id, {
                name: editData.name,
                slug: editData.slug,
                description: editData.description,
                image: editData.image,
                status: editData.status,
                type: editData.type,
                isParent: editData.isParent,
                parentCategory: editData.isParent ? null : editData.parentCategory,
            });
            toast.success("Category updated");
            setEditData(null);
            fetchCategories();
        } catch (err) {
            toast.error("Update failed");
        }
    };

    const toggleExpand = (id) => {
        setExpandedParents(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const getTypeColor = (type) => {
        const colors = {
            graphics: "from-pink-500 to-rose-500",
            videoTemplate: "from-purple-500 to-indigo-500",
            uiKit: "from-blue-500 to-cyan-500",
            appTemplate: "from-cyan-500 to-teal-500",
            audio: "from-orange-500 to-amber-500",
            photo: "from-emerald-500 to-green-500",
            font: "from-rose-500 to-pink-500",
            course: "from-indigo-500 to-purple-500",
        };
        return colors[type] || "from-gray-500 to-gray-600";
    };

    const getTypeIcon = (type) => {
        const icons = {
            graphics: FiImage,
            videoTemplate: FiVideo,
            uiKit: FiLayout,
            appTemplate: FiSmartphone,
            audio: FiMusic,
            photo: FiCamera,
            font: FiType,
            course: FiBook,
        };
        const Icon = icons[type] || FiGrid;
        return <Icon size={16} />;
    };

    const stats = {
        total: categories.length,
        parents: categories.filter(c => c.isParent).length,
        active: categories.filter(c => c.status === "active").length,
    };

    const filtered = categories.filter(c => {
        const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
        const matchType = typeFilter === "all" || c.type === typeFilter;
        return matchSearch && matchType;
    });

    const filteredHierarchical = hierarchicalData.filter(parent => {
        if (typeFilter === "all") return true;
        return parent.type === typeFilter;
    });

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <FiFolder className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
                        <p className="text-sm text-gray-500">Manage product categories</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchCategories}
                        className="btn btn-ghost p-3"
                    >
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                    <Link href="/dashboard/admin/categories/create" className="btn btn-primary">
                        <FiPlus size={18} /> New Category
                    </Link>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                            <FiGrid className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Total</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                            <FiFolder className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.parents}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Parents</p>
                </div>
                <div className="card p-5">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <FiCheck className="text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Active</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input pl-12 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        {productTypes.slice(0, 5).map(type => (
                            <button
                                key={type.value}
                                onClick={() => setTypeFilter(type.value)}
                                className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all ${typeFilter === type.value
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <button
                            onClick={() => setViewMode("tree")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "tree" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-500"
                                }`}
                        >
                            Tree
                        </button>
                        <button
                            onClick={() => setViewMode("flat")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === "flat" ? "bg-white dark:bg-gray-600 shadow-sm" : "text-gray-500"
                                }`}
                        >
                            Grid
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <FiLoader className="animate-spin text-primary" size={40} />
                    <p className="text-xs font-bold text-gray-400 uppercase">Loading...</p>
                </div>
            ) : viewMode === "tree" ? (
                /* Tree View */
                <div className="space-y-4">
                    {filteredHierarchical.length === 0 ? (
                        <div className="text-center py-24 card border-2 border-dashed">
                            <FiFolder className="text-4xl text-gray-300 mx-auto mb-4" />
                            <p className="font-bold text-gray-600">No Categories Found</p>
                            <Link href="/dashboard/admin/categories/create" className="btn btn-primary mt-4 inline-flex">
                                <FiPlus size={14} /> Create Category
                            </Link>
                        </div>
                    ) : (
                        filteredHierarchical.map(parent => (
                            <motion.div
                                key={parent._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card overflow-hidden"
                            >
                                {/* Parent Row */}
                                <div className="flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all">
                                    <button
                                        onClick={() => toggleExpand(parent._id)}
                                        className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all"
                                    >
                                        {expandedParents.includes(parent._id) ? <FiChevronDown /> : <FiChevronRight />}
                                    </button>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(parent.type)} flex items-center justify-center text-white shadow-lg overflow-hidden`}>
                                        {parent.image ? (
                                            <img src={parent.image} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <FiFolder size={20} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{parent.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-0.5 bg-gradient-to-r ${getTypeColor(parent.type)} text-white rounded text-[10px] font-bold uppercase`}>
                                                {parent.type}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {parent.children?.length || 0} sub-categories
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${parent.status === "active"
                                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                                        : "bg-gray-100 text-gray-500"
                                        }`}>
                                        {parent.status}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setEditData(parent)}
                                            className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white rounded-xl transition-all"
                                        >
                                            <FiEdit3 size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(parent._id)}
                                            className="p-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white text-red-400 rounded-xl transition-all"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Children */}
                                {expandedParents.includes(parent._id) && parent.children?.length > 0 && (
                                    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                        {parent.children.map((child, idx) => (
                                            <div
                                                key={child._id}
                                                className={`flex items-center gap-4 py-4 px-5 pl-20 hover:bg-white dark:hover:bg-gray-700/50 transition-all ${idx < parent.children.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""
                                                    }`}
                                            >
                                                <div className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400">
                                                    {getTypeIcon(child.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-700 dark:text-gray-200">{child.name}</p>
                                                    <p className="text-xs text-gray-400 font-mono">{child.slug}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${child.status === "active"
                                                    ? "bg-emerald-100 text-emerald-600"
                                                    : "bg-gray-100 text-gray-500"
                                                    }`}>
                                                    {child.status}
                                                </span>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => setEditData(child)}
                                                        className="p-2 bg-white dark:bg-gray-700 hover:bg-primary hover:text-white rounded-lg border border-gray-200 dark:border-gray-600 transition-all"
                                                    >
                                                        <FiEdit3 size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(child._id)}
                                                        className="p-2 bg-white dark:bg-gray-700 hover:bg-red-500 hover:text-white text-red-300 rounded-lg border border-gray-200 dark:border-gray-600 transition-all"
                                                    >
                                                        <FiTrash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            ) : (
                /* Grid View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.length === 0 ? (
                        <div className="col-span-full text-center py-24 card border-2 border-dashed">
                            <FiGrid className="text-4xl text-gray-300 mx-auto mb-4" />
                            <p className="font-bold text-gray-600">No Categories Found</p>
                        </div>
                    ) : (
                        filtered.map((cat) => (
                            <motion.div
                                key={cat._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="card p-5 group hover:shadow-lg transition-all"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTypeColor(cat.type)} flex items-center justify-center text-white shadow-md overflow-hidden`}>
                                        {cat.image ? (
                                            <img src={cat.image} className="w-full h-full object-cover" alt="" />
                                        ) : cat.isParent ? (
                                            <FiFolder size={18} />
                                        ) : (
                                            getTypeIcon(cat.type)
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{cat.name}</h3>
                                        <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <span className={`px-2 py-0.5 bg-gradient-to-r ${getTypeColor(cat.type)} text-white rounded text-[10px] font-bold uppercase`}>
                                        {cat.type}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cat.isParent ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"
                                        }`}>
                                        {cat.isParent ? "Parent" : "Child"}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cat.status === "active" ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
                                        }`}>
                                        {cat.status}
                                    </span>
                                </div>
                                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => setEditData(cat)}
                                        className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1"
                                    >
                                        <FiEdit3 size={12} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cat._id)}
                                        className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-all"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Edit Modal */}
            {editData && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-end z-50 p-4">
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white dark:bg-gray-800 h-full w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Category</h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {editData.isParent ? "Parent Category" : "Sub-Category"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditData(null)}
                                    className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-5 overflow-y-auto flex-1">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editData.name || ""}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Slug</label>
                                <input
                                    type="text"
                                    value={editData.slug || ""}
                                    onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                                    className="input font-mono"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={editData.image || ""}
                                    onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                                    className="input"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Description</label>
                                <textarea
                                    value={editData.description || ""}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    rows={2}
                                    className="input resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Type</label>
                                <select
                                    value={editData.type || ""}
                                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                    className="input"
                                >
                                    {productTypes.slice(1).map(t => (
                                        <option key={t.value} value={t.value}>{t.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 dark:text-white">Status</p>
                                    <p className="text-xs text-gray-400">Toggle visibility</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setEditData({
                                        ...editData,
                                        status: editData.status === "active" ? "inactive" : "active"
                                    })}
                                    className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${editData.status === "active" ? "bg-emerald-500 justify-end" : "bg-gray-300 justify-start"
                                        }`}
                                >
                                    <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full py-3"
                            >
                                <FiCheck size={18} /> Save Changes
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
