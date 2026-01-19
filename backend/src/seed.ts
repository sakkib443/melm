import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Import models
import { Graphic } from './app/modules/graphic/graphic.model';
import { VideoTemplate } from './app/modules/videoTemplate/videoTemplate.model';
import { UIKit } from './app/modules/uiKit/uiKit.model';
import { AppTemplate } from './app/modules/appTemplate/appTemplate.model';
import { Audio } from './app/modules/audio/audio.model';
import { Photo } from './app/modules/photo/photo.model';
import { Font } from './app/modules/font/font.model';
import { Category } from './app/modules/category/category.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creativehub';

// Sample data for each product type
const graphicsData = [
    {
        title: "Modern Business Card Template",
        titleBn: "আধুনিক ব্যবসায়িক কার্ড টেমপ্লেট",
        description: "Professional business card design with clean and modern layout. Perfect for corporate branding.",
        descriptionBn: "পরিচ্ছন্ন এবং আধুনিক লেআউট সহ পেশাদার ব্যবসায়িক কার্ড ডিজাইন।",
        slug: "modern-business-card-template",
        price: 500,
        salePrice: 350,
        fileFormat: ["PSD", "AI", "PDF"],
        fileSize: "25 MB",
        previewImages: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800"],
        downloadLink: "https://example.com/download/business-card",
        tags: ["business-card", "corporate", "modern", "professional"],
        featured: true,
        trending: true,
        status: 'active'
    },
    {
        title: "Social Media Post Bundle",
        titleBn: "সোশ্যাল মিডিয়া পোস্ট বান্ডেল",
        description: "Complete social media graphics bundle with 50+ templates for Instagram, Facebook, and Twitter.",
        descriptionBn: "ইনস্টাগ্রাম, ফেসবুক এবং টুইটারের জন্য 50+ টেমপ্লেট সহ সম্পূর্ণ সোশ্যাল মিডিয়া গ্রাফিক্স বান্ডেল।",
        slug: "social-media-post-bundle",
        price: 1200,
        salePrice: 899,
        fileFormat: ["PSD", "CANVA"],
        fileSize: "150 MB",
        previewImages: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800"],
        downloadLink: "https://example.com/download/social-bundle",
        tags: ["social-media", "instagram", "facebook", "bundle"],
        featured: true,
        status: 'active'
    },
    {
        title: "Logo Design Kit",
        titleBn: "লোগো ডিজাইন কিট",
        description: "Professional logo design kit with 100+ elements, shapes, and icons.",
        descriptionBn: "100+ উপাদান, আকার এবং আইকন সহ পেশাদার লোগো ডিজাইন কিট।",
        slug: "logo-design-kit",
        price: 800,
        salePrice: 599,
        fileFormat: ["AI", "EPS", "SVG"],
        fileSize: "80 MB",
        previewImages: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800"],
        downloadLink: "https://example.com/download/logo-kit",
        tags: ["logo", "branding", "design-kit"],
        popular: true,
        status: 'active'
    }
];

const videoTemplatesData = [
    {
        title: "Corporate Intro Video Template",
        titleBn: "কর্পোরেট ইন্ট্রো ভিডিও টেমপ্লেট",
        description: "Professional corporate intro video template for After Effects. Fully customizable.",
        descriptionBn: "আফটার ইফেক্টসের জন্য পেশাদার কর্পোরেট ইন্ট্রো ভিডিও টেমপ্লেট। সম্পূর্ণ কাস্টমাইজযোগ্য।",
        slug: "corporate-intro-video-template",
        price: 1500,
        salePrice: 1200,
        duration: "30 seconds",
        resolution: "4K",
        software: "After Effects",
        fileFormat: ["AEP", "MP4"],
        fileSize: "250 MB",
        previewVideo: "https://example.com/preview/corporate-intro.mp4",
        previewImages: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800"],
        downloadLink: "https://example.com/download/corporate-intro",
        tags: ["corporate", "intro", "after-effects", "professional"],
        featured: true,
        status: 'active'
    },
    {
        title: "YouTube Channel Intro Pack",
        titleBn: "ইউটিউব চ্যানেল ইন্ট্রো প্যাক",
        description: "Complete YouTube intro pack with 10 different styles and animations.",
        descriptionBn: "10টি ভিন্ন স্টাইল এবং অ্যানিমেশন সহ সম্পূর্ণ ইউটিউব ইন্ট্রো প্যাক।",
        slug: "youtube-channel-intro-pack",
        price: 1000,
        salePrice: 750,
        duration: "15 seconds",
        resolution: "Full HD",
        software: "Premiere Pro",
        fileFormat: ["PRPROJ", "MP4"],
        fileSize: "180 MB",
        previewVideo: "https://example.com/preview/youtube-intro.mp4",
        previewImages: ["https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800"],
        downloadLink: "https://example.com/download/youtube-intro",
        tags: ["youtube", "intro", "premiere-pro", "channel"],
        trending: true,
        status: 'active'
    },
    {
        title: "Wedding Video Template",
        titleBn: "বিবাহের ভিডিও টেমপ্লেট",
        description: "Beautiful wedding video template with romantic effects and transitions.",
        descriptionBn: "রোমান্টিক ইফেক্ট এবং ট্রানজিশন সহ সুন্দর বিবাহের ভিডিও টেমপ্লেট।",
        slug: "wedding-video-template",
        price: 1800,
        salePrice: 1400,
        duration: "2 minutes",
        resolution: "4K",
        software: "After Effects",
        fileFormat: ["AEP"],
        fileSize: "320 MB",
        previewVideo: "https://example.com/preview/wedding.mp4",
        previewImages: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=800"],
        downloadLink: "https://example.com/download/wedding-video",
        tags: ["wedding", "romantic", "celebration"],
        popular: true,
        status: 'active'
    }
];

const uiKitsData = [
    {
        title: "Modern Dashboard UI Kit",
        titleBn: "আধুনিক ড্যাশবোর্ড UI কিট",
        description: "Complete admin dashboard UI kit with 100+ components for web applications.",
        descriptionBn: "ওয়েব অ্যাপ্লিকেশনের জন্য 100+ কম্পোনেন্ট সহ সম্পূর্ণ অ্যাডমিন ড্যাশবোর্ড UI কিট।",
        slug: "modern-dashboard-ui-kit",
        price: 2000,
        salePrice: 1500,
        componentsCount: 120,
        pages: 45,
        platform: "Web",
        designTool: "Figma",
        fileFormat: ["FIG", "SKETCH"],
        fileSize: "85 MB",
        previewImages: ["https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800"],
        downloadLink: "https://example.com/download/dashboard-kit",
        tags: ["dashboard", "admin", "ui-kit", "figma"],
        featured: true,
        trending: true,
        status: 'active'
    },
    {
        title: "E-commerce Mobile App UI",
        titleBn: "ই-কমার্স মোবাইল অ্যাপ UI",
        description: "Complete e-commerce mobile app UI kit with 80+ screens and components.",
        descriptionBn: "80+ স্ক্রিন এবং কম্পোনেন্ট সহ সম্পূর্ণ ই-কমার্স মোবাইল অ্যাপ UI কিট।",
        slug: "ecommerce-mobile-app-ui",
        price: 1800,
        salePrice: 1350,
        componentsCount: 95,
        pages: 80,
        platform: "Mobile",
        designTool: "Figma",
        fileFormat: ["FIG", "XD"],
        fileSize: "120 MB",
        previewImages: ["https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800"],
        downloadLink: "https://example.com/download/ecommerce-ui",
        tags: ["ecommerce", "mobile", "shopping", "app"],
        popular: true,
        status: 'active'
    },
    {
        title: "SaaS Landing Page UI Kit",
        titleBn: "SaaS ল্যান্ডিং পেজ UI কিট",
        description: "Modern SaaS landing page UI kit with multiple layout variations.",
        descriptionBn: "একাধিক লেআউট ভ্যারিয়েশন সহ আধুনিক SaaS ল্যান্ডিং পেজ UI কিট।",
        slug: "saas-landing-page-ui-kit",
        price: 1200,
        salePrice: 899,
        componentsCount: 60,
        pages: 25,
        platform: "Web",
        designTool: "Figma",
        fileFormat: ["FIG"],
        fileSize: "65 MB",
        previewImages: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"],
        downloadLink: "https://example.com/download/saas-landing",
        tags: ["saas", "landing-page", "web", "modern"],
        featured: true,
        status: 'active'
    }
];

const appTemplatesData = [
    {
        title: "Food Delivery App Template",
        titleBn: "খাদ্য ডেলিভারি অ্যাপ টেমপ্লেট",
        description: "Complete food delivery app template built with React Native. Ready to deploy.",
        descriptionBn: "React Native দিয়ে তৈরি সম্পূর্ণ খাদ্য ডেলিভারি অ্যাপ টেমপ্লেট। ডিপ্লয়ের জন্য প্রস্তুত।",
        slug: "food-delivery-app-template",
        price: 5000,
        salePrice: 3999,
        platform: "iOS & Android",
        technology: "React Native",
        features: ["User Auth", "Payment Gateway", "Real-time Tracking", "Push Notifications"],
        fileFormat: ["ZIP"],
        fileSize: "450 MB",
        previewImages: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800"],
        demoLink: "https://example.com/demo/food-delivery",
        downloadLink: "https://example.com/download/food-app",
        tags: ["food-delivery", "react-native", "mobile-app"],
        featured: true,
        status: 'active'
    },
    {
        title: "Fitness Tracker App",
        titleBn: "ফিটনেস ট্র্যাকার অ্যাপ",
        description: "Modern fitness tracking app with workout plans and progress monitoring.",
        descriptionBn: "ওয়ার্কআউট প্ল্যান এবং প্রগতি মনিটরিং সহ আধুনিক ফিটনেস ট্র্যাকিং অ্যাপ।",
        slug: "fitness-tracker-app",
        price: 4500,
        salePrice: 3500,
        platform: "iOS & Android",
        technology: "Flutter",
        features: ["Workout Plans", "Calorie Tracker", "Progress Charts", "Social Sharing"],
        fileFormat: ["ZIP"],
        fileSize: "380 MB",
        previewImages: ["https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800"],
        demoLink: "https://example.com/demo/fitness-tracker",
        downloadLink: "https://example.com/download/fitness-app",
        tags: ["fitness", "health", "flutter", "tracker"],
        trending: true,
        status: 'active'
    },
    {
        title: "E-learning Platform App",
        titleBn: "ই-লার্নিং প্ল্যাটফর্ম অ্যাপ",
        description: "Complete e-learning platform with courses, quizzes, and certificates.",
        descriptionBn: "কোর্স, কুইজ এবং সার্টিফিকেট সহ সম্পূর্ণ ই-লার্নিং প্ল্যাটফর্ম।",
        slug: "elearning-platform-app",
        price: 6000,
        salePrice: 4999,
        platform: "iOS & Android",
        technology: "React Native",
        features: ["Video Courses", "Quizzes", "Certificates", "Progress Tracking"],
        fileFormat: ["ZIP"],
        fileSize: "520 MB",
        previewImages: ["https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800"],
        demoLink: "https://example.com/demo/elearning",
        downloadLink: "https://example.com/download/elearning-app",
        tags: ["elearning", "education", "courses"],
        popular: true,
        status: 'active'
    }
];

const audioData = [
    {
        title: "Corporate Background Music Pack",
        titleBn: "কর্পোরেট ব্যাকগ্রাউন্ড মিউজিক প্যাক",
        description: "Professional corporate background music pack with 10 royalty-free tracks.",
        descriptionBn: "10টি রয়্যালটি-মুক্ত ট্র্যাক সহ পেশাদার কর্পোরেট ব্যাকগ্রাউন্ড মিউজিক প্যাক।",
        slug: "corporate-background-music-pack",
        price: 1500,
        salePrice: 1200,
        duration: "45 minutes total",
        format: "MP3, WAV",
        bpm: "120-140",
        mood: "Professional, Uplifting",
        fileFormat: ["MP3", "WAV"],
        fileSize: "350 MB",
        previewAudio: "https://example.com/preview/corporate-music.mp3",
        downloadLink: "https://example.com/download/corporate-music",
        tags: ["corporate", "background-music", "royalty-free"],
        featured: true,
        status: 'active'
    },
    {
        title: "YouTube Intro Music Collection",
        titleBn: "ইউটিউব ইন্ট্রো মিউজিক কালেকশন",
        description: "Energetic intro music collection perfect for YouTube videos and vlogs.",
        descriptionBn: "ইউটিউব ভিডিও এবং ভ্লগের জন্য নিখুঁত শক্তিশালী ইন্ট্রো মিউজিক কালেকশন।",
        slug: "youtube-intro-music-collection",
        price: 800,
        salePrice: 599,
        duration: "20 minutes total",
        format: "MP3, WAV",
        bpm: "140-160",
        mood: "Energetic, Upbeat",
        fileFormat: ["MP3", "WAV"],
        fileSize: "180 MB",
        previewAudio: "https://example.com/preview/youtube-intro.mp3",
        downloadLink: "https://example.com/download/youtube-music",
        tags: ["youtube", "intro", "energetic", "vlog"],
        trending: true,
        status: 'active'
    },
    {
        title: "Ambient Sound Effects Library",
        titleBn: "অ্যাম্বিয়েন্ট সাউন্ড ইফেক্ট লাইব্রেরি",
        description: "Comprehensive ambient sound effects library with 200+ sounds.",
        descriptionBn: "200+ সাউন্ড সহ ব্যাপক অ্যাম্বিয়েন্ট সাউন্ড ইফেক্ট লাইব্রেরি।",
        slug: "ambient-sound-effects-library",
        price: 2000,
        salePrice: 1599,
        duration: "90 minutes total",
        format: "WAV",
        bpm: "N/A",
        mood: "Ambient, Natural",
        fileFormat: ["WAV"],
        fileSize: "650 MB",
        previewAudio: "https://example.com/preview/ambient-sounds.mp3",
        downloadLink: "https://example.com/download/ambient-sounds",
        tags: ["ambient", "sound-effects", "nature"],
        popular: true,
        status: 'active'
    }
];

const photosData = [
    {
        title: "Business Stock Photos Bundle",
        titleBn: "ব্যবসায়িক স্টক ফটো বান্ডেল",
        description: "Premium business stock photos bundle with 100 high-resolution images.",
        descriptionBn: "100টি উচ্চ-রেজোলিউশন ছবি সহ প্রিমিয়াম ব্যবসায়িক স্টক ফটো বান্ডেল।",
        slug: "business-stock-photos-bundle",
        price: 2500,
        salePrice: 1999,
        photoCount: 100,
        resolution: "6000x4000",
        format: "JPG, RAW",
        fileFormat: ["JPG", "RAW"],
        fileSize: "1.2 GB",
        previewImages: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"],
        downloadLink: "https://example.com/download/business-photos",
        tags: ["business", "corporate", "stock-photos", "professional"],
        featured: true,
        status: 'active'
    },
    {
        title: "Nature Photography Collection",
        titleBn: "প্রকৃতি ফটোগ্রাফি কালেকশন",
        description: "Stunning nature photography collection with landscapes and wildlife.",
        descriptionBn: "ল্যান্ডস্কেপ এবং বন্যপ্রাণী সহ অসাধারণ প্রকৃতি ফটোগ্রাফি কালেকশন।",
        slug: "nature-photography-collection",
        price: 1800,
        salePrice: 1399,
        photoCount: 75,
        resolution: "5500x3700",
        format: "JPG",
        fileFormat: ["JPG"],
        fileSize: "850 MB",
        previewImages: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"],
        downloadLink: "https://example.com/download/nature-photos",
        tags: ["nature", "landscape", "wildlife", "photography"],
        trending: true,
        status: 'active'
    },
    {
        title: "Food Photography Pack",
        titleBn: "খাদ্য ফটোগ্রাফি প্যাক",
        description: "Delicious food photography pack perfect for restaurants and food blogs.",
        descriptionBn: "রেস্তোরাঁ এবং খাদ্য ব্লগের জন্য নিখুঁত সুস্বাদু খাদ্য ফটোগ্রাফি প্যাক।",
        slug: "food-photography-pack",
        price: 1500,
        salePrice: 1199,
        photoCount: 60,
        resolution: "4500x3000",
        format: "JPG",
        fileFormat: ["JPG"],
        fileSize: "600 MB",
        previewImages: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800"],
        downloadLink: "https://example.com/download/food-photos",
        tags: ["food", "culinary", "restaurant", "photography"],
        popular: true,
        status: 'active'
    }
];

const fontsData = [
    {
        title: "Modern Sans Serif Font Family",
        titleBn: "আধুনিক সান সেরিফ ফন্ট ফ্যামিলি",
        description: "Complete modern sans serif font family with 12 weights and styles.",
        descriptionBn: "12টি ওজন এবং স্টাইল সহ সম্পূর্ণ আধুনিক সান সেরিফ ফন্ট ফ্যামিলি।",
        slug: "modern-sans-serif-font-family",
        price: 1200,
        salePrice: 899,
        fontType: "Sans Serif",
        weights: ["Thin", "Light", "Regular", "Medium", "Bold", "Black"],
        styles: ["Normal", "Italic"],
        language: "Latin, Extended Latin",
        fileFormat: ["OTF", "TTF", "WOFF"],
        fileSize: "12 MB",
        previewImage: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800",
        downloadLink: "https://example.com/download/sans-serif-font",
        tags: ["sans-serif", "modern", "font-family"],
        featured: true,
        status: 'active'
    },
    {
        title: "Elegant Script Font",
        titleBn: "এলিগ্যান্ট স্ক্রিপ্ট ফন্ট",
        description: "Beautiful elegant script font perfect for wedding invitations and luxury brands.",
        descriptionBn: "বিবাহের আমন্ত্রণ এবং বিলাসবহুল ব্র্যান্ডের জন্য নিখুঁত সুন্দর এলিগ্যান্ট স্ক্রিপ্ট ফন্ট।",
        slug: "elegant-script-font",
        price: 800,
        salePrice: 599,
        fontType: "Script",
        weights: ["Regular"],
        styles: ["Normal"],
        language: "Latin",
        fileFormat: ["OTF", "TTF"],
        fileSize: "4 MB",
        previewImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
        downloadLink: "https://example.com/download/script-font",
        tags: ["script", "elegant", "wedding", "luxury"],
        trending: true,
        status: 'active'
    },
    {
        title: "Bengali Unicode Font Pack",
        titleBn: "বাংলা ইউনিকোড ফন্ট প্যাক",
        description: "Complete Bengali Unicode font pack with 5 different styles.",
        descriptionBn: "5টি ভিন্ন স্টাইল সহ সম্পূর্ণ বাংলা ইউনিকোড ফন্ট প্যাক।",
        slug: "bengali-unicode-font-pack",
        price: 1500,
        salePrice: 1199,
        fontType: "Bengali",
        weights: ["Regular", "Bold"],
        styles: ["Normal", "Italic"],
        language: "Bengali, Latin",
        fileFormat: ["OTF", "TTF"],
        fileSize: "18 MB",
        previewImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
        downloadLink: "https://example.com/download/bengali-font",
        tags: ["bengali", "unicode", "bangla", "font-pack"],
        popular: true,
        status: 'active'
    }
];

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Promise.all([
            Graphic.deleteMany({}),
            VideoTemplate.deleteMany({}),
            UIKit.deleteMany({}),
            AppTemplate.deleteMany({}),
            Audio.deleteMany({}),
            Photo.deleteMany({}),
            Font.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Insert new data
        console.log('📥 Inserting sample data...');

        const [graphics, videos, uikits, apps, audios, photos, fonts] = await Promise.all([
            Graphic.insertMany(graphicsData),
            VideoTemplate.insertMany(videoTemplatesData),
            UIKit.insertMany(uiKitsData),
            AppTemplate.insertMany(appTemplatesData),
            Audio.insertMany(audioData),
            Photo.insertMany(photosData),
            Font.insertMany(fontsData)
        ]);

        console.log('\n✅ Database seeded successfully!');
        console.log(`\n📊 Summary:`);
        console.log(`   • Graphics: ${graphics.length} items`);
        console.log(`   • Video Templates: ${videos.length} items`);
        console.log(`   • UI Kits: ${uikits.length} items`);
        console.log(`   • App Templates: ${apps.length} items`);
        console.log(`   • Audio: ${audios.length} items`);
        console.log(`   • Photos: ${photos.length} items`);
        console.log(`   • Fonts: ${fonts.length} items`);
        console.log(`\n🎉 Total: ${graphics.length + videos.length + uikits.length + apps.length + audios.length + photos.length + fonts.length} products added!`);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

// Run the seeder
seedDatabase();
