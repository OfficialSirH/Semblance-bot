import { Snowflake } from 'discord.js';
import { Model, Document } from 'mongoose';

export interface ReportFormat extends Document {
    User: Snowflake;
    bugID: number;
    messageID: Snowflake;
    channelID: Snowflake;
}

export const Report: Model<ReportFormat>;