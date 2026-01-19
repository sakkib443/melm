// ===================================================================
// CreativeHub LMS - Live Class Interface
// Live online class scheduling and management
// লাইভ ক্লাস শিডিউলিং এবং ম্যানেজমেন্ট
// ===================================================================

import { Model, Types } from 'mongoose';

/**
 * Meeting Type - Meeting platform types
 */
export type TMeetingType = 'zoom' | 'google-meet' | 'custom';

/**
 * Access Type - Who can access the class
 */
export type TAccessType = 'all-students' | 'enrolled-only' | 'targeted' | 'public';

/**
 * Class Status - Current status of the class
 */
export type TClassStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

/**
 * IAttendee - Attendee tracking
 */
export interface IAttendee {
    student: Types.ObjectId;
    joinedAt: Date;
    leftAt?: Date;
    duration: number; // in minutes
}

/**
 * ILiveClass - Main Live Class Interface
 * Database এ যে format এ live class data save হবে
 */
export interface ILiveClass {
    _id?: Types.ObjectId;

    // ==================== Basic Info ====================
    title: string;                    // Class title
    titleBn?: string;                 // Bengali title
    description?: string;             // Class description
    descriptionBn?: string;           // Bengali description

    // ==================== Instructor & Course ====================
    instructor: Types.ObjectId;       // Instructor reference
    course?: Types.ObjectId;          // Optional - for course-based classes

    // ==================== Meeting Details ====================
    meetingType: TMeetingType;        // Platform type
    meetingLink: string;              // Meeting URL
    meetingId?: string;               // Meeting ID (Zoom ID, Google Meet code)
    meetingPassword?: string;         // Password if required
    embedUrl?: string;                // Embeddable URL for iframe

    // ==================== Schedule ====================
    scheduledAt: Date;                // Start date/time
    duration: number;                 // Duration in minutes
    endTime?: Date;                   // Calculated end time
    timezone?: string;                // Timezone (default: Asia/Dhaka)

    // ==================== Access Control ====================
    accessType: TAccessType;          // Who can join
    targetedStudents?: Types.ObjectId[]; // Specific students (if targeted)
    isFree: boolean;                  // Is it a free class?
    price?: number;                   // Price if paid

    // ==================== Status ====================
    status: TClassStatus;             // Current status

    // ==================== Recording ====================
    recordingUrl?: string;            // Recording URL after class
    recordingAvailable: boolean;      // Is recording available?
    recordingPassword?: string;       // Recording password

    // ==================== Attendance ====================
    attendees: IAttendee[];           // Students who attended
    maxAttendees?: number;            // Maximum participants
    currentAttendees?: number;        // Current active participants

    // ==================== Notifications ====================
    notificationSent: boolean;        // Initial notification sent?
    reminderSent: boolean;            // Reminder sent?
    reminderTime?: number;            // Minutes before class to send reminder

    // ==================== Materials ====================
    materials?: string[];             // Downloadable materials URLs
    slides?: string;                  // Presentation slides URL

    // ==================== Chat/Q&A ====================
    enableChat: boolean;              // Enable chat during class?
    enableQA: boolean;                // Enable Q&A?

    // ==================== Statistics ====================
    totalAttendees: number;           // Total unique attendees
    averageAttendance: number;        // Average attendance percentage
    views: number;                    // Recording views

    // ==================== Timestamps ====================
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * ILiveClassFilters - Query Filters
 */
export interface ILiveClassFilters {
    searchTerm?: string;
    instructor?: string;
    course?: string;
    status?: TClassStatus;
    accessType?: TAccessType;
    dateFrom?: Date;
    dateTo?: Date;
}

/**
 * ILiveClassResponse - API Response format
 */
export interface ILiveClassResponse {
    liveClass: ILiveClass;
    canJoin: boolean;            // Can the user join?
    isEnrolled?: boolean;        // Is user enrolled (if course-based)?
    timeUntilStart?: number;     // Minutes until class starts
}

/**
 * LiveClassModel - Mongoose Model Type
 */
export interface LiveClassModel extends Model<ILiveClass> {
    isClassExists(id: string): Promise<boolean>;
    getUpcomingClasses(): Promise<ILiveClass[]>;
    getClassesByInstructor(instructorId: string): Promise<ILiveClass[]>;
}
