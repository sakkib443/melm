// ===================================================================
// CreativeHub - Graphics Routes
// API routes for Graphics module
// ===================================================================

import express from 'express';
import { GraphicsController } from './graphics.controller';
import { GraphicsValidation } from './graphics.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

const router = express.Router();

// ==================== Public Routes ====================

// Get all graphics (with filters)
router.get('/', GraphicsController.getAllGraphics);

// Get single graphics by ID or slug
router.get('/:id', GraphicsController.getGraphicsById);

// ==================== Seller Routes ====================

// Get my graphics (seller's own products)
router.get(
    '/seller/my',
    auth('seller', 'admin'),
    GraphicsController.getMyGraphics
);

// Create new graphics
router.post(
    '/',
    auth('seller', 'admin'),
    validateRequest(GraphicsValidation.createGraphicsZodSchema),
    GraphicsController.createGraphics
);

// Update graphics
router.patch(
    '/:id',
    auth('seller', 'admin'),
    validateRequest(GraphicsValidation.updateGraphicsZodSchema),
    GraphicsController.updateGraphics
);

// Delete graphics
router.delete(
    '/:id',
    auth('seller', 'admin'),
    GraphicsController.deleteGraphics
);

// ==================== Admin Routes ====================

// Update status (approve/reject)
router.patch(
    '/:id/status',
    auth('admin'),
    GraphicsController.updateStatus
);

// ==================== Like Route (Public/Auth) ====================

// Toggle like
router.post(
    '/:id/like',
    GraphicsController.toggleLike
);

export const GraphicsRoutes = router;
