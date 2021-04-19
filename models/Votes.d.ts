import { Snowflake } from 'discord.js';
import { Model, Document } from 'mongoose';

export interface VotesFormat extends Document {
    user: Snowflake;
    voteCount: number;
}

export const Votes: Model<VotesFormat>;