"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiMinimize,
    FiChevronLeft, FiChevronRight, FiMenu, FiX, FiCheck, FiLock,
    FiBook, FiClock, FiDownload, FiMessageCircle, FiSettings,
    FiChevronDown, FiChevronUp, FiArrowLeft, FiCheckCircle
} from "react-icons/fi";
import { useLanguage } from "@/context/LanguageContext";
import toast from "react-hot-toast";

// Mock course data
const mockCourse = {
    _id: "1",
    title: "Complete Web Development Bootcamp 2024",
    modules: [
        {
            _id: "m1",
            title: "Getting Started",
            lessons: [
                { _id: "l1", title: "Welcome to the Course", duration: "5:30", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", completed: true },
                { _id: "l2", title: "How to Get Help", duration: "3:45", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", completed: true },
                { _id: "l3", title: "Course Resources", duration: "8:20", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", completed: false },
            ]
        },
        {
            _id: "m2",
            title: "HTML Fundamentals",
            lessons: [
                { _id: "l4", title: "Introduction to HTML", duration: "12:30", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", completed: false },
                { _id: "l5", title: "HTML Document Structure", duration: "15:45", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", completed: false },
                { _id: "l6", title: "Working with Tags", duration: "18:20", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", completed: false },
            ]
        },
        {
            _id: "m3",
            title: "CSS Styling",
            lessons: [
                { _id: "l7", title: "CSS Basics", duration: "14:30", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", completed: false },
                { _id: "l8", title: "Selectors and Properties", duration: "20:15", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4", completed: false },
            ]
        }
    ]
};

export default function CourseLearningPage() {
    const params = useParams();
    const router = useRouter();
    const { language } = useLanguage();
    const videoRef = useRef(null);

    const [course, setCourse] = useState(mockCourse);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [expandedModules, setExpandedModules] = useState(["m1"]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Flatten all lessons
    const allLessons = course.modules.flatMap(m => m.lessons);

    useEffect(() => {
        // Set first incomplete or first lesson as current
        const firstIncomplete = allLessons.find(l => !l.completed);
        setCurrentLesson(firstIncomplete || allLessons[0]);
    }, []);

    const currentIndex = allLessons.findIndex(l => l._id === currentLesson?._id);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < allLessons.length - 1;

    const goToLesson = (lesson) => {
        setCurrentLesson(lesson);
        setIsPlaying(false);
        setProgress(0);
    };

    const goToPrev = () => hasPrev && goToLesson(allLessons[currentIndex - 1]);
    const goToNext = () => hasNext && goToLesson(allLessons[currentIndex + 1]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const dur = videoRef.current.duration;
            setCurrentTime(current);
            setDuration(dur);
            setProgress((current / dur) * 100);
        }
    };

    const handleSeek = (e) => {
        if (videoRef.current) {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = percent * videoRef.current.duration;
        }
    };

    const markComplete = () => {
        toast.success(language === 'bn' ? 'লেসন সম্পূর্ণ!' : 'Lesson completed!');
        if (hasNext) goToNext();
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const completedCount = allLessons.filter(l => l.completed).length;
    const progressPercent = Math.round((completedCount / allLessons.length) * 100);

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">
            {/* Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.aside
                        initial={{ x: -320 }}
                        animate={{ x: 0 }}
                        exit={{ x: -320 }}
                        className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col h-screen fixed lg:relative z-40"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <Link href={`/courses/${params.slug}`} className="flex items-center gap-2 text-gray-400 hover:text-white">
                                    <FiArrowLeft className="w-4 h-4" />
                                    <span className="text-sm">{language === 'bn' ? 'কোর্সে ফিরুন' : 'Back'}</span>
                                </Link>
                                <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2">
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <h2 className="font-bold text-lg line-clamp-2">{course.title}</h2>
                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>{progressPercent}% {language === 'bn' ? 'সম্পূর্ণ' : 'Complete'}</span>
                                    <span>{completedCount}/{allLessons.length}</span>
                                </div>
                                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                                </div>
                            </div>
                        </div>

                        {/* Modules */}
                        <div className="flex-1 overflow-y-auto">
                            {course.modules.map((module) => (
                                <div key={module._id} className="border-b border-gray-800">
                                    <button
                                        onClick={() => setExpandedModules(prev =>
                                            prev.includes(module._id)
                                                ? prev.filter(id => id !== module._id)
                                                : [...prev, module._id]
                                        )}
                                        className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50"
                                    >
                                        <div className="text-left">
                                            <h3 className="font-medium text-sm">{module.title}</h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {module.lessons.filter(l => l.completed).length}/{module.lessons.length} {language === 'bn' ? 'লেসন' : 'lessons'}
                                            </p>
                                        </div>
                                        {expandedModules.includes(module._id) ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                                    </button>

                                    <AnimatePresence>
                                        {expandedModules.includes(module._id) && (
                                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                                {module.lessons.map((lesson) => (
                                                    <button
                                                        key={lesson._id}
                                                        onClick={() => goToLesson(lesson)}
                                                        className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-800/50 transition-colors ${currentLesson?._id === lesson._id ? 'bg-primary/10 border-l-2 border-primary' : ''
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${lesson.completed ? 'bg-green-500' : 'border border-gray-600'
                                                            }`}>
                                                            {lesson.completed && <FiCheck className="w-3 h-3" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm truncate ${currentLesson?._id === lesson._id ? 'text-primary font-medium' : ''}`}>
                                                                {lesson.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                                <FiPlay className="w-3 h-3" /> {lesson.duration}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen">
                {/* Top Bar */}
                <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-800 rounded-lg">
                                <FiMenu className="w-5 h-5" />
                            </button>
                        )}
                        <span className="text-sm text-gray-400 truncate max-w-[200px] sm:max-w-none">
                            {currentLesson?.title}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button disabled={!hasPrev} onClick={goToPrev} className="p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50">
                            <FiChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-gray-400">{currentIndex + 1}/{allLessons.length}</span>
                        <button disabled={!hasNext} onClick={goToNext} className="p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50">
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Video Player */}
                <div className="flex-1 bg-black flex items-center justify-center relative group">
                    <video
                        ref={videoRef}
                        src={currentLesson?.videoUrl}
                        className="w-full h-full object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={markComplete}
                        onClick={togglePlay}
                    />

                    {/* Play Overlay */}
                    {!isPlaying && (
                        <button onClick={togglePlay} className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                                <FiPlay className="w-8 h-8 text-black ml-1" />
                            </div>
                        </button>
                    )}

                    {/* Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Progress Bar */}
                        <div className="h-1 bg-gray-600 rounded-full cursor-pointer mb-4" onClick={handleSeek}>
                            <div className="h-full bg-primary rounded-full relative" style={{ width: `${progress}%` }}>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button onClick={togglePlay} className="hover:text-primary">
                                    {isPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
                                </button>
                                <button disabled={!hasPrev} onClick={goToPrev} className="hover:text-primary disabled:opacity-50">
                                    <FiChevronLeft className="w-5 h-5" />
                                </button>
                                <button disabled={!hasNext} onClick={goToNext} className="hover:text-primary disabled:opacity-50">
                                    <FiChevronRight className="w-5 h-5" />
                                </button>
                                <button onClick={toggleMute} className="hover:text-primary">
                                    {isMuted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
                                </button>
                                <span className="text-sm">{formatTime(currentTime)} / {formatTime(duration || 0)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={markComplete} className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600">
                                    <FiCheckCircle className="w-4 h-4" />
                                    {language === 'bn' ? 'সম্পূর্ণ' : 'Complete'}
                                </button>
                                <button onClick={toggleFullscreen} className="hover:text-primary">
                                    {isFullscreen ? <FiMinimize className="w-5 h-5" /> : <FiMaximize className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
