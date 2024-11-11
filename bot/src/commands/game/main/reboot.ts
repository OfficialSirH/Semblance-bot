import { attachments, Category, randomColor, SubCategory } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';

export default class Reboot extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'reboot',
			description: 'info on rebooting your in-game simulation',
			fullCategory: [Category.game, SubCategory.main]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle('Reboot')
			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setDescription(
				'**Reboot\'s location:** You can find the "Simulation Reboot" by  clicking on the (metabit) bar under your currency (entropy/ideas).\n' +
					'**The importance of rebooting your simulation:** you gain metabits from your simulation, which in order to use them and unlock their potential you need to reboot your simulation. ' +
					'rebooting also offers a lot of speed boost and rewards'
			);
		return { embeds: [embed.toJSON()], files: [attachments.currentLogo] };
	}
}
