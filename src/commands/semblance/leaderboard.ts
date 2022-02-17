import { Embed } from 'discord.js';
import type { Message } from 'discord.js';
import { randomColor } from '#constants/index';
import type { SapphireClient } from '@sapphire/framework';
import { Command } from '@sapphire/framework';
import { LeaderboardUtilities } from '#src/structures/LeaderboardUtilities';

export default {
  description: 'Get a list of the top voters of the month.',
  category: 'semblance',
  permissionRequired: 0,
  checkArgs: () => true,
  run: (client, message) => run(client, message),
} as Command<'semblance'>;

const run = async (client: SapphireClient, message: Message) => {
  let leaderboard = await LeaderboardUtilities.topTwenty(client, 'vote');
  if (!leaderboard) leaderboard = "No one has voted for Semblance :( (or the leaderboard just didn't update)";
  const embed = new Embed()
    .setTitle('Voting Leaderboard')
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(randomColor)
    .setDescription(leaderboard)
    .setFooter({ text: 'Vote for Semblance on the listed sites in the vote command' });
  message.channel.send({ embeds: [embed] });
};
