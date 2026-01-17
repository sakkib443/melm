// ===================================================================
// CreativeHub LMS - Stats Routes
// API endpoints for stats
// ===================================================================

import express from 'express';
import { StatsController } from './stats.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = express.Router();

// Get dashboard stats (public - for hero section)
router.get('/dashboard', StatsController.getDashboardStats);

// Get user-specific dashboard stats
router.get('/user', authMiddleware, StatsController.getUserStats);

export const StatsRoutes = router;
