import { Category, randomColor, SubCategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class PrestigeList extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'prestigelist',
			description: 'A list of the Mesozoic Valley Prestige ranks.',
			fullCategory: [Category.game, SubCategory.mesozoic]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle('Mesozoic Valley Prestige List')

			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setImage(attachments.prestigeList.url)
			.setFooter({ text: 'Thanks to Hardik for this lovely list of Prestige :D' });
		return {
			embeds: [embed.toJSON()],
			files: [attachments.currentLogo, attachments.prestigeList]
		};
	}
}
