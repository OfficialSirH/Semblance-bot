import { WebhookPayload } from '@top-gg/sdk/dist/typings';
import { Semblance } from '@semblance/structures';

export interface request extends Request {
    vote: WebhookPayload;
    client: Semblance;
}