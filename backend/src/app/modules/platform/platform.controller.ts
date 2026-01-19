// ===================================================================
// CreativeHub Backend - Platform Controller
// ===================================================================

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import PlatformService from './platform.service';

const PlatformController = {
    createPlatform: catchAsync(async (req: Request, res: Response) => {
        const platform = await PlatformService.createPlatform(req.body);
        sendResponse(res, { statusCode: 201, success: true, message: 'Platform created', data: platform });
    }),

    getAllPlatforms: catchAsync(async (req: Request, res: Response) => {
        const platforms = await PlatformService.getAllPlatforms();
        sendResponse(res, { statusCode: 200, success: true, message: 'Platforms fetched', data: platforms });
    }),

    getActivePlatforms: catchAsync(async (req: Request, res: Response) => {
        const platforms = await PlatformService.getActivePlatforms();
        sendResponse(res, { statusCode: 200, success: true, message: 'Platforms fetched', data: platforms });
    }),

    getPlatformById: catchAsync(async (req: Request, res: Response) => {
        const platform = await PlatformService.getPlatformById(req.params.id);
        sendResponse(res, { statusCode: 200, success: true, message: 'Platform fetched', data: platform });
    }),

    updatePlatform: catchAsync(async (req: Request, res: Response) => {
        const platform = await PlatformService.updatePlatform(req.params.id, req.body);
        sendResponse(res, { statusCode: 200, success: true, message: 'Platform updated', data: platform });
    }),

    deletePlatform: catchAsync(async (req: Request, res: Response) => {
        await PlatformService.deletePlatform(req.params.id);
        sendResponse(res, { statusCode: 200, success: true, message: 'Platform deleted' });
    }),

    // ==================== MODULE MANAGEMENT ====================

    getEnabledModules: catchAsync(async (req: Request, res: Response) => {
        const modules = await PlatformService.getEnabledModules();
        sendResponse(res, { statusCode: 200, success: true, message: 'Enabled modules fetched', data: modules });
    }),

    updateEnabledModules: catchAsync(async (req: Request, res: Response) => {
        const userId = (req as any).user?._id;
        const modules = await PlatformService.updateEnabledModules(req.body, userId);
        sendResponse(res, { statusCode: 200, success: true, message: 'Module settings updated successfully', data: modules });
    }),
};

export default PlatformController;
