import type { Snowflake } from 'discord.js';
import _ from 'mongoose';

export interface BoosterRewardsFormat {
  userId: Snowflake;
  rewardingDate: number;
}

const BoosterRewardsSchema = new _.Schema<BoosterRewardsFormat>({
  userId: String,
  rewardingDate: Number,
});

export const BoosterRewards = _.model<BoosterRewardsFormat>('BoosterRewards', BoosterRewardsSchema, 'BoosterRewards');
