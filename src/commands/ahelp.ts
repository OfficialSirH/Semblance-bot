import type { Message } from 'discord.js';
import type { Semblance } from '../structures';
import { MessageEmbed } from 'discord.js';
import { randomColor } from '@semblance/constants';
import config from '@semblance/config'; 
import { Command } from '@semblance/lib/interfaces/Semblance';
const { prefix } = config;

export default {
	description: "Gives a list of all available admin commands.",
	category: 'help',
	permissionRequired: 1,
	checkArgs: () => true,
	run: (client, message) => run(client, message)
} as Command<'help'>;

const run = async (client: Semblance, message: Message) => {
	const adminCommands = Object.keys(client.commands).filter(key => client.commands[key].category == 'admin').map(key => `**\`${prefix}${key}\`**`)
	let embed = new MessageEmbed()
		.setColor(randomColor)
		.setTitle("**-> Admin Commands**")
		.setThumbnail(client.user.displayAvatarURL())
		.setDescription(adminCommands.join(', '));
	message.channel.send({ embeds: [embed] });
}