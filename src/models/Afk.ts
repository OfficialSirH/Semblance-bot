import type { Snowflake } from 'discord.js';
import _ from 'mongoose';

export interface AFKFormat {
  userId: Snowflake;
  reason: string;
}

const AfkSchema = new _.Schema<AFKFormat>({
  userId: String,
  reason: {
    type: String,
    default: 'Just because',
  },
});

export const Afk = _.model<AFKFormat>('Afk', AfkSchema, 'Afk');
