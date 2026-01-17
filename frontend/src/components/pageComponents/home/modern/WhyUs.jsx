"use client";

import { motion } from "framer-motion";
import { FiShield, FiTrendingUp, FiAward } from "react-icons/fi";

const features = [
    { icon: FiShield, title: "Secured & Verified", desc: "Every asset and course undergoes a rigorous manual multi-step check." },
    { icon: FiTrendingUp, title: "Author Growth", desc: "Our platform powers full-time careers for thousands of authors worldwide." },
    { icon: FiAward, title: "Superior Quality", desc: "We maintain the highest standards in the industry for digital resources." }
];

export default function WhyUs() {
    return (
        <section className="section bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                <FiShield size={600} className="-mr-40 -mt-20" />
            </div>

            <div className="container px-4 relative z-10">
                <div className="max-w-4xl mx-auto flex flex-col items-center text-center space-y-12">
                    <div className="space-y-4">
                        <span className="text-xs font-black text-white/60 uppercase tracking-[0.4em]">Excellence</span>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1] text-white">Why CreativeHub?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                        {features.map((item, i) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="space-y-6"
                            >
                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                    <item.icon size={32} />
                                </div>
                                <div className="space-y-3">
                                    <h4 className="text-2xl font-black">{item.title}</h4>
                                    <p className="text-white/70 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
