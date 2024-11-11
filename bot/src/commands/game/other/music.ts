import { attachments, Category, randomColor, SubCategory } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';

export default class Music extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'music',
			description: 'Provides the links to the in-game music on the Fandom wiki and on Spotify.',
			fullCategory: [Category.game, SubCategory.other]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle('Music')
			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setDescription(
				[
					"Here's a couple links for the in-game music.",
					'[Fandom Wiki](https://cell-to-singularity-evolution.fandom.com/wiki/music)',
					'[Spotify Link](https://open.spotify.com/playlist/6XcJkgtRFpKwoxKleKIOOp?si=uR4gzciYQtKiXGPwY47v6w)'
				].join('\n')
			);
		return { embeds: [embed.toJSON()], files: [attachments.currentLogo] };
	}
}
