import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { VoteHandler } from './structures/VoteHandler.js';
import type { WebhookPayload } from '@top-gg/sdk';
import type { DBLVote } from './interfaces/discordBotList.js';
import type { Client } from 'discord.js';

export default function (app: FastifyInstance, client: Client) {
  const discordBotList = new VoteHandler(client, 'discordbotlist.com');
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
}

export const middleware = (req: FastifyRequest, rep: FastifyReply) => {
  if (typeof req.body != 'object') return rep.status(422).send({ error: 'Malformed request' });
  const { Authorization, authorization } = req.headers;
  if (Authorization != process.env.BOT_LISTING_AUTH && authorization != process.env.BOT_LISTING_AUTH)
    return rep.status(403).send({ error: 'Invalid Authorization header' });
};
