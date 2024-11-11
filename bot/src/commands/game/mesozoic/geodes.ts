import { Category, SubCategory, attachments } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';

export default class Geodes extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'geodes',
			description: 'Get geode comparisons to show the best value.',
			fullCategory: [Category.game, SubCategory.mesozoic]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle('Geodes Comparison')

			.setThumbnail(attachments.currentLogo.url)
			.setImage(attachments.geodeLevelComparison.url)
			.setDescription(
				'The top row of the image represents the rewards from each geode at rank 50, ' +
					'while the bottom row represents the geode rewards at rank 4, ' +
					"which rank 4 is shown instead of 1 because the diamond geode isn't unlocked until rank 4. " +
					"By the shown results within this image, it's highly recommended to get geodes at rank 50 for the greatest rewards for the same price as rank 4."
			)
			.setFooter({ text: 'Diamond Geodes for da win!' });
		return {
			embeds: [embed.toJSON()],
			files: [attachments.currentLogo, attachments.geodeLevelComparison]
		};
	}
}
