// ===================================================================
// CreativeHub LMS - Live Class Controller
// HTTP request handlers for live class endpoints
// লাইভ ক্লাস এন্ডপয়েন্টের জন্য HTTP request handlers
// ===================================================================

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LiveClassService } from './liveClass.service';

// Create live class (Instructor only)
const createLiveClass = catchAsync(async (req: Request, res: Response) => {
    const liveClass = await LiveClassService.createLiveClass(
        req.user!.userId,
        req.body
    );

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Live class created successfully. Notifications sent to students.',
        data: liveClass
    });
});

// Get all live classes (with filters)
const getAllLiveClasses = catchAsync(async (req: Request, res: Response) => {
    const {
        searchTerm,
        instructor,
        course,
        status,
        accessType,
        dateFrom,
        dateTo,
        page,
        limit,
        sortBy,
        sortOrder
    } = req.query;

    const filters = {
        searchTerm: searchTerm as string,
        instructor: instructor as string,
        course: course as string,
        status: status as any,
        accessType: accessType as any,
        dateFrom: dateFrom ? new Date(dateFrom as string) : undefined,
        dateTo: dateTo ? new Date(dateTo as string) : undefined
    };

    const paginationOptions = {
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        sortBy: (sortBy as string) || 'scheduledAt',
        sortOrder: (sortOrder as 'asc' | 'desc') || 'asc'
    };

    const result = await LiveClassService.getAllLiveClasses(filters, paginationOptions);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Live classes fetched successfully',
        meta: {
            page: paginationOptions.page,
            limit: paginationOptions.limit,
            total: result.total,
            totalPages: Math.ceil(result.total / paginationOptions.limit)
        },
        data: result.data
    });
});

// Get single live class
const getLiveClassById = catchAsync(async (req: Request, res: Response) => {
    const liveClass = await LiveClassService.getLiveClassById(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Live class fetched successfully',
        data: liveClass
    });
});

// Update live class (Instructor only)
const updateLiveClass = catchAsync(async (req: Request, res: Response) => {
    const liveClass = await LiveClassService.updateLiveClass(req.params.id, req.body);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Live class updated successfully',
        data: liveClass
    });
});

// Delete live class (Instructor/Admin only)
const deleteLiveClass = catchAsync(async (req: Request, res: Response) => {
    await LiveClassService.deleteLiveClass(req.params.id);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Live class deleted successfully'
    });
});

// Join live class (Student)
const joinLiveClass = catchAsync(async (req: Request, res: Response) => {
    const result = await LiveClassService.joinLiveClass(
        req.params.id,
        req.user!.userId
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Joined live class successfully',
        data: result
    });
});

// Leave live class (Student)
const leaveLiveClass = catchAsync(async (req: Request, res: Response) => {
    await LiveClassService.leaveLiveClass(req.params.id, req.user!.userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Left live class successfully'
    });
});

// Get upcoming classes for current student
const getMyUpcomingClasses = catchAsync(async (req: Request, res: Response) => {
    const classes = await LiveClassService.getUpcomingClassesForStudent(req.user!.userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Upcoming classes fetched successfully',
        data: classes
    });
});

// Get my classes (Instructor)
const getMyClasses = catchAsync(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const result = await LiveClassService.getAllLiveClasses(
        { instructor: req.user!.userId },
        {
            page: Number(page),
            limit: Number(limit),
            sortBy: 'scheduledAt',
            sortOrder: 'desc'
        }
    );

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Your live classes fetched successfully',
        meta: {
            page: Number(page),
            limit: Number(limit),
            total: result.total,
            totalPages: Math.ceil(result.total / Number(limit))
        },
        data: result.data
    });
});

export const LiveClassController = {
    createLiveClass,
    getAllLiveClasses,
    getLiveClassById,
    updateLiveClass,
    deleteLiveClass,
    joinLiveClass,
    leaveLiveClass,
    getMyUpcomingClasses,
    getMyClasses
};
