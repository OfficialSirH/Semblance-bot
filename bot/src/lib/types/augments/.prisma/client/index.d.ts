import type { Snowflake } from '@discordjs/core';

export * from '.prisma/client';

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

export interface Leaderboard<T extends 'game' | 'vote' = 'game' | 'vote'> {
	type: T;
	users: Pick<LeaderboardUser, 'userId' | (T extends 'game' ? 'level' : 'voteCount')>[];
}
export interface Reminder {
	userId: Snowflake;
	reminders: UserReminder[];
}
