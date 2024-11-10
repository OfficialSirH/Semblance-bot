import { Category, randomColor, SubCategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class Mvunlocks extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'mvunlocks',
			description: 'Information about the unlocking of each reptile and bird',
			fullCategory: [Category.game, SubCategory.mesozoic]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle('Reptiles and Birds')

			.setThumbnail(attachments.currentLogo.url)
			.setColor(randomColor)
			.setDescription(
				`The following generators are unlocked by achieving the following ranks in the Mesozoic Valley\n${[
					'Rank 3 - [Turtle](https://cell-to-singularity-evolution.fandom.com/wiki/Turtle)',
					'Rank 6 - [Crocodilia](https://cell-to-singularity-evolution.fandom.com/wiki/Crocodilia)',
					'Rank 10 - [Lizard](https://cell-to-singularity-evolution.fandom.com/wiki/Lizard)',
					'Rank 15 - [Snake](https://cell-to-singularity-evolution.fandom.com/wiki/Snake)',
					'Rank 23 - [Galliformes](https://cell-to-singularity-evolution.fandom.com/wiki/Galliformes)',
					'Rank 28 - [Anseriformes](https://cell-to-singularity-evolution.fandom.com/wiki/Anseriformes)',
					'Rank 33 - [Paleognathae](https://cell-to-singularity-evolution.fandom.com/wiki/Paleognathae)',
					'Rank 38 - [Neoaves](https://cell-to-singularity-evolution.fandom.com/wiki/Neoaves)'
				]
					.map((t) => `**${t}**`)
					.join('\n')}`
			);
		return { embeds: [embed.toJSON()], files: [attachments.currentLogo] };
	}
}
