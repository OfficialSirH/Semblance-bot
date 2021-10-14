require('dotenv').config();
import 'source-map-support/register';
import 'module-alias/register';
(async () => await require(`@semblance/config`).config())()
// Semblance client
import { Semblance } from '@semblance/structures';
// import { Client } from 'twitter.js';
import { Intents, LimitedCollection, Options } from 'discord.js';
import { checkTweet, playerUpdate, userVote } from '@semblance/events';
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
			})
		},
		GuildMemberManager: {
			sweepInterval: 60,
			sweepFilter: LimitedCollection.filterByLifetime({
				lifetime: 30,
				getComparisonTimestamp: () => Date.now() - 60000
			})
		},
		UserManager: {
			sweepInterval: 60,
			sweepFilter: LimitedCollection.filterByLifetime({
				lifetime: 30,
				getComparisonTimestamp: () => Date.now() - 60000
			})
		},
	}),
	partials: [ "USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE" ],
	intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES ]
});
// TODO: enable twitter.js implementation to replace the shitty twitter library
// const twClient = new Client({ events: ['FILTERED_TWEET_CREATE'] });
// fastify routing
import fastify from 'fastify';
const app = fastify();
// Database connection import
import { connect } from 'mongoose';
import { Afk, Game, Information, Jump, Leaderboard, Reminder, Report, UserData, Votes } from '@semblance/models';

// Listen to client events
import * as fs from 'fs';
import type { EventHandler } from './lib/interfaces/Semblance';
const eventFiles = fs.readdirSync('./dist/src/events/client').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./src/events/client/${file}`).default as EventHandler;
	if (event.once) client.once(event.name, (...args) => event.exec(...args, client));
	else client.on(event.name, (...args) => event.exec(...args, client));
}
// TODO: enable twitter.js implementation to replace the shitty twitter library
// import type { TwitterJSEventHandler } from './lib/interfaces/Semblance';
// const twitterEventFiles = fs.readdirSync('./dist/src/events/twitter').filter(file => file.endsWith('.js'));

// for (const file of twitterEventFiles) {
// 	const event = require(`./src/events/twitter/${file}`).default as TwitterJSEventHandler;
// 	if (event.once) twClient.once(event.name, (...args) => event.exec(...args, { client, twClient }));
// 	else twClient.on(event.name, (...args) => event.exec(...args, { client, twClient }));
// }

// Listen to model events
playerUpdate(client);
userVote(client);

import router from '@semblance/src/routing/routes';
router(app, client);

app.get('/', (_req, res) => { res.redirect('https://officialsirh.github.io/') });

// Check for Tweet from ComputerLunch
setInterval(() => checkTweet(client), 2000);
// TODO: remove this really shitty implementation of receiving tweets

(async () => {
	await connect(process.env.mongoDBKey);
	await client.login(process.env.token);
	let address: string;
	address = await app.listen(8079, '0.0.0.0');
    console.log('Semblance has started on: ' + address);
	// TODO: enable twitter.js implementation to replace the shitty twitter library
	// const twitterCredentials = JSON.parse(process.env.twitter);
	// await twClient.loginWithBearerToken(twitterCredentials.bearer_token);
})()