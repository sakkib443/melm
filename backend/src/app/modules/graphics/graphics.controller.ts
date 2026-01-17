// ===================================================================
// CreativeHub - Graphics Controller
// HTTP request handlers for Graphics
// ===================================================================

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { GraphicsService } from './graphics.service';
import pick from '../../utils/pick';

// Create Graphics
const createGraphics = catchAsync(async (req: Request, res: Response) => {
    const sellerId = req.user?._id;
    const result = await GraphicsService.createGraphics(sellerId, req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Graphics created successfully',
        data: result,
    });
});

// Get All Graphics
const getAllGraphics = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, [
        'searchTerm', 'type', 'category', 'seller', 'status',
        'minPrice', 'maxPrice', 'format', 'isFeatured', 'isFree'
    ]);
    const paginationOptions = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);

    const result = await GraphicsService.getAllGraphics(filters, paginationOptions);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Graphics retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

// Get Single Graphics
const getGraphicsById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await GraphicsService.getGraphicsById(id);

    // Increment views
    if (result) {
        await GraphicsService.incrementViews(result._id!.toString());
    }

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Graphics retrieved successfully',
        data: result,
    });
});

// Update Graphics
const updateGraphics = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sellerId = req.user?._id;
    const isAdmin = req.user?.role === 'admin';

    const result = await GraphicsService.updateGraphics(id, sellerId, req.body, isAdmin);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Graphics updated successfully',
        data: result,
    });
});

// Delete Graphics
const deleteGraphics = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const sellerId = req.user?._id;
    const isAdmin = req.user?.role === 'admin';

    await GraphicsService.deleteGraphics(id, sellerId, isAdmin);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Graphics deleted successfully',
        data: null,
    });
});

// Get My Graphics (Seller)
const getMyGraphics = catchAsync(async (req: Request, res: Response) => {
    const sellerId = req.user?._id;
    const paginationOptions = pick(req.query, ['page', 'limit']);

    const result = await GraphicsService.getGraphicsBySeller(sellerId, paginationOptions);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Your graphics retrieved successfully',
        meta: result.meta,
        data: result.data,
    });
});

// Update Status (Admin)
const updateStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const result = await GraphicsService.updateStatus(id, status);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Graphics status updated successfully',
        data: result,
    });
});

export const GraphicsController = {
    createGraphics,
    getAllGraphics,
    getGraphicsById,
    updateGraphics,
    deleteGraphics,
    getMyGraphics,
    updateStatus,
};
