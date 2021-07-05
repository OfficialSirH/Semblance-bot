import { Snowflake } from 'discord.js';
import { Model, Document, Schema, model } from 'mongoose';

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

const UserDataSchema = new Schema({
    discordId: {
        type: String,
        required: 'A user\'s Discord Id is required to create a saved entry'
    },
    token: {
        type: String,
        required: 'An HMAC-SHA Token is required to create a saved entry'
    },
    metabits: {
        type: Number,
        default: 0
    },
    dino_rank: {
        type: Number,
        default: 0
    },
    prestige_rank: {
        type: Number,
        default: 0
    },
    singularity_speedrun_time: {
        type: Number,
        default: null
    },
    all_sharks_obtained: {
        type: Boolean,
        default: false
    },
    all_hidden_achievements_obtained: {
        type: Boolean,
        default: false
    },
    edited_timestamp: {
        type: Number,
        default: Date.now
    }
});

export const UserData = model('UserData', UserDataSchema, 'UserData') as Model<UserDataFormat>;