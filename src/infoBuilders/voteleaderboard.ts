import { InfoBuilder } from '#src/structures/pieces/InfoBuilder';
import { randomColor } from '#constants/index';
import { Embed } from 'discord.js';
import { LeaderboardUtilities } from '#src/structures/LeaderboardUtilities';

export const build: QueriedInfoBuilder = async (_, client) => {
  let leaderboard = await LeaderboardUtilities.topTwenty(client, 'vote');
  if (!leaderboard) leaderboard = "No one has voted for Semblance :( (or the leaderboard just didn't update)";
  const embed = new Embed()
    .setTitle('Voting Leaderboard')
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(leaderboard)
    .setFooter({ text: 'Vote for Semblance on the listed sites in the vote command' });
  return { embeds: [embed] };
};
