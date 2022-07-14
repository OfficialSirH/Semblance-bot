import Twitter from 'twitter';
import { c2sGuildId } from '#config';
import type { SapphireClient } from '@sapphire/framework';
import type { TextBasedChannel } from 'discord.js';
const twClient = new Twitter(JSON.parse(process.env.twitter));
let current_id = null;
const screen_name = 'ComputerLunch';
// TODO: get rid of this file after implementing a better twitter library
/**
 * @deprecated Use a better twitter library instead
 * @param client the main discord client
 * @returns void
 */
export const checkTweet = (client: SapphireClient) =>
  twClient.get(
    'statuses/user_timeline',
    {
      screen_name,
      exclude_replies: true,
      count: 1,
    },
    async (error, tweets) => {
      if (error) return console.error(error);

      const tweet = tweets[0];
      try {
        if (tweet.id_str !== current_id && current_id) {
          const c2sTwitterChannel = client.guilds.cache
            .get(c2sGuildId)
            .channels.cache.find(c => c.name == 'cells-tweets') as TextBasedChannel;

          const msg = await c2sTwitterChannel.send(
            `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}?s=21`,
          );

          await msg.crosspost();
        }
      } catch {}
      current_id = tweet.id_str;
    },
  );
