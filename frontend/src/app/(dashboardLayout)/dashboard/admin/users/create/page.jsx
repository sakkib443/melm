"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiUser, FiArrowLeft, FiSave, FiLoader, FiMail, FiPhone, FiLock, FiEye, FiEyeOff,
    FiShield, FiBook, FiUsers
} from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectToken } from "@/redux/features/authSlice";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CreateUserPage() {
    const router = useRouter();
    const token = useSelector(selectToken);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "buyer",
        status: "active",
    });

    const roles = [
        { value: "buyer", label: "Buyer / Student", icon: FiUsers, color: "from-blue-500 to-indigo-500", description: "Can purchase products and enroll in courses" },
        { value: "seller", label: "Seller / Mentor", icon: FiBook, color: "from-amber-500 to-orange-500", description: "Can create and sell products/courses" },
        { value: "admin", label: "Admin", icon: FiShield, color: "from-rose-500 to-pink-500", description: "Full access to manage the platform" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName.trim() || !formData.email.trim() || !formData.password.trim()) {
            toast.error("Please fill all required fields");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/users/admin/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.success) {
                toast.success("User created successfully!");
                router.push("/dashboard/admin/users");
            } else {
                toast.error(data.message || "Failed to create user");
            }
        } catch (err) {
            toast.error("Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard/admin/users" className="btn btn-ghost p-3">
                    <FiArrowLeft size={20} />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <FiUser className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create User</h1>
                        <p className="text-sm text-gray-500">Add a new user to the platform</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl">
                <div className="card p-6 space-y-6">
                    {/* Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                                First Name *
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="input pl-11"
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="input"
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="input pl-11"
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="input pl-11"
                                    placeholder="01XXXXXXXXX"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">
                            Password *
                        </label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input pl-11 pr-12"
                                placeholder="Min 6 characters"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="text-sm font-bold text-gray-500 uppercase block mb-3">
                            User Role *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {roles.map((role) => (
                                <motion.button
                                    key={role.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: role.value })}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${formData.role === role.value
                                            ? `border-primary bg-primary/5`
                                            : `border-gray-200 dark:border-gray-700 hover:border-gray-300`
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center text-white mb-3`}>
                                        <role.icon size={18} />
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">{role.label}</p>
                                    <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                        <div className="flex-1">
                            <p className="font-bold text-gray-900 dark:text-white">Account Status</p>
                            <p className="text-sm text-gray-500">Active accounts can login and use the platform</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                ...formData,
                                status: formData.status === "active" ? "blocked" : "active"
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
                    <Link href="/dashboard/admin/users" className="btn btn-ghost flex-1">
                        Cancel
                    </Link>
                    <button type="submit" disabled={loading} className="btn btn-primary flex-1">
                        {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                        Create User
                    </button>
                </div>
            </form>
        </div>
    );
}
