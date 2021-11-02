import type { TwitterJSEventHandler } from '#lib/interfaces/Semblance';
import type { Semblance } from '#structures/Semblance';
import type { Tweet } from 'twitter.js';
import type { TextBasedChannels } from 'discord.js';
import { ClientEvents } from 'twitter.js';
import config from '#config';

export default {
  name: ClientEvents.FILTERED_TWEET_CREATE,
  exec: async (tweet, _matchedRules, { client }) => filteredTweetCreate(client, tweet),
} as TwitterJSEventHandler<'filteredTweetCreate'>;

export const filteredTweetCreate = async (client: Semblance, tweet: Tweet) => {
  const c2sTwitterChannel = client.guilds.cache
      .get(config.c2sGuildId)
      .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannels,
    sirhTwitterChannel = client.guilds.cache
      .get(config.sirhGuildId)
      .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannels,
    computerLunchTwitterChannel = client.guilds.cache
      .get(config.lunchGuildId)
      .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannels,
    tweetMessage = `Hey! **${tweet.author.username}** just posted a new Tweet!\nhttps://twitter.com/${tweet.author.name}/status/${tweet.id}`;
  c2sTwitterChannel.send(tweetMessage);
  sirhTwitterChannel.send(tweetMessage);
  computerLunchTwitterChannel.send(tweetMessage);
};
