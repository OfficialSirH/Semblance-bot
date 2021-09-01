import { Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface JumpFormat {
    userId: Snowflake;
    active: boolean;
}

const JumpSchema = new Schema<JumpFormat>({
    userId: String,
    active: {
        default: true,
        type: Boolean
    }
});

export const Jump = model<JumpFormat>('JumpToggle', JumpSchema, 'JumpToggle');