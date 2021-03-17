/// <reference types="node" />
import { EventEmitter } from 'events';
import { BotStats } from '../typings';
interface APIOptions {
    /**
     * Discordbotlist.com Token
     */
    token?: string;
}
/**
 * Discordbotlist.com API Client for Posting stats or Fetching data
 * @example
 * const Discordbotlist = require(`@bots-for-discord/sdk`)
 *
 * const api = new Discordbotlist.Api('Your discordbotlist.com token')
 */
export declare class Api extends EventEmitter {
    private options;
    /**
     * Create Discordbotlist.com API instance
     * @param {string} token Token or options
     * @param {object?} options API Options
     */
    constructor(token: string, options?: APIOptions);
    private _request;
    /**
     * @param {Object} stats bot stats
     * @param {number} stats.voice_connections number of voice connections
     * @param {number} stats.users number of users
     * @param {number} stats.guilds guild count
     * @param {number} stats.shard_id shard ID
     * @returns {Object} Passed stats
     * @example
     * await client.postStats({
     *   guilds: 28199
     * })
     */
    postStats(stats: Object): Promise<BotStats>;
}
export {};
