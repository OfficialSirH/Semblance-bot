import { Snowflake } from 'discord.js';
import { Model, Document } from 'mongoose';

export interface JumpFormat extends Document {
    guild: Snowflake;
    active: boolean;
}

export const Jump: Model<JumpFormat>;