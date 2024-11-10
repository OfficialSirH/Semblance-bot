import { Category, randomColor, SubCategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class JoinBeta extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'joinbeta',
			description: 'Info on how to become a beta tester',
			fullCategory: [Category.game, SubCategory.other]
		});
	}

	public override async templateRun() {
		const infoHandler = await this.client.db.information.findUnique({ where: { type: 'joinbeta' } });
		if (!infoHandler) return { content: 'No join beta info found.' };
		const embed = new EmbedBuilder()
			.setTitle('Steps to join beta')
			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setDescription(infoHandler.value);
		return { embeds: [embed.toJSON()], files: [attachments.currentLogo] };
	}
}
