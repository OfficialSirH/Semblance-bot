import { Interaction, Semblance } from "@semblance/structures";
import { Message } from "discord.js";
import { ApplicationCommandInteractionDataOption } from "./interaction";

export type SlashCommands = Record<string, SlashCommand>;

export interface SlashCommand {
    permissionRequired: number,
    run: (client: Semblance, interaction: Interaction, options?: SlashOptions) => void;
}

export interface SlashOptions {
    permissionLevel: number;
    options: ApplicationCommandInteractionDataOption[];
}

export type Commands = Record<string, Command>;

export interface Command {
    description: string;
    category: Category;
    subcategory?: Subcategory;
    usage: {
        [key: string]: string;
    },
    aliases?: string[],
    permissionRequired: number,
    checkArgs: (args: string[], permissionLevel?: number, content?: string) => boolean;
    run: (client: Semblance, message: Message, args: string[], identifier?: string, options?: CommandOptions) => void;
}

export interface CommandOptions {
    permissionLevel?: number;
    content?: string;
}

export type Category = 'fun' | 'game' | 'dm' | 'utility' | 'semblance' | 'admin' | 'help' | 'calculator' | 'c2sServer' | 'server';
export type Subcategory = 'main' | 'mesozoic' | 'other';

export type Aliases = Record<string, string>;