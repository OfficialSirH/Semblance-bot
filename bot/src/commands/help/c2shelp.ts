import { buildCustomId } from '#lib/utilities/components';
import { Category, randomColor, SubCategory, subcategoryList } from '#lib/utilities/index';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, type MessageActionRowComponentBuilder } from '@discordjs/builders';
import { type APIChatInputApplicationCommandGuildInteraction, ButtonStyle } from '@discordjs/core';

export default class C2sHelp extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'c2shelp',
			description: 'List of all Cell to Singularity related commands',
			fullCategory: [Category.help]
		});
	}

	public override templateRun(interaction: APIChatInputApplicationCommandGuildInteraction) {
		const { user } = interaction.member;

		const mainCommands = subcategoryList(this.client, Category.game, SubCategory.main);
		const mesozoicCommands = subcategoryList(this.client, Category.game, SubCategory.mesozoic);
		const otherCommands = subcategoryList(this.client, Category.game, SubCategory.other);
		const components = [
			new ActionRowBuilder<MessageActionRowComponentBuilder>()
				.addComponents(
					new ButtonBuilder()
						.setCustomId(
							buildCustomId({
								command: 'help',
								action: 'metabits',
								id: user.id
							})
						)
						.setLabel('Metabits Guide')
						.setStyle(ButtonStyle.Primary),
					new ButtonBuilder()
						.setCustomId(
							buildCustomId({
								command: 'help',
								action: 'mesoguide',
								id: user.id
							})
						)
						.setLabel('Mesozoic Valley Guide')
						.setStyle(ButtonStyle.Primary)
				)
				.toJSON()
		];
		const embed = new EmbedBuilder()
			.setTitle('**-> Cell to Singularity Commands**')
			.setColor(randomColor)
			.addFields(
				{ name: 'Main Simulation', value: mainCommands, inline: true },
				{ name: 'Mesozoic Valley', value: mesozoicCommands, inline: true },
				{ name: '\u200b', value: '\u200b' },
				{ name: 'Other/Extras', value: otherCommands, inline: true }
			)
			.setFooter({ text: 'C2S for the win!' });
		return { embeds: [embed.toJSON()], components };
	}
}
