// ===================================================================
// CreativeHub - UI Kit Module (Combined)
// Figma, XD, Sketch UI Kits
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
export interface IUIKit {
    _id?: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    seller: Types.ObjectId;
    type: 'dashboard' | 'mobile-app' | 'website' | 'landing-page' | 'ecommerce' | 'saas' | 'admin' | 'wireframe' | 'icon-set' | 'component-library' | 'design-system' | 'other';
    category: Types.ObjectId;
    subCategory?: Types.ObjectId;
    tags: string[];
    thumbnail: string;
    previewImages: string[];
    previewVideo?: string;
    livePreviewUrl?: string;
    mainFile: { url: string; size: number; format: string };
    additionalFiles?: { name: string; url: string; size: number; format: string }[];
    software: ('figma' | 'sketch' | 'xd' | 'photoshop' | 'illustrator')[];
    screens: number;
    components: number;
    icons: number;
    responsive: boolean;
    darkMode: boolean;
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
    changelog?: { version: string; date: Date; changes: string[] }[];
    seoTitle?: string;
    seoDescription?: string;
    publishedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// ==================== MODEL ====================
const uiKitSchema = new Schema<IUIKit>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        shortDescription: { type: String, maxlength: 300, default: '' },
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: {
            type: String,
            enum: ['dashboard', 'mobile-app', 'website', 'landing-page', 'ecommerce', 'saas', 'admin', 'wireframe', 'icon-set', 'component-library', 'design-system', 'other'],
            required: true,
        },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        subCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
        tags: [{ type: String, trim: true }],
        thumbnail: { type: String, required: true },
        previewImages: [{ type: String }],
        previewVideo: { type: String },
        livePreviewUrl: { type: String },
        mainFile: { url: { type: String, required: true }, size: { type: Number, required: true }, format: { type: String, required: true } },
        additionalFiles: [{ name: String, url: String, size: Number, format: String }],
        software: [{ type: String, enum: ['figma', 'sketch', 'xd', 'photoshop', 'illustrator'] }],
        screens: { type: Number, default: 0 },
        components: { type: Number, default: 0 },
        icons: { type: Number, default: 0 },
        responsive: { type: Boolean, default: true },
        darkMode: { type: Boolean, default: false },
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
        changelog: [{ version: String, date: Date, changes: [String] }],
        seoTitle: String,
        seoDescription: String,
        publishedAt: Date,
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

uiKitSchema.index({ title: 'text', description: 'text', tags: 'text' });
uiKitSchema.index({ slug: 1 });
uiKitSchema.index({ seller: 1, status: 1 });

export const UIKit: Model<IUIKit> = model<IUIKit>('UIKit', uiKitSchema);

// ==================== SERVICE ====================
const generateSlug = (title: string): string => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

const UIKitService = {
    async create(sellerId: string, payload: Partial<IUIKit>) {
        payload.slug = generateSlug(payload.title!);
        payload.seller = new Types.ObjectId(sellerId);
        return await UIKit.create(payload);
    },
    async getAll(filters: Record<string, unknown>, pagination: { page?: number; limit?: number; sortBy?: string; sortOrder?: string }) {
        const { searchTerm, type, category, seller, status, software, minPrice, maxPrice } = filters;
        const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
        const conditions: Record<string, unknown>[] = [];
        if (searchTerm) conditions.push({ $or: [{ title: { $regex: searchTerm, $options: 'i' } }] });
        if (type) conditions.push({ type });
        if (category) conditions.push({ category: new Types.ObjectId(category as string) });
        if (seller) conditions.push({ seller: new Types.ObjectId(seller as string) });
        if (status) conditions.push({ status });
        if (software) conditions.push({ software });
        if (minPrice !== undefined) conditions.push({ price: { $gte: minPrice } });
        if (maxPrice !== undefined) conditions.push({ price: { $lte: maxPrice } });
        const whereConditions = conditions.length > 0 ? { $and: conditions } : {};
        const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            UIKit.find(whereConditions).populate('seller', 'firstName lastName avatar sellerProfile.storeName').populate('category', 'name slug').sort(sort).skip(skip).limit(Number(limit)).lean(),
            UIKit.countDocuments(whereConditions),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async getById(idOrSlug: string) {
        const isObjectId = Types.ObjectId.isValid(idOrSlug);
        return await UIKit.findOne(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }).populate('seller', 'firstName lastName avatar sellerProfile').populate('category', 'name slug');
    },
    async update(id: string, sellerId: string, payload: Partial<IUIKit>, isAdmin = false) {
        const item = await UIKit.findById(id);
        if (!item) throw new AppError(404, 'UI Kit not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        if (payload.title) payload.slug = generateSlug(payload.title);
        return await UIKit.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    },
    async delete(id: string, sellerId: string, isAdmin = false) {
        const item = await UIKit.findById(id);
        if (!item) throw new AppError(404, 'UI Kit not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        return await UIKit.findByIdAndDelete(id);
    },
    async getBySeller(sellerId: string, pagination: { page?: number; limit?: number }) {
        const { page = 1, limit = 12 } = pagination;
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            UIKit.find({ seller: new Types.ObjectId(sellerId) }).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            UIKit.countDocuments({ seller: new Types.ObjectId(sellerId) }),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async incrementViews(id: string) { await UIKit.findByIdAndUpdate(id, { $inc: { views: 1 } }); },
    async updateStatus(id: string, status: string) {
        const updateData: Record<string, unknown> = { status };
        if (status === 'published') updateData.publishedAt = new Date();
        return await UIKit.findByIdAndUpdate(id, updateData, { new: true });
    },
};

// ==================== VALIDATION ====================
const createSchema = z.object({ body: z.object({ title: z.string().min(3).max(200), description: z.string().min(10), type: z.string(), category: z.string(), thumbnail: z.string(), mainFile: z.object({ url: z.string(), size: z.number(), format: z.string() }), price: z.number().min(0) }) });
const updateSchema = z.object({ body: z.object({ title: z.string().min(3).max(200).optional(), description: z.string().min(10).optional(), price: z.number().min(0).optional(), status: z.string().optional() }).passthrough() });

// ==================== CONTROLLER ====================
const UIKitController = {
    create: catchAsync(async (req: Request, res: Response) => { const result = await UIKitService.create(req.user?._id, req.body); sendResponse(res, { statusCode: 201, success: true, message: 'UI Kit created successfully', data: result }); }),
    getAll: catchAsync(async (req: Request, res: Response) => { const filters = pick(req.query, ['searchTerm', 'type', 'category', 'seller', 'status', 'software', 'minPrice', 'maxPrice']); const pagination = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']); const result = await UIKitService.getAll(filters, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'UI Kits retrieved', meta: result.meta, data: result.data }); }),
    getById: catchAsync(async (req: Request, res: Response) => { const result = await UIKitService.getById(req.params.id); if (result) await UIKitService.incrementViews(result._id!.toString()); sendResponse(res, { statusCode: 200, success: true, message: 'UI Kit retrieved', data: result }); }),
    update: catchAsync(async (req: Request, res: Response) => { const result = await UIKitService.update(req.params.id, req.user?._id, req.body, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'UI Kit updated', data: result }); }),
    delete: catchAsync(async (req: Request, res: Response) => { await UIKitService.delete(req.params.id, req.user?._id, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'UI Kit deleted', data: null }); }),
    getMy: catchAsync(async (req: Request, res: Response) => { const pagination = pick(req.query, ['page', 'limit']); const result = await UIKitService.getBySeller(req.user?._id, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'Your UI Kits retrieved', meta: result.meta, data: result.data }); }),
    updateStatus: catchAsync(async (req: Request, res: Response) => { const result = await UIKitService.updateStatus(req.params.id, req.body.status); sendResponse(res, { statusCode: 200, success: true, message: 'Status updated', data: result }); }),
};

// ==================== ROUTES ====================
const router = express.Router();
router.get('/', UIKitController.getAll);
router.get('/seller/my', auth('seller', 'admin'), UIKitController.getMy);
router.get('/:id', UIKitController.getById);
router.post('/', auth('seller', 'admin'), validateRequest(createSchema), UIKitController.create);
router.patch('/:id', auth('seller', 'admin'), validateRequest(updateSchema), UIKitController.update);
router.delete('/:id', auth('seller', 'admin'), UIKitController.delete);
router.patch('/:id/status', auth('admin'), UIKitController.updateStatus);

export const UIKitRoutes = router;
