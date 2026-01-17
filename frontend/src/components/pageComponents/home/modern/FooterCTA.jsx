"use client";

import { motion } from "framer-motion";
import { FiArrowUpRight, FiMail, FiSend } from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaDribbble, FaBehance } from "react-icons/fa";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function FooterCTA() {
    const [email, setEmail] = useState("");
    const { t } = useLanguage();

    const marketplaceLinks = ["templates", "fonts", "graphicsWord", "uiKitsWord", "illustrationsWord"];
    const supportLinks = ["helpCenter", "licensing", "refundPolicy", "contactUs", "becomeASeller"];

    return (
        <footer className="bg-gray-900 dark:bg-black text-white">
            {/* CTA Section */}
            <div className="py-24 border-b border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Big Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-heading uppercase leading-[0.9]">
                                {t('start')}<br />
                                <span className="text-primary">{t('creating')}</span>
                            </h2>
                            <p className="text-gray-400 text-lg mt-6 max-w-md">
                                {t('footerDescription')}
                            </p>
                        </motion.div>

                        {/* Right: Contact Info */}
                        <motion.div
                            className="space-y-8"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Email */}
                            <a
                                href="mailto:support@creativehub.com"
                                className="flex items-center gap-4 text-2xl md:text-3xl font-bold hover:text-primary transition-colors group"
                            >
                                <FiMail size={28} className="text-primary" />
                                support@creativehub.com
                                <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>

                            {/* Social Links */}
                            <div className="flex gap-4">
                                {[FaDribbble, FaBehance, FaInstagram, FaTwitter, FaLinkedinIn, FaFacebookF].map((Icon, index) => (
                                    <motion.a
                                        key={index}
                                        href="#"
                                        className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-black transition-all"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon size={18} />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Newsletter & Links */}
            <div className="py-16">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                        {/* Newsletter */}
                        <div className="lg:col-span-2">
                            <h4 className="text-xl font-bold mb-6 font-heading uppercase">{t('getDesignUpdates')}</h4>
                            <p className="text-gray-400 mb-4">{t('subscribeDescription')}</p>
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder={t('enterEmail')}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 bg-gray-800 border border-gray-700 rounded-full px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                                />
                                <motion.button
                                    className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiSend size={20} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-xl font-bold mb-6 font-heading uppercase">{t('marketplace')}</h4>
                            <ul className="space-y-3">
                                {marketplaceLinks.map((linkKey, i) => (
                                    <li key={i}>
                                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">{t(linkKey)}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-xl font-bold mb-6 font-heading uppercase">{t('support')}</h4>
                            <ul className="space-y-3">
                                {supportLinks.map((linkKey, i) => (
                                    <li key={i}>
                                        <a href="#" className="text-gray-400 hover:text-primary transition-colors">{t(linkKey)}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="py-6 border-t border-gray-800">
                <div className="container px-6 lg:px-12 max-w-[1400px] mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2024 CreativeHub Pro. {t('allRightsReserved')}
                        </p>
                        <div className="flex gap-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-primary transition-colors">{t('privacyPolicy')}</a>
                            <a href="#" className="hover:text-primary transition-colors">{t('termsOfService')}</a>
                            <a href="#" className="hover:text-primary transition-colors">{t('licenseAgreement')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
