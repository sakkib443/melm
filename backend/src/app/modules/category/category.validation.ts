// ===================================================================
// CreativeHub Backend - Category Validation
// Zod validation schemas for Category CRUD
// ===================================================================

import { z } from 'zod';

// All available product/category types
const categoryTypes = [
    'graphics', 'videoTemplate', 'uiKit', 'appTemplate',
    'audio', 'photo', 'font', 'course', 'website', 'software'
] as const;

/**
 * Create Category Validation
 * শুধু name required, বাকি সব optional
 */
export const createCategoryValidation = z.object({
    body: z.object({
        name: z
            .string({ required_error: 'Category name is required' })
            .min(1, 'Name is required')
            .max(100, 'Name cannot exceed 100 characters'),
        slug: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
        icon: z.string().optional(),
        image: z.string().optional(), // Any string, not just URL
        parentCategory: z.string().nullable().optional(),
        status: z.enum(['active', 'inactive']).optional().default('active'),
        type: z.enum(categoryTypes).optional().default('graphics'),
        order: z.number().optional().default(0),
        isParent: z.boolean().optional().default(true),
    }),
});

/**
 * Update Category Validation
 */
export const updateCategoryValidation = z.object({
    body: z.object({
        name: z.string().min(1).max(100).optional(),
        slug: z.string().max(100).optional(),
        description: z.string().max(500).optional(),
        icon: z.string().optional(),
        image: z.string().optional(),
        parentCategory: z.string().nullable().optional(),
        status: z.enum(['active', 'inactive']).optional(),
        type: z.enum(categoryTypes).optional(),
        order: z.number().optional(),
        isParent: z.boolean().optional(),
    }),
    params: z.object({
        id: z.string({ required_error: 'Category ID is required' }),
    }),
});

export type TCreateCategoryInput = z.infer<typeof createCategoryValidation>['body'];
export type TUpdateCategoryInput = z.infer<typeof updateCategoryValidation>['body'];

