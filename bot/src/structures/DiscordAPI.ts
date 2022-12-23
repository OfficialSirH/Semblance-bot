import { WebhooksAPI, type APIInteractionResponseCallbackData } from '@discordjs/core';
import { type APIInteractionResponse, InteractionResponseType, REST, type RawFile, type Snowflake } from 'discord.js';
import type { Attachy } from '#structures/Attachy';
import type { FastifyReply } from 'fastify';

export class FastifyBasedAPI {
  readonly webhooks: WebhooksAPI;
  readonly interactions: FastifyBasedInteractionsAPI;

  constructor(token: string) {
    const rest = new REST({ version: '10' }).setToken(token);

    this.webhooks = new WebhooksAPI(rest);
    this.interactions = new FastifyBasedInteractionsAPI(this.webhooks);
  }
}

export class FastifyBasedInteractionsAPI {
  constructor(readonly webhooks: WebhooksAPI) {}

  async resolveData(data: APIInteractionResponse & { files?: Attachy[] }) {
    if (data.files) {
      const form = new FormData();
      form.append('payload_json', JSON.stringify(data));
      for (const file of data.files) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        form.append('file', new Blob([await file.data()]), file.name!);
      }
      return form;
    }
    return data;
  }

  async reply(
    res: FastifyReply,
    data: APIInteractionResponseCallbackData & {
      files?: Attachy[];
    },
  ) {
    const resolvedData = await this.resolveData({ data, type: InteractionResponseType.ChannelMessageWithSource });
    await res.type('multipart/form-data').send(resolvedData);
  }

  async defer(res: FastifyReply) {
    await res.send({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
    });
  }

  async deferMessageUpdate(res: FastifyReply) {
    await res.send({
      type: InteractionResponseType.DeferredMessageUpdate,
    });
  }

  async followUp(
    interactionIdToken: { id: Snowflake; token: string },
    data: APIInteractionResponseCallbackData & { files?: RawFile[] },
  ) {
    await this.webhooks.execute(interactionIdToken.id, interactionIdToken.token, data);
  }

  async editReply(
    interactionIdToken: { id: Snowflake; token: string },
    data: APIInteractionResponseCallbackData & { files?: RawFile[] },
    messageId: Snowflake = '@original',
  ) {
    await this.webhooks.editMessage(interactionIdToken.id, interactionIdToken.token, messageId, data);
  }

  async getOriginalReply(interactionIdToken: { id: Snowflake; token: string }) {
    return this.webhooks.getMessage(interactionIdToken.id, interactionIdToken.token, '@original');
  }

  async deleteReply(interactionIdToken: { id: Snowflake; token: string }, messageId: Snowflake = '@original') {
    await this.webhooks.deleteMessage(interactionIdToken.id, interactionIdToken.token, messageId);
  }

  async updateMessage(res: FastifyReply, data: APIInteractionResponseCallbackData & { files?: Attachy[] }) {
    const resolvedData = await this.resolveData({ data, type: InteractionResponseType.UpdateMessage });
    await res.type('multipart/form-data').send(resolvedData);
  }

  async createAutocompleteResponse(res: FastifyReply, data: APIInteractionResponseCallbackData) {
    await res.type('multipart/form-data').send({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data,
    });
  }

  async createModal(res: FastifyReply, data: APIInteractionResponseCallbackData) {
    await res.send({
      type: InteractionResponseType.Modal,
      data,
    });
  }
}
