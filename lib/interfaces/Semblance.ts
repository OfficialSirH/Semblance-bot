import type { SapphireClient } from '@sapphire/framework';
import type { Snowflake } from 'discord.js';
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

export interface CustomIdData {
  command: string;
  action: string;
  id: Snowflake;
}

export type ParsedCustomIdData<T extends string = string, NewData extends CustomIdData = CustomIdData> = Omit<
  NewData,
  'command' | 'action'
> & {
  action: T;
};

export type Category =
  | 'fun'
  | 'game'
  | 'dm'
  | 'utility'
  | 'calculator'
  | 'c2sServer'
  | 'developer'
  | 'secret'
  | 'help'
  | 'semblance';
export type Subcategory = 'main' | 'mesozoic' | 'beyond' | 'other';

export interface TwitterJSEventHandler<T extends keyof ClientEventsMapping = keyof ClientEventsMapping> {
  name: T;
  once?: boolean;
  exec: (...args: [...ClientEventsMapping[T], { client: SapphireClient; twClient: Client }]) => Promise<void>;
}
