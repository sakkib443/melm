"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    FiCheck,
    FiX,
    FiArrowRight,
    FiStar,
    FiZap,
    FiAward,
    FiShield,
    FiDownload,
    FiUsers,
    FiHeadphones,
} from "react-icons/fi";
import Navbar from "@/components/shared/Navbar";
import { useLanguage } from "@/context/LanguageContext";

const plans = [
    {
        id: "free",
        name: "Free",
        nameBn: "ফ্রি",
        icon: FiZap,
        price: 0,
        priceBn: "০",
        period: "forever",
        periodBn: "আজীবন",
        description: "Perfect for exploring our platform",
        descriptionBn: "প্ল্যাটফর্ম এক্সপ্লোর করার জন্য পারফেক্ট",
        color: "gray",
        features: [
            { text: "5 Free Downloads/month", textBn: "মাসে ৫টি ফ্রি ডাউনলোড", included: true },
            { text: "Access to Free Templates", textBn: "ফ্রি টেমপ্লেট অ্যাক্সেস", included: true },
            { text: "Basic Support", textBn: "বেসিক সাপোর্ট", included: true },
            { text: "Premium Templates", textBn: "প্রিমিয়াম টেমপ্লেট", included: false },
            { text: "Commercial License", textBn: "কমার্শিয়াল লাইসেন্স", included: false },
            { text: "Priority Support", textBn: "প্রাইওরিটি সাপোর্ট", included: false },
        ],
    },
    {
        id: "pro",
        name: "Pro",
        nameBn: "প্রো",
        icon: FiStar,
        price: 999,
        priceBn: "৯৯৯",
        period: "/month",
        periodBn: "/মাস",
        description: "Best for freelancers & designers",
        descriptionBn: "ফ্রিল্যান্সার ও ডিজাইনারদের জন্য সেরা",
        color: "primary",
        popular: true,
        features: [
            { text: "50 Downloads/month", textBn: "মাসে ৫০টি ডাউনলোড", included: true },
            { text: "All Premium Templates", textBn: "সব প্রিমিয়াম টেমপ্লেট", included: true },
            { text: "Commercial License", textBn: "কমার্শিয়াল লাইসেন্স", included: true },
            { text: "Priority Support", textBn: "প্রাইওরিটি সাপোর্ট", included: true },
            { text: "Early Access", textBn: "আর্লি অ্যাক্সেস", included: true },
            { text: "Team Access", textBn: "টিম অ্যাক্সেস", included: false },
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        nameBn: "এন্টারপ্রাইজ",
        icon: FiAward,
        price: 4999,
        priceBn: "৪৯৯৯",
        period: "/month",
        periodBn: "/মাস",
        description: "For teams & agencies",
        descriptionBn: "টিম ও এজেন্সির জন্য",
        color: "purple",
        features: [
            { text: "Unlimited Downloads", textBn: "আনলিমিটেড ডাউনলোড", included: true },
            { text: "All Premium Templates", textBn: "সব প্রিমিয়াম টেমপ্লেট", included: true },
            { text: "Extended License", textBn: "এক্সটেন্ডেড লাইসেন্স", included: true },
            { text: "24/7 Priority Support", textBn: "২৪/৭ প্রাইওরিটি সাপোর্ট", included: true },
            { text: "Team Access (10 seats)", textBn: "টিম অ্যাক্সেস (১০ সিট)", included: true },
            { text: "Custom Requests", textBn: "কাস্টম রিকুয়েস্ট", included: true },
        ],
    },
];

const faqs = [
    {
        q: "Can I cancel my subscription anytime?",
        qBn: "আমি কি যেকোনো সময় সাবস্ক্রিপশন বাতিল করতে পারি?",
        a: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.",
        aBn: "হ্যাঁ, আপনি যেকোনো সময় সাবস্ক্রিপশন বাতিল করতে পারেন। আপনার বিলিং পিরিয়ড শেষ না হওয়া পর্যন্ত অ্যাক্সেস থাকবে।",
    },
    {
        q: "What payment methods do you accept?",
        qBn: "আপনারা কোন পেমেন্ট পদ্ধতি গ্রহণ করেন?",
        a: "We accept all major credit cards, bKash, Nagad, Rocket, and bank transfers for Bangladeshi customers.",
        aBn: "আমরা সব প্রধান ক্রেডিট কার্ড, বিকাশ, নগদ, রকেট এবং বাংলাদেশী ক্রেতাদের জন্য ব্যাংক ট্রান্সফার গ্রহণ করি।",
    },
    {
        q: "Can I upgrade or downgrade my plan?",
        qBn: "আমি কি প্ল্যান আপগ্রেড বা ডাউনগ্রেড করতে পারি?",
        a: "Yes, you can change your plan at any time. The new pricing will be prorated based on your billing cycle.",
        aBn: "হ্যাঁ, আপনি যেকোনো সময় প্ল্যান পরিবর্তন করতে পারেন। নতুন মূল্য আপনার বিলিং সাইকেল অনুযায়ী প্রোরেট হবে।",
    },
    {
        q: "What is the commercial license?",
        qBn: "কমার্শিয়াল লাইসেন্স কী?",
        a: "The commercial license allows you to use our templates for client work, commercial projects, and products for sale.",
        aBn: "কমার্শিয়াল লাইসেন্স আপনাকে ক্লায়েন্ট কাজ, বাণিজ্যিক প্রকল্প এবং বিক্রয়ের জন্য পণ্যে আমাদের টেমপ্লেট ব্যবহার করার অনুমতি দেয়।",
    },
];

export default function PricingPage() {
    const { language } = useLanguage();
    const [billingPeriod, setBillingPeriod] = useState("monthly");
    const [openFaq, setOpenFaq] = useState(null);

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
                            <FiAward className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary uppercase tracking-wider">
                                {language === 'bn' ? 'সাবস্ক্রিপশন প্ল্যান' : 'Subscription Plans'}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white font-heading uppercase leading-[0.9] mb-6">
                            {language === 'bn' ? 'সিম্পল' : 'SIMPLE'}
                            <br />
                            <span className="text-primary">{language === 'bn' ? 'প্রাইসিং।' : 'PRICING.'}</span>
                        </h1>

                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10">
                            {language === 'bn'
                                ? 'আপনার প্রয়োজন অনুযায়ী সঠিক প্ল্যান বেছে নিন। যেকোনো সময় আপগ্রেড বা ডাউনগ্রেড করুন।'
                                : 'Choose the right plan for your needs. Upgrade or downgrade anytime.'}
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center gap-4 p-2 bg-gray-100 dark:bg-gray-900 rounded-full">
                            <button
                                onClick={() => setBillingPeriod("monthly")}
                                className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${billingPeriod === "monthly"
                                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md"
                                    : "text-gray-500"
                                    }`}
                            >
                                {language === 'bn' ? 'মাসিক' : 'Monthly'}
                            </button>
                            <button
                                onClick={() => setBillingPeriod("yearly")}
                                className={`px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${billingPeriod === "yearly"
                                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-md"
                                    : "text-gray-500"
                                    }`}
                            >
                                {language === 'bn' ? 'বার্ষিক' : 'Yearly'}
                                <span className="ml-2 px-2 py-0.5 bg-primary text-black text-xs rounded-full">
                                    -20%
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-12">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-white dark:bg-gray-900 rounded-3xl p-8 border-2 transition-all ${plan.popular
                                    ? "border-primary shadow-xl shadow-primary/10"
                                    : "border-gray-100 dark:border-gray-800 hover:border-primary/50"
                                    }`}
                            >
                                {/* Popular Badge */}
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-primary text-black text-sm font-bold uppercase rounded-full">
                                        {language === 'bn' ? 'জনপ্রিয়' : 'Most Popular'}
                                    </div>
                                )}

                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${plan.color === "primary"
                                    ? "bg-primary/10"
                                    : plan.color === "purple"
                                        ? "bg-purple-100 dark:bg-purple-900/30"
                                        : "bg-gray-100 dark:bg-gray-800"
                                    }`}>
                                    <plan.icon className={`w-8 h-8 ${plan.color === "primary"
                                        ? "text-primary"
                                        : plan.color === "purple"
                                            ? "text-purple-500"
                                            : "text-gray-500"
                                        }`} />
                                </div>

                                {/* Plan Name */}
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-heading uppercase">
                                    {language === 'bn' ? plan.nameBn : plan.name}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">
                                    {language === 'bn' ? plan.descriptionBn : plan.description}
                                </p>

                                {/* Price */}
                                <div className="flex items-baseline gap-1 mb-8">
                                    <span className="text-5xl font-bold text-gray-900 dark:text-white font-heading">
                                        ৳{billingPeriod === "yearly" && plan.price > 0
                                            ? Math.round(plan.price * 0.8)
                                            : plan.price}
                                    </span>
                                    <span className="text-gray-500">
                                        {plan.price === 0
                                            ? (language === 'bn' ? plan.periodBn : plan.period)
                                            : (language === 'bn' ? plan.periodBn : plan.period)}
                                    </span>
                                </div>

                                {/* Features */}
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            {feature.included ? (
                                                <FiCheck className="w-5 h-5 text-primary flex-shrink-0" />
                                            ) : (
                                                <FiX className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                                            )}
                                            <span className={feature.included ? "text-gray-700 dark:text-gray-300" : "text-gray-400"}>
                                                {language === 'bn' ? feature.textBn : feature.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button className={`w-full py-4 rounded-full font-bold uppercase tracking-wider transition-all ${plan.popular
                                    ? "bg-primary text-black hover:bg-primary/90"
                                    : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-primary hover:text-black"
                                    }`}>
                                    {plan.price === 0
                                        ? (language === 'bn' ? 'শুরু করুন' : 'Get Started')
                                        : (language === 'bn' ? 'এখনই কিনুন' : 'Subscribe Now')}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50 dark:bg-gray-900">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-4">
                            {language === 'bn' ? 'সব প্ল্যানে যা পাবেন' : 'INCLUDED IN ALL PLANS'}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: FiDownload,
                                title: "Instant Download",
                                titleBn: "ইনস্ট্যান্ট ডাউনলোড",
                                desc: "Download files instantly after purchase",
                                descBn: "কেনার পরই ফাইল ডাউনলোড করুন"
                            },
                            {
                                icon: FiShield,
                                title: "Secure Payment",
                                titleBn: "সিকিউর পেমেন্ট",
                                desc: "100% secure payment processing",
                                descBn: "১০০% সিকিউর পেমেন্ট প্রসেসিং"
                            },
                            {
                                icon: FiUsers,
                                title: "Regular Updates",
                                titleBn: "নিয়মিত আপডেট",
                                desc: "Get new templates every week",
                                descBn: "প্রতি সপ্তাহে নতুন টেমপ্লেট পান"
                            },
                            {
                                icon: FiHeadphones,
                                title: "24/7 Support",
                                titleBn: "২৪/৭ সাপোর্ট",
                                desc: "Get help whenever you need it",
                                descBn: "যখনই প্রয়োজন সাহায্য পান"
                            },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <feature.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {language === 'bn' ? feature.titleBn : feature.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {language === 'bn' ? feature.descBn : feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20">
                <div className="container px-6 lg:px-12 max-w-[1000px] mx-auto">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white font-heading uppercase mb-4">
                            {language === 'bn' ? 'সচরাচর জিজ্ঞাসা' : 'FAQ'}
                        </h2>
                    </motion.div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {language === 'bn' ? faq.qBn : faq.q}
                                    </span>
                                    <FiArrowRight className={`w-5 h-5 text-primary transition-transform ${openFaq === index ? 'rotate-90' : ''}`} />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-6 text-gray-500 dark:text-gray-400">
                                        {language === 'bn' ? faq.aBn : faq.a}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 dark:bg-black">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading uppercase mb-6">
                            {language === 'bn' ? 'আজই শুরু করুন!' : 'START TODAY!'}
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                            {language === 'bn'
                                ? 'ফ্রি অ্যাকাউন্ট দিয়ে শুরু করুন এবং প্রিমিয়াম কনটেন্ট আনলক করুন।'
                                : 'Start with a free account and unlock premium content.'}
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-black font-bold uppercase tracking-wider rounded-full hover:bg-primary/90 transition-all"
                        >
                            {language === 'bn' ? 'ফ্রি সাইন আপ' : 'Sign Up Free'}
                            <FiArrowRight className="w-5 h-5" />
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
