import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

export interface ReportFormat extends Document {
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

export const Report = model('Reports', ReportSchema, 'Reports') as Model<ReportFormat>;
