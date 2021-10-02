import type { Semblance } from "@semblance/structures";
import type { Collection, CommandInteraction, CommandInteractionOptionResolver, Message, MessageComponentInteraction, Snowflake, ConstantsEvents, ContextMenuInteraction, AutocompleteInteraction } from "discord.js";

export interface AutocompleteHandler {
    run: (interaction: AutocompleteInteraction, options: CommandInteractionOptionResolver<AutocompleteInteraction>) => Promise<void>;
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
    run: (interaction: MessageComponentInteraction, data: ButtonData, { permissionLevel }: { permissionLevel: number }) => Promise<void>;
}

export interface ButtonData {
    command: string;
    action: string;
    id: Snowflake;
}

export interface SlashCommand {
    permissionRequired: number,
    run: (client: Semblance, interaction: CommandInteraction, options?: SlashOptions) => Promise<void>;
}

export interface SlashOptions {
    permissionLevel: number;
    options: CommandInteractionOptionResolver<CommandInteraction>;
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

export interface EventHandler {
    name: keyof ConstantsEvents;
    once?: boolean;
    exec: EventHandlerExecution<any[]>;
}

export type EventHandlerExecution<T extends any[]> = (...args: [...T, Semblance]) => Promise<void>;