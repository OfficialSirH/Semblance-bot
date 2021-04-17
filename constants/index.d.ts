import { GuildMember, Snowflake, User, PermissionFlags } from 'discord.js';

export const embedColor: 0x7289DA;
export const hexColor: "7289DA";
export function getPermissionLevel(member: GuildMember): number;
export function getAvatar(user: UserObject): string;
export function insertionSort(list: number[][]): number[][];
export const emojis: {[key: string]: string;}
export const emojiSnowflakes: {[key: string]: Snowflake}
export function onlyUnique(value: any, index: number, self: any[]): boolean;
export function parseArgs(_arguments: string[]): string[];
export function lockMessage(user: User): string;
export function msToTime(ms: number): string;
export const roles: {[key: string]: PermissionFlags};
export const cellChannels: Snowflake[];
export const sirhChannels: Snowflake[];
export const randomColor: typeof RandomColor.randomColor;

declare class RandomColor {
	static get randomColor(): string;
}

interface UserObject {
    id: Snowflake,
    username: string,
    discriminator: string,
    avatar: string,
    bot?: boolean,
    system?: boolean,
    mfa_enabled?: boolean,
    locale?: string,
    verified?: boolean,
    email?: string,
    flags?: number,
    premium_type?: number,
    public_flags?: number
}
