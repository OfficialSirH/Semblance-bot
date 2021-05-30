import { Express } from 'express';
import { Semblance } from '@semblance/structures';
import BotListingRouter from './BotListingRoutes';

export default function (app: Express, client: Semblance) {
    BotListingRouter(app);
}