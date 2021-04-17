import { Schema, model, Document, Model } from 'mongoose';
import { Snowflake } from 'discord.js';

export interface BugReport extends Document {
    User: Snowflake;
    bugID: number;
    messageID: Snowflake;
    channelID: Snowflake;
}

const ReportSchema = new Schema({
    User: String,
    bugID: Number,
    messageID: String,
    channelID: String
});

export const Report: Model<BugReport> = model('Reports', ReportSchema, 'Reports');