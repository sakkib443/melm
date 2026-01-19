// ===================================================================
// CreativeHub - Page Content Routes
// API routes for page content management
// ===================================================================

import express from 'express';
import { PageContentController } from './pageContent.controller';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';

const router = express.Router();

// ==================== PUBLIC ROUTES ====================
// Get content for public pages (frontend use)
router.get('/public/:pageKey', PageContentController.getPublicPageContent);

// Get theme settings (public - all users need this)
router.get('/theme', PageContentController.getTheme);

// ==================== ADMIN ROUTES ====================
// Update theme settings (admin only)
router.patch('/theme', authMiddleware, authorizeRoles('admin'), PageContentController.updateTheme);

// Get all page definitions (structure)
router.get('/definitions', PageContentController.getPageDefinitions);

// Get all pages overview with progress
router.get('/overview', PageContentController.getAllPagesOverview);

// Get a single page with all sections and content
router.get('/:pageKey', PageContentController.getPageWithSections);

// Get a specific section content
router.get('/:pageKey/:sectionKey', PageContentController.getSectionContent);

// Update a specific section content
router.patch('/:pageKey/:sectionKey', PageContentController.updateSectionContent);

// Update multiple sections at once
router.patch('/:pageKey', PageContentController.updateMultipleSections);

// Toggle section active status
router.patch('/:pageKey/:sectionKey/toggle', PageContentController.toggleSectionActive);

export const PageContentRoutes = router;
