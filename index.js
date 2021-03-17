const config = require('./config'), TopggSDK = require('@top-gg/sdk');
// Semblance client
const Semblance = require('./structures/Semblance'),
	client = new Semblance({
		 disableMentions: "everyone", // V13 Release replacement: disableMentions: { parse: ['users', 'roles'], repliedUser: true }
    		messageCacheLifetime: 30,
    		messageSweepInterval: 300,
		partials: [ "USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION" ],
		ws: {
    	 	 	intents: [ "GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS" ]
    		}
	}),
	// express routing
	express = require('express'),
	app = express(),
	// Database connection import
	{ connect } = require('mongoose'),
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
	topGG = require('./events/botListingEvents/topGG'),
	// Ping web host (Heroku)
	stayActive = require('./stayActive.js');

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

const dblWebhook = new TopggSDK.Webhook(JSON.parse(process.env.topGGAuth).webAuth);

app.route('/dblwebhook')
	.post(dblWebhook.middleware(), topGG.voteHandler);

/**
 * MAIN PRIORITY: transfer the botsfordiscord and discordbotlist broken handlers to the new modified version of Top.gg's handler.
 */
app.route('/bfdwebhook')
	.post(botsForDiscord.bfd.webhook._handleRequest);

app.route('/discordblwebhook')
	.options(function (req, res) { 
		discordBotList.dbl.webhook._returnTestResponse(res, 200, 'Successful test');
	})
	.post(discordBotList.dbl.webhook._handleRequest);

/*app.route('/blswebhook')
	.post();*/

app.get((req, res)=>{
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(process.env.PORT);
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