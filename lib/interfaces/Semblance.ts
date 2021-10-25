import type { Semblance } from '#structures/Semblance';
import type {
  CommandInteraction,
  CommandInteractionOptionResolver,
  Message,
  MessageComponentInteraction,
  Snowflake,
  ConstantsEvents,
  ContextMenuInteraction,
  AutocompleteInteraction,
} from 'discord.js';
import type { Client, ClientEvents } from 'twitter.js';

export interface AutocompleteHandler {
  run: (
    interaction: AutocompleteInteraction,
    options: CommandInteractionOptionResolver<AutocompleteInteraction>,
  ) => Promise<void>;
}

export interface ContextMenuHandler {
  run: (interaction: CommandInteraction, { options, permissionLevel }: ContextMenuHandlerOptions) => Promise<void>;
}

export interface ContextMenuHandlerOptions {
  options: CommandInteractionOptionResolver<ContextMenuInteraction>;
  permissionLevel: number;
}

export interface ComponentHandler {
  allowOthers?: boolean;
  run: (
    interaction: MessageComponentInteraction,
    data: ButtonData,
    { permissionLevel }: { permissionLevel: number },
  ) => Promise<void>;
}

export interface ButtonData {
  command: string;
  action: string;
  id: Snowflake;
}

export interface SlashCommand {
  permissionRequired: number;
  run: (interaction: CommandInteraction, extra?: SlashOptions) => Promise<void>;
}

export interface SlashOptions {
  client: Semblance;
  permissionLevel: number;
  options: CommandInteractionOptionResolver<CommandInteraction>;
}

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

export interface EventHandler {
  name: keyof ConstantsEvents;
  once?: boolean;
  exec: EventHandlerExecution<any[]>;
}

export type EventHandlerExecution<T extends any[]> = (...args: [...T, Semblance]) => Promise<void>;

export interface TwitterJSEventHandler {
  name: keyof typeof ClientEvents;
  once?: boolean;
  exec: TwitterJSEventHandlerExecution<any[]>;
}

export type TwitterJSEventHandlerExecution<T extends any[]> = (
  ...args: [...T, { client: Semblance; twClient: Client }]
) => Promise<void>;
