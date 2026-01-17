"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiPlus, FiSearch, FiTag, FiLoader, FiEdit, FiTrash2, FiCheck, FiX,
    FiRefreshCw, FiPercent, FiCalendar, FiCopy
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState(null);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        description: "",
        discountType: "percentage",
        discountValue: 10,
        minPurchase: 0,
        maxDiscount: null,
        usageLimit: 100,
        usagePerUser: 1,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        applicableTo: "all",
        isActive: true,
    });


    const mockData = [
        { _id: "1", code: "SAVE20", name: "Summer Sale", discountType: "percentage", discountValue: 20, minPurchase: 1000, usageLimit: 100, usedCount: 45, startDate: new Date(), endDate: new Date(Date.now() + 30 * 86400000), applicableTo: "all", isActive: true },
        { _id: "2", code: "FLAT500", name: "Flat Discount", discountType: "fixed", discountValue: 500, minPurchase: 2000, usageLimit: 50, usedCount: 23, startDate: new Date(), endDate: new Date(Date.now() + 15 * 86400000), applicableTo: "course", isActive: true },
        { _id: "3", code: "WELCOME10", name: "New User Welcome", discountType: "percentage", discountValue: 10, minPurchase: 0, usageLimit: 1000, usedCount: 567, startDate: new Date(), endDate: new Date(Date.now() + 60 * 86400000), applicableTo: "all", isActive: false },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;
            const res = await fetch(`${API_BASE}/api/coupons`, { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} });
            const data = await res.json();
            setCoupons(data.success && data.data ? data.data : mockData);
        } catch { setCoupons(mockData); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;
            const url = editData ? `${API_BASE}/api/coupons/${editData._id}` : `${API_BASE}/api/coupons`;
            const method = editData ? "PATCH" : "POST";

            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
                body: JSON.stringify(formData),
            });

            toast.success(editData ? "Coupon updated!" : "Coupon created!");
            setShowModal(false);
            setEditData(null);
            resetForm();
            fetchData();
        } catch { toast.error("Error saving coupon"); }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this coupon?")) return;
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;
            await fetch(`${API_BASE}/api/coupons/${id}`, { method: "DELETE", headers: authToken ? { Authorization: `Bearer ${authToken}` } : {} });
            toast.success("Deleted");
            fetchData();
        } catch { toast.error("Failed"); }
    };

    const handleEdit = (coupon) => {
        setEditData(coupon);
        setFormData({
            code: coupon.code || "",
            name: coupon.name || "",
            description: coupon.description || "",
            discountType: coupon.discountType || "percentage",
            discountValue: coupon.discountValue || 0,
            minPurchase: coupon.minPurchase || 0,
            maxDiscount: coupon.maxDiscount || null,
            usageLimit: coupon.usageLimit || 100,
            usagePerUser: coupon.usagePerUser || 1,
            startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
            endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : "",
            applicableTo: coupon.applicableTo || "all",
            isActive: coupon.isActive ?? true,
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({
            code: "",
            name: "",
            description: "",
            discountType: "percentage",
            discountValue: 10,
            minPurchase: 0,
            maxDiscount: null,
            usageLimit: 100,
            usagePerUser: 1,
            startDate: new Date().toISOString().split("T")[0],
            endDate: "",
            applicableTo: "all",
            isActive: true
        });
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        toast.success("Copied!");
    };

    const filtered = coupons.filter(c => c.code?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                        <FiTag className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons</h1>
                        <p className="text-sm text-gray-500">{coupons.length} coupons</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={fetchData} className="btn btn-ghost p-3"><FiRefreshCw className={loading ? "animate-spin" : ""} /></button>
                    <button onClick={() => { resetForm(); setEditData(null); setShowModal(true); }} className="btn btn-primary"><FiPlus /> New Coupon</button>
                </div>
            </div>

            <div className="card p-4">
                <div className="relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input placeholder="Search coupons..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-12 w-full" />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><FiLoader className="animate-spin text-primary" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((coupon, i) => (
                        <motion.div key={coupon._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5 relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-20 h-20 ${coupon.isActive ? "bg-emerald-500" : "bg-gray-400"} transform rotate-45 translate-x-10 -translate-y-10`} />
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono font-bold text-lg">{coupon.code}</code>
                                    <button onClick={() => copyCode(coupon.code)} className="p-1.5 text-gray-400 hover:text-primary"><FiCopy size={14} /></button>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${coupon.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                    {coupon.isActive ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Discount</span>
                                    <span className="font-bold text-primary">
                                        {coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `৳${coupon.discountValue}`}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Min Purchase</span>
                                    <span className="font-medium">৳{coupon.minPurchase}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Uses</span>
                                    <span className="font-medium">{coupon.usedCount || 0} / {coupon.usageLimit || '∞'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">Expires</span>
                                    <span className="font-medium flex items-center gap-1"><FiCalendar size={12} />{coupon.endDate ? new Date(coupon.endDate).toLocaleDateString() : 'No expiry'}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <button onClick={() => handleEdit(coupon)} className="flex-1 btn btn-ghost text-sm py-2"><FiEdit size={14} /> Edit</button>
                                <button onClick={() => handleDelete(coupon._id)} className="btn btn-ghost text-red-500 text-sm py-2 px-3"><FiTrash2 size={14} /></button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editData ? "Edit Coupon" : "New Coupon"}</h3>
                            <button onClick={() => { setShowModal(false); setEditData(null); }} className="btn btn-ghost p-2"><FiX size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Code *</label>
                                    <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="input font-mono" placeholder="SAVE20" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Name *</label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input" placeholder="Summer Sale" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Description</label>
                                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input" placeholder="Optional description" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Discount Type</label>
                                    <select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })} className="input">
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (৳)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Discount Value *</label>
                                    <input type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })} className="input" min="0" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Min Purchase (৳)</label>
                                    <input type="number" value={formData.minPurchase} onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })} className="input" min="0" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Max Discount (৳)</label>
                                    <input type="number" value={formData.maxDiscount || ""} onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value ? Number(e.target.value) : null })} className="input" min="0" placeholder="No limit" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Usage Limit</label>
                                    <input type="number" value={formData.usageLimit} onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })} className="input" min="1" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Per User Limit</label>
                                    <input type="number" value={formData.usagePerUser} onChange={(e) => setFormData({ ...formData, usagePerUser: Number(e.target.value) })} className="input" min="1" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Start Date *</label>
                                    <input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="input" required />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">End Date *</label>
                                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="input" required />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Applicable To</label>
                                <select value={formData.applicableTo} onChange={(e) => setFormData({ ...formData, applicableTo: e.target.value })} className="input">
                                    <option value="all">All Products</option>
                                    <option value="course">Courses Only</option>
                                    <option value="website">Websites Only</option>
                                    <option value="software">Software Only</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                <span className="font-medium text-gray-900 dark:text-white">Active</span>
                                <button type="button" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })} className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${formData.isActive ? "bg-emerald-500 justify-end" : "bg-gray-300 justify-start"}`}>
                                    <div className="w-4 h-4 bg-white rounded-full shadow" />
                                </button>
                            </div>
                            <button type="submit" className="btn btn-primary w-full">{editData ? "Update" : "Create"} Coupon</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
