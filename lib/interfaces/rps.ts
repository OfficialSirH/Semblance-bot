import type { GuildMember, Snowflake } from 'discord.js';

export interface RPSGame {
  player: Player;
  opponent: Player;
  timeout: NodeJS.Timeout;
}

export interface Player {
  choice?: string;
  id: Snowflake;
  tag: string;
}
export interface RPSCommandArgs {
  choice?: string;
  opponent?: GuildMember;
}
