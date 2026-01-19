// ===================================================================
// CreativeHub - Webinar/Seminar Interface
// Free seminars, webinars, and workshops
// ===================================================================

import { Model, Types } from 'mongoose';

export type TWebinarType = 'seminar' | 'webinar' | 'workshop' | 'free-class';
export type TWebinarStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface IWebinar {
    _id?: Types.ObjectId;

    title: string;
    titleBn?: string;
    description: string;
    descriptionBn?: string;

    instructor: Types.ObjectId;
    type: TWebinarType;

    // Meeting
    meetingLink: string;
    meetingPassword?: string;

    // Schedule
    scheduledAt: Date;
    duration: number; // minutes
    endTime?: Date;

    // Registration
    isFree: boolean;
    price?: number;
    maxParticipants?: number;
    registeredUsers: Types.ObjectId[];
    registrationDeadline?: Date;

    // Materials
    materials?: string[];
    thumbnail?: string;

    // Status
    status: TWebinarStatus;

    // Stats
    totalRegistrations: number;
    totalAttendees: number;

    createdAt?: Date;
    updatedAt?: Date;
}

export interface IWebinarFilters {
    searchTerm?: string;
    type?: TWebinarType;
    status?: TWebinarStatus;
    instructor?: string;
    isFree?: boolean;
}

export interface WebinarModel extends Model<IWebinar> {
    getUpcomingWebinars(): Promise<IWebinar[]>;
}
