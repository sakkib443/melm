// ===================================================================
// Certificate Model
// ===================================================================

import { Schema, model } from 'mongoose';
import { ICertificate, CertificateModel } from './certificate.interface';

const certificateSchema = new Schema<ICertificate, CertificateModel>(
    {
        certificateId: { type: String, required: true, unique: true },

        student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },

        studentName: { type: String, required: true },
        courseName: { type: String, required: true },
        instructor: { type: String, required: true },

        completedAt: { type: Date, required: true },
        issueDate: { type: Date, default: Date.now },

        qrCode: { type: String },
        verificationUrl: { type: String, required: true },
        pdfUrl: { type: String },

        status: { type: String, enum: ['active', 'revoked'], default: 'active' }
    },
    { timestamps: true }
);

certificateSchema.index({ student: 1, course: 1 }, { unique: true });
certificateSchema.index({ certificateId: 1 });

certificateSchema.statics.generateCertificateId = function (): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `CERT-${year}-${random}`;
};

certificateSchema.statics.findByStudentAndCourse = async function (studentId: string, courseId: string) {
    return await this.findOne({ student: studentId, course: courseId, status: 'active' });
};

export const Certificate = model<ICertificate, CertificateModel>('Certificate', certificateSchema);
