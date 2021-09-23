import { EventEmitter } from 'events';
import type { BotStats } from '@semblance/lib/interfaces/discordBotList';
import fetch, { Headers } from 'node-fetch';
import { APIError } from './ApiError';
import { stringify } from 'querystring';

/**
 * discordbotlist.com API Client for Posting stats or Fetching data
 * @example
 * const Discordbotlist = require(`./structures/DiscordBotListAPI`)
 *
 * const api = new Discordbotlist.DBLApi('Your discordbotlist.com token')
 */
export class DBLApi extends EventEmitter {
    private options: {
        token: string,
        [key: string]: any
    }
    /**
     * Create discordbotlist.com API instance
     * @param {string} token Token or options
     * @param {object?} options API Options
     */
    constructor(token: string, options: object | null = {}) {
        super();
        this.options = {
            token: token,
            ...options
        };
    }
    async _request(method: string, path: string, body?: any) {
        var _a;
        const headers = new Headers();
        if (this.options.token)
            headers.set('Authorization', this.options.token);
        if (method !== 'GET')
            headers.set('Content-Type', 'application/json');
        let url = `https://discordbotlist.com/api/v1/${path}`;
        if (body && method === 'GET')
            url += `?${stringify(body)}`;
        const response = await fetch(url, {
            method,
            headers,
            body: body && method !== 'GET' ? JSON.stringify(body) : null
        });
        let responseBody;
        if ((_a = response.headers.get('Content-Type')) === null || _a === void 0 ? void 0 : _a.startsWith('application/json')) {
            responseBody = await response.json();
        }
        else {
            responseBody = await response.text();
        }
        if (!response.ok) {
            throw new APIError('discordbotlist.com', response.status, response.statusText, responseBody);
        }
        return responseBody;
    }
    /**
     * @param {BotStats} stats bot stats
     * @param {number} stats.voice_connections number of voice connections
     * @param {number} stats.users number of users
     * @param {number} stats.guilds guild count
     * @param {number} stats.shard_id shard Id
     * @returns {BotStats} Passed stats
     * @example
     * await client.postStats({
     *   guilds: 28199
     * })
     */
    async postStats(stats: BotStats): Promise<BotStats> {
        if (!stats || !stats.guilds) throw new Error('Missing guilds');
        await this._request('POST', `/bots/794033850665533450/stats`, {
            voice_connections: stats.voice_connections,
            users: stats.users,
            guilds: stats.guilds,
            shard_id: stats.shard_id
        });
        return stats;
    }
}
