import { attachments, Category, emojis, randomColor, SubCategory } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';

export default class Dinos extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'dinos',
			description: 'Info on the Mesozoic Valley',
			fullCategory: [Category.game, SubCategory.mesozoic]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle(`${emojis.trexSkull} Mesozoic Valley`)
			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setDescription(
				[
					'The Mesozoic Valley is a separate simulation that consists of dinosaurs, which provides insight for Semblance on what the demise of the human species could be',
					[
						'**Location:**\nlook to the right side of the tetrapods in the evolution tree, the Mesozoic Valley should be right next to egg shells and it should look like a rock,',
						"unless you already opened it and it's a skull instead, which you can also find it located at the top right with a skull button.",
						"Also, the more you rank up in Mesozoic Valley, the better of a boost you'll gain in the main simulation"
					].join(' ')
				].join('\n\n')
			);
		return { embeds: [embed.toJSON()], files: [attachments.currentLogo] };
	}
}
