import { Snowflake } from 'discord.js';
import { Schema, model } from 'mongoose';

export interface BoosterRewardsFormat {
    userId: Snowflake;
    rewardingDate: number;
}

const BoosterRewardsSchema = new Schema<BoosterRewardsFormat>({
    userId: String,
    rewardingDate: Number
})

export const BoosterRewards = model<BoosterRewardsFormat>("BoosterRewards", BoosterRewardsSchema, "BoosterRewards");