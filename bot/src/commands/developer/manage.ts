import { GuildId, bigToName, Category, msToTime, isDstObserved, PreconditionName } from '#constants/index';
import { DiscordLinkAPI } from '#structures/DiscordLinkAPI';
import { type Events, gameEvents } from '#lib/utils/events';
import { Command } from '#structures/Command';
import {
  type APIApplicationCommandInteraction,
  ApplicationCommandOptionType,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class Manage extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'manage',
      description: 'Manage the bot.',
      fullCategory: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
    });
  }

  public override async chatInputRun(res: FastifyReply, interaction: APIApplicationCommandInteraction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (subcommandGroup == 'game-event') {
      switch (subcommand) {
        case 'create':
          return this.createGameEvent(interaction);
        case 'edit':
          return this.editGameEvent(interaction);
        default:
          return interaction.reply('Invalid subcommand');
      }
    }

    if (subcommandGroup === 'discord-link')
      switch (subcommand) {
        case 'create':
          return this.discordLinkCreate(interaction);
        case 'get':
          return this.discordLinkGet(interaction);
        default:
          return interaction.reply(`Unknown subcommand \`${subcommand}\``);
      }
  }

  public override async autocompleteRun(interaction: AutocompleteInteraction<'cached'>) {
    let inputtedAmount: string | number = interaction.options.getFocused();
    inputtedAmount = parseInt(inputtedAmount as string);
    if (!inputtedAmount || inputtedAmount < 1) inputtedAmount = 1;

    const dateChoices = Array(12)
      .fill(0)
      .map((_, i) => {
        const date = new Date();
        date.setUTCDate(inputtedAmount as number);
        date.setUTCMonth(new Date().getMonth() + i);
        date.setUTCHours(isDstObserved(date) ? 16 : 17, 0, 0, 0);
        return {
          name: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          value: date.getTime().toString(),
        };
      });

    await interaction.respond(dateChoices);
  }

  public override data() {
    return {
      command: {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'game-event',
            description: 'Manage game events',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
              {
                name: 'create',
                description: 'Create a game event',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'name',
                    description: 'The name of the game event',
                    type: ApplicationCommandOptionType.String,
                    choices: Object.keys(gameEvents).map(key => ({
                      name: key,
                      value: key,
                    })),
                    required: true,
                  },
                  {
                    name: 'start',
                    description: 'The day of the month the game event starts',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                    required: true,
                  },
                  {
                    name: 'end',
                    description: 'The day of the month the game event ends',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                    required: true,
                  },
                ],
              },
              {
                name: 'edit',
                description: 'Edit a game event',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'name',
                    description: 'The name of the game event',
                    autocomplete: true,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                  {
                    name: 'start',
                    description: 'The day of the month the game event starts',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                  },
                  {
                    name: 'end',
                    description: 'The day of the month the game event ends',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                  },
                ],
              },
            ],
          },
          {
            name: 'discord-link',
            description: 'Manage linked C2S accounts',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
              {
                name: 'get',
                description: 'Get a linked C2S account',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'discord-id',
                    description: 'The Discord ID of the user',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                  },
                ],
              },
              {
                name: 'create',
                description: 'Create a linked C2S account',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                  {
                    name: 'discord-id',
                    description: 'The Discord ID of the user',
                    type: ApplicationCommandOptionType.User,
                    required: true,
                  },
                  {
                    name: 'playeremail',
                    description: 'The email bound to your Game Transfer account.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                  {
                    name: 'playertoken',
                    description: 'The token bound to your Game Transfer account.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      },
      guildIds: [GuildId.cellToSingularity],
    };
  }

  public async discordLinkGet(interaction: APIApplicationCommandInteraction) {
    const user = interaction.options.getUser('discord-id', true);
    const linkedAccount = await this.client.db.userData.findUnique({ where: { discord_id: user.id } });

    if (!linkedAccount)
      return interaction.reply({ content: `No linked account found for ${user.tag}`, ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle(`Linked account for ${user.tag}(${user.id})`)
      .setDescription(
        `Beta Tester: ${linkedAccount.beta_tester ? 'yes' : 'no'}\nSimulation Resets: ${
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

  public async discordLinkCreate(interaction: APIApplicationCommandInteraction) {
    const user = interaction.options.getUser('discord-id', true);
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

  public async createGameEvent(interaction: APIApplicationCommandInteraction) {
    const name = interaction.options.getString('name', true);

    if (!gameEvents[name as Events]) return interaction.reply({ content: 'Invalid game event name', ephemeral: true });

    const event = gameEvents[name as Events];
    const start = Number(interaction.options.getString('start', true));
    const end = Number(interaction.options.getString('end', true));

    try {
      await interaction.guild.scheduledEvents.create({
        name: `The ${name} Exploration!`,
        scheduledStartTime: new Date(start),
        scheduledEndTime: new Date(end),
        image: event.image.attachment as Buffer,
        description: event.description(start, end),
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType: GuildScheduledEventEntityType.External,
        entityMetadata: {
          location: 'Cell to Singularity',
        },
      });
      await interaction.reply(`Successfully created ${name} event!`);
    } catch (e) {
      this.container.logger.error(`creating event failed: ${e}`);
      await interaction
        .reply({ content: `creating event failed: ${e}`, ephemeral: true })
        .catch(err => this.container.logger.error(`error reply for failed event creation failed: ${err}`));
    }
  }

  public async editGameEvent(interaction: APIApplicationCommandInteraction) {
    const name = interaction.options.getString('name', true);

    if (!gameEvents[name as Events]) return interaction.reply({ content: 'Invalid game event name', ephemeral: true });

    const event = gameEvents[name as Events];
    const start = Number(interaction.options.getString('start', true));
    const end = Number(interaction.options.getString('end', true));

    try {
      const scheduledEvent = (await interaction.guild.scheduledEvents.fetch()).find(e => e.name.includes(name));

      if (!scheduledEvent) return interaction.reply({ content: 'No event found', ephemeral: true });

      await scheduledEvent.edit({
        scheduledStartTime: new Date(start),
        scheduledEndTime: new Date(end),
        description: event.description(start, end),
      });
      await interaction.reply(`Successfully edited ${name} event!`);
    } catch (e) {
      this.container.logger.error(`creating event failed: ${e}`);
      await interaction
        .reply({ content: `creating event failed: ${e}`, ephemeral: true })
        .catch(err => this.container.logger.error(`error reply for failed event creation failed: ${err}`));
    }
  }
}
