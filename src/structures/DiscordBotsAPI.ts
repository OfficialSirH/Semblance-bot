import { BaseAPI } from '#structures/BaseAPI';
import type { BotStats } from '#lib/interfaces/discordBots';

/**
 * discord.bots.gg API Client for Posting stats or Fetching data
 * @example
 * import { DBotsApi } from '#structures/DiscordBotsAPI';
 *
 * const api = new DBotsApi('Your discord.bots.gg token');
 */
export class DBotsApi extends BaseAPI {
  /**
   * Create discord.bots.gg API instance
   * @param {string} token Token or options
   */
  constructor(token: string) {
    super({ token, baseUrl: 'https://discord.bots.gg/api/v1' });
  }

  /**
   * @param {BotStats} stats bot stats
   * @returns {BotStats} Passed stats
   * @example
   * await client.postStats({ guildCount: 69, shardCount: 420 });
   */
  async postStats(stats: BotStats): Promise<BotStats> {
    if (!stats || stats.guildCount) throw new Error('Missing guild count');
    await this._request('POST', '/bots/794033850665533450/stats', {
      guildCount: stats.guildCount,
      shardCount: stats.shardCount,
    });
    return stats;
  }
}
