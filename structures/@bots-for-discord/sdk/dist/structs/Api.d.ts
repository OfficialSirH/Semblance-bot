/// <reference types="node" />
import { EventEmitter } from 'events';
import { Snowflake, BotStats, BotInfo, UserInfo, BotsResponse, ShortUser, UserBots } from '../typings';
interface APIOptions {
    /**
     * Botsfordiscord.com Token
     */
    token?: string;
}
/**
 * Botsfordiscord.com API Client for Posting stats or Fetching data
 * @example
 * const Botsfordiscord = require(`@bots-for-discord/sdk`)
 *
 * const api = new Botsfordiscord.Api('Your botsfordiscord.com token')
 */
export declare class Api extends EventEmitter {
    private options;
    /**
     * Create Botsfordiscord.com API instance
     * @param {string} token Token or options
     * @param {object?} options API Options
     */
    constructor(token: string, options?: APIOptions);
    private _request;
    /**
     * Post bot stats to Botsfordiscord.com (Do not use if you supplied a client)
     * @param {number} serverCount Server count
     * @returns {number} Passed server count
     * @example
     * await client.postStats({
     *   server_count: 28199,
     * })
     */
    postStats(serverCount: number): Promise<BotStats>;
    /**
     * Get bot info
     * @param {Snowflake} id Bot ID
     * @returns {BotInfo} Info for bot
     * @example
     * await client.getBot('794033850665533450') // returns bot info
     */
    getBot(id: Snowflake): Promise<BotInfo>;
    /**
     * Get user's bots
     * @param {Snowflake} id User ID
     * @returns {UserBots} user's bots
     * @example
     * await client.getUserBots('780995336293711875')
     * // =>
     * { bots: [ '794033850665533450' ] }
     */
    getUserBots(id: Snowflake): Promise<UserBots>;
    /**
     * Get user info
     * @param {Snowflake} id User ID
     * @returns {UserInfo} Info for user
     * @example
     * await client.getUser('205680187394752512')
     * // =>
     * user.username // Xignotic
     */
    getUser(id: Snowflake): Promise<UserInfo>;
    /**
     * Get users who've voted
     * @returns {ShortUser} Array of all types of votes
     * @example
     * await client.getVotes()
     * // =>
     * {
     * "hasVoted": ['780995336293711875'],
     * "hasVoted24": ['780995336293711875'],
     * "votes": 3,
     * "votes24": 1,
     * "votesMonth": 3
     * }
     */
    getVotes(): Promise<ShortUser>;
}
export {};
