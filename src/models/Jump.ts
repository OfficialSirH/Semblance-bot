import { Snowflake } from 'discord.js';
import { Document, Schema, model } from 'mongoose';

export interface JumpFormat extends Document {
    userId: Snowflake;
    active: boolean;
}

const JumpSchema = new Schema({
    userId: String,
    active: {
        default: true,
        type: Boolean
    }
});

export const Jump = model<JumpFormat>('JumpToggle', JumpSchema, 'JumpToggle');