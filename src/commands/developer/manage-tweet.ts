import type { CommandInteraction } from 'discord.js';
import { Constants } from 'discord.js';
import { Command, type ApplicationCommandRegistry } from '@sapphire/framework';
import { Categories } from '#constants/index';
import { c2sGuildId, sirhGuildId } from '#config';
import type { ApiResponseError } from 'twitter-api-v2';
import { TwitterApi } from 'twitter-api-v2';

// TODO: rewrite this command to be a tweet manager for allowing reinitilization of the tweet handler and testing fetch functionality

export default class Tweet extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'manage-tweet',
      description: 'Manage Twitter Handler and test if the Twitter API is functional',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'test-fetch':
        return this.testFetch(interaction);
      case 'reload-handler':
        return this.reloadHandler(interaction);
      default:
        return interaction.reply(`Unknown subcommand ${subcommand}`);
    }
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'reload-handler',
            description: 'Reload the Twitter handler',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
          },
          {
            name: 'test-fetch',
            description: 'Test if the Twitter API is functional',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
          },
        ],
      },
      {
        guildIds: [c2sGuildId, sirhGuildId],
        idHints: ['998060368616226917', '998060369564155965'],
      },
    );
  }

  public async reloadHandler(interaction: CommandInteraction<'cached'>) {
    return interaction.reply('unimplemented');
  }

  public async testFetch(interaction: CommandInteraction<'cached'>) {
    const twClient = new TwitterApi(JSON.parse(process.env.twitter).bearer_token);

    const computerLunch = await twClient.v2
      .userByUsername('ComputerLunch')
      .catch((e: ApiResponseError) => e.data.detail);
    if (typeof computerLunch === 'string') return interaction.reply(computerLunch);

    const tweets = await twClient.v2
      .userTimeline(computerLunch.data.id, { exclude: 'replies', max_results: 5 })
      .catch((e: ApiResponseError) => e.data.detail);
    if (typeof tweets === 'string') return interaction.reply(tweets);

    return interaction.reply(
      `Here's **ComputerLunch's** most recent Tweet!\nhttps://twitter.com/ComputerLunch/status/${
        tweets.data.data.at(0).id
      }?s=21`,
    );
  }
}
