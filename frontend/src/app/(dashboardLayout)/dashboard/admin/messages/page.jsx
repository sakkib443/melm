"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiMessageCircle, FiSearch, FiLoader, FiSend, FiUser, FiClock,
    FiCheck, FiCheckCircle, FiRefreshCw, FiInbox
} from "react-icons/fi";

export default function MessagesPage() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [reply, setReply] = useState("");
    const [filter, setFilter] = useState("all");

    const mockData = [
        { _id: "1", from: { firstName: "John", lastName: "Doe", email: "john@example.com" }, subject: "Help with download", message: "I purchased a UI kit but can't download it. Can you help?", status: "unread", createdAt: new Date() },
        { _id: "2", from: { firstName: "Jane", lastName: "Smith", email: "jane@example.com" }, subject: "Refund request", message: "I accidentally bought the wrong product. Can I get a refund?", status: "unread", createdAt: new Date(Date.now() - 3600000) },
        { _id: "3", from: { firstName: "Mike", lastName: "Johnson", email: "mike@example.com" }, subject: "License question", message: "Can I use the purchased graphics for commercial projects?", status: "read", createdAt: new Date(Date.now() - 7200000) },
        { _id: "4", from: { firstName: "Sarah", lastName: "Williams", email: "sarah@example.com" }, subject: "Great product!", message: "Just wanted to say thanks for the amazing course!", status: "replied", createdAt: new Date(Date.now() - 86400000) },
    ];

    useEffect(() => {
        setLoading(true);
        setTimeout(() => { setMessages(mockData); setLoading(false); }, 500);
    }, []);

    const handleReply = () => {
        if (!reply.trim()) return;
        toast.success("Reply sent!");
        setMessages(prev => prev.map(m => m._id === selected._id ? { ...m, status: "replied" } : m));
        setReply("");
    };

    const markAsRead = (id) => {
        setMessages(prev => prev.map(m => m._id === id ? { ...m, status: "read" } : m));
    };

    const filtered = messages.filter(m => {
        if (filter === "all") return true;
        return m.status === filter;
    });

    const unreadCount = messages.filter(m => m.status === "unread").length;

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="p-6 lg:p-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative">
                        <FiMessageCircle className="text-white text-xl" />
                        {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unreadCount}</span>}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
                        <p className="text-sm text-gray-500">{unreadCount} unread</p>
                    </div>
                </div>
                <button className="btn btn-ghost p-3"><FiRefreshCw /></button>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* List */}
                <div className="w-full md:w-1/3 flex flex-col">
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {["all", "unread", "read", "replied"].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${filter === f ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"}`}>{f}</button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2">
                        {loading ? (
                            <div className="flex justify-center py-10"><FiLoader className="animate-spin text-primary" size={24} /></div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-10 text-gray-400">
                                <FiInbox size={40} className="mx-auto mb-2 opacity-50" />
                                <p>No messages</p>
                            </div>
                        ) : (
                            filtered.map((msg) => (
                                <button
                                    key={msg._id}
                                    onClick={() => { setSelected(msg); markAsRead(msg._id); }}
                                    className={`w-full text-left p-4 rounded-xl transition-all ${selected?._id === msg._id ? "bg-primary-10 border-primary" : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"} border ${msg.status === "unread" ? "border-primary/30" : "border-gray-100 dark:border-gray-700"}`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                                                {msg.from?.firstName?.[0]}{msg.from?.lastName?.[0]}
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white text-sm">{msg.from?.firstName}</span>
                                        </div>
                                        {msg.status === "unread" && <span className="w-2 h-2 bg-primary rounded-full" />}
                                        {msg.status === "replied" && <FiCheckCircle className="text-emerald-500" size={14} />}
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate mb-1">{msg.subject}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-gray-500 truncate flex-1">{msg.message}</p>
                                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{timeAgo(msg.createdAt)}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Detail */}
                <div className="hidden md:flex flex-1 flex-col card overflow-hidden">
                    {selected ? (
                        <>
                            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                                        {selected.from?.firstName?.[0]}{selected.from?.lastName?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{selected.from?.firstName} {selected.from?.lastName}</p>
                                        <p className="text-sm text-gray-500">{selected.from?.email}</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{selected.subject}</h3>
                            </div>
                            <div className="flex-1 p-6 overflow-y-auto">
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{selected.message}</p>
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        className="input flex-1"
                                        placeholder="Type your reply..."
                                        onKeyDown={(e) => e.key === "Enter" && handleReply()}
                                    />
                                    <button onClick={handleReply} className="btn btn-primary px-6"><FiSend /> Send</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <FiMessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Select a message to view</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
