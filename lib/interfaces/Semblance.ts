import type { Semblance } from '#structures/Semblance';
import type {
  CommandInteraction,
  Message,
  MessageComponentInteraction,
  Snowflake,
  ClientEvents,
  ContextMenuInteraction,
  AutocompleteInteraction,
  MessageOptions,
  InteractionReplyOptions,
} from 'discord.js';
import type { Client, ClientEventsMapping } from 'twitter.js';

export interface AutocompleteHandler {
  run: (
    interaction: AutocompleteInteraction,
    options: AutocompleteInteraction['options'],
    client: Semblance,
  ) => Promise<void>;
}

export interface ContextMenuHandler {
  run: (interaction: ContextMenuInteraction, { options, permissionLevel }: ContextMenuHandlerOptions) => Promise<void>;
}

export interface ContextMenuHandlerOptions {
  options: ContextMenuInteraction['options'];
  permissionLevel: number;
}

export interface ComponentHandler {
  allowOthers?: boolean;
  buttonHandle?: (
    interaction: MessageComponentInteraction,
    data: ButtonData,
    { permissionLevel }: { permissionLevel: number },
  ) => Promise<void>;
  selectHandle?: (
    interaction: MessageComponentInteraction,
    data: SelectData,
    { permissionLevel }: { permissionLevel: number },
  ) => Promise<void>;
}

export interface ButtonData {
  command: string;
  action: string;
  id: Snowflake;
}

export interface SelectData {
  command: string;
  name: string;
  id: Snowflake;
}

export interface SlashCommand {
  permissionRequired: number;
  run: (interaction: CommandInteraction, extra?: SlashOptions) => Promise<void>;
}

export interface SlashOptions {
  client: Semblance;
  permissionLevel: number;
  options: CommandInteraction['options'];
}

export type QueriedInfoBuilder = (
  interaction: CommandInteraction,
  client: Semblance,
) => Promise<string | MessageOptions | InteractionReplyOptions> | string | MessageOptions | InteractionReplyOptions;

export interface Command<T extends Category> {
  description: string;
  category: T;
  subcategory?: T extends 'game' ? Subcategory : undefined;
  usage?: T extends NoArgCategory
    ? undefined
    : {
        [key: string]: string;
      };
  examples?: T extends NoArgCategory
    ? undefined
    : {
        [key: string]: string;
      };
  aliases?: string[];
  permissionRequired: number;
  checkArgs: (args: string[], permissionLevel?: number, content?: string) => T extends NoArgCategory ? true : boolean;
  run: (client: Semblance, message: Message, args: string[], identifier?: string, options?: CommandOptions) => unknown;
}

export interface CommandOptions {
  permissionLevel?: number;
  content?: string;
}

export type NoArgCategory = 'help' | 'semblance' | 'auto';
export type Category =
  | 'fun'
  | 'game'
  | 'dm'
  | 'utility'
  | 'admin'
  | 'calculator'
  | 'c2sServer'
  | 'server'
  | 'developer'
  | 'secret'
  | NoArgCategory;
export type Subcategory = 'main' | 'mesozoic' | 'other';

// the generics - <T extends keyof ClientEvents = keyof ClientEvents>
export interface EventHandler<T extends keyof ClientEvents = keyof ClientEvents> {
  name: T;
  once?: boolean;
  exec: (...args: [...ClientEvents[T], Semblance]) => Promise<void>;
}

// TODO: fix up these typings somehow
export interface TwitterJSEventHandler<T extends keyof ClientEventsMapping = keyof ClientEventsMapping> {
  name: T;
  once?: boolean;
  exec: (...args: [...ClientEventsMapping[T], { client: Semblance; twClient: Client }]) => Promise<void>;
}
