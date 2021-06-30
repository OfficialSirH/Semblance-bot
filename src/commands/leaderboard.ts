import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';
import { Leaderboard } from '@semblance/models';

module.exports = {
	description: "Get a list of the top voters of the month.",
	category: 'semblance',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let leaderboard = client.voteLeaderboard.toString();
	if (!leaderboard) leaderboard = "No one has voted for Semblance :( (or the leaderboard just didn't update)";
	let embed = new MessageEmbed()
		.setTitle("Voting Leaderboard")
		.setThumbnail(client.user.displayAvatarURL())
		.setColor(randomColor)
		.setDescription(leaderboard)
		.setFooter("Vote for Semblance on the listed sites in the vote command");
	message.channel.send({ embeds: [embed] });
};