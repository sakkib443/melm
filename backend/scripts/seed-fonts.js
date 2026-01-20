// Seed script to add sample fonts - uses the actual Font model from backend
const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.DATABASE_URL || 'mongodb://localhost:27017/mega-elearning';

// Use simpler schema that matches what frontend expects
const fontSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, default: 0 },
    salePrice: Number,
    category: String,  // Simple string for frontend display
    status: { type: String, default: 'published' },
    thumbnail: String,
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    fontFamily: String,
    tags: [String],
    type: { type: String, default: 'sans-serif' },
    weights: [String],
    styles: [String],
    webFont: { type: Boolean, default: true },
}, { timestamps: true, collection: 'fonts' });

// Check if model exists, if not create it
const Font = mongoose.models.Font || mongoose.model('Font', fontSchema);

const sampleFonts = [
    {
        title: "Bangla Modern Sans",
        slug: "bangla-modern-sans-" + Date.now(),
        description: "A modern sans-serif font perfect for Bangla typography projects.",
        price: 499,
        salePrice: 299,
        category: "Sans Serif",
        status: "published",
        thumbnail: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800",
        downloads: 1250,
        views: 5600,
        likes: 340,
        rating: 4.8,
        fontFamily: "Bangla Modern Sans",
        tags: ["bangla", "modern", "sans-serif"],
        type: "sans-serif",
        weights: ["regular", "bold"],
        styles: ["normal"],
        webFont: true
    },
    {
        title: "Creative Script Pro",
        slug: "creative-script-pro-" + Date.now(),
        description: "Elegant handwritten script font for wedding invitations and branding.",
        price: 699,
        salePrice: 499,
        category: "Script",
        status: "published",
        thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
        downloads: 890,
        views: 4200,
        likes: 256,
        rating: 4.9,
        fontFamily: "Creative Script Pro",
        tags: ["script", "wedding", "elegant"],
        type: "script",
        weights: ["regular"],
        styles: ["normal", "italic"],
        webFont: true
    },
    {
        title: "Display Bold XL",
        slug: "display-bold-xl-" + Date.now(),
        description: "Bold display font perfect for headlines, posters, and logos.",
        price: 399,
        salePrice: null,
        category: "Display",
        status: "published",
        thumbnail: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800",
        downloads: 2100,
        views: 8900,
        likes: 567,
        rating: 4.7,
        fontFamily: "Display Bold XL",
        tags: ["display", "bold", "headline"],
        type: "display",
        weights: ["bold", "black"],
        styles: ["normal"],
        webFont: true
    },
    {
        title: "Classic Serif Regular",
        slug: "classic-serif-regular-" + Date.now(),
        description: "Timeless serif font for books, magazines, and professional documents.",
        price: 299,
        salePrice: 199,
        category: "Serif",
        status: "published",
        thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800",
        downloads: 1567,
        views: 6700,
        likes: 423,
        rating: 4.6,
        fontFamily: "Classic Serif Regular",
        tags: ["serif", "classic", "book"],
        type: "serif",
        weights: ["regular", "medium", "bold"],
        styles: ["normal", "italic"],
        webFont: true
    },
    {
        title: "Handwritten Notes",
        slug: "handwritten-notes-" + Date.now(),
        description: "Natural handwritten font that looks like real pen writing.",
        price: 349,
        salePrice: null,
        category: "Handwritten",
        status: "published",
        thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
        downloads: 780,
        views: 3400,
        likes: 189,
        rating: 4.5,
        fontFamily: "Handwritten Notes",
        tags: ["handwritten", "natural", "notes"],
        type: "handwritten",
        weights: ["regular"],
        styles: ["normal"],
        webFont: true
    },
    {
        title: "Minimal Sans Light",
        slug: "minimal-sans-light-" + Date.now(),
        description: "Clean minimal sans-serif font for modern web and app designs.",
        price: 249,
        salePrice: 149,
        category: "Sans Serif",
        status: "published",
        thumbnail: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9?w=800",
        downloads: 3200,
        views: 12000,
        likes: 890,
        rating: 4.9,
        fontFamily: "Minimal Sans Light",
        tags: ["minimal", "sans-serif", "modern", "web"],
        type: "sans-serif",
        weights: ["light", "regular"],
        styles: ["normal"],
        webFont: true
    }
];

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Delete existing fonts first to avoid duplicates
        await mongoose.connection.db.collection('fonts').deleteMany({});
        console.log('Cleared existing fonts');

        // Insert using raw collection to bypass strict validation
        const result = await mongoose.connection.db.collection('fonts').insertMany(sampleFonts);
        console.log(`Successfully inserted ${result.insertedCount} fonts!`);

        // Verify
        const count = await mongoose.connection.db.collection('fonts').countDocuments();
        console.log(`Total fonts in database: ${count}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding fonts:', error);
        process.exit(1);
    }
}

seed();
