import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config';
import { Semblance } from '../structures';
const { patreon } = config;

module.exports = {
	description: "Provides the link to SirH's Patreon page.",
	category: 'semblance',
	usage: {
		"": ""
	},
	permissionRequired: 0,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	let embed = new MessageEmbed()
		.setTitle("My Patreon")
		.setURL("https://www.patreon.com/SirHDeveloper")
		.setColor(randomColor)
		.setThumbnail(patreon.name);
	message.channel.send({ embeds: [embed], files: [patreon] });
}