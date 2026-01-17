"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    FiSettings, FiGlobe, FiMail, FiPhone, FiBell, FiLock, FiDollarSign,
    FiSave, FiLoader, FiToggleLeft, FiToggleRight
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("general");

    const [settings, setSettings] = useState({
        // General
        siteName: "CreativeHub",
        siteDescription: "The Ultimate Digital Marketplace & eLearning Platform",
        siteUrl: "https://creativehub.com",
        contactEmail: "support@creativehub.com",
        contactPhone: "+880 1700 000000",

        // Notifications
        emailNotifications: true,
        orderNotifications: true,
        newUserNotifications: true,
        reviewNotifications: false,

        // Payment
        bkashEnabled: true,
        stripeEnabled: true,
        paypalEnabled: false,
        commissionRate: 30,
        minWithdrawal: 500,

        // Security
        twoFactorAuth: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            // API call would go here
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Settings saved successfully!");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "general", label: "General", icon: FiGlobe },
        { id: "notifications", label: "Notifications", icon: FiBell },
        { id: "payment", label: "Payment", icon: FiDollarSign },
        { id: "security", label: "Security", icon: FiLock },
    ];

    const Toggle = ({ value, onChange }) => (
        <button
            type="button"
            onClick={() => onChange(!value)}
            className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${value ? "bg-primary justify-end" : "bg-gray-300 dark:bg-gray-600 justify-start"
                }`}
        >
            <div className="w-4 h-4 bg-white rounded-full shadow" />
        </button>
    );

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
                        <FiSettings className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                        <p className="text-sm text-gray-500">Manage platform settings</p>
                    </div>
                </div>
                <button onClick={handleSave} disabled={loading} className="btn btn-primary">
                    {loading ? <FiLoader className="animate-spin" /> : <FiSave />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Tabs */}
                <div className="lg:col-span-1">
                    <div className="card p-2 space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                        ? "bg-primary text-white"
                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                            >
                                <tab.icon size={18} />
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card p-6"
                    >
                        {activeTab === "general" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">General Settings</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Site Name</label>
                                        <input
                                            type="text"
                                            value={settings.siteName}
                                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Site URL</label>
                                        <input
                                            type="url"
                                            value={settings.siteUrl}
                                            onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                                            className="input"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Site Description</label>
                                    <textarea
                                        value={settings.siteDescription}
                                        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                        rows={3}
                                        className="input resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Contact Email</label>
                                        <div className="relative">
                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={settings.contactEmail}
                                                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                                className="input pl-11"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Contact Phone</label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={settings.contactPhone}
                                                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                                className="input pl-11"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Notification Settings</h3>

                                {[
                                    { key: "emailNotifications", label: "Email Notifications", desc: "Receive notifications via email" },
                                    { key: "orderNotifications", label: "Order Alerts", desc: "Get notified for new orders" },
                                    { key: "newUserNotifications", label: "New User Alerts", desc: "Get notified when new users register" },
                                    { key: "reviewNotifications", label: "Review Alerts", desc: "Get notified for new reviews" },
                                ].map(item => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{item.label}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                        <Toggle
                                            value={settings[item.key]}
                                            onChange={(val) => setSettings({ ...settings, [item.key]: val })}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === "payment" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Settings</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { key: "bkashEnabled", label: "bKash", color: "from-pink-500 to-rose-500" },
                                        { key: "stripeEnabled", label: "Stripe", color: "from-indigo-500 to-purple-500" },
                                        { key: "paypalEnabled", label: "PayPal", color: "from-blue-500 to-cyan-500" },
                                    ].map(item => (
                                        <div key={item.key} className={`p-4 rounded-xl border-2 ${settings[item.key] ? "border-primary bg-primary-10" : "border-gray-200 dark:border-gray-700"}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-gray-900 dark:text-white">{item.label}</span>
                                                <Toggle
                                                    value={settings[item.key]}
                                                    onChange={(val) => setSettings({ ...settings, [item.key]: val })}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                    <div>
                                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Commission Rate (%)</label>
                                        <input
                                            type="number"
                                            value={settings.commissionRate}
                                            onChange={(e) => setSettings({ ...settings, commissionRate: parseInt(e.target.value) })}
                                            className="input"
                                            min="0"
                                            max="100"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Platform fee on each sale</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Minimum Withdrawal (৳)</label>
                                        <input
                                            type="number"
                                            value={settings.minWithdrawal}
                                            onChange={(e) => setSettings({ ...settings, minWithdrawal: parseInt(e.target.value) })}
                                            className="input"
                                            min="0"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Minimum amount for seller withdrawal</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Security Settings</h3>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                        <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                                    </div>
                                    <Toggle
                                        value={settings.twoFactorAuth}
                                        onChange={(val) => setSettings({ ...settings, twoFactorAuth: val })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Session Timeout (minutes)</label>
                                        <input
                                            type="number"
                                            value={settings.sessionTimeout}
                                            onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                                            className="input"
                                            min="5"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-gray-500 uppercase block mb-2">Max Login Attempts</label>
                                        <input
                                            type="number"
                                            value={settings.maxLoginAttempts}
                                            onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                                            className="input"
                                            min="1"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
