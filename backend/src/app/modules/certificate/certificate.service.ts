// ===================================================================
// Certificate Service - Auto-generate on course completion
// ===================================================================

import { Types } from 'mongoose';
import { Certificate } from './certificate.model';
import { ICertificate } from './certificate.interface';
import { Course } from '../course/course.model';
import { User } from '../user/user.model';
import { Enrollment } from '../enrollment/enrollment.model';
import AppError from '../../utils/AppError';
import config from '../../config';

export const CertificateService = {
    // Auto-generate certificate when course is completed
    async generateCertificate(studentId: string, courseId: string): Promise<ICertificate> {
        // Check if already exists
        const existing = await Certificate.findByStudentAndCourse(studentId, courseId);
        if (existing) return existing;

        // Verify course completion
        const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
        if (!enrollment || enrollment.progress < 100) {
            throw new AppError(400, 'Course not completed yet');
        }

        const [student, course] = await Promise.all([
            User.findById(studentId),
            Course.findById(courseId).populate('instructor', 'firstName lastName')
        ]);

        if (!student || !course) throw new AppError(404, 'Student or Course not found');

        const certificateId = Certificate.generateCertificateId();
        const verificationUrl = `${config.frontend_url}/certificate/verify/${certificateId}`;

        const certificate = await Certificate.create({
            certificateId,
            student: studentId,
            course: courseId,
            studentName: `${student.firstName} ${student.lastName || ''}`.trim(),
            courseName: course.title,
            instructor: `${(course.instructor as any).firstName} ${(course.instructor as any).lastName || ''}`.trim(),
            completedAt: enrollment.completedAt || new Date(),
            issueDate: new Date(),
            verificationUrl,
            qrCode: verificationUrl, // Can be enhanced with actual QR code image
            status: 'active'
        });

        return certificate;
    },

    async getCertificateById(certificateId: string): Promise<ICertificate> {
        const certificate = await Certificate.findOne({ certificateId, status: 'active' })
            .populate('student', 'firstName lastName email')
            .populate('course', 'title');

        if (!certificate) throw new AppError(404, 'Certificate not found');
        return certificate;
    },

    async getStudentCertificates(studentId: string): Promise<ICertificate[]> {
        return await Certificate.find({ student: studentId, status: 'active' })
            .populate('course', 'title thumbnail')
            .sort({ issueDate: -1 });
    },

    async verifyCertificate(certificateId: string): Promise<{ valid: boolean; certificate?: ICertificate }> {
        const certificate = await this.getCertificateById(certificateId);
        return { valid: true, certificate };
    }
};
