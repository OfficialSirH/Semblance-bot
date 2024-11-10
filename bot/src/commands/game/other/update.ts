import { Category, randomColor, SubCategory, attachments } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class Update extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'update',
			description: 'Get info on the latest Steam and Mobile updates.',
			fullCategory: [Category.game, SubCategory.other]
		});
	}

	public override async templateRun() {
		const infoHandler = await this.client.db.information.findUnique({ where: { type: 'update' } });
		if (!infoHandler) return { content: 'No update info found.' };
		const embed = new EmbedBuilder()
			.setTitle('Steam and Mobile Updates')
			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setDescription(infoHandler.value);
		return { embeds: [embed.toJSON()], files: [attachments.currentLogo] };
	}
}
