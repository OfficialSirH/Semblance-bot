import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();

import prisma from '@prisma/client';
declare module 'discord.js' {
  interface Client {
    logger: WebhookLogger;
    db: prisma.PrismaClient;
  }
}

import { isProduction, LogLevel } from './constants';
import { guildCreate } from './guildCreate';
import { WebhookLogger } from './structures/WebhookLogger';
import { ActivityType, Client, Events, IntentsBitField, Options } from 'discord.js';

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
  }),
});
client.logger = new WebhookLogger(client, isProduction ? LogLevel.Info : LogLevel.Debug);
client.db = new prisma.PrismaClient();

await client.login(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);

import fastify from 'fastify';
const app = fastify();

import router from './routes';
if (isProduction) router(app, client);

app.get('/', (_req, res) => {
  res.redirect('https://officialsirh.github.io/');
});

client.on('ready', async () => {
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
});

client.on(Events.GuildCreate, guildCreate);
