// ===================================================================
// CreativeHub - Graphics Interface
// Logo, Flyer, Banner, Social Media Templates
// ===================================================================

import { Types } from 'mongoose';

/**
 * Graphics Type - সব ধরনের Graphic item types
 */
export type TGraphicsType =
    | 'logo'           // Logo Templates
    | 'flyer'          // Flyer Designs
    | 'banner'         // Banner Templates
    | 'social-media'   // Social Media Templates
    | 'poster'         // Poster Designs
    | 'brochure'       // Brochure Templates
    | 'business-card'  // Business Card Templates
    | 'infographic'    // Infographic Templates
    | 'resume'         // CV/Resume Templates
    | 'certificate'    // Certificate Templates
    | 'invitation'     // Invitation Cards
    | 'mockup'         // Product Mockups
    | 'icon-set'       // Icon Packs
    | 'illustration'   // Illustrations
    | 'other';

/**
 * File Format - Graphics file formats
 */
export type TGraphicsFormat =
    | 'psd'      // Photoshop
    | 'ai'       // Illustrator
    | 'eps'      // EPS Vector
    | 'svg'      // SVG
    | 'png'      // PNG
    | 'jpg'      // JPEG
    | 'pdf'      // PDF
    | 'figma'    // Figma
    | 'xd'       // Adobe XD
    | 'sketch'   // Sketch
    | 'canva';   // Canva

/**
 * License Type
 */
export type TLicenseType = 'personal' | 'commercial' | 'extended';

/**
 * Graphics Status
 */
export type TGraphicsStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'published';

/**
 * IGraphics - Main Graphics Interface
 */
export interface IGraphics {
    _id?: Types.ObjectId;

    // Basic Info
    title: string;
    titleBn?: string;
    slug: string;
    description: string;
    descriptionBn?: string;
    shortDescription: string;
    shortDescriptionBn?: string;

    // Seller
    seller: Types.ObjectId;

    // Categorization
    type: TGraphicsType;
    category: Types.ObjectId;
    subCategory?: Types.ObjectId;
    tags: string[];

    // Media
    thumbnail: string;
    previewImages: string[];
    previewVideo?: string;

    // Files
    mainFile: {
        url: string;
        size: number;        // in bytes
        format: TGraphicsFormat;
    };
    additionalFiles?: {
        name: string;
        url: string;
        size: number;
        format: string;
    }[];

    // Technical Details
    fileFormats: TGraphicsFormat[];
    dimensions?: {
        width: number;
        height: number;
        unit: 'px' | 'in' | 'cm';
    };
    dpi?: number;
    colorMode?: 'RGB' | 'CMYK' | 'Grayscale';
    layered: boolean;
    editable: boolean;

    // Compatibility
    compatibility: {
        software: string;     // e.g., "Adobe Photoshop"
        version: string;      // e.g., "CC 2020+"
    }[];

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
    featuresBn?: string[];
    highlights: string[];
    highlightsBn?: string[];
    whatIncluded: string[];
    whatIncludedBn?: string[];

    // Stats
    views: number;
    downloads: number;
    likes: number;
    sales: number;
    rating: number;
    reviewCount: number;

    // Status
    status: TGraphicsStatus;
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

/**
 * IGraphicsFilters - Query Filters
 */
export interface IGraphicsFilters {
    searchTerm?: string;
    type?: TGraphicsType;
    category?: string;
    seller?: string;
    status?: TGraphicsStatus;
    minPrice?: number;
    maxPrice?: number;
    format?: TGraphicsFormat;
    isFeatured?: boolean;
    isFree?: boolean;
}
