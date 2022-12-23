import type { Snowflake } from 'discord.js';

type NonNestedDirectories = 'commands' | 'images';
export type ReadDirString = `./dist/src/${NonNestedDirectories}`;

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
