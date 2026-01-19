// ===================================================================
// CreativeHub LMS - Live Class Validation
// Zod validation schemas for live class endpoints
// লাইভ ক্লাসের Zod validation
// ===================================================================

import { z } from 'zod';

/**
 * Create Live Class Validation
 */
export const createLiveClassValidation = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }).min(3).max(200),
        titleBn: z.string().min(3).max(200).optional(),
        description: z.string().optional(),
        descriptionBn: z.string().optional(),

        course: z.string().optional(), // Course ID

        meetingType: z.enum(['zoom', 'google-meet', 'custom'], {
            required_error: 'Meeting type is required'
        }),
        meetingLink: z.string({ required_error: 'Meeting link is required' }).url(),
        meetingId: z.string().optional(),
        meetingPassword: z.string().optional(),
        embedUrl: z.string().url().optional(),

        scheduledAt: z.string({ required_error: 'Schedule date/time is required' }),
        duration: z.number({ required_error: 'Duration is required' }).min(15).max(480),
        timezone: z.string().optional(),

        accessType: z.enum(['all-students', 'enrolled-only', 'targeted', 'public']).default('all-students'),
        targetedStudents: z.array(z.string()).optional(),
        isFree: z.boolean().default(true),
        price: z.number().min(0).optional(),

        maxAttendees: z.number().min(1).optional(),
        reminderTime: z.number().min(5).max(1440).optional(), // 5 min to 24 hours

        materials: z.array(z.string().url()).optional(),
        slides: z.string().url().optional(),

        enableChat: z.boolean().default(true),
        enableQA: z.boolean().default(true)
    })
});

/**
 * Update Live Class Validation
 */
export const updateLiveClassValidation = z.object({
    body: z.object({
        title: z.string().min(3).max(200).optional(),
        titleBn: z.string().min(3).max(200).optional(),
        description: z.string().optional(),
        descriptionBn: z.string().optional(),

        meetingLink: z.string().url().optional(),
        meetingPassword: z.string().optional(),
        embedUrl: z.string().url().optional(),

        scheduledAt: z.string().optional(),
        duration: z.number().min(15).max(480).optional(),

        status: z.enum(['scheduled', 'live', 'completed', 'cancelled']).optional(),

        recordingUrl: z.string().url().optional(),
        recordingAvailable: z.boolean().optional(),
        recordingPassword: z.string().optional(),

        materials: z.array(z.string().url()).optional(),
        slides: z.string().url().optional(),

        enableChat: z.boolean().optional(),
        enableQA: z.boolean().optional()
    })
});

/**
 * Join Live Class Validation
 */
export const joinLiveClassValidation = z.object({
    params: z.object({
        id: z.string({ required_error: 'Class ID is required' })
    })
});

/**
 * Track Attendance Validation
 */
export const trackAttendanceValidation = z.object({
    body: z.object({
        classId: z.string({ required_error: 'Class ID is required' }),
        action: z.enum(['join', 'leave'], { required_error: 'Action is required' })
    })
});
