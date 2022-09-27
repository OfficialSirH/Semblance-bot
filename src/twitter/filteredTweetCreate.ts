import type { SapphireClient } from '@sapphire/framework';
import type { TextBasedChannel } from 'discord.js';
import { isProduction, GuildId } from '#constants/index';
import type { TweetV2SingleStreamResult } from 'twitter-api-v2';

export const filteredTweetCreate = async (client: SapphireClient, tweet: TweetV2SingleStreamResult) => {
  const c2sTwitterChannel = client.guilds.cache
    .get(GuildId.cellToSingularity)
    .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannel;

  const content = `Hey! **ComputerLunch** just posted a new Tweet!\nhttps://twitter.com/ComputerLunch/status/${tweet.data.id}?s=21`;

  if (!isProduction) {
    client.logger.info(content);
    return;
  }

  const msg = await c2sTwitterChannel.send(content);
  await msg.crosspost();
};
