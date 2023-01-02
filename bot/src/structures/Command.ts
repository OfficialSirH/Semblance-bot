import type {
  APIApplicationCommandAutocompleteInteraction,
  APIChatInputApplicationCommandInteraction,
  APIContextMenuInteraction,
  APIMessageComponentInteraction,
  APIModalSubmitInteraction,
  RESTPostAPIApplicationCommandsJSONBody,
} from '@discordjs/core';
import type { Awaitable } from '@sapphire/framework';
import type { FastifyReply } from 'fastify';
import type { Client } from './Client';
import type { CustomIdData } from '#lib/interfaces/Semblance';
import type { Category, PreconditionName, Subcategory } from '#constants/index';

export class Command {
  public readonly name: string;
  public readonly description: string;
  public readonly category: [Category, Subcategory?];
  public readonly preconditions: PreconditionName[];

  public constructor(
    public readonly client: Command.Requirement,
    options: {
      name: string;
      description: string;
      category: [Category, Subcategory?];
      preconditions?: PreconditionName[];
    },
  ) {
    this.name = options.name;
    this.description = options.description;
    this.category = options.category;
    this.preconditions = options.preconditions ?? [];
  }

  /**
   * run method for slash commands
   * @param reply fastify's reply object for responding to Discord's interaction requests
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async chatInputRun(reply: FastifyReply, interaction: APIChatInputApplicationCommandInteraction) {
   *  await this.client.api.interactions.reply(reply, {
   *   content: 'Hello, world!',
   *   flags: 64,
   *  });
   * }
   * ```
   */
  public chatInputRun?(reply: FastifyReply, interaction: APIChatInputApplicationCommandInteraction): Awaitable<unknown>;

  /**
   * run method for context menus
   * @param reply fastify's reply object for responding to Discord's interaction requests
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async contextMenuRun(reply: FastifyReply, interaction: APIContextMenuInteraction) {
   *  await this.client.api.interactions.reply(reply, {
   *   content: 'Hello, world! the target id is ' + interaction.data.target_id,
   *   flags: 64,
   *  });
   * }
   * ```
   */
  public contextMenuRun?(reply: FastifyReply, interaction: APIContextMenuInteraction): Awaitable<void>;

  /**
   * run method for message components
   * @param reply fastify's reply object for responding to Discord's interaction requests
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async componentRun(reply: FastifyReply, interaction: APIMessageComponentInteraction) {
   *  await this.client.api.interactions.updateMessage(reply, {
   *    content: 'Hello, world! the custom id is ' + interaction.data.custom_id,
   *    flags: 64,
   *  });
   * }
   * ```
   */
  public componentRun?(
    reply: FastifyReply,
    interaction: APIMessageComponentInteraction,
    customData: CustomIdData,
  ): Awaitable<void>;

  /**
   * run method for autocomplete commands
   * @param reply fastify's reply object for responding to Discord's interaction requests
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async autocompleteRun(reply: FastifyReply, interaction: APIChatInputApplicationCommandInteraction) {
   * await this.client.api.interactions.autocomplete(reply, {
   *  choices: [
   *   {
   *    name: 'Hello',
   *    value: 'Hello',
   *   },
   *   {
   *    name: 'World',
   *    value: 'World',
   *   },
   *  ],
   * });
   * ```
   */
  public autocompleteRun?(
    reply: FastifyReply,
    interaction: APIApplicationCommandAutocompleteInteraction,
  ): Awaitable<void>;

  /**
   * run method for modal commands
   * @param reply fastify's reply object for responding to Discord's interaction requests
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async modalRun(reply: FastifyReply, interaction: APIChatInputApplicationCommandInteraction) {
   * await this.client.api.interactions.createModal(reply, {
   *  title: 'Hello, world!',
   *  custom_id: 'hello-world',
   *  components: [
   *   {
   *    type: ComponentType.ActionRow,
   *    components: [
   *     {
   *      type: ComponentType.TextInput,
   *      custom_id: 'text-input',
   *      style: TextInputStyle.Short,
   *      label: 'Hello, world!',
   *      placeholder: 'Hello, world!',
   *      min_length: 1,
   *      max_length: 2000,
   *      required: false,
   *      value: 'Hello, world!',
   *     },
   *    ],
   *   },
   *  ],
   * });
   * ```
   */
  public modalRun?(reply: FastifyReply, interaction: APIModalSubmitInteraction): Awaitable<void>;

  /**
   * application command structure
   * @example
   * ```typescript
   * public override get data() {
   *  return {
   *   name: 'hello-world',
   *   description: 'Hello, world!',
   *   options: [
   *    {
   *     name: 'hello',
   *     description: 'Hello, world!',
   *     type: ApplicationCommandOptionType.String,
   *     required: true,
   *    },
   *   ],
   *  };
   * }
   * ```
   */
  public data?(): RESTPostAPIApplicationCommandsJSONBody;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Command {
  export type Requirement = Client;
}
