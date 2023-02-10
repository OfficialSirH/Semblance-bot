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
  type APIInteraction,
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
    callbackData: Omit<
      Extract<
        APIInteractionResponse,
        { type: InteractionResponseType.ChannelMessageWithSource | InteractionResponseType.UpdateMessage }
      >,
      'data'
    > & { files?: Attachy[]; data?: APIInteractionResponseCallbackData },
  ) {
    const responseData = { ...callbackData } as Extract<
      APIInteractionResponse,
      { type: InteractionResponseType.ChannelMessageWithSource | InteractionResponseType.UpdateMessage }
    > & { data?: { files?: Attachy[] } };

    if (responseData.data) {
      if (!responseData.data?.allowed_mentions) responseData.data.allowed_mentions = { parse: [] };
    }

    if (responseData.data?.files) {
      const form = new FormData();
      for (const file of responseData.data.files as Attachy[]) {
        form.append(file.name, new Blob([await file.data()]), file.name);
      }

      delete responseData.data.files;
      form.append('payload_json', JSON.stringify(responseData.data));

      return form;
    }
    return responseData.data;
  }

  async reply(
    res: FastifyReply,
    data: APIInteractionResponseCallbackData & {
      files?: Attachy[];
    },
  ) {
    const resolvedData = await this.resolveData({ data, type: InteractionResponseType.ChannelMessageWithSource });
    if (resolvedData instanceof FormData) await res.type('multipart/form-data').send(resolvedData);
    else await res.send(resolvedData);
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

  async followUp(interaction: APIInteraction, data: APIInteractionResponseCallbackData & { files?: RawFile[] }) {
    if (!data.allowed_mentions) data.allowed_mentions = { parse: [] };
    await this.webhooks.execute(interaction.id, interaction.token, data);
  }

  async editReply(
    interaction: APIInteraction,
    data: APIInteractionResponseCallbackData & { files?: RawFile[] },
    messageId: Snowflake = '@original',
  ) {
    if (!data.allowed_mentions) data.allowed_mentions = { parse: [] };
    await this.webhooks.editMessage(interaction.application_id, interaction.token, messageId, data);
  }

  async getOriginalReply(interaction: APIInteraction) {
    return this.webhooks.getMessage(interaction.application_id, interaction.token, '@original');
  }

  async deleteReply(interaction: APIInteraction, messageId: Snowflake = '@original') {
    await this.webhooks.deleteMessage(interaction.application_id, interaction.token, messageId);
  }

  async updateMessage(
    res: FastifyReply,
    data?: APIInteractionResponseCallbackData & {
      files?: Attachy[];
    },
  ) {
    const resolvedData = await this.resolveData({ data, type: InteractionResponseType.UpdateMessage });
    if (resolvedData instanceof FormData) await res.type('multipart/form-data').send(resolvedData);
    else await res.send(resolvedData);
  }

  async autocomplete(res: FastifyReply, choices: APICommandAutocompleteInteractionResponseCallbackData['choices']) {
    await res.send({
      type: InteractionResponseType.ApplicationCommandAutocompleteResult,
      data: {
        choices,
      },
    });
  }

  async createModal(res: FastifyReply, data: APIModalInteractionResponseCallbackData) {
    await res.send({
      type: InteractionResponseType.Modal,
      data,
    });
  }
}
