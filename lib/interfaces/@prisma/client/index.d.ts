export * from '../../../../node_modules/.prisma/client';

export interface LeaderboardUser {
  userId: Snowflake;
  level: number;
  voteCount: number;
}

export interface UserReminder {
  message: string;
  time: Date;
  reminderId: number;
  channelId: Snowflake;
}

import type { Snowflake } from 'discord.js';

export interface Leaderboard<T extends 'game' | 'vote' = 'game' | 'vote'> {
  type: T;
  users: Pick<LeaderboardUser, 'userId' | (T extends 'game' ? 'level' : 'voteCount')>[];
}
export interface Reminder {
  userId: Snowflake;
  reminders: UserReminder[];
}

// type ReminderFindManyArgs = Prisma.ReminderFindManyArgs;
// type ReminderFindUniqueArgs = Prisma.ReminderFindUniqueArgs;

// export class PrismaClient {
//   boosterReward: Prisma.BoosterRewardDelegate;
//   game: Prisma.GameDelegate;
//   information: Prisma.InformationDelegate;
//   boosterCodes: Prisma.BoosterCodesDelegate;
//   leaderboard: Prisma.LeaderboardDelegate;
//   reminder: {
//     // find<T extends ReminderFindUniqueArgs>(args)
//     findMany<T extends ReminderFindManyArgs>(args?: Prisma.SelectSubset<T, ReminderFindManyArgs>): Promise<Reminder[]>;
//   };
//   report: Prisma.ReportDelegate;
//   userData: Prisma.UserDataDelegate;
//   vote: Prisma.VoteDelegate;
// }
