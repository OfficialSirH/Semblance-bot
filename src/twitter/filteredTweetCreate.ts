import type { SapphireClient } from '@sapphire/framework';
import type { TextBasedChannel } from 'discord.js';
import { c2sGuildId } from '#config';
import type { TweetV2SingleStreamResult } from 'twitter-api-v2';

export const filteredTweetCreate = async (client: SapphireClient, tweet: TweetV2SingleStreamResult) => {
  const c2sTwitterChannel = client.guilds.cache
    .get(c2sGuildId)
    .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannel;

  console.log(`Hey! **ComputerLunch** just posted a new Tweet!\n${tweet.data.source}`);

  // the tweet should be sent to this channel but can't do that until we're sure this implementation is correct and will work properly
  // c2sTwitterChannel.send(tweetMessage);
};
