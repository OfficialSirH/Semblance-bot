import { Category, randomColor, SubCategory } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';

export default class Feedback extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'feedback',
			description: 'Provide feedback to the developers of C2S with the given email.',
			fullCategory: [Category.game, SubCategory.other]
		});
	}

	public override templateRun() {
		const feedbackImage = 'https://i.imgur.com/lKQh5zW.png';
		const embed = new EmbedBuilder()
			.setTitle('Feedback')

			.setColor(randomColor)
			.setDescription("Give feedback for ComputerLunch's game, C2S.")
			.setImage(feedbackImage);
		return { embeds: [embed.toJSON()] };
	}
}
