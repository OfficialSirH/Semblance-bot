import type { CommandInteraction } from 'discord.js';
import { Constants } from 'discord.js';
import { Command, type ApplicationCommandRegistry } from '@sapphire/framework';
import { Categories, msToTime } from '#constants/index';
import { c2sGuildId, sirhGuildId } from '#config';
import type { ApiResponseError } from 'twitter-api-v2';
import { TweetStream } from 'twitter-api-v2';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterInitialization } from '#structures/TwitterInitialization';

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
      case 'handler-status':
        return this.handlerStatus(interaction);
      default:
        return interaction.reply(`Unknown subcommand: \`${subcommand}\``);
    }
  }

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'handler-status',
            description: 'Check if the Twitter handler is running',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
          },
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

  public async handlerStatus(interaction: CommandInteraction<'cached'>) {
    return interaction.reply(
      `Twitter Handler status: ${TwitterInitialization.stream instanceof TweetStream ? 'online' : 'offline'}`,
    );
  }

  public async reloadHandler(interaction: CommandInteraction<'cached'>) {
    await interaction.reply('Reloading Twitter handler, this may take a while...');

    const startTime = Date.now();

    const reloadCall = await TwitterInitialization.reloadStream(this.container.client).catch(e => ({
      success: false,
      message: e,
    }));

    const endTime = Date.now();

    if (reloadCall.success)
      return interaction.channel.send(
        `Successfully reloaded the Twitter handler!\nTime taken: ${msToTime(endTime - startTime)}`,
      );
    return interaction.channel.send(
      `Failed to reload the Twitter handler!\nTime taken: ${msToTime(endTime - startTime)}\nreason: ${
        reloadCall.message
      }`,
    );
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
