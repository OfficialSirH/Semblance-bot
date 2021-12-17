import type { Semblance } from '#structures/Semblance';

export class LeaderboardUtilities {
  public static async topTwenty(client: Semblance, type: 'game' | 'vote'): Promise<string> {
    if (type === 'game')
      return (
        await client.db.game.findMany({
          take: 20,
          orderBy: {
            level: 'desc',
          },
        })
      ).reduce((acc, cur, index) => `${acc}\n${index + 1}. <@${cur.player}> - level ${cur.level}`, '');

    return (
      await client.db.vote.findMany({
        take: 20,
        orderBy: {
          voteCount: 'desc',
        },
      })
    ).reduce((acc, cur, index) => `${acc}\n${index + 1}. <@${cur.userId}> - level ${cur.voteCount}`, '');
  }
}
