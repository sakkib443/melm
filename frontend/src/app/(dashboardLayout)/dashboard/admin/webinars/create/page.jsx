"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    FiUsers,
    FiCalendar,
    FiClock,
    FiLink,
    FiSave,
    FiArrowLeft,
    FiDollarSign,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function CreateWebinarPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        titleBn: "",
        description: "",
        descriptionBn: "",
        type: "webinar",
        meetingLink: "",
        scheduledAt: "",
        duration: 90,
        isFree: true,
        price: 0,
        maxParticipants: 100,
        registrationDeadline: "",
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
            toast.success("Webinar created successfully!");
            router.push("/dashboard/admin/webinars");
        } catch (error) {
            toast.error("Failed to create webinar");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard/admin/webinars"
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                >
                    <FiArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Create Webinar
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Schedule a new webinar or seminar
                    </p>
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
                            {/* Title (English) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Title (English) *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter webinar title (e.g., Free Career Workshop)"
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Title (Bengali) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Title (বাংলা)
                                </label>
                                <input
                                    type="text"
                                    name="titleBn"
                                    value={formData.titleBn}
                                    onChange={handleChange}
                                    placeholder="বাংলায় শিরোনাম লিখুন"
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Description (English) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Description (English)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Describe what this webinar will cover..."
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Event Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="webinar">Webinar</option>
                                    <option value="seminar">Seminar</option>
                                    <option value="workshop">Workshop</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Meeting Details */}
                    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Meeting Details
                        </h2>
                        <div className="space-y-4">
                            {/* Meeting Link */}
                            <div>
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
                                        placeholder="https://zoom.us/j/123456789 or https://meet.google.com/xxx-yyyy-zzz"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
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
                                        placeholder="90"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Registration Deadline */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Registration Deadline
                                </label>
                                <input
                                    type="datetime-local"
                                    name="registrationDeadline"
                                    value={formData.registrationDeadline}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Max Participants */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Max Participants
                                </label>
                                <div className="relative">
                                    <FiUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        name="maxParticipants"
                                        value={formData.maxParticipants}
                                        onChange={handleChange}
                                        min="1"
                                        placeholder="100"
                                        className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FiDollarSign />
                            Pricing
                        </h2>
                        <div className="space-y-4">
                            {/* Is Free */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isFree"
                                    name="isFree"
                                    checked={formData.isFree}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <label htmlFor="isFree" className="text-sm text-gray-700 dark:text-gray-300">
                                    This is a free event
                                </label>
                            </div>

                            {/* Price */}
                            {!formData.isFree && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Price (৳) *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="500"
                                        className="w-full px-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                                    />
                                </div>
                            )}
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
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <FiSave />
                                    Create Webinar
                                </>
                            )}
                        </button>
                        <Link
                            href="/dashboard/admin/webinars"
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
