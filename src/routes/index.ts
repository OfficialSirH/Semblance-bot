import { FastifyInstance } from 'fastify';
import { Semblance } from '@semblance/structures';
import BotListingRouter from './BotListingRoutes';

export default function (app: FastifyInstance, client: Semblance) {
    BotListingRouter(app, client);
}