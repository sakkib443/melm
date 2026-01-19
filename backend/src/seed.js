const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/creativehub';

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB Atlas\n');

        // Get existing collections
        const db = mongoose.connection.db;

        // Categories
        const categoriesCollection = db.collection('categories');
        await categoriesCollection.deleteMany({});

        const categories = await categoriesCollection.insertMany([
            {
                name: "Graphics & Design",
                nameBn: "গ্রাফিক্স এবং ডিজাইন",
                slug: "graphics-design",
                description: "Templates, logos, and graphic design resources",
                type: "graphics",
                icon: "FiImage",
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Video Templates",
                nameBn: "ভিডিও টেমপ্লেট",
                slug: "video-templates",
                description: "Professional video templates",
                type: "video-template",
                icon: "FiVideo",
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Fonts",
                nameBn: "ফন্ট",
                slug: "fonts",
                description: "Premium font collections",
                type: "font",
                icon: "FiType",
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: "Website Templates",
                nameBn: "ওয়েবসাইট টেমপ্লেট",
                slug: "website-templates",
                description: "Complete website templates",
                type: "website",
                icon: "FiGlobe",
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        console.log(`✅ Added ${categories.insertedCount} categories\n`);

        // Graphics
        const graphicsCollection = db.collection('graphics');
        await graphicsCollection.deleteMany({});

        const graphics = await graphicsCollection.insertMany([
            {
                title: "Modern Business Card Template",
                titleBn: "আধুনিক ব্যবসায়িক কার্ড টেমপ্লেট",
                description: "Professional business card design",
                slug: "modern-business-card-template",
                price: 500,
                salePrice: 350,
                fileFormat: ["PSD", "AI", "PDF"],
                fileSize: "25 MB",
                previewImages: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800"],
                tags: ["business-card", "corporate"],
                featured: true,
                trending: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Social Media Post Bundle",
                titleBn: "সোশ্যাল মিডিয়া পোস্ট বান্ডেল",
                description: "50+ social media templates",
                slug: "social-media-post-bundle",
                price: 1200,
                salePrice: 899,
                fileFormat: ["PSD", "CANVA"],
                fileSize: "150 MB",
                previewImages: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800"],
                tags: ["social-media", "instagram"],
                featured: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Logo Design Kit",
                titleBn: "লোগো ডিজাইন কিট",
                description: "100+ logo elements",
                slug: "logo-design-kit",
                price: 800,
                salePrice: 599,
                fileFormat: ["AI", "EPS", "SVG"],
                fileSize: "80 MB",
                previewImages: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800"],
                tags: ["logo", "branding"],
                popular: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        console.log(`✅ Added ${graphics.insertedCount} graphics\n`);

        // Videos
        const videosCollection = db.collection('videotemplates');
        await videosCollection.deleteMany({});

        const videos = await videosCollection.insertMany([
            {
                title: "Corporate Intro Video",
                titleBn: "কর্পোরেট ইন্ট্রো ভিডিও",
                description: "Professional corporate intro",
                slug: "corporate-intro-video",
                price: 1500,
                salePrice: 1200,
                duration: "30 seconds",
                software: "After Effects",
                fileFormat: ["AEP", "MP4"],
                fileSize: "250 MB",
                previewImages: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800"],
                tags: ["corporate", "intro"],
                featured: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "YouTube Intro Pack",
                titleBn: "ইউটিউব ইন্ট্রো প্যাক",
                description: "10 YouTube intro styles",
                slug: "youtube-intro-pack",
                price: 1000,
                salePrice: 750,
                duration: "15 seconds",
                software: "Premiere Pro",
                fileFormat: ["PRPROJ", "MP4"],
                fileSize: "180 MB",
                previewImages: ["https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800"],
                tags: ["youtube", "intro"],
                trending: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Wedding Video Template",
                titleBn: "বিবাহের ভিডিও টেমপ্লেট",
                description: "Romantic wedding video",
                slug: "wedding-video",
                price: 1800,
                salePrice: 1400,
                duration: "2 minutes",
                software: "After Effects",
                fileFormat: ["AEP"],
                fileSize: "320 MB",
                previewImages: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=800"],
                tags: ["wedding", "romantic"],
                popular: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        console.log(`✅ Added ${videos.insertedCount} video templates\n`);

        // Fonts
        const fontsCollection = db.collection('fonts');
        await fontsCollection.deleteMany({});

        const fonts = await fontsCollection.insertMany([
            {
                title: "Modern Sans Serif Font",
                titleBn: "আধুনিক সান সেরিফ ফন্ট",
                description: "12 weights and styles",
                slug: "modern-sans-serif-font",
                price: 1200,
                salePrice: 899,
                fontType: "Sans Serif",
                fileFormat: ["OTF", "TTF", "WOFF"],
                fileSize: "12 MB",
                previewImage: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800",
                tags: ["sans-serif", "modern"],
                featured: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Elegant Script Font",
                titleBn: "এলিগ্যান্ট স্ক্রিপ্ট ফন্ট",
                description: "Beautiful script font",
                slug: "elegant-script-font",
                price: 800,
                salePrice: 599,
                fontType: "Script",
                fileFormat: ["OTF", "TTF"],
                fileSize: "4 MB",
                previewImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
                tags: ["script", "elegant"],
                trending: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Bengali Unicode Font",
                titleBn: "বাংলা ইউনিকোড ফন্ট",
                description: "Complete Bengali font pack",
                slug: "bengali-unicode-font",
                price: 1500,
                salePrice: 1199,
                fontType: "Bengali",
                fileFormat: ["OTF", "TTF"],
                fileSize: "18 MB",
                previewImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
                tags: ["bengali", "unicode"],
                popular: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        console.log(`✅ Added ${fonts.insertedCount} fonts\n`);

        // Websites
        const websitesCollection = db.collection('websites');
        await websitesCollection.deleteMany({});

        const websites = await websitesCollection.insertMany([
            {
                title: "Business Website Template",
                titleBn: "ব্যবসা ওয়েবসাইট টেমপ্লেট",
                description: "Modern business website",
                slug: "business-website-template",
                price: 3000,
                salePrice: 2499,
                pages: 15,
                technology: "React, Tailwind CSS",
                fileFormat: ["ZIP"],
                fileSize: "45 MB",
                previewImages: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"],
                tags: ["business", "corporate"],
                featured: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "E-commerce Website",
                titleBn: "ই-কমার্স ওয়েবসাইট",
                description: "Complete online store",
                slug: "ecommerce-website",
                price: 5000,
                salePrice: 3999,
                pages: 25,
                technology: "Next.js, MongoDB",
                fileFormat: ["ZIP"],
                fileSize: "120 MB",
                previewImages: ["https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800"],
                tags: ["ecommerce", "shopping"],
                trending: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: "Portfolio Website",
                titleBn: "পোর্টফোলিও ওয়েবসাইট",
                description: "Creative portfolio site",
                slug: "portfolio-website",
                price: 2000,
                salePrice: 1599,
                pages: 8,
                technology: "HTML, CSS, JS",
                fileFormat: ["ZIP"],
                fileSize: "25 MB",
                previewImages: ["https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800"],
                tags: ["portfolio", "creative"],
                popular: true,
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        console.log(`✅ Added ${websites.insertedCount} website templates\n`);

        console.log('═══════════════════════════════════');
        console.log('🎉 Database seeded successfully!');
        console.log('═══════════════════════════════════');
        console.log(`📊 Summary:`);
        console.log(`   • Categories: 4`);
        console.log(`   • Graphics: 3`);
        console.log(`   • Videos: 3`);
        console.log(`   • Fonts: 3`);
        console.log(`   • Websites: 3`);
        console.log(`   • Total Products: 12`);
        console.log('═══════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
        process.exit(0);
    }
}

seedDatabase();
