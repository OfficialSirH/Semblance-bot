import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { LeaderboardUtilities } from '#src/structures/LeaderboardUtilities';

export default class Voteleaderboard extends InfoBuilder {
  public override name = 'voteleaderboard';

  public constructor(context: InfoBuilder['Context']) {
    super(context);
  }

  public override async build() {
    let leaderboard = await LeaderboardUtilities.topTwenty(this.container.client, 'vote');
    if (!leaderboard) leaderboard = "No one has voted for Semblance :( (or the leaderboard just didn't update)";
    const embed = new Embed()
      .setTitle('Voting Leaderboard')
      .setThumbnail(this.container.client.user.displayAvatarURL())
      .setColor(randomColor)
      .setDescription(leaderboard)
      .setFooter({ text: 'Vote for Semblance on the listed sites in the vote command' });
    return { embeds: [embed] };
  }
}
