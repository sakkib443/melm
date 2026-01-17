"use client";

import Link from "next/link";
import { FiPlay, FiTrendingUp } from "react-icons/fi";

export default function CTA() {
    return (
        <section className="section pb-32">
            <div className="container px-4">
                <div className="relative bg-gray-900 rounded-[4rem] px-8 md:px-20 py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 pointer-events-none" />
                    <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />

                    <div className="relative z-10 flex flex-col items-center text-center space-y-10 max-w-4xl mx-auto">
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[2rem] flex items-center justify-center border border-white/20">
                            <FiTrendingUp className="text-white" size={40} />
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[1] uppercase">Become A Top-Tier <br />Verified Creator</h2>
                        <p className="text-lg md:text-xl text-white/60 font-medium max-w-2xl leading-relaxed">Join 50k+ Authors who are already monetizing their passion. Our sellers earned over <span className="text-white font-black">$24M in 2025 alone</span>.</p>

                        <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
                            <Link href="/register?role=seller" className="px-12 py-5 bg-white text-gray-900 font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3">
                                <FiPlay /> Create Your Store
                            </Link>
                            <Link href="/about" className="px-12 py-5 bg-white/10 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all">
                                Learn the process
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
