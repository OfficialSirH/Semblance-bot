import { Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface AFKFormat {
    userId: Snowflake;
    reason: string;
}

const AfkSchema = new Schema<AFKFormat>({
    userId: String,
    reason: {
        type: String,
        default: "Just because"
    }
})

export const Afk = model<AFKFormat>("Afk", AfkSchema, "Afk");