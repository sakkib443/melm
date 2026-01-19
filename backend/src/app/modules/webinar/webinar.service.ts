// ===================================================================
// Webinar Service - Quick Implementation
// ===================================================================

import { Types } from 'mongoose';
import { Webinar } from './webinar.model';
import { IWebinar } from './webinar.interface';
import AppError from '../../utils/AppError';
import { User } from '../user/user.model';
import EmailService from '../email/email.service';

export const WebinarService = {
    async createWebinar(instructorId: string, payload: Partial<IWebinar>): Promise<IWebinar> {
        const webinar = await Webinar.create({
            ...payload,
            instructor: instructorId
        });
        return webinar;
    },

    async getAllWebinars(filters: any): Promise<IWebinar[]> {
        const query: any = {};
        if (filters.type) query.type = filters.type;
        if (filters.status) query.status = filters.status;

        return await Webinar.find(query)
            .populate('instructor', 'firstName lastName avatar')
            .sort({ scheduledAt: 1 });
    },

    async getWebinarById(id: string): Promise<IWebinar> {
        const webinar = await Webinar.findById(id)
            .populate('instructor', 'firstName lastName avatar email');
        if (!webinar) throw new AppError(404, 'Webinar not found');
        return webinar;
    },

    async registerForWebinar(webinarId: string, userId: string): Promise<IWebinar> {
        const webinar = await Webinar.findById(webinarId);
        if (!webinar) throw new AppError(404, 'Webinar not found');

        if (webinar.maxParticipants && webinar.registeredUsers.length >= webinar.maxParticipants) {
            throw new AppError(400, 'Webinar is full');
        }

        const alreadyRegistered = webinar.registeredUsers.some(id => id.toString() === userId);
        if (alreadyRegistered) {
            throw new AppError(400, 'Already registered');
        }

        webinar.registeredUsers.push(new Types.ObjectId(userId));
        await webinar.save();

        // Send confirmation email
        const user = await User.findById(userId);
        if (user) {
            EmailService.sendLiveClassNotification(user.email, {
                studentName: user.firstName,
                className: webinar.title,
                instructorName: 'Instructor',
                scheduledAt: webinar.scheduledAt,
                duration: webinar.duration,
                joinUrl: `${process.env.FRONTEND_URL}/webinar/${webinar._id}`
            }).catch(err => console.error('Email error:', err));
        }

        return webinar;
    },

    async deleteWebinar(id: string): Promise<void> {
        await Webinar.findByIdAndDelete(id);
    }
};
