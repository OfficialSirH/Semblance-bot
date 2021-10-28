import 'dotenv/config';
import { install as sourceMapInstall } from 'source-map-support';
sourceMapInstall();
await import('#config');
// Semblance client
import { Semblance } from '#structures/Semblance';
// import { Client } from 'twitter.js';
import { Intents, LimitedCollection, Options } from 'discord.js';
import { checkTweet, playerUpdate, userVote } from '#events/index';
const client = new Semblance({
  allowedMentions: { parse: [] },
  makeCache: Options.cacheWithLimits({
    ThreadManager: {
      sweepInterval: 3600,
      sweepFilter: LimitedCollection.filterByLifetime({
        getComparisonTimestamp: e => e.archiveTimestamp,
        excludeFromSweep: e => !e.archived,
      }),
    },
    MessageManager: {
      sweepInterval: 60,
      sweepFilter: LimitedCollection.filterByLifetime({
        lifetime: 30,
        getComparisonTimestamp: m => m.editedTimestamp ?? m.createdTimestamp,
      }),
    },
    GuildMemberManager: 0,
    UserManager: 0,
  }),
  partials: ['USER', 'CHANNEL', 'GUILD_MEMBER', 'MESSAGE'],
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
});
// TODO: enable twitter.js implementation to replace the shitty twitter library
// const twClient = new Client({ events: ['FILTERED_TWEET_CREATE'] });
// fastify routing
import fastify from 'fastify';
const app = fastify();
// Database connection import
import mongoose from 'mongoose';
import '#models/index';

// Listen to client events
import * as fs from 'fs/promises';
import type { EventHandler } from './lib/interfaces/Semblance';
const eventFiles = (await fs.readdir('./dist/src/events/client')).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = (await import(`./src/events/client/${file}`)).default as EventHandler;
  if (event.once) client.once(event.name, (...args) => event.exec(...args, client));
  else client.on(event.name, (...args) => event.exec(...args, client));
}
// TODO: enable twitter.js implementation to replace the shitty twitter library
// import type { TwitterJSEventHandler } from './lib/interfaces/Semblance';
// const twitterEventFiles = (await fs.readdir('./dist/src/events/twitter')).filter(file => file.endsWith('.js'));

// for (const file of twitterEventFiles) {
// 	const event = (await import(`./src/events/twitter/${file}`)).default as TwitterJSEventHandler;
// 	if (event.once) twClient.once(event.name, (...args) => event.exec(...args, { client, twClient }));
// 	else twClient.on(event.name, (...args) => event.exec(...args, { client, twClient }));
// }

// Listen to model events
playerUpdate(client);
userVote(client);

import router from '#src/routing/routes/index';
router(app, client);

app.get('/', (_req, res) => {
  res.redirect('https://officialsirh.github.io/');
});

// Check for Tweet from ComputerLunch
setInterval(() => checkTweet(client), 2000);
// TODO: remove this really shitty implementation of receiving tweets

await mongoose.connect(process.env.mongoDBKey);
await client.login(process.env.token);
const address = await app.listen(8079, '0.0.0.0');
console.log('Semblance has started on: ' + address);
// TODO: enable twitter.js implementation to replace the shitty twitter library
// const twitterCredentials = JSON.parse(process.env.twitter);
// await twClient.loginWithBearerToken(twitterCredentials.bearer_token);
