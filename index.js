const config = require('./config');
require('dotenv').config();
require('module-alias/register');
// Semblance client
const { Semblance } = require('@semblance/structures'), { Intents } = require('discord.js'), EVENTS = require('./events').EVENTS,
	client = new Semblance({
		 disableMentions: "everyone", // V13 Release replacement: disableMentions: { parse: ['users', 'roles'], repliedUser: true }
    		messageCacheLifetime: 30,
    		messageSweepInterval: 300,
		partials: [ "USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION" ],
		ws: {
    	 	 	intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES ]
    		}
	}),
	// express routing
	express = require('express'),
	app = express(),
	// Database connection import
	{ connect } = require('mongoose'), 
	UserDataLoad = require('./models/UserData').UserData,
	// Client event handlers
	{ interactionCreate, message, messageDelete, messageReactionAdd, messageReactionRemove, messageUpdate, ready } = EVENTS.CLIENT,
	// Bot listing event handlers
	{ botListSpace, botsForDiscord, discordBoat, discordBotList, discordBotsGG, topGG } = EVENTS.BOT_LISTING,
	// Twitter event check
	{ checkTweet } = EVENTS.TWITTER;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Listen to client events
interactionCreate(client);
message(client);
messageDelete(client);
messageReactionAdd(client);
messageReactionRemove(client);
messageUpdate(client);
ready(client);
// Listen to bot listing events
botListSpace.run(client);
botsForDiscord.run(client);
discordBoat.run(client);
discordBotList.run(client);
discordBotsGG.run(client);
topGG.run(client);

const routes = require('./routes');
routes(app, client);

app.use((req, res)=>res.redirect('https://officialsirh.github.io/'));

app.listen(8079);

// Check for Tweet from ComputerLunch
setInterval(() => checkTweet(client), 2000);

(async () => {
	await connect(process.env.mongoDBKey, {
		useNewUrlParser: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	});
	return client.login(process.env.token);
})()

module.exports.client = client;