// ===================================================================
// CreativeHub - Video Template Interface
// After Effects, Premiere, DaVinci, Motion Graphics Templates
// ===================================================================

import { Types } from 'mongoose';

/**
 * Video Template Types
 */
export type TVideoTemplateType =
    | 'intro'              // Intro/Opener
    | 'outro'              // Outro/End Screen
    | 'lower-third'        // Lower Thirds
    | 'title'              // Title Animations
    | 'transition'         // Transitions
    | 'slideshow'          // Slideshow Templates
    | 'logo-reveal'        // Logo Reveals
    | 'promo'              // Promo/Trailer
    | 'social-media'       // Social Media Videos
    | 'infographic'        // Infographic Videos
    | 'youtube'            // YouTube Packs
    | 'broadcast'          // Broadcast Packages
    | 'corporate'          // Corporate Videos
    | 'wedding'            // Wedding Templates
    | 'lut'                // LUTs & Color Presets
    | 'preset'             // Effect Presets
    | 'motion-element'     // Motion Graphics Elements
    | 'other';

/**
 * Software Compatibility
 */
export type TVideoSoftware =
    | 'after-effects'
    | 'premiere-pro'
    | 'davinci-resolve'
    | 'final-cut-pro'
    | 'sony-vegas'
    | 'filmora'
    | 'capcut'
    | 'motion';

export type TVideoTemplateStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
export type TLicenseType = 'personal' | 'commercial' | 'extended';

/**
 * IVideoTemplate - Main Interface
 */
export interface IVideoTemplate {
    _id?: Types.ObjectId;

    // Basic Info
    title: string;
    slug: string;
    description: string;
    shortDescription: string;

    // Seller
    seller: Types.ObjectId;

    // Categorization
    type: TVideoTemplateType;
    category: Types.ObjectId;
    subCategory?: Types.ObjectId;
    tags: string[];

    // Media
    thumbnail: string;
    previewVideo: string;           // Required for video templates
    previewImages: string[];

    // Files
    mainFile: {
        url: string;
        size: number;
        format: string;
    };
    additionalFiles?: {
        name: string;
        url: string;
        size: number;
        format: string;
    }[];

    // Technical Details
    software: TVideoSoftware[];      // Compatible software
    softwareVersion: string;         // e.g., "CC 2020+"
    resolution: {
        width: number;
        height: number;
        label: string;                 // e.g., "4K", "1080p", "720p"
    };
    frameRate: number;               // e.g., 30, 60
    duration: number;                // in seconds
    fileSize: string;                // e.g., "500MB"
    pluginsRequired?: string[];      // Required plugins
    fontsIncluded: boolean;
    musicIncluded: boolean;
    tutorialIncluded: boolean;

    // Pricing
    price: number;
    salePrice?: number;
    licenses: {
        type: TLicenseType;
        price: number;
        features: string[];
    }[];

    // Features
    features: string[];
    highlights: string[];
    whatIncluded: string[];

    // Stats
    views: number;
    downloads: number;
    sales: number;
    rating: number;
    reviewCount: number;

    // Status
    status: TVideoTemplateStatus;
    isFeatured: boolean;
    isBestSeller: boolean;
    isTrending: boolean;

    // Version Control
    version: string;
    changelog?: {
        version: string;
        date: Date;
        changes: string[];
    }[];

    // SEO
    seoTitle?: string;
    seoDescription?: string;
    seoKeywords?: string[];

    // Timestamps
    publishedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IVideoTemplateFilters {
    searchTerm?: string;
    type?: TVideoTemplateType;
    category?: string;
    seller?: string;
    status?: TVideoTemplateStatus;
    software?: TVideoSoftware;
    minPrice?: number;
    maxPrice?: number;
    resolution?: string;
    isFeatured?: boolean;
    isFree?: boolean;
}
