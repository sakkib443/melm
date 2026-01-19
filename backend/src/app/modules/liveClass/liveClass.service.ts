// ===================================================================
// CreativeHub LMS - Live Class Service
// Business logic for live class management
// লাইভ ক্লাস ম্যানেজমেন্টের বিজনেস লজিক
// ===================================================================

import { Types } from 'mongoose';
import { LiveClass } from './liveClass.model';
import { ILiveClass, ILiveClassFilters } from './liveClass.interface';
import AppError from '../../utils/AppError';
import { User } from '../user/user.model';
import { Course } from '../course/course.model';
import { Enrollment } from '../enrollment/enrollment.model';
import { NotificationService } from '../notification/notification.module';
import EmailService from '../email/email.service';

/**
 * Create a new live class
 * নতুন লাইভ ক্লাস তৈরি করা
 */
const createLiveClass = async (
    instructorId: string,
    payload: Partial<ILiveClass>
): Promise<ILiveClass> => {
    // Verify instructor exists
    const instructor = await User.findById(instructorId);
    if (!instructor) {
        throw new AppError(404, 'Instructor not found');
    }

    // If course-based, verify course exists
    if (payload.course) {
        const course = await Course.findById(payload.course);
        if (!course) {
            throw new AppError(404, 'Course not found');
        }
    }

    // Validate scheduled time is in future
    const scheduledAt = new Date(payload.scheduledAt!);
    if (scheduledAt <= new Date()) {
        throw new AppError(400, 'Scheduled time must be in the future');
    }

    // Create live class
    const liveClass = await LiveClass.create({
        ...payload,
        instructor: instructorId,
        scheduledAt
    });

    // Send notifications asynchronously
    sendInitialNotifications(liveClass).catch(err =>
        console.error('Failed to send initial notifications:', err)
    );

    return liveClass;
};

/**
 * Send initial notifications to students
 */
const sendInitialNotifications = async (liveClass: any): Promise<void> => {
    const populatedClass = await LiveClass.findById(liveClass._id)
        .populate('instructor', 'firstName lastName')
        .populate('course', 'title');

    let recipients: string[] = [];

    // Determine recipients based on access type
    if (liveClass.accessType === 'all-students') {
        // Get all students
        const allStudents = await User.find({ role: 'student' }).select('_id email firstName');
        recipients = allStudents.map(s => s._id.toString());
    } else if (liveClass.accessType === 'enrolled-only' && liveClass.course) {
        // Get enrolled students
        const enrollments = await Enrollment.find({ course: liveClass.course }).select('student');
        recipients = enrollments.map(e => e.student.toString());
    } else if (liveClass.accessType === 'targeted' && liveClass.targetedStudents) {
        recipients = liveClass.targetedStudents.map((id: Types.ObjectId) => id.toString());
    }

    // Send notifications to all recipients
    if (recipients.length > 0) {
        const instructorName = `${(populatedClass as any).instructor.firstName} ${(populatedClass as any).instructor.lastName || ''}`.trim();
        const title = `New Live Class: ${liveClass.title}`;
        const message = `${instructorName} has scheduled a live class "${liveClass.title}" on ${new Date(liveClass.scheduledAt).toLocaleString('bn-BD')}`;

        // Create notifications for each recipient
        for (const recipientId of recipients) {
            try {
                await NotificationService.createNotification({
                    recipient: new Types.ObjectId(recipientId),
                    title,
                    message,
                    type: 'live-class',
                    referenceId: liveClass._id,
                    actionUrl: `/live-class/${liveClass._id}`,
                    channels: {
                        inApp: true,
                        email: true,
                        push: false
                    }
                });

                // Send email
                const student = await User.findById(recipientId);
                if (student) {
                    EmailService.sendLiveClassNotification(student.email, {
                        studentName: student.firstName,
                        className: liveClass.title,
                        instructorName,
                        scheduledAt: liveClass.scheduledAt,
                        duration: liveClass.duration,
                        joinUrl: `${process.env.FRONTEND_URL}/live-class/${liveClass._id}`
                    }).catch(err => console.error('Email send error:', err));
                }
            } catch (error) {
                console.error(`Failed to notify student ${recipientId}:`, error);
            }
        }

        // Mark notification as sent
        await LiveClass.findByIdAndUpdate(liveClass._id, { notificationSent: true });
    }
};

/**
 * Get all live classes with filters
 */
const getAllLiveClasses = async (
    filters: ILiveClassFilters,
    paginationOptions: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }
): Promise<{ data: ILiveClass[]; total: number }> => {
    const {
        searchTerm,
        instructor,
        course,
        status,
        accessType,
        dateFrom,
        dateTo
    } = filters;

    const { page = 1, limit = 10, sortBy = 'scheduledAt', sortOrder = 'asc' } = paginationOptions;

    // Build query
    const query: any = {};

    if (searchTerm) {
        query.$or = [
            { title: { $regex: searchTerm, $options: 'i' } },
            { titleBn: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    if (instructor) query.instructor = instructor;
    if (course) query.course = course;
    if (status) query.status = status;
    if (accessType) query.accessType = accessType;

    if (dateFrom || dateTo) {
        query.scheduledAt = {};
        if (dateFrom) query.scheduledAt.$gte = new Date(dateFrom);
        if (dateTo) query.scheduledAt.$lte = new Date(dateTo);
    }

    // Execute query
    const skip = (page - 1) * limit;
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [data, total] = await Promise.all([
        LiveClass.find(query)
            .populate('instructor', 'firstName lastName avatar')
            .populate('course', 'title thumbnail')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit),
        LiveClass.countDocuments(query)
    ]);

    return { data, total };
};

/**
 * Get single live class by ID
 */
const getLiveClassById = async (id: string): Promise<ILiveClass> => {
    const liveClass = await LiveClass.findById(id)
        .populate('instructor', 'firstName lastName avatar email')
        .populate('course', 'title thumbnail description');

    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    return liveClass;
};

/**
 * Update live class
 */
const updateLiveClass = async (
    id: string,
    payload: Partial<ILiveClass>
): Promise<ILiveClass> => {
    const liveClass = await LiveClass.findById(id);
    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    // Update
    const updated = await LiveClass.findByIdAndUpdate(
        id,
        payload,
        { new: true, runValidators: true }
    );

    return updated!;
};

/**
 * Delete live class
 */
const deleteLiveClass = async (id: string): Promise<void> => {
    const liveClass = await LiveClass.findById(id);
    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    await LiveClass.findByIdAndDelete(id);
};

/**
 * Join live class (track attendance)
 */
const joinLiveClass = async (
    classId: string,
    studentId: string
): Promise<{ success: boolean; meetingLink: string }> => {
    const liveClass = await LiveClass.findById(classId);
    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    // Check if class is live or upcoming
    const now = new Date();
    const timeUntilStart = liveClass.scheduledAt.getTime() - now.getTime();
    const minutesUntilStart = Math.floor(timeUntilStart / 60000);

    // Allow joining 10 minutes before scheduled time
    if (minutesUntilStart > 10) {
        throw new AppError(400, `Class will start in ${minutesUntilStart} minutes. Please join later.`);
    }

    // Check access permissions
    if (liveClass.accessType === 'enrolled-only' && liveClass.course) {
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: liveClass.course
        });
        if (!enrollment) {
            throw new AppError(403, 'You must be enrolled in the course to join this class');
        }
    } else if (liveClass.accessType === 'targeted') {
        const isTargeted = liveClass.targetedStudents?.some(
            (id: Types.ObjectId) => id.toString() === studentId
        );
        if (!isTargeted) {
            throw new AppError(403, 'You are not invited to this class');
        }
    }

    // Check max attendees
    if (liveClass.maxAttendees && liveClass.currentAttendees! >= liveClass.maxAttendees) {
        throw new AppError(400, 'This class has reached maximum capacity');
    }

    // Track attendance
    const existingAttendee = liveClass.attendees.find(
        (a: any) => a.student.toString() === studentId
    );

    if (!existingAttendee) {
        liveClass.attendees.push({
            student: new Types.ObjectId(studentId),
            joinedAt: now,
            duration: 0
        } as any);
        liveClass.currentAttendees = (liveClass.currentAttendees || 0) + 1;
        await liveClass.save();
    }

    return {
        success: true,
        meetingLink: liveClass.embedUrl || liveClass.meetingLink
    };
};

/**
 * Leave live class (update attendance duration)
 */
const leaveLiveClass = async (
    classId: string,
    studentId: string
): Promise<void> => {
    const liveClass = await LiveClass.findById(classId);
    if (!liveClass) {
        throw new AppError(404, 'Live class not found');
    }

    const attendee = liveClass.attendees.find(
        (a: any) => a.student.toString() === studentId && !a.leftAt
    );

    if (attendee) {
        const now = new Date();
        (attendee as any).leftAt = now;
        (attendee as any).duration = Math.floor((now.getTime() - (attendee as any).joinedAt.getTime()) / 60000);
        liveClass.currentAttendees = Math.max((liveClass.currentAttendees || 1) - 1, 0);
        await liveClass.save();
    }
};

/**
 * Get upcoming classes for a student
 */
const getUpcomingClassesForStudent = async (
    studentId: string
): Promise<ILiveClass[]> => {
    const now = new Date();

    // Get all enrollments for the student
    const enrollments = await Enrollment.find({ student: studentId }).select('course');
    const courseIds = enrollments.map(e => e.course);

    // Find upcoming classes
    const classes = await LiveClass.find({
        scheduledAt: { $gte: now },
        status: 'scheduled',
        $or: [
            { accessType: 'all-students' },
            { accessType: 'public' },
            { accessType: 'enrolled-only', course: { $in: courseIds } },
            { accessType: 'targeted', targetedStudents: studentId }
        ]
    })
        .populate('instructor', 'firstName lastName avatar')
        .populate('course', 'title thumbnail')
        .sort({ scheduledAt: 1 })
        .limit(10);

    return classes;
};

// Export service
export const LiveClassService = {
    createLiveClass,
    getAllLiveClasses,
    getLiveClassById,
    updateLiveClass,
    deleteLiveClass,
    joinLiveClass,
    leaveLiveClass,
    getUpcomingClassesForStudent
};
