// ===================================================================
// CreativeHub - Graphics Model
// MongoDB Schema for Graphics (Logo, Flyer, Banner, etc.)
// ===================================================================

import { Schema, model, Model } from 'mongoose';
import { IGraphics } from './graphics.interface';

const graphicsSchema = new Schema<IGraphics>(
    {
        // Basic Info
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        shortDescription: {
            type: String,
            maxlength: [300, 'Short description cannot exceed 300 characters'],
            default: '',
        },

        // Seller
        seller: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        // Categorization
        type: {
            type: String,
            enum: ['logo', 'flyer', 'banner', 'social-media', 'poster', 'brochure',
                'business-card', 'infographic', 'resume', 'certificate',
                'invitation', 'mockup', 'icon-set', 'illustration', 'other'],
            required: true,
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        subCategory: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        tags: [{
            type: String,
            trim: true,
        }],

        // Media
        thumbnail: {
            type: String,
            required: [true, 'Thumbnail is required'],
        },
        previewImages: [{
            type: String,
        }],
        previewVideo: {
            type: String,
        },

        // Files
        mainFile: {
            url: { type: String, required: true },
            size: { type: Number, required: true },
            format: { type: String, required: true },
        },
        additionalFiles: [{
            name: { type: String },
            url: { type: String },
            size: { type: Number },
            format: { type: String },
        }],

        // Technical Details
        fileFormats: [{
            type: String,
            enum: ['psd', 'ai', 'eps', 'svg', 'png', 'jpg', 'pdf', 'figma', 'xd', 'sketch', 'canva'],
        }],
        dimensions: {
            width: { type: Number },
            height: { type: Number },
            unit: { type: String, enum: ['px', 'in', 'cm'], default: 'px' },
        },
        dpi: {
            type: Number,
            default: 300,
        },
        colorMode: {
            type: String,
            enum: ['RGB', 'CMYK', 'Grayscale'],
            default: 'RGB',
        },
        layered: {
            type: Boolean,
            default: true,
        },
        editable: {
            type: Boolean,
            default: true,
        },

        // Compatibility
        compatibility: [{
            software: { type: String },
            version: { type: String },
        }],

        // Pricing
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        salePrice: {
            type: Number,
            min: [0, 'Sale price cannot be negative'],
        },
        licenses: [{
            type: {
                type: String,
                enum: ['personal', 'commercial', 'extended'],
            },
            price: { type: Number },
            features: [{ type: String }],
        }],

        // Features
        features: [{ type: String }],
        highlights: [{ type: String }],
        whatIncluded: [{ type: String }],

        // Stats
        views: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 },
        sales: { type: Number, default: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },

        // Status
        status: {
            type: String,
            enum: ['draft', 'pending', 'approved', 'rejected', 'published'],
            default: 'draft',
        },
        isFeatured: { type: Boolean, default: false },
        isBestSeller: { type: Boolean, default: false },
        isTrending: { type: Boolean, default: false },

        // Version Control
        version: { type: String, default: '1.0' },
        changelog: [{
            version: { type: String },
            date: { type: Date },
            changes: [{ type: String }],
        }],

        // SEO
        seoTitle: { type: String },
        seoDescription: { type: String },
        seoKeywords: [{ type: String }],

        // Timestamps
        publishedAt: { type: Date },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
graphicsSchema.index({ title: 'text', description: 'text', tags: 'text' });
graphicsSchema.index({ slug: 1 });
graphicsSchema.index({ seller: 1 });
graphicsSchema.index({ category: 1 });
graphicsSchema.index({ type: 1 });
graphicsSchema.index({ status: 1 });
graphicsSchema.index({ price: 1 });
graphicsSchema.index({ rating: -1 });
graphicsSchema.index({ sales: -1 });
graphicsSchema.index({ createdAt: -1 });

// Virtual for checking if on sale
graphicsSchema.virtual('isOnSale').get(function () {
    return this.salePrice && this.salePrice < this.price;
});

// Virtual for current price
graphicsSchema.virtual('currentPrice').get(function () {
    return this.salePrice && this.salePrice < this.price ? this.salePrice : this.price;
});

export const Graphics: Model<IGraphics> = model<IGraphics>('Graphics', graphicsSchema);
