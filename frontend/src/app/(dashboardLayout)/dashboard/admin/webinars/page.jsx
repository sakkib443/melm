"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FiUsers,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiCalendar,
    FiClock,
    FiUserCheck,
    FiSearch,
    FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function WebinarsPage() {
    const [webinars, setWebinars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        fetchWebinars();
    }, []);

    const fetchWebinars = async () => {
        try {
            setLoading(true);
            // TODO: Replace with actual API call
            // const response = await fetch('/api/webinars');
            // const data = await response.json();

            // Mock data
            setWebinars([
                {
                    _id: "1",
                    title: "Free Career Workshop",
                    type: "webinar",
                    scheduledAt: new Date().toISOString(),
                    duration: 90,
                    isFree: true,
                    maxParticipants: 100,
                    registrations: 45,
                }
            ]);
        } catch (error) {
            toast.error("Failed to fetch webinars");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this webinar?")) return;

        try {
            toast.success("Webinar deleted successfully");
            fetchWebinars();
        } catch (error) {
            toast.error("Failed to delete webinar");
        }
    };

    const filteredWebinars = webinars.filter(webinar => {
        const matchesSearch = webinar.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || webinar.type === typeFilter;
        return matchesSearch && matchesType;
    });

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Webinars & Seminars</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage free events and workshops</p>
                </div>
                <Link
                    href="/dashboard/admin/webinars/create"
                    className="btn btn-primary flex items-center gap-2"
                >
                    <FiPlus size={18} />
                    Create Webinar
                </Link>
            </div>

            {/* Filters */}
            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search webinars..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Types</option>
                            <option value="webinar">Webinar</option>
                            <option value="seminar">Seminar</option>
                            <option value="workshop">Workshop</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Event Details
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Schedule
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Registrations
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredWebinars.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <FiUsers className="mx-auto text-gray-400 mb-2" size={48} />
                                        <p className="text-gray-500">No webinars found</p>
                                        <Link
                                            href="/dashboard/admin/webinars/create"
                                            className="text-primary hover:underline text-sm mt-2 inline-block"
                                        >
                                            Create your first webinar
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                filteredWebinars.map((webinar) => (
                                    <tr
                                        key={webinar._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {webinar.title}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                    <FiClock size={14} />
                                                    {webinar.duration} minutes
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                                <FiCalendar size={14} />
                                                {new Date(webinar.scheduledAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(webinar.scheduledAt).toLocaleTimeString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 capitalize">
                                                {webinar.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <FiUserCheck className="text-green-500" size={16} />
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {webinar.registrations || 0} / {webinar.maxParticipants}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${webinar.isFree
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                }`}>
                                                {webinar.isFree ? "Free" : "Paid"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/dashboard/admin/webinars/edit/${webinar._id}`}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(webinar._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
