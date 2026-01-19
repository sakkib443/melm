"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiSave, FiRefreshCw, FiBook, FiShoppingCart, FiPackage, FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";
import { platformService } from "@/services/api";
import { useModules } from "@/context/ModuleContext";

// Confirmation Modal
function ConfirmationModal({ isOpen, onClose, onConfirm, isLoading }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="card max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <FiAlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Confirm Changes</h3>
                                <p className="text-sm text-gray-500">Review before saving</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                    Dashboard menus will update immediately
                                </p>
                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                                    Disabled modules will be hidden from navigation
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 btn btn-ghost"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <FiRefreshCw className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle className="w-4 h-4" />
                                        Confirm
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default function ModuleManagementPage() {
    const { refreshModules } = useModules();
    const [modules, setModules] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        loadModules();
    }, []);

    const loadModules = async () => {
        try {
            const response = await platformService.getEnabledModules();
            if (response.success && response.data) {
                setModules(response.data);
            }
        } catch (error) {
            toast.error("Failed to load module settings");
        } finally {
            setLoading(false);
        }
    };

    const toggleModule = (category, moduleKey) => {
        setModules((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [moduleKey]: !prev[category][moduleKey],
            },
        }));
    };

    const handleSaveConfirm = async () => {
        setIsSaving(true);
        try {
            const response = await platformService.updateEnabledModules(modules);
            if (response.success) {
                toast.success("Module settings saved successfully!");
                await refreshModules();
                setShowConfirmation(false);
            } else {
                toast.error("Failed to save settings");
            }
        } catch (error) {
            toast.error("Failed to save module settings");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !modules) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FiRefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const moduleStats = {
        lms: Object.values(modules.lms).filter(Boolean).length,
        marketplace: Object.values(modules.marketplace).filter(Boolean).length,
        products: Object.values(modules.products).filter(Boolean).length,
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header Card */}
            <div className="card p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md gradient-primary flex items-center justify-center shadow-sm">
                            <FiPackage className="text-white text-lg" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Module Management</h1>
                            <p className="text-sm text-gray-500">Enable or disable platform features</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Active:</span>
                            <span className="font-semibold text-primary">{moduleStats.lms + moduleStats.marketplace + moduleStats.products}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Module Cards Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* LMS Modules */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                >
                    <div className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
                            <FiBook className="text-indigo-500" size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">LMS Features</h2>
                            <p className="text-xs text-gray-500">{moduleStats.lms} of {Object.keys(modules.lms).length} enabled</p>
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        {Object.entries(modules.lms).map(([key, enabled]) => (
                            <div
                                key={key}
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all"
                            >
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <button
                                    onClick={() => toggleModule('lms', key)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Marketplace Products */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card"
                >
                    <div className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700">
                        <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-md">
                            <FiShoppingCart className="text-orange-500" size={20} />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Marketplace Products</h2>
                            <p className="text-xs text-gray-500">{moduleStats.marketplace} of {Object.keys(modules.marketplace).length} enabled</p>
                        </div>
                    </div>

                    <div className="p-5 space-y-3">
                        {Object.entries(modules.marketplace).map(([key, enabled]) => (
                            <div
                                key={key}
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all"
                            >
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </span>
                                <button
                                    onClick={() => toggleModule('marketplace', key)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${enabled ? 'bg-secondary' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Products - Full Width */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
            >
                <div className="flex items-center gap-3 p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-md">
                        <FiPackage className="text-emerald-500" size={20} />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Products</h2>
                        <p className="text-xs text-gray-500">{moduleStats.products} of {Object.keys(modules.products).length} enabled</p>
                    </div>
                </div>

                <div className="p-5 grid md:grid-cols-2 gap-3">
                    {Object.entries(modules.products).map(([key, enabled]) => (
                        <div
                            key={key}
                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all"
                        >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <button
                                onClick={() => toggleModule('products', key)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${enabled ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={() => setShowConfirmation(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <FiSave className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleSaveConfirm}
                isLoading={isSaving}
            />
        </div>
    );
}
