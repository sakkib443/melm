// ===================================================================
// CreativeHub LMS - Live Class Routes
// API routes for live class management
// লাইভ ক্লাস ম্যানেজমেন্টের API routes
// ===================================================================

import express from 'express';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { LiveClassController } from './liveClass.controller';
import {
    createLiveClassValidation,
    updateLiveClassValidation,
    joinLiveClassValidation
} from './liveClass.validation';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
// Get all public live classes
router.get('/public', LiveClassController.getAllLiveClasses);

// ==================== STUDENT ROUTES ====================
// Get upcoming classes for me
router.get(
    '/my-upcoming',
    authMiddleware,
    LiveClassController.getMyUpcomingClasses
);

// Join a live class
router.post(
    '/:id/join',
    authMiddleware,
    validateRequest(joinLiveClassValidation),
    LiveClassController.joinLiveClass
);

// Leave a live class
router.post(
    '/:id/leave',
    authMiddleware,
    LiveClassController.leaveLiveClass
);

// ==================== INSTRUCTOR ROUTES ====================
// Get my classes (as instructor)
router.get(
    '/instructor/my-classes',
    authMiddleware,
    authorizeRoles('instructor', 'admin'),
    LiveClassController.getMyClasses
);

// Create live class (Instructor only)
router.post(
    '/',
    authMiddleware,
    authorizeRoles('instructor', 'admin'),
    validateRequest(createLiveClassValidation),
    LiveClassController.createLiveClass
);

// Update live class (Instructor only)
router.patch(
    '/:id',
    authMiddleware,
    authorizeRoles('instructor', 'admin'),
    validateRequest(updateLiveClassValidation),
    LiveClassController.updateLiveClass
);

// Delete live class (Instructor/Admin only)
router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles('instructor', 'admin'),
    LiveClassController.deleteLiveClass
);

// ====================COMMON ROUTES ====================
// Get all live classes (with filters)
router.get(
    '/',
    authMiddleware,
    LiveClassController.getAllLiveClasses
);

// Get single live class
router.get(
    '/:id',
    authMiddleware,
    LiveClassController.getLiveClassById
);

export const LiveClassRoutes = router;
