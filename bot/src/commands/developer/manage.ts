import { Category, GuildId, PreconditionName, isDstObserved } from '#constants/index';
import type { CustomIdData } from '#lib/interfaces/Semblance';
import { gameEvents, type Events } from '#lib/utils/events';
import { Command } from '#structures/Command';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import {
  ApplicationCommandOptionType,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  MessageFlags,
  Routes,
  type APIApplicationCommandAutocompleteGuildInteraction,
  type APIChatInputApplicationCommandGuildInteraction,
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
            return this.createBetaTesterRoleMessage(res, interaction, options);
          case 'edit':
            return this.editBetaTesterRoleMessage(res, interaction, options);
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
                options: [
                  {
                    name: 'message-id',
                    description: 'The message id of the role message',
                    type: ApplicationCommandOptionType.String,
                  },
                ],
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

  private async pullPlayFabData<
    T extends RESTPostAPIPlayFabPlayerProfileResult | RESTPostAPIPlayFabPlayerStatisticsResult | unknown = unknown,
  >(route: APIPlayFabRoutes, playFabId: string) {
    const headers: APIPlayFabHeaders = {
      'X-SecretKey': process.env.PLAYFAB_SECRET_KEY,
    };

    const playerData = (await request(`https://${process.env.PLAYFAB_TITLE_ID}.playfabapi.com/Server/${route}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        PlayFabId: playFabId,
      } satisfies RESTPostAPIPlayFabJSONBody),
    }).then(res => res.body.json())) as Promise<T>;

    return playerData;
  }

  private async createBetaTesterRoleMessage(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    // TODO: create modal for creating the beta tester role message
    throw new Error('Not implemented');
  }

  private async editBetaTesterRoleMessage(
    res: FastifyReply,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: InteractionOptionResolver,
  ) {
    // TODO: get the message id from the options and open modal for editing the beta tester role message
    throw new Error('Not implemented');
  }

  private async createBetaTesterRoleMessageModal(
    res: FastifyReply,
    interaction: APIModalSubmitInteraction,
    customData: CustomIdData,
  ) {
    throw new Error('Not implemented');
  }

  private async editBetaTesterRoleMessageModal(
    res: FastifyReply,
    interaction: APIModalSubmitInteraction,
    customData: CustomIdData,
  ) {
    throw new Error('Not implemented');
  }

  private async betaTesterModal(res: FastifyReply, interaction: APIModalSubmitInteraction, customData: CustomIdData) {
    // TODO: get text input for the user's playfab id
    // then get the user's playfab data and check if they're a beta tester
    // if they are, give them the beta tester role
    // if not, tell them they're not a beta tester
    throw new Error('Not implemented');
  }

  public async modalRun(reply: FastifyReply, interaction: APIModalSubmitInteraction) {
    const customData = JSON.parse(interaction.data.custom_id) as CustomIdData;

    switch (customData.action) {
      case 'create-beta-message':
        return this.createBetaTesterRoleMessageModal(reply, interaction, customData);
      case 'edit-beta-message':
        return this.editBetaTesterRoleMessageModal(reply, interaction, customData);
      case 'beta-tester':
        return this.betaTesterModal(reply, interaction, customData);
      default:
        return this.client.api.interactions.reply(reply, { content: 'Invalid action', flags: MessageFlags.Ephemeral });
    }
  }
}

interface RESTPostAPIPlayFabJSONBody {
  PlayFabId: string;
}

interface RESTPostAPIPlayFabPlayerProfileResult {
  PlayerProfile: APIPlayFabPlayerProfile;
}

interface APIPlayFabPlayerProfile {
  PublisherId: string;
  TitleId: string;
  PlayerId: string;
  DisplayName: string;
}

interface RESTPostAPIPlayFabPlayerStatisticsResult {
  PlayFabId: string;
  Statistics: APIPlayFabPlayerStatistics[];
}

interface APIPlayFabPlayerStatistics {
  StatisticsName: APIPlayFabStatisticsNames;
  Value: number;
}

enum APIPlayFabStatisticsNames {
  IsBeta = 'is_beta',
}

enum APIPlayFabRoutes {
  GetPlayerProfile = 'GetPlayerProfile',
  GetPlayerStatistics = 'GetPlayerStatistics',
}

interface APIPlayFabHeaders {
  'X-SecretKey': string;
}
