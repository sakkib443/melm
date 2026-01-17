"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
    FiUser, FiMail, FiPhone, FiSave, FiLoader, FiCamera,
    FiMapPin, FiGlobe, FiBriefcase, FiLink, FiFacebook, FiTwitter, FiLinkedin, FiGithub, FiInstagram, FiYoutube, FiCheck
} from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "@/redux/features/authSlice";
import { authService } from "@/services/api";

export default function UserProfilePage() {
    const currentUser = useSelector(selectCurrentUser);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        avatar: "",
        coverImage: "",
        bio: "",
        address: "",
        city: "",
        country: "Bangladesh",
        website: "",
        company: "",
        jobTitle: "",
        gender: "",
        socialLinks: {
            facebook: "",
            twitter: "",
            linkedin: "",
            github: "",
            instagram: "",
            youtube: "",
        }
    });

    useEffect(() => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || "",
                lastName: currentUser.lastName || "",
                email: currentUser.email || "",
                phone: currentUser.phone || "",
                avatar: currentUser.avatar || "",
                coverImage: currentUser.coverImage || "",
                bio: currentUser.bio || "",
                address: currentUser.address || "",
                city: currentUser.city || "",
                country: currentUser.country || "Bangladesh",
                website: currentUser.website || "",
                company: currentUser.company || "",
                jobTitle: currentUser.jobTitle || "",
                gender: currentUser.gender || "",
                socialLinks: {
                    facebook: currentUser.socialLinks?.facebook || "",
                    twitter: currentUser.socialLinks?.twitter || "",
                    linkedin: currentUser.socialLinks?.linkedin || "",
                    github: currentUser.socialLinks?.github || "",
                    instagram: currentUser.socialLinks?.instagram || "",
                    youtube: currentUser.socialLinks?.youtube || "",
                }
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await authService.updateProfile(formData);
            if (response.success) {
                toast.success("Profile updated successfully!", {
                    icon: "🔥",
                    style: { borderRadius: '15px', background: '#333', color: '#fff' }
                });
            }
        } catch (error) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    const SectionHeader = ({ icon: Icon, title, desc }) => (
        <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gray-700/50 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon size={20} />
            </div>
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">{title}</h3>
                <p className="text-xs text-gray-500">{desc}</p>
            </div>
        </div>
    );

    return (
        <div className="pb-20">
            {/* Professional Profile Header */}
            <div className="relative mb-12">
                {/* Cover Image */}
                <div className="h-48 md:h-80 w-full overflow-hidden relative">
                    <img
                        src={formData.coverImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=2070"}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-2 md:px-4 md:py-2 rounded-xl border border-white/30 flex items-center gap-2 transition-all group">
                        <FiCamera className="group-hover:rotate-12 transition-transform" />
                        <span className="hidden md:inline text-xs font-bold uppercase">Change Cover</span>
                    </button>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 text-center">
                        <p className="text-white/50 text-xs font-medium uppercase tracking-[0.2em] mb-2">Portfolio Management</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Edit Your Profile</h2>
                    </div>
                </div>

                {/* Avatar Overlay */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 md:left-12 md:translate-x-0">
                    <div className="relative group">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
                            {formData.avatar ? (
                                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold">
                                    {formData.firstName?.[0]}
                                </div>
                            )}
                        </div>
                        <button className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl cursor-pointer">
                            <FiCamera size={24} className="mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Update Photo</span>
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 lg:px-8 mt-16 md:mt-24">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Form Sections */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Information */}
                        <div className="card p-8 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50">
                            <SectionHeader icon={FiUser} title="Basic Information" desc="Update your name and primary contact details" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">First Name</label>
                                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="input-field" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Last Name</label>
                                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="input-field" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Primary Email (Locked)</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input value={formData.email} className="input-field pl-12 bg-gray-50/50 dark:bg-gray-900/50 text-gray-400 cursor-not-allowed border-gray-200" disabled />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Phone Number</label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input name="phone" value={formData.phone} onChange={handleChange} className="input-field pl-12" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Gender / Pronoun</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className="input-field">
                                        <option value="">Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Biography / Pitch</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="input-field min-h-[120px] py-4"
                                        placeholder="Tell us about yourself, your career, and your interests..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details */}
                        <div className="card p-8 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50">
                            <SectionHeader icon={FiBriefcase} title="Professional Profile" desc="Showcase your professional background" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Job Title / Role</label>
                                    <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="input-field" placeholder="Full Stack Developer" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Current Company / Startup</label>
                                    <input name="company" value={formData.company} onChange={handleChange} className="input-field" placeholder="CreativeHub Inc" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Portfolio Website / Link</label>
                                    <div className="relative">
                                        <FiGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                        <input name="website" value={formData.website} onChange={handleChange} className="input-field pl-12" placeholder="https://yourportfolio.com" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="card p-8 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50">
                            <SectionHeader icon={FiMapPin} title="Location & Address" desc="Provide your regional information" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Street Address</label>
                                    <input name="address" value={formData.address} onChange={handleChange} className="input-field" placeholder="123 Creative Street" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">City</label>
                                    <input name="city" value={formData.city} onChange={handleChange} className="input-field" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Country</label>
                                    <input name="country" value={formData.country} onChange={handleChange} className="input-field" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Socials & Save */}
                    <div className="space-y-8">
                        {/* Save Action Card */}
                        <div className="card p-8 bg-gradient-to-br from-primary to-secondary text-white sticky top-24 shadow-2xl shadow-primary/30 border-none">
                            <h4 className="font-black text-lg uppercase tracking-tight mb-2">Ready to save?</h4>
                            <p className="text-white/80 text-xs mb-6">Your profile updates will be reflected across the entire platform immediately.</p>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="w-full py-4 bg-white text-primary font-black uppercase text-sm tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isSaving ? <FiLoader className="animate-spin" size={20} /> : <FiCheck size={20} />}
                                {isSaving ? "Saving..." : "Publish Changes"}
                            </button>
                        </div>

                        {/* Media Links Card */}
                        <div className="card p-8 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50">
                            <SectionHeader icon={FiLink} title="Social Connect" desc="Connect your digital presence" />
                            <div className="space-y-6">
                                <SocialInput icon={FiGithub} name="socialLinks.github" value={formData.socialLinks.github} onChange={handleChange} placeholder="github.com/username" />
                                <SocialInput icon={FiLinkedin} name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} placeholder="linkedin.com/in/user" />
                                <SocialInput icon={FiTwitter} name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleChange} placeholder="twitter.com/handle" />
                                <SocialInput icon={FiFacebook} name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleChange} placeholder="fb.com/user" />
                                <SocialInput icon={FiInstagram} name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleChange} placeholder="instagram.com/user" />
                                <SocialInput icon={FiYoutube} name="socialLinks.youtube" value={formData.socialLinks.youtube} onChange={handleChange} placeholder="youtube.com/c/channel" />
                            </div>
                        </div>

                        {/* URL Management */}
                        <div className="card p-8 bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700/50">
                            <SectionHeader icon={FiGlobe} title="Cloud Media" desc="Update your visuals via URL" />
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Avatar URL</label>
                                    <input name="avatar" value={formData.avatar} onChange={handleChange} className="input-field text-xs font-mono" placeholder="https://..." />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Cover Photo URL</label>
                                    <input name="coverImage" value={formData.coverImage} onChange={handleChange} className="input-field text-xs font-mono" placeholder="https://..." />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            <style jsx>{`
                .input-field {
                    @apply w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-gray-900 dark:text-white;
                }
                .card {
                    @apply rounded-[2rem];
                }
            `}</style>
        </div>
    );
}

function SocialInput({ icon: Icon, name, value, onChange, placeholder }) {
    return (
        <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                <Icon size={18} />
            </div>
            <input
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium focus:ring-4 focus:ring-primary/10 transition-all text-gray-900 dark:text-white"
                placeholder={placeholder}
            />
        </div>
    );
}
