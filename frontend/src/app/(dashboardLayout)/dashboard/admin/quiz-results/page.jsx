"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FiBarChart2,
    FiSearch,
    FiFilter,
    FiEye,
    FiCheckCircle,
    FiXCircle,
    FiClock,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function QuizResultsPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            // TODO: Replace with actual API call

            // Mock data
            setResults([
                {
                    _id: "1",
                    studentName: "John Doe",
                    courseName: "React Masterclass",
                    lessonTitle: "Quiz: React Hooks",
                    score: 85,
                    totalPoints: 100,
                    percentage: 85,
                    passed: true,
                    attemptNumber: 1,
                    submittedAt: new Date().toISOString()
                }
            ]);
        } catch (error) {
            toast.error("Failed to fetch quiz results");
        } finally {
            setLoading(false);
        }
    };

    const filteredResults = results.filter(result => {
        const matchesSearch =
            result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "passed" && result.passed) ||
            (statusFilter === "failed" && !result.passed);
        return matchesSearch && matchesStatus;
    });

    const avgScore = results.length > 0
        ? (results.reduce((sum, r) => sum + r.percentage, 0) / results.length).toFixed(1)
        : 0;
    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.filter(r => !r.passed).length;

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Results</h1>
                <p className="text-sm text-gray-500 mt-1">View all quiz submissions and scores</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <FiBarChart2 className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Attempts</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{results.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <FiClock className="text-purple-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Avg Score</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{avgScore}%</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <FiCheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Passed</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{passedCount}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <FiXCircle className="text-red-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Failed</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{failedCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative md:col-span-2">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student, course, or quiz..."
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
                            <option value="all">All Results</option>
                            <option value="passed">Passed Only</option>
                            <option value="failed">Failed Only</option>
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
                                    Student
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Quiz
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Score
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Attempt
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Date
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
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <div className="flex justify-center">
                                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredResults.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center">
                                        <FiBarChart2 className="mx-auto text-gray-400 mb-2" size={48} />
                                        <p className="text-gray-500">No quiz results found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredResults.map((result) => (
                                    <tr
                                        key={result._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {result.studentName}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {result.courseName}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {result.lessonTitle}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {result.score}/{result.totalPoints}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {result.percentage}%
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                                #{result.attemptNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {new Date(result.submittedAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${result.passed
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                }`}>
                                                {result.passed ? "Passed" : "Failed"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <button
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                                    title="View Details"
                                                >
                                                    <FiEye size={18} />
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
