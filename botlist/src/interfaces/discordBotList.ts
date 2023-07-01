import type { Snowflake } from 'discord-api-types/globals';
import type { FastifyRequest } from 'fastify';

export interface BotStats {
  /**
   * The amount of voice connections.
   */
  voice_connections?: number;
  /**
   * The amount of users.
   */
  users?: number;
  /**
   * The amount of servers the bot is in
   */
  guilds: number;
  /**
   * The shard Id
   */
  shard_id?: number;
}
export interface DBLVote {
  /**
   * If the user is a site administrator
   */
  admin?: boolean;
  /**
   * The avatar hash of the user
   */
  avatar?: string;
  /**
   * The username of the user who voted
   */
  username: string;
  /**
   * The Id of the user who voted
   */
  id: Snowflake;
}

export type DBLRequest = FastifyRequest<{ Body: DBLVote }>;
