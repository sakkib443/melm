// ===================================================================
// CreativeHub LMS - Professional Course Seeder
// Creates a complete course with 3 modules and 10 lessons
// ===================================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models
import { Course } from '../app/modules/course/course.model';
import { Module } from '../app/modules/module/module.model';
import { Lesson } from '../app/modules/lesson/lesson.model';
import { Category } from '../app/modules/category/category.model';

const MONGO_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/creativehub';

// ==================== Course Data ====================
const courseData = {
    title: "Complete Web Development Bootcamp 2024",
    titleBn: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প ২০২৪",
    slug: "complete-web-development-bootcamp-2024",
    description: `Master web development from absolute zero to professional level. This comprehensive bootcamp covers everything you need to become a full-stack web developer.

You'll learn HTML5, CSS3, JavaScript ES6+, React.js, Node.js, Express.js, MongoDB, and much more. By the end of this course, you'll be able to build professional websites and web applications from scratch.

This course includes real-world projects, coding challenges, and a certificate of completion. Perfect for beginners who want to start a career in web development.`,
    descriptionBn: `একদম শুরু থেকে প্রফেশনাল লেভেল পর্যন্ত ওয়েব ডেভেলপমেন্ট শিখুন। এই সম্পূর্ণ বুটক্যাম্পে ফুল-স্ট্যাক ওয়েব ডেভেলপার হওয়ার জন্য যা যা দরকার সব শেখানো হবে।

আপনি শিখবেন HTML5, CSS3, JavaScript ES6+, React.js, Node.js, Express.js, MongoDB এবং আরও অনেক কিছু। কোর্স শেষে আপনি নিজে থেকে প্রফেশনাল ওয়েবসাইট ও ওয়েব অ্যাপ্লিকেশন বানাতে পারবেন।`,
    shortDescription: "Learn HTML, CSS, JavaScript, React, Node.js & MongoDB. Build 10+ real projects and become a full-stack developer.",
    shortDescriptionBn: "HTML, CSS, JavaScript, React, Node.js ও MongoDB শিখুন। ১০+ রিয়েল প্রজেক্ট বানান এবং ফুল-স্ট্যাক ডেভেলপার হন।",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    previewVideo: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    bannerImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200",
    tags: ["web development", "html", "css", "javascript", "react", "node.js", "mongodb", "full stack", "bootcamp"],
    price: 4999,
    discountPrice: 2999,
    currency: "BDT" as const,
    isFree: false,
    courseType: "recorded" as const,
    level: "beginner" as const,
    language: "bangla" as const,
    features: [
        "50+ hours of HD video content",
        "10+ real-world projects",
        "Source code access",
        "Lifetime access",
        "Certificate of completion",
        "Community support",
        "Mobile & TV access",
        "Free updates forever"
    ],
    requirements: [
        "No programming experience needed",
        "A computer with internet connection",
        "Basic computer skills",
        "Willingness to learn"
    ],
    whatYouWillLearn: [
        "Build responsive websites with HTML5 & CSS3",
        "Master JavaScript from basics to advanced",
        "Create React applications with hooks & context",
        "Build REST APIs with Node.js & Express",
        "Work with MongoDB database",
        "Deploy applications to cloud",
        "Git version control",
        "Work in a professional development environment"
    ],
    targetAudience: [
        "Complete beginners with no coding experience",
        "Self-taught programmers who want to fill gaps",
        "Anyone who wants to switch career to web development",
        "Students looking to learn practical skills"
    ],
    status: "published" as const,
    isFeatured: true,
    isPopular: true,
    totalEnrollments: 0,
    averageRating: 0,
    totalReviews: 0,
    totalViews: 0,
    likeCount: 0,
    likedBy: [],
    metaTitle: "Complete Web Development Bootcamp 2024 | Learn Full Stack Development",
    metaDescription: "Master web development with our comprehensive bootcamp. Learn HTML, CSS, JavaScript, React, Node.js, MongoDB and build real projects.",
    publishedAt: new Date()
};

// ==================== Modules Data ====================
const modulesData = [
    {
        title: "Module 1: Foundation - HTML & CSS",
        titleBn: "মডিউল ১: ফাউন্ডেশন - HTML ও CSS",
        description: "Learn the building blocks of web development. Master HTML5 semantic elements and CSS3 styling techniques.",
        order: 1,
        isPublished: true
    },
    {
        title: "Module 2: JavaScript Fundamentals",
        titleBn: "মডিউল ২: জাভাস্ক্রিপ্ট ফান্ডামেন্টালস",
        description: "Master JavaScript programming from variables to advanced concepts like async/await and DOM manipulation.",
        order: 2,
        isPublished: true
    },
    {
        title: "Module 3: React.js & Modern Frontend",
        titleBn: "মডিউল ৩: React.js ও আধুনিক ফ্রন্টএন্ড",
        description: "Build modern, reactive user interfaces with React.js, hooks, context API, and state management.",
        order: 3,
        isPublished: true
    }
];

// ==================== Lessons Data ====================
const lessonsData = [
    // Module 1 Lessons (4 lessons)
    {
        moduleIndex: 0,
        title: "Introduction to Web Development",
        titleBn: "ওয়েব ডেভেলপমেন্ট পরিচিতি",
        description: "Learn what web development is, how the internet works, and the tools you'll need.",
        videoUrl: "https://www.youtube.com/watch?v=916GWv2Qs08",
        videoDuration: 1200, // 20 minutes
        videoProvider: "youtube" as const,
        order: 1,
        isFree: true,
        isPublished: true,
        lessonType: "video" as const
    },
    {
        moduleIndex: 0,
        title: "HTML5 Basics - Structure & Elements",
        titleBn: "HTML5 বেসিকস - স্ট্রাকচার ও এলিমেন্টস",
        description: "Understand HTML document structure, tags, elements, and semantic markup.",
        videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        videoDuration: 2400, // 40 minutes
        videoProvider: "youtube" as const,
        order: 2,
        isFree: true,
        isPublished: true,
        lessonType: "video" as const
    },
    {
        moduleIndex: 0,
        title: "CSS3 Styling Fundamentals",
        titleBn: "CSS3 স্টাইলিং ফান্ডামেন্টালস",
        description: "Learn CSS selectors, properties, box model, and layout techniques.",
        videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        videoDuration: 3000, // 50 minutes
        videoProvider: "youtube" as const,
        order: 3,
        isFree: false,
        isPublished: true,
        lessonType: "video" as const
    },
    {
        moduleIndex: 0,
        title: "Flexbox & Grid Layout",
        titleBn: "ফ্লেক্সবক্স ও গ্রিড লেআউট",
        description: "Master modern CSS layout techniques with Flexbox and CSS Grid.",
        videoUrl: "https://www.youtube.com/watch?v=JJSoEo8JSnc",
        videoDuration: 2700, // 45 minutes
        videoProvider: "youtube" as const,
        order: 4,
        isFree: false,
        isPublished: true,
        lessonType: "video" as const
    },
    // Module 2 Lessons (3 lessons)
    {
        moduleIndex: 1,
        title: "JavaScript Introduction & Variables",
        titleBn: "জাভাস্ক্রিপ্ট পরিচিতি ও ভেরিয়েবল",
        description: "Start your JavaScript journey - variables, data types, and operators.",
        videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk",
        videoDuration: 2100, // 35 minutes
        videoProvider: "youtube" as const,
        order: 1,
        isFree: false,
        isPublished: true,
        lessonType: "video" as const
    },
    {
        moduleIndex: 1,
        title: "Functions & Control Flow",
        titleBn: "ফাংশন ও কন্ট্রোল ফ্লো",
        description: "Learn about functions, conditionals, loops, and program flow control.",
        videoUrl: "https://www.youtube.com/watch?v=xUI5Tsl2JpY",
        videoDuration: 2400, // 40 minutes
        videoProvider: "youtube" as const,
        order: 2,
        isFree: false,
        isPublished: true,
        lessonType: "video" as const
    },
    {
        moduleIndex: 1,
        title: "DOM Manipulation & Events",
        titleBn: "DOM ম্যানিপুলেশন ও ইভেন্টস",
        description: "Interact with web pages - select elements, modify content, handle events.",
        videoUrl: "https://www.youtube.com/watch?v=y17RuWkWdn8",
        videoDuration: 3300, // 55 minutes
        videoProvider: "youtube" as const,
        order: 3,
        isFree: false,
        isPublished: true,
        lessonType: "video" as const
    },
    // Module 3 Lessons (3 lessons)
    {
        moduleIndex: 2,
        title: "React.js Introduction & Setup",
        titleBn: "React.js পরিচিতি ও সেটআপ",
        description: "Get started with React - installation, JSX, and your first component.",
        videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
        videoDuration: 1800, // 30 minutes
        videoProvider: "youtube" as const,
        order: 1,
        isFree: false,
        isPublished: true,
        lessonType: "video" as const
    },
    {
        moduleIndex: 2,
        title: "React Components & Props",
        titleBn: "React কম্পোনেন্টস ও Props",
        description: "Build reusable components and pass data with props.",
        videoUrl: "https://www.youtube.com/watch?v=4UZrsTqkcW4",
        videoDuration: 2700, // 45 minutes
        videoProvider: "youtube" as const,
        order: 2,
        isFree: false,
        isPublished: true,
        lessonType: "video" as const
    },
    {
        moduleIndex: 2,
        title: "React Hooks - useState & useEffect",
        titleBn: "React Hooks - useState ও useEffect",
        description: "Master React hooks for state management and side effects.",
        videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0",
        videoDuration: 3600, // 60 minutes
        videoProvider: "youtube" as const,
        order: 3,
        isFree: false,
        isPublished: true,
        lessonType: "video" as const
    }
];

// ==================== Main Seeder Function ====================
async function seedCourse() {
    try {
        console.log('🚀 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find or create course category
        console.log('\n📁 Finding/Creating course category...');
        let category = await Category.findOne({ type: 'course' });
        if (!category) {
            category = await Category.create({
                name: 'Web Development',
                slug: 'web-development',
                type: 'course',
                description: 'Web development courses'
            });
            console.log('✅ Created category: Web Development');
        }

        // Create Course
        console.log('\n📚 Creating Course...');
        const course = await Course.create({
            ...courseData,
            category: category._id,
            modules: [],
            lessons: [],
            totalDuration: 0,
            totalLessons: 10,
            totalModules: 3
        });
        console.log(`✅ Course created: ${course.title}`);
        console.log(`   ID: ${course._id}`);

        // Create Modules
        console.log('\n📦 Creating Modules...');
        const createdModules: any[] = [];
        for (const moduleData of modulesData) {
            const module = await Module.create({
                ...moduleData,
                course: course._id
            });
            createdModules.push(module);
            console.log(`   ✅ Module: ${module.title}`);
        }

        // Create Lessons
        console.log('\n📖 Creating Lessons...');
        const createdLessons: any[] = [];
        let totalDuration = 0;

        for (const lessonData of lessonsData) {
            const module = createdModules[lessonData.moduleIndex];
            const lesson = await Lesson.create({
                ...lessonData,
                course: course._id,
                module: module._id
            });
            createdLessons.push(lesson);
            totalDuration += lessonData.videoDuration || 0;
            console.log(`   ✅ Lesson: ${lesson.title} (${Math.round((lessonData.videoDuration || 0) / 60)} min)`);
        }

        // Update course with module and lesson references
        console.log('\n🔄 Updating course references...');
        await Course.findByIdAndUpdate(course._id, {
            modules: createdModules.map(m => m._id),
            lessons: createdLessons.map(l => l._id),
            totalDuration: Math.round(totalDuration / 60), // Convert to minutes
            totalLessons: createdLessons.length,
            totalModules: createdModules.length
        });

        console.log('\n═══════════════════════════════════════════════════');
        console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════════════');
        console.log(`📚 Course: ${course.title}`);
        console.log(`📦 Modules: ${createdModules.length}`);
        console.log(`📖 Lessons: ${createdLessons.length}`);
        console.log(`⏱️  Total Duration: ${Math.round(totalDuration / 60)} minutes`);
        console.log(`💰 Price: ৳${course.discountPrice} (Regular: ৳${course.price})`);
        console.log('═══════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error seeding course:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n📡 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the seeder
seedCourse();
