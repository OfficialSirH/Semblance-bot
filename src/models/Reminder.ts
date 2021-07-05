import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

export interface ReminderFormat extends Document {
    userId: Snowflake;
    reminder: string;
    remind: number;
}

const ReminderSchema = new Schema({
    userId: String,
    reminder: {
        type: String,
        default: "Just because"
    },
    remind: Number
})

export const Reminder = model("Reminder", ReminderSchema, "Reminder") as Model<ReminderFormat>;