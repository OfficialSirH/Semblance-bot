import type { Snowflake } from 'discord.js';
import _ from 'mongoose';

export interface VotesFormat {
  user: Snowflake;
  voteCount: number;
}

const VotesSchema = new _.Schema<VotesFormat>({
  user: String,
  voteCount: {
    default: 1,
    type: Number,
  },
});

export const Votes = _.model<VotesFormat>('Votes', VotesSchema, 'Votes');
