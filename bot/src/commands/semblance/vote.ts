import { Category, avatarUrl, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { EmbedBuilder } from '@discordjs/builders';

export default class Vote extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'vote',
			description: 'Lists websites where you can vote for Semblance.',
			fullCategory: [Category.semblance]
		});
	}

	public override templateRun() {
		const embed = new EmbedBuilder()
			.setTitle('Vote')
			.setColor(randomColor)
			.setThumbnail(avatarUrl(this.client.user))
			.setDescription(
				[
					'**Rewardable voting sites**',
					`[Top.gg](https://top.gg/bot/${this.client.user.id})`,
					'[Discordbotlist.com](https://discordbotlist.com/bots/semblance)',
					'**Unvotable sites**',
					`[Discord.bots.gg](https://discord.bots.gg/bots/${this.client.user.id})`
				].join('\n')
			); // Old Semblance Id: 668688939888148480

		return { embeds: [embed.toJSON()] };
	}
}
