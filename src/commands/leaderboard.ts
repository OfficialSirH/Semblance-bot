import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';
import { Information } from '@semblance/models';

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
	const leaderboard = await Information.findOne({ infoType: 'voteleaderboard' });
	let embed = new MessageEmbed()
		.setTitle("Voting Leaderboard")
		.setThumbnail(client.user.displayAvatarURL())
		.setColor(randomColor)
		.setDescription(leaderboard.info)
		.setFooter("Vote for Semblance on the listed sites in the vote command\n(Updates every minute)");
	message.channel.send(embed);
};