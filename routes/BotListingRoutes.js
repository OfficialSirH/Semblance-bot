'use strict';

// Bot listing SDKs
const TopggSDK = require('@top-gg/sdk'),
	{BfdSDK, DblSDK, BlsSDK, DboatsSDK} = require('../structures'),
    // Bot listing event handlers
	botListSpace = require('../events/botListingEvents/botListSpace'),
	botsForDiscord = require('../events/botListingEvents/botsForDiscord'),
	discordBoat = require('../events/botListingEvents/discordBoat'),
	discordBotList = require('../events/botListingEvents/discordBotList'),
	//discordBotsGG = require('../events/botListingEvents/discordBotsGG'),
	topGG = require('../events/botListingEvents/topGG');

module.exports = function(app) {
    const topggWebhook = new TopggSDK.Webhook(JSON.parse(process.env.topGGAuth).webAuth),
	bfdWebhook = new BfdSDK.Webhook(JSON.parse(process.env.botsForDiscordAuth).webAuth),
	dblWebhook = new DblSDK.Webhook(JSON.parse(process.env.discordBotListAuth).webAuth),
	blsWebhook = new BlsSDK.Webhook(JSON.parse(process.env.botListSpaceAuth).webAuth),
	dboatsWebhook = new DboatsSDK.Webhook(JSON.parse(process.env.DBoatsAuth).webAuth);

    app.route('/dblwebhook')
        .post(topggWebhook.middleware(), topGG.voteHandler);

    app.route('/bfdwebhook')
        .post(bfdWebhook.middleware(), botsForDiscord.voteHandler);

    app.route('/discordblwebhook')
        .options(dblWebhook.middleware(), () => console.log(`Test vote was successful`))
        .post(dblWebhook.middleware(), discordBotList.voteHandler);

    app.route('/blswebhook')
        .post(blsWebhook.middleware(), botListSpace.voteHandler);

	app.route('/dboatswebhook')
		.post(dboatswebhook.middleware(), discordBoat.voteHandler);
}