import { Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface VotesFormat {
    user: Snowflake;
    voteCount: number;
}

const VotesSchema = new Schema<VotesFormat>({
    user: String,
    voteCount: {
        default: 1,
        type: Number
    }
});

export const Votes = model<VotesFormat>('Votes', VotesSchema, 'Votes');