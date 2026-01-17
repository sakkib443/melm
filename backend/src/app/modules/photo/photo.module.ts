// ===================================================================
// CreativeHub - Photo Module (Combined)
// Stock Photos, Photo Bundles, Textures
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
export interface IPhoto {
    _id?: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    seller: Types.ObjectId;
    type: 'photo' | 'bundle' | 'texture' | 'pattern' | 'background' | 'mockup-photo' | 'other';
    category: Types.ObjectId;
    tags: string[];
    colors?: string[];
    orientation: 'horizontal' | 'vertical' | 'square';
    thumbnail: string;
    previewImage: string;
    watermarkedPreview?: string;
    mainFile: { url: string; size: number; format: string };
    additionalSizes?: { label: string; url: string; width: number; height: number; size: number }[];
    resolution: { width: number; height: number };
    dpi: number;
    format: string;
    hasAlpha: boolean;
    modelRelease: boolean;
    propertyRelease: boolean;
    price: number;
    salePrice?: number;
    licenses: { type: 'personal' | 'commercial' | 'extended' | 'editorial'; price: number; features: string[] }[];
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
const photoSchema = new Schema<IPhoto>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['photo', 'bundle', 'texture', 'pattern', 'background', 'mockup-photo', 'other'], required: true },
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        tags: [{ type: String, trim: true }],
        colors: [{ type: String }],
        orientation: { type: String, enum: ['horizontal', 'vertical', 'square'], default: 'horizontal' },
        thumbnail: { type: String, required: true },
        previewImage: { type: String, required: true },
        watermarkedPreview: { type: String },
        mainFile: { url: { type: String, required: true }, size: { type: Number, required: true }, format: { type: String, required: true } },
        additionalSizes: [{ label: String, url: String, width: Number, height: Number, size: Number }],
        resolution: { width: { type: Number, required: true }, height: { type: Number, required: true } },
        dpi: { type: Number, default: 300 },
        format: { type: String, default: 'jpg' },
        hasAlpha: { type: Boolean, default: false },
        modelRelease: { type: Boolean, default: false },
        propertyRelease: { type: Boolean, default: false },
        price: { type: Number, required: true, min: 0 },
        salePrice: { type: Number, min: 0 },
        licenses: [{ type: { type: String, enum: ['personal', 'commercial', 'extended', 'editorial'] }, price: Number, features: [String] }],
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

photoSchema.index({ title: 'text', description: 'text', tags: 'text' });
photoSchema.index({ slug: 1 });
photoSchema.index({ seller: 1, status: 1 });
photoSchema.index({ colors: 1 });

export const Photo: Model<IPhoto> = model<IPhoto>('Photo', photoSchema);

// ==================== SERVICE ====================
const generateSlug = (title: string): string => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

const PhotoService = {
    async create(sellerId: string, payload: Partial<IPhoto>) {
        payload.slug = generateSlug(payload.title!);
        payload.seller = new Types.ObjectId(sellerId);
        return await Photo.create(payload);
    },
    async getAll(filters: Record<string, unknown>, pagination: { page?: number; limit?: number; sortBy?: string; sortOrder?: string }) {
        const { searchTerm, type, category, seller, status, orientation, color, minPrice, maxPrice } = filters;
        const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
        const conditions: Record<string, unknown>[] = [];
        if (searchTerm) conditions.push({ $or: [{ title: { $regex: searchTerm, $options: 'i' } }] });
        if (type) conditions.push({ type });
        if (category) conditions.push({ category: new Types.ObjectId(category as string) });
        if (seller) conditions.push({ seller: new Types.ObjectId(seller as string) });
        if (status) conditions.push({ status });
        if (orientation) conditions.push({ orientation });
        if (color) conditions.push({ colors: color });
        if (minPrice !== undefined) conditions.push({ price: { $gte: minPrice } });
        if (maxPrice !== undefined) conditions.push({ price: { $lte: maxPrice } });
        const whereConditions = conditions.length > 0 ? { $and: conditions } : {};
        const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            Photo.find(whereConditions).populate('seller', 'firstName lastName avatar sellerProfile.storeName').populate('category', 'name slug').sort(sort).skip(skip).limit(Number(limit)).lean(),
            Photo.countDocuments(whereConditions),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async getById(idOrSlug: string) {
        const isObjectId = Types.ObjectId.isValid(idOrSlug);
        return await Photo.findOne(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }).populate('seller', 'firstName lastName avatar sellerProfile').populate('category', 'name slug');
    },
    async update(id: string, sellerId: string, payload: Partial<IPhoto>, isAdmin = false) {
        const item = await Photo.findById(id);
        if (!item) throw new AppError(404, 'Photo not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        if (payload.title) payload.slug = generateSlug(payload.title);
        return await Photo.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    },
    async delete(id: string, sellerId: string, isAdmin = false) {
        const item = await Photo.findById(id);
        if (!item) throw new AppError(404, 'Photo not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        return await Photo.findByIdAndDelete(id);
    },
    async getBySeller(sellerId: string, pagination: { page?: number; limit?: number }) {
        const { page = 1, limit = 12 } = pagination;
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            Photo.find({ seller: new Types.ObjectId(sellerId) }).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Photo.countDocuments({ seller: new Types.ObjectId(sellerId) }),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async incrementViews(id: string) { await Photo.findByIdAndUpdate(id, { $inc: { views: 1 } }); },
    async updateStatus(id: string, status: string) {
        const updateData: Record<string, unknown> = { status };
        if (status === 'published') updateData.publishedAt = new Date();
        return await Photo.findByIdAndUpdate(id, updateData, { new: true });
    },
};

// ==================== VALIDATION ====================
const createSchema = z.object({ body: z.object({ title: z.string().min(3).max(200), description: z.string().min(10), type: z.string(), category: z.string(), thumbnail: z.string(), previewImage: z.string(), mainFile: z.object({ url: z.string(), size: z.number(), format: z.string() }), resolution: z.object({ width: z.number(), height: z.number() }), price: z.number().min(0) }) });
const updateSchema = z.object({ body: z.object({ title: z.string().min(3).max(200).optional(), description: z.string().min(10).optional(), price: z.number().min(0).optional(), status: z.string().optional() }).passthrough() });

// ==================== CONTROLLER ====================
const PhotoController = {
    create: catchAsync(async (req: Request, res: Response) => { const result = await PhotoService.create(req.user?._id, req.body); sendResponse(res, { statusCode: 201, success: true, message: 'Photo created successfully', data: result }); }),
    getAll: catchAsync(async (req: Request, res: Response) => { const filters = pick(req.query, ['searchTerm', 'type', 'category', 'seller', 'status', 'orientation', 'color', 'minPrice', 'maxPrice']); const pagination = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']); const result = await PhotoService.getAll(filters, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'Photos retrieved', meta: result.meta, data: result.data }); }),
    getById: catchAsync(async (req: Request, res: Response) => { const result = await PhotoService.getById(req.params.id); if (result) await PhotoService.incrementViews(result._id!.toString()); sendResponse(res, { statusCode: 200, success: true, message: 'Photo retrieved', data: result }); }),
    update: catchAsync(async (req: Request, res: Response) => { const result = await PhotoService.update(req.params.id, req.user?._id, req.body, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'Photo updated', data: result }); }),
    delete: catchAsync(async (req: Request, res: Response) => { await PhotoService.delete(req.params.id, req.user?._id, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'Photo deleted', data: null }); }),
    getMy: catchAsync(async (req: Request, res: Response) => { const pagination = pick(req.query, ['page', 'limit']); const result = await PhotoService.getBySeller(req.user?._id, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'Your photos retrieved', meta: result.meta, data: result.data }); }),
    updateStatus: catchAsync(async (req: Request, res: Response) => { const result = await PhotoService.updateStatus(req.params.id, req.body.status); sendResponse(res, { statusCode: 200, success: true, message: 'Status updated', data: result }); }),
};

// ==================== ROUTES ====================
const router = express.Router();
router.get('/', PhotoController.getAll);
router.get('/seller/my', auth('seller', 'admin'), PhotoController.getMy);
router.get('/:id', PhotoController.getById);
router.post('/', auth('seller', 'admin'), validateRequest(createSchema), PhotoController.create);
router.patch('/:id', auth('seller', 'admin'), validateRequest(updateSchema), PhotoController.update);
router.delete('/:id', auth('seller', 'admin'), PhotoController.delete);
router.patch('/:id/status', auth('admin'), PhotoController.updateStatus);

export const PhotoRoutes = router;
