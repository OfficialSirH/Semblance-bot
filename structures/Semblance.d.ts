import { Client, Collection } from 'discord.js';

export declare class Semblance extends Client {
    /**
     * 
     * @param options Client options
     */
    constructor(options: Object);
    private clear_cache: NodeJS.Timeout;
    private command_counter: number;
    private slash_commands: SlashCommands;
    private _commands: Commands;
    private _aliases: Commands;
    private auto_commands: Commands;

    public sweepUsers(): Promise<number>;

    public get slashCommands(): SlashCommands;

    public addSlash(id: InteractionSnowflake, slashPath: NodeRequire): void;

    public get commands(): Commands;

    public get aliases(): Commands;

    public get autoCommands(): Commands;

    public get commandCounter(): number;

    public increaseCommandCount(): void;
}

interface SlashCommands {
    [interactionSnowflake: string]: NodeRequire
}

interface Commands {
    [commandName: string]: NodeRequire
}

type InteractionSnowflake = string;