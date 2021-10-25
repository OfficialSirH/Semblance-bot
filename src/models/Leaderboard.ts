import type { Snowflake } from 'discord.js';
import _ from 'mongoose';

export interface LeaderboardFormat {
  type: leaderboardType;
  list: rankedUser[];
}

type leaderboardType = 'game' | 'vote';

interface rankedUser {
  user: Snowflake;
  level?: number;
  voteCount?: number;
}

const LeaderboardSchema = new _.Schema<LeaderboardFormat>({
  type: String,
  list: Array,
});

export const Leaderboard = _.model<LeaderboardFormat>('Leaderboard', LeaderboardSchema, 'Leaderboard');
