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
  intents: [],
});
client.db = new prisma.PrismaClient();
// TODO: setup an http-only server for the bot to use
client.rest.setToken(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);
