import { filteredTweetCreate } from '../twitter/filteredTweetCreate.js';
import { TwitterApi, type ApiResponseError, type TweetStream, ETwitterStreamEvent } from 'twitter-api-v2';
import { promisify } from 'util';
import type { SapphireClient } from '@sapphire/framework';

export class TwitterInitialization {
  static online = false;
  static fallbackHandlerInterval: number | null = null;
  static twitterClient: TwitterApi;
  static stream: TweetStream;

  public static async reloadRules() {
    let retryTimer = 1000;
    const wait = promisify(setTimeout);

    const initRules = async () => {
      retryTimer = retryTimer >= 60_000 ? 60_000 : retryTimer * 2;

      const currentTwRules = await this.twitterClient.readOnly.v2.streamRules().catch((e: ApiResponseError) => {
        console.error(e.data);
        if (e.code < 429) return true;
        return false;
      });

      if (typeof currentTwRules === 'boolean') return currentTwRules;

      if (!currentTwRules.data || currentTwRules.data?.length === 0)
        return this.twitterClient.readWrite.v2
          .updateStreamRules({
            add: [
              {
                value: 'from:ComputerLunch',
              },
            ],
          })
          .catch((e: ApiResponseError) => {
            console.error(e.data);
            if (e.code < 429) return true;
            return false;
          });

      return true;
    };

    while (!(await initRules())) {
      console.log(`Failed to init rules, retrying in ${retryTimer / 1000} seconds`);
      await wait(retryTimer);
    }
  }

  public static async reloadStream(client: SapphireClient, maxRetries = Infinity) {
    let retryTimer = 1000;
    let retries = 0;
    const wait = promisify(setTimeout);

    const initStream = async () => {
      retryTimer = retryTimer >= 60_000 ? 60_000 : retryTimer * 2;
      if (retries >= maxRetries) return { success: true, message: 'too many retries' };

      const maybeStream = await this.twitterClient.v2.searchStream().catch((e: ApiResponseError) => {
        console.error(e.data);
        if (e.code < 429) return { success: true, message: `issue is local related: ${e.data.detail}` };
        return { success: false, message: null };
      });

      if ('success' in maybeStream) return maybeStream;

      this.stream = maybeStream;

      return { success: true, message: 'successfully set the stream' };
    };

    let finalResult: { success: boolean; message: string | null } = { success: false, message: null };

    while (
      !(await initStream().then(result => {
        finalResult = result;
        return result.success;
      }))
    ) {
      console.log(`Failed to init stream, retrying in ${retryTimer / 1000} seconds`);
      retries++;
      await wait(retryTimer);
    }

    this.stream.autoReconnect = true;

    this.stream.on(ETwitterStreamEvent.Data, async tweet => await filteredTweetCreate(client, tweet));

    return finalResult;
  }

  public static async initialize(client: SapphireClient) {
    this.twitterClient = new TwitterApi(JSON.parse(process.env.twitter).bearer_token);

    await this.reloadRules();

    await this.reloadStream(client);

    this.online = true;
  }
}
