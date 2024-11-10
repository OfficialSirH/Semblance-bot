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
	type APIInteraction
} from '@discordjs/core';
import { FormData } from 'undici';
import { FormDataEncoder, type FormDataLike } from 'form-data-encoder';
import { Readable } from 'stream';
import { Blob } from 'buffer';

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
			Extract<APIInteractionResponse, { type: InteractionResponseType.ChannelMessageWithSource | InteractionResponseType.UpdateMessage }>,
			'data'
		> & { files?: Attachy[]; data?: APIInteractionResponseCallbackData }
	) {
		const responseData = { ...callbackData } as Extract<
			APIInteractionResponse,
			{ type: InteractionResponseType.ChannelMessageWithSource | InteractionResponseType.UpdateMessage }
		> & { data?: { files?: Attachy[] } };

		if (responseData.data) {
			if (!responseData.data?.allowed_mentions) responseData.data.allowed_mentions = { parse: [] };
		}

		if (responseData.data?.files?.length) {
			const form = new FormData();
			for (const [index, file] of responseData.data.files.entries()) {
				form.append(`files[${index}]`, new Blob([await file.data()]), file.name);
			}

			if (responseData.data) {
				responseData.data.attachments = responseData.data.files.map((file, index) => ({
					id: index.toString(),
					filename: file.name
				}));

				delete responseData.data.files;

				form.append('payload_json', JSON.stringify(responseData));
			}

			return form;
		}
		return responseData;
	}

	async reply(
		res: FastifyReply,
		data: APIInteractionResponseCallbackData & {
			files?: Attachy[];
		}
	) {
		const resolvedData = await this.resolveData({ data, type: InteractionResponseType.ChannelMessageWithSource });
		if (resolvedData instanceof FormData) {
			const encoder = new FormDataEncoder(resolvedData as unknown as FormDataLike);
			await res.headers(encoder.headers).header('Connection', 'keep-alive').send(Readable.from(encoder.encode()));
		} else await res.send(resolvedData);
	}

	async deferReply(res: FastifyReply, data?: Pick<APIInteractionResponseCallbackData, 'flags'>) {
		await res.header('Connection', 'keep-alive').send({
			type: InteractionResponseType.DeferredChannelMessageWithSource,
			data
		});
	}

	async deferMessageUpdate(res: FastifyReply) {
		await res.header('Connection', 'keep-alive').send({
			type: InteractionResponseType.DeferredMessageUpdate
		});
	}

	async followUp(interaction: APIInteraction, data: APIInteractionResponseCallbackData & { files?: RawFile[] }) {
		if (!data.allowed_mentions) data.allowed_mentions = { parse: [] };
		await this.webhooks.execute(interaction.id, interaction.token, data);
	}

	async editReply(
		interaction: APIInteraction,
		data: APIInteractionResponseCallbackData & { files?: RawFile[] },
		messageId: Snowflake = '@original'
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
		}
	) {
		const resolvedData = await this.resolveData({ data, type: InteractionResponseType.UpdateMessage });
		if (resolvedData instanceof FormData) {
			const encoder = new FormDataEncoder(resolvedData as unknown as FormDataLike);
			await res.headers(encoder.headers).header('Connection', 'keep-alive').send(Readable.from(encoder.encode()));
		} else await res.send(resolvedData);
	}

	async autocomplete(res: FastifyReply, choices: APICommandAutocompleteInteractionResponseCallbackData['choices']) {
		await res.header('Connection', 'keep-alive').send({
			type: InteractionResponseType.ApplicationCommandAutocompleteResult,
			data: {
				choices
			}
		});
	}

	async createModal(res: FastifyReply, data: APIModalInteractionResponseCallbackData) {
		await res.header('Connection', 'keep-alive').send({
			type: InteractionResponseType.Modal,
			data
		});
	}
}
