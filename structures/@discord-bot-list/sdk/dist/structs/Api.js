"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const node_fetch_1 = __importStar(require("node-fetch"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const querystring_1 = __importDefault(require("querystring"));
const events_1 = require("events");
/**
 * botsfordiscord.com API Client for Posting stats or Fetching data
 * @example
 * const Botsfordiscord = require(`./structures/@bots-for-discord/sdk`)
 *
 * const api = new Botsfordiscord.Api('Your botsfordiscord.com token')
 */
class Api extends events_1.EventEmitter {
    /**
     * Create botsfordiscord.com API instance
     * @param {string} token Token or options
     * @param {object?} options API Options
     */
    constructor(token, options = {}) {
        super();
        this.options = {
            token: token,
            ...options
        };
    }
    async _request(method, path, body) {
        var _a;
        const headers = new node_fetch_1.Headers();
        if (this.options.token)
            headers.set('Authorization', this.options.token);
        if (method !== 'GET')
            headers.set('Content-Type', 'application/json');
        let url = `https://botsfordiscord.com/api/${path}`;
        // @ts-ignore querystring typings are messed
        if (body && method === 'GET')
            url += `?${querystring_1.default.stringify(body)}`;
        const response = await node_fetch_1.default(url, {
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
            throw new ApiError_1.default(response.status, response.statusText, responseBody);
        }
        return responseBody;
    }
    /**
     * @param {number} serverCount Server count
     * @returns {number} Passed server count
     * @example
     * await client.postStats({
     *   serverCount: 28199
     * })
     */
    async postStats(serverCount) {
        if (!serverCount) throw new Error('Missing Server Count');
        await this._request('POST', `/bot/794033850665533450`, {
            server_count: serverCount
        });
        return serverCount;
    }
    /**
     * Get bot info
     * @param {Snowflake} id Bot ID
     * @returns {BotInfo} Info for bot
     * @example
     * await client.getBot('794033850665533450') // returns bot info
     */
    async getBot(id) {
        if (!id)
            throw new Error('ID Missing');
        return this._request('GET', `/bot/${id}`);
    }
    /**
     * Get bot's vote info
     * @returns {BotVotes} bot's vote info
     * @example
     * await client.getVotes() // returns bot's vote info
     */
    async getVotes() {
        return this._request('GET', `/bot/794033850665533450/votes`);
    }
    /**
     * Get bot's widget
     * @param {Snowflake} id Bot ID
     * @param {Number} width The width of the widget
     * @param {String} theme The theme of the widget
     * @returns {Widget} the bot's widget
     * @example
     * await client.getBotWidget('794033850665533450', 480, 'dark') // returns bot's widget
     */
    async getBotWidget(id, width, theme) {
        if (!id) throw new Error('ID Missing');
        if (!width && !theme)
            return this._request('GET', `/bot/${id}/widget`);
        if (!width)
            return this._request('GET', `/bot/${id}/widget`, { theme });
        if (!theme)
            return this._request('GET', `/bot/${id}/widget`, { width });
        
    }
    /**
     * Get user info
     * @param {Snowflake} id User ID
     * @returns {UserInfo} Info for user
     * @example
     * await client.getUser('780995336293711875')
     * // =>
     * user.username // SirH
     */
    async getUser(id) {
        if (!id)
            throw new Error('ID Missing');
        return this._request('GET', `/user/${id}`);
    }

    /**
     * Get user's bots
     * @param {Snowflake} id User ID
     * @returns {UserBots} user's bots
     * @example
     * await client.getUserBots('780995336293711875')
     * // =>
     * 
     */
    async getUserBots(id) {
        if (!id) throw new Error('ID Missing');
        return this._request('GET', `/user/${id}/bots`);
    }
}
exports.Api = Api;
