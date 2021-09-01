import { Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface LeaderboardFormat {
    type: leaderboardType;
    list: rankedUser[]
}

type leaderboardType = 'game' | 'vote';

interface rankedUser {
    user: Snowflake;
    level?: number;
    voteCount?: number;
}

const LeaderboardSchema = new Schema<LeaderboardFormat>({
    type: String,
    list: Array
});

export const Leaderboard = model<LeaderboardFormat>('Leaderboard', LeaderboardSchema, 'Leaderboard');