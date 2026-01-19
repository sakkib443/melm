"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FiVideo,
    FiCalendar,
    FiClock,
    FiUsers,
    FiLink,
    FiSave,
    FiArrowLeft,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function CreateLiveClassPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        meetingType: "zoom",
        meetingLink: "",
        meetingPassword: "",
        scheduledAt: "",
        duration: 60,
        accessType: "all-students",
        targetedStudents: [],
        sendNotifications: true,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/live-classes', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            toast.success("Live class scheduled successfully!");
            router.push("/dashboard/admin/live-classes");
        } catch (error) {
            toast.error("Failed to schedule class");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/admin/live-classes"
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                        >
                            <FiArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Schedule Live Class
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Create a new live class session
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-4xl">
                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Basic Information
                        </h2>
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Class Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter class title (e.g., React Advanced Patterns)"
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Describe what this class will cover..."
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Meeting Details */}
                    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiVideo />
                            Meeting Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Meeting Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Meeting Platform *
                                </label>
                                <select
                                    name="meetingType"
                                    value={formData.meetingType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="zoom">Zoom</option>
                                    <option value="google-meet">Google Meet</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Meeting Link */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Meeting Link *
                                </label>
                                <div className="relative">
                                    <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="url"
                                        name="meetingLink"
                                        value={formData.meetingLink}
                                        onChange={handleChange}
                                        required
                                        placeholder="https://zoom.us/j/123456789"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Meeting Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Meeting Password (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="meetingPassword"
                                    value={formData.meetingPassword}
                                    onChange={handleChange}
                                    placeholder="Enter meeting password if required"
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiCalendar />
                            Schedule
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date & Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    name="scheduledAt"
                                    value={formData.scheduledAt}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Duration (minutes) *
                                </label>
                                <div className="relative">
                                    <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        required
                                        min="15"
                                        step="15"
                                        placeholder="60"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Access Control */}
                    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiUsers />
                            Access  Control
                        </h2>
                        <div className="space-y-4">
                            {/* Access Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Who can join? *
                                </label>
                                <select
                                    name="accessType"
                                    value={formData.accessType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="all-students">All Students</option>
                                    <option value="enrolled-only">Enrolled Students Only</option>
                                    <option value="targeted">Specific Students</option>
                                </select>
                            </div>

                            {/* Send Notifications */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="sendNotifications"
                                    name="sendNotifications"
                                    checked={formData.sendNotifications}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="sendNotifications" className="text-sm text-gray-700 dark:text-gray-300">
                                    Send email notifications to students
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Scheduling...
                                </>
                            ) : (
                                <>
                                    <FiSave />
                                    Schedule Class
                                </>
                            )}
                        </button>
                        <Link
                            href="/dashboard/admin/live-classes"
                            className="btn btn-ghost"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
