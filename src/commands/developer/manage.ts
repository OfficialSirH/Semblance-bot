import type { CommandInteraction } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { Constants } from 'discord.js';
import { Command, type ApplicationCommandRegistry } from '@sapphire/framework';
import { bigToName, Categories, msToTime } from '#constants/index';
import { c2sGuildId, sirhGuildId } from '#config';
import type { ApiResponseError } from 'twitter-api-v2';
import { TweetStream } from 'twitter-api-v2';
import { TwitterApi } from 'twitter-api-v2';
import { TwitterInitialization } from '#structures/TwitterInitialization';
import { DiscordLinkAPI } from '#structures/DiscordLinkAPI';

export default class Manage extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'manage',
      description: 'Manage the bot.',
      fullCategory: [Categories.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async chatInputRun(interaction: CommandInteraction<'cached'>) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup === 'discord-link')
      switch (subcommand) {
        case 'create':
          return this.discordLinkCreate(interaction);
        case 'get':
          return this.discordLinkGet(interaction);
        default:
          return interaction.reply(`Unknown subcommand \`${subcommand}\``);
      }

    if (subcommandGroup === 'twitter')
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
            name: 'discord-link',
            description: 'Manage linked C2S accounts',
            type: 'SUB_COMMAND_GROUP',
            options: [
              {
                name: 'get',
                description: 'Get a linked C2S account',
                type: 'SUB_COMMAND',
                options: [
                  {
                    name: 'discord-id',
                    description: 'The Discord ID of the user',
                    type: 'USER',
                    required: true,
                  },
                ],
              },
              {
                name: 'create',
                description: 'Create a linked C2S account',
                type: 'SUB_COMMAND',
                options: [
                  {
                    name: 'discord-id',
                    description: 'The Discord ID of the user',
                    type: 'USER',
                    required: true,
                  },
                  {
                    name: 'playeremail',
                    description: 'The email bound to your Game Transfer account.',
                    type: 'STRING',
                    required: true,
                  },
                  {
                    name: 'playertoken',
                    description: 'The token bound to your Game Transfer account.',
                    type: 'STRING',
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            name: 'twitter',
            description: 'Manage Twitter',
            type: 'SUB_COMMAND_GROUP',
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
        ],
      },
      {
        guildIds: [c2sGuildId, sirhGuildId],
        idHints: ['998060368616226917', '998060369564155965'],
      },
    );
  }

  public async discordLinkGet(interaction: CommandInteraction<'cached'>) {
    const user = interaction.options.getUser('discord-id');
    const linkedAccount = await this.container.client.db.userData.findUnique({ where: { discord_id: user.id } });

    if (!linkedAccount)
      return interaction.reply({ content: `No linked account found for ${user.tag}`, ephemeral: true });

    const embed = new MessageEmbed()
      .setTitle(`Linked account for ${user.tag}(${user.id})`)
      .setDescription(
        `Beta Tester: ${linkedAccount.beta_tester ? 'yes' : 'no'}\nSimulation Resets ${
          linkedAccount.prestige_rank
        }\nMesozoic Valley Rank: ${linkedAccount.dino_rank}\nBeyond Rank: ${
          linkedAccount.beyond_rank
        }\nMetabits: ${bigToName(Number(linkedAccount.metabits))}\nSingularity Speedrun Time: ${
          linkedAccount.singularity_speedrun_time ? msToTime(linkedAccount.singularity_speedrun_time) : 'none'
        }\nAll Sharks Obtained: ${linkedAccount.all_sharks_obtained ? 'yes' : 'no'}\nAll Hidden Achievements Found: ${
          linkedAccount.all_hidden_achievements_obtained ? 'yes' : 'no'
        }`,
      );

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  public async discordLinkCreate(interaction: CommandInteraction<'cached'>) {
    const user = interaction.options.getUser('discord-id');
    const playerEmail = interaction.options.getString('playeremail');
    const playerToken = interaction.options.getString('playertoken');

    const discordLinkClient = new DiscordLinkAPI(Buffer.from(playerEmail + ':' + playerToken).toString('base64'));

    const linkedAccount = await discordLinkClient.linkDiscordUser({ discord_id: user.id });

    const content =
      typeof linkedAccount == 'string'
        ? linkedAccount
        : 'message' in linkedAccount
        ? linkedAccount.message
        : `\`\`\`json\n${JSON.stringify(linkedAccount)}\`\`\``;

    return interaction.reply({ content, ephemeral: true });
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
