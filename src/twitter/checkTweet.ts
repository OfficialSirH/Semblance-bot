import Twitter from 'twitter';
import { c2sGuildId, lunchGuildId } from '#config';
import type { SapphireClient } from '@sapphire/framework';
import type { TextChannel } from 'discord.js';
import { request } from 'undici';
const twClient = new Twitter(JSON.parse(process.env.twitter));
let current_id = null;
const screen_name = 'ComputerLunch';
// TODO: get rid of this file after implementing twitter.js
/**
 * @deprecated Use twitter.js instead
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
      if (error) {
        return console.log(error);
      }
      const tweet = tweets[0];
      try {
        if (tweet.id_str !== current_id && current_id) {
          request(process.env.C2SWebhook, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}?s=21`,
            }),
          });
          let guild = client.guilds.cache.get(c2sGuildId),
            channel = guild.channels.cache.find(c => c.name == 'cells-tweets') as TextChannel;
          channel.send(
            `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}?s=21`,
          );

          (guild = client.guilds.cache.get(lunchGuildId)),
            (channel = guild.channels.cache.find(c => c.name == 'tweets') as TextChannel);
          channel.send(
            `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}?s=21`,
          );
        }
      } catch {}
      current_id = tweet.id_str;
    },
  );
