import type { QueriedInfoBuilder } from '#lib/interfaces/Semblance';
import { randomColor } from '#constants/index';
import { MessageEmbed } from 'discord.js';

export const build: QueriedInfoBuilder = (_, client) => {
  let leaderboard = client.voteLeaderboard.toString();
  if (!leaderboard) leaderboard = "No one has voted for Semblance :( (or the leaderboard just didn't update)";
  const embed = new MessageEmbed()
    .setTitle('Voting Leaderboard')
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(leaderboard)
    .setFooter('Vote for Semblance on the listed sites in the vote command');
  return { embeds: [embed] };
};
