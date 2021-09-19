import type { FastifyInstance } from 'fastify';
import type { Semblance } from '@semblance/structures';
import discordListingsRouter from './discordListings';

export default function (app: FastifyInstance, client: Semblance) {
    discordListingsRouter(app, client);
}