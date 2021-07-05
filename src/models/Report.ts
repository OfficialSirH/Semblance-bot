import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

export interface ReportFormat extends Document {
    User: Snowflake;
    bugId: number;
    messageId: Snowflake;
    channelId: Snowflake;
}

const ReportSchema = new Schema({
    User: String,
    bugId: Number,
    messageId: String,
    channelId: String
});

export const Report = model('Reports', ReportSchema, 'Reports') as Model<ReportFormat>;
