// Webinar Routes - Quick
import express from 'express';
import { authMiddleware, authorizeRoles } from '../../middlewares/auth';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WebinarService } from './webinar.service';

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles('instructor', 'admin'), catchAsync(async (req, res) => {
    const webinar = await WebinarService.createWebinar(req.user!.userId, req.body);
    sendResponse(res, { statusCode: 201, success: true, message: 'Webinar created', data: webinar });
}));

router.get('/', catchAsync(async (req, res) => {
    const webinars = await WebinarService.getAllWebinars(req.query);
    sendResponse(res, { statusCode: 200, success: true, message: 'Webinars fetched', data: webinars });
}));

router.get('/:id', catchAsync(async (req, res) => {
    const webinar = await WebinarService.getWebinarById(req.params.id);
    sendResponse(res, { statusCode: 200, success: true, message: 'Webinar fetched', data: webinar });
}));

router.post('/:id/register', authMiddleware, catchAsync(async (req, res) => {
    const webinar = await WebinarService.registerForWebinar(req.params.id, req.user!.userId);
    sendResponse(res, { statusCode: 200, success: true, message: 'Registered successfully', data: webinar });
}));

router.delete('/:id', authMiddleware, authorizeRoles('admin'), catchAsync(async (req, res) => {
    await WebinarService.deleteWebinar(req.params.id);
    sendResponse(res, { statusCode: 200, success: true, message: 'Webinar deleted' });
}));

export const WebinarRoutes = router;
