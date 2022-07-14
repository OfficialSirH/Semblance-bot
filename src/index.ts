import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#config');

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
    sharedRun?<T extends Command['SharedBuilder']>(
      builder: T,
    ): Awaitable<string | (T extends Message ? MessageOptions | ReplyMessageOptions : InteractionReplyOptions)>;
  }

  interface Command {
    SharedBuilder: Interaction<'cached'> | Message;
  }
}

import { isProduction, prefix } from '#constants/index';
import { ApplicationCommandRegistries, RegisterBehavior, SapphireClient } from '@sapphire/framework';
import type { InteractionReplyOptions, MessageOptions, ReplyMessageOptions, Interaction } from 'discord.js';
import { type Awaitable, Intents, type Message, Options } from 'discord.js';

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.Overwrite);

const client = new SapphireClient({
  preventFailedToFetchLogForGuildIds: process.env.TEMP_GUILD_IDS.split(','),
  allowedMentions: { parse: [] },
  fetchPrefix: () => prefix,
  defaultPrefix: prefix,
  caseInsensitiveCommands: true,
  caseInsensitivePrefixes: true,
  loadMessageCommandListeners: true,
  defaultCooldown: {
    delay: 2_000,
  },
  makeCache: Options.cacheWithLimits({
    ThreadManager: 10,
    MessageManager: 10,
    GuildMemberManager: 10,
    UserManager: 10,
  }),
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE'],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
});
client.db = new prisma.PrismaClient();

import { ETwitterStreamEvent, TwitterApi } from 'twitter-api-v2';
import { filteredTweetCreate } from './twitter/filteredTweetCreate.js';

// fastify routing
import fastify from 'fastify';
const app = fastify();

// for (const file of twitterEventFiles) {
// 	const event = (await import(`./src/events/twitter/${file}`)).default as TwitterJSEventHandler;
// 	if (event.once) twClient.once(event.name, (...args) => event.exec(...args, { client, twClient }));
// 	else twClient.on(event.name, (...args) => event.exec(...args, { client, twClient }));
// }

import router from '#routes/index';
if (isProduction) router(app, client);

app.get('/', (_req, res) => {
  res.redirect('https://officialsirh.github.io/');
});

import { checkTweet } from './twitter/checkTweet.js';
// Check for Tweet from ComputerLunch
if (isProduction) setInterval(() => checkTweet(client), 2000);
else {
  const twClient = new TwitterApi(JSON.parse(process.env.twitter).bearer_token);

  const currentTwRules = await twClient.readOnly.v2.streamRules();

  if (currentTwRules.data.length === 0) {
    await twClient.readWrite.v2.updateStreamRules({
      add: [
        {
          value: 'from:ComputerLunch',
        },
      ],
    });
  }

  const stream = await twClient.v2.searchStream({
    'tweet.fields': ['source'],
  });
  stream.autoReconnect = true;

  stream.on(ETwitterStreamEvent.Data, async tweet => await filteredTweetCreate(client, tweet));
}

await client.login(isProduction ? process.env.TOKEN : process.env.DEV_TOKEN);
let address: string;
if (isProduction) address = await app.listen({ port: 8079, host: '0.0.0.0' });
else address = await app.listen({ port: 8079 });
console.log(`Bot listening on port ${address}`);
