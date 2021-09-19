import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Semblance } from '@semblance/structures';
import { DiscordBoats, DiscordBotList, DiscordListSpace, Discords, TopGG } from '../handlers';
import type { WebhookPayload } from '@top-gg/sdk';
import type { DiscordsVote } from '@semblance/lib/interfaces/discords';
import type { DBLVote } from '@semblance/lib/interfaces/discordBotList';
import type { DLSVote } from '@semblance/lib/interfaces/discordListSpace';
import type { BoatsVote } from '@semblance/lib/interfaces/discordBoats';

export default function (app: FastifyInstance, client: Semblance) {
    const discordBoats = new DiscordBoats(client);
    const discordBotList = new DiscordBotList(client);
    const discordListSpace = new DiscordListSpace(client);
    const discords = new Discords(client);
    const topGG = new TopGG(client);

    app.route<{
        Body: WebhookPayload,
    }>({
        method: 'POST',
        url: '/dblwebhook',
        preHandler: (request, reply, done) => {
            middleware(request, reply);
            done();
        },
        handler: async (request, reply) => topGG.handle(request, reply)
    });

    app.route<{
        Body: DiscordsVote,
    }>({
        method: 'POST',
        url: '/bfdwebhook',
        preHandler: (request, reply, done) => {
            middleware(request, reply);
            done();
        },
        handler: async (request, reply) => discords.handle(request, reply)
    });

    app.route<{
        Body: DBLVote,
    }>({
        method: 'POST',
        url: '/discordblwebhook',
        preHandler: (request, reply, done) => {
            middleware(request, reply);
            done();
        },
        handler: async (request, reply) => discordBotList.handle(request, reply)
    });

    app.route<{
        Body: DLSVote,
    }>({
        method: 'POST',
        url: '/dlswebhook',
        preHandler: (request, reply, done) => {
            middleware(request, reply);
            done();
        },
        handler: async (request, reply) => discordListSpace.handle(request, reply)
    });

    app.route<{
        Body: BoatsVote,
    }>({
        method: 'POST',
        url: '/dboatswebhook',
        preHandler: (request, reply, done) => {
            middleware(request, reply);
            done();
        },
        handler: async (request, reply) => discordBoats.handle(request, reply)
    });
}

export const middleware = (req: FastifyRequest, rep: FastifyReply) => {
    if (typeof req.body != 'object') return rep.status(422).send({ error: 'Malformed request' });
    const { Authorization, authorization } = req.headers;
    if (Authorization != process.env.USERDATA_AUTH && authorization != process.env.BOT_LISTING_AUTH) return rep.status(403).send({ error: 'Invalid Authorization header' });
}