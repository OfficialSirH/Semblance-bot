import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

export interface VotesFormat extends Document {
    user: Snowflake;
    voteCount: number;
}

const VotesSchema = new Schema({
    user: String,
    voteCount: {
        default: 1,
        type: Number
    }
});

export const Votes = model<VotesFormat>('Votes', VotesSchema, 'Votes');