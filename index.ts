import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#config');

import prisma from '@prisma/client';
import type { QueriedInfoBuilder } from 'Semblance';
declare module 'discord.js' {
  interface Client {
    db: prisma.PrismaClient;
    infoBuilders: Collection<string, QueriedInfoBuilder>;
  }
}

import { SapphireClient } from '@sapphire/framework';
import { type Collection, GatewayIntentBits, Options, Partials } from 'discord.js';
const client = new SapphireClient({
  allowedMentions: { parse: [] },
  defaultPrefix: prefix,
  caseInsensitiveCommands: true,
  caseInsensitivePrefixes: true,
  defaultCooldown: {
    delay: 2_000,
  },
  makeCache: Options.cacheWithLimits({
    ThreadManager: 10,
    MessageManager: 5,
    GuildMemberManager: 1,
    UserManager: 1,
  }),
  partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message],
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages],
});
client.db = new prisma.PrismaClient();

// import { Client } from 'twitter.js';
// TODO: enable twitter.js implementation to replace the shitty twitter library
// const twClient = new Client({ events: ['FILTERED_TWEET_CREATE'] });

// TODO: enable twitter.js implementation to replace the shitty twitter library
// import type { TwitterJSEventHandler } from '#lib/interfaces/Semblance';
// const twitterEventFiles = (await fs.readdir('./dist/src/events/twitter')).filter(file => file.endsWith('.js'));

// fastify routing
import fastify from 'fastify';
const app = fastify();

// Listen to client events
import * as fs from 'fs/promises';
import type { EventHandler } from '#lib/interfaces/Semblance';
const eventFiles = (await fs.readdir('./dist/src/events/client')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = (await import(`./src/events/client/${file}`)).default as EventHandler;
  if (event.once) client.once(event.name, (...args) => event.exec(...args, client));
  else client.on(event.name, (...args) => event.exec(...args, client));
}

// for (const file of twitterEventFiles) {
// 	const event = (await import(`./src/events/twitter/${file}`)).default as TwitterJSEventHandler;
// 	if (event.once) twClient.once(event.name, (...args) => event.exec(...args, { client, twClient }));
// 	else twClient.on(event.name, (...args) => event.exec(...args, { client, twClient }));
// }

import router from '#src/routes/index';
router(app, client);

app.get('/', (_req, res) => {
  res.redirect('https://officialsirh.github.io/');
});

import { checkTweet } from '#src/listeners/index';
import { prefix } from '#src/constants';
// Check for Tweet from ComputerLunch
setInterval(() => checkTweet(client), 2000);
// TODO: remove this really shitty implementation of receiving tweets
await client.login(process.env.token);
const address = await app.listen(8079, '0.0.0.0');
console.log('Semblance has started on: ' + address);
// TODO: enable twitter.js implementation to replace the shitty twitter library
// const twitterCredentials = JSON.parse(process.env.twitter);
// await twClient.loginWithBearerToken(twitterCredentials.bearer_token);
