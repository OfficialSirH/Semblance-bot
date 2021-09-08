import type { Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface ReportFormat {
    User: Snowflake;
    bugId: number;
    messageId: Snowflake;
    channelId: Snowflake;
}

const ReportSchema = new Schema<ReportFormat>({
    User: String,
    bugId: Number,
    messageId: String,
    channelId: String
});

export const Report = model<ReportFormat>('Reports', ReportSchema, 'Reports');
