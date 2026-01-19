// Quiz Result - Simple Implementation
import { Schema, model, Types } from 'mongoose';

interface IQuizResult {
    _id?: Types.ObjectId;
    student: Types.ObjectId;
    lesson: Types.ObjectId;
    course: Types.ObjectId;
    answers: { questionId: Types.ObjectId; answer: string | string[]; isCorrect: boolean; points: number }[];
    totalScore: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    attemptNumber: number;
    submittedAt: Date;
    createdAt?: Date;
}

const quizResultSchema = new Schema<IQuizResult>({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    answers: [{
        questionId: Schema.Types.ObjectId,
        answer: Schema.Types.Mixed,
        isCorrect: Boolean,
        points: Number
    }],
    totalScore: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    attemptNumber: { type: Number, default: 1 },
    submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

quizResultSchema.index({ student: 1, lesson: 1 });

export const QuizResult = model<IQuizResult>('QuizResult', quizResultSchema);

// Service
export const QuizResultService = {
    async submitQuiz(studentId: string, lessonId: string, courseId: string, answers: any[]): Promise<IQuizResult> {
        const totalScore = answers.reduce((sum, a) => sum + (a.isCorrect ? a.points : 0), 0);
        const maxScore = answers.reduce((sum, a) => sum + a.points, 0);
        const percentage = (totalScore / maxScore) * 100;

        const attemptNumber = await QuizResult.countDocuments({ student: studentId, lesson: lessonId }) + 1;

        return await QuizResult.create({
            student: studentId,
            lesson: lessonId,
            course: courseId,
            answers,
            totalScore,
            maxScore,
            percentage,
            passed: percentage >= 60,
            attemptNumber,
            submittedAt: new Date()
        });
    },

    async getStudentResults(studentId: string, courseId: string): Promise<IQuizResult[]> {
        return await QuizResult.find({ student: studentId, course: courseId }).sort({ submittedAt: -1 });
    }
};

// Routes
import express from 'express';
import { authMiddleware } from '../../middlewares/auth';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const router = express.Router();

router.post('/submit', authMiddleware, catchAsync(async (req, res) => {
    const { lessonId, courseId, answers } = req.body;
    const result = await QuizResultService.submitQuiz(req.user!.userId, lessonId, courseId, answers);
    sendResponse(res, { statusCode: 201, success: true, message: 'Quiz submitted', data: result });
}));

router.get('/my/:courseId', authMiddleware, catchAsync(async (req, res) => {
    const results = await QuizResultService.getStudentResults(req.user!.userId, req.params.courseId);
    sendResponse(res, { statusCode: 200, success: true, message: 'Results fetched', data: results });
}));

export const QuizResultRoutes = router;
