import { attachments, Category, randomColor, SubCategory } from '#lib/utilities/index';
import { EmbedBuilder } from '@discordjs/builders';

export default class Beta extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'beta',
			description: 'Get info on the latest beta.',
			fullCategory: [Category.game, SubCategory.other]
		});
	}

	public override async templateRun() {
		const infoHandler = await this.container.prisma.information.findUnique({ where: { type: 'beta' } });
		if (!infoHandler) return { content: 'No beta info found.' };
		const embed = new EmbedBuilder()
			.setTitle('Beta')
			.setColor(randomColor)
			.setThumbnail(attachments.currentLogo.url)
			.setDescription(infoHandler.value)
			.setFooter({ text: 'New stuff do be epicc' });
		return { embeds: [embed.toJSON()], files: [attachments.currentLogo] };
	}
}
