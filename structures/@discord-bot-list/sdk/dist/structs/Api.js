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
 * discordbotlist.com API Client for Posting stats or Fetching data
 * @example
 * const Discordbotlist = require(`./structures/@bots-for-discord/sdk`)
 *
 * const api = new Discordbotlist.Api('Your discordbotlist.com token')
 */
class Api extends events_1.EventEmitter {
    /**
     * Create discordbotlist.com API instance
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
        let url = `https://discordbotlist.com/api/v1/${path}`;
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
    async postStats(stats) {
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
exports.Api = Api;
