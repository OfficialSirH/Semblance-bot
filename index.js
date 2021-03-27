const config = require('./config');
require('dotenv').config();
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
	// Bot listing SDKs
	TopggSDK = require('@top-gg/sdk'),
	BfdSDK = require('./structures/@bots-for-discord/sdk/dist'),
	DblSDK = require('./structures/@discord-bot-list/sdk/dist'),
	BlsSDK = require('./structures/@botlist-space/sdk/dist'),
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

const topggWebhook = new TopggSDK.Webhook(JSON.parse(process.env.topGGAuth).webAuth),
	bfdWebhook = new BfdSDK.Webhook(JSON.parse(process.env.botsForDiscordAuth).webAuth),
	dblWebhook = new DblSDK.Webhook(JSON.parse(process.env.discordBotListAuth).webAuth),
	blsWebhook = new BlsSDK.Webhook(JSON.parse(process.env.botListSpaceAuth).webAuth);

app.route('/dblwebhook')
	.post(topggWebhook.middleware(), topGG.voteHandler);

app.route('/bfdwebhook')
	.post(bfdWebhook.middleware(), botsForDiscord.voteHandler);

app.route('/discordblwebhook')
	.options(dblWebhook.middleware(), () => console.log(`Test vote was successful`))
	.post(dblWebhook.middleware(), discordBotList.voteHandler);

app.route('/blswebhook')
	.post(blsWebhook.middleware(), botListSpace.voteHandler);

app.use((req, res)=>res.redirect('https://officialsirh.github.io/'));

app.listen(80);
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