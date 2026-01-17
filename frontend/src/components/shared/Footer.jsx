"use client";

import Link from "next/link";
import {
    FiMail, FiFacebook, FiTwitter, FiInstagram,
    FiYoutube, FiLinkedin, FiGithub, FiArrowRight,
    FiDownload, FiShield, FiGlobe, FiSend
} from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext";

const footerLinks = {
    marketplace: [
        { name: "Graphics", href: "/graphics" },
        { name: "Video Templates", href: "/video-templates" },
        { name: "UI Kits", href: "/ui-kits" },
        { name: "App Templates", href: "/app-templates" },
        { name: "Audio", href: "/audio" },
        { name: "Photos", href: "/photos" },
        { name: "Fonts", href: "/fonts" },
    ],
    learning: [
        { name: "All Courses", href: "/courses" },
        { name: "Design", href: "/courses?category=design" },
        { name: "Development", href: "/courses?category=development" },
        { name: "Marketing", href: "/courses?category=marketing" },
        { name: "Business", href: "/courses?category=business" },
        { name: "Certifications", href: "/certifications" },
    ],
    company: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" },
        { name: "Become a Seller", href: "/become-seller" },
        { name: "Affiliate Program", href: "/affiliate" },
    ],
    support: [
        { name: "Help Center", href: "/help" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "License Agreement", href: "/license" },
        { name: "Refund Policy", href: "/refund" },
        { name: "FAQ", href: "/faq" },
    ],
};

const socialLinks = [
    { icon: FiFacebook, href: "#", label: "Facebook" },
    { icon: FiTwitter, href: "#", label: "Twitter" },
    { icon: FiInstagram, href: "#", label: "Instagram" },
    { icon: FiYoutube, href: "#", label: "YouTube" },
    { icon: FiLinkedin, href: "#", label: "LinkedIn" },
    { icon: FiGithub, href: "#", label: "GitHub" },
];

export default function Footer() {
    const { theme } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 pt-24 pb-12 overflow-hidden">
            <div className="container px-4">
                {/* --- TOP FOOTER: NEWSLETTER & BRAND --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                    {/* Brand Meta */}
                    <div className="lg:col-span-5 space-y-10">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:rotate-6 transition-transform">
                                <span className="text-white font-black text-3xl">C</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter leading-none">
                                    {theme.logoText || "CreativeHub"}
                                </span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1 leading-none">Global Creator Hub</span>
                            </div>
                        </Link>

                        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-md">
                            The elite marketplace for digital assets. Empowering 50k+ creators to build, sell, and grow their digital businesses worldwide.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition-all shadow-sm border border-gray-100 dark:border-gray-800"
                                >
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter High-Impact Card */}
                    <div className="lg:col-span-7">
                        <div className="bg-gray-900 dark:bg-primary/5 rounded-[3rem] p-10 md:p-14 relative overflow-hidden border border-gray-800 dark:border-primary/20 shadow-2xl">
                            <div className="absolute top-0 right-0 opacity-10 pointer-events-none -mr-16 -mt-16">
                                <FiSend size={240} className="text-white" />
                            </div>

                            <div className="relative z-10 space-y-8">
                                <div className="space-y-4">
                                    <span className="text-xs font-black text-primary uppercase tracking-[0.4em]">Stay Ahead</span>
                                    <h3 className="text-3xl md:text-4xl font-black text-white leading-tight">Join the Inner Circle</h3>
                                    <p className="text-gray-400 font-medium max-w-md">Get exclusive creator tips, premium assets drops, and curated marketplace trends delivered weekly.</p>
                                </div>

                                <form className="flex flex-col sm:flex-row gap-4 max-w-xl">
                                    <div className="flex-1 relative">
                                        <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="email"
                                            placeholder="Your email address"
                                            className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:border-primary transition-colors font-medium"
                                        />
                                    </div>
                                    <button className="px-10 py-5 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3">
                                        Join Us <FiArrowRight />
                                    </button>
                                </form>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                    <FiShield /> We protect your data. No spam, ever.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MAIN LINKS GRID --- */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="space-y-8">
                            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.4em] mb-8">{title}</h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all font-bold text-sm flex items-center gap-1 group"
                                        >
                                            <span className="w-0 group-hover:w-2 h-[2px] bg-primary transition-all overflow-hidden" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* --- BOTTOM BAR --- */}
                <div className="pt-12 border-t border-gray-50 dark:border-gray-900 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <p>© {currentYear} CreativeHub International. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <Link href="/terms" className="hover:text-primary">Terms</Link>
                            <Link href="/privacy" className="hover:text-primary">Privacy</Link>
                            <Link href="/cookies" className="hover:text-primary">Cookies</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"><FiGlobe /> English (US)</div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500"><FiShield /> Secure Payments</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
