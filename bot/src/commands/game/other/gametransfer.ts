import { buildCustomId } from '#constants/components';
import { attachments, Category, gameTransferPages, randomColor, SubCategory } from '#constants/index';
import type { ParsedCustomIdData } from '#lib/typess/Semblance';
import { Command } from '#structures/Command';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, type MessageActionRowComponentBuilder } from '@discordjs/builders';
import { ButtonStyle, type APIChatInputApplicationCommandGuildInteraction, type APIMessageComponentButtonInteraction } from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class GameTransfer extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'gametransfer',
			description: 'See a step-by-step guide to transfering your game progress into the cloud and onto another device.',
			fullCategory: [Category.game, SubCategory.other]
		});
	}

	public override templateRun(interaction: APIChatInputApplicationCommandGuildInteraction) {
		const embed = new EmbedBuilder()
			.setTitle('Game Transfer')
			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setImage(gameTransferPages[0])
			.setDescription('Step 1:');
		const component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(buildCustomId({ command: 'gametransfer', action: 'left', id: interaction.member.user.id }))
				.setEmoji({ name: '⬅️' })
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId(
					buildCustomId({
						command: 'gametransfer',
						action: 'right',
						id: interaction.member.user.id
					})
				)
				.setEmoji({ name: '➡️' })
				.setStyle(ButtonStyle.Primary)
		);
		return {
			embeds: [embed.toJSON()],
			files: [attachments.currentLogo],
			components: [component.toJSON()]
		};
	}

	public override async componentRun(
		reply: FastifyReply,
		interaction: APIMessageComponentButtonInteraction,
		data: ParsedCustomIdData<'right' | 'left'>
	) {
		const embed = new EmbedBuilder(interaction.message.embeds.at(0));
		let currentPage = gameTransferPages.indexOf(embed.data.image ? embed.data.image.url : '');

		if (data.action == 'right') currentPage = currentPage == 4 ? 0 : ++currentPage;
		else if (data.action == 'left') currentPage = currentPage == 0 ? 4 : --currentPage;

		let description: string | null = null;
		if (currentPage == 0) description = '\nClick on the Game transfer button in the menu';
		else if (currentPage == 1) description = '\nCreate an account and login into it';
		else if (currentPage == 2) description = '\nClick on the Transfer Save Data button after logging into your account';
		else if (currentPage == 3) description = '\nUpload your progress from your current device';
		else if (currentPage == 4) description = '\nDownload your progress onto the other device you wish to put your progress on';

		embed
			.setThumbnail(attachments.currentLogo.url)
			.setImage(gameTransferPages[currentPage])
			.setDescription(`Step ${currentPage + 1}:${description}`);
		await this.client.api.interactions.updateMessage(reply, { embeds: [embed.toJSON()] });
	}
}
