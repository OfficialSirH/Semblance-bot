import type { Snowflake } from '@discordjs/core';

export type Awaitable<T> = PromiseLike<T> | T;

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

export type ParsedCustomIdData<Action extends string = string, NewData extends CustomIdData = CustomIdData> = Omit<NewData, 'command' | 'action'> & {
	action: Action;
};

export type Result<Ok extends boolean = boolean> = Ok extends true ? { ok: true } : { ok: false; message: string };

export type ResultValue<Ok extends boolean = boolean, Value = unknown> = Ok extends true
	? { ok: true; value: Value }
	: { ok: false; message: string };
