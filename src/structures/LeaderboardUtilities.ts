import type { Game, Vote } from '@prisma/client';
import type { Semblance } from '#structures/Semblance';

export class LeaderboardUtilities {
  public static async topTwenty(client: Semblance, type: 'game' | 'vote'): Promise<Game[] | Vote[]> {
    if (type === 'game')
      return client.db.game.findMany({
        take: 20,
        orderBy: {
          level: 'desc',
        },
      });

    return client.db.vote.findMany({
      take: 20,
      orderBy: {
        voteCount: 'desc',
      },
    });
  }
}
