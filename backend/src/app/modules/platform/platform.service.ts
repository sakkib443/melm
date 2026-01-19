// ===================================================================
// CreativeHub Backend - Platform Service
// Platform CRUD operations
// ===================================================================

import AppError from '../../utils/AppError';
import { IPlatform } from './platform.interface';
import { Platform } from './platform.model';

const PlatformService = {
    async createPlatform(payload: Partial<IPlatform>): Promise<IPlatform> {
        if (!payload.slug) {
            payload.slug = payload.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        const existing = await Platform.findOne({ slug: payload.slug });
        if (existing) throw new AppError(400, 'Platform slug already exists');
        return await Platform.create(payload);
    },

    async getAllPlatforms(): Promise<IPlatform[]> {
        return await Platform.find().sort({ order: 1 });
    },

    async getActivePlatforms(): Promise<IPlatform[]> {
        return await Platform.find({ status: 'active' }).sort({ order: 1 });
    },

    async getPlatformById(id: string): Promise<IPlatform> {
        const platform = await Platform.findById(id);
        if (!platform) throw new AppError(404, 'Platform not found');
        return platform;
    },

    async updatePlatform(id: string, payload: Partial<IPlatform>): Promise<IPlatform> {
        const platform = await Platform.findByIdAndUpdate(id, payload, { new: true });
        if (!platform) throw new AppError(404, 'Platform not found');
        return platform;
    },

    async deletePlatform(id: string): Promise<void> {
        const platform = await Platform.findById(id);
        if (!platform) throw new AppError(404, 'Platform not found');
        if (platform.productCount > 0) {
            throw new AppError(400, 'Cannot delete platform with products');
        }
        await Platform.findByIdAndDelete(id);
    },

    async incrementProductCount(id: string): Promise<void> {
        await Platform.findByIdAndUpdate(id, { $inc: { productCount: 1 } });
    },

    async decrementProductCount(id: string): Promise<void> {
        await Platform.findByIdAndUpdate(id, { $inc: { productCount: -1 } });
    },

    // ==================== MODULE MANAGEMENT ====================

    /**
     * Get enabled modules configuration
     * Returns default config if not set
     */
    async getEnabledModules(): Promise<any> {
        const { PlatformSettings } = await import('./platformSettings.model');

        const settings = await PlatformSettings.findOne({ key: 'enabled_modules' });

        if (!settings) {
            // Return all enabled by default
            return {
                lms: {
                    courses: true,
                    modules: true,
                    lessons: true,
                    enrollments: true,
                    certificates: true,
                    liveClasses: true,
                    webinars: true,
                    quizResults: true,
                },
                marketplace: {
                    graphics: true,
                    videoTemplates: true,
                    uiKits: true,
                    appTemplates: true,
                    audio: true,
                    photos: true,
                    fonts: true,
                },
                products: {
                    websites: true,
                    software: true,
                },
            };
        }

        return settings.value;
    },

    /**
     * Update enabled modules configuration
     * Only admin can update
     */
    async updateEnabledModules(modules: any, userId: string): Promise<any> {
        const { PlatformSettings } = await import('./platformSettings.model');

        const updated = await PlatformSettings.findOneAndUpdate(
            { key: 'enabled_modules' },
            {
                $set: {
                    key: 'enabled_modules',
                    value: modules,
                    updatedBy: userId,
                }
            },
            { upsert: true, new: true }
        );

        return updated.value;
    },
};

export default PlatformService;
