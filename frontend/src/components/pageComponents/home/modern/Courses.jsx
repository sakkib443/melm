"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiArrowRight, FiStar, FiUsers } from "react-icons/fi";

// Top Courses Demo Data
const topCourses = [
    { id: 1, title: "Mastering Next.js & Tailwind CSS", mentor: "Alex Rivera", level: "Intermediate", price: 99, image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800", rating: 5.0, students: 1540 },
    { id: 2, title: "Advanced UI Design Principles", mentor: "Sarah Chen", level: "All Levels", price: 79, image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800", rating: 4.9, students: 2300 },
    { id: 3, title: "FullStack Mongoose Expert", mentor: "David Smith", level: "Beginner", price: 129, image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800", rating: 4.8, students: 890 },
];

export default function Courses() {
    return (
        <section className="section">
            <div className="container px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="space-y-3">
                        <span className="text-xs font-black text-accent uppercase tracking-[0.3em]">Skill Mastery</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Professional Courses</h2>
                    </div>
                    <Link href="/courses" className="px-8 py-3 bg-gray-50 dark:bg-gray-800 rounded-full text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 hover:bg-gray-100 transition-all border border-gray-100 dark:border-gray-700">View Catalog</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {topCourses.map((course, i) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-500"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute top-4 left-4 px-4 py-1.5 bg-accent text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                    {course.level}
                                </div>
                            </div>
                            <div className="p-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400"><FiUsers className="text-accent" /> {course.students} Students</div>
                                    <div className="flex items-center gap-1 text-xs font-black text-gray-900 dark:text-white"><FiStar className="text-amber-400 fill-amber-400" /> {course.rating}</div>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight group-hover:text-accent transition-colors">{course.title}</h3>
                                <div className="flex items-center gap-3 py-4 border-y border-gray-50 dark:border-gray-700">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-black text-xs text-gray-500">{course.mentor[0]}</div>
                                    <div className="text-sm font-bold text-gray-500">By <span className="text-gray-900 dark:text-white">{course.mentor}</span></div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">${course.price}</div>
                                    <Link href={`/courses/${course.id}`} className="w-12 h-12 bg-accent/10 text-accent rounded-2xl flex items-center justify-center hover:bg-accent hover:text-white transition-all">
                                        <FiArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
