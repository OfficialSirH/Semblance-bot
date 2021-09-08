import type { Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface ReminderFormat {
    userId: Snowflake;
    reminders: UserReminder[];
}

export interface UserReminder {
    message: string;
    time: number;
    reminderId: number;
    channelId: Snowflake;
}

const ReminderSchema = new Schema<ReminderFormat>({
    userId: String,
    reminders: Array
})

export const Reminder = model<ReminderFormat>("Reminder", ReminderSchema, "Reminder");