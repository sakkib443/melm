"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    FiUsers,
    FiAward,
    FiGlobe,
    FiHeart,
    FiArrowRight,
    FiTarget,
    FiZap,
    FiShield,
    FiTrendingUp,
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import { useLanguage } from "@/context/LanguageContext";

const stats = [
    { value: "50K+", valueBn: "৫০K+", label: "Downloads", labelBn: "ডাউনলোড" },
    { value: "5K+", valueBn: "৫K+", label: "Templates", labelBn: "টেমপ্লেট" },
    { value: "10K+", valueBn: "১০K+", label: "Happy Customers", labelBn: "সন্তুষ্ট গ্রাহক" },
    { value: "99%", valueBn: "৯৯%", label: "Satisfaction Rate", labelBn: "সন্তুষ্টির হার" },
];

const values = [
    {
        icon: FiTarget,
        title: "Quality First",
        titleBn: "গুণমান প্রথম",
        desc: "Every template is crafted with attention to detail and professional standards.",
        descBn: "প্রতিটি টেমপ্লেট বিস্তারিত মনোযোগ এবং পেশাদার মান দিয়ে তৈরি।",
    },
    {
        icon: FiZap,
        title: "Innovation",
        titleBn: "উদ্ভাবন",
        desc: "We constantly innovate to bring you the latest design trends and tools.",
        descBn: "সর্বশেষ ডিজাইন ট্রেন্ড এবং টুলস আনতে আমরা ক্রমাগত উদ্ভাবন করি।",
    },
    {
        icon: FiShield,
        title: "Trust & Security",
        titleBn: "বিশ্বাস ও নিরাপত্তা",
        desc: "Your data and purchases are protected with enterprise-grade security.",
        descBn: "আপনার ডেটা এবং ক্রয় এন্টারপ্রাইজ-গ্রেড নিরাপত্তায় সুরক্ষিত।",
    },
    {
        icon: FiHeart,
        title: "Customer Love",
        titleBn: "গ্রাহক ভালোবাসা",
        desc: "We're dedicated to providing the best experience for our customers.",
        descBn: "আমাদের গ্রাহকদের জন্য সেরা অভিজ্ঞতা প্রদানে আমরা নিবেদিত।",
    },
];

const team = [
    {
        name: "Sarah Ahmed",
        nameBn: "সারা আহমেদ",
        role: "Founder & CEO",
        roleBn: "প্রতিষ্ঠাতা ও সিইও",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    },
    {
        name: "Rafiq Hassan",
        nameBn: "রফিক হাসান",
        role: "Creative Director",
        roleBn: "ক্রিয়েটিভ ডিরেক্টর",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    },
    {
        name: "Fatima Khan",
        nameBn: "ফাতিমা খান",
        role: "Head of Design",
        roleBn: "ডিজাইন প্রধান",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    },
    {
        name: "Karim Rahman",
        nameBn: "করিম রহমান",
        role: "Lead Developer",
        roleBn: "লিড ডেভেলপার",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
];

const milestones = [
    { year: "2018", title: "Founded", titleBn: "প্রতিষ্ঠা", desc: "Started with a vision to democratize design", descBn: "ডিজাইন গণতন্ত্রীকরণের দৃষ্টিভঙ্গি নিয়ে শুরু" },
    { year: "2019", title: "First 1K Users", titleBn: "প্রথম ১K ইউজার", desc: "Reached our first milestone", descBn: "প্রথম মাইলস্টোনে পৌঁছানো" },
    { year: "2021", title: "50K Downloads", titleBn: "৫০K ডাউনলোড", desc: "Templates downloaded worldwide", descBn: "বিশ্বব্যাপী টেমপ্লেট ডাউনলোড" },
    { year: "2024", title: "Global Reach", titleBn: "বিশ্বব্যাপী পৌঁছানো", desc: "Serving customers in 50+ countries", descBn: "৫০+ দেশে গ্রাহক সেবা" },
];

export default function AboutPage() {
    const { language } = useLanguage();

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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                                <FiUsers className="w-4 h-4 text-primary" />
                                <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                    {language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9] mb-6">
                                {language === 'bn' ? 'ক্রিয়েটিভ' : 'CREATIVE'}
                                <br />
                                <span className="text-primary">{language === 'bn' ? 'হাব প্রো।' : 'HUB PRO.'}</span>
                            </h1>

                            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mb-8">
                                {language === 'bn'
                                    ? 'আমরা বাংলাদেশের সেরা ডিজাইন মার্কেটপ্লেস। বিশ্বমানের গ্রাফিক টেমপ্লেট, ফন্ট, এবং ক্রিয়েটিভ এসেট সরবরাহ করি।'
                                    : 'We are Bangladesh\'s premier design marketplace. Providing world-class graphic templates, fonts, and creative assets.'}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                {stats.map((stat, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white font-heading">
                                            {language === 'bn' ? stat.valueBn : stat.value}
                                        </span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {language === 'bn' ? stat.labelBn : stat.label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Image Grid */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div className="space-y-4">
                                <div className="h-[200px] rounded-3xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                                        alt="Team"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="h-[250px] rounded-3xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800"
                                        alt="Office"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4 pt-8">
                                <div className="h-[250px] rounded-3xl overflow-hidden">
                                    <img
                                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800"
                                        alt="Work"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="h-[200px] rounded-3xl overflow-hidden bg-primary flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="text-5xl font-bold text-black font-heading">6+</span>
                                        <p className="text-black font-bold uppercase">
                                            {language === 'bn' ? 'বছরের অভিজ্ঞতা' : 'Years Experience'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-6">
                                {language === 'bn' ? 'আমাদের মিশন' : 'OUR MISSION'}
                            </h2>
                            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                                {language === 'bn'
                                    ? 'আমাদের লক্ষ্য হলো প্রতিটি ক্রিয়েটর এবং ব্যবসাকে উচ্চ-মানের ডিজাইন রিসোর্স প্রদান করা যা তাদের কাজকে পরবর্তী স্তরে নিয়ে যেতে সাহায্য করে। আমরা বিশ্বাস করি দুর্দান্ত ডিজাইন সবার জন্য সহজলভ্য হওয়া উচিত।'
                                    : 'Our goal is to provide every creator and business with high-quality design resources that help take their work to the next level. We believe great design should be accessible to everyone.'}
                            </p>
                            <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                                {language === 'bn'
                                    ? 'বাংলাদেশ থেকে শুরু করে, আমরা এখন বিশ্বের ৫০+ দেশে গ্রাহকদের সেবা দিচ্ছি, এবং আমাদের যাত্রা এখনও চলছে।'
                                    : 'Starting from Bangladesh, we now serve customers in 50+ countries worldwide, and our journey continues.'}
                            </p>
                        </motion.div>

                        {/* Values */}
                        <div className="grid grid-cols-2 gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                        <value.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                                        {language === 'bn' ? value.titleBn : value.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {language === 'bn' ? value.descBn : value.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-4">
                            {language === 'bn' ? 'আমাদের যাত্রা' : 'OUR JOURNEY'}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <div className="text-5xl font-bold text-primary/20 dark:text-primary/10 font-heading mb-2">
                                    {milestone.year}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {language === 'bn' ? milestone.titleBn : milestone.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {language === 'bn' ? milestone.descBn : milestone.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-4">
                            {language === 'bn' ? 'আমাদের টিম' : 'MEET THE TEAM'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                            {language === 'bn'
                                ? 'আমাদের প্রতিভাবান টিম যারা CreativeHub Pro কে সম্ভব করে তুলেছে।'
                                : 'The talented people behind CreativeHub Pro who make it all possible.'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center group"
                            >
                                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-6">
                                    <img
                                        src={member.image}
                                        alt={language === 'bn' ? member.nameBn : member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                    {language === 'bn' ? member.nameBn : member.name}
                                </h3>
                                <p className="text-primary font-medium">
                                    {language === 'bn' ? member.roleBn : member.role}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gray-900 dark:bg-black">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading uppercase mb-6">
                            {language === 'bn' ? 'আমাদের সাথে যোগ দিন!' : 'JOIN US TODAY!'}
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn'
                                ? 'হাজার হাজার ক্রিয়েটরদের সাথে যোগ দিন এবং আপনার ডিজাইন যাত্রা শুরু করুন।'
                                : 'Join thousands of creators and start your design journey today.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-black font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all"
                            >
                                {language === 'bn' ? 'রেজিস্টার করুন' : 'Get Started'}
                                <FiArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-white text-white font-bold uppercase tracking-wider rounded-full hover:bg-white hover:text-black transition-all"
                            >
                                {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
