// ===================================================================
// CreativeHub - Font Module (Combined)
// Display Fonts, Script Fonts, Sans Serif, Bangla Fonts
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
export interface IFont {
    _id?: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    seller: Types.ObjectId;
    type: 'display' | 'script' | 'sans-serif' | 'serif' | 'slab-serif' | 'monospace' | 'handwritten' | 'decorative' | 'bangla' | 'arabic' | 'other';
    category: Types.ObjectId;
    tags: string[];
    thumbnail: string;
    previewImages: string[];
    previewText?: string;
    mainFile: { url: string; size: number; format: string };
    additionalFormats?: { format: string; url: string; size: number }[];
    weights: string[];  // ['regular', 'bold', 'light', 'medium', etc.]
    styles: ('normal' | 'italic' | 'oblique')[];
    glyphs: number;
    languages: string[];
    openTypeFeatures?: string[];
    webFont: boolean;
    variableFont: boolean;
    price: number;
    salePrice?: number;
    licenses: { type: 'personal' | 'commercial' | 'extended' | 'app-embedding'; price: number; features: string[] }[];
    views: number;
    downloads: number;
    sales: number;
    rating: number;
    reviewCount: number;
    status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
    isFeatured: boolean;
    publishedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// ==================== MODEL ====================
const fontSchema = new Schema<IFont>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['display', 'script', 'sans-serif', 'serif', 'slab-serif', 'monospace', 'handwritten', 'decorative', 'bangla', 'arabic', 'other'], required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        tags: [{ type: String, trim: true }],
        thumbnail: { type: String, required: true },
        previewImages: [{ type: String }],
        previewText: { type: String },
        mainFile: { url: { type: String, required: true }, size: { type: Number, required: true }, format: { type: String, required: true } },
        additionalFormats: [{ format: String, url: String, size: Number }],
        weights: [{ type: String }],
        styles: [{ type: String, enum: ['normal', 'italic', 'oblique'] }],
        glyphs: { type: Number, default: 0 },
        languages: [{ type: String }],
        openTypeFeatures: [{ type: String }],
        webFont: { type: Boolean, default: false },
        variableFont: { type: Boolean, default: false },
        price: { type: Number, required: true, min: 0 },
        salePrice: { type: Number, min: 0 },
        licenses: [{ type: { type: String, enum: ['personal', 'commercial', 'extended', 'app-embedding'] }, price: Number, features: [String] }],
        views: { type: Number, default: 0 },
        downloads: { type: Number, default: 0 },
        sales: { type: Number, default: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0 },
        status: { type: String, enum: ['draft', 'pending', 'approved', 'rejected', 'published'], default: 'draft' },
        isFeatured: { type: Boolean, default: false },
        publishedAt: Date,
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

fontSchema.index({ title: 'text', description: 'text', tags: 'text' });
fontSchema.index({ slug: 1 });
fontSchema.index({ seller: 1, status: 1 });
fontSchema.index({ type: 1 });

export const Font: Model<IFont> = model<IFont>('Font', fontSchema);

// ==================== SERVICE ====================
const generateSlug = (title: string): string => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

const FontService = {
    async create(sellerId: string, payload: Partial<IFont>) {
        payload.slug = generateSlug(payload.title!);
        payload.seller = new Types.ObjectId(sellerId);
        return await Font.create(payload);
    },
    async getAll(filters: Record<string, unknown>, pagination: { page?: number; limit?: number; sortBy?: string; sortOrder?: string }) {
        const { searchTerm, type, category, seller, status, language, webFont, variableFont, minPrice, maxPrice } = filters;
        const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
        const conditions: Record<string, unknown>[] = [];
        if (searchTerm) conditions.push({ $or: [{ title: { $regex: searchTerm, $options: 'i' } }] });
        if (type) conditions.push({ type });
        if (category) {
            const isValidObjectId = Types.ObjectId.isValid(category as string);
            conditions.push({ category: isValidObjectId ? new Types.ObjectId(category as string) : category });
        }
        if (seller) conditions.push({ seller: new Types.ObjectId(seller as string) });
        if (status) conditions.push({ status });
        if (language) conditions.push({ languages: language });
        if (webFont !== undefined) conditions.push({ webFont });
        if (variableFont !== undefined) conditions.push({ variableFont });
        if (minPrice !== undefined) conditions.push({ price: { $gte: minPrice } });
        if (maxPrice !== undefined) conditions.push({ price: { $lte: maxPrice } });
        const whereConditions = conditions.length > 0 ? { $and: conditions } : {};
        const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            Font.find(whereConditions).populate('seller', 'firstName lastName avatar sellerProfile.storeName').populate('category', 'name slug').sort(sort).skip(skip).limit(Number(limit)).lean(),
            Font.countDocuments(whereConditions),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async getById(idOrSlug: string) {
        const isObjectId = Types.ObjectId.isValid(idOrSlug);
        return await Font.findOne(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }).populate('seller', 'firstName lastName avatar sellerProfile').populate('category', 'name slug');
    },
    async update(id: string, sellerId: string, payload: Partial<IFont>, isAdmin = false) {
        const item = await Font.findById(id);
        if (!item) throw new AppError(404, 'Font not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        if (payload.title) payload.slug = generateSlug(payload.title);
        return await Font.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    },
    async delete(id: string, sellerId: string, isAdmin = false) {
        const item = await Font.findById(id);
        if (!item) throw new AppError(404, 'Font not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        return await Font.findByIdAndDelete(id);
    },
    async getBySeller(sellerId: string, pagination: { page?: number; limit?: number }) {
        const { page = 1, limit = 12 } = pagination;
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            Font.find({ seller: new Types.ObjectId(sellerId) }).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Font.countDocuments({ seller: new Types.ObjectId(sellerId) }),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async incrementViews(id: string) { await Font.findByIdAndUpdate(id, { $inc: { views: 1 } }); },
    async updateStatus(id: string, status: string) {
        const updateData: Record<string, unknown> = { status };
        if (status === 'published') updateData.publishedAt = new Date();
        return await Font.findByIdAndUpdate(id, updateData, { new: true });
    },
};

// ==================== VALIDATION ====================
const createSchema = z.object({ body: z.object({ title: z.string().min(3).max(200), description: z.string().min(10), type: z.string(), category: z.string(), thumbnail: z.string(), mainFile: z.object({ url: z.string(), size: z.number(), format: z.string() }), price: z.number().min(0) }) });
const updateSchema = z.object({ body: z.object({ title: z.string().min(3).max(200).optional(), description: z.string().min(10).optional(), price: z.number().min(0).optional(), status: z.string().optional() }).passthrough() });

// ==================== CONTROLLER ====================
const FontController = {
    create: catchAsync(async (req: Request, res: Response) => { const result = await FontService.create(req.user?._id, req.body); sendResponse(res, { statusCode: 201, success: true, message: 'Font created successfully', data: result }); }),
    getAll: catchAsync(async (req: Request, res: Response) => { const filters = pick(req.query, ['searchTerm', 'type', 'category', 'seller', 'status', 'language', 'webFont', 'variableFont', 'minPrice', 'maxPrice']); const pagination = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']); const result = await FontService.getAll(filters, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'Fonts retrieved', meta: result.meta, data: result.data }); }),
    getById: catchAsync(async (req: Request, res: Response) => { const result = await FontService.getById(req.params.id); if (result) await FontService.incrementViews(result._id!.toString()); sendResponse(res, { statusCode: 200, success: true, message: 'Font retrieved', data: result }); }),
    update: catchAsync(async (req: Request, res: Response) => { const result = await FontService.update(req.params.id, req.user?._id, req.body, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'Font updated', data: result }); }),
    delete: catchAsync(async (req: Request, res: Response) => { await FontService.delete(req.params.id, req.user?._id, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'Font deleted', data: null }); }),
    getMy: catchAsync(async (req: Request, res: Response) => { const pagination = pick(req.query, ['page', 'limit']); const result = await FontService.getBySeller(req.user?._id, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'Your fonts retrieved', meta: result.meta, data: result.data }); }),
    updateStatus: catchAsync(async (req: Request, res: Response) => { const result = await FontService.updateStatus(req.params.id, req.body.status); sendResponse(res, { statusCode: 200, success: true, message: 'Status updated', data: result }); }),
};

// ==================== ROUTES ====================
const router = express.Router();
router.get('/', FontController.getAll);
router.get('/seller/my', auth('seller', 'admin'), FontController.getMy);
router.get('/:id', FontController.getById);
router.post('/', auth('seller', 'admin'), validateRequest(createSchema), FontController.create);
router.patch('/:id', auth('seller', 'admin'), validateRequest(updateSchema), FontController.update);
router.delete('/:id', auth('seller', 'admin'), FontController.delete);
router.patch('/:id/status', auth('admin'), FontController.updateStatus);

export const FontRoutes = router;
