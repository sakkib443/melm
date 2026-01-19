// ===================================================================
// CreativeHub - Webinar Model  
// ===================================================================

import { Schema, model } from 'mongoose';
import { IWebinar, WebinarModel } from './webinar.interface';

const webinarSchema = new Schema<IWebinar, WebinarModel>(
    {
        title: { type: String, required: true },
        titleBn: { type: String },
        description: { type: String, required: true },
        descriptionBn: { type: String },

        instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        type: { type: String, enum: ['seminar', 'webinar', 'workshop', 'free-class'], required: true },

        meetingLink: { type: String, required: true },
        meetingPassword: { type: String },

        scheduledAt: { type: Date, required: true },
        duration: { type: Number, required: true },
        endTime: { type: Date },

        isFree: { type: Boolean, default: true },
        price: { type: Number, default: 0 },
        maxParticipants: { type: Number },
        registeredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        registrationDeadline: { type: Date },

        materials: [{ type: String }],
        thumbnail: { type: String },

        status: { type: String, enum: ['upcoming', 'live', 'completed', 'cancelled'], default: 'upcoming' },

        totalRegistrations: { type: Number, default: 0 },
        totalAttendees: { type: Number, default: 0 }
    },
    { timestamps: true }
);

webinarSchema.index({ instructor: 1 });
webinarSchema.index({ status: 1 });
webinarSchema.index({ scheduledAt: 1 });

webinarSchema.pre('save', function (next) {
    if (this.scheduledAt && this.duration) {
        this.endTime = new Date(this.scheduledAt.getTime() + this.duration * 60000);
    }
    this.totalRegistrations = this.registeredUsers.length;
    next();
});

webinarSchema.statics.getUpcomingWebinars = async function (): Promise<IWebinar[]> {
    return await this.find({
        scheduledAt: { $gte: new Date() },
        status: 'upcoming'
    })
        .populate('instructor', 'firstName lastName avatar')
        .sort({ scheduledAt: 1 })
        .limit(10);
};

export const Webinar = model<IWebinar, WebinarModel>('Webinar', webinarSchema);
