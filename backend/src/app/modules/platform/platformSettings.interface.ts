// ===================================================================
// CreativeHub Backend - Platform Settings Interface
// Interface for platform-wide settings (module toggles, configs)
// ===================================================================

import { Types } from 'mongoose';

/**
 * Module enable/disable configuration
 */
export interface IEnabledModules {
    lms: {
        courses: boolean;
        modules: boolean;
        lessons: boolean;
        enrollments: boolean;
        certificates: boolean;
        liveClasses: boolean;
        webinars: boolean;
        quizResults: boolean;
    };
    marketplace: {
        graphics: boolean;
        videoTemplates: boolean;
        uiKits: boolean;
        appTemplates: boolean;
        audio: boolean;
        photos: boolean;
        fonts: boolean;
    };
    products: {
        websites: boolean;
        software: boolean;
    };
}

/**
 * IPlatformSettings - Global platform settings
 */
export interface IPlatformSettings {
    _id?: Types.ObjectId;
    key: 'enabled_modules' | 'site_info' | 'payment_config' | 'email_config';
    value: IEnabledModules | Record<string, any>;
    updatedBy?: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}
