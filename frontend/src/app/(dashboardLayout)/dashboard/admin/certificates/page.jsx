"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FiAward,
    FiDownload,
    FiEye,
    FiSearch,
    FiFilter,
    FiCheckCircle,
    FiXCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            setLoading(true);
            // TODO: Replace with actual API call
            // const response = await fetch('/api/certificates');

            // Mock data
            setCertificates([
                {
                    _id: "1",
                    certificateId: "CERT-2026-001",
                    studentName: "John Doe",
                    courseName: "React Masterclass",
                    completedAt: new Date().toISOString(),
                    status: "active"
                }
            ]);
        } catch (error) {
            toast.error("Failed to fetch certificates");
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (id) => {
        if (!confirm("Are you sure you want to revoke this certificate?")) return;

        try {
            toast.success("Certificate revoked successfully");
            fetchCertificates();
        } catch (error) {
            toast.error("Failed to revoke certificate");
        }
    };

    const filteredCertificates = certificates.filter(cert => {
        const matchesSearch =
            cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certificates</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage issued certificates</p>
                </div>
                <Link
                    href="/dashboard/admin/certificates/settings"
                    className="btn btn-primary flex items-center gap-2"
                >
                    <FiAward size={18} />
                    Certificate Settings
                </Link>
            </div>

            {/* Filters */}
            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative md:col-span-2">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name, course, or certificate ID..."
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
                            <option value="active">Active</option>
                            <option value="revoked">Revoked</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <FiCheckCircle className="text-green-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Total Issued</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{certificates.length}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <FiAward className="text-blue-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Active</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {certificates.filter(c => c.status === "active").length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <FiXCircle className="text-red-600" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Revoked</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">
                                {certificates.filter(c => c.status === "revoked").length}
                            </p>
                        </div>
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
                                    Certificate ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Student
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Issued Date
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
                            ) : filteredCertificates.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <FiAward className="mx-auto text-gray-400 mb-2" size={48} />
                                        <p className="text-gray-500">No certificates found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredCertificates.map((cert) => (
                                    <tr
                                        key={cert._id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-medium text-primary">
                                                {cert.certificateId}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {cert.studentName}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {cert.courseName}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                {new Date(cert.completedAt).toLocaleDateString()}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cert.status === "active"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                }`}>
                                                {cert.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/certificate/verify/${cert.certificateId}`}
                                                    target="_blank"
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                                                    title="View"
                                                >
                                                    <FiEye size={18} />
                                                </Link>
                                                <button
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition-colors"
                                                    title="Download"
                                                >
                                                    <FiDownload size={18} />
                                                </button>
                                                {cert.status === "active" && (
                                                    <button
                                                        onClick={() => handleRevoke(cert._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                                                        title="Revoke"
                                                    >
                                                        <FiXCircle size={18} />
                                                    </button>
                                                )}
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
