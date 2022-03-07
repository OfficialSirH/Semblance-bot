import type { Message } from 'discord.js';
import Twitter from 'twitter';
import { type Args, Command } from '@sapphire/framework';
import { Categories } from '#src/constants';
const twClient = new Twitter(JSON.parse(process.env.twitter));

export default class Tweet extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'tweet',
      description: 'Get the most recent tweet from any twitter user.',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async messageRun(message: Message, args: Args) {
    const screen_name_resolver = await args.pickResult('string');
    let screen_name: string;
    if (!screen_name_resolver.success) screen_name = 'ComputerLunch';

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
  }
}
