import { serversPerPage } from '#constants/commands';
import { buildCustomId } from '#constants/components';
import { Category, GuildId, PreconditionName, avatarUrl, guildBookPage, randomColor } from '#constants/index';
import type { CustomIdData, ParsedCustomIdData } from '#lib/typess/Semblance';
import { Command } from '#structures/Command';
import type { InteractionOptionResolver } from '#structures/InteractionOptionResolver';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, type MessageActionRowComponentBuilder } from '@discordjs/builders';
import {
	ApplicationCommandOptionType,
	ButtonStyle,
	type APIChatInputApplicationCommandGuildInteraction,
	type APIMessageComponentButtonInteraction,
	type APIUser,
	type RESTPostAPIApplicationCommandsJSONBody
} from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class ServerList extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'serverlist',
			description: 'Lists all servers that Semblance is in.',
			fullCategory: [Category.developer],
			preconditions: [PreconditionName.OwnerOnly],
			componentParseOptions: {
				extraProps: {
					page: 'number'
				}
			}
		});
	}

	public override async chatInputRun(
		res: FastifyReply,
		interaction: APIChatInputApplicationCommandGuildInteraction,
		options: InteractionOptionResolver
	) {
		const page = options.getInteger('page') || 1;

		const { chosenPage, pageDetails } = guildBookPage(this.client, page);
		const numOfPages = Math.ceil(this.client.cache.data.guilds.size / serversPerPage);

		const components = [
			new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
				new ButtonBuilder()
					.setLabel('First Page')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(chosenPage === 1)
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'first',
							id: interaction.member.user.id,
							page: chosenPage
						})
					),
				new ButtonBuilder()
					.setLabel('Left')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji({ name: '⬅' })
					.setDisabled(chosenPage === 1)
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'left',
							id: interaction.member.user.id,
							page: chosenPage
						})
					),
				new ButtonBuilder()
					.setLabel('Right')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji({ name: '➡' })
					.setDisabled(chosenPage === numOfPages)
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'right',
							id: interaction.member.user.id,
							page: chosenPage
						})
					),
				new ButtonBuilder()
					.setLabel('Last Page')
					.setStyle(ButtonStyle.Secondary)
					.setDisabled(chosenPage === numOfPages)
					.setCustomId(
						buildCustomId({
							command: this.name,
							action: 'last',
							id: interaction.member.user.id,
							page: chosenPage
						})
					)
			)
		].map((row) => row.toJSON());
		const embed = new EmbedBuilder()
			.setTitle(`Server List [${this.client.cache.data.guilds.size}] - Page ${chosenPage}`)
			.setColor(randomColor)
			.setThumbnail(avatarUrl(this.client.user as APIUser))
			.setDescription(pageDetails)
			.setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });

		await this.client.api.interactions.reply(res, { embeds: [embed.toJSON()], components });
	}

	public override data() {
		return {
			command: {
				name: this.name,
				description: this.description,
				options: [
					{
						name: 'page',
						description: 'The page number to view.',
						type: ApplicationCommandOptionType.Integer,
						required: false
					}
				]
			} satisfies RESTPostAPIApplicationCommandsJSONBody,
			guildIds: [GuildId.sirhStuff]
		};
	}

	public override async componentRun(
		reply: FastifyReply,
		interaction: APIMessageComponentButtonInteraction,
		data: ParsedCustomIdData<'left' | 'right' | 'first' | 'last', ServerListCustomIdData>
	) {
		const userId = interaction.member?.user.id as string;
		let { page } = data;
		const numOfPages = Math.ceil(this.client.cache.data.guilds.size / serversPerPage);

		if (data.action == 'left') page--;
		else if (data.action == 'right') page++;
		else if (data.action == 'first') page = 1;
		else page = numOfPages;

		const { chosenPage, pageDetails } = guildBookPage(this.client, page);

		const components = [
			new ActionRowBuilder<MessageActionRowComponentBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setLabel('First Page')
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(chosenPage === 1)
						.setCustomId(
							buildCustomId({
								command: 'serverlist',
								action: 'first',
								id: userId,
								page
							})
						),
					new ButtonBuilder()
						.setLabel('Left')
						.setStyle(ButtonStyle.Secondary)
						.setEmoji({ name: '⬅' })
						.setDisabled(chosenPage === 1)
						.setCustomId(
							buildCustomId({
								command: 'serverlist',
								action: 'left',
								id: userId,
								page
							})
						),
					new ButtonBuilder()
						.setLabel('Right')
						.setStyle(ButtonStyle.Secondary)
						.setEmoji({ name: '➡' })
						.setDisabled(chosenPage === numOfPages)
						.setCustomId(
							buildCustomId({
								command: 'serverlist',
								action: 'right',
								id: userId,
								page
							})
						),
					new ButtonBuilder()
						.setLabel('Last Page')
						.setStyle(ButtonStyle.Secondary)
						.setDisabled(chosenPage === numOfPages)
						.setCustomId(
							buildCustomId({
								command: 'serverlist',
								action: 'last',
								id: userId,
								page
							})
						)
				)
				.toJSON()
		];
		const embed = new EmbedBuilder()
			.setTitle(`Server List [${this.client.cache.data.guilds.size}] - Page ${chosenPage}`)
			.setColor(randomColor)
			.setThumbnail(avatarUrl(this.client.user))
			.setDescription(pageDetails)
			.setFooter({ text: `Page ${chosenPage} out of ${numOfPages}` });
		await this.client.api.interactions.updateMessage(reply, { embeds: [embed.toJSON()], components });
	}
}

interface ServerListCustomIdData extends CustomIdData {
	page: number;
}
