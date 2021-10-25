import { Snowflake } from 'discord.js';
import type { Semblance } from '#structures/Semblance';
import { BaseLeaderboard } from '#structures/BaseLeaderboard';
import { quickSort } from '#constants/index';
import { Leaderboard } from '#models/Leaderboard';
import { VotesFormat } from '#models/Votes';

export class VoteLeaderboard extends BaseLeaderboard {
  constructor(client: Semblance) {
    super(client);
  }

  public async initialize(list: VotesFormat[]) {
    if (this._initialized) throw new Error(`VoteLeaderboard is already initialized`);
    const sortedList = quickSort(
      list.map(data => [data.user, data.voteCount]),
      0,
      list.length - 1,
    ).filter((item, ind) => ind < 20);
    if (!!list)
      await Leaderboard.findOneAndUpdate(
        { type: 'vote' },
        {
          list: sortedList.map(data => {
            return { user: data[0] as Snowflake, voteCount: data[1] as number };
          }),
        },
      );
    sortedList.forEach(item => this.list.set(item[0] as Snowflake, item[1] as number));
    this._initialized = true;
  }

  public update(updatedVoter: VotesFormat) {
    if (!this.list.some(voteCount => voteCount < updatedVoter.voteCount)) return;
    if (this.list.has(updatedVoter.user)) {
      return this.list.set(updatedVoter.user, updatedVoter.voteCount).sort((a, b) => b - a);
    }
    this.list.set(updatedVoter.user, updatedVoter.voteCount).sort((a, b) => b - a);
    if (this.list.map(l => l).length > 20) {
      this.list.delete(this.list.lastKey());
    }
    return this.list;
  }

  public toString() {
    return this.list.reduce(
      (acc, cur, key) => `${acc}\n${acc.replace(/[^\n]/g, '').length + 1}. <@${key}> - ${cur} votes`,
      '',
    );
  }
}
