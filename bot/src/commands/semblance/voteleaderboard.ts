import { EmbedBuilder } from 'discord.js';
import { Category, randomColor } from '#constants/index';
import { Command } from '@sapphire/framework';
import { LeaderboardUtilities } from '#structures/LeaderboardUtilities';

export default class VoteLeaderboard extends Command {
  public override name = 'voteleaderboard';
  public override description = 'Gets the top 20 users who voted for the bot.';
  public override fullCategory = [Category.semblance];

  public override async sharedRun() {
    let leaderboard = await LeaderboardUtilities.topTwenty(this.container.client, 'vote');
    if (!leaderboard)
      leaderboard = "No one has voted for Semblance :( (or the leaderboard just isn't working properly at the moment)";
    const embed = new EmbedBuilder()
      .setTitle('Voting Leaderboard')
      .setThumbnail(this.container.client.user?.displayAvatarURL() as string)
      .setColor(randomColor)
      .setDescription(leaderboard)
      .setFooter({ text: 'Vote for Semblance on the listed sites in the vote command' });
    return { embeds: [embed] };
  }
}
