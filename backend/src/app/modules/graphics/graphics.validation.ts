// ===================================================================
// CreativeHub - Graphics Validation
// Zod validation schemas for Graphics
// ===================================================================

import { z } from 'zod';

const graphicsTypeEnum = z.enum([
    'logo', 'flyer', 'banner', 'social-media', 'poster', 'brochure',
    'business-card', 'infographic', 'resume', 'certificate',
    'invitation', 'mockup', 'icon-set', 'illustration', 'other'
]);

const fileFormatEnum = z.enum([
    'psd', 'ai', 'eps', 'svg', 'png', 'jpg', 'pdf', 'figma', 'xd', 'sketch', 'canva'
]);

const licenseTypeEnum = z.enum(['personal', 'commercial', 'extended']);

const statusEnum = z.enum(['draft', 'pending', 'approved', 'rejected', 'published']);

// Create Graphics Validation
const createGraphicsZodSchema = z.object({
    body: z.object({
        title: z.string({
            required_error: 'Title is required',
        }).min(3, 'Title must be at least 3 characters')
            .max(200, 'Title cannot exceed 200 characters'),

        description: z.string({
            required_error: 'Description is required',
        }).min(10, 'Description must be at least 10 characters'),

        shortDescription: z.string().max(300).optional(),

        type: graphicsTypeEnum,

        category: z.string({
            required_error: 'Category is required',
        }),

        subCategory: z.string().optional(),

        tags: z.array(z.string()).optional(),

        thumbnail: z.string({
            required_error: 'Thumbnail is required',
        }),

        previewImages: z.array(z.string()).optional(),

        previewVideo: z.string().optional(),

        mainFile: z.object({
            url: z.string({ required_error: 'Main file URL is required' }),
            size: z.number({ required_error: 'File size is required' }),
            format: fileFormatEnum,
        }),

        additionalFiles: z.array(z.object({
            name: z.string(),
            url: z.string(),
            size: z.number(),
            format: z.string(),
        })).optional(),

        fileFormats: z.array(fileFormatEnum).optional(),

        dimensions: z.object({
            width: z.number(),
            height: z.number(),
            unit: z.enum(['px', 'in', 'cm']).default('px'),
        }).optional(),

        dpi: z.number().optional(),

        colorMode: z.enum(['RGB', 'CMYK', 'Grayscale']).optional(),

        layered: z.boolean().optional(),

        editable: z.boolean().optional(),

        compatibility: z.array(z.object({
            software: z.string(),
            version: z.string(),
        })).optional(),

        price: z.number({
            required_error: 'Price is required',
        }).min(0, 'Price cannot be negative'),

        salePrice: z.number().min(0).optional(),

        licenses: z.array(z.object({
            type: licenseTypeEnum,
            price: z.number(),
            features: z.array(z.string()),
        })).optional(),

        features: z.array(z.string()).optional(),
        highlights: z.array(z.string()).optional(),
        whatIncluded: z.array(z.string()).optional(),

        status: statusEnum.optional(),

        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.array(z.string()).optional(),
    }),
});

// Update Graphics Validation
const updateGraphicsZodSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200).optional(),
        description: z.string().min(10).optional(),
        shortDescription: z.string().max(300).optional(),
        type: graphicsTypeEnum.optional(),
        category: z.string().optional(),
        subCategory: z.string().optional(),
        tags: z.array(z.string()).optional(),
        thumbnail: z.string().optional(),
        previewImages: z.array(z.string()).optional(),
        previewVideo: z.string().optional(),
        mainFile: z.object({
            url: z.string(),
            size: z.number(),
            format: fileFormatEnum,
        }).optional(),
        additionalFiles: z.array(z.object({
            name: z.string(),
            url: z.string(),
            size: z.number(),
            format: z.string(),
        })).optional(),
        fileFormats: z.array(fileFormatEnum).optional(),
        dimensions: z.object({
            width: z.number(),
            height: z.number(),
            unit: z.enum(['px', 'in', 'cm']),
        }).optional(),
        dpi: z.number().optional(),
        colorMode: z.enum(['RGB', 'CMYK', 'Grayscale']).optional(),
        layered: z.boolean().optional(),
        editable: z.boolean().optional(),
        compatibility: z.array(z.object({
            software: z.string(),
            version: z.string(),
        })).optional(),
        price: z.number().min(0).optional(),
        salePrice: z.number().min(0).optional(),
        licenses: z.array(z.object({
            type: licenseTypeEnum,
            price: z.number(),
            features: z.array(z.string()),
        })).optional(),
        features: z.array(z.string()).optional(),
        highlights: z.array(z.string()).optional(),
        whatIncluded: z.array(z.string()).optional(),
        status: statusEnum.optional(),
        isFeatured: z.boolean().optional(),
        version: z.string().optional(),
        seoTitle: z.string().optional(),
        seoDescription: z.string().optional(),
        seoKeywords: z.array(z.string()).optional(),
    }),
});

export const GraphicsValidation = {
    createGraphicsZodSchema,
    updateGraphicsZodSchema,
};
