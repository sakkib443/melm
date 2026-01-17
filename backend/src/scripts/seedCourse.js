// ===================================================================
// CreativeHub LMS - Course Seeder (Simple JS Version)
// Run: node src/scripts/seedCourse.js
// ===================================================================

const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://melm:melm@cluster0.b5kfivm.mongodb.net/melmDB?appName=Cluster0';

// ==================== Schemas ====================
const categorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    type: String,
    description: String,
    status: { type: String, default: 'active' }
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
    title: String,
    titleBn: String,
    slug: { type: String, unique: true },
    description: String,
    descriptionBn: String,
    shortDescription: String,
    shortDescriptionBn: String,
    thumbnail: String,
    previewVideo: String,
    bannerImage: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tags: [String],
    price: Number,
    discountPrice: Number,
    currency: { type: String, default: 'BDT' },
    isFree: { type: Boolean, default: false },
    courseType: { type: String, default: 'recorded' },
    level: { type: String, default: 'beginner' },
    language: { type: String, default: 'bangla' },
    totalDuration: { type: Number, default: 0 },
    totalLessons: { type: Number, default: 0 },
    totalModules: { type: Number, default: 0 },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Module' }],
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    features: [String],
    requirements: [String],
    whatYouWillLearn: [String],
    targetAudience: [String],
    status: { type: String, default: 'published' },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    totalEnrollments: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId }],
    metaTitle: String,
    metaDescription: String,
    publishedAt: Date
}, { timestamps: true });

const moduleSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: String,
    titleBn: String,
    description: String,
    order: Number,
    isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const lessonSchema = new mongoose.Schema({
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
    title: String,
    titleBn: String,
    description: String,
    videoUrl: String,
    videoDuration: Number,
    videoProvider: { type: String, default: 'youtube' },
    order: Number,
    isFree: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    lessonType: { type: String, default: 'video' }
}, { timestamps: true });

// ==================== Models ====================
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
const Module = mongoose.models.Module || mongoose.model('Module', moduleSchema);
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);

// ==================== Course Data ====================
const courseData = {
    title: "Complete Web Development Bootcamp 2024",
    titleBn: "সম্পূর্ণ ওয়েব ডেভেলপমেন্ট বুটক্যাম্প ২০২৪",
    slug: "complete-web-development-bootcamp-2024",
    description: `Master web development from absolute zero to professional level. This comprehensive bootcamp covers everything you need to become a full-stack web developer.

You'll learn HTML5, CSS3, JavaScript ES6+, React.js, Node.js, Express.js, MongoDB, and much more. By the end of this course, you'll be able to build professional websites and web applications from scratch.

This course includes real-world projects, coding challenges, and a certificate of completion. Perfect for beginners who want to start a career in web development.`,
    descriptionBn: `একদম শুরু থেকে প্রফেশনাল লেভেল পর্যন্ত ওয়েব ডেভেলপমেন্ট শিখুন। এই সম্পূর্ণ বুটক্যাম্পে ফুল-স্ট্যাক ওয়েব ডেভেলপার হওয়ার জন্য যা যা দরকার সব শেখানো হবে।`,
    shortDescription: "Learn HTML, CSS, JavaScript, React, Node.js & MongoDB. Build 10+ real projects and become a full-stack developer.",
    shortDescriptionBn: "HTML, CSS, JavaScript, React, Node.js ও MongoDB শিখুন। ১০+ রিয়েল প্রজেক্ট বানান।",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    previewVideo: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
    bannerImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200",
    tags: ["web development", "html", "css", "javascript", "react", "node.js", "mongodb", "full stack"],
    price: 4999,
    discountPrice: 2999,
    currency: "BDT",
    isFree: false,
    courseType: "recorded",
    level: "beginner",
    // language field removed - will use schema default
    features: [
        "50+ hours of HD video content",
        "10+ real-world projects",
        "Source code access",
        "Lifetime access",
        "Certificate of completion",
        "Community support"
    ],
    requirements: [
        "No programming experience needed",
        "A computer with internet connection",
        "Basic computer skills"
    ],
    whatYouWillLearn: [
        "Build responsive websites with HTML5 & CSS3",
        "Master JavaScript from basics to advanced",
        "Create React applications with hooks",
        "Build REST APIs with Node.js & Express",
        "Work with MongoDB database",
        "Deploy applications to cloud"
    ],
    targetAudience: [
        "Complete beginners",
        "Self-taught programmers",
        "Career changers"
    ],
    status: "published",
    isFeatured: true,
    isPopular: true,
    metaTitle: "Complete Web Development Bootcamp 2024",
    metaDescription: "Master web development with our comprehensive bootcamp.",
    publishedAt: new Date()
};

// ==================== Modules Data ====================
const modulesData = [
    {
        title: "Module 1: Foundation - HTML & CSS",
        titleBn: "মডিউল ১: ফাউন্ডেশন - HTML ও CSS",
        description: "Learn the building blocks of web development.",
        order: 1,
        isPublished: true
    },
    {
        title: "Module 2: JavaScript Fundamentals",
        titleBn: "মডিউল ২: জাভাস্ক্রিপ্ট ফান্ডামেন্টালস",
        description: "Master JavaScript programming.",
        order: 2,
        isPublished: true
    },
    {
        title: "Module 3: React.js & Modern Frontend",
        titleBn: "মডিউল ৩: React.js ও আধুনিক ফ্রন্টএন্ড",
        description: "Build modern UI with React.js.",
        order: 3,
        isPublished: true
    }
];

// ==================== Lessons Data ====================
const lessonsData = [
    // Module 1 - 4 lessons
    { moduleIndex: 0, title: "Introduction to Web Development", titleBn: "ওয়েব ডেভেলপমেন্ট পরিচিতি", description: "Learn what web development is.", videoUrl: "https://www.youtube.com/watch?v=916GWv2Qs08", videoDuration: 1200, order: 1, isFree: true },
    { moduleIndex: 0, title: "HTML5 Basics - Structure & Elements", titleBn: "HTML5 বেসিকস", description: "Understand HTML structure.", videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE", videoDuration: 2400, order: 2, isFree: true },
    { moduleIndex: 0, title: "CSS3 Styling Fundamentals", titleBn: "CSS3 স্টাইলিং", description: "Learn CSS selectors and properties.", videoUrl: "https://www.youtube.com/watch?v=1Rs2ND1ryYc", videoDuration: 3000, order: 3, isFree: false },
    { moduleIndex: 0, title: "Flexbox & Grid Layout", titleBn: "ফ্লেক্সবক্স ও গ্রিড লেআউট", description: "Master modern CSS layouts.", videoUrl: "https://www.youtube.com/watch?v=JJSoEo8JSnc", videoDuration: 2700, order: 4, isFree: false },

    // Module 2 - 3 lessons
    { moduleIndex: 1, title: "JavaScript Introduction & Variables", titleBn: "জাভাস্ক্রিপ্ট পরিচিতি", description: "Start JavaScript journey.", videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk", videoDuration: 2100, order: 1, isFree: false },
    { moduleIndex: 1, title: "Functions & Control Flow", titleBn: "ফাংশন ও কন্ট্রোল ফ্লো", description: "Learn functions and loops.", videoUrl: "https://www.youtube.com/watch?v=xUI5Tsl2JpY", videoDuration: 2400, order: 2, isFree: false },
    { moduleIndex: 1, title: "DOM Manipulation & Events", titleBn: "DOM ম্যানিপুলেশন", description: "Interact with web pages.", videoUrl: "https://www.youtube.com/watch?v=y17RuWkWdn8", videoDuration: 3300, order: 3, isFree: false },

    // Module 3 - 3 lessons
    { moduleIndex: 2, title: "React.js Introduction & Setup", titleBn: "React.js পরিচিতি", description: "Get started with React.", videoUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0", videoDuration: 1800, order: 1, isFree: false },
    { moduleIndex: 2, title: "React Components & Props", titleBn: "React কম্পোনেন্টস", description: "Build reusable components.", videoUrl: "https://www.youtube.com/watch?v=4UZrsTqkcW4", videoDuration: 2700, order: 2, isFree: false },
    { moduleIndex: 2, title: "React Hooks - useState & useEffect", titleBn: "React Hooks", description: "Master React hooks.", videoUrl: "https://www.youtube.com/watch?v=O6P86uwfdR0", videoDuration: 3600, order: 3, isFree: false }
];

// ==================== Main Seeder ====================
async function seedCourse() {
    try {
        console.log('🚀 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find or create category
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
        } else {
            console.log('✅ Found category:', category.name);
        }

        // Check if course already exists
        const existingCourse = await Course.findOne({ slug: courseData.slug });
        if (existingCourse) {
            console.log('⚠️  Course already exists! Deleting old data...');
            // Delete associated lessons and modules
            await Lesson.deleteMany({ course: existingCourse._id });
            await Module.deleteMany({ course: existingCourse._id });
            await Course.deleteOne({ _id: existingCourse._id });
            console.log('✅ Deleted old course data');
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
        console.log('✅ Course created:', course.title);
        console.log('   ID:', course._id.toString());

        // Create Modules
        console.log('\n📦 Creating Modules...');
        const createdModules = [];
        for (const moduleData of modulesData) {
            const module = await Module.create({
                ...moduleData,
                course: course._id
            });
            createdModules.push(module);
            console.log('   ✅', module.title);
        }

        // Create Lessons
        console.log('\n📖 Creating Lessons...');
        const createdLessons = [];
        let totalDuration = 0;

        for (const lessonData of lessonsData) {
            const module = createdModules[lessonData.moduleIndex];
            const lesson = await Lesson.create({
                ...lessonData,
                course: course._id,
                module: module._id,
                videoProvider: 'youtube',
                lessonType: 'video',
                isPublished: true
            });
            createdLessons.push(lesson);
            totalDuration += lessonData.videoDuration || 0;
            console.log('   ✅', lesson.title, `(${Math.round(lessonData.videoDuration / 60)} min)`);
        }

        // Update course references
        console.log('\n🔄 Updating course references...');
        await Course.findByIdAndUpdate(course._id, {
            modules: createdModules.map(m => m._id),
            lessons: createdLessons.map(l => l._id),
            totalDuration: Math.round(totalDuration / 60),
            totalLessons: createdLessons.length,
            totalModules: createdModules.length
        });

        console.log('\n═══════════════════════════════════════════════════');
        console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════════════');
        console.log('📚 Course:', course.title);
        console.log('📦 Modules:', createdModules.length);
        console.log('📖 Lessons:', createdLessons.length);
        console.log('⏱️  Total Duration:', Math.round(totalDuration / 60), 'minutes');
        console.log('💰 Price: ৳' + course.discountPrice, '(Regular: ৳' + course.price + ')');
        console.log('═══════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n📡 Disconnected from MongoDB');
        process.exit(0);
    }
}

seedCourse();
