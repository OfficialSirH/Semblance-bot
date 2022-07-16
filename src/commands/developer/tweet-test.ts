import type { CommandInteraction } from 'discord.js';
import Twitter from 'twitter';
import { Command, type ApplicationCommandRegistry } from '@sapphire/framework';
import { Categories } from '#constants/index';
const twClient = new Twitter(JSON.parse(process.env.twitter));

export default class Tweet extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'tweet-test',
      description: 'Test if the Twitter API is functional',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    const screen_name = 'ComputerLunch';

    twClient.get(
      'statuses/user_timeline',
      {
        screen_name,
        exclude_replies: false,
        count: 1,
      },
      async (error, tweets) => {
        if (error) {
          await interaction.reply(`The API failed to retrieve the latest tweet from ${screen_name}.`);
          return console.error(error);
        }
        const tweet = tweets[0];
        if (tweet)
          return interaction.reply(
            `Here's **${screen_name}'s** most recent Tweet!\nhttps://twitter.com/${screen_name}/status/${tweet.id_str}`,
          );
        return interaction.reply('Sorry, but there are no tweets to display.');
      },
    );
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
      },
      {
        idHints: ['997199709544394822'],
      },
    );
  }
}
