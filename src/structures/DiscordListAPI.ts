import { BaseAPI } from '#structures/BaseAPI';

/**
 * discordlist.space API Client for Posting stats or Fetching data
 * @example
 * import { DListApi } from '#structures/DiscordListAPI';
 *
 * const api = new DListApi('Your discordlist.space token');
 */
export class DListApi extends BaseAPI {
  /**
   * Create discordlist.space API instance
   * @param {string} token Token or options
   */
  constructor(token: string) {
    super({ token, baseUrl: 'https://api.discordlist.space/v2' });
  }

  /**
   * @param {number} serverCount bot server count
   * @returns {number} Passed server count
   * @example
   * await client.postStats(69420);
   */
  async postStats(serverCount: number): Promise<number> {
    if (!serverCount) throw new Error('Missing serverCount');
    await this._request('POST', '/bots/794033850665533450', {
      serverCount,
    });
    return serverCount;
  }
}
