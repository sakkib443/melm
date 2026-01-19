// ===================================================================
// CreativeHub Backend - Platform Settings Model
// MongoDB schema for platform-wide settings
// ===================================================================

import { Schema, model } from 'mongoose';
import { IPlatformSettings } from './platformSettings.interface';

const platformSettingsSchema = new Schema<IPlatformSettings>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            enum: ['enabled_modules', 'site_info', 'payment_config', 'email_config'],
            index: true,
        },
        value: {
            type: Schema.Types.Mixed, // Flexible JSON object
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// Index for faster lookups
platformSettingsSchema.index({ key: 1 });

export const PlatformSettings = model<IPlatformSettings>('PlatformSettings', platformSettingsSchema);
