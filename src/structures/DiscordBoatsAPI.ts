import { BaseAPI } from './BaseAPI';

/**
 * discord.boats API Client for Posting stats or Fetching data
 * @example
 * import { DBoatsApi } from '#structures/DiscordBoatsAPI';
 *
 * const api = new DBoatsApi('Your discord.boats token');
 */
export class DBoatsApi extends BaseAPI {
  /**
   * Create discord.boats API instance
   * @param {string} token Token or options
   */
  constructor(token: string) {
    super({ token, baseUrl: 'https://discord.boats/api' });
  }

  /**
   * @param {number} serverCount bot server count
   * @returns {number} Passed server count
   * @example
   * await client.postStats(69420);
   */
  async postStats(serverCount: number): Promise<number> {
    if (!serverCount) throw new Error('Missing serverCount');
    await this._request('POST', '/bot/794033850665533450', {
      server_count: serverCount,
    });
    return serverCount;
  }
}
