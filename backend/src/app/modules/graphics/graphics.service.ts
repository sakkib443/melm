// ===================================================================
// CreativeHub - Graphics Service
// Business logic for Graphics CRUD operations
// ===================================================================

import { Types } from 'mongoose';
import { Graphics } from './graphics.model';
import { IGraphics, IGraphicsFilters } from './graphics.interface';
import AppError from '../../utils/AppError';

// Helper to generate slug from title
const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        + '-' + Date.now().toString(36);
};

/**
 * Create a new graphics item
 */
const createGraphics = async (
    sellerId: string,
    payload: Partial<IGraphics>
): Promise<IGraphics> => {
    // Generate slug from title
    payload.slug = generateSlug(payload.title!);
    payload.seller = new Types.ObjectId(sellerId);

    const result = await Graphics.create(payload);
    return result;
};

/**
 * Get all graphics with filters and pagination
 */
const getAllGraphics = async (
    filters: IGraphicsFilters,
    paginationOptions: { page?: number; limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' }
) => {
    const { searchTerm, type, category, seller, status, minPrice, maxPrice, format, isFeatured, isFree } = filters;
    const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = paginationOptions;

    // Build query conditions
    const conditions: Record<string, unknown>[] = [];

    // Search
    if (searchTerm) {
        conditions.push({
            $or: [
                { title: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
                { tags: { $in: [new RegExp(searchTerm, 'i')] } },
            ],
        });
    }

    // Filters
    if (type) conditions.push({ type });
    if (category) conditions.push({ category: new Types.ObjectId(category) });
    if (seller) conditions.push({ seller: new Types.ObjectId(seller) });
    if (status) conditions.push({ status });
    if (isFeatured !== undefined) conditions.push({ isFeatured });
    if (isFree) conditions.push({ price: 0 });
    if (format) conditions.push({ fileFormats: format });

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
        const priceCondition: Record<string, number> = {};
        if (minPrice !== undefined) priceCondition.$gte = minPrice;
        if (maxPrice !== undefined) priceCondition.$lte = maxPrice;
        conditions.push({ price: priceCondition });
    }

    const whereConditions = conditions.length > 0 ? { $and: conditions } : {};

    // Sorting
    const sortConditions: Record<string, 1 | -1> = {};
    sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        Graphics.find(whereConditions)
            .populate('seller', 'firstName lastName avatar sellerProfile.storeName')
            .populate('category', 'name slug')
            .sort(sortConditions)
            .skip(skip)
            .limit(limit)
            .lean(),
        Graphics.countDocuments(whereConditions),
    ]);

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Get single graphics by ID or slug
 */
const getGraphicsById = async (idOrSlug: string): Promise<IGraphics | null> => {
    const isObjectId = Types.ObjectId.isValid(idOrSlug);

    const result = await Graphics.findOne(
        isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }
    )
        .populate('seller', 'firstName lastName avatar sellerProfile')
        .populate('category', 'name slug')
        .populate('subCategory', 'name slug');

    return result;
};

/**
 * Update graphics
 */
const updateGraphics = async (
    id: string,
    sellerId: string,
    payload: Partial<IGraphics>,
    isAdmin: boolean = false
): Promise<IGraphics | null> => {
    const graphics = await Graphics.findById(id);

    if (!graphics) {
        throw new AppError(404, 'Graphics not found');
    }

    // Check ownership (unless admin)
    if (!isAdmin && graphics.seller.toString() !== sellerId) {
        throw new AppError(403, 'You can only update your own products');
    }

    // Update slug if title changed
    if (payload.title && payload.title !== graphics.title) {
        payload.slug = generateSlug(payload.title);
    }

    const result = await Graphics.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

/**
 * Delete graphics (soft delete)
 */
const deleteGraphics = async (
    id: string,
    sellerId: string,
    isAdmin: boolean = false
): Promise<IGraphics | null> => {
    const graphics = await Graphics.findById(id);

    if (!graphics) {
        throw new AppError(404, 'Graphics not found');
    }

    // Check ownership (unless admin)
    if (!isAdmin && graphics.seller.toString() !== sellerId) {
        throw new AppError(403, 'You can only delete your own products');
    }

    const result = await Graphics.findByIdAndDelete(id);
    return result;
};

/**
 * Get graphics by seller
 */
const getGraphicsBySeller = async (
    sellerId: string,
    paginationOptions: { page?: number; limit?: number }
) => {
    const { page = 1, limit = 12 } = paginationOptions;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
        Graphics.find({ seller: new Types.ObjectId(sellerId) })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Graphics.countDocuments({ seller: new Types.ObjectId(sellerId) }),
    ]);

    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

/**
 * Increment view count
 */
const incrementViews = async (id: string): Promise<void> => {
    await Graphics.findByIdAndUpdate(id, { $inc: { views: 1 } });
};

/**
 * Update status (Admin only)
 */
const updateStatus = async (
    id: string,
    status: string
): Promise<IGraphics | null> => {
    const updateData: Record<string, unknown> = { status };

    // Set publishedAt when publishing
    if (status === 'published') {
        updateData.publishedAt = new Date();
    }

    const result = await Graphics.findByIdAndUpdate(id, updateData, {
        new: true,
    });

    return result;
};

export const GraphicsService = {
    createGraphics,
    getAllGraphics,
    getGraphicsById,
    updateGraphics,
    deleteGraphics,
    getGraphicsBySeller,
    incrementViews,
    updateStatus,
};
