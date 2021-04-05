const config = require('./config');
require('dotenv').config();
// Semblance client
const Semblance = require('./structures/Semblance'), { Intents } = require('discord.js'),
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
	{ connect } = require('mongoose'), UserDataLoad = require('./models/UserData'),
	// Client event handlers
	checkTweet = require('./events/checkTweet'),
	interactionCreate = require('./events/interactionCreate'),
	message = require('./events/message'),
	messageDelete = require('./events/messageDelete'),
	messageReactionAdd = require('./events/messageReactionAdd'),
	messageReactionRemove = require('./events/messageReactionRemove'),
	messageUpdate = require('./events/messageUpdate'),
	ready = require('./events/ready'),
	// Bot listing event handlers
	botListSpace = require('./events/botListingEvents/botListSpace'),
	botsForDiscord = require('./events/botListingEvents/botsForDiscord'),
	discordBoat = require('./events/botListingEvents/discordBoat'),
	discordBotList = require('./events/botListingEvents/discordBotList'),
	discordBotsGG = require('./events/botListingEvents/discordBotsGG'),
	topGG = require('./events/botListingEvents/topGG');

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
discordBoat(client);
discordBotList.run(client);
discordBotsGG(client);
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