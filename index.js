const config = require('./config');
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
	// Database connection import
	{ connect } = require('mongoose'),
	// Event handlers
	checkTweet = require('./events/checkTweet'),
	discordBoat = require('./events/discordBoat'),
	interactionCreate = require('./events/interactionCreate'),
	message = require('./events/message'),
	messageDelete = require('./events/messageDelete'),
	messageReactionAdd = require('./events/messageReactionAdd'),
	messageReactionRemove = require('./events/messageReactionRemove'),
	messageUpdate = require('./events/messageUpdate'),
	ready = require('./events/ready'),
	topGG = require('./events/topGG'),
	// Ping web host (Heroku)
	stayActive = require('./stayActive.js');

// Listen to client events
interactionCreate(client);
message(client);
messageDelete(client);
messageReactionAdd(client);
messageReactionRemove(client);
messageUpdate(client);
ready(client);
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