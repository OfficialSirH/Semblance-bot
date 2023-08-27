import { GuildId, Category, isDstObserved, PreconditionName } from '#constants/index';
import { type Events, gameEvents } from '#lib/utils/events';
import { Command } from '#structures/Command';
import {
  ApplicationCommandOptionType,
  GuildScheduledEventEntityType,
  GuildScheduledEventPrivacyLevel,
  type APIChatInputApplicationCommandGuildInteraction,
  MessageFlags,
  type RESTPostAPIApplicationCommandsJSONBody,
  type APIApplicationCommandAutocompleteGuildInteraction,
  Routes,
  type RESTPostAPIGuildScheduledEventJSONBody,
  type RESTGetAPIGuildScheduledEventsResult,
  type RESTPatchAPIGuildScheduledEventJSONBody,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';

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

    if (subcommandGroup == 'game-event') {
      switch (subcommand) {
        case 'create':
          return this.createGameEvent(res, interaction, options);
        case 'edit':
          return this.editGameEvent(res, interaction, options);
        default:
          return this.client.api.interactions.reply(res, { content: 'Invalid subcommand' });
      }
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
}
