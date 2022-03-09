import type { TwitterJSEventHandler } from '#lib/interfaces/Semblance';
import type { SapphireClient } from '@sapphire/framework';
import type { Tweet } from 'twitter.js';
import type { TextBasedChannel } from 'discord.js';
import { ClientEvents } from 'twitter.js';
import { c2sGuildId, sirhGuildId, lunchGuildId } from '#config';

export default {
  name: ClientEvents.FILTERED_TWEET_CREATE,
  exec: async (tweet, _matchedRules, { client }) => filteredTweetCreate(client, tweet),
} as TwitterJSEventHandler<'filteredTweetCreate'>;

export const filteredTweetCreate = async (client: SapphireClient, tweet: Tweet) => {
  const c2sTwitterChannel = client.guilds.cache
      .get(c2sGuildId)
      .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannel,
    sirhTwitterChannel = client.guilds.cache
      .get(sirhGuildId)
      .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannel,
    computerLunchTwitterChannel = client.guilds.cache
      .get(lunchGuildId)
      .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannel,
    tweetMessage = `Hey! **${tweet.author.username}** just posted a new Tweet!\nhttps://twitter.com/${tweet.author.name}/status/${tweet.id}`;
  c2sTwitterChannel.send(tweetMessage);
  sirhTwitterChannel.send(tweetMessage);
  computerLunchTwitterChannel.send(tweetMessage);
};
