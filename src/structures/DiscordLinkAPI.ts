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
   */
  constructor(private basicAuth: string) {
    this.baseUrl = `${process.env.DISCORD_LINK_API_URL}/v2/userdata`;
  }

  /**
   * Link a discord user to their account
   *
   * @param {LinkDiscordUserOptions} linkableData The data payload to send to the API
   */
  public async linkDiscordUser(linkableData: LinkDiscordUserOptions): Promise<UserData | { message: string } | string> {
    const body = JSON.stringify(linkableData);

    return request(`${this.baseUrl}`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + this.basicAuth,
        'X-Distribution-Channel': linkableData.data?.beta_tester ? 'Beta' : 'Stable',
        'X-Semblance-Exclusive': process.env.USERDATA_AUTH,
      },
      body,
    })
      .then<Promise<UserData | string> | string>(async response => {
        if (response.statusCode === 200) return response.body.json() as Promise<UserData>;
        if (response.statusCode === 404) return 'Not found';

        return `link failed: ${await response.body.text()}`;
      })
      .catch(error => (typeof error === 'object' ? error.toString() : error) as string) as Promise<
      UserData | string | { message: string }
    >;
  }
}

export interface LinkDiscordUserOptions {
  discord_id: string;
  data?: Omit<UserData, 'discord_id' | 'token' | 'editedTimestamp'>;
}
