"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiPlay,
    FiCheck,
    FiX,
    FiClock,
    FiRefreshCw,
    FiAlertCircle,
    FiZap,
    FiDatabase,
    FiServer,
    FiImage,
    FiVideo,
    FiLayout,
    FiSmartphone,
    FiMusic,
    FiCamera,
    FiType,
    FiBook,
    FiFolder,
    FiUsers,
    FiShoppingCart,
    FiFileText,
    FiLayers,
    FiTrash2,
    FiEdit,
    FiPlus,
    FiEye,
    FiPackage,
    FiActivity,
} from "react-icons/fi";
import {
    graphicsService,
    videoTemplateService,
    uiKitService,
    appTemplateService,
    audioService,
    photoService,
    fontService,
    courseService,
    categoryService,
} from "@/services/api";
// Note: moduleService, lessonService, liveClassService, webinarService
// require parent IDs (Course/Instructor) so they can't be tested in isolation

// ==================== TEST DATA GENERATORS ====================
// These are carefully crafted to match backend Zod validation schemas
const generateTestData = {
    graphics: () => ({
        title: `Test Graphics ${Date.now()}`,
        description: "Auto-generated test graphics for CRUD testing. This is a comprehensive test item that will be automatically deleted after the testing process is complete. Lorem ipsum dolor sit amet.",
        shortDescription: "Test graphics for automated testing",
        type: "logo", // Required enum: logo, flyer, banner, social-media, poster, etc.
        category: "67890abcdef1234567890abc", // MongoDB ObjectId format (will use existing or mock)
        tags: ["test", "auto-generated"],
        thumbnail: "https://placehold.co/800x600/7c3aed/white?text=Test+Graphics",
        previewImages: ["https://placehold.co/800x600/7c3aed/white?text=Preview"],
        mainFile: {
            url: "https://example.com/test-download.zip",
            size: 10485760, // 10MB in bytes
            format: "psd",
        },
        price: 999,
        status: "draft",
    }),
    videoTemplate: () => ({
        title: `Test Video Template ${Date.now()}`,
        description: "Auto-generated test video template for CRUD testing. This comprehensive test item includes all required fields and will be automatically cleaned up after testing is complete.",
        shortDescription: "Auto-test video template",
        type: "intro", // Required enum: intro, outro, lower-third, title, transition, etc.
        category: "67890abcdef1234567890abc",
        tags: ["test", "video"],
        thumbnail: "https://placehold.co/800x600/ec4899/white?text=Test+Video",
        previewVideo: "https://example.com/preview.mp4",
        previewImages: [],
        mainFile: {
            url: "https://example.com/test-video-template.zip",
            size: 52428800, // 50MB
            format: "aep",
        },
        software: ["after-effects"],
        softwareVersion: "CC 2020+",
        resolution: {
            width: 1920,
            height: 1080,
            label: "1080p",
        },
        frameRate: 30,
        duration: 30, // seconds
        fileSize: "50MB",
        fontsIncluded: true,
        musicIncluded: false,
        tutorialIncluded: true,
        price: 1499,
        features: ["Easy to edit", "No plugins required"],
        highlights: ["4K Ready", "Fast Render"],
        whatIncluded: ["Project file", "Tutorial"],
        status: "draft",
    }),
    uiKit: () => ({
        title: `Test UI Kit ${Date.now()}`,
        description: "Auto-generated UI kit for comprehensive CRUD testing. This test item contains all required validation fields and will be deleted after testing completes successfully.",
        shortDescription: "Test UI kit for automated testing",
        type: "dashboard", // Valid enum: dashboard, mobile-app, website, landing-page, ecommerce, saas, admin, wireframe, icon-set, component-library, design-system, other
        category: "67890abcdef1234567890abc",
        tags: ["test", "ui"],
        thumbnail: "https://placehold.co/800x600/3b82f6/white?text=Test+UIKit",
        previewImages: ["https://placehold.co/800x600/3b82f6/white?text=Preview"],
        mainFile: {
            url: "https://example.com/test-uikit.zip",
            size: 20971520, // 20MB
            format: "figma",
        },
        software: ["figma"], // Required array: figma, sketch, xd, photoshop, illustrator
        price: 1999,
        components: 50,
        screens: 25,
        responsive: true,
        darkMode: false,
        features: ["Responsive", "Dark Mode"],
        status: "draft",
    }),
    appTemplate: () => ({
        title: `Test App Template ${Date.now()}`,
        description: "Auto-generated app template for CRUD testing flow. This comprehensive test template includes all required fields and will be automatically cleaned up after testing.",
        shortDescription: "Test app template",
        type: "ecommerce", // Valid enum: ecommerce, social, food-delivery, travel, fitness, finance, education, healthcare, news, music, utility, game, chat, other
        category: "67890abcdef1234567890abc",
        tags: ["test", "app"],
        thumbnail: "https://placehold.co/800x600/06b6d4/white?text=Test+App",
        previewImages: ["https://placehold.co/800x600/06b6d4/white?text=Preview"],
        mainFile: {
            url: "https://example.com/test-app.zip",
            size: 31457280, // 30MB
            format: "zip",
        },
        framework: ["react-native"], // Required array: flutter, react-native, swift, kotlin, ionic, xamarin
        platforms: ["ios", "android"], // Required array: ios, android, web
        price: 2499,
        screens: 20,
        backendIncluded: false,
        apiDocumentation: true,
        features: ["Login", "Dashboard", "Profile"],
        status: "draft",
    }),
    audio: () => ({
        title: `Test Audio ${Date.now()}`,
        description: "Auto-generated audio file for CRUD testing. This is a demo audio track created for automated testing purposes and will be automatically removed after testing.",
        shortDescription: "Test audio for automated testing",
        type: "music", // music, sfx, loop, podcast
        category: "67890abcdef1234567890abc",
        tags: ["test", "audio"],
        thumbnail: "https://placehold.co/800x600/f59e0b/white?text=Test+Audio",
        previewAudio: "https://example.com/test-preview.mp3",
        mainFile: {
            url: "https://example.com/test-audio.zip",
            size: 5242880, // 5MB
            format: "wav",
        },
        duration: 150, // seconds
        bpm: 120,
        genre: "Electronic",
        mood: ["Upbeat", "Energetic"],
        price: 499,
        status: "draft",
    }),
    photo: () => ({
        title: `Test Photo ${Date.now()}`,
        description: "Auto-generated photo for comprehensive CRUD testing. This test image entry will be automatically deleted after the testing process completes to keep the database clean.",
        type: "photo", // Valid enum: photo, bundle, texture, pattern, background, mockup-photo, other
        category: "67890abcdef1234567890abc",
        tags: ["test", "photo"],
        thumbnail: "https://placehold.co/800x600/10b981/white?text=Test+Photo",
        previewImage: "https://placehold.co/1920x1080/10b981/white?text=Test+Photo+Preview", // Required string (not array)
        mainFile: {
            url: "https://example.com/test-photo.zip",
            size: 8388608, // 8MB
            format: "jpg",
        },
        resolution: {
            width: 1920,
            height: 1080,
        },
        orientation: "horizontal", // horizontal, vertical, square
        dpi: 300,
        format: "jpg",
        price: 299,
        status: "draft",
    }),
    font: () => ({
        title: `Test Font ${Date.now()}`,
        description: "Auto-generated font family for CRUD testing purposes. This is a test entry that will be automatically cleaned up after the testing process to maintain database integrity.",
        shortDescription: "Test font for automated testing",
        type: "display", // display, sans-serif, serif, script, monospace
        category: "67890abcdef1234567890abc",
        tags: ["test", "font"],
        thumbnail: "https://placehold.co/800x600/f43f5e/white?text=Test+Font",
        previewImages: ["https://placehold.co/800x600/f43f5e/white?text=Preview"],
        mainFile: {
            url: "https://example.com/test-font.zip",
            size: 1048576, // 1MB
            format: "otf",
        },
        fontStyles: ["Regular", "Bold", "Italic"],
        fontFormats: ["otf", "ttf", "woff", "woff2"],
        glyphs: 500,
        features: ["Multilingual", "Web Ready"],
        price: 799,
        status: "draft",
    }),
    course: () => ({
        title: `Test Course ${Date.now()}`,
        description: "Auto-generated course for comprehensive CRUD testing in the admin dashboard. This test course contains all required fields and validation data. It will be automatically deleted after the testing process is complete to maintain database cleanliness. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        shortDescription: "Test course for automated testing",
        category: "67890abcdef1234567890abc",
        tags: ["test", "course"],
        thumbnail: "https://placehold.co/800x600/6366f1/white?text=Test+Course",
        price: 4999,
        level: "beginner",
        courseType: "recorded",
        language: "bangla",
        features: ["Lifetime Access", "Certificate"],
        requirements: ["Basic computer knowledge"],
        whatYouWillLearn: ["Testing fundamentals"],
        status: "draft",
    }),
    category: () => ({
        name: `Test Category ${Date.now()}`,
        slug: `test-category-${Date.now()}`,
        description: "Auto-generated category for testing.",
        productType: "graphics",
        isActive: true,
    }),
    courseModule: () => ({
        title: `Test Module ${Date.now()}`,
        description: "Auto-generated course module for comprehensive CRUD testing. This will be automatically deleted after testing.",
        course: "67890abcdef1234567890abc", // Course ObjectId
        order: 1,
        isPublished: false,
    }),
    lesson: () => ({
        title: `Test Lesson ${Date.now()}`,
        description: "Auto-generated lesson for CRUD testing. This comprehensive test lesson will be deleted after testing.",
        module: "67890abcdef1234567890abc", // Module ObjectId
        course: "67890abcdef1234567890abc", // Course ObjectId
        type: "video", // video, text, quiz, assignment
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: 600, // 10 minutes in seconds
        order: 1,
        isFree: false,
        isPublished: false,
    }),
    liveClass: () => ({
        title: `Test Live Class ${Date.now()}`,
        description: "Auto-generated live class for CRUD testing. This will be automatically deleted after testing completes.",
        course: "67890abcdef1234567890abc",
        startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        duration: 60, // minutes
        meetingUrl: "https://zoom.us/test-meeting",
        maxParticipants: 100,
        status: "scheduled",
    }),
    webinar: () => ({
        title: `Test Webinar ${Date.now()}`,
        description: "Auto-generated webinar for CRUD testing. This comprehensive test webinar will be removed after testing.",
        startDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        endDate: new Date(Date.now() + 90000000).toISOString(), // Tomorrow + 1 hour
        duration: 60, // minutes
        meetingUrl: "https://zoom.us/test-webinar",
        thumbnail: "https://placehold.co/800x600/9333ea/white?text=Test+Webinar",
        maxRegistrations: 100,
        status: "upcoming",
        isFree: true,
        price: 0,
    }),
};

// ==================== TEST MODULE DEFINITIONS ====================
const testModules = [
    {
        id: "graphics",
        name: "Graphics",
        icon: FiImage,
        color: "from-pink-500 to-rose-500",
        service: graphicsService,
        testData: generateTestData.graphics,
        hasCRUD: true,
    },
    {
        id: "videoTemplate",
        name: "Video Templates",
        icon: FiVideo,
        color: "from-purple-500 to-indigo-500",
        service: videoTemplateService,
        testData: generateTestData.videoTemplate,
        hasCRUD: true,
    },
    {
        id: "uiKit",
        name: "UI Kits",
        icon: FiLayout,
        color: "from-blue-500 to-cyan-500",
        service: uiKitService,
        testData: generateTestData.uiKit,
        hasCRUD: true,
    },
    {
        id: "appTemplate",
        name: "App Templates",
        icon: FiSmartphone,
        color: "from-cyan-500 to-teal-500",
        service: appTemplateService,
        testData: generateTestData.appTemplate,
        hasCRUD: true,
    },
    {
        id: "audio",
        name: "Audio",
        icon: FiMusic,
        color: "from-orange-500 to-amber-500",
        service: audioService,
        testData: generateTestData.audio,
        hasCRUD: true,
    },
    {
        id: "photo",
        name: "Photos",
        icon: FiCamera,
        color: "from-emerald-500 to-green-500",
        service: photoService,
        testData: generateTestData.photo,
        hasCRUD: true,
    },
    {
        id: "font",
        name: "Fonts",
        icon: FiType,
        color: "from-rose-500 to-pink-500",
        service: fontService,
        testData: generateTestData.font,
        hasCRUD: true,
    },
    {
        id: "course",
        name: "Courses",
        icon: FiBook,
        color: "from-indigo-500 to-violet-500",
        service: courseService,
        testData: generateTestData.course,
        hasCRUD: true,
    },
    {
        id: "category",
        name: "Categories",
        icon: FiFolder,
        color: "from-amber-500 to-yellow-500",
        service: categoryService,
        testData: generateTestData.category,
        hasCRUD: true,
        useAdminMethods: true,
    },
    // Note: Course Modules, Lessons, Live Classes, Webinars are not included
    // because they require valid parent IDs (Course ID, Instructor ID) to create
    // They are tested when testing their parent entities
];

// ==================== STATUS BADGE COMPONENT ====================
const StatusBadge = ({ status, message, time }) => {
    const statusConfig = {
        idle: { icon: FiClock, color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", label: "Waiting" },
        running: { icon: FiRefreshCw, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400", label: "Testing..." },
        success: { icon: FiCheck, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400", label: "Passed" },
        error: { icon: FiX, color: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400", label: "Failed" },
        skipped: { icon: FiAlertCircle, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400", label: "Skipped" },
    };

    const config = statusConfig[status] || statusConfig.idle;
    const Icon = config.icon;

    return (
        <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                <Icon size={12} className={status === "running" ? "animate-spin" : ""} />
                {config.label}
            </span>
            {time && status === "success" && (
                <span className="text-xs text-gray-400">{time}ms</span>
            )}
        </div>
    );
};

// ==================== TEST RESULT ROW ====================
const TestResultRow = ({ operation, icon: Icon, status, time, message }) => (
    <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-2">
            <Icon size={14} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{operation}</span>
        </div>
        <div className="flex items-center gap-2">
            <StatusBadge status={status} time={time} />
            {message && status === "error" && (
                <span className="text-xs text-red-500 max-w-[200px] truncate" title={message}>
                    {message}
                </span>
            )}
        </div>
    </div>
);

// ==================== MODULE TEST CARD ====================
const ModuleTestCard = ({ module, onRunTest, results, isRunning }) => {
    const Icon = module.icon;
    const operations = ["read", "create", "update", "delete"];

    const getOverallStatus = () => {
        if (!results) return "idle";
        if (Object.values(results).some(r => r?.status === "running")) return "running";
        if (Object.values(results).every(r => r?.status === "success")) return "success";
        if (Object.values(results).some(r => r?.status === "error")) return "error";
        return "idle";
    };

    const overallStatus = getOverallStatus();
    const passedCount = Object.values(results || {}).filter(r => r?.status === "success").length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden"
        >
            {/* Header */}
            <div className={`p-4 bg-gradient-to-r ${module.color} text-white`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                            <Icon size={20} />
                        </div>
                        <div>
                            <h3 className="font-semibold">{module.name}</h3>
                            <p className="text-xs text-white/70">CRUD Operations Test</p>
                        </div>
                    </div>
                    <button
                        onClick={() => onRunTest(module)}
                        disabled={isRunning}
                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                        {isRunning ? (
                            <>
                                <FiRefreshCw size={14} className="animate-spin" />
                                Testing...
                            </>
                        ) : (
                            <>
                                <FiPlay size={14} />
                                Run Test
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Test Results */}
            <div className="p-4 space-y-2">
                <TestResultRow
                    operation="Read (GET)"
                    icon={FiEye}
                    status={results?.read?.status || "idle"}
                    time={results?.read?.time}
                    message={results?.read?.message}
                />
                <TestResultRow
                    operation="Create (POST)"
                    icon={FiPlus}
                    status={results?.create?.status || "idle"}
                    time={results?.create?.time}
                    message={results?.create?.message}
                />
                <TestResultRow
                    operation="Update (PATCH)"
                    icon={FiEdit}
                    status={results?.update?.status || "idle"}
                    time={results?.update?.time}
                    message={results?.update?.message}
                />
                <TestResultRow
                    operation="Delete (DELETE)"
                    icon={FiTrash2}
                    status={results?.delete?.status || "idle"}
                    time={results?.delete?.time}
                    message={results?.delete?.message}
                />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                        {passedCount}/4 tests passed
                    </span>
                    {overallStatus === "success" && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <FiCheck size={14} /> All Passed
                        </span>
                    )}
                    {overallStatus === "error" && (
                        <span className="text-red-500 font-semibold flex items-center gap-1">
                            <FiX size={14} /> Some Failed
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ==================== MAIN TEST SUITE PAGE ====================
export default function TestSuitePage() {
    const [testResults, setTestResults] = useState({});
    const [runningModules, setRunningModules] = useState(new Set());
    const [isRunningAll, setIsRunningAll] = useState(false);
    const [testLog, setTestLog] = useState([]);

    const addLog = (message, type = "info") => {
        const timestamp = new Date().toLocaleTimeString();
        setTestLog(prev => [...prev, { message, type, timestamp }]);
    };

    const runModuleTest = useCallback(async (module) => {
        const moduleId = module.id;
        setRunningModules(prev => new Set([...prev, moduleId]));

        const updateResult = (operation, status, time = null, message = null) => {
            setTestResults(prev => ({
                ...prev,
                [moduleId]: {
                    ...prev[moduleId],
                    [operation]: { status, time, message }
                }
            }));
        };

        let createdId = null;

        try {
            // 1. READ TEST
            addLog(`[${module.name}] Testing READ...`, "info");
            updateResult("read", "running");
            const readStart = Date.now();
            try {
                if (module.useAdminMethods) {
                    await module.service.getAllAdmin();
                } else {
                    await module.service.getAll();
                }
                updateResult("read", "success", Date.now() - readStart);
                addLog(`[${module.name}] READ passed in ${Date.now() - readStart}ms`, "success");
            } catch (err) {
                updateResult("read", "error", null, err.message);
                addLog(`[${module.name}] READ failed: ${err.message}`, "error");
            }

            // 2. CREATE TEST
            addLog(`[${module.name}] Testing CREATE...`, "info");
            updateResult("create", "running");
            const createStart = Date.now();
            try {
                const testData = module.testData();
                const createResponse = await module.service.create(testData);
                createdId = createResponse?.data?._id || createResponse?.data?.id || createResponse?._id || createResponse?.id;
                updateResult("create", "success", Date.now() - createStart);
                addLog(`[${module.name}] CREATE passed in ${Date.now() - createStart}ms (ID: ${createdId})`, "success");
            } catch (err) {
                updateResult("create", "error", null, err.message);
                addLog(`[${module.name}] CREATE failed: ${err.message}`, "error");
            }

            // 3. UPDATE TEST (only if create succeeded)
            if (createdId) {
                addLog(`[${module.name}] Testing UPDATE...`, "info");
                updateResult("update", "running");
                const updateStart = Date.now();
                try {
                    await module.service.update(createdId, { title: `Updated Test ${Date.now()}` });
                    updateResult("update", "success", Date.now() - updateStart);
                    addLog(`[${module.name}] UPDATE passed in ${Date.now() - updateStart}ms`, "success");
                } catch (err) {
                    updateResult("update", "error", null, err.message);
                    addLog(`[${module.name}] UPDATE failed: ${err.message}`, "error");
                }

                // 4. DELETE TEST
                addLog(`[${module.name}] Testing DELETE...`, "info");
                updateResult("delete", "running");
                const deleteStart = Date.now();
                try {
                    await module.service.delete(createdId);
                    updateResult("delete", "success", Date.now() - deleteStart);
                    addLog(`[${module.name}] DELETE passed in ${Date.now() - deleteStart}ms`, "success");
                } catch (err) {
                    updateResult("delete", "error", null, err.message);
                    addLog(`[${module.name}] DELETE failed: ${err.message}`, "error");
                }
            } else {
                updateResult("update", "skipped", null, "Create failed, skipping update");
                updateResult("delete", "skipped", null, "Create failed, skipping delete");
            }

        } catch (err) {
            addLog(`[${module.name}] Unexpected error: ${err.message}`, "error");
        }

        setRunningModules(prev => {
            const next = new Set(prev);
            next.delete(moduleId);
            return next;
        });
    }, []);

    const runAllTests = async () => {
        setIsRunningAll(true);
        setTestLog([]);
        addLog("Starting all module tests...", "info");

        for (const module of testModules) {
            await runModuleTest(module);
            // Small delay between modules
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        addLog("All tests completed!", "success");
        setIsRunningAll(false);
    };

    const clearResults = () => {
        setTestResults({});
        setTestLog([]);
    };

    // Stats calculation
    const totalTests = testModules.length * 4;
    const passedTests = Object.values(testResults).reduce((acc, module) => {
        return acc + Object.values(module || {}).filter(r => r?.status === "success").length;
    }, 0);
    const failedTests = Object.values(testResults).reduce((acc, module) => {
        return acc + Object.values(module || {}).filter(r => r?.status === "error").length;
    }, 0);

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="card p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FiActivity className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                🧪 CRUD Test Suite
                            </h1>
                            <p className="text-sm text-gray-500">
                                Automated testing for all API endpoints • Create, Read, Update, Delete
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearResults}
                            className="btn btn-ghost flex items-center gap-2"
                            disabled={isRunningAll}
                        >
                            <FiTrash2 size={16} />
                            Clear
                        </button>
                        <button
                            onClick={runAllTests}
                            disabled={isRunningAll}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            {isRunningAll ? (
                                <>
                                    <FiRefreshCw size={16} className="animate-spin" />
                                    Running Tests...
                                </>
                            ) : (
                                <>
                                    <FiZap size={16} />
                                    Run All Tests
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{testModules.length}</p>
                        <p className="text-xs text-gray-500">Modules</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTests}</p>
                        <p className="text-xs text-gray-500">Total Tests</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{passedTests}</p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">Passed</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{failedTests}</p>
                        <p className="text-xs text-red-600 dark:text-red-400">Failed</p>
                    </div>
                </div>

                {/* Progress Bar */}
                {isRunningAll && (
                    <div className="mt-4">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${((passedTests + failedTests) / totalTests) * 100}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Test Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {testModules.map((module, index) => (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <ModuleTestCard
                            module={module}
                            onRunTest={runModuleTest}
                            results={testResults[module.id]}
                            isRunning={runningModules.has(module.id)}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Test Log */}
            {testLog.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FiFileText className="text-gray-500" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">Test Log</h3>
                        </div>
                        <span className="text-xs text-gray-400">{testLog.length} entries</span>
                    </div>
                    <div className="p-4 max-h-[300px] overflow-y-auto font-mono text-xs space-y-1 bg-gray-900 text-gray-100">
                        {testLog.map((log, i) => (
                            <div
                                key={i}
                                className={`${log.type === "success" ? "text-emerald-400" :
                                    log.type === "error" ? "text-red-400" :
                                        "text-gray-400"
                                    }`}
                            >
                                <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Info Section */}
            <div className="card p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                    <FiAlertCircle className="text-blue-500 mt-0.5" size={20} />
                    <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">How it works</h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>• <strong>Read:</strong> Fetches all items from the API to verify GET endpoint</li>
                            <li>• <strong>Create:</strong> Creates a test item with auto-generated data</li>
                            <li>• <strong>Update:</strong> Updates the created test item</li>
                            <li>• <strong>Delete:</strong> Deletes the test item (keeps your DB clean!)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
