import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#constants/index');

import prisma from '@prisma/client';
declare module 'discord.js' {
  interface Client {
    db: prisma.PrismaClient;
  }
}

declare module '@sapphire/framework' {
  class Command {
    /**
     * allows for building output for both messages and chat input interactions
     * @param builder The message that triggered the command.
     */
    sharedRun?<T extends Command['SharedBuilder']>(interaction: T): Awaitable<string | InteractionReplyOptions>;

    /**
     * allows for running through a submitted modal
     * @param interaction The interaction that triggered the command.
     */
    modalRun?(interaction: ModalSubmitInteraction): Awaitable<void>;
  }

  interface Command {
    SharedBuilder: Interaction<'cached'>;
  }
}

import { isProduction } from '#constants/index';
import { WebhookLogger } from '#structures/WebhookLogger';
import { ApplicationCommandRegistries, LogLevel, RegisterBehavior, SapphireClient } from '@sapphire/framework';
import {
  type InteractionReplyOptions,
  type Interaction,
  type Awaitable,
  Options,
  Partials,
  IntentsBitField,
  type ModalSubmitInteraction,
} from 'discord.js';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

const client = new SapphireClient({
  logger: {
    instance: new WebhookLogger(isProduction ? LogLevel.Info : LogLevel.Debug),
  },
  allowedMentions: { parse: [] },
  defaultCooldown: {
    delay: 2_000,
  },
  makeCache: Options.cacheWithLimits({
    GuildMemberManager: 10,
    UserManager: 10,
  }),
  partials: [Partials.User, Partials.Channel, Partials.GuildMember],
  intents: [IntentsBitField.Flags.DirectMessages],
});
client.db = new prisma.PrismaClient();
// fastify routing
import fastify from 'fastify';
const app = fastify();

import router from '#routes/index';
if (isProduction) router(app, client);

app.get('/', (_req, res) => {
  res.redirect('https://officialsirh.github.io/');
});

await client.login(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);
const address = await app.listen({ port: 8079, host: '0.0.0.0' });
client.logger.info(`Bot listening on port ${address}`);

import { checkTweet } from './twitter/checkTweet.js';
import { TwitterInitialization } from '#structures/TwitterInitialization';
// Check for Tweet from ComputerLunch
const twitterAvailabilityTimer = setTimeout(() => {
  if (!TwitterInitialization.online)
    TwitterInitialization.fallbackHandlerInterval = setInterval(() => checkTweet(client), 2_000);
}, 300_000);
await TwitterInitialization.initialize(client);
clearTimeout(twitterAvailabilityTimer);
