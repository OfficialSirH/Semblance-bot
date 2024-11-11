import type { ParsedCustomIdData } from '#lib/types/Semblance';
import { buildCustomId, filterAction } from '#lib/utilities/components';
import { Category, avatarUrl, randomColor } from '#lib/utilities/index';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, type MessageActionRowComponentBuilder } from '@discordjs/builders';
import { ButtonStyle, type APIChatInputApplicationCommandGuildInteraction, type APIMessageComponentButtonInteraction } from '@discordjs/core';
import type { FastifyReply } from 'fastify';

export default class Credits extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'credits',
			description: 'Lists everyone that has helped with the project of Semblance, including myself(SirH).',
			fullCategory: [Category.semblance]
		});
	}

	public override async chatInputRun(res: FastifyReply, interaction: APIChatInputApplicationCommandGuildInteraction) {
		const { user } = interaction.member;

		const embed = new EmbedBuilder()
			.setTitle('Credits')
			.setColor(randomColor)
			.addFields(
				{ name: 'Developer', value: 'SirH' },
				{ name: 'Special Thanks and Organizer', value: 'Aditya' },
				{
					name: 'Artist',
					value: [
						'**Semblance:** cabiie',
						"**Semblance Beta:** Lemon ([Lemon's Instagram page](https://www.instagram.com/creations_without_limtation/))"
					].join('\n')
				},
				{ name: 'Early Testers', value: 'Aditya, Parrot, Diza, 0NrD, and Aure' },
				{
					name: 'Contributors',
					value: [
						'**Mesozoic Valley and Singularity Speedrun Guide:** Jojoseis',
						'**Image for Prestige List:** Hardik Chavada',
						'**Image for Nanobots:** SampeDrako',
						'**Image for Currency:** Off Pringles',
						'**Darwin bust statue and all Civilization Garden secrets explanations**: QuarterPL(quarterpl)'
					].join('\n')
				}
			);

		const component = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(buildCustomId({ command: 'credits', action: 'thanks', id: user.id }))
				.setLabel('Special Thanks')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId(buildCustomId({ command: 'credits', action: 'semblance', id: user.id }))
				.setLabel('Preview Semblance Art')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId(buildCustomId({ command: 'credits', action: 'semblance-beta', id: user.id }))
				.setLabel('Preview Semblance Beta Art')
				.setStyle(ButtonStyle.Primary)
		);

		await interaction.reply(res, { embeds: [embed.toJSON()], components: [component.toJSON()] });
	}

	public override data() {
		return {
			command: { name: this.name, description: this.description }
		};
	}

	public override async componentRun(
		reply: FastifyReply,
		interaction: APIMessageComponentButtonInteraction,
		data: ParsedCustomIdData<'credits' | 'thanks' | 'semblance' | 'semblance-beta'>
	) {
		const embed = new EmbedBuilder();
		const creditComponents = [
			new ButtonBuilder()
				.setCustomId(
					buildCustomId({
						command: this.name,
						action: 'credits',
						id: interaction.member?.user.id as string
					})
				)
				.setLabel('Credits')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId(
					buildCustomId({
						command: this.name,
						action: 'thanks',
						id: interaction.member?.user.id as string
					})
				)
				.setLabel('Special Thanks')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId(
					buildCustomId({
						command: this.name,
						action: 'semblance',
						id: interaction.member?.user.id as string
					})
				)
				.setLabel('Preview Semblance Art')
				.setStyle(ButtonStyle.Primary),
			new ButtonBuilder()
				.setCustomId(
					buildCustomId({
						command: this.name,
						action: 'semblancebeta',
						id: interaction.member?.user.id as string
					})
				)
				.setLabel('Preview Semblance Beta Art')
				.setStyle(ButtonStyle.Primary)
		];

		switch (data.action) {
			case 'credits':
				embed.setTitle('Credits').addFields(
					{ name: 'Developer', value: 'SirH' },
					{ name: 'Special Thanks and Organizer', value: 'Aditya' },
					{
						name: 'Artist',
						value: [
							'**Semblance:** cabiie',
							"**Semblance Beta:** Lemon ([Lemon's Instagram page](https://www.instagram.com/creations_without_limtation/))"
						].join('\n')
					},
					{ name: 'Silly dude who makes up funny ideas', value: 'NerdGamer2848' },
					{ name: 'Early Testers', value: 'Aditya, Parrot, Diza, 0NrD, and Aure' },
					{
						name: 'Contributors',
						value: [
							'**Mesozoic Valley Guide:** Jojoseis',
							'**Image for Prestige List:** Hardik Chavada',
							'**Image for Nanobots:** SampeDrako',
							'**Image for Currency:** Off Pringles'
						].join('\n')
					}
				);
				break;
			case 'thanks':
				embed
					.setTitle('Special Thanks')
					.setDescription(
						'Special Thanks to Aditya for motivating me from the very beginning to work on this bot. ' +
							"If it weren't for him, my bot wouldn't even be at this point right now; running on an actual server, " +
							'built with a better Discord module than previously, and have this many features. He even convinced Hype ' +
							"to add my bot to Cell to Singularity, which I can't thank him enough for, cause I was too shy to ask Hype. " +
							"Thanks again, Aditya, you've helped me a lot. :D"
					);
				break;
			case 'semblance':
				// todo: assure that only the main bot is shown in this embed
				embed.setTitle('Semblance - by cabiie').setImage(`${avatarUrl(this.client.user)}?size=2048`);
				break;
			case 'semblance-beta':
				embed
					.setTitle('Semblance Beta - by Lemon')
					.setImage('https://cdn.discordapp.com/avatars/794049840651960350/b101b9f78fb44d2c0b0c40e53b17e677.png?size=2048');
				break;
			default:
				return;
		}

		const components = filterAction(
			[new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(...creditComponents)],
			data.action
		).map((c) => c.toJSON());
		await this.client.api.interactions.updateMessage(reply, { embeds: [embed.toJSON()], components });
	}
}
