import type { Snowflake } from 'discord.js';
import type { FastifyRequest } from 'fastify';

export interface bot {
  id: Snowflake;
  name: string;
}

export interface user {
  id: Snowflake;
  username: string;
  discriminator: number;
}

export interface BoatsVote {
  /**
   * Bot that was voted for
   */
  bot: bot;
  /**
   * User that voted for the bot
   */
  user: user;
}

export type BoatsRequest = FastifyRequest<{ Body: BoatsVote }>;
