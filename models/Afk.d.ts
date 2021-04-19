import { Snowflake } from 'discord.js';
import { Model, Document } from 'mongoose';

export interface AfkFormat extends Document {
    userID: Snowflake;
    reason: string;
}

export const Afk: Model<AfkFormat>;