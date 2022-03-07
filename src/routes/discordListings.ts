import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { SapphireClient } from '@sapphire/framework';
import { VoteHandler } from '#structures/VoteHandler';
import type { WebhookPayload } from '@top-gg/sdk';
import type { DiscordsVote } from '#lib/interfaces/discords';
import type { DBLVote } from '#lib/interfaces/discordBotList';
import type { DLSVote } from '#lib/interfaces/discordListSpace';

export default function (app: FastifyInstance, client: SapphireClient) {
  const discordBotList = new VoteHandler(client, 'discordbotlist.com');
  const discordListSpace = new VoteHandler(client, 'discordlist.space');
  const discords = new VoteHandler(client, 'discords.com');
  const topGG = new VoteHandler(client, 'top.gg');

  app.route<{
    Body: WebhookPayload;
  }>({
    method: 'POST',
    url: '/dblwebhook',
    preHandler: (request, reply, done) => {
      middleware(request, reply);
      done();
    },
    handler: async (request, reply) => topGG.handle(request, reply),
  });

  app.route<{
    Body: DiscordsVote;
  }>({
    method: 'POST',
    url: '/bfdwebhook',
    preHandler: (request, reply, done) => {
      middleware(request, reply);
      done();
    },
    handler: async (request, reply) => discords.handle(request, reply),
  });

  app.route<{
    Body: DBLVote;
  }>({
    method: 'POST',
    url: '/discordblwebhook',
    preHandler: (request, reply, done) => {
      middleware(request, reply);
      done();
    },
    handler: async (request, reply) => discordBotList.handle(request, reply),
  });

  app.route<{
    Body: DLSVote;
  }>({
    method: 'POST',
    url: '/dlswebhook',
    preHandler: (request, reply, done) => {
      middleware(request, reply);
      done();
    },
    handler: async (request, reply) => discordListSpace.handle(request, reply),
  });
}

export const middleware = (req: FastifyRequest, rep: FastifyReply) => {
  if (typeof req.body != 'object') return rep.status(422).send({ error: 'Malformed request' });
  const { Authorization, authorization } = req.headers;
  if (Authorization != process.env.BOT_LISTING_AUTH && authorization != process.env.BOT_LISTING_AUTH)
    return rep.status(403).send({ error: 'Invalid Authorization header' });
};
