import type { Snowflake } from 'discord.js';
import _ from 'mongoose';

export interface GameFormat {
  player: Snowflake;
  money: number;
  percentIncrease: number;
  baseCost: number;
  cost: number;
  level: number;
  checkedLevel: number;
  idleCollection: number;
  idleProfit: number;
}

const GameSchema = new _.Schema<GameFormat>({
  player: String,
  money: {
    default: 0,
    type: Number,
  },
  percentIncrease: Number,
  baseCost: {
    default: 1,
    type: Number,
  },
  cost: {
    default: 0,
    type: Number,
  },
  level: {
    default: 0,
    type: Number,
  },
  checkedLevel: {
    default: 0,
    type: Number,
  },
  idleCollection: Number,
  idleProfit: Number,
});

export const Game = _.model<GameFormat>('Game', GameSchema, 'games');
