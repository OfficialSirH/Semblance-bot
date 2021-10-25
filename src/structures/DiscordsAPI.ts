import { EventEmitter } from 'events';
import type { BotStats, BotInfo, UserInfo, BotsResponse, BotVotes, UserBots, Widget } from '#lib/interfaces/discords';
import type { Snowflake } from 'discord.js';
import fetch, { Headers } from 'node-fetch';
import { APIError } from '#structures/ApiError';
import { stringify } from 'querystring';

/**
 * discords.com API Client for Posting stats or Fetching data
 * @example
 * const Discords = await import(`./structures/DiscordsAPI`)
 *
 * const api = new Discords.BFDApi('Your discords.com token')
 */
export class BFDApi extends EventEmitter {
  private options: {
    token: string;
    [key: string]: any;
  };
  /**
   * Create botsfordiscord.com API instance
   * @param {string} token Token or options
   * @param {object?} options API Options
   */
  constructor(token: string, options: object | null = {}) {
    super();
    this.options = {
      token: token,
      ...options,
    };
  }
  async _request(method: string, path: string, body?: any) {
    var _a;
    const headers = new Headers();
    if (this.options.token) headers.set('Authorization', this.options.token);
    if (method !== 'GET') headers.set('Content-Type', 'application/json');
    let url = `https://discords.com/bots/api/${path}`;
    if (body && method === 'GET') url += `?${stringify(body)}`;
    const response = await fetch(url, {
      method,
      headers,
      body: body && method !== 'GET' ? JSON.stringify(body) : null,
    });
    let responseBody;
    if (
      (_a = response.headers.get('Content-Type')) === null || _a === void 0 ? void 0 : _a.startsWith('application/json')
    ) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
    if (!response.ok) {
      throw new APIError('discords.com', response.status, response.statusText, responseBody);
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
  async postStats(serverCount: number): Promise<number> {
    if (!serverCount) throw new Error('Missing Server Count');
    await this._request('POST', `/bot/794033850665533450`, {
      server_count: serverCount,
    });
    return serverCount;
  }
  /**
   * Get bot info
   * @param {Snowflake} id Bot Id
   * @returns {BotInfo} Info for bot
   * @example
   * await client.getBot('794033850665533450') // returns bot info
   */
  async getBot(id: Snowflake): Promise<BotInfo> {
    if (!id) throw new Error('Id Missing');
    return this._request('GET', `/bot/${id}`);
  }
  /**
   * Get bot's vote info
   * @returns {BotVotes} bot's vote info
   * @example
   * await client.getVotes() // returns bot's vote info
   */
  async getVotes(): Promise<BotVotes> {
    return this._request('GET', `/bot/794033850665533450/votes`);
  }
  /**
   * Get bot's widget
   * @param {Snowflake} id Bot Id
   * @param {Number} width The width of the widget
   * @param {String} theme The theme of the widget
   * @returns {Widget} the bot's widget
   * @example
   * await client.getBotWidget('794033850665533450', 480, 'dark') // returns bot's widget
   */
  async getBotWidget(id: Snowflake, width: number, theme: string): Promise<Widget> {
    if (!id) throw new Error('Id Missing');
    if (!width && !theme) return this._request('GET', `/bot/${id}/widget`);
    if (!width) return this._request('GET', `/bot/${id}/widget`, { theme });
    if (!theme) return this._request('GET', `/bot/${id}/widget`, { width });
  }
  /**
   * Get user info
   * @param {Snowflake} id User Id
   * @returns {UserInfo} Info for user
   * @example
   * await client.getUser('780995336293711875')
   * // =>
   * user.username // SirH
   */
  async getUser(id: Snowflake): Promise<UserInfo> {
    if (!id) throw new Error('Id Missing');
    return this._request('GET', `/user/${id}`);
  }

  /**
   * Get user's bots
   * @param {Snowflake} id User Id
   * @returns {UserBots} user's bots
   * @example
   * await client.getUserBots('780995336293711875')
   * // =>
   *
   */
  async getUserBots(id: Snowflake): Promise<UserBots> {
    if (!id) throw new Error('Id Missing');
    return this._request('GET', `/user/${id}/bots`);
  }
}
