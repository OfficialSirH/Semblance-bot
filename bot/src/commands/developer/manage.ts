import { buildCustomId } from '#constants/components';
import { Category, GuildId, PreconditionName, isDstObserved } from '#constants/index';
import type { ParsedCustomIdData, ResultValue } from '#lib/interfaces/Semblance';
import { gameEvents, type Events } from '#lib/utils/events';
import { Command } from '#structures/Command';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import { ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder } from '@discordjs/builders';
import {
  ApplicationCommandOptionType,
  ButtonStyle,
  ComponentType,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  MessageFlags,
  Routes,
  TextInputStyle,
  type APIApplicationCommandAutocompleteGuildInteraction,
  type APIChatInputApplicationCommandGuildInteraction,
  type APIMessageComponentGuildInteraction,
  type APIModalSubmitGuildInteraction,
  type APIModalSubmitInteraction,
  type RESTGetAPIGuildScheduledEventsResult,
  type RESTPatchAPIGuildScheduledEventJSONBody,
  type RESTPostAPIApplicationCommandsJSONBody,
  type RESTPostAPIGuildScheduledEventJSONBody,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import { request } from 'undici';

export default class Manage extends Command {
  public constructor(client: Command.Requirement) {
    super(client, {
      name: 'manage',
      description: 'Manage the bot.',
      fullCategory: [Category.developer],
      preconditions: [PreconditionName.OwnerOnly],
      componentParseOptions: {
        allowOthers: true,
      },
    });
  }

  public override async chatInputRun(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const subcommandGroup = options.getSubcommandGroup();
    const subcommand = options.getSubcommand();

    switch (subcommandGroup) {
      case 'game-event':
        switch (subcommand) {
          case 'create':
            return this.createGameEvent(res, interaction, options);
          case 'edit':
            return this.editGameEvent(res, interaction, options);
          default:
            return this.client.api.interactions.reply(res, { content: 'Invalid subcommand' });
        }
      case 'beta-tester':
        switch (subcommand) {
          case 'create':
            return this.createBetaTesterRoleMessage(res, interaction);
          case 'edit':
            return this.editBetaTesterRoleMessage(res, interaction);
          default:
            return this.client.api.interactions.reply(res, { content: 'Invalid subcommand' });
        }
      default:
        return this.client.api.interactions.reply(res, { content: 'Invalid subcommand group' });
    }
  }

  public override async autocompleteRun(
    res: FastifyReply,
    interaction: APIApplicationCommandAutocompleteGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    let inputtedAmount = options.getFocused(true);
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

    await this.client.api.interactions.autocomplete(res, dateChoices);
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
            name: 'beta-tester',
            description: 'Manage role message for beta testers',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
              {
                name: 'create',
                description: 'Create a role message for beta testers',
                type: ApplicationCommandOptionType.Subcommand,
              },
              {
                name: 'edit',
                description: 'Edit a role message for beta testers',
                type: ApplicationCommandOptionType.Subcommand,
              },
            ],
          },
        ],
      } satisfies RESTPostAPIApplicationCommandsJSONBody,
      guildIds: [GuildId.cellToSingularity],
    };
  }

  public async createGameEvent(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const name = options.getString('name', true);

    if (!gameEvents[name as Events])
      return this.client.api.interactions.reply(res, {
        content: 'Invalid game event name',
        flags: MessageFlags.Ephemeral,
      });

    const event = gameEvents[name as Events];
    const start = Number(options.getString('start', true));
    const end = Number(options.getString('end', true));

    try {
      const image = await event.image.data();
      const base64 = image.toString('base64');
      const imageData = `data:image/png;base64,${base64}`;

      await this.client.rest.post(Routes.guildScheduledEvents(interaction.guild_id), {
        body: {
          name: `The ${name} Exploration!`,
          scheduled_start_time: new Date(start).toISOString(),
          scheduled_end_time: new Date(end).toISOString(),
          image: imageData,
          description: event.description(start, end),
          privacy_level: GuildScheduledEventPrivacyLevel.GuildOnly,
          entity_type: GuildScheduledEventEntityType.External,
          entity_metadata: {
            location: 'Cell to Singularity',
          },
        } satisfies RESTPostAPIGuildScheduledEventJSONBody,
      });

      await this.client.api.interactions.reply(res, { content: `Successfully created ${name} event!` });
    } catch (e) {
      this.client.logger.error(`creating event failed: ${e}`);

      await this.client.api.interactions
        .reply(res, { content: `creating event failed: ${e}`, flags: MessageFlags.Ephemeral })
        .catch(err => this.client.logger.error(`error reply for failed event creation failed: ${err}`));
    }
  }

  public async editGameEvent(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    const name = options.getString('name', true);

    if (!gameEvents[name as Events])
      return this.client.api.interactions.reply(res, {
        content: 'Invalid game event name',
        flags: MessageFlags.Ephemeral,
      });

    const event = gameEvents[name as Events];
    const start = Number(options.getString('start', true));
    const end = Number(options.getString('end', true));

    try {
      const scheduledEvent = (
        (await this.client.rest.get(
          Routes.guildScheduledEvents(interaction.guild_id),
        )) as RESTGetAPIGuildScheduledEventsResult
      ).find(event => event.name.includes(name));

      if (!scheduledEvent)
        return this.client.api.interactions.reply(res, { content: 'No event found', flags: MessageFlags.Ephemeral });

      await this.client.rest.patch(Routes.guildScheduledEvent(interaction.guild_id, scheduledEvent.id), {
        body: {
          scheduled_start_time: new Date(start).toISOString(),
          scheduled_end_time: new Date(end).toISOString(),
          description: event.description(start, end),
        } satisfies RESTPatchAPIGuildScheduledEventJSONBody,
      });

      await this.client.api.interactions.reply(res, { content: `Successfully edited ${name} event!` });
    } catch (e) {
      this.client.logger.error(`creating event failed: ${e}`);

      await this.client.api.interactions
        .reply(res, { content: `creating event failed: ${e}`, flags: MessageFlags.Ephemeral })
        .catch(err => this.client.logger.error(`error reply for failed event creation failed: ${err}`));
    }
  }

  public async componentRun(
    reply: FastifyReply,
    interaction: APIMessageComponentGuildInteraction,
    customData: ManageButtonCustomId,
  ) {
    if (customData.action != 'beta-tester-button') return;

    const modal = new ModalBuilder()
      .setTitle('Input Your Player ID')
      .setCustomId(
        buildCustomId({
          command: this.name,
          action: ManageModalActions.BetaTester.action,
          id: interaction.member.user.id,
        }),
      )
      .setComponents([
        new ActionRowBuilder<TextInputBuilder>().addComponents([
          new TextInputBuilder()
            .setCustomId(ManageModalActions.BetaTester.PlayFabIdInput)
            .setStyle(TextInputStyle.Short)
            .setLabel('Player ID')
            .setPlaceholder('Enter your Player ID')
            .setRequired(true),
        ]),
      ])
      .toJSON();

    await this.client.api.interactions.createModal(reply, modal);
  }

  private async pullPlayFabData<
    T extends RESTPostAPIPlayFabPlayerProfileResult | RESTPostAPIPlayFabPlayerStatisticsResult | unknown = unknown,
  >(route: APIPlayFabRoutes, playFabId: string): Promise<ResultValue<boolean, T>> {
    const headers: APIPlayFabHeaders = {
      'X-SecretKey': process.env.PLAYFAB_SECRET_KEY,
    };

    const playerData = await request(`https://${process.env.PLAYFAB_TITLE_ID}.playfabapi.com/Server/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        PlayFabId: playFabId,
      } satisfies RESTPostAPIPlayFabJSONBody),
    })
      .then(res => res.body.json() as Promise<RESTPostAPIPlayFabOkResult | RESTPostAPIPlayFabErrorResult>)
      .catch(e => `Couldn't retrieve the specified player: ${e}`);

    if (typeof playerData == 'string') return { ok: false, message: playerData };

    return playerData.status == 'OK'
      ? { ok: true, value: playerData as T }
      : {
          ok: false,
          message: `There was an issue fetching the inputted Player ID, did you properly copy the id from the game's menu (look at instructions above button)?
If you're sure you did, please contact the bot owner for further assistance.`,
        };
  }

  private async createBetaTesterRoleMessage(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
  ) {
    const components = [
      new ActionRowBuilder<TextInputBuilder>().addComponents([
        new TextInputBuilder()
          .setCustomId(ManageModalActions.CreateBetaMessage.RoleMessageContent)
          .setLabel('Beta Role Message Content')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Press the button and input your Player ID to get the Beta Tester role!')
          .setRequired(true),
      ]),
    ];

    const modal = new ModalBuilder()
      .setTitle('Create Beta Tester Role Message')
      .setCustomId(
        buildCustomId({
          command: this.name,
          action: ManageModalActions.CreateBetaMessage.action,
          id: interaction.member.user.id,
        }),
      )
      .setComponents(components)
      .toJSON();

    await this.client.api.interactions.createModal(res, modal);
  }

  private async editBetaTesterRoleMessage(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
  ) {
    const components = [
      new ActionRowBuilder<TextInputBuilder>().setComponents([
        new TextInputBuilder()
          .setCustomId(ManageModalActions.EditBetaMessage.RoleMessageId)
          .setLabel('Beta Role Message ID')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Enter the message ID to edit')
          .setRequired(true),
      ]),
      new ActionRowBuilder<TextInputBuilder>().setComponents([
        new TextInputBuilder()
          .setCustomId(ManageModalActions.EditBetaMessage.RoleMessageContent)
          .setLabel('Beta Role Message Content')
          .setStyle(TextInputStyle.Paragraph)
          .setValue('Press the button and input your Player ID to get the Beta Tester role!')
          .setRequired(true),
      ]),
    ];

    const modal = new ModalBuilder()
      .setTitle('Edit Beta Tester Role Message')
      .setCustomId(
        buildCustomId({
          command: this.name,
          action: ManageModalActions.EditBetaMessage.action,
          id: interaction.member.user.id,
        }),
      )
      .setComponents(components)
      .toJSON();

    await this.client.api.interactions.createModal(res, modal);
  }

  private async createBetaTesterRoleMessageModal(res: FastifyReply, interaction: APIModalSubmitGuildInteraction) {
    const components = [
      new ActionRowBuilder<ButtonBuilder>()
        .addComponents([
          new ButtonBuilder()
            .setCustomId(
              buildCustomId({
                command: this.name,
                action: 'beta-tester-button' satisfies ManageButtonCustomId['action'],
                id: interaction.member.user.id,
              }),
            )
            .setLabel('Get Beta Tester Role')
            .setStyle(ButtonStyle.Primary),
        ])
        .toJSON(),
    ];

    const content = interaction.data.components[0].components.find(
      c => c.type == ComponentType.TextInput && c.custom_id == ManageModalActions.CreateBetaMessage.RoleMessageContent,
    )!.value;

    await this.client.rest.post(Routes.channelMessages(process.env.BETA_JOIN_CHANNEL_ID), {
      body: {
        content,
        components,
      },
    });

    return this.client.api.interactions.reply(res, {
      content: 'Successfully created the beta tester role message!',
      flags: MessageFlags.Ephemeral,
    });
  }

  private async editBetaTesterRoleMessageModal(res: FastifyReply, interaction: APIModalSubmitGuildInteraction) {
    const content = interaction.data.components[0].components.find(
      c => c.type == ComponentType.TextInput && c.custom_id == ManageModalActions.EditBetaMessage.RoleMessageContent,
    )!.value;

    const messageId = interaction.data.components[0].components.find(
      c => c.type == ComponentType.TextInput && c.custom_id == ManageModalActions.EditBetaMessage.RoleMessageId,
    )?.value;

    if (!messageId)
      return this.client.api.interactions.reply(res, { content: 'Missing message id', flags: MessageFlags.Ephemeral });

    await this.client.rest.patch(Routes.channelMessage(process.env.BETA_JOIN_CHANNEL_ID, messageId), {
      body: {
        content,
      },
    });

    return this.client.api.interactions.reply(res, {
      content: 'Successfully edited the beta tester role message!',
      flags: MessageFlags.Ephemeral,
    });
  }

  private async betaTesterModal(res: FastifyReply, interaction: APIModalSubmitInteraction) {
    const playfabId = interaction.data.components[0].components.find(
      c => c.type == ComponentType.TextInput && c.custom_id == ManageModalActions.BetaTester.PlayFabIdInput,
    )?.value;

    if (!playfabId)
      return this.client.api.interactions.reply(res, { content: 'Missing player id', flags: MessageFlags.Ephemeral });

    const playerProfile = await this.pullPlayFabData<RESTPostAPIPlayFabPlayerProfileResult>(
      APIPlayFabRoutes.GetPlayerProfile,
      playfabId,
    );

    if (!playerProfile.ok)
      return this.client.api.interactions.reply(res, { content: playerProfile.message, flags: MessageFlags.Ephemeral });

    const playerStatistics = await this.pullPlayFabData<RESTPostAPIPlayFabPlayerStatisticsResult>(
      APIPlayFabRoutes.GetPlayerStatistics,
      playfabId,
    );

    if (!playerStatistics.ok)
      return this.client.api.interactions.reply(res, {
        content: playerStatistics.message,
        flags: MessageFlags.Ephemeral,
      });

    const isBetaTester = playerStatistics.value.data.Statistics.some(
      stat => stat.StatisticName == APIPlayFabStatisticNames.IsBeta && stat.Value > 0,
    );

    if (!isBetaTester)
      return this.client.api.interactions.reply(res, {
        content: `Sorry, ${playerProfile.value.data.PlayerProfile.DisplayName}, you're not a beta tester. :(`,
        flags: MessageFlags.Ephemeral,
      });

    await this.client.rest.put(
      Routes.guildMemberRole(interaction.guild_id!, interaction.member!.user.id, process.env.BETA_TESTER_ROLE_ID),
    );

    return this.client.api.interactions.reply(res, {
      content: `Congrats on the beta role, ${playerProfile.value.data.PlayerProfile.DisplayName}!`,
      flags: MessageFlags.Ephemeral,
    });
  }

  public async modalRun(reply: FastifyReply, interaction: APIModalSubmitGuildInteraction) {
    const customData = JSON.parse(interaction.data.custom_id) as ManageModalCustomId;

    switch (customData.action) {
      case ManageModalActions.CreateBetaMessage.action:
        return this.createBetaTesterRoleMessageModal(reply, interaction);
      case ManageModalActions.EditBetaMessage.action:
        return this.editBetaTesterRoleMessageModal(reply, interaction);
      case ManageModalActions.BetaTester.action:
        return this.betaTesterModal(reply, interaction);
      default:
        return this.client.api.interactions.reply(reply, { content: 'Invalid action', flags: MessageFlags.Ephemeral });
    }
  }
}

type ManageButtonCustomId = ParsedCustomIdData<'beta-tester-button'>;

type ManageModalCustomId = ParsedCustomIdData<(typeof ManageModalActions)[keyof typeof ManageModalActions]['action']>;

const ManageModalActions = {
  CreateBetaMessage: {
    action: 'create-beta-message',
    RoleMessageContent: 'role_message_content',
  },
  EditBetaMessage: {
    action: 'edit-beta-message',
    RoleMessageId: 'role_message_id',
    RoleMessageContent: 'role_message_content',
  },
  BetaTester: { action: 'beta-tester', PlayFabIdInput: 'playfab_id_input' },
} as const;

interface RESTPostAPIPlayFabJSONBody {
  PlayFabId: string;
}

interface RESTPostAPIPlayFabResult {
  code: number;
  status: string;
}

interface RESTPostAPIPlayFabOkResult extends RESTPostAPIPlayFabResult {
  status: 'OK';
  data: unknown;
}

interface RESTPostAPIPlayFabErrorResult extends RESTPostAPIPlayFabResult {
  status: 'BadRequest';
  error: string;
  errorCode: number;
  errorMessage: string;
  errorDetails: Record<string, string[]>;
}

interface RESTPostAPIPlayFabPlayerProfileResult extends RESTPostAPIPlayFabOkResult {
  data: {
    PlayerProfile: APIPlayFabPlayerProfile;
  };
}

interface APIPlayFabPlayerProfile {
  PublisherId: string;
  TitleId: string;
  PlayerId: string;
  DisplayName: string;
}

interface RESTPostAPIPlayFabPlayerStatisticsResult extends RESTPostAPIPlayFabOkResult {
  data: {
    PlayFabId: string;
    Statistics: APIPlayFabPlayerStatistics[];
  };
}

interface APIPlayFabPlayerStatistics {
  StatisticName: APIPlayFabStatisticNames;
  Value: number;
}

enum APIPlayFabStatisticNames {
  IsBeta = 'is_beta',
}

enum APIPlayFabRoutes {
  GetPlayerProfile = 'GetPlayerProfile',
  GetPlayerStatistics = 'GetPlayerStatistics',
}

interface APIPlayFabHeaders {
  'X-SecretKey': string;
}
