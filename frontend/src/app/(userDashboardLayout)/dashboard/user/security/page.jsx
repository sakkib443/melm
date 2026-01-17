"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiLock, FiShield, FiCheck, FiLoader, FiAlertTriangle, FiKey } from "react-icons/fi";
import { authService } from "@/services/api";

export default function UserSecurityPage() {
    const [loading, setLoading] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match!", {
                icon: "❌",
                style: { borderRadius: '12px', background: '#333', color: '#fff' }
            });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            const response = await authService.changePassword({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });

            if (response.success) {
                toast.success("Password updated successfully!", {
                    icon: "🔐",
                    style: { borderRadius: '12px', background: '#333', color: '#fff' }
                });
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            toast.error(error.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-12 max-w-4xl mx-auto space-y-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/20">
                        <FiShield className="text-white text-3xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Security Settings</h1>
                        <p className="text-gray-500 font-medium">Manage your account security and authentication</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Info/Status */}
                <div className="space-y-6">
                    <div className="card p-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-3xl">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiKey className="text-primary" />
                            Security Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Account Active</span>
                                <FiCheck className="text-emerald-500" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Email Verified</span>
                                <FiCheck className="text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-3xl border border-dashed border-amber-200 dark:border-amber-800/50">
                        <div className="flex gap-4">
                            <FiAlertTriangle className="text-amber-600 shrink-0" size={24} />
                            <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                                Always use a strong, unique password. Do not share your password with anyone, including our support team.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Password Form */}
                <div className="lg:col-span-2">
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handlePasswordChange}
                        className="card p-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-[2.5rem] space-y-8"
                    >
                        <div className="space-y-1">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Update Password</h2>
                            <p className="text-sm text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Current Password</label>
                                <div className="relative group">
                                    <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        required
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">New Password</label>
                                    <div className="relative group">
                                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                            required
                                            minLength={6}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Confirm New Password</label>
                                    <div className="relative group">
                                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                            className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                            required
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between gap-4">
                            <p className="text-xs text-gray-400 max-w-[200px]">Password must contain at least 6 characters.</p>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-4 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {loading ? <FiLoader className="animate-spin" size={18} /> : <FiCheck size={18} />}
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </div>
        </div>
    );
}
