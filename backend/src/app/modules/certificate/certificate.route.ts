// Certificate Routes
import express from 'express';
import { authMiddleware } from '../../middlewares/auth';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CertificateService } from './certificate.service';

const router = express.Router();

// Generate certificate (auto on completion)
router.post('/generate', authMiddleware, catchAsync(async (req, res) => {
    const { courseId } = req.body;
    const certificate = await CertificateService.generateCertificate(req.user!.userId, courseId);
    sendResponse(res, { statusCode: 201, success: true, message: 'Certificate generated', data: certificate });
}));

// Get my certificates
router.get('/my', authMiddleware, catchAsync(async (req, res) => {
    const certificates = await CertificateService.getStudentCertificates(req.user!.userId);
    sendResponse(res, { statusCode: 200, success: true, message: 'Certificates fetched', data: certificates });
}));

// Verify certificate (public)
router.get('/verify/:certificateId', catchAsync(async (req, res) => {
    const result = await CertificateService.verifyCertificate(req.params.certificateId);
    sendResponse(res, { statusCode: 200, success: true, message: 'Certificate verified', data: result });
}));

export const CertificateRoutes = router;
