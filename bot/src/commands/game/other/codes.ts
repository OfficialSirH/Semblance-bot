import { buildCustomId } from '#constants/components';
import { attachments, Category, randomColor, SubCategory } from '#constants/index';
import type { ParsedCustomIdData } from '#lib/typess/Semblance';
import { Command } from '#structures/Command';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, type MessageActionRowComponentBuilder } from '@discordjs/builders';
import { ButtonStyle, MessageFlags, type APIChatInputApplicationCommandGuildInteraction, type APIMessageComponentInteraction } from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class Codes extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'codes',
			description: 'get all of the ingame codes',
			fullCategory: [Category.game, SubCategory.other]
		});
	}

	public override async componentRun(
		reply: FastifyReply,
		interaction: APIMessageComponentInteraction,
		data: ParsedCustomIdData<'expired' | 'valid'>
	): Promise<void> {
		const codeHandler = await this.client.db.information.findUnique({ where: { type: 'codes' } });
		if (!codeHandler)
			return this.client.api.interactions.reply(reply, {
				content: 'codes object is missing',
				flags: MessageFlags.Ephemeral
			});

		const userId = data.id;
		const embed = new EmbedBuilder(interaction.message.embeds.at(0));

		let component: ActionRowBuilder<MessageActionRowComponentBuilder>;
		switch (data.action) {
			case 'expired':
				embed.setDescription(codeHandler.expired);
				component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId(
							buildCustomId({
								command: this.name,
								action: 'valid',
								id: userId
							})
						)
						.setLabel('View Valid Codes')
						.setStyle(ButtonStyle.Primary)
				);
				break;
			case 'valid':
				embed.setDescription(codeHandler.value);
				component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
					new ButtonBuilder()
						.setCustomId(
							buildCustomId({
								command: 'codes',
								action: 'expired',
								id: userId
							})
						)
						.setLabel('View Expired Codes')
						.setStyle(ButtonStyle.Primary)
				);
		}

		embed.setThumbnail(attachments.currentLogo.url);
		await this.client.api.interactions.updateMessage(reply, {
			embeds: [embed.toJSON()],
			components: [component.toJSON()]
		});
	}

	public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
		await this.client.api.interactions.reply(res, await this.templateRun(interaction));
	}

	public override async templateRun(interaction: APIChatInputApplicationCommandGuildInteraction) {
		const codeHandler = await this.client.db.information.findUnique({ where: { type: 'codes' } });
		if (!codeHandler) return { content: 'No codes found.' };
		const embed = new EmbedBuilder()
			.setTitle('Darwinium Codes')

			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setDescription(codeHandler.value)
			.setFooter({ text: codeHandler.footer as string });
		const component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(
					buildCustomId({
						command: 'codes',
						action: 'expired',
						id: interaction.member.user.id
					})
				)
				.setLabel('View Expired Codes')
				.setStyle(ButtonStyle.Primary)
		);
		return {
			embeds: [embed.toJSON()],
			files: [attachments.currentLogo],
			components: [component.toJSON()]
		};
	}

	public override data() {
		return {
			command: { name: this.name, description: this.description }
		};
	}
}
