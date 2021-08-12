import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

export interface JumpFormat extends Document {
    guild: Snowflake;
    active: boolean;
}

const JumpSchema = new Schema({
    guild: String,
    active: {
        default: true,
        type: Boolean
    }
});

export const Jump = model<JumpFormat>('JumpToggle', JumpSchema, 'JumpToggle');