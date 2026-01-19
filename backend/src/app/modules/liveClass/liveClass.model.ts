// ===================================================================
// CreativeHub LMS - Live Class Model
// Mongoose schema for live classes
// লাইভ ক্লাসের Mongoose schema
// ===================================================================

import { Schema, model } from 'mongoose';
import { ILiveClass, LiveClassModel } from './liveClass.interface';

// Attendee Sub-schema
const attendeeSchema = new Schema({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, required: true },
    leftAt: { type: Date },
    duration: { type: Number, default: 0 }
}, { _id: false });

// Main Live Class Schema
const liveClassSchema = new Schema<ILiveClass, LiveClassModel>(
    {
        // Basic Info
        title: { type: String, required: true, trim: true },
        titleBn: { type: String, trim: true },
        description: { type: String },
        descriptionBn: { type: String },

        // Instructor & Course
        instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course' },

        // Meeting Details
        meetingType: {
            type: String,
            enum: ['zoom', 'google-meet', 'custom'],
            required: true
        },
        meetingLink: { type: String, required: true },
        meetingId: { type: String },
        meetingPassword: { type: String },
        embedUrl: { type: String },

        // Schedule
        scheduledAt: { type: Date, required: true },
        duration: { type: Number, required: true, min: 15, max: 480 }, // 15min to 8 hours
        endTime: { type: Date },
        timezone: { type: String, default: 'Asia/Dhaka' },

        // Access Control
        accessType: {
            type: String,
            enum: ['all-students', 'enrolled-only', 'targeted', 'public'],
            default: 'all-students'
        },
        targetedStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        isFree: { type: Boolean, default: true },
        price: { type: Number, default: 0 },

        // Status
        status: {
            type: String,
            enum: ['scheduled', 'live', 'completed', 'cancelled'],
            default: 'scheduled'
        },

        // Recording
        recordingUrl: { type: String },
        recordingAvailable: { type: Boolean, default: false },
        recordingPassword: { type: String },

        // Attendance
        attendees: [attendeeSchema],
        maxAttendees: { type: Number },
        currentAttendees: { type: Number, default: 0 },

        // Notifications
        notificationSent: { type: Boolean, default: false },
        reminderSent: { type: Boolean, default: false },
        reminderTime: { type: Number, default: 30 }, // 30 minutes before

        // Materials
        materials: [{ type: String }],
        slides: { type: String },

        // Chat/Q&A
        enableChat: { type: Boolean, default: true },
        enableQA: { type: Boolean, default: true },

        // Statistics
        totalAttendees: { type: Number, default: 0 },
        averageAttendance: { type: Number, default: 0 },
        views: { type: Number, default: 0 }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// ==================== Indexes ====================
liveClassSchema.index({ instructor: 1 });
liveClassSchema.index({ course: 1 });
liveClassSchema.index({ scheduledAt: 1 });
liveClassSchema.index({ status: 1 });
liveClassSchema.index({ accessType: 1 });

// ==================== Middleware ====================

// Calculate endTime before saving
liveClassSchema.pre('save', function (next) {
    if (this.scheduledAt && this.duration) {
        this.endTime = new Date(this.scheduledAt.getTime() + this.duration * 60000);
    }
    next();
});

// Update totalAttendees when attendees change
liveClassSchema.pre('save', function (next) {
    if (this.isModified('attendees')) {
        this.totalAttendees = this.attendees.length;
    }
    next();
});

// ==================== Static Methods ====================

// Check if class exists
liveClassSchema.statics.isClassExists = async function (id: string): Promise<boolean> {
    const liveClass = await this.findById(id);
    return !!liveClass;
};

// Get upcoming classes
liveClassSchema.statics.getUpcomingClasses = async function (): Promise<ILiveClass[]> {
    const now = new Date();
    return await this.find({
        scheduledAt: { $gte: now },
        status: 'scheduled'
    })
        .populate('instructor', 'firstName lastName avatar')
        .populate('course', 'title thumbnail')
        .sort({ scheduledAt: 1 })
        .limit(20);
};

// Get classes by instructor
liveClassSchema.statics.getClassesByInstructor = async function (instructorId: string): Promise<ILiveClass[]> {
    return await this.find({ instructor: instructorId })
        .populate('course', 'title thumbnail')
        .sort({ scheduledAt: -1 });
};

// ==================== Virtual Fields ====================

// Time until class starts (in minutes)
liveClassSchema.virtual('timeUntilStart').get(function () {
    if (!this.scheduledAt) return null;
    const now = new Date();
    const diff = this.scheduledAt.getTime() - now.getTime();
    return Math.floor(diff / 60000); // Convert to minutes
});

// Is class currently live?
liveClassSchema.virtual('isLive').get(function () {
    const now = new Date();
    return this.scheduledAt <= now && this.endTime! >= now && this.status === 'live';
});

// Export Model
export const LiveClass = model<ILiveClass, LiveClassModel>('LiveClass', liveClassSchema);
