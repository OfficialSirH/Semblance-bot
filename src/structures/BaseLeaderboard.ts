import { Collection } from 'discord.js';
import type { Snowflake } from 'discord.js';
import type { Semblance } from '.';

export class BaseLeaderboard {
  list: Collection<Snowflake, number>;
  _initialized: boolean;
  client: Semblance;

  constructor(client: Semblance) {
    this.client = client;
    this.list = new Collection();
  }
}
