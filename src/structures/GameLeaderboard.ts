import { Collection, Snowflake } from "discord.js";
import { BaseLeaderboard, Semblance } from ".";
import { insertionSort } from "../constants";
import { Leaderboard } from "../models";
import { GameFormat } from "../models/Game";

// TODO: work on update method for game and vote leaderboards

export class GameLeaderboard extends BaseLeaderboard {
    
    constructor(client: Semblance) {
        super(client);
    }

    public async initialize(list: GameFormat[]) {
        if (this._initialized) throw new Error(`GameLeaderboard is already initialized`);
        const sortedList = insertionSort(list.map(data => [data.player, data.level])).filter((item, ind) => ind < 20);
        if (!!list) await Leaderboard.findOneAndUpdate({ type: 'game' }, { list: sortedList.map(data => { 
            return { user: data[0] as Snowflake, level: (data[1] as number) } 
        })});
        sortedList.forEach((item) => this.list.set(item[0] as Snowflake, item[1] as number));
        this._initialized = true;
    }

    public update(updatedPlayer: GameFormat) {
        if (!this.list.some(level => level < updatedPlayer.level)) return;
        if (this.list.has(updatedPlayer.player)) {
            return this.list.set(updatedPlayer.player, updatedPlayer.level)
            .sort((a, b) => b - a);
        }
        this.list.set(updatedPlayer.player, updatedPlayer.level)
        .sort((a, b) => b - a);
        if (this.list.array().length > 20) {
            this.list.delete(this.list.lastKey());
        }
        return this.list;
    }

    public toString() {
        return this.list.reduce((acc, cur, key) => `${acc}\n${acc.replace(/[^\n]/g, '').length+1}. <@${key}> - level ${cur}`, '');
    }
}