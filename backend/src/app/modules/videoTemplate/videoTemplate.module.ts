// ===================================================================
// CreativeHub - Video Template Module (Combined)
// Model, Validation, Service, Controller, Routes
// ===================================================================

import { Schema, model, Model, Types } from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';
import express from 'express';
import { IVideoTemplate, IVideoTemplateFilters } from './videoTemplate.interface';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import pick from '../../utils/pick';
import AppError from '../../utils/AppError';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

// ==================== MODEL ====================
const videoTemplateSchema = new Schema<IVideoTemplate>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        shortDescription: { type: String, maxlength: 300, default: '' },
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: ['intro', 'outro', 'lower-third', 'title', 'transition', 'slideshow',
                'logo-reveal', 'promo', 'social-media', 'infographic', 'youtube',
                'broadcast', 'corporate', 'wedding', 'lut', 'preset', 'motion-element', 'other'],
            required: true,
        },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        subCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
        tags: [{ type: String, trim: true }],
        thumbnail: { type: String, required: true },
        previewVideo: { type: String, required: true },
        previewImages: [{ type: String }],
        mainFile: {
            url: { type: String, required: true },
            size: { type: Number, required: true },
            format: { type: String, required: true },
        },
        additionalFiles: [{
            name: String, url: String, size: Number, format: String,
        }],
        software: [{
            type: String,
            enum: ['after-effects', 'premiere-pro', 'davinci-resolve', 'final-cut-pro',
                'sony-vegas', 'filmora', 'capcut', 'motion'],
        }],
        softwareVersion: { type: String, default: 'CC 2020+' },
        resolution: {
            width: { type: Number, default: 1920 },
            height: { type: Number, default: 1080 },
            label: { type: String, default: '1080p' },
        },
        frameRate: { type: Number, default: 30 },
        duration: { type: Number },
        fileSize: { type: String },
        pluginsRequired: [{ type: String }],
        fontsIncluded: { type: Boolean, default: false },
        musicIncluded: { type: Boolean, default: false },
        tutorialIncluded: { type: Boolean, default: false },
        price: { type: Number, required: true, min: 0 },
        salePrice: { type: Number, min: 0 },
        licenses: [{
            type: { type: String, enum: ['personal', 'commercial', 'extended'] },
            price: Number,
            features: [String],
        }],
        features: [String],
        highlights: [String],
        whatIncluded: [String],
        views: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 },
        sales: { type: Number, default: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },
        status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected', 'published'], default: 'draft' },
        isFeatured: { type: Boolean, default: false },
        isBestSeller: { type: Boolean, default: false },
        isTrending: { type: Boolean, default: false },
        version: { type: String, default: '1.0' },
        changelog: [{ version: String, date: Date, changes: [String] }],
        seoTitle: String,
        seoDescription: String,
        seoKeywords: [String],
        publishedAt: Date,
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

videoTemplateSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoTemplateSchema.index({ slug: 1 });
videoTemplateSchema.index({ seller: 1, status: 1 });
videoTemplateSchema.index({ type: 1, status: 1 });
videoTemplateSchema.index({ price: 1 });
videoTemplateSchema.index({ sales: -1 });

export const VideoTemplate: Model<IVideoTemplate> = model<IVideoTemplate>('VideoTemplate', videoTemplateSchema);

// ==================== VALIDATION ====================
const createSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200),
        description: z.string().min(10),
        type: z.string(),
        category: z.string(),
        thumbnail: z.string(),
        previewVideo: z.string(),
        mainFile: z.object({ url: z.string(), size: z.number(), format: z.string() }),
        price: z.number().min(0),
    }),
});

const updateSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(200).optional(),
        description: z.string().min(10).optional(),
        price: z.number().min(0).optional(),
        status: z.string().optional(),
    }).passthrough(),
});

// ==================== SERVICE ====================
const generateSlug = (title: string): string => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
};

const VideoTemplateService = {
    async create(sellerId: string, payload: Partial<IVideoTemplate>) {
        payload.slug = generateSlug(payload.title!);
        payload.seller = new Types.ObjectId(sellerId);
        return await VideoTemplate.create(payload);
    },

    async getAll(filters: IVideoTemplateFilters, pagination: { page?: number; limit?: number; sortBy?: string; sortOrder?: string }) {
        const { searchTerm, type, category, seller, status, software, minPrice, maxPrice } = filters;
        const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;

        const conditions: Record<string, unknown>[] = [];
        if (searchTerm) conditions.push({ $or: [{ title: { $regex: searchTerm, $options: 'i' } }, { tags: { $in: [new RegExp(searchTerm, 'i')] } }] });
        if (type) conditions.push({ type });
        if (category) conditions.push({ category: new Types.ObjectId(category) });
        if (seller) conditions.push({ seller: new Types.ObjectId(seller) });
        if (status) conditions.push({ status });
        if (software) conditions.push({ software });
        if (minPrice !== undefined) conditions.push({ price: { $gte: minPrice } });
        if (maxPrice !== undefined) conditions.push({ price: { $lte: maxPrice } });

        const whereConditions = conditions.length > 0 ? { $and: conditions } : {};
        const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            VideoTemplate.find(whereConditions).populate('seller', 'firstName lastName avatar sellerProfile.storeName').populate('category', 'name slug').sort(sort).skip(skip).limit(limit).lean(),
            VideoTemplate.countDocuments(whereConditions),
        ]);

        return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },

    async getById(idOrSlug: string) {
        const isObjectId = Types.ObjectId.isValid(idOrSlug);
        return await VideoTemplate.findOne(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug })
            .populate('seller', 'firstName lastName avatar sellerProfile')
            .populate('category', 'name slug');
    },

    async update(id: string, sellerId: string, payload: Partial<IVideoTemplate>, isAdmin = false) {
        const item = await VideoTemplate.findById(id);
        if (!item) throw new AppError(404, 'Video template not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        if (payload.title) payload.slug = generateSlug(payload.title);
        return await VideoTemplate.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    },

    async delete(id: string, sellerId: string, isAdmin = false) {
        const item = await VideoTemplate.findById(id);
        if (!item) throw new AppError(404, 'Video template not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        return await VideoTemplate.findByIdAndDelete(id);
    },

    async getBySeller(sellerId: string, pagination: { page?: number; limit?: number }) {
        const { page = 1, limit = 12 } = pagination;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            VideoTemplate.find({ seller: new Types.ObjectId(sellerId) }).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            VideoTemplate.countDocuments({ seller: new Types.ObjectId(sellerId) }),
        ]);
        return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    },

    async incrementViews(id: string) {
        await VideoTemplate.findByIdAndUpdate(id, { $inc: { views: 1 } });
    },

    async updateStatus(id: string, status: string) {
        const updateData: Record<string, unknown> = { status };
        if (status === 'published') updateData.publishedAt = new Date();
        return await VideoTemplate.findByIdAndUpdate(id, updateData, { new: true });
    },
};

// ==================== CONTROLLER ====================
const VideoTemplateController = {
    create: catchAsync(async (req: Request, res: Response) => {
        const result = await VideoTemplateService.create(req.user?._id, req.body);
        sendResponse(res, { statusCode: 201, success: true, message: 'Video template created successfully', data: result });
    }),

    getAll: catchAsync(async (req: Request, res: Response) => {
        const filters = pick(req.query, ['searchTerm', 'type', 'category', 'seller', 'status', 'software', 'minPrice', 'maxPrice']);
        const pagination = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
        const result = await VideoTemplateService.getAll(filters, pagination);
        sendResponse(res, { statusCode: 200, success: true, message: 'Video templates retrieved', meta: result.meta, data: result.data });
    }),

    getById: catchAsync(async (req: Request, res: Response) => {
        const result = await VideoTemplateService.getById(req.params.id);
        if (result) await VideoTemplateService.incrementViews(result._id!.toString());
        sendResponse(res, { statusCode: 200, success: true, message: 'Video template retrieved', data: result });
    }),

    update: catchAsync(async (req: Request, res: Response) => {
        const result = await VideoTemplateService.update(req.params.id, req.user?._id, req.body, req.user?.role === 'admin');
        sendResponse(res, { statusCode: 200, success: true, message: 'Video template updated', data: result });
    }),

    delete: catchAsync(async (req: Request, res: Response) => {
        await VideoTemplateService.delete(req.params.id, req.user?._id, req.user?.role === 'admin');
        sendResponse(res, { statusCode: 200, success: true, message: 'Video template deleted', data: null });
    }),

    getMy: catchAsync(async (req: Request, res: Response) => {
        const pagination = pick(req.query, ['page', 'limit']);
        const result = await VideoTemplateService.getBySeller(req.user?._id, pagination);
        sendResponse(res, { statusCode: 200, success: true, message: 'Your video templates retrieved', meta: result.meta, data: result.data });
    }),

    updateStatus: catchAsync(async (req: Request, res: Response) => {
        const result = await VideoTemplateService.updateStatus(req.params.id, req.body.status);
        sendResponse(res, { statusCode: 200, success: true, message: 'Status updated', data: result });
    }),
};

// ==================== ROUTES ====================
const router = express.Router();

router.get('/', VideoTemplateController.getAll);
router.get('/seller/my', auth('seller', 'admin'), VideoTemplateController.getMy);
router.get('/:id', VideoTemplateController.getById);
router.post('/', auth('seller', 'admin'), validateRequest(createSchema), VideoTemplateController.create);
router.patch('/:id', auth('seller', 'admin'), validateRequest(updateSchema), VideoTemplateController.update);
router.delete('/:id', auth('seller', 'admin'), VideoTemplateController.delete);
router.patch('/:id/status', auth('admin'), VideoTemplateController.updateStatus);

export const VideoTemplateRoutes = router;
