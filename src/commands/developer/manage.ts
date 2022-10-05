import { type AutocompleteInteraction, type ChatInputCommandInteraction, EmbedBuilder, ApplicationCommandOptionType, Constants } from 'discord.js';
import { Command, type ApplicationCommandRegistry } from '@sapphire/framework';
import { GuildId, bigToName, Category, msToTime, isDstObserved } from '#constants/index';
import { type ApiResponseError, TweetStream, TwitterApi } from 'twitter-api-v2';
import { TwitterInitialization } from '#structures/TwitterInitialization';
import { DiscordLinkAPI } from '#structures/DiscordLinkAPI';
import { type Events, gameEvents } from '#lib/utils/events';

export default class Manage extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, {
      ...options,
      name: 'manage',
      description: 'Manage the bot.',
      fullCategory: [Category.developer],
      preconditions: ['OwnerOnly'],
    });
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction<'cached'>) {
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

  public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
    registry.registerChatInputCommand(
      {
        name: this.name,
        description: this.description,
        options: [
          {
            name: 'game-event',
            description: 'Manage game events',
            type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
            options: [
              {
                name: 'create',
                description: 'Create a game event',
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                options: [
                  {
                    name: 'name',
                    description: 'The name of the game event',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    choices: Object.keys(gameEvents).map(key => ({
                      name: key,
                      value: key,
                    })),
                    required: true,
                  },
                  {
                    name: 'start',
                    description: 'The day of the month the game event starts',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    autocomplete: true,
                    required: true,
                  },
                  {
                    name: 'end',
                    description: 'The day of the month the game event ends',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    autocomplete: true,
                    required: true,
                  },
                ],
              },
              {
                name: 'edit',
                description: 'Edit a game event',
                type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
                options: [
                  {
                    name: 'name',
                    description: 'The name of the game event',
                    autocomplete: true,
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    required: true,
                  },
                  {
                    name: 'start',
                    description: 'The day of the month the game event starts',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
                    autocomplete: true,
                  },
                  {
                    name: 'end',
                    description: 'The day of the month the game event ends',
                    type: Constants.ApplicationCommandOptionTypes.STRING,
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
          {
            name: 'twitter',
            description: 'Manage Twitter',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
              {
                name: 'handler-status',
                description: 'Check if the Twitter handler is running',
                type: ApplicationCommandOptionType.Subcommand,
              },
              {
                name: 'reload-handler',
                description: 'Reload the Twitter handler',
                type: ApplicationCommandOptionType.Subcommand,
              },
              {
                name: 'test-fetch',
                description: 'Test if the Twitter API is functional',
                type: ApplicationCommandOptionType.Subcommand,
              },
            ],
          },
        ],
      },
      {
        guildIds: [GuildId.cellToSingularity],
      },
    );
  }

  public async discordLinkGet(interaction: ChatInputCommandInteraction<'cached'>) {
    const user = interaction.options.getUser('discord-id');
    const linkedAccount = await this.container.client.db.userData.findUnique({ where: { discord_id: user.id } });

    if (!linkedAccount)
      return interaction.reply({ content: `No linked account found for ${user.tag}`, ephemeral: true });

    const embed = new EmbedBuilder()
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

  public async discordLinkCreate(interaction: ChatInputCommandInteraction<'cached'>) {
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

  public async handlerStatus(interaction: ChatInputCommandInteraction<'cached'>) {
    return interaction.reply(
      `Twitter Handler status: ${TwitterInitialization.stream instanceof TweetStream ? 'online' : 'offline'}`,
    );
  }

  public async reloadHandler(interaction: ChatInputCommandInteraction<'cached'>) {
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

  public async testFetch(interaction: ChatInputCommandInteraction<'cached'>) {
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

  public async createGameEvent(interaction: ChatInputCommandInteraction<'cached'>) {
    const name = interaction.options.getString('name', true);

    if (!gameEvents[name]) return interaction.reply({ content: 'Invalid game event name', ephemeral: true });

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
        privacyLevel: 'GUILD_ONLY',
        entityType: 'EXTERNAL',
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

  public async editGameEvent(interaction: ChatInputCommandInteraction<'cached'>) {
    const name = interaction.options.getString('name', true);

    if (!gameEvents[name]) return interaction.reply({ content: 'Invalid game event name', ephemeral: true });

    const event = gameEvents[name as Events];
    const start = Number(interaction.options.getString('start', true));
    const end = Number(interaction.options.getString('end', true));

    try {
      const scheduledEvent = (await interaction.guild.scheduledEvents.fetch()).find(e => e.name.includes(name));

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
