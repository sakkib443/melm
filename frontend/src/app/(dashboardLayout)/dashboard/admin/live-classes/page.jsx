"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FiVideo,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiEye,
    FiCalendar,
    FiClock,
    FiUsers,
    FiExternalLink,
    FiSearch,
    FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { liveClassService } from "@/services/lms-api";

export default function LiveClassesPage() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            // TODO: Replace with actual API call
            // const response = await fetch('/api/live-classes');
            // const data = await response.json();

            // Mock data for now
            setClasses([
                {
                    _id: "1",
                    title: "React Advanced Patterns",
                    meetingLink: "https://zoom.us/j/123456",
                    scheduledAt: new Date().toISOString(),
                    duration: 60,
                    status: "scheduled",
                    accessType: "enrolled-only",
                    totalAttendees: 25
                }
            ]);
        } catch (error) {
            toast.error("Failed to fetch classes");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this class?")) return;

        try {
            // TODO: API call
            toast.success("Class deleted successfully");
            fetchClasses();
        } catch (error) {
            toast.error("Failed to delete class");
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            live: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            completed: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
        };
        return styles[status] || styles.scheduled;
    };

    const filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || cls.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Classes</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage all live classes and webinars</p>
                </div>
                <Link
                    href="/dashboard/admin/live-classes/create"
                    className="btn btn-primary flex items-center gap-2"
                >
                    <FiPlus size={18} />
                    Schedule Class
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
                            placeholder="Search classes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="all">All Status</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="live">Live</option>
                            <option value="completed">Completed</option>
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
                                    Class Details
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Schedule
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Access
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Attendees
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
                            ) : filteredClasses.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <FiVideo className="mx-auto text-gray-400 mb-2" size={48} />
                                        <p className="text-gray-500">No live classes found</p>
                                        <Link
                                            href="/dashboard/admin/live-classes/create"
                                            className="text-primary hover:underline text-sm mt-2 inline-block"
                                        >
                                            Schedule your first class
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                filteredClasses.map((cls) => (
                                    <tr
                                        key={cls._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {cls.title}
                                                </p>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                                    <FiClock size={14} />
                                                    {cls.duration} minutes
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                                <FiCalendar size={14} />
                                                {new Date(cls.scheduledAt).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(cls.scheduledAt).toLocaleTimeString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                                {cls.accessType.replace("-", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                                <FiUsers size={16} />
                                                {cls.totalAttendees || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(cls.status)}`}>
                                                {cls.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={cls.meetingLink}
                                                    target="_blank"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                                    title="Join Meeting"
                                                >
                                                    <FiExternalLink size={18} />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/admin/live-classes/edit/${cls._id}`}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-md transition-colors"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(cls._id)}
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
