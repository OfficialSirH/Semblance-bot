import type { SapphireClient } from '@sapphire/framework';
import type {
  CommandInteraction,
  Message,
  Snowflake,
  ClientEvents,
  ContextMenuCommandInteraction,
  AutocompleteInteraction,
  MessageOptions,
  InteractionReplyOptions,
  ButtonInteraction,
  SelectMenuInteraction,
  Interaction,
} from 'discord.js';
import type { Client, ClientEventsMapping } from 'twitter.js';

type NonNestedDirectories = 'commands' | 'images' | 'infoBuilders';
type ApplicationCommandsDirectories =
  | 'autocompleteHandlers'
  | 'componentHandlers'
  | 'contextMenuHandlers'
  | 'slashCommands';
type EventsDirectories = 'client' | 'twitter';
type FinishedPath =
  | NonNestedDirectories
  | `applicationCommands/${ApplicationCommandsDirectories}`
  | `events/${EventsDirectories}`;
export type ReadDirString = `./dist/src/${FinishedPath}`;

declare module 'fs' {
  type readdir = (path: ReadDirString) => Promise<string[]>;
}

declare module 'fs/promises' {
  type readdir = (path: ReadDirString) => Promise<string[]>;
}

export interface AutocompleteHandler {
  run: (
    interaction: AutocompleteInteraction,
    options: AutocompleteInteraction['options'],
    client: SapphireClient,
  ) => Promise<void>;
}

export interface ContextMenuHandler {
  run: (
    interaction: ContextMenuCommandInteraction,
    { options, permissionLevel }: ContextMenuHandlerOptions,
  ) => Promise<void>;
}

export interface ContextMenuHandlerOptions {
  options: ContextMenuCommandInteraction['options'];
  permissionLevel: number;
}

export interface ComponentHandler {
  allowOthers?: boolean;
  buttonHandle?: (
    interaction: ButtonInteraction,
    data: CustomIdData,
    { client, permissionLevel }: { client: SapphireClient; permissionLevel: number },
  ) => Promise<void>;
  selectHandle?: (
    interaction: SelectMenuInteraction,
    data: CustomIdData,
    { client, permissionLevel }: { client: SapphireClient; permissionLevel: number },
  ) => Promise<void>;
}

export interface CustomIdData {
  command: string;
  action: string;
  id: Snowflake;
}

export interface SlashCommand {
  permissionRequired: number;
  run: (interaction: CommandInteraction, extra?: SlashOptions) => Promise<void>;
}

export interface SlashOptions {
  client: SapphireClient;
  permissionLevel: number;
  options: CommandInteraction['options'];
}

export type QueriedInfoBuilder = (
  interaction: Interaction,
  client: SapphireClient,
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
  run: (
    client: SapphireClient,
    message: Message,
    args: string[],
    identifier?: string,
    options?: CommandOptions,
  ) => unknown;
}

export interface CommandOptions {
  permissionLevel?: number;
  content?: string;
}

export type NoArgCategory = 'help' | 'semblance';
export type Category =
  | 'fun'
  | 'game'
  | 'dm'
  | 'utility'
  | 'calculator'
  | 'c2sServer'
  | 'server'
  | 'developer'
  | 'secret'
  | NoArgCategory;
export type Subcategory = 'main' | 'mesozoic' | 'beyond' | 'other';

export interface EventHandler<T extends keyof ClientEvents = keyof ClientEvents> {
  name: T;
  once?: boolean;
  exec: (...args: [...ClientEvents[T], SapphireClient]) => Promise<void>;
}

export interface TwitterJSEventHandler<T extends keyof ClientEventsMapping = keyof ClientEventsMapping> {
  name: T;
  once?: boolean;
  exec: (...args: [...ClientEventsMapping[T], { client: SapphireClient; twClient: Client }]) => Promise<void>;
}
