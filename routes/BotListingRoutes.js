'use strict';

// Bot listing SDKs
const TopggSDK = require('@top-gg/sdk'),
	{BfdSDK, DblSDK, BlsSDK, DboatsSDK} = require('@semblance/structures'),
    // Bot listing event handlers
	EVENTS = require('../events').EVENTS,
	{ botListSpace, botsForDiscord, discordBoat, discordBotList, discordBotsGG, topGG } = EVENTS.BOT_LISTING;

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