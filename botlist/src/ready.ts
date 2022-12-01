import { ActivityType, type Client } from 'discord.js';
import type { FastifyInstance } from 'fastify';
import { isProduction } from './constants';

export const ready = async (client: Client, app: FastifyInstance) => {
  client.logger.info('Client for bot list handling is ready!');

  const address = await app.listen({ port: 8079, host: '0.0.0.0' });
  client.logger.info(`Bot list handler is now listening on port ${address}`);

  if (!isProduction) {
    client.user?.setActivity('with new experiments for the universe', { type: ActivityType.Playing });
    return;
  }
  const totalMembers = client.guilds.cache
    .map(g => g.memberCount)
    .filter(g => g)
    .reduce((total, cur) => (total += cur), 0);
  const activity = `help in ${client.guilds.cache.size} servers | ${totalMembers} members`;
  client.user?.setActivity(activity, { type: ActivityType.Watching });
};
