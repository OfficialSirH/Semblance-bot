import { Snowflake } from 'discord.js';
import { Model, Document } from 'mongoose';

export interface ReminderFormat extends Document {
    userID: Snowflake;
    reminder: string;
    remind: number;
}

export const Reminder: Model<ReminderFormat>;