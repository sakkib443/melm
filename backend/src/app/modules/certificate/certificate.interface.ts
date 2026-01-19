// ===================================================================
// Certificate Interface
// ===================================================================

import { Model, Types } from 'mongoose';

export interface ICertificate {
    _id?: Types.ObjectId;

    certificateId: string; // CERT-2024-XXXXX

    student: Types.ObjectId;
    course: Types.ObjectId;

    studentName: string;
    courseName: string;
    instructor: string;

    completedAt: Date;
    issueDate: Date;

    qrCode: string;
    verificationUrl: string;
    pdfUrl?: string;

    status: 'active' | 'revoked';

    createdAt?: Date;
    updatedAt?: Date;
}

export interface CertificateModel extends Model<ICertificate> {
    generateCertificateId(): string;
    findByStudentAndCourse(studentId: string, courseId: string): Promise<ICertificate | null>;
}
