import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Semblance } from '@semblance/structures';
import {
    tpggVoteHandler,
    bfdVoteHandler,
    dblVoteHandler,
    dlsVoteHandler,
    dbVoteHandler  
} from '@semblance/events';
import type { WebhookPayload } from '@top-gg/sdk';
import type { DiscordsVote } from '@semblance/lib/interfaces/discords';
import type { DBLVote } from '@semblance/lib/interfaces/discordBotList';
import type { DLSVote } from '@semblance/lib/interfaces/discordListSpace';
import type { BoatsVote } from '@semblance/lib/interfaces/discordBoats';

export default function (app: FastifyInstance, client: Semblance) {
    app.route<{
        Body: WebhookPayload,
    }>({
        method: 'POST',
        url: '/dblwebhook',
        preHandler: (request, reply, done) => {
            middleware(request, reply);
            done();
        },
        handler: async (request, reply) => tpggVoteHandler(request, reply, client)
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
        handler: async (request, reply) => bfdVoteHandler(request, reply, client)
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
        handler: async (request, reply) => dblVoteHandler(request, reply, client)
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
        handler: async (request, reply) => dlsVoteHandler(request, reply, client)
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
        handler: async (request, reply) => dbVoteHandler(request, reply, client)
    });
}

export const middleware = (req: FastifyRequest, rep: FastifyReply) => {
    if (typeof req.body != 'object') return rep.status(422).send({ error: 'Malformed request' });
    const { Authorization, authorization } = req.headers;
    if (Authorization != process.env.USERDATA_AUTH && authorization != process.env.BOT_LISTING_AUTH) return rep.status(403).send({ error: 'Invalid Authorization header' });
    return rep.status(200).send({ success: true });
}