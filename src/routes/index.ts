import type { FastifyInstance } from 'fastify';
import type { Semblance } from '#structures/Semblance';
import discordListingsRouter from './discordListings.js';

export default function (app: FastifyInstance, client: Semblance) {
  discordListingsRouter(app, client);
}
