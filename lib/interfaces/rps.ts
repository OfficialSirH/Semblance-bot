import { Message, Snowflake } from "discord.js";

export interface RPSGame {
    player: Player;
    opponent: Player;
    timeout: NodeJS.Timeout
}

export interface Player {
    choice?: string;
    id: Snowflake;
    tag: string;
}