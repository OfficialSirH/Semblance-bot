import { attachments, Category, randomColor, SubCategory } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';

export default class Simstats extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'simstats',
			description: 'guide for finding the simulation stats page in-game',
			fullCategory: [Category.game, SubCategory.main]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle('Simulation Statistics')
			.setThumbnail(attachments.currentLogo.url)
			.setColor(randomColor)
			.setImage(attachments.simStatsLocation.url)
			.setDescription(
				'Clicking your currency(Image 1) will open the Semblance/Reality Engine, which looking towards the left side of the engine will have a sliding button(Image 2) that will show your game stats.'
			);
		return {
			embeds: [embed.toJSON()],
			files: [attachments.currentLogo, attachments.simStatsLocation]
		};
	}
}
