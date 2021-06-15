import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

export interface LeaderboardFormat extends Document {
    type: leaderboardType;
    list: rankedUser[]
}

type leaderboardType = 'game' | 'vote';

interface rankedUser {
    user: Snowflake;
    level?: number;
    voteCount?: number;
}

const LeaderboardSchema = new Schema({
    type: String,
    list: Array
});

export const Leaderboard = model('Leaderboard', LeaderboardSchema, 'Leaderboard') as Model<LeaderboardFormat>;