import { Snowflake } from 'discord.js';
import { Model, Document } from 'mongoose';

export interface GameFormat extends Document {
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

export const Game: Model<GameFormat>;