import { Express } from 'express';
// Bot listing Webhook
import { Semblance, Webhook } from '@semblance/structures';
// Bot listing event handlers
import {
    tpggVoteHandler,
    bfdVoteHandler,
    dblVoteHandler,
    blsVoteHandler,
    dbVoteHandler  
} from '@semblance/events';

export default function (app: Express, client: Semblance) {
    const topggWebhook = new Webhook(JSON.parse(process.env.topGGAuth).webAuth),
	bfdWebhook = new Webhook(JSON.parse(process.env.botsForDiscordAuth).webAuth),
	dblWebhook = new Webhook(JSON.parse(process.env.discordBotListAuth).webAuth),
	blsWebhook = new Webhook(JSON.parse(process.env.botListSpaceAuth).webAuth),
	dboatsWebhook = new Webhook(JSON.parse(process.env.DBoatsAuth).webAuth);

    app.route('/dblwebhook')
        .post(topggWebhook.middleware(),(req, res) => tpggVoteHandler(req, res, client));

    app.route('/bfdwebhook')
        .post(bfdWebhook.middleware(),(req, res) => bfdVoteHandler(req, res, client));

    app.route('/discordblwebhook')
        .options(dblWebhook.middleware(), () => console.log(`Test vote was successful`))
        .post(dblWebhook.middleware(),(req, res) => dblVoteHandler(req, res, client));

    app.route('/blswebhook')
        .post(blsWebhook.middleware(),(req, res) => blsVoteHandler(req, res, client));

	app.route('/dboatswebhook')
		.post(dboatsWebhook.middleware(),(req, res) => dbVoteHandler(req, res, client));
}