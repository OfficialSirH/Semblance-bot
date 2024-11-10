import { Category, avatarUrl, randomColor } from '#constants/index';
import { Command } from '#structures/Command';
import { LeaderboardUtilities } from '#structures/LeaderboardUtilities';
import { EmbedBuilder } from '@discordjs/builders';

export default class VoteLeaderboard extends Command {
	public constructor(client: Command.Requirement) {
		super(client, {
			name: 'voteleaderboard',
			description: 'Gets the top 20 users who voted for the bot.',
			fullCategory: [Category.semblance]
		});
	}

	public override async templateRun() {
		let leaderboard = await LeaderboardUtilities.topTwenty(this.client, 'vote');
		if (!leaderboard) leaderboard = "No one has voted for Semblance :( (or the leaderboard just isn't working properly at the moment)";
		const embed = new EmbedBuilder()
			.setTitle('Voting Leaderboard')
			.setThumbnail(avatarUrl(this.client.user))
			.setColor(randomColor)
			.setDescription(leaderboard)
			.setFooter({ text: 'Vote for Semblance on the listed sites in the vote command' });
		return { embeds: [embed.toJSON()] };
	}
}
