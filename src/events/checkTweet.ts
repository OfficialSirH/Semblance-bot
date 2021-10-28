import Twitter from 'twitter';
import fetch from 'node-fetch';
import config from '#config';
import type { Semblance } from '#structures/Semblance';
import type { TextChannel } from 'discord.js';
const { c2sGuildId, lunchGuildId } = config,
  twClient = new Twitter(JSON.parse(process.env.twitter));
let current_id = null;
const screen_name = 'ComputerLunch';
// TODO: get rid of this file after implementing twitter.js
/**
 * @deprecated Use twitter.js instead
 * @param client the main discord client
 * @returns void
 */
export const checkTweet = (client: Semblance) =>
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
          fetch(process.env.C2SWebhook, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`,
            }),
          });
          let guild = client.guilds.cache.get(c2sGuildId),
            channel = guild.channels.cache.find(c => c.name == 'cells-tweets') as TextChannel;
          channel.send(
            `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`,
          );

          (guild = client.guilds.cache.get(lunchGuildId)),
            (channel = guild.channels.cache.find(c => c.name == 'tweets') as TextChannel);
          channel.send(
            `Hey! **${screen_name}** just posted a new Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`,
          );
        }
      } catch {}
      current_id = tweet.id_str;
    },
  );
