import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();

import prisma from '@prisma/client';
import { isProduction, LogLevel } from './constants';
import { ready } from './ready';
import { guildCreate } from './guildCreate';
import { WebhookLogger } from './structures/WebhookLogger';
import { Client, Events, IntentsBitField, Options } from 'discord.js';

declare module 'discord.js' {
  interface Client {
    logger: WebhookLogger;
    db: prisma.PrismaClient;
  }
}

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

await client.login(process.env.DISCORD_TOKEN);

import fastify from 'fastify';
const app = fastify();

import router from './routes';
router(app, client);

app.get('/', (_req, res) => {
  res.redirect('https://officialsirh.github.io/');
});

client.once('ready', (client: Client) => ready(client, app));

client.on(Events.GuildCreate, guildCreate);
