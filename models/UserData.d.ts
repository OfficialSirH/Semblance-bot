import { Snowflake } from 'discord.js';
import { Model, Document } from 'mongoose';

export interface UserDataFormat extends Document {
    discordId: Snowflake;
    token: string;
    metabits: number;
    dino_rank: number;
    prestige_rank: number;
    singularity_speedrun_time: number;
    all_sharks_obtained: boolean;
    all_hidden_achievements_obtained: boolean;
    edited_timestamp: number;
}

export const UserData: Model<UserDataFormat>;