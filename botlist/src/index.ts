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
import { WebhookLogger } from './structures/WebhookLogger';
import { Client, IntentsBitField, Options } from 'discord.js';

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    StageInstanceManager: 0,
    ThreadManager: 0,
    ThreadMemberManager: 0,
  }),
});
client.logger = new WebhookLogger(isProduction ? LogLevel.Info : LogLevel.Debug);
client.db = new prisma.PrismaClient();

await client.login(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);

// fastify routing
import fastify from 'fastify';
const app = fastify();

import router from './routes';
if (isProduction) router(app, client);

app.get('/', (_req, res) => {
  res.redirect('https://officialsirh.github.io/');
});

const address = await app.listen({ port: 8079, host: '0.0.0.0' });
client.logger.info(`Bot listening on port ${address}`);
