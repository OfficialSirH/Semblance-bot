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
    const botListingWebhook = new Webhook(process.env.BOT_LISTING_AUTH);

    app.route('/dblwebhook')
        .post(botListingWebhook.middleware(),(req, res) => tpggVoteHandler(req, res, client));

    app.route('/bfdwebhook')
        .post(botListingWebhook.middleware(),(req, res) => bfdVoteHandler(req, res, client));

    app.route('/discordblwebhook')
        .options(botListingWebhook.middleware(), () => console.log(`Test vote was successful`))
        .post(botListingWebhook.middleware(),(req, res) => dblVoteHandler(req, res, client));

    app.route('/blswebhook')
        .post(botListingWebhook.middleware(),(req, res) => blsVoteHandler(req, res, client));

	app.route('/dboatswebhook')
		.post(botListingWebhook.middleware(),(req, res) => dbVoteHandler(req, res, client));
}