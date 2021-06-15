import { LeaderboardUser } from '@semblance/lib/interfaces/BaseLeaderboard';
import { Collection, Snowflake } from 'discord.js';
import { Semblance } from '.';

export class BaseLeaderboard {
    list: Collection<Snowflake,number>;
    _initialized: boolean;
    client: Semblance;

    constructor(client: Semblance) {
        this.client = client;
        this.list = new Collection();
    }
}