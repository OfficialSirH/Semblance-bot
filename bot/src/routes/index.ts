import type { FastifyInstance } from 'fastify';
import type { SapphireClient } from '@sapphire/framework';
import discordListingsRouter from './discordListings.js';

export default function (app: FastifyInstance, client: SapphireClient) {
  discordListingsRouter(app, client);
}
