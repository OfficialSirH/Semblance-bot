// TODO: remove jump structure and collection
import type { Snowflake } from 'discord.js';
import _ from 'mongoose';

export interface JumpFormat {
  userId: Snowflake;
  active: boolean;
}

const JumpSchema = new _.Schema<JumpFormat>({
  userId: String,
  active: {
    default: true,
    type: Boolean,
  },
});

export const Jump = _.model<JumpFormat>('JumpToggle', JumpSchema, 'JumpToggle');
