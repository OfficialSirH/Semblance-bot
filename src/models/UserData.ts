import type { Snowflake } from 'discord.js';
import _ from 'mongoose';

export interface UserDataFormat {
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

const UserDataSchema = new _.Schema<UserDataFormat>({
  discordId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  metabits: {
    type: Number,
    default: 0,
  },
  dino_rank: {
    type: Number,
    default: 0,
  },
  prestige_rank: {
    type: Number,
    default: 0,
  },
  singularity_speedrun_time: {
    type: Number,
    default: null,
  },
  all_sharks_obtained: {
    type: Boolean,
    default: false,
  },
  all_hidden_achievements_obtained: {
    type: Boolean,
    default: false,
  },
  edited_timestamp: {
    type: Number,
  },
});

export const UserData = _.model<UserDataFormat>('UserData', UserDataSchema, 'UserData');
