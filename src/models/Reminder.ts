import type { Snowflake } from 'discord.js';
import _ from 'mongoose';

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

const ReminderSchema = new _.Schema<ReminderFormat>({
  userId: String,
  reminders: Array,
});

export const Reminder = _.model<ReminderFormat>('Reminder', ReminderSchema, 'Reminder');
