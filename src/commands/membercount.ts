import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import { Semblance } from '../structures';

module.exports = {
	description: "Provides the number of members in the server.",
	category: 'server',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let guild = await message.guild.fetch();
	let embed = new MessageEmbed()
	.setTitle("Members")
	.setColor(randomColor)
	.setDescription(guild.approximateMemberCount.toString())
	.setFooter(`Called upon by ${message.author.tag}`);
	message.channel.send({ embeds: [embed] });
}