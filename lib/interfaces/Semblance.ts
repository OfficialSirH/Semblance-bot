import type { Snowflake } from 'discord.js';

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
