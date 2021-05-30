import { Message, MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config'; 
import { Semblance } from '../structures';
const { prefix } = config;

module.exports = {
	description: "Gives a list of all available admin commands.",
	category: 'help',
	usage: {
		"": ""
	},
	permissionRequired: 1,
	checkArgs: (args: string[]) => args.length >= 0
}

module.exports.run = async (client: Semblance, message: Message, args: string[]) => {
	const adminCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'admin').map(key => `**\`${prefix}${key}\`**`)
	let embed = new MessageEmbed()
		.setColor(randomColor)
		.setTitle("**-> Admin Commands**")
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription(adminCommands.join(', '));
	message.channel.send(embed);
}