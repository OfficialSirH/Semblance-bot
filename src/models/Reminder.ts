import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

export interface ReminderFormat extends Document {
    userId: Snowflake;
    reminders: UserReminder[];
}

export interface UserReminder {
    message: string;
    time: number;
    reminderId: number;
    channelId: Snowflake;
}

const ReminderSchema = new Schema({
    userId: String,
    reminder: Array
})

export const Reminder = model("Reminder", ReminderSchema, "Reminder") as Model<ReminderFormat>;