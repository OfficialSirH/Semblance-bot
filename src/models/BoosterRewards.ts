import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

export interface BoosterRewardsFormat extends Document {
    userId: Snowflake;
    rewardingDate: number;
}

const BoosterRewardsSchema = new Schema({
    userId: String,
    rewardingDate: {
        type: Number,
        default: Date.now() + 1000 * 60 * 60 * 24 * 14
    },
})

export const BoosterRewards = model("BoosterRewards", BoosterRewardsSchema, "BoosterRewards") as Model<BoosterRewardsFormat>;