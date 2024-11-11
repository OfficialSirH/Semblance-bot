import { attachments, Category, randomColor, SubCategory } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';

export default class TerminusChamber extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'terminuschamber',
			description: 'Details on how to obtain each node within the Terminus Chamber',
			fullCategory: [Category.game, SubCategory.main]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle('Terminus Chamber')
			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setImage(attachments.terminusChamber.url)
			.setDescription(
				[
					'**Yellow Cube** - ||Explore the Mesozoic Valley||',
					'**Purple Cube** - ||Unlock Singularity for the first time||',
					'**Light Pink Cube** - ||Unlock the human brain||',
					'**Light Blue Cube** - ||Obtain/Evolve Neoaves||',
					'**Blue Cube** - ||Unlock Cetaceans||',
					'**Lime Green Cube** - ||Unlock Crocodilians||',
					'**Orange Cube** - ||Unlock Feliforms||',
					'**Red Cube** - ||Terraform Mars||'
				].join('\n')
			);
		return {
			embeds: [embed.toJSON()],
			files: [attachments.currentLogo, attachments.terminusChamber]
		};
	}
}
