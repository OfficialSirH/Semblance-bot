import type { Message } from 'discord.js';
import Twitter from 'twitter';
import type { Command } from '#lib/interfaces/Semblance';
const twClient = new Twitter(JSON.parse(process.env.twitter));

export default {
  description: 'Get the most recent tweet from any twitter user.',
  category: 'developer',
  usage: {
    '<twitter name>': 'input the name of a user from twitter.',
  },
  permissionRequired: 7,
  checkArgs: () => true,
  run: (_client, message, args) => run(message, args),
} as Command<'developer'>;

const run = (message: Message, args: string[]) => {
  let screen_name = args[0];
  if (!screen_name) screen_name = 'ComputerLunch';
  twClient.get(
    'statuses/user_timeline',
    {
      screen_name,
      exclude_replies: false,
      count: 1,
    },
    async (error, tweets) => {
      if (error) {
        message.reply('Sorry, either your input was invalid or the back-end went haywire.');
        return console.log(error);
      }
      const tweet = tweets[0];
      try {
        if (tweet) {
          setTimeout(() => {
            message.channel.send(
              `Here's **${screen_name}'s** most recent Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`,
            );
          }, 1000);
        } else {
          message.reply('Sorry, either your input was invalid or the back-end went haywire.');
        }
      } catch (error) {
        message.reply('Sorry, either your input was invalid or the back-end went haywire.');
      }
    },
  );
};
