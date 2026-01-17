// ===================================================================
// CreativeHub - App Template Module (Combined)
// Flutter, React Native, iOS, Android Templates
// ===================================================================

import { Schema, model, Model, Types } from 'mongoose';
import { z } from 'zod';
import { Request, Response } from 'express';
import express from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import pick from '../../utils/pick';
import AppError from '../../utils/AppError';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

// ==================== INTERFACE ====================
export interface IAppTemplate {
    _id?: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    seller: Types.ObjectId;
    type: 'ecommerce' | 'social' | 'food-delivery' | 'travel' | 'fitness' | 'finance' | 'education' | 'healthcare' | 'news' | 'music' | 'utility' | 'game' | 'chat' | 'other';
    category: Types.ObjectId;
    tags: string[];
    thumbnail: string;
    previewImages: string[];
    previewVideo?: string;
    demoUrl?: string;
    mainFile: { url: string; size: number; format: string };
    additionalFiles?: { name: string; url: string; size: number; format: string }[];
    framework: ('flutter' | 'react-native' | 'swift' | 'kotlin' | 'ionic' | 'xamarin')[];
    platforms: ('ios' | 'android' | 'web')[];
    screens: number;
    backendIncluded: boolean;
    backendType?: string;
    apiDocumentation: boolean;
    price: number;
    salePrice?: number;
    licenses: { type: 'personal' | 'commercial' | 'extended'; price: number; features: string[] }[];
    features: string[];
    highlights: string[];
    whatIncluded: string[];
    views: number;
    downloads: number;
    sales: number;
    rating: number;
    reviewCount: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
    isFeatured: boolean;
    isBestSeller: boolean;
    version: string;
    publishedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// ==================== MODEL ====================
const appTemplateSchema = new Schema<IAppTemplate>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        shortDescription: { type: String, maxlength: 300, default: '' },
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['ecommerce', 'social', 'food-delivery', 'travel', 'fitness', 'finance', 'education', 'healthcare', 'news', 'music', 'utility', 'game', 'chat', 'other'], required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        tags: [{ type: String, trim: true }],
        thumbnail: { type: String, required: true },
        previewImages: [{ type: String }],
        previewVideo: { type: String },
        demoUrl: { type: String },
        mainFile: { url: { type: String, required: true }, size: { type: Number, required: true }, format: { type: String, required: true } },
        additionalFiles: [{ name: String, url: String, size: Number, format: String }],
        framework: [{ type: String, enum: ['flutter', 'react-native', 'swift', 'kotlin', 'ionic', 'xamarin'] }],
        platforms: [{ type: String, enum: ['ios', 'android', 'web'] }],
        screens: { type: Number, default: 0 },
        backendIncluded: { type: Boolean, default: false },
        backendType: { type: String },
        apiDocumentation: { type: Boolean, default: false },
        price: { type: Number, required: true, min: 0 },
        salePrice: { type: Number, min: 0 },
        licenses: [{ type: { type: String, enum: ['personal', 'commercial', 'extended'] }, price: Number, features: [String] }],
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
        version: { type: String, default: '1.0' },
        publishedAt: Date,
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

appTemplateSchema.index({ title: 'text', description: 'text', tags: 'text' });
appTemplateSchema.index({ slug: 1 });
appTemplateSchema.index({ seller: 1, status: 1 });

export const AppTemplate: Model<IAppTemplate> = model<IAppTemplate>('AppTemplate', appTemplateSchema);

// ==================== SERVICE ====================
const generateSlug = (title: string): string => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

const AppTemplateService = {
    async create(sellerId: string, payload: Partial<IAppTemplate>) {
        payload.slug = generateSlug(payload.title!);
        payload.seller = new Types.ObjectId(sellerId);
        return await AppTemplate.create(payload);
    },
    async getAll(filters: Record<string, unknown>, pagination: { page?: number; limit?: number; sortBy?: string; sortOrder?: string }) {
        const { searchTerm, type, category, seller, status, framework, platform, minPrice, maxPrice } = filters;
        const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
        const conditions: Record<string, unknown>[] = [];
        if (searchTerm) conditions.push({ $or: [{ title: { $regex: searchTerm, $options: 'i' } }] });
        if (type) conditions.push({ type });
        if (category) conditions.push({ category: new Types.ObjectId(category as string) });
        if (seller) conditions.push({ seller: new Types.ObjectId(seller as string) });
        if (status) conditions.push({ status });
        if (framework) conditions.push({ framework });
        if (platform) conditions.push({ platforms: platform });
        if (minPrice !== undefined) conditions.push({ price: { $gte: minPrice } });
        if (maxPrice !== undefined) conditions.push({ price: { $lte: maxPrice } });
        const whereConditions = conditions.length > 0 ? { $and: conditions } : {};
        const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            AppTemplate.find(whereConditions).populate('seller', 'firstName lastName avatar sellerProfile.storeName').populate('category', 'name slug').sort(sort).skip(skip).limit(Number(limit)).lean(),
            AppTemplate.countDocuments(whereConditions),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async getById(idOrSlug: string) {
        const isObjectId = Types.ObjectId.isValid(idOrSlug);
        return await AppTemplate.findOne(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }).populate('seller', 'firstName lastName avatar sellerProfile').populate('category', 'name slug');
    },
    async update(id: string, sellerId: string, payload: Partial<IAppTemplate>, isAdmin = false) {
        const item = await AppTemplate.findById(id);
        if (!item) throw new AppError(404, 'App Template not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        if (payload.title) payload.slug = generateSlug(payload.title);
        return await AppTemplate.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    },
    async delete(id: string, sellerId: string, isAdmin = false) {
        const item = await AppTemplate.findById(id);
        if (!item) throw new AppError(404, 'App Template not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        return await AppTemplate.findByIdAndDelete(id);
    },
    async getBySeller(sellerId: string, pagination: { page?: number; limit?: number }) {
        const { page = 1, limit = 12 } = pagination;
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            AppTemplate.find({ seller: new Types.ObjectId(sellerId) }).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            AppTemplate.countDocuments({ seller: new Types.ObjectId(sellerId) }),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async incrementViews(id: string) { await AppTemplate.findByIdAndUpdate(id, { $inc: { views: 1 } }); },
    async updateStatus(id: string, status: string) {
        const updateData: Record<string, unknown> = { status };
        if (status === 'published') updateData.publishedAt = new Date();
        return await AppTemplate.findByIdAndUpdate(id, updateData, { new: true });
    },
};

// ==================== VALIDATION ====================
const createSchema = z.object({ body: z.object({ title: z.string().min(3).max(200), description: z.string().min(10), type: z.string(), category: z.string(), thumbnail: z.string(), mainFile: z.object({ url: z.string(), size: z.number(), format: z.string() }), price: z.number().min(0) }) });
const updateSchema = z.object({ body: z.object({ title: z.string().min(3).max(200).optional(), description: z.string().min(10).optional(), price: z.number().min(0).optional(), status: z.string().optional() }).passthrough() });

// ==================== CONTROLLER ====================
const AppTemplateController = {
    create: catchAsync(async (req: Request, res: Response) => { const result = await AppTemplateService.create(req.user?._id, req.body); sendResponse(res, { statusCode: 201, success: true, message: 'App Template created successfully', data: result }); }),
    getAll: catchAsync(async (req: Request, res: Response) => { const filters = pick(req.query, ['searchTerm', 'type', 'category', 'seller', 'status', 'framework', 'platform', 'minPrice', 'maxPrice']); const pagination = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']); const result = await AppTemplateService.getAll(filters, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'App Templates retrieved', meta: result.meta, data: result.data }); }),
    getById: catchAsync(async (req: Request, res: Response) => { const result = await AppTemplateService.getById(req.params.id); if (result) await AppTemplateService.incrementViews(result._id!.toString()); sendResponse(res, { statusCode: 200, success: true, message: 'App Template retrieved', data: result }); }),
    update: catchAsync(async (req: Request, res: Response) => { const result = await AppTemplateService.update(req.params.id, req.user?._id, req.body, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'App Template updated', data: result }); }),
    delete: catchAsync(async (req: Request, res: Response) => { await AppTemplateService.delete(req.params.id, req.user?._id, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'App Template deleted', data: null }); }),
    getMy: catchAsync(async (req: Request, res: Response) => { const pagination = pick(req.query, ['page', 'limit']); const result = await AppTemplateService.getBySeller(req.user?._id, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'Your App Templates retrieved', meta: result.meta, data: result.data }); }),
    updateStatus: catchAsync(async (req: Request, res: Response) => { const result = await AppTemplateService.updateStatus(req.params.id, req.body.status); sendResponse(res, { statusCode: 200, success: true, message: 'Status updated', data: result }); }),
};

// ==================== ROUTES ====================
const router = express.Router();
router.get('/', AppTemplateController.getAll);
router.get('/seller/my', auth('seller', 'admin'), AppTemplateController.getMy);
router.get('/:id', AppTemplateController.getById);
router.post('/', auth('seller', 'admin'), validateRequest(createSchema), AppTemplateController.create);
router.patch('/:id', auth('seller', 'admin'), validateRequest(updateSchema), AppTemplateController.update);
router.delete('/:id', auth('seller', 'admin'), AppTemplateController.delete);
router.patch('/:id/status', auth('admin'), AppTemplateController.updateStatus);

export const AppTemplateRoutes = router;
