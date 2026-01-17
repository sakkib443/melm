"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiFileText, FiSave, FiLoader, FiEdit, FiGlobe, FiMail, FiPhone,
    FiMapPin, FiInfo, FiHelpCircle
} from "react-icons/fi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PageContentPage() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("about");

    const [content, setContent] = useState({
        about: {
            title: "About CreativeHub",
            description: "We are the leading digital marketplace for creative assets.",
            mission: "To empower creators and designers worldwide.",
            vision: "To be the most trusted platform for digital products.",
        },
        contact: {
            title: "Contact Us",
            email: "support@creativehub.com",
            phone: "+880 1700 000000",
            address: "Dhaka, Bangladesh",
            mapUrl: "",
        },
        faq: [
            { question: "How do I purchase a product?", answer: "Simply add to cart and checkout using bKash or card." },
            { question: "Can I get a refund?", answer: "Yes, within 7 days if the product is faulty." },
            { question: "Do I need a license?", answer: "Standard license is included. Extended license available." },
        ],
        privacy: {
            content: "Privacy policy content goes here...",
        },
        terms: {
            content: "Terms and conditions content goes here...",
        },
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("creativehub-auth");
            const authToken = token ? JSON.parse(token).token : null;

            await fetch(`${API_BASE}/api/site-content/${activeTab}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
                body: JSON.stringify(content[activeTab]),
            });

            toast.success("Content saved!");
        } catch { toast.error("Failed to save"); }
        finally { setLoading(false); }
    };

    const tabs = [
        { id: "about", label: "About", icon: FiInfo },
        { id: "contact", label: "Contact", icon: FiMail },
        { id: "faq", label: "FAQ", icon: FiHelpCircle },
        { id: "privacy", label: "Privacy", icon: FiFileText },
        { id: "terms", label: "Terms", icon: FiFileText },
    ];

    const addFaq = () => {
        setContent({
            ...content,
            faq: [...content.faq, { question: "", answer: "" }],
        });
    };

    const updateFaq = (index, field, value) => {
        const updated = [...content.faq];
        updated[index][field] = value;
        setContent({ ...content, faq: updated });
    };

    const removeFaq = (index) => {
        setContent({ ...content, faq: content.faq.filter((_, i) => i !== index) });
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
                        <FiFileText className="text-white text-xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Page Content</h1>
                        <p className="text-sm text-gray-500">Manage static pages</p>
                    </div>
                </div>
                <button onClick={handleSave} disabled={loading} className="btn btn-primary">
                    {loading ? <FiLoader className="animate-spin" /> : <FiSave />} Save Changes
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {tabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm ${activeTab === tab.id ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600"}`}>
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* About */}
            {activeTab === "about" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Page Title</label>
                        <input type="text" value={content.about.title} onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })} className="input" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Description</label>
                        <textarea value={content.about.description} onChange={(e) => setContent({ ...content, about: { ...content.about, description: e.target.value } })} rows={4} className="input resize-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Mission</label>
                            <textarea value={content.about.mission} onChange={(e) => setContent({ ...content, about: { ...content.about, mission: e.target.value } })} rows={3} className="input resize-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Vision</label>
                            <textarea value={content.about.vision} onChange={(e) => setContent({ ...content, about: { ...content.about, vision: e.target.value } })} rows={3} className="input resize-none" />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Contact */}
            {activeTab === "contact" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Page Title</label>
                        <input type="text" value={content.contact.title} onChange={(e) => setContent({ ...content, contact: { ...content.contact, title: e.target.value } })} className="input" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Email</label>
                            <div className="relative">
                                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" value={content.contact.email} onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })} className="input pl-11" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Phone</label>
                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="tel" value={content.contact.phone} onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone: e.target.value } })} className="input pl-11" />
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Address</label>
                        <div className="relative">
                            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" value={content.contact.address} onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })} className="input pl-11" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Google Maps Embed URL</label>
                        <input type="text" value={content.contact.mapUrl} onChange={(e) => setContent({ ...content, contact: { ...content.contact, mapUrl: e.target.value } })} className="input" placeholder="https://maps.google.com/..." />
                    </div>
                </motion.div>
            )}

            {/* FAQ */}
            {activeTab === "faq" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {content.faq.map((faq, i) => (
                        <div key={i} className="card p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-gray-500">FAQ #{i + 1}</span>
                                <button type="button" onClick={() => removeFaq(i)} className="text-red-500 text-sm">Remove</button>
                            </div>
                            <input type="text" value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} className="input" placeholder="Question" />
                            <textarea value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} rows={2} className="input resize-none" placeholder="Answer" />
                        </div>
                    ))}
                    <button type="button" onClick={addFaq} className="btn btn-ghost w-full">+ Add FAQ</button>
                </motion.div>
            )}

            {/* Privacy & Terms */}
            {(activeTab === "privacy" || activeTab === "terms") && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">{activeTab === "privacy" ? "Privacy Policy" : "Terms & Conditions"}</label>
                    <textarea value={content[activeTab].content} onChange={(e) => setContent({ ...content, [activeTab]: { content: e.target.value } })} rows={20} className="input resize-none font-mono text-sm" placeholder="Enter content (Markdown supported)..." />
                </motion.div>
            )}
        </div>
    );
}
