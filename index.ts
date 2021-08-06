require('dotenv').config();
import 'source-map-support/register';
import 'module-alias/register';
(async () => await require(`@semblance/config`).config())()
// Semblance client
import { Semblance } from '@semblance/structures'; 
import { Intents, LimitedCollection, Options } from 'discord.js'; 
import { checkTweet, playerUpdate, userVote } from '@semblance/events';
const client = new Semblance({
	disableMentions: { parse: ['users', 'roles'], repliedUser: true },
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
// express routing
import * as express from 'express';
import { Request, Response } from 'express';
const app = express();
// Database connection import
import { connect } from 'mongoose';
import { Afk, Game, Information, Jump, Leaderboard, Reminder, Report, UserData, Votes } from '@semblance/models';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Listen to client events
import * as fs from 'fs';
import { EventHandler } from './lib/interfaces/Semblance';
const eventFiles = fs.readdirSync('./dist/src/events/client').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./src/events/client/${file}`).default as EventHandler;
	if (event.once) client.once(event.name, (...args) => event.exec(...args, client));
	else client.on(event.name, (...args) => event.exec(...args, client));
}
// Listen to model events
playerUpdate(client);
userVote(client);

import router from '@semblance/src/routes';
router(app, client);

app.use((req: Request, res: Response) => res.redirect('https://officialsirh.github.io/'));

// Check for Tweet from ComputerLunch
setInterval(() => checkTweet(client), 2000);

(async () => {
	await connect(process.env.mongoDBKey, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	});
	await client.login(process.env.token);
	app.listen(8079);
})()