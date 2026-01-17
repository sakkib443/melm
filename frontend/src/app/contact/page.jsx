"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiClock,
    FiSend,
    FiMessageCircle,
    FiHeadphones,
    FiGlobe,
} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Navbar from "@/components/shared/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

const contactInfo = [
    {
        icon: FiMail,
        title: "Email Us",
        titleBn: "ইমেইল করুন",
        value: "support@creativehub.com",
        link: "mailto:support@creativehub.com",
    },
    {
        icon: FiPhone,
        title: "Call Us",
        titleBn: "কল করুন",
        value: "+880 1234-567890",
        link: "tel:+8801234567890",
    },
    {
        icon: FiMapPin,
        title: "Visit Us",
        titleBn: "অফিস",
        value: "Dhaka, Bangladesh",
        valueBn: "ঢাকা, বাংলাদেশ",
    },
    {
        icon: FiClock,
        title: "Working Hours",
        titleBn: "কার্যকরী সময়",
        value: "Sun - Thu: 9AM - 6PM",
        valueBn: "রবি - বৃহঃ: সকাল ৯টা - সন্ধ্যা ৬টা",
    },
];

const supportOptions = [
    {
        icon: FiMessageCircle,
        title: "Live Chat",
        titleBn: "লাইভ চ্যাট",
        desc: "Chat with our support team",
        descBn: "আমাদের সাপোর্ট টিমের সাথে চ্যাট করুন",
        color: "primary",
    },
    {
        icon: FiHeadphones,
        title: "Phone Support",
        titleBn: "ফোন সাপোর্ট",
        desc: "Call us for immediate help",
        descBn: "তাৎক্ষণিক সাহায্যের জন্য কল করুন",
        color: "blue",
    },
    {
        icon: FaWhatsapp,
        title: "WhatsApp",
        titleBn: "হোয়াটসঅ্যাপ",
        desc: "Message us on WhatsApp",
        descBn: "হোয়াটসঅ্যাপে মেসেজ করুন",
        color: "green",
    },
];

export default function ContactPage() {
    const { language } = useLanguage();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success(language === 'bn' ? 'মেসেজ পাঠানো হয়েছে!' : 'Message sent successfully!');
        setFormData({ name: "", email: "", subject: "", message: "" });
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                />

                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto relative z-10">
                    <motion.div
                        className="text-center max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                            <FiMessageCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'যোগাযোগ করুন' : 'Get In Touch'}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9] mb-6">
                            {language === 'bn' ? 'আমাদের সাথে' : 'CONTACT'}
                            <br />
                            <span className="text-primary">{language === 'bn' ? 'যোগাযোগ।' : 'US.'}</span>
                        </h1>

                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                            {language === 'bn'
                                ? 'কোনো প্রশ্ন বা সাহায্যের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা সবসময় আপনার জন্য আছি।'
                                : 'Have questions or need help? We\'re here for you. Reach out anytime.'}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {contactInfo.map((info, index) => (
                            <motion.a
                                key={index}
                                href={info.link || "#"}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-primary/50 transition-all group"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                                    <info.icon className="w-6 h-6 text-primary group-hover:text-black" />
                                </div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                    {language === 'bn' ? info.titleBn : info.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {language === 'bn' && info.valueBn ? info.valueBn : info.value}
                                </p>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form & Map Section */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-900 p-8 lg:p-10 rounded-3xl border border-gray-100 dark:border-gray-800"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-2">
                                {language === 'bn' ? 'মেসেজ পাঠান' : 'SEND MESSAGE'}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8">
                                {language === 'bn'
                                    ? 'ফর্মটি পূরণ করুন এবং আমরা শীঘ্রই যোগাযোগ করব।'
                                    : 'Fill out the form and we\'ll get back to you shortly.'}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            {language === 'bn' ? 'আপনার নাম' : 'Your Name'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter your name'}
                                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            {language === 'bn' ? 'ইমেইল' : 'Email'}
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder={language === 'bn' ? 'ইমেইল লিখুন' : 'Enter your email'}
                                            className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        {language === 'bn' ? 'বিষয়' : 'Subject'}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        placeholder={language === 'bn' ? 'বিষয় লিখুন' : 'Enter subject'}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        {language === 'bn' ? 'মেসেজ' : 'Message'}
                                    </label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder={language === 'bn' ? 'আপনার মেসেজ লিখুন' : 'Write your message'}
                                        rows={5}
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-primary transition-colors resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-black font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all disabled:opacity-50"
                                >
                                    {loading ? (
                                        <span className="animate-spin">⏳</span>
                                    ) : (
                                        <>
                                            <FiSend className="w-5 h-5" />
                                            {language === 'bn' ? 'মেসেজ পাঠান' : 'Send Message'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>

                        {/* Map & Support Options */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            {/* Map */}
                            <div className="h-[300px] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.38703692693!2d90.27923710646498!3d23.780573258035957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1704000000000!5m2!1sen!2sbd"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </div>

                            {/* Support Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {supportOptions.map((option, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-center hover:border-primary/50 transition-all cursor-pointer"
                                    >
                                        <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${option.color === "primary"
                                            ? "bg-primary/10"
                                            : option.color === "blue"
                                                ? "bg-blue-100 dark:bg-blue-900/30"
                                                : "bg-green-100 dark:bg-green-900/30"
                                            }`}>
                                            <option.icon className={`w-6 h-6 ${option.color === "primary"
                                                ? "text-primary"
                                                : option.color === "blue"
                                                    ? "text-blue-500"
                                                    : "text-green-500"
                                                }`} />
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                                            {language === 'bn' ? option.titleBn : option.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {language === 'bn' ? option.descBn : option.desc}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Social Links */}
                            <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-3xl">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                                    {language === 'bn' ? 'সোশ্যাল মিডিয়া' : 'Follow Us'}
                                </h3>
                                <div className="flex gap-4">
                                    {[FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaWhatsapp].map((Icon, index) => (
                                        <a
                                            key={index}
                                            href="#"
                                            className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
}
