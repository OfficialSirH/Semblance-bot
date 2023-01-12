import type { Attachy } from '#structures/Attachy';
import type { FastifyReply } from 'fastify';
import type { REST, RawFile } from '@discordjs/rest';
import {
  WebhooksAPI,
  type APIInteractionResponse,
  type APIInteractionResponseCallbackData,
  InteractionResponseType,
  type Snowflake,
  type APICommandAutocompleteInteractionResponseCallbackData,
  type APIModalInteractionResponseCallbackData,
} from '@discordjs/core';

export class FastifyBasedAPI {
  readonly webhooks: WebhooksAPI;
  readonly interactions: FastifyBasedInteractionsAPI;

  constructor(rest: REST) {
    this.webhooks = new WebhooksAPI(rest);
    this.interactions = new FastifyBasedInteractionsAPI(this.webhooks);
  }
}

export class FastifyBasedInteractionsAPI {
  constructor(readonly webhooks: WebhooksAPI) {}

  async resolveData(
    providedData: Omit<
      Extract<
        APIInteractionResponse,
        { type: InteractionResponseType.ChannelMessageWithSource | InteractionResponseType.UpdateMessage }
      >,
      'data'
    > & { files?: Attachy[]; data?: APIInteractionResponseCallbackData },
  ) {
    const data = { ...providedData } as Extract<
      APIInteractionResponse,
      { type: InteractionResponseType.ChannelMessageWithSource | InteractionResponseType.UpdateMessage }
    > & { files?: Attachy[] };

    if (data.data) {
      if (!data.data?.allowed_mentions) data.data.allowed_mentions = { parse: [] };
    }

    if (data.files) {
      const form = new FormData();
      form.append('payload_json', JSON.stringify(data));
      for (const file of data.files) {
        form.append('file', new Blob([await file.data()]), file.name);
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

  async deferReply(res: FastifyReply, data?: Pick<APIInteractionResponseCallbackData, 'flags'>) {
    await res.send({
      type: InteractionResponseType.DeferredChannelMessageWithSource,
      data,
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
    if (!data.allowed_mentions) data.allowed_mentions = { parse: [] };
    await this.webhooks.execute(interactionIdToken.id, interactionIdToken.token, data);
  }

  async editReply(
    interactionIdToken: { id: Snowflake; token: string },
    data: APIInteractionResponseCallbackData & { files?: RawFile[] },
    messageId: Snowflake = '@original',
  ) {
    if (!data.allowed_mentions) data.allowed_mentions = { parse: [] };
    await this.webhooks.editMessage(interactionIdToken.id, interactionIdToken.token, messageId, data);
  }

  async getOriginalReply(interactionIdToken: { id: Snowflake; token: string }) {
    return this.webhooks.getMessage(interactionIdToken.id, interactionIdToken.token, '@original');
  }

  async deleteReply(interactionIdToken: { id: Snowflake; token: string }, messageId: Snowflake = '@original') {
    await this.webhooks.deleteMessage(interactionIdToken.id, interactionIdToken.token, messageId);
  }

  async updateMessage(
    res: FastifyReply,
    data?: APIInteractionResponseCallbackData & {
      files?: Attachy[];
    },
  ) {
    const resolvedData = await this.resolveData({ data, type: InteractionResponseType.UpdateMessage });
    await res.type('multipart/form-data').send(resolvedData);
  }

  async autocomplete(res: FastifyReply, data: APICommandAutocompleteInteractionResponseCallbackData) {
    await res.send({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data,
    });
  }

  async createModal(res: FastifyReply, data: APIModalInteractionResponseCallbackData) {
    await res.send({
      type: InteractionResponseType.Modal,
      data,
    });
  }
}
