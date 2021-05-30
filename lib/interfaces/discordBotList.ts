import { Semblance } from '@semblance/src/structures';
import { Snowflake } from 'discord.js';
import { Request } from 'express';

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
     * The shard ID
     */
    shard_id?: number;
}
export interface vote {
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
     * The ID of the user who voted
     */
    id: Snowflake;
}

export interface request extends Request {
    vote: vote;
    client: Semblance;
}