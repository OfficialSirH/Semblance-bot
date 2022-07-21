import { isProduction } from '#constants/index';
import type { UserData } from '@prisma/client';
import { request } from 'undici';

/**
 * The API for linking users from Cell to Singularity
 */
export class DiscordLinkAPI {
  private baseUrl: string;

  /**
   * Create a new DiscordLinkAPI instance
   * @param {string} basicAuth The authorization to use for the API
   * @param {string} version The version of the API to use
   */
  constructor(private basicAuth: string, version: 'v1' | 'v2') {
    this.baseUrl = isProduction
      ? `${process.env.DISCORD_LINK_API_URL}/${version}/userdata`
      : `${process.env.DEV_DISCORD_LINK_API_URL}/${version}/userdata`;
  }

  /**
   * Link a discord user to their account
   *
   * @param {string} discordId The discord id of the user
   */
  public async linkDiscordUser(discordId: string): Promise<UserData | { message: string } | string> {
    return request(`${this.baseUrl}/${discordId}`, {
      method: 'POST',
      headers: {
        Authorization: this.basicAuth,
      },
    })
      .then(response => response.body.json() as Promise<UserData>)
      .catch(error => (typeof error === 'object' ? error.toString() : error) as string);
  }
}
