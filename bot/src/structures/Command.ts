import {
  type APIApplicationCommandAutocompleteInteraction,
  type APIApplicationCommandInteraction,
  type APIChatInputApplicationCommandInteraction,
  type APIContextMenuInteraction,
  type APIMessageComponentInteraction,
  type APIModalSubmitInteraction,
  ApplicationCommandType,
  MessageFlags,
  type RESTPostAPIApplicationCommandsJSONBody,
  InteractionType,
  type APIInteractionResponseCallbackData,
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';
import type { Client } from './Client';
import type { Awaitable, CustomIdData } from '#lib/interfaces/Semblance';
import type { Category, GuildId, PreconditionName, SubCategory } from '#constants/index';
import { InteractionOptionResolver } from './InteractionOptionResolver';
import type { Attachy } from './Attachy';

export abstract class Command {
  public readonly name: string;
  public readonly description: string;
  public readonly category?: Category;
  public readonly subCategory?: SubCategory;
  public readonly preconditions: PreconditionName[];

  public constructor(
    public readonly client: Command.Requirement,
    options: {
      name: string;
      description: string;
      fullCategory?: [Category, SubCategory?];
      preconditions?: PreconditionName[];
    },
  ) {
    this.name = options.name;
    this.description = options.description;
    if (options.fullCategory) {
      this.category = options.fullCategory[0];
      this.subCategory = options.fullCategory[1];
    }
    this.preconditions = options.preconditions ?? [];
  }

  // a method named preRun that is used for executing preconditions then if the precondition succeeds, run the corresponding run method
  /**
   * method for executing preconditions then if the precondition succeeds, run the corresponding run method
   * @param reply fastify's reply object for responding to Discord's interaction requests
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async preRun(reply: FastifyReply, interaction: APIChatInputApplicationCommandInteraction) {
   *  const result = await this.client.preconditions.run(this.preconditions, interaction);
   *  if (result.ok) {
   *   await this.chatInputRun(reply, interaction);
   *  } else {
   *   await this.client.api.interactions.reply(reply, {
   *    content: result.message,
   *    flags: MessageFlags.Ephemeral,
   *   });
   *  }
   * }
   * ```
   */
  public async preRun(
    reply: FastifyReply,
    interaction: APIApplicationCommandInteraction | APIApplicationCommandAutocompleteInteraction,
  ): Promise<void> {
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      const optionsResolver = new InteractionOptionResolver(interaction);

      await this.autocompleteRun?.(reply, interaction as APIApplicationCommandAutocompleteInteraction, optionsResolver);
      return;
    }

    const preconditionsTest = this.client.cache.handles.preconditions
      .filter(pre => this.preconditions.includes(pre.name as PreconditionName))
      .map(pre =>
        interaction.data.type === ApplicationCommandType.ChatInput
          ? pre.chatInputRun?.(interaction as APIChatInputApplicationCommandInteraction)
          : pre.contextMenuRun?.(interaction as APIContextMenuInteraction),
      );

    for await (const result of preconditionsTest) {
      if (!result?.ok) {
        await this.client.api.interactions.reply(reply, {
          content: result?.message,
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    const optionsResolver = new InteractionOptionResolver(interaction as APIChatInputApplicationCommandInteraction);

    if (interaction.data.type === ApplicationCommandType.ChatInput) {
      await this.chatInputRun?.(reply, interaction as APIChatInputApplicationCommandInteraction, optionsResolver);
      return;
    }
    if (
      interaction.data.type === ApplicationCommandType.User ||
      interaction.data.type === ApplicationCommandType.Message
    ) {
      await this.contextMenuRun?.(reply, interaction as APIContextMenuInteraction, optionsResolver);
    }
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
  public chatInputRun?(
    reply: FastifyReply,
    interaction: APIChatInputApplicationCommandInteraction,
    options: InteractionOptionResolver,
  ): Awaitable<unknown>;

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
  public contextMenuRun?(
    reply: FastifyReply,
    interaction: APIContextMenuInteraction,
    options: InteractionOptionResolver,
  ): Awaitable<void>;

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
    options: InteractionOptionResolver,
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
   * run method for returning sendable data for slash commands
   * @param interaction the interaction that triggered the command
   * @example
   * ```typescript
   * public override async templateRun(interaction: APIChatInputApplicationCommandInteraction) {
   *  return {
   *   content: 'Hello, world!',
   *   flags: MessageFlags.Ephemeral,
   *  };
   * }
   * ```
   */
  public templateRun?(interaction: APIChatInputApplicationCommandInteraction): Awaitable<
    APIInteractionResponseCallbackData & {
      files?: Attachy[];
    }
  >;

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
  public data?(): Awaitable<{ command: RESTPostAPIApplicationCommandsJSONBody; guildIds?: GuildId[] }>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Command {
  export type Requirement = Client;
}
