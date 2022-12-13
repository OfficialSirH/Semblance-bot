import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();

import prisma from '@prisma/client';
import { isProduction, LogLevel } from './constants.js';
import { WebhookLogger } from './structures/WebhookLogger.js';
import { REST } from '@discordjs/rest';

declare module '@discordjs/rest' {
  interface REST {
    logger: WebhookLogger;
    db: prisma.PrismaClient;
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
rest.logger = new WebhookLogger(rest, isProduction ? LogLevel.Info : LogLevel.Debug);
rest.db = new prisma.PrismaClient();

import fastify from 'fastify';
const app = fastify();

import router from './routes.js';
router(app, rest);

app.get('/', (_req, res) => {
  res.redirect('https://officialsirh.github.io/');
});

const address = await app.listen({ port: 8079, host: '0.0.0.0' });
rest.logger.info(`Bot list handler is now listening on port ${address}`);
