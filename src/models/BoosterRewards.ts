import { Snowflake } from 'discord.js';
import { Document, Schema, model } from 'mongoose';

export interface BoosterRewardsFormat extends Document {
    userId: Snowflake;
    rewardingDate: number;
}

const BoosterRewardsSchema = new Schema({
    userId: String,
    rewardingDate: Number
})

export const BoosterRewards = model<BoosterRewardsFormat>("BoosterRewards", BoosterRewardsSchema, "BoosterRewards");