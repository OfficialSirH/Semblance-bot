import type { BotStats } from '#lib/interfaces/discordBotList';
import { BaseAPI } from '#structures/BaseAPI';

/**
 * discordbotlist.com API Client for Posting stats or Fetching data
 * @example
 * import { DBLApi } from '#structures/DiscordBotListAPI';
 *
 * const api = new DBLApi('Your discordbotlist.com token');
 */
export class DBLApi extends BaseAPI {
  /**
   * Create discordbotlist.com API instance
   * @param {string} token Token or options
   */
  constructor(token: string) {
    super({ token, baseUrl: 'https://discordbotlist.com/api/v1' });
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
    await this._request('POST', '/bots/794033850665533450/stats', {
      voice_connections: stats.voice_connections,
      users: stats.users,
      guilds: stats.guilds,
      shard_id: stats.shard_id,
    });
    return stats;
  }
}
