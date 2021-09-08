import type { WebhookPayload } from '@top-gg/sdk/dist/typings';
import type { FastifyRequest } from 'fastify';

export type TGGRequest = FastifyRequest<{ Body: WebhookPayload }>;