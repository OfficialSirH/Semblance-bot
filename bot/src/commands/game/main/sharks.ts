import { attachments, Category, randomColor, SubCategory } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';

export default class Sharks extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'sharks',
			description: 'info on sharks',
			fullCategory: [Category.game, SubCategory.main]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle('Sharks')
			.setColor(randomColor)
			.setImage(attachments.sharks.url)
			.setThumbnail(attachments.currentLogo.url)
			.setDescription(
				'There are six sharks within the game that can be unlocked within the daily rewards individually every 14 days, which takes 84 days to unlock all of them, which will give you the achievement, "Shark Week".\n They\'re unlocked in this order: \n' +
					'1. Leopard Shark \n 2. Whale Shark \n 3. Tiger Shark \n 4. Great White \n 5. Hammerhead \n 6. **MEGALODON!!**'
			);
		return { embeds: [embed.toJSON()], files: [attachments.currentLogo, attachments.sharks] };
	}
}
