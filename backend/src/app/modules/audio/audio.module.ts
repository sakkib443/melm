// ===================================================================
// CreativeHub - Audio Module (Combined)
// Music Tracks, Sound Effects, Podcast Intros
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
export interface IAudio {
    _id?: Types.ObjectId;
    title: string;
    slug: string;
    description: string;
    seller: Types.ObjectId;
    type: 'music' | 'sfx' | 'podcast-intro' | 'loop' | 'ambient' | 'jingle' | 'voiceover' | 'other';
    genre?: string;
    mood?: string[];
    category: Types.ObjectId;
    tags: string[];
    thumbnail: string;
    previewAudio: string;
    mainFile: { url: string; size: number; format: string };
    additionalFormats?: { format: string; url: string; size: number }[];
    duration: number;  // in seconds
    bpm?: number;
    key?: string;
    instruments?: string[];
    vocals: boolean;
    loopable: boolean;
    price: number;
    salePrice?: number;
    licenses: { type: 'personal' | 'commercial' | 'broadcast'; price: number; features: string[] }[];
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
const audioSchema = new Schema<IAudio>(
    {
        title: { type: String, required: true, trim: true, maxlength: 200 },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, required: true },
        seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['music', 'sfx', 'podcast-intro', 'loop', 'ambient', 'jingle', 'voiceover', 'other'], required: true },
        genre: { type: String },
        mood: [{ type: String }],
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        tags: [{ type: String, trim: true }],
        thumbnail: { type: String, required: true },
        previewAudio: { type: String, required: true },
        mainFile: { url: { type: String, required: true }, size: { type: Number, required: true }, format: { type: String, required: true } },
        additionalFormats: [{ format: String, url: String, size: Number }],
        duration: { type: Number, required: true },
        bpm: { type: Number },
        key: { type: String },
        instruments: [{ type: String }],
        vocals: { type: Boolean, default: false },
        loopable: { type: Boolean, default: false },
        price: { type: Number, required: true, min: 0 },
        salePrice: { type: Number, min: 0 },
        licenses: [{ type: { type: String, enum: ['personal', 'commercial', 'broadcast'] }, price: Number, features: [String] }],
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

audioSchema.index({ title: 'text', description: 'text', tags: 'text' });
audioSchema.index({ slug: 1 });
audioSchema.index({ seller: 1, status: 1 });

export const Audio: Model<IAudio> = model<IAudio>('Audio', audioSchema);

// ==================== SERVICE ====================
const generateSlug = (title: string): string => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

const AudioService = {
    async create(sellerId: string, payload: Partial<IAudio>) {
        payload.slug = generateSlug(payload.title!);
        payload.seller = new Types.ObjectId(sellerId);
        return await Audio.create(payload);
    },
    async getAll(filters: Record<string, unknown>, pagination: { page?: number; limit?: number; sortBy?: string; sortOrder?: string }) {
        const { searchTerm, type, category, seller, status, genre, mood, minPrice, maxPrice, vocals, loopable } = filters;
        const { page = 1, limit = 12, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
        const conditions: Record<string, unknown>[] = [];
        if (searchTerm) conditions.push({ $or: [{ title: { $regex: searchTerm, $options: 'i' } }] });
        if (type) conditions.push({ type });
        if (category) conditions.push({ category: new Types.ObjectId(category as string) });
        if (seller) conditions.push({ seller: new Types.ObjectId(seller as string) });
        if (status) conditions.push({ status });
        if (genre) conditions.push({ genre });
        if (mood) conditions.push({ mood: { $in: Array.isArray(mood) ? mood : [mood] } });
        if (vocals !== undefined) conditions.push({ vocals });
        if (loopable !== undefined) conditions.push({ loopable });
        if (minPrice !== undefined) conditions.push({ price: { $gte: minPrice } });
        if (maxPrice !== undefined) conditions.push({ price: { $lte: maxPrice } });
        const whereConditions = conditions.length > 0 ? { $and: conditions } : {};
        const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            Audio.find(whereConditions).populate('seller', 'firstName lastName avatar sellerProfile.storeName').populate('category', 'name slug').sort(sort).skip(skip).limit(Number(limit)).lean(),
            Audio.countDocuments(whereConditions),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async getById(idOrSlug: string) {
        const isObjectId = Types.ObjectId.isValid(idOrSlug);
        return await Audio.findOne(isObjectId ? { _id: idOrSlug } : { slug: idOrSlug }).populate('seller', 'firstName lastName avatar sellerProfile').populate('category', 'name slug');
    },
    async update(id: string, sellerId: string, payload: Partial<IAudio>, isAdmin = false) {
        const item = await Audio.findById(id);
        if (!item) throw new AppError(404, 'Audio not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        if (payload.title) payload.slug = generateSlug(payload.title);
        return await Audio.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    },
    async delete(id: string, sellerId: string, isAdmin = false) {
        const item = await Audio.findById(id);
        if (!item) throw new AppError(404, 'Audio not found');
        if (!isAdmin && item.seller.toString() !== sellerId) throw new AppError(403, 'Not authorized');
        return await Audio.findByIdAndDelete(id);
    },
    async getBySeller(sellerId: string, pagination: { page?: number; limit?: number }) {
        const { page = 1, limit = 12 } = pagination;
        const skip = (Number(page) - 1) * Number(limit);
        const [data, total] = await Promise.all([
            Audio.find({ seller: new Types.ObjectId(sellerId) }).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Audio.countDocuments({ seller: new Types.ObjectId(sellerId) }),
        ]);
        return { data, meta: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)) } };
    },
    async incrementViews(id: string) { await Audio.findByIdAndUpdate(id, { $inc: { views: 1 } }); },
    async updateStatus(id: string, status: string) {
        const updateData: Record<string, unknown> = { status };
        if (status === 'published') updateData.publishedAt = new Date();
        return await Audio.findByIdAndUpdate(id, updateData, { new: true });
    },
};

// ==================== VALIDATION ====================
const createSchema = z.object({ body: z.object({ title: z.string().min(3).max(200), description: z.string().min(10), type: z.string(), category: z.string(), thumbnail: z.string(), previewAudio: z.string(), mainFile: z.object({ url: z.string(), size: z.number(), format: z.string() }), duration: z.number().min(1), price: z.number().min(0) }) });
const updateSchema = z.object({ body: z.object({ title: z.string().min(3).max(200).optional(), description: z.string().min(10).optional(), price: z.number().min(0).optional(), status: z.string().optional() }).passthrough() });

// ==================== CONTROLLER ====================
const AudioController = {
    create: catchAsync(async (req: Request, res: Response) => { const result = await AudioService.create(req.user?._id, req.body); sendResponse(res, { statusCode: 201, success: true, message: 'Audio created successfully', data: result }); }),
    getAll: catchAsync(async (req: Request, res: Response) => { const filters = pick(req.query, ['searchTerm', 'type', 'category', 'seller', 'status', 'genre', 'mood', 'minPrice', 'maxPrice', 'vocals', 'loopable']); const pagination = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']); const result = await AudioService.getAll(filters, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'Audio retrieved', meta: result.meta, data: result.data }); }),
    getById: catchAsync(async (req: Request, res: Response) => { const result = await AudioService.getById(req.params.id); if (result) await AudioService.incrementViews(result._id!.toString()); sendResponse(res, { statusCode: 200, success: true, message: 'Audio retrieved', data: result }); }),
    update: catchAsync(async (req: Request, res: Response) => { const result = await AudioService.update(req.params.id, req.user?._id, req.body, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'Audio updated', data: result }); }),
    delete: catchAsync(async (req: Request, res: Response) => { await AudioService.delete(req.params.id, req.user?._id, req.user?.role === 'admin'); sendResponse(res, { statusCode: 200, success: true, message: 'Audio deleted', data: null }); }),
    getMy: catchAsync(async (req: Request, res: Response) => { const pagination = pick(req.query, ['page', 'limit']); const result = await AudioService.getBySeller(req.user?._id, pagination); sendResponse(res, { statusCode: 200, success: true, message: 'Your audio retrieved', meta: result.meta, data: result.data }); }),
    updateStatus: catchAsync(async (req: Request, res: Response) => { const result = await AudioService.updateStatus(req.params.id, req.body.status); sendResponse(res, { statusCode: 200, success: true, message: 'Status updated', data: result }); }),
};

// ==================== ROUTES ====================
const router = express.Router();
router.get('/', AudioController.getAll);
router.get('/seller/my', auth('seller', 'admin'), AudioController.getMy);
router.get('/:id', AudioController.getById);
router.post('/', auth('seller', 'admin'), validateRequest(createSchema), AudioController.create);
router.patch('/:id', auth('seller', 'admin'), validateRequest(updateSchema), AudioController.update);
router.delete('/:id', auth('seller', 'admin'), AudioController.delete);
router.patch('/:id/status', auth('admin'), AudioController.updateStatus);

export const AudioRoutes = router;
