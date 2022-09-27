import { isProduction, GuildId } from '#constants/index';
import { TwitterInitialization } from '#structures/TwitterInitialization';
import type { SapphireClient } from '@sapphire/framework';
import type { TextBasedChannel } from 'discord.js';
import { type ApiResponseError, TwitterApi } from 'twitter-api-v2';
let current_id: string = null;
const screen_name = 'ComputerLunch';
const userId = '618235960'; // ComputerLunch's id

/**
 * fallback for when the stream is not working
 * @param client the main discord client
 * @returns void
 */
export const checkTweet = async (client: SapphireClient) => {
  if (TwitterInitialization.online) {
    clearInterval(TwitterInitialization.fallbackHandlerInterval);
    TwitterInitialization.fallbackHandlerInterval = null;
    return;
  }

  const twClient = new TwitterApi(JSON.parse(process.env.twitter).bearer_token);
  const options: Parameters<typeof twClient.v2.readOnly.userTimeline>[1] = { exclude: 'replies' };
  if (current_id) options['since_id'] = current_id;
  const tweets = await twClient.v2.readOnly.userTimeline(userId, options).catch((e: ApiResponseError) => e.data.detail);

  if (typeof tweets === 'string') {
    console.error(tweets);
    return;
  }

  if (!isProduction) {
    console.log(JSON.stringify(tweets));
    return;
  }

  const new_id = tweets.data.data.at(0).id;

  if (new_id !== current_id && new_id !== null) {
    current_id = new_id;

    const c2sTwitterChannel = client.guilds.cache
      .get(GuildId.cellToSingularity)
      .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannel;

    const msg = await c2sTwitterChannel.send(
      `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${current_id}?s=21`,
    );

    await msg.crosspost();
  }
};
